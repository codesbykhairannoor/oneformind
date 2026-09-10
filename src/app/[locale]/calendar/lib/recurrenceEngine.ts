import { UnifiedCalendarEvent } from './calendarAnalytics';

/**
 * Expands recurring events into individual dated instances for a target date range
 */
export function expandRecurringEvents(
    events: UnifiedCalendarEvent[],
    rangeStart: string, // YYYY-MM-DD
    rangeEnd: string    // YYYY-MM-DD
): UnifiedCalendarEvent[] {
    const result: UnifiedCalendarEvent[] = [];
    const startDate = new Date(rangeStart);
    const endDate = new Date(rangeEnd);

    events.forEach(ev => {
        const evStart = new Date(ev.start_date);
        
        // If event has no recurrence, only include if within range
        if (!ev.recurrence || ev.recurrence === 'none') {
            if (ev.start_date >= rangeStart && ev.start_date <= rangeEnd) {
                result.push(ev);
            }
            return;
        }

        // Base event is added if in range
        if (ev.start_date >= rangeStart && ev.start_date <= rangeEnd) {
            result.push(ev);
        }

        // Generate recurring occurrences
        let current = new Date(evStart);
        const maxLimitDate = new Date(Math.min(endDate.getTime(), evStart.getTime() + 365 * 24 * 3600 * 1000));

        while (current <= maxLimitDate) {
            // Advance according to rule
            if (ev.recurrence === 'daily') {
                current.setDate(current.getDate() + 1);
            } else if (ev.recurrence === 'weekdays') {
                current.setDate(current.getDate() + 1);
                // Skip Saturday (6) and Sunday (0)
                while (current.getDay() === 0 || current.getDay() === 6) {
                    current.setDate(current.getDate() + 1);
                }
            } else if (ev.recurrence === 'weekly') {
                current.setDate(current.getDate() + 7);
            } else if (ev.recurrence === 'biweekly') {
                current.setDate(current.getDate() + 14);
            } else if (ev.recurrence === 'monthly') {
                current.setMonth(current.getMonth() + 1);
            } else if (ev.recurrence === 'yearly') {
                current.setFullYear(current.getFullYear() + 1);
            } else {
                break;
            }

            const curStr = current.toISOString().split('T')[0];
            if (curStr > rangeEnd) break;

            if (curStr >= rangeStart && curStr <= rangeEnd && curStr !== ev.start_date) {
                result.push({
                    ...ev,
                    id: `${ev.id}_rec_${curStr}`,
                    start_date: curStr,
                    end_date: curStr
                });
            }
        }
    });

    return result;
}
