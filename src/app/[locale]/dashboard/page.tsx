import { getLocale } from 'next-intl/server';
import { createClient } from '@/utils/supabase/server';
import DashboardClient from './DashboardClient';
import { redirect } from 'next/navigation';
import { goFetchJson } from '@/lib/go-fetch';

export async function generateMetadata() {
    return {
        title: `Dashboard - Tranvas`,
    };
}

export default async function DashboardPage() {
    const locale = await getLocale();

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.email) {
        redirect(`/${locale}/login`);
    }

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const monthStr = todayStr.substring(0, 7); // YYYY-MM

    // Fetch data from Go API in parallel
    const [habitsData, tasksData, transactionsData, goalsData, journalsData, userData] = await Promise.all([
        goFetchJson<any[]>('habits', `month=${monthStr}`),
        goFetchJson<any[]>('planner-tasks', `date=${todayStr}`),
        goFetchJson<any[]>('finance-transactions', `month=${monthStr}`),
        goFetchJson<any[]>('goals', ''),
        goFetchJson<any[]>('journals', `date=${todayStr}`),
        goFetchJson<any>('user', ''),
    ]);

    const habits = habitsData[0] || [];
    const plannerTasks = tasksData[0] || [];
    const transactions = transactionsData[0] || [];
    const goals = goalsData[0] || [];
    const journals = journalsData[0] || [];
    const userProfile = userData[0] || {};

    // Habits calculation for today
    const totalHabits = habits.length;
    const todayHabitsList = habits.map((h: any) => {
        const isDone = h.logs?.some((l: any) => l.status === 'completed' && l.date?.startsWith(todayStr));
        return {
            id: h.id,
            name: h.name,
            icon: h.icon || '🌱',
            color: h.color || '#6366f1',
            isCompleted: isDone
        };
    });
    const completedHabits = todayHabitsList.filter((h: any) => h.isCompleted).length;

    // Real 7-day trend calculation
    const daysArr: { day: string; fullDate: string; score: number }[] = [];
    const dayNamesId = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayNames = locale === 'id' ? dayNamesId : dayNamesEn;

    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dStr = d.toISOString().split('T')[0];
        const dayLabel = dayNames[d.getDay()];

        const completedOnDay = habits.filter((h: any) =>
            h.logs?.some((l: any) => l.status === 'completed' && l.date?.startsWith(dStr))
        ).length;

        const score = totalHabits > 0 ? Math.round((completedOnDay / totalHabits) * 100) : 0;
        daysArr.push({
            day: dayLabel,
            fullDate: dStr,
            score: score
        });
    }

    // Finance calculation
    let expense = 0;
    let income = 0;
    transactions.forEach((t: any) => {
        if (t.type === 'expense') expense += Number(t.amount);
        if (t.type === 'income') income += Number(t.amount);
    });

    // Goals calculation
    let topGoal = null;
    if (goals.length > 0) {
        const g = goals[0];
        const ms = g.milestones || [];
        const comp = ms.filter((m: any) => m.completed).length;
        const percent = ms.length === 0 ? 0 : Math.round((comp / ms.length) * 100);
        topGoal = { id: g.id, title: g.title, percent, totalMilestones: ms.length, completedMilestones: comp };
    } else {
        topGoal = null;
    }

    // Parse Study & Knowledge settings
    let userSettings: any = {};
    if (typeof userProfile.settings === 'string') {
        try {
            userSettings = JSON.parse(userProfile.settings);
        } catch {}
    } else if (userProfile.settings && typeof userProfile.settings === 'object') {
        userSettings = userProfile.settings;
    }

    const studyAssignments: any[] = Array.isArray(userSettings.study_assignments) ? userSettings.study_assignments : [];
    const studyBooks: any[] = Array.isArray(userSettings.study_books) ? userSettings.study_books : [];
    const studyReadingGoal = userSettings.study_reading_goal || { year: now.getFullYear(), target_books: 20 };
    const studyFocusStats = userSettings.study_focus_stats || { completedSessions: 0, totalFocusMinutes: 0 };

    // Filter upcoming assignments: not done, sorted nearest
    const upcomingAssignments = studyAssignments
        .filter((a: any) => a.status !== 'done')
        .sort((a: any, b: any) => {
            const dateA = a.deadline ? new Date(a.deadline).getTime() : Infinity;
            const dateB = b.deadline ? new Date(b.deadline).getTime() : Infinity;
            return dateA - dateB;
        })
        .slice(0, 3);

    // Active currently reading book
    const activeReadingBook = studyBooks.find((b: any) => b.status === 'reading') || (studyBooks.length > 0 ? studyBooks[0] : null);
    const completedBooksCount = studyBooks.filter((b: any) => b.status === 'completed').length;

    const synergy = {
        date_formatted: now.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        }),
        habits: {
            completed: completedHabits,
            total: totalHabits,
            percent: totalHabits === 0 ? 0 : Math.round((completedHabits / totalHabits) * 100),
            todayList: todayHabitsList
        },
        planner: {
            total: plannerTasks.length,
            completed: plannerTasks.filter((t: any) => t.isCompleted || t.is_completed).length,
            upcoming: plannerTasks
                .map((t: any) => ({
                    id: t.id,
                    title: t.title,
                    type: t.type,
                    start_time: t.startTime || t.start_time
                        ? new Date(t.startTime || t.start_time).toISOString().substring(11, 16)
                        : null,
                    end_time: t.endTime || t.end_time
                        ? new Date(t.endTime || t.end_time).toISOString().substring(11, 16)
                        : null,
                    isCompleted: Boolean(t.isCompleted || t.is_completed),
                }))
        },
        finance: { expense, income, net: income - expense },
        goals: { top_goal: topGoal, total_goals: goals.length },
        journal: {
            is_written: journals.length > 0,
            id: journals[0]?.id || null,
            mood: journals[0]?.mood || null
        },
        study: {
            upcoming_assignments: upcomingAssignments,
            active_book: activeReadingBook,
            reading_goal: studyReadingGoal,
            completed_books_count: completedBooksCount,
            total_books_count: studyBooks.length,
            focus_stats: studyFocusStats
        },
        trend: daysArr
    };

    const clientUser = {
        name: userProfile.name || user.user_metadata?.name || user.user_metadata?.full_name || 'User',
        email: userProfile.email || user.email || '',
        plan_type: userProfile.planType || userProfile.plan_type || (user as any).planType || 'explorer',
        isPremium: userProfile.isPremium || false,
        created_at: user.created_at || new Date().toISOString(),
    };

    return <DashboardClient user={clientUser} synergy={synergy} locale={locale} />;
}
