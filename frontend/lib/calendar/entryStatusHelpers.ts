export type CalendarEntryStatus =
    | 'planned'
    | 'scheduled'
    | 'in_progress'
    | 'published'
    | 'missed'
    | 'cancelled';

export type CalendarEntryPriority = 'low' | 'medium' | 'high' | 'urgent';

export const STATUS_CONFIG: Record<
    CalendarEntryStatus,
    { label: string; color: string; bgColor: string; dotColor: string }
> = {
    planned: {
        label: 'Planned',
        color: 'text-zinc-400',
        bgColor: 'bg-zinc-900',
        dotColor: 'bg-zinc-500',
    },
    scheduled: {
        label: 'Scheduled',
        color: 'text-blue-400',
        bgColor: 'bg-blue-900/30',
        dotColor: 'bg-blue-500',
    },
    in_progress: {
        label: 'In Progress',
        color: 'text-amber-400',
        bgColor: 'bg-amber-900/30',
        dotColor: 'bg-amber-500',
    },
    published: {
        label: 'Published',
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-900/30',
        dotColor: 'bg-emerald-500',
    },
    missed: {
        label: 'Missed',
        color: 'text-rose-400',
        bgColor: 'bg-rose-900/30',
        dotColor: 'bg-rose-500',
    },
    cancelled: {
        label: 'Cancelled',
        color: 'text-zinc-600',
        bgColor: 'bg-zinc-900/50',
        dotColor: 'bg-zinc-700',
    },
};

export const PRIORITY_CONFIG: Record<
    CalendarEntryPriority,
    { label: string; color: string }
> = {
    low: { label: 'Low', color: 'bg-zinc-500' },
    medium: { label: 'Medium', color: 'bg-blue-500' },
    high: { label: 'High', color: 'bg-orange-500' },
    urgent: { label: 'Urgent', color: 'bg-rose-500' },
};

export const CONTENT_TYPE_LABELS: Record<string, string> = {
    blog: 'Blog',
    listicle: 'Listicle',
    how_to: 'How-To',
    comparison: 'Comparison',
    case_study: 'Case Study',
    ultimate_guide: 'Ultimate Guide',
    news_trend: 'News/Trend',
};
