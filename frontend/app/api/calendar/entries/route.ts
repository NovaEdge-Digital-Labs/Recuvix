import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { calendarEntrySchema } from "@/lib/validators/calendarSchemas";
import { z } from "zod";

const querySchema = z.object({
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    workspaceId: z.string().uuid().optional(),
    status: z.string().optional(),
    country: z.string().optional(),
});

export async function GET(req: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const query = querySchema.safeParse(Object.fromEntries(searchParams.entries()));

        if (!query.success) {
            return NextResponse.json({ error: "Invalid query parameters", details: query.error.format() }, { status: 400 });
        }

        const { startDate, endDate, workspaceId, status, country } = query.data;

        // Auto-mark missed entries
        await (supabase as any).rpc('mark_missed_entries', { p_user_id: user.id });

        // Fetch entries
        let dbQuery = (supabase
            .from('calendar_entries') as any)
            .select('*')
            .gte('scheduled_date', startDate)
            .lte('scheduled_date', endDate)
            .eq('user_id', user.id);

        if (workspaceId) {
            dbQuery = dbQuery.eq('workspace_id', workspaceId);
        } else {
            dbQuery = dbQuery.is('workspace_id', null);
        }

        if (status) {
            dbQuery = dbQuery.eq('status', status);
        }

        if (country) {
            dbQuery = dbQuery.eq('country', country);
        }

        const { data: entries, error: entriesError } = await dbQuery.order('scheduled_date', { ascending: true });

        if (entriesError) throw entriesError;

        // Fetch stats
        const year = new Date(startDate).getFullYear();
        const month = new Date(startDate).getMonth() + 1; // Basic logic, refinement might be needed if date range spans months
        const { data: stats, error: statsError } = await (supabase as any).rpc('get_calendar_month_stats', {
            p_user_id: user.id,
            p_year: year,
            p_month: month,
            p_workspace_id: workspaceId || null
        });

        if (statsError) throw statsError;

        return NextResponse.json({
            entries,
            stats
        });

    } catch (error: any) {
        console.error("Calendar GET API Error:", error);
        return NextResponse.json({ error: error.message || "Failed to fetch entries" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const validation = calendarEntrySchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: "Validation failed", details: validation.error.format() }, { status: 400 });
        }

        const entryData = {
            ...validation.data,
            user_id: user.id,
            // Map camelCase to snake_case for DB
            focus_keyword: validation.data.focusKeyword,
            secondary_keywords: validation.data.secondaryKeywords,
            target_tone: validation.data.targetTone,
            target_word_count: validation.data.targetWordCount,
            scheduled_date: validation.data.scheduledDate,
            scheduled_time: validation.data.scheduledTime,
            content_type: validation.data.contentType,
            workspace_id: validation.data.workspaceId,
            assigned_to: validation.data.assignedTo,
            research_history_id: validation.data.researchHistoryId,
            is_ai_suggested: validation.data.isAiSuggested,
            ai_suggestion_reason: validation.data.aiSuggestionReason,
            estimated_search_volume: validation.data.estimatedSearchVolume,
            estimated_difficulty: validation.data.estimatedDifficulty,
            seasonality_note: validation.data.seasonalityNote,
            trend_context: validation.data.trendContext,
        };

        // Remove camelCase fields to avoid DB errors
        delete (entryData as any).focusKeyword;
        delete (entryData as any).secondaryKeywords;
        delete (entryData as any).targetTone;
        delete (entryData as any).targetWordCount;
        delete (entryData as any).scheduledDate;
        delete (entryData as any).scheduledTime;
        delete (entryData as any).contentType;
        delete (entryData as any).workspaceId;
        delete (entryData as any).assignedTo;
        delete (entryData as any).researchHistoryId;
        delete (entryData as any).isAiSuggested;
        delete (entryData as any).aiSuggestionReason;
        delete (entryData as any).estimatedSearchVolume;
        delete (entryData as any).estimatedDifficulty;
        delete (entryData as any).seasonalityNote;
        delete (entryData as any).trendContext;

        const { data, error } = await (supabase
            .from('calendar_entries') as any)
            .insert(entryData)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);

    } catch (error: any) {
        console.error("Calendar POST API Error:", error);
        return NextResponse.json({ error: error.message || "Failed to create entry" }, { status: 500 });
    }
}
