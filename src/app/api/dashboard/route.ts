import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = parseInt(session.user.id);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  try {
    // Habits
    const habits = await prisma.habit.findMany({ where: { userId } });
    let totalHabits = habits.length;
    let completedHabits = 0;
    
    // Planner
    const plannerTasks = await prisma.plannerTask.findMany({
      where: { 
        userId,
        date: today
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

    return NextResponse.json({
      habits: {
        completed: completedHabits,
        total: totalHabits,
        percent: totalHabits === 0 ? 0 : Math.round((completedHabits / totalHabits) * 100)
      },
      planner: {
        total: plannerTasks.length,
        upcoming: plannerTasks.filter(t => !t.isCompleted).slice(0, 4)
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
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
