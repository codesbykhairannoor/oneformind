import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = parseInt(session.user.id);
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T00:00:00.000Z`;
  const today = new Date(todayStr);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  try {
    // Habits — fetch with today's logs to count completed
    const habits = await prisma.habit.findMany({ 
      where: { userId, isArchived: false },
      include: {
        logs: {
          where: { date: { gte: today, lt: tomorrow } }
        }
      }
    });
    const totalHabits = habits.length;
    const completedHabits = habits.filter(h => h.logs.some(l => l.status === 'completed')).length;
    
    // Planner
    const plannerTasks = await prisma.plannerTask.findMany({
      where: { 
        userId,
        date: { gte: today, lt: tomorrow }
      }
    });

    // Finance (current month)
    const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const transactions = await prisma.financeTransaction.findMany({
      where: {
        userId,
        date: { gte: currentMonthStart }
      }
    });
    
    let expense = 0;
    let income = 0;
    transactions.forEach(t => {
      if (t.type === 'expense') expense += Number(t.amount);
      if (t.type === 'income') income += Number(t.amount);
    });

    // Goals
    const goals = await prisma.goal.findMany({ 
      where: { userId },
      include: { milestones: true },
      orderBy: { id: 'desc' },
      take: 1
    });

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

    // Journal
    const journals = await prisma.journal.findMany({
      where: {
        userId,
        date: {
          gte: today,
          lt: tomorrow
        }
      }
    });

    const response = NextResponse.json({
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
      finance: {
        expense,
        income
      },
      goals: {
        top_goal: topGoal
      },
      journal: {
        is_written: journals.length > 0,
        id: journals[0]?.id || null
      }
    });
    // Cache dashboard data privately for 60 seconds to avoid hammering DB on every page visit
    response.headers.set('Cache-Control', 'private, max-age=60, stale-while-revalidate=30');
    return response;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
