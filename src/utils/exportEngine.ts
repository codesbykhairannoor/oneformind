/**
 * Tranvas OS Universal Data Export Engine
 * Supports CSV (RFC 4180 with UTF-8 BOM for Excel & Google Sheets) and structured JSON.
 * Covers all 8 modules (Habits, Planner, Finance, Study, Journal, Calendar, Jobs, Goals)
 * and all-time / per-year / per-month date ranges.
 */

export type ExportPeriodType = 'all' | 'year' | 'month';

export interface ExportFilterOptions {
    periodType: ExportPeriodType;
    year?: number;
    month?: number; // 1-12
}

/**
 * Triggers browser file download
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Cleanly escapes a CSV field (RFC 4180 compliant)
 */
function escapeCsvValue(val: any): string {
    if (val === null || val === undefined) return '""';
    const str = String(val);
    // If string contains comma, quote, or newline, escape quotes and wrap in quotes
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return `"${str}"`;
}

/**
 * Generates RFC 4180 compliant CSV string with UTF-8 BOM
 */
export function generateCsv(headers: string[], rows: (string | number | boolean | null | undefined)[][]): string {
    const BOM = '\uFEFF';
    const headerLine = headers.map(h => escapeCsvValue(h)).join(',');
    const bodyLines = rows.map(row => row.map(cell => escapeCsvValue(cell)).join(','));
    return BOM + [headerLine, ...bodyLines].join('\r\n');
}

/**
 * Generates formatted, readable JSON string with export metadata
 */
export function generateJson(moduleName: string, filter: ExportFilterOptions, data: any): string {
    const payload = {
        export_info: {
            app: 'Tranvas OS',
            module: moduleName,
            exported_at: new Date().toISOString(),
            filter: {
                period_type: filter.periodType,
                year: filter.year || null,
                month: filter.month || null,
                label: getPeriodLabel(filter)
            },
            record_count: Array.isArray(data) ? data.length : typeof data === 'object' && data ? Object.keys(data).length : 1
        },
        data
    };
    return JSON.stringify(payload, null, 2);
}

/**
 * Generates human readable period label
 */
export function getPeriodLabel(filter: ExportFilterOptions, isIndo = true): string {
    if (filter.periodType === 'all') {
        return isIndo ? 'Sepanjang Waktu (Semua Bulan & Tahun)' : 'All Time (All Months & Years)';
    }
    if (filter.periodType === 'year') {
        return isIndo ? `Tahun ${filter.year}` : `Year ${filter.year}`;
    }
    if (filter.periodType === 'month' && filter.month && filter.year) {
        const monthNamesId = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        const monthNamesEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const mName = isIndo ? monthNamesId[filter.month - 1] : monthNamesEn[filter.month - 1];
        return `${mName} ${filter.year}`;
    }
    return isIndo ? 'Kustom' : 'Custom';
}

/**
 * Safe filename formatter
 */
export function getExportFilename(module: string, ext: 'csv' | 'json', filter: ExportFilterOptions): string {
    let suffix = 'all-time';
    if (filter.periodType === 'year' && filter.year) {
        suffix = `${filter.year}`;
    } else if (filter.periodType === 'month' && filter.year && filter.month) {
        const m = String(filter.month).padStart(2, '0');
        suffix = `${filter.year}-${m}`;
    }
    const timestamp = new Date().toISOString().slice(0, 10);
    return `tranvas_${module}_${suffix}_${timestamp}.${ext}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// SPECIFIC MODULE SERIALIZERS
// ─────────────────────────────────────────────────────────────────────────────

// 1. HABITS
export function serializeHabitsToCsv(habits: any[], filter: ExportFilterOptions): string {
    const headers = [
        'Habit ID',
        'Habit Name',
        'Icon',
        'Period (Month)',
        'Monthly Target',
        'Status',
        'Log Date',
        'Log Status',
        'Log Notes'
    ];

    const rows: (string | number | boolean | null | undefined)[][] = [];

    habits.forEach(h => {
        const logs = Array.isArray(h.logs) ? h.logs : [];
        if (logs.length === 0) {
            rows.push([
                h.id,
                h.name,
                h.icon || '',
                h.period || '',
                h.monthlyTarget || 0,
                h.status || 'active',
                '',
                '',
                ''
            ]);
        } else {
            logs.forEach((l: any) => {
                const logDate = l.date ? String(l.date).slice(0, 10) : '';
                rows.push([
                    h.id,
                    h.name,
                    h.icon || '',
                    h.period || '',
                    h.monthlyTarget || 0,
                    h.status || 'active',
                    logDate,
                    l.status || 'completed',
                    l.notes || ''
                ]);
            });
        }
    });

    return generateCsv(headers, rows);
}

// 2. PLANNER
export function serializePlannerToCsv(tasks: any[], filter: ExportFilterOptions): string {
    const headers = [
        'Task ID',
        'Date',
        'Task Title',
        'Type',
        'Start Time',
        'End Time',
        'Is Completed',
        'Notes'
    ];

    const typeNames: Record<number, string> = {
        1: 'Deep Work',
        2: 'Meeting',
        3: 'Personal',
        4: 'Study'
    };

    const rows = tasks.map(t => [
        t.id,
        t.date ? String(t.date).slice(0, 10) : '',
        t.title,
        typeNames[t.type] || `Type ${t.type}`,
        t.startTime || t.start_time || '',
        t.endTime || t.end_time || '',
        t.isCompleted || t.completed ? 'YES' : 'NO',
        t.notes || ''
    ]);

    return generateCsv(headers, rows);
}

// 3. FINANCE
export function serializeFinanceToCsv(transactions: any[], filter: ExportFilterOptions): string {
    const headers = [
        'Transaction ID',
        'Date',
        'Title',
        'Type (Income/Expense)',
        'Category',
        'Amount',
        'Notes'
    ];

    const rows = transactions.map(tx => [
        tx.id,
        tx.date ? String(tx.date).slice(0, 10) : '',
        tx.title,
        tx.type ? String(tx.type).toUpperCase() : 'EXPENSE',
        tx.category || 'General',
        typeof tx.amount === 'number' ? tx.amount : parseFloat(tx.amount) || 0,
        tx.notes || ''
    ]);

    return generateCsv(headers, rows);
}

// 4. STUDY
export function serializeStudyToCsv(courses: any[], filter: ExportFilterOptions): string {
    const headers = [
        'Course ID',
        'Semester',
        'Course Name',
        'Credits (SKS)',
        'Grade',
        'Materials / Archives Count'
    ];

    const rows = courses.map(c => [
        c.id,
        c.semester || 1,
        c.courseName || c.name || '',
        c.sks || 0,
        c.grade || '-',
        Array.isArray(c.archives) ? c.archives.length : 0
    ]);

    return generateCsv(headers, rows);
}

// 5. JOURNAL
export function serializeJournalToCsv(journals: any[], filter: ExportFilterOptions): string {
    const headers = [
        'Journal ID',
        'Date',
        'Title',
        'Mood',
        'AI Sentiment',
        'Mood Score',
        'Content'
    ];

    const rows = journals.map(j => [
        j.id,
        j.date ? String(j.date).slice(0, 10) : '',
        j.title || 'Untitled',
        j.mood || 'neutral',
        j.aiSentiment || '-',
        j.moodScore ?? '-',
        j.content || ''
    ]);

    return generateCsv(headers, rows);
}

// 6. CALENDAR
export function serializeCalendarToCsv(events: any[], filter: ExportFilterOptions): string {
    const headers = [
        'Event ID',
        'Title',
        'Type / Category',
        'Start Date',
        'End Date',
        'Start Time',
        'End Time',
        'All Day',
        'Description'
    ];

    const rows = events.map(e => [
        e.id,
        e.title,
        e.type || e.category || 'personal',
        e.startDate ? String(e.startDate).slice(0, 10) : (e.start_date ? String(e.start_date).slice(0, 10) : ''),
        e.endDate ? String(e.endDate).slice(0, 10) : (e.end_date ? String(e.end_date).slice(0, 10) : ''),
        e.startTime || e.start_time || '',
        e.endTime || e.end_time || '',
        e.isAllDay || e.is_all_day ? 'YES' : 'NO',
        e.description || ''
    ]);

    return generateCsv(headers, rows);
}

// 7. JOBS
export function serializeJobsToCsv(jobs: any[], filter: ExportFilterOptions): string {
    const headers = [
        'Job ID',
        'Company',
        'Role / Title',
        'Status',
        'Applied Date',
        'Salary',
        'Location',
        'Job URL',
        'Notes'
    ];

    const rows = jobs.map(j => [
        j.id,
        j.company || '',
        j.title || '',
        j.status || 'bookmarked',
        j.applied_date ? String(j.applied_date).slice(0, 10) : (j.appliedDate ? String(j.appliedDate).slice(0, 10) : ''),
        j.salary || '',
        j.location || '',
        j.job_url || j.jobUrl || '',
        j.notes || ''
    ]);

    return generateCsv(headers, rows);
}

// 8. GOALS
export function serializeGoalsToCsv(goals: any[], filter: ExportFilterOptions): string {
    const headers = [
        'Goal ID',
        'Goal Title',
        'Category',
        'Priority',
        'Status',
        'Time Horizon',
        'Deadline',
        'Milestones Total',
        'Milestones Completed'
    ];

    const rows = goals.map(g => {
        const milestones = Array.isArray(g.milestones) ? g.milestones : [];
        const completed = milestones.filter((m: any) => m.isCompleted || m.is_completed || m.completed).length;
        return [
            g.id,
            g.title || '',
            g.category || 'general',
            g.priority || 'medium',
            g.status || 'active',
            g.time_horizon || g.timeHorizon || 'yearly',
            g.deadline ? String(g.deadline).slice(0, 10) : '',
            milestones.length,
            completed
        ];
    });

    return generateCsv(headers, rows);
}

// 9. UNIFIED ALL-IN-ONE
export function serializeAllModulesToCsv(bundle: Record<string, any[]>): string {
    // Generates a multi-section CSV
    const BOM = '\uFEFF';
    const sections: string[] = [];

    if (bundle.finance?.length) {
        sections.push('# SECTION: FINANCE TRANSACTIONS\r\n' + serializeFinanceToCsv(bundle.finance, { periodType: 'all' }).replace(BOM, ''));
    }
    if (bundle.habits?.length) {
        sections.push('# SECTION: HABITS & LOGS\r\n' + serializeHabitsToCsv(bundle.habits, { periodType: 'all' }).replace(BOM, ''));
    }
    if (bundle.planner?.length) {
        sections.push('# SECTION: PLANNER TASKS\r\n' + serializePlannerToCsv(bundle.planner, { periodType: 'all' }).replace(BOM, ''));
    }
    if (bundle.journal?.length) {
        sections.push('# SECTION: JOURNALS\r\n' + serializeJournalToCsv(bundle.journal, { periodType: 'all' }).replace(BOM, ''));
    }
    if (bundle.calendar?.length) {
        sections.push('# SECTION: CALENDAR EVENTS\r\n' + serializeCalendarToCsv(bundle.calendar, { periodType: 'all' }).replace(BOM, ''));
    }
    if (bundle.jobs?.length) {
        sections.push('# SECTION: JOBS APPLICATIONS\r\n' + serializeJobsToCsv(bundle.jobs, { periodType: 'all' }).replace(BOM, ''));
    }
    if (bundle.goals?.length) {
        sections.push('# SECTION: GOALS & MILESTONES\r\n' + serializeGoalsToCsv(bundle.goals, { periodType: 'all' }).replace(BOM, ''));
    }
    if (bundle.study?.length) {
        sections.push('# SECTION: STUDY COURSES\r\n' + serializeStudyToCsv(bundle.study, { periodType: 'all' }).replace(BOM, ''));
    }

    return BOM + sections.join('\r\n\r\n');
}
