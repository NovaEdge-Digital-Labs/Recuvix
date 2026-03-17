import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { calendarSettingsSchema } from "@/lib/validators/calendarSchemas";

export async function GET(req: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data, error } = await supabase
            .from('calendar_settings')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;

        return NextResponse.json(data || {});

    } catch (error: any) {
        console.error("Calendar Settings GET Error:", error);
        return NextResponse.json({ error: error.message || "Failed to fetch settings" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const validation = calendarSettingsSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: "Validation failed", details: validation.error.format() }, { status: 400 });
        }

        const updates: any = {};
        const d = validation.data;
        if (d.defaultCountry !== undefined) updates.default_country = d.defaultCountry;
        if (d.defaultPublishingFrequency !== undefined) updates.default_publishing_frequency = d.defaultPublishingFrequency;
        if (d.targetBlogsPerMonth !== undefined) updates.target_blogs_per_month = d.targetBlogsPerMonth;
        if (d.primaryNiche !== undefined) updates.primary_niche = d.primaryNiche;
        if (d.defaultView !== undefined) updates.default_view = d.defaultView;
        if (d.startDayOfWeek !== undefined) updates.start_day_of_week = d.startDayOfWeek;
        if (d.aiSuggestionsEnabled !== undefined) updates.ai_suggestions_enabled = d.aiSuggestionsEnabled;
        if (d.includeSeasonalTopics !== undefined) updates.include_seasonal_topics = d.includeSeasonalTopics;
        if (d.includeTrendingTopics !== undefined) updates.include_trending_topics = d.includeTrendingTopics;
        if (d.autoFillGaps !== undefined) updates.auto_fill_gaps = d.autoFillGaps;
        if (d.reminderDaysBefore !== undefined) updates.reminder_days_before = d.reminderDaysBefore;

        const { data, error } = await supabase
            .from('calendar_settings')
            .upsert({ ...updates, user_id: user.id })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);

    } catch (error: any) {
        console.error("Calendar Settings PATCH Error:", error);
        return NextResponse.json({ error: error.message || "Failed to update settings" }, { status: 500 });
    }
}
