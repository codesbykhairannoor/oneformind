import { UnifiedCalendarEvent } from './calendarAnalytics';

/**
 * Formats a Date object or YYYY-MM-DD + HH:mm string into iCalendar standard format (YYYYMMDDTHHmmSSZ)
 */
function formatIcsDateTime(dateStr: string, timeStr?: string | null): string {
    const cleanDate = dateStr.replace(/-/g, '');
    if (!timeStr) {
        return `${cleanDate}T090000Z`;
    }
    const cleanTime = timeStr.replace(/:/g, '') + '00';
    return `${cleanDate}T${cleanTime.slice(0, 6)}Z`;
}

/**
 * Generates an RFC 5545 compliant .ICS calendar string
 */
export function generateIcsCalendar(events: UnifiedCalendarEvent[], calendarName = 'Tranvas Life OS Calendar'): string {
    const lines: string[] = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Tranvas//Life OS Calendar//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        `X-WR-CALNAME:${calendarName}`,
        'X-WR-TIMEZONE:Asia/Jakarta'
    ];

    events.forEach((ev) => {
        const uid = `tranvas_${ev.id}_${Date.now()}@tranvas.com`;
        const dtStamp = formatIcsDateTime(new Date().toISOString().split('T')[0], '00:00');
        const dtStart = formatIcsDateTime(ev.start_date, ev.start_time);
        const dtEnd = formatIcsDateTime(ev.end_date || ev.start_date, ev.end_time || '10:00');

        lines.push('BEGIN:VEVENT');
        lines.push(`UID:${uid}`);
        lines.push(`DTSTAMP:${dtStamp}`);
        lines.push(`DTSTART:${dtStart}`);
        lines.push(`DTEND:${dtEnd}`);
        lines.push(`SUMMARY:${escapeIcsText(ev.title)}`);

        if (ev.description) {
            lines.push(`DESCRIPTION:${escapeIcsText(ev.description)}`);
        }

        if (ev.location) {
            lines.push(`LOCATION:${escapeIcsText(ev.location)}`);
        }

        if (ev.meeting_url) {
            lines.push(`URL:${ev.meeting_url}`);
        }

        if (ev.recurrence && ev.recurrence !== 'none') {
            switch (ev.recurrence) {
                case 'daily': lines.push('RRULE:FREQ=DAILY'); break;
                case 'weekdays': lines.push('RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR'); break;
                case 'weekly': lines.push('RRULE:FREQ=WEEKLY'); break;
                case 'biweekly': lines.push('RRULE:FREQ=WEEKLY;INTERVAL=2'); break;
                case 'monthly': lines.push('RRULE:FREQ=MONTHLY'); break;
                case 'yearly': lines.push('RRULE:FREQ=YEARLY'); break;
            }
        }

        lines.push('STATUS:CONFIRMED');
        lines.push('END:VEVENT');
    });

    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
}

function escapeIcsText(str: string): string {
    return str
        .replace(/\\/g, '\\\\')
        .replace(/;/g, '\\;')
        .replace(/,/g, '\\,')
        .replace(/\n/g, '\\n');
}

/**
 * Triggers a browser download of the .ICS calendar file
 */
export function downloadIcsFile(events: UnifiedCalendarEvent[], filename = 'tranvas_calendar.ics') {
    const icsContent = generateIcsCalendar(events);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
