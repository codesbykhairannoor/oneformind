// Calendar Analytics & Time-Grid Engine

export interface UnifiedCalendarEvent {
    id: number | string;
    title: string;
    description?: string | null;
    start_date: string; // YYYY-MM-DD
    end_date?: string | null;
    start_time?: string | null; // HH:mm
    end_time?: string | null;   // HH:mm
    is_all_day?: boolean;
    color?: string;
    category?: 'personal' | 'work' | 'meeting' | 'deepwork' | 'health' | 'finance' | 'study';
    meeting_url?: string | null;
    location?: string | null;
    recurrence?: 'none' | 'daily' | 'weekdays' | 'weekly' | 'biweekly' | 'monthly' | 'yearly';
    source_module?: 'event' | 'job' | 'goal' | 'planner' | 'habit' | 'finance';
    is_completed?: boolean;
}

export interface TimeAllocationStats {
    totalScheduledMinutes: number;
    totalScheduledHours: number;
    meetingMinutes: number;
    deepWorkMinutes: number;
    meetingRatio: number; // 0-100%
    deepWorkRatio: number; // 0-100%
    conflictCount: number;
    upcomingEventCount: number;
    totalEventsCount: number;
    freeFocusSlotsCount: number;
}

/**
 * Calculates duration in minutes between start_time (HH:mm) and end_time (HH:mm)
 */
export function getEventDurationMinutes(startTime?: string | null, endTime?: string | null): number {
    if (!startTime) return 60; // Default 1 hour
    if (!endTime) return 60;

    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);

    let startTotal = sh * 60 + (sm || 0);
    let endTotal = eh * 60 + (em || 0);

    if (endTotal <= startTotal) {
        endTotal += 24 * 60; // Crosses midnight
    }

    return Math.max(15, endTotal - startTotal);
}

/**
 * Detects meeting platform from URL or text
 */
export function detectMeetingPlatform(urlOrText?: string | null): {
    platform: 'google_meet' | 'zoom' | 'teams' | 'discord' | 'other' | null;
    name: string;
    url: string | null;
} {
    if (!urlOrText) return { platform: null, name: '', url: null };
    const text = urlOrText.toLowerCase();

    if (text.includes('meet.google.com')) {
        return { platform: 'google_meet', name: 'Google Meet', url: urlOrText.startsWith('http') ? urlOrText : `https://${urlOrText}` };
    }
    if (text.includes('zoom.us') || text.includes('zoom.com')) {
        return { platform: 'zoom', name: 'Zoom', url: urlOrText.startsWith('http') ? urlOrText : `https://${urlOrText}` };
    }
    if (text.includes('teams.microsoft.com') || text.includes('teams.live.com')) {
        return { platform: 'teams', name: 'Microsoft Teams', url: urlOrText.startsWith('http') ? urlOrText : `https://${urlOrText}` };
    }
    if (text.includes('discord.gg') || text.includes('discord.com')) {
        return { platform: 'discord', name: 'Discord', url: urlOrText.startsWith('http') ? urlOrText : `https://${urlOrText}` };
    }

    if (urlOrText.startsWith('http://') || urlOrText.startsWith('https://')) {
        return { platform: 'other', name: 'Video Call', url: urlOrText };
    }

    return { platform: null, name: '', url: null };
}

/**
 * Parses embedded metadata from event description
 */
export function parseEventMetadata(rawDescription: string): {
    cleanDescription: string;
    category?: string;
    meetingUrl?: string;
    location?: string;
    recurrence?: string;
    color?: string;
} {
    if (!rawDescription) return { cleanDescription: '' };

    const match = rawDescription.match(/<!--META:(.*?)-->/);
    if (match && match[1]) {
        try {
            const meta = JSON.parse(match[1]);
            const clean = rawDescription.replace(/<!--META:(.*?)-->/, '').trim();
            return {
                cleanDescription: clean,
                category: meta.category,
                meetingUrl: meta.meeting_url,
                location: meta.location,
                recurrence: meta.recurrence,
                color: meta.color
            };
        } catch {
            // fallback
        }
    }

    // Auto-detect link if present in description
    const detected = detectMeetingPlatform(rawDescription);
    return {
        cleanDescription: rawDescription,
        meetingUrl: detected.url || undefined
    };
}

/**
 * Exports an array of events to universal iCalendar (.ICS) format
 */
export function exportCalendarToIcs(events: UnifiedCalendarEvent[], filename: string = 'calendar_events.ics'): void {
    if (typeof window === 'undefined') return;

    const pad = (n: number) => String(n).padStart(2, '0');

    const lines: string[] = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Tranvas Life OS//Calendar 2.0//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH'
    ];

    events.forEach(ev => {
        const startClean = (ev.start_date || '').replace(/-/g, '');
        const endClean = (ev.end_date || ev.start_date || '').replace(/-/g, '');
        
        const startTimeClean = (ev.start_time || '09:00').replace(/:/g, '') + '00';
        const endTimeClean = (ev.end_time || '10:00').replace(/:/g, '') + '00';

        lines.push('BEGIN:VEVENT');
        lines.push(`UID:tranvas_${ev.id}_${Date.now()}@tranvas.app`);
        lines.push(`SUMMARY:${ev.title.replace(/\n/g, ' ')}`);
        
        if (ev.is_all_day) {
            lines.push(`DTSTART;VALUE=DATE:${startClean}`);
            lines.push(`DTEND;VALUE=DATE:${endClean}`);
        } else {
            lines.push(`DTSTART:${startClean}T${startTimeClean}Z`);
            lines.push(`DTEND:${endClean}T${endTimeClean}Z`);
        }

        if (ev.description) {
            lines.push(`DESCRIPTION:${ev.description.replace(/\n/g, '\\n')}`);
        }
        if (ev.location) {
            lines.push(`LOCATION:${ev.location}`);
        }
        if (ev.meeting_url) {
            lines.push(`URL:${ev.meeting_url}`);
        }

        lines.push('END:VEVENT');
    });

    lines.push('END:VCALENDAR');

    const icsContent = lines.join('\r\n');
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Computes capacity utilization & focus analytics for a set of events
 */
export function calculateTimeAllocationStats(events: UnifiedCalendarEvent[]): TimeAllocationStats {
    let totalScheduledMinutes = 0;
    let meetingMinutes = 0;
    let deepWorkMinutes = 0;
    let conflictCount = 0;

    // Group events by date for conflict detection
    const eventsByDate = new Map<string, UnifiedCalendarEvent[]>();

    events.forEach(ev => {
        const dur = ev.is_all_day ? 8 * 60 : getEventDurationMinutes(ev.start_time, ev.end_time);
        totalScheduledMinutes += dur;

        const isMeeting = ev.category === 'meeting' || ev.source_module === 'job' || detectMeetingPlatform(ev.meeting_url || ev.description).platform !== null;
        if (isMeeting) {
            meetingMinutes += dur;
        } else if (ev.category === 'deepwork' || ev.source_module === 'planner' || ev.source_module === 'goal') {
            deepWorkMinutes += dur;
        } else {
            deepWorkMinutes += Math.round(dur * 0.5);
        }

        const dateKey = ev.start_date;
        if (!eventsByDate.has(dateKey)) {
            eventsByDate.set(dateKey, []);
        }
        eventsByDate.get(dateKey)!.push(ev);
    });

    // Check overlaps per date
    eventsByDate.forEach((dayEvs) => {
        const timedEvs = dayEvs.filter(e => !e.is_all_day && e.start_time && e.end_time);
        for (let i = 0; i < timedEvs.length; i++) {
            for (let j = i + 1; j < timedEvs.length; j++) {
                const a = timedEvs[i];
                const b = timedEvs[j];
                const [ash, asm] = (a.start_time || '00:00').split(':').map(Number);
                const [aeh, aem] = (a.end_time || '00:00').split(':').map(Number);
                const [bsh, bsm] = (b.start_time || '00:00').split(':').map(Number);
                const [beh, bem] = (b.end_time || '00:00').split(':').map(Number);

                const aStart = ash * 60 + asm;
                const aEnd = aeh * 60 + aem;
                const bStart = bsh * 60 + bsm;
                const bEnd = beh * 60 + bem;

                if (Math.max(aStart, bStart) < Math.min(aEnd, bEnd)) {
                    conflictCount++;
                }
            }
        }
    });

    const totalHours = Math.round((totalScheduledMinutes / 60) * 10) / 10;
    const meetingRatio = totalScheduledMinutes > 0 ? Math.round((meetingMinutes / totalScheduledMinutes) * 100) : 0;
    const deepWorkRatio = totalScheduledMinutes > 0 ? Math.round((deepWorkMinutes / totalScheduledMinutes) * 100) : 0;

    return {
        totalScheduledMinutes,
        totalScheduledHours: totalHours,
        meetingMinutes,
        deepWorkMinutes,
        meetingRatio,
        deepWorkRatio,
        conflictCount,
        upcomingEventCount: events.length,
        totalEventsCount: events.length,
        freeFocusSlotsCount: Math.max(0, Math.floor((events.length > 0 ? 40 : 0) - totalHours))
    };
}

/**
 * Formats time in HH:mm with 12/24h respect
 */
export function formatTimeSlot(timeStr: string): string {
    if (!timeStr) return '';
    return timeStr.slice(0, 5);
}
