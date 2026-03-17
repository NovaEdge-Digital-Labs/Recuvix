export function getDaysInMonth(year: number, month: number): Date[] {
    const date = new Date(year, month - 1, 1);
    const days: Date[] = [];
    while (date.getMonth() === month - 1) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return days;
}

/**
 * Returns a 6-row x 7-column grid of dates for the calendar month view.
 * month is 1-indexed (1 = January)
 */
export function getCalendarGrid(
    year: number,
    month: number,
    startDayOfWeek: number = 1 // 1=Monday, 0=Sunday
): Date[][] {
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const lastDayOfMonth = new Date(year, month, 0);

    // Calculate how many days from previous month to show
    let dayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) to 6 (Sat)
    let daysFromPrevMonth = (dayOfWeek - startDayOfWeek + 7) % 7;

    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - daysFromPrevMonth);

    const grid: Date[][] = [];
    let currentDate = new Date(startDate);

    for (let row = 0; row < 6; row++) {
        const week: Date[] = [];
        for (let col = 0; col < 7; col++) {
            week.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        grid.push(week);
    }

    return grid;
}

/**
 * Returns "YYYY-MM-DD"
 */
export function formatDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function parseDateKey(key: string): Date {
    const [year, month, day] = key.split('-').map(Number);
    return new Date(year, month - 1, day);
}

/**
 * Returns 7 days of the week containing `date`
 */
export function getWeekDays(date: Date, startDayOfWeek: number = 1): Date[] {
    const day = date.getDay();
    const diff = (day - startDayOfWeek + 7) % 7;
    const monday = new Date(date);
    monday.setDate(date.getDate() - diff);

    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        week.push(d);
    }
    return week;
}

export function isToday(date: Date): boolean {
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
}

export function isPast(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
}

export function daysUntil(date: Date): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    const diffTime = checkDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function formatCalendarDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Spreads N dates starting from startDate at the given frequency interval
 */
export function spreadDatesForFrequency(
    startDate: Date,
    count: number,
    frequency: string
): Date[] {
    const dates: Date[] = [];
    const current = new Date(startDate);

    for (let i = 0; i < count; i++) {
        dates.push(new Date(current));
        if (frequency === 'daily') {
            current.setDate(current.getDate() + 1);
        } else if (frequency === '3x_week') {
            // Mon, Wed, Fri pattern or similar
            const day = current.getDay();
            if (day === 1 || day === 3) {
                current.setDate(current.getDate() + 2);
            } else if (day === 5) {
                current.setDate(current.getDate() + 3);
            } else {
                current.setDate(current.getDate() + 1);
            }
        } else if (frequency === 'weekly') {
            current.setDate(current.getDate() + 7);
        } else if (frequency === 'biweekly') {
            current.setDate(current.getDate() + 14);
        } else if (frequency === 'monthly') {
            current.setMonth(current.getMonth() + 1);
        } else {
            current.setDate(current.getDate() + 7); // Default to weekly
        }
    }

    return dates;
}
