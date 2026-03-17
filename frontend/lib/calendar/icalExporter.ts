import { CalendarEntry } from './calendarService';

export function generateICal(
    entries: CalendarEntry[],
    calendarName: string
): string {
    const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Recuvix//Content Calendar//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        `X-WR-CALNAME:${calendarName} — Content Plan`,
        'X-WR-TIMEZONE:Asia/Kolkata',
    ];

    for (const entry of entries) {
        const uid = entry.id + '@recuvix.in';
        const dtstart = entry.scheduled_date.replace(/-/g, '');
        const summary = escapeIcal(entry.title);
        const desc = escapeIcal(
            `Topic: ${entry.topic}\n` +
            `Keyword: ${entry.focus_keyword}\n` +
            `Status: ${entry.status}\n` +
            (entry.notes ? `Notes: ${entry.notes}` : '')
        );
        const status = entry.status === 'published'
            ? 'CONFIRMED'
            : entry.status === 'cancelled'
                ? 'CANCELLED'
                : 'TENTATIVE';

        const categories = (entry.content_type || 'BLOG').toUpperCase();

        lines.push(
            'BEGIN:VEVENT',
            `UID:${uid}`,
            `DTSTART;VALUE=DATE:${dtstart}`,
            `SUMMARY:${summary}`,
            `DESCRIPTION:${desc}`,
            `STATUS:${status}`,
            `CATEGORIES:${categories}`,
            `PRIORITY:${entry.priority === 'urgent' ? 1
                : entry.priority === 'high' ? 3
                    : entry.priority === 'low' ? 7 : 5
            }`,
            'END:VEVENT'
        );
    }

    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
}

function escapeIcal(s: string): string {
    if (!s) return '';
    return s.replace(/\\/g, '\\\\')
        .replace(/;/g, '\\;')
        .replace(/,/g, '\\,')
        .replace(/\n/g, '\\n');
}
