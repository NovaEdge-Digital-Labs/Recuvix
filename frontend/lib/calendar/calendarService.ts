import { createClient } from '../supabase/client';
import { PostgrestResponse } from '@supabase/supabase-js';

export type CalendarEntryStatus =
    | 'planned'
    | 'scheduled'
    | 'in_progress'
    | 'published'
    | 'missed'
    | 'cancelled';

export type CalendarEntryPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface CalendarEntry {
    id: string;
    user_id: string;
    workspace_id: string | null;
    title: string;
    topic: string;
    focus_keyword: string;
    secondary_keywords: string[];
    country: string;
    target_tone: string | null;
    target_word_count: number | null;
    scheduled_date: string;
    scheduled_time: string | null;
    status: CalendarEntryStatus;
    priority: CalendarEntryPriority;
    content_type: string | null;
    category: string | null;
    tags: string[];
    seasonality_note: string | null;
    trend_context: string | null;
    is_ai_suggested: boolean;
    ai_suggestion_reason: string | null;
    estimated_search_volume: string | null;
    estimated_difficulty: string | null;
    blog_id: string | null;
    published_url: string | null;
    assigned_to: string | null;
    assigned_to_name: string | null;
    notes: string | null;
    research_history_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface CalendarSettings {
    user_id: string;
    workspace_id: string | null;
    default_country: string;
    default_publishing_frequency: string;
    target_blogs_per_month: number;
    primary_niche: string | null;
    default_view: string;
    start_day_of_week: number;
    ai_suggestions_enabled: boolean;
    include_seasonal_topics: boolean;
    include_trending_topics: boolean;
    auto_fill_gaps: boolean;
    reminder_days_before: number;
    created_at: string;
    updated_at: string;
}

export interface MonthStats {
    total: number;
    planned: number;
    scheduled: number;
    published: number;
    missed: number;
    completion_rate: number;
}

class CalendarService {
    async getEntries(params: {
        startDate: string;
        endDate: string;
        workspaceId?: string;
        status?: string;
    }): Promise<CalendarEntry[]> {
        const supabase = createClient();

        // First mark missed entries
        await (supabase.rpc as any)('mark_missed_entries', { p_user_id: (await supabase.auth.getUser()).data.user?.id });

        let query = supabase
            .from('calendar_entries')
            .select('*')
            .gte('scheduled_date', params.startDate)
            .lte('scheduled_date', params.endDate);

        if (params.workspaceId) {
            query = query.eq('workspace_id', params.workspaceId);
        } else {
            query = query.is('workspace_id', null);
        }

        if (params.status) {
            query = query.eq('status', params.status);
        }

        const { data, error } = await query.order('scheduled_date', { ascending: true });

        if (error) throw error;
        return data as CalendarEntry[];
    }

    async getMonthStats(year: number, month: number, workspaceId?: string): Promise<MonthStats> {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error('Not authenticated');

        const { data, error } = await (supabase.rpc as any)('get_calendar_month_stats', {
            p_user_id: user.id,
            p_year: year,
            p_month: month,
            p_workspace_id: workspaceId || null
        });

        if (error) throw error;
        return data as MonthStats;
    }

    async createEntry(entry: Partial<CalendarEntry>): Promise<CalendarEntry> {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await ((supabase
            .from('calendar_entries' as any) as any)
            .insert({ ...entry, user_id: user.id } as any)
            .select()
            .single() as any);

        if (error) throw error;
        return data as CalendarEntry;
    }

    async bulkCreateEntries(entries: Partial<CalendarEntry>[], workspaceId?: string): Promise<CalendarEntry[]> {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const entriesWithUser = entries.map(e => ({
            ...e,
            user_id: user.id,
            workspace_id: workspaceId || e.workspace_id || null
        }));

        const { data, error } = await ((supabase
            .from('calendar_entries' as any) as any)
            .insert(entriesWithUser as any)
            .select() as any);

        if (error) throw error;
        return data as CalendarEntry[];
    }

    async updateEntry(id: string, updates: Partial<CalendarEntry>): Promise<CalendarEntry> {
        const supabase = createClient();
        const { data, error } = await ((supabase
            .from('calendar_entries' as any) as any)
            .update(updates as any)
            .eq('id', id)
            .select()
            .single() as any);

        if (error) throw error;
        return data as CalendarEntry;
    }

    async deleteEntry(id: string, permanent: boolean = false): Promise<void> {
        const supabase = createClient();
        if (permanent) {
            const { error } = await ((supabase
                .from('calendar_entries' as any) as any)
                .delete()
                .eq('id', id) as any);
            if (error) throw error;
        } else {
            const { error } = await ((supabase
                .from('calendar_entries' as any) as any)
                .update({ status: 'cancelled' } as any)
                .eq('id', id) as any);
            if (error) throw error;
        }
    }

    async getSettings(): Promise<CalendarSettings> {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('calendar_settings')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (error) throw error;
        return data as CalendarSettings;
    }

    async updateSettings(updates: Partial<CalendarSettings>): Promise<CalendarSettings> {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await ((supabase
            .from('calendar_settings' as any) as any)
            .update(updates as any)
            .eq('user_id', user.id)
            .select()
            .single() as any);

        if (error) throw error;
        return data as CalendarSettings;
    }

    async exportCalendar(params: {
        startDate: string;
        endDate: string;
        format: 'csv' | 'ical';
        workspaceId?: string;
    }): Promise<string | Blob> {
        // This will likely call the API route as it needs formatting
        const query = new URLSearchParams({
            startDate: params.startDate,
            endDate: params.endDate,
            format: params.format,
            ...(params.workspaceId && { workspaceId: params.workspaceId })
        });

        const response = await fetch(`/api/calendar/export?${query.toString()}`);
        if (!response.ok) throw new Error('Failed to export calendar');

        if (params.format === 'csv') {
            return await response.text();
        } else {
            return await response.blob();
        }
    }
}

export const calendarService = new CalendarService();
