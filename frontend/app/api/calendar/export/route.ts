import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { generateICal } from "@/lib/calendar/icalExporter";
import { CalendarEntry } from "@/lib/calendar/calendarService";

export async function GET(req: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const format = searchParams.get('format') as 'csv' | 'ical';
        const workspaceId = searchParams.get('workspaceId');

        if (!startDate || !endDate || !format) {
            return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
        }

        let query = (supabase
            .from('calendar_entries') as any)
            .select('*')
            .gte('scheduled_date', startDate)
            .lte('scheduled_date', endDate)
            .eq('user_id', user.id);

        if (workspaceId) {
            query = query.eq('workspace_id', workspaceId);
        } else {
            query = query.is('workspace_id', null);
        }

        const { data: entries, error } = await query.order('scheduled_date', { ascending: true });

        if (error) throw error;

        if (format === 'csv') {
            const headers = [
                'Date', 'Title', 'Topic', 'Focus Keyword', 'Status',
                'Priority', 'Content Type', 'Category', 'Notes',
                'Published URL', 'Assigned To'
            ];

            const rows = (entries as CalendarEntry[]).map(e => [
                e.scheduled_date,
                `"${e.title.replace(/"/g, '""')}"`,
                `"${e.topic.replace(/"/g, '""')}"`,
                `"${e.focus_keyword.replace(/"/g, '""')}"`,
                e.status,
                e.priority,
                e.content_type || '',
                `"${(e.category || '').replace(/"/g, '""')}"`,
                `"${(e.notes || '').replace(/"/g, '""')}"`,
                e.published_url || '',
                e.assigned_to_name || ''
            ]);

            const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

            return new NextResponse(csvContent, {
                headers: {
                    'Content-Type': 'text/csv',
                    'Content-Disposition': `attachment; filename="content-calendar-${startDate}-to-${endDate}.csv"`
                }
            });
        } else {
            const icalContent = generateICal(entries as CalendarEntry[], "Recuvix");

            return new NextResponse(icalContent, {
                headers: {
                    'Content-Type': 'text/calendar',
                    'Content-Disposition': `attachment; filename="content-calendar-${startDate}-to-${endDate}.ics"`
                }
            });
        }

    } catch (error: any) {
        console.error("Calendar Export Error:", error);
        return NextResponse.json({ error: error.message || "Failed to export calendar" }, { status: 500 });
    }
}
