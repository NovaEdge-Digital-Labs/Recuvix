import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { calendarBulkCreateSchema } from "@/lib/validators/calendarSchemas";

export async function POST(req: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const validation = calendarBulkCreateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: "Validation failed", details: validation.error.format() }, { status: 400 });
        }

        const { entries, workspaceId } = validation.data;

        const entriesToInsert = entries.map(entry => {
            const e: any = {
                ...entry,
                user_id: user.id,
                workspace_id: workspaceId || entry.workspaceId || null,
            };

            // Map camelCase to snake_case
            if (entry.focusKeyword !== undefined) { e.focus_keyword = entry.focusKeyword; delete e.focusKeyword; }
            if (entry.secondaryKeywords !== undefined) { e.secondary_keywords = entry.secondaryKeywords; delete e.secondaryKeywords; }
            if (entry.targetTone !== undefined) { e.target_tone = entry.targetTone; delete e.targetTone; }
            if (entry.targetWordCount !== undefined) { e.target_word_count = entry.targetWordCount; delete e.targetWordCount; }
            if (entry.scheduledDate !== undefined) { e.scheduled_date = entry.scheduledDate; delete e.scheduledDate; }
            if (entry.scheduledTime !== undefined) { e.scheduled_time = entry.scheduledTime; delete e.scheduledTime; }
            if (entry.contentType !== undefined) { e.content_type = entry.contentType; delete e.contentType; }
            if (entry.assignedTo !== undefined) { e.assigned_to = entry.assignedTo; delete e.assignedTo; }
            if (entry.researchHistoryId !== undefined) { e.research_history_id = entry.researchHistoryId; delete e.researchHistoryId; }
            if (entry.isAiSuggested !== undefined) { e.is_ai_suggested = entry.isAiSuggested; delete e.isAiSuggested; }
            if (entry.aiSuggestionReason !== undefined) { e.ai_suggestion_reason = entry.aiSuggestionReason; delete e.aiSuggestionReason; }
            if (entry.estimatedSearchVolume !== undefined) { e.estimated_search_volume = entry.estimatedSearchVolume; delete e.estimatedSearchVolume; }
            if (entry.estimatedDifficulty !== undefined) { e.estimated_difficulty = entry.estimatedDifficulty; delete e.estimatedDifficulty; }
            if (entry.seasonalityNote !== undefined) { e.seasonality_note = entry.seasonalityNote; delete e.seasonalityNote; }
            if (entry.trendContext !== undefined) { e.trend_context = entry.trendContext; delete e.trendContext; }

            // Remove any other camelCase fields just in case
            delete e.workspaceId;

            return e;
        });

        const { data, error } = await (supabase
            .from('calendar_entries') as any)
            .insert(entriesToInsert)
            .select();

        if (error) throw error;

        return NextResponse.json(data);

    } catch (error: any) {
        console.error("Calendar Bulk Create API Error:", error);
        return NextResponse.json({ error: error.message || "Failed to bulk create entries" }, { status: 500 });
    }
}
