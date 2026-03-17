export type ScoreType = 'competitor' | 'opportunity' | 'eeat';

export function getScoreColor(score: number, type: ScoreType): string {
    if (type === 'competitor') {
        if (score >= 80) return '#ef4444'; // Red (Hard to beat)
        if (score >= 60) return '#f59e0b'; // Yellow (Beatable)
        if (score >= 40) return '#3b82f6'; // Blue (Good opportunity)
        return '#22c55e'; // Green (Easy win)
    }

    if (type === 'opportunity') {
        if (score >= 60) return '#22c55e'; // Green (High opportunity)
        if (score >= 40) return '#f59e0b'; // Yellow (Moderate)
        return '#ef4444'; // Red (Low)
    }

    if (type === 'eeat') {
        if (score >= 80) return '#22c55e'; // Green
        if (score >= 60) return '#3b82f6'; // Blue
        if (score >= 40) return '#f59e0b'; // Yellow
        return '#ef4444'; // Red
    }

    return '#94a3b8'; // Default Slate
}

export function getScoreTextColor(score: number, type: ScoreType): string {
    // Returns a class or hex for text color
    if (type === 'competitor') {
        if (score >= 80) return 'text-red-500';
        if (score >= 60) return 'text-amber-500';
        if (score >= 40) return 'text-blue-500';
        return 'text-green-500';
    }

    if (type === 'opportunity') {
        if (score >= 60) return 'text-green-500';
        if (score >= 40) return 'text-amber-500';
        return 'text-red-500';
    }

    return 'text-slate-400';
}
