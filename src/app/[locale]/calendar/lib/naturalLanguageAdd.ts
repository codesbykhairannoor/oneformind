import { UnifiedCalendarEvent } from './calendarAnalytics';

/**
 * Natural Language Parser for Calendar Quick Add (Bilingual Indonesian & English)
 */
export function parseNaturalLanguageEvent(input: string, baseDate = new Date()): Partial<UnifiedCalendarEvent> {
    const raw = input.trim();
    if (!raw) return {};

    let text = raw;
    let targetDate = new Date(baseDate);
    let startTime = '09:00';
    let endTime = '10:00';
    let category: UnifiedCalendarEvent['category'] = 'personal';
    let color = '#4f46e5';
    let meetingUrl = '';

    const lower = text.toLowerCase();

    // 1. Date Detection
    // Indonesian keywords
    if (lower.includes('hari ini') || lower.includes('today')) {
        targetDate = new Date();
        text = text.replace(/hari ini|today/gi, '');
    } else if (lower.includes('besok') || lower.includes('tomorrow')) {
        targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 1);
        text = text.replace(/besok|tomorrow/gi, '');
    } else if (lower.includes('lusa')) {
        targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 2);
        text = text.replace(/lusa/gi, '');
    } else if (lower.includes('senin') || lower.includes('monday')) {
        targetDate = getNextDayOfWeek(1);
        text = text.replace(/senin|monday/gi, '');
    } else if (lower.includes('selasa') || lower.includes('tuesday')) {
        targetDate = getNextDayOfWeek(2);
        text = text.replace(/selasa|tuesday/gi, '');
    } else if (lower.includes('rabu') || lower.includes('wednesday')) {
        targetDate = getNextDayOfWeek(3);
        text = text.replace(/rabu|wednesday/gi, '');
    } else if (lower.includes('kamis') || lower.includes('thursday')) {
        targetDate = getNextDayOfWeek(4);
        text = text.replace(/kamis|thursday/gi, '');
    } else if (lower.includes('jumat') || lower.includes('jum\'at') || lower.includes('friday')) {
        targetDate = getNextDayOfWeek(5);
        text = text.replace(/jumat|jum'at|friday/gi, '');
    } else if (lower.includes('sabtu') || lower.includes('saturday')) {
        targetDate = getNextDayOfWeek(6);
        text = text.replace(/sabtu|saturday/gi, '');
    } else if (lower.includes('minggu') || lower.includes('sunday')) {
        targetDate = getNextDayOfWeek(0);
        text = text.replace(/minggu|sunday/gi, '');
    }

    // 2. Time Detection (e.g. 14:00, 14:00 - 15:30, jam 2 siang, at 3pm, 9am)
    // 24-hour range: 14:00 - 15:30 or 14.00 - 15.30
    const timeRangeMatch = text.match(/(?:jam\s+|at\s+)?(\d{1,2})[:.](\d{2})\s*(?:-|sampai|to)\s*(\d{1,2})[:.](\d{2})/i);
    if (timeRangeMatch) {
        const sh = String(timeRangeMatch[1]).padStart(2, '0');
        const sm = String(timeRangeMatch[2]).padStart(2, '0');
        const eh = String(timeRangeMatch[3]).padStart(2, '0');
        const em = String(timeRangeMatch[4]).padStart(2, '0');
        startTime = `${sh}:${sm}`;
        endTime = `${eh}:${em}`;
        text = text.replace(timeRangeMatch[0], '');
    } else {
        // Single time 24h: jam 14:00 or 14.00
        const single24Match = text.match(/(?:jam\s+|at\s+)?(\d{1,2})[:.](\d{2})/i);
        if (single24Match) {
            const sh = Number(single24Match[1]);
            const sm = String(single24Match[2]).padStart(2, '0');
            startTime = `${String(sh).padStart(2, '0')}:${sm}`;
            const eh = (sh + 1) % 24;
            endTime = `${String(eh).padStart(2, '0')}:${sm}`;
            text = text.replace(single24Match[0], '');
        } else {
            // 12-hour AM/PM: at 3pm, 9am, jam 2 siang, jam 7 malam
            const ampmMatch = text.match(/(?:jam\s+|at\s+)?(\d{1,2})\s*(am|pm|siang|sore|malam|pagi)/i);
            if (ampmMatch) {
                let hour = Number(ampmMatch[1]);
                const mod = ampmMatch[2].toLowerCase();
                if ((mod === 'pm' || mod === 'siang' || mod === 'sore' || mod === 'malam') && hour < 12) {
                    hour += 12;
                }
                startTime = `${String(hour).padStart(2, '0')}:00`;
                endTime = `${String((hour + 1) % 24).padStart(2, '0')}:00`;
                text = text.replace(ampmMatch[0], '');
            }
        }
    }

    // 3. Category & Meeting Detection
    if (lower.includes('zoom') || lower.includes('google meet') || lower.includes('meet') || lower.includes('teams') || lower.includes('call') || lower.includes('interview')) {
        category = 'meeting';
        color = '#8b5cf6'; // Purple
        if (lower.includes('zoom')) meetingUrl = 'https://zoom.us/j/sample';
        if (lower.includes('meet')) meetingUrl = 'https://meet.google.com/new';
        if (lower.includes('teams')) meetingUrl = 'https://teams.microsoft.com';
    } else if (lower.includes('focus') || lower.includes('deep work') || lower.includes('coding') || lower.includes('belajar') || lower.includes('study')) {
        category = 'deepwork';
        color = '#0ea5e9'; // Sky blue
    } else if (lower.includes('gym') || lower.includes('olahraga') || lower.includes('workout') || lower.includes('lari') || lower.includes('sehat')) {
        category = 'health';
        color = '#10b981'; // Emerald
    } else if (lower.includes('bayar') || lower.includes('gaji') || lower.includes('finance') || lower.includes('tagihan')) {
        category = 'finance';
        color = '#f43f5e'; // Rose
    } else if (lower.includes('kerja') || lower.includes('work') || lower.includes('sprint') || lower.includes('project')) {
        category = 'work';
        color = '#f59e0b'; // Amber
    }

    // 4. Clean Remaining Title
    const cleanTitle = text
        .replace(/via\s+(zoom|google meet|meet|teams|discord)/gi, '')
        .replace(/\s+/g, ' ')
        .trim() || 'New Schedule';

    const dateStr = targetDate.toISOString().split('T')[0];

    return {
        title: cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1),
        start_date: dateStr,
        end_date: dateStr,
        start_time: startTime,
        end_time: endTime,
        color,
        category,
        meeting_url: meetingUrl || null,
        is_all_day: false
    };
}

function getNextDayOfWeek(dayOfWeek: number): Date {
    const today = new Date();
    const result = new Date(today.getTime());
    result.setDate(today.getDate() + (7 + dayOfWeek - today.getDay()) % 7);
    if (result.getDate() === today.getDate()) {
        result.setDate(result.getDate() + 7); // Next week if same day
    }
    return result;
}
