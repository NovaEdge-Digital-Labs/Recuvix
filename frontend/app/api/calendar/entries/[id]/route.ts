import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await await createServerSupabaseClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();

        // Map camelCase to snake_case for DB if present
        const updates: any = { ...body };
        if (body.focusKeyword !== undefined) { updates.focus_keyword = body.focusKeyword; delete updates.focusKeyword; }
        if (body.secondaryKeywords !== undefined) { updates.secondary_keywords = body.secondaryKeywords; delete updates.secondaryKeywords; }
        if (body.targetTone !== undefined) { updates.target_tone = body.targetTone; delete updates.targetTone; }
        if (body.targetWordCount !== undefined) { updates.target_word_count = body.targetWordCount; delete updates.targetWordCount; }
        if (body.scheduledDate !== undefined) { updates.scheduled_date = body.scheduledDate; delete updates.scheduledDate; }
        if (body.scheduledTime !== undefined) { updates.scheduled_time = body.scheduledTime; delete updates.scheduledTime; }
        if (body.contentType !== undefined) { updates.content_type = body.contentType; delete updates.contentType; }
        if (body.workspaceId !== undefined) { updates.workspace_id = body.workspaceId; delete updates.workspaceId; }
        if (body.assignedTo !== undefined) { updates.assigned_to = body.assignedTo; delete updates.assignedTo; }
        if (body.researchHistoryId !== undefined) { updates.research_history_id = body.researchHistoryId; delete updates.researchHistoryId; }
        if (body.isAiSuggested !== undefined) { updates.is_ai_suggested = body.isAiSuggested; delete updates.isAiSuggested; }
        if (body.aiSuggestionReason !== undefined) { updates.ai_suggestion_reason = body.aiSuggestionReason; delete updates.aiSuggestionReason; }
        if (body.estimatedSearchVolume !== undefined) { updates.estimated_search_volume = body.estimatedSearchVolume; delete updates.estimatedSearchVolume; }
        if (body.estimatedDifficulty !== undefined) { updates.estimated_difficulty = body.estimatedDifficulty; delete updates.estimatedDifficulty; }
        if (body.seasonalityNote !== undefined) { updates.seasonality_note = body.seasonalityNote; delete updates.seasonalityNote; }
        if (body.trendContext !== undefined) { updates.trend_context = body.trendContext; delete updates.trendContext; }
        if (body.blogId !== undefined) { updates.blog_id = body.blogId; delete updates.blogId; }
        if (body.publishedUrl !== undefined) { updates.published_url = body.publishedUrl; delete updates.publishedUrl; }

        const { data, error } = await (supabase
            .from('calendar_entries') as any)
            .update(updates)
            .eq('id', id)
            .eq('user_id', user.id) // Ensure ownership
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);

    } catch (error: any) {
        console.error("Calendar PATCH API Error:", error);
        return NextResponse.json({ error: error.message || "Failed to update entry" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await await createServerSupabaseClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const { searchParams } = new URL(req.url);
        const permanent = searchParams.get('permanent') === 'true';

        if (permanent) {
            const { error } = await (supabase
                .from('calendar_entries') as any)
                .delete()
                .eq('id', id)
                .eq('user_id', user.id);
            if (error) throw error;
        } else {
            const { error } = await (supabase
                .from('calendar_entries') as any)
                .update({ status: 'cancelled' })
                .eq('id', id)
                .eq('user_id', user.id);
            if (error) throw error;
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Calendar DELETE API Error:", error);
        return NextResponse.json({ error: error.message || "Failed to delete entry" }, { status: 500 });
    }
}
