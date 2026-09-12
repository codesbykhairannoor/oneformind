export interface GoalMilestone {
    id?: number | string | null;
    _key?: string;
    title: string;
    is_completed?: boolean;
    completed?: boolean;
    target_date?: string | null;
    weight?: number;
    order?: number;
    is_saving?: boolean;
}

export type GoalType = 'numeric' | 'currency' | 'milestones' | 'habit_frequency' | 'boolean' | string;
export type GoalPriority = 'vital' | 'important' | 'optional' | string;
export type GoalStatus = 'active' | 'completed' | 'on_track' | 'at_risk' | 'behind' | 'draft' | string;
export type GoalTimeHorizon = 'sprint' | 'quarterly' | 'yearly' | 'lifetime' | string;

export interface GoalItem {
    id: number | string;
    _key?: string;
    title: string;
    color?: string;
    type?: GoalType;
    status?: GoalStatus;
    priority?: GoalPriority;
    category?: string;
    time_horizon?: GoalTimeHorizon;
    is_north_star?: boolean;
    
    // Numeric & Metric targets
    start_value?: number;
    current_value?: number;
    target_value?: number;
    unit?: string;
    currency?: 'IDR' | 'USD' | string;
    
    // Psychological & WOOP Framework
    core_why?: string;
    obstacle?: string;
    obstacle_plan?: string;
    reward?: string;
    
    // Dates & Visuals
    start_date?: string | null;
    end_date?: string | null;
    cover_image_url?: string;
    milestones?: GoalMilestone[];
    is_saving?: boolean;

    // Cross-Domain Habit Engine (Leading Measures)
    linked_habits?: LinkedHabitEngine[];
}

export interface LinkedHabitEngine {
    id: number | string;
    name: string;
    icon: string;
    color?: string;
    consistencyPercent: number;
    streak: number;
}

export interface GoalPaceResult {
    progressPercent: number;
    daysTotal: number | null;
    daysElapsed: number | null;
    daysLeft: number | null;
    paceRatio: number | null; // Progress % / Time Elapsed %
    paceStatus: 'ahead' | 'on_track' | 'behind' | 'overdue' | 'completed' | 'no_deadline';
    paceLabel: { id: string; en: string };
    paceColor: string;
    runRateNotice: { id: string; en: string } | null;
    habitEngineNotice?: { id: string; en: string; type: 'boost' | 'warning' | 'neutral' } | null;
}

/**
 * Calculates exact progress percentage for any goal type
 */
export function calculateGoalProgress(goal: GoalItem): number {
    if (!goal) return 0;
    if (goal.status === 'completed') return 100;

    const gType = goal.type || 'milestones';

    if (gType === 'numeric' || gType === 'currency' || gType === 'habit_frequency') {
        const start = Number(goal.start_value) || 0;
        const target = Number(goal.target_value) || 0;
        const current = Number(goal.current_value) || 0;

        if (target <= start) {
            return current >= target ? 100 : 0;
        }
        const pct = ((current - start) / (target - start)) * 100;
        return Math.min(100, Math.max(0, Math.round(pct)));
    }

    if (gType === 'boolean') {
        return goal.status === 'completed' ? 100 : 0;
    }

    // Default: Milestones
    const ms = goal.milestones || [];
    if (ms.length === 0) return 0;

    // Check if weighted
    const hasCustomWeights = ms.some(m => typeof m.weight === 'number' && m.weight > 0);
    if (hasCustomWeights) {
        let totalWeight = 0;
        let completedWeight = 0;
        ms.forEach(m => {
            const w = Number(m.weight) || 1;
            totalWeight += w;
            if (m.is_completed || m.completed) {
                completedWeight += w;
            }
        });
        if (totalWeight === 0) return 0;
        return Math.min(100, Math.max(0, Math.round((completedWeight / totalWeight) * 100)));
    }

    const completedCount = ms.filter(m => m.is_completed || m.completed).length;
    return Math.min(100, Math.max(0, Math.round((completedCount / ms.length) * 100)));
}

/**
 * Calculates velocity, pace ratio, status (ahead/on track/behind), and run-rate predictions
 */
export function calculateGoalPace(goal: GoalItem): GoalPaceResult {
    const progressPercent = calculateGoalProgress(goal);

    if (progressPercent >= 100 || goal.status === 'completed') {
        return {
            progressPercent: 100,
            daysTotal: null,
            daysElapsed: null,
            daysLeft: 0,
            paceRatio: 1,
            paceStatus: 'completed',
            paceLabel: { id: 'Tercapai 🏆', en: 'Achieved 🏆' },
            paceColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
            runRateNotice: null
        };
    }

    if (!goal.end_date) {
        return {
            progressPercent,
            daysTotal: null,
            daysElapsed: null,
            daysLeft: null,
            paceRatio: null,
            paceStatus: 'no_deadline',
            paceLabel: { id: 'Tanpa Batas Waktu', en: 'No Deadline' },
            paceColor: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700',
            runRateNotice: null
        };
    }

    const now = new Date();
    const end = new Date(goal.end_date);
    const start = goal.start_date ? new Date(goal.start_date) : new Date(now.getTime() - 86400000 * 30);

    const totalDurationMs = end.getTime() - start.getTime();
    const elapsedMs = now.getTime() - start.getTime();
    const remainingMs = end.getTime() - now.getTime();

    const daysTotal = Math.max(1, Math.round(totalDurationMs / (1000 * 3600 * 24)));
    const daysElapsed = Math.max(0, Math.round(elapsedMs / (1000 * 3600 * 24)));
    const daysLeft = Math.round(remainingMs / (1000 * 3600 * 24));

    if (daysLeft < 0) {
        const overdueDays = Math.abs(daysLeft);
        return {
            progressPercent,
            daysTotal,
            daysElapsed,
            daysLeft,
            paceRatio: 0,
            paceStatus: 'overdue',
            paceLabel: { 
                id: `Lewat ${overdueDays} Hari`, 
                en: `${overdueDays}d Overdue` 
            },
            paceColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
            runRateNotice: {
                id: `Target sudah melewati batas waktu ${overdueDays} hari. Segera evaluasi atau perbarui tenggat waktu.`,
                en: `This goal is ${overdueDays} days past due. Review or reset your target deadline.`
            }
        };
    }

    const timeElapsedPercent = Math.min(100, Math.max(1, (daysElapsed / daysTotal) * 100));
    const paceRatio = progressPercent / timeElapsedPercent;

    let paceStatus: GoalPaceResult['paceStatus'] = 'on_track';
    let paceLabel = { id: 'Tepat Waktu 🟢', en: 'On Track 🟢' };
    let paceColor = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';

    if (paceRatio >= 1.25 || (progressPercent >= 50 && timeElapsedPercent <= 30)) {
        paceStatus = 'ahead';
        paceLabel = { id: 'Mendahului Jadwal 🚀', en: 'Ahead of Pace 🚀' };
        paceColor = 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30';
    } else if (paceRatio < 0.75 || (timeElapsedPercent >= 70 && progressPercent < 40)) {
        paceStatus = 'behind';
        paceLabel = { id: 'Perlu Akselerasi ⚠️', en: 'Behind Pace ⚠️' };
        paceColor = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
    }

    // Run-rate prediction for numeric/currency targets
    let runRateNotice: GoalPaceResult['runRateNotice'] = null;
    const remainingWeeks = Math.max(1, Math.ceil(daysLeft / 7));
    const remainingMonths = Math.max(1, Math.ceil(daysLeft / 30));

    if (goal.type === 'numeric' && goal.target_value && goal.current_value !== undefined) {
        const remainingUnits = Math.max(0, goal.target_value - (goal.current_value || 0));
        const unit = goal.unit || 'unit';
        const perWeek = (remainingUnits / remainingWeeks).toFixed(1).replace('.0', '');
        
        runRateNotice = {
            id: `Perlu rata-rata +${perWeek} ${unit}/minggu (sisa ${daysLeft} hari lagi).`,
            en: `Need approx +${perWeek} ${unit}/week (${daysLeft} days remaining).`
        };
    } else if (goal.type === 'currency' && goal.target_value && goal.current_value !== undefined) {
        const remainingAmount = Math.max(0, goal.target_value - (goal.current_value || 0));
        const curr = goal.currency || 'IDR';
        
        let formattedPerMonth = '';
        if (curr === 'IDR') {
            const perMonthVal = Math.round(remainingAmount / remainingMonths);
            formattedPerMonth = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(perMonthVal);
        } else {
            const perMonthVal = Math.round(remainingAmount / remainingMonths);
            formattedPerMonth = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(perMonthVal);
        }

        runRateNotice = {
            id: `Alokasi sekitar ${formattedPerMonth}/bulan untuk selesai tepat waktu.`,
            en: `Allocate approx ${formattedPerMonth}/month to hit target on time.`
        };
    } else if (daysLeft > 0) {
        runRateNotice = {
            id: `Tersisa ${daysLeft} hari (${remainingWeeks} minggu) menuju target.`,
            en: `${daysLeft} days (${remainingWeeks} weeks) remaining until target deadline.`
        };
    }

    // Predictive Velocity from Linked Habit Engines
    let habitEngineNotice: GoalPaceResult['habitEngineNotice'] = null;
    if (goal.linked_habits && goal.linked_habits.length > 0) {
        const totalCons = goal.linked_habits.reduce((acc, h) => acc + h.consistencyPercent, 0);
        const avgCons = Math.round(totalCons / goal.linked_habits.length);
        const habitNames = goal.linked_habits.map(h => `${h.icon} ${h.name}`).join(', ');

        if (avgCons >= 75) {
            habitEngineNotice = {
                type: 'boost',
                id: `Mesin Kebiasaan Prima (${avgCons}% konsistensi): Rutinitas [${habitNames}] memproyeksikan target tercapai lebih cepat!`,
                en: `High-Velocity Habit Engine (${avgCons}% consistency): Your routine [${habitNames}] is accelerating completion ahead of schedule!`
            };
        } else if (avgCons < 50) {
            habitEngineNotice = {
                type: 'warning',
                id: `Hambatan Rutinitas (${avgCons}% konsistensi): Kebiasaan pendukung [${habitNames}] terhambat. Akselerasi kebiasaan harian Anda.`,
                en: `Habit Engine Drag (${avgCons}% consistency): Supporting routine [${habitNames}] is lagging. Tighten daily execution to stay on pace.`
            };
        } else {
            habitEngineNotice = {
                type: 'neutral',
                id: `Mesin Kebiasaan Stabil (${avgCons}% konsistensi): Didukung oleh [${habitNames}].`,
                en: `Steady Habit Engine (${avgCons}% consistency): Powered by [${habitNames}].`
            };
        }
    }

    return {
        progressPercent,
        daysTotal,
        daysElapsed,
        daysLeft,
        paceRatio,
        paceStatus,
        paceLabel,
        paceColor,
        runRateNotice,
        habitEngineNotice
    };
}

/**
 * Calculates global statistics and finds the real North Star goal
 */
export function calculateGlobalGoalStats(goals: GoalItem[]) {
    if (!goals || goals.length === 0) {
        return {
            avgProgress: 0,
            activeCount: 0,
            completedCount: 0,
            totalCount: 0,
            northStarGoal: null,
            urgentGoal: null,
            urgentDaysLeft: null,
            totalMilestones: 0,
            completedMilestones: 0,
            onTrackCount: 0,
            atRiskCount: 0,
            vitalCount: 0
        };
    }

    const activeGoals = goals.filter(g => g.status !== 'completed');
    const completedGoals = goals.filter(g => g.status === 'completed');

    let totalProgressSum = 0;
    let totalMilestones = 0;
    let completedMilestones = 0;
    let onTrackCount = 0;
    let atRiskCount = 0;
    let vitalCount = 0;

    goals.forEach(g => {
        const p = calculateGoalProgress(g);
        totalProgressSum += p;

        if (g.priority === 'vital') vitalCount++;

        const pace = calculateGoalPace(g);
        if (pace.paceStatus === 'on_track' || pace.paceStatus === 'ahead') onTrackCount++;
        if (pace.paceStatus === 'behind' || pace.paceStatus === 'overdue') atRiskCount++;

        const ms = g.milestones || [];
        totalMilestones += ms.length;
        completedMilestones += ms.filter(m => m.is_completed || m.completed).length;
    });

    const avgProgress = Math.round(totalProgressSum / goals.length);

    // 1. Identify True North Star: First explicitly pinned goal, else first Vital goal, else first active goal
    const northStarGoal = activeGoals.find(g => g.is_north_star) 
        || activeGoals.find(g => g.priority === 'vital') 
        || activeGoals[0] 
        || null;

    // 2. Identify Most Urgent Goal: Active goal with smallest non-negative daysLeft (or nearest deadline)
    const goalsWithDeadlines = activeGoals
        .filter(g => g.end_date)
        .map(g => {
            const pace = calculateGoalPace(g);
            return { goal: g, daysLeft: pace.daysLeft };
        })
        .filter(item => item.daysLeft !== null)
        .sort((a, b) => (a.daysLeft as number) - (b.daysLeft as number));

    const urgentItem = goalsWithDeadlines[0] || null;
    const urgentGoal = urgentItem ? urgentItem.goal : (northStarGoal || activeGoals[0] || null);
    const urgentDaysLeft = urgentItem ? urgentItem.daysLeft : null;

    return {
        avgProgress,
        activeCount: activeGoals.length,
        completedCount: completedGoals.length,
        totalCount: goals.length,
        northStarGoal,
        urgentGoal,
        urgentDaysLeft,
        totalMilestones,
        completedMilestones,
        onTrackCount,
        atRiskCount,
        vitalCount
    };
}
