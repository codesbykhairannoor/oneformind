import { getLocale, getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import DashboardClient from './DashboardClient';
import { redirect } from 'next/navigation';

export async function generateMetadata() {
    const t = await getTranslations();
    return {
        title: `Dashboard - OneForMind`,
    };
}

export default async function DashboardPage() {
    const session = await auth();
    const locale = await getLocale();

    if (!session?.user?.id) {
        redirect(`/${locale}/login`);
    }

    const userId = parseInt(session.user.id);
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T00:00:00.000Z`;
    const today = new Date(todayStr);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Run queries in parallel for maximum performance
    const [habits, plannerTasks, transactions, goals, journals] = await Promise.all([
        prisma.habit.findMany({ 
            where: { userId, isArchived: false },
            include: {
                logs: {
                    where: { date: { gte: today, lt: tomorrow } }
                }
            }
        }),
        prisma.plannerTask.findMany({
            where: { 
                userId,
                date: { gte: today, lt: tomorrow }
            }
        }),
        prisma.financeTransaction.findMany({
            where: {
                userId,
                date: { gte: new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1)) }
            }
        }),
        prisma.goal.findMany({ 
            where: { userId },
            include: { milestones: true },
            orderBy: { id: 'desc' },
            take: 1
        }),
        prisma.journal.findMany({
            where: {
                userId,
                date: { gte: today, lt: tomorrow }
            }
        })
    ]);

    // Habits calculation
    const totalHabits = habits.length;
    const completedHabits = habits.filter(h => h.logs.some(l => l.status === 'completed')).length;

    // Finance calculation
    let expense = 0;
    let income = 0;
    transactions.forEach(t => {
        if (t.type === 'expense') expense += Number(t.amount);
        if (t.type === 'income') income += Number(t.amount);
    });

    // Goals calculation
    let topGoal = null;
    if (goals.length > 0) {
        const g = goals[0];
        const ms = g.milestones || [];
        const comp = ms.filter(m => m.completed).length;
        const percent = ms.length === 0 ? 0 : Math.round((comp / ms.length) * 100);
        topGoal = { title: g.title, percent };
    } else {
        topGoal = { title: 'Belum ada Goal', percent: 0 };
    }

    const synergy = {
        date_formatted: now.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
        habits: {
            completed: completedHabits,
            total: totalHabits,
            percent: totalHabits === 0 ? 0 : Math.round((completedHabits / totalHabits) * 100)
        },
        planner: {
            total: plannerTasks.length,
            completed: plannerTasks.filter(t => t.isCompleted).length,
            upcoming: plannerTasks.filter(t => !t.isCompleted).slice(0, 4).map(t => ({
                id: t.id,
                title: t.title,
                type: t.type,
                start_time: t.startTime 
                    ? new Date(t.startTime).toISOString().substring(11, 16)
                    : null,
                isCompleted: t.isCompleted,
            }))
        },
        finance: { expense, income },
        goals: { top_goal: topGoal },
        journal: {
            is_written: journals.length > 0,
            id: journals[0]?.id || null
        }
    };

    const user = {
        name: session.user.name || 'User',
        email: session.user.email || '',
        plan_type: 'Architect',
    };

    return <DashboardClient user={user} synergy={synergy} locale={locale} />;
}
