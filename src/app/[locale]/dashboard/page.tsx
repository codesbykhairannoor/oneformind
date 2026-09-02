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

    // Fetch data from Go API in parallel (no Prisma!)
    const [habitsData, tasksData, transactionsData, goalsData, journalsData] = await Promise.all([
        goFetchJson<any[]>('habits', `month=${monthStr}`),
        goFetchJson<any[]>('planner-tasks', `date=${todayStr}`),
        goFetchJson<any[]>('finance-transactions', `month=${monthStr}`),
        goFetchJson<any[]>('goals', ''),
        goFetchJson<any[]>('journals', `date=${todayStr}`),
    ]);

    const habits = habitsData[0] || [];
    const plannerTasks = tasksData[0] || [];
    const transactions = transactionsData[0] || [];
    const goals = goalsData[0] || [];
    const journals = journalsData[0] || [];

    // Habits calculation
    const totalHabits = habits.length;
    const completedHabits = habits.filter((h: any) =>
        h.logs?.some((l: any) => l.status === 'completed' && l.date?.startsWith(todayStr))
    ).length;

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
        topGoal = { title: g.title, percent };
    } else {
        topGoal = { title: 'Belum ada Goal', percent: 0 };
    }

    const synergy = {
        date_formatted: now.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        }),
        habits: {
            completed: completedHabits,
            total: totalHabits,
            percent: totalHabits === 0 ? 0 : Math.round((completedHabits / totalHabits) * 100)
        },
        planner: {
            total: plannerTasks.length,
            completed: plannerTasks.filter((t: any) => t.isCompleted || t.is_completed).length,
            upcoming: plannerTasks
                .filter((t: any) => !(t.isCompleted || t.is_completed))
                .slice(0, 4)
                .map((t: any) => ({
                    id: t.id,
                    title: t.title,
                    type: t.type,
                    start_time: t.startTime || t.start_time
                        ? new Date(t.startTime || t.start_time).toISOString().substring(11, 16)
                        : null,
                    isCompleted: t.isCompleted || t.is_completed,
                }))
        },
        finance: { expense, income },
        goals: { top_goal: topGoal },
        journal: {
            is_written: journals.length > 0,
            id: journals[0]?.id || null
        }
    };

    const clientUser = {
        name: user.user_metadata?.name || user.user_metadata?.full_name || 'User',
        email: user.email || '',
        plan_type: 'Architect',
    };

    return <DashboardClient user={clientUser} synergy={synergy} locale={locale} />;
}
