/**
 * ==============================================================================
 * TRANVAS PLATFORM: SYNTHETIC DATA FACTORY & STATE GENERATOR
 * ==============================================================================
 * Purpose: Generates high-speed, mathematically-sound, realistic test datasets
 * for stress testing, property testing, and local development.
 * ==============================================================================
 */

import {
  HabitItemContract,
  HabitLogContract,
  FinanceTransactionContract,
  GoalItemContract,
  PlannerTaskContract
} from '../contracts/tranvas-contracts';

export class SyntheticDataFactory {
  /**
   * Generates N synthetic habits with realistic icons, colors, and types
   */
  static createHabits(count: number = 5, month: string = '2026-10'): HabitItemContract[] {
    const icons = ['🔥', '🧘‍♂️', '💻', '📚', '🏃‍♂️', '💧', '🥗', '⚡'];
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];
    const names = [
      'Deep Work (2 Hours)',
      'Gym & Cardio',
      'Read 20 Pages',
      'Hydration 3 Liters',
      'Clean Eating',
      'Meditation & Reflection',
      'Duolingo Practice',
      'Code Commit Daily'
    ];

    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: names[i % names.length] || `Habit Routine #${i + 1}`,
      icon: icons[i % icons.length],
      color: colors[i % colors.length],
      period: month,
      is_numeric: i % 3 === 0,
      numeric_target: i % 3 === 0 ? 100 : undefined,
      numeric_unit: i % 3 === 0 ? 'mins' : undefined,
      is_archived: false,
      status: 'active' as const,
      goal_id: i % 2 === 0 ? 10 + i : null,
      goal_title: i % 2 === 0 ? `Target Milestone ${i + 1}` : undefined
    }));
  }

  /**
   * Generates a realistic month of habit logs with streaks, rests, and skips
   */
  static createHabitLogs(habitId: number, daysInMonth: number = 31, month: string = '2026-10'): HabitLogContract[] {
    const statuses: ('completed' | 'skipped' | 'rest' | 'empty')[] = [
      'completed', 'completed', 'completed', 'rest', 'completed', 'skipped', 'empty'
    ];

    return Array.from({ length: daysInMonth }, (_, dayIdx) => {
      const dayNum = String(dayIdx + 1).padStart(2, '0');
      const date = `${month}-${dayNum}`;
      const status = statuses[dayIdx % statuses.length];

      return {
        habit_id: habitId,
        date,
        status,
        note: status === 'rest' ? 'Rest Day ☕' : status === 'skipped' ? 'Paused ⏸️' : undefined
      };
    });
  }

  /**
   * Generates a balanced financial transaction ledger
   * Guarantees Invariant: Net Cash Flow == Total Income - Total Expense
   */
  static createFinanceLedger(incomeCount: number = 3, expenseCount: number = 10, month: string = '2026-10'): {
    transactions: FinanceTransactionContract[];
    totalIncome: number;
    totalExpense: number;
    netCashflow: number;
  } {
    let idCounter = 1;
    const transactions: FinanceTransactionContract[] = [];

    let totalIncome = 0;
    for (let i = 0; i < incomeCount; i++) {
      const amount = (i + 1) * 5_000_000; // e.g. Rp 5.000.000, 10.000.000
      totalIncome += amount;
      transactions.push({
        id: idCounter++,
        amount,
        type: 'income',
        category_id: 1,
        date: `${month}-0${i + 1}`,
        description: `Client Retainer & Salary #${i + 1}`
      });
    }

    let totalExpense = 0;
    for (let i = 0; i < expenseCount; i++) {
      const amount = (i + 1) * 350_000;
      totalExpense += amount;
      transactions.push({
        id: idCounter++,
        amount,
        type: 'expense',
        category_id: 2,
        date: `${month}-${String(i + 5).padStart(2, '0')}`,
        description: `Operational Expense #${i + 1}`
      });
    }

    const netCashflow = totalIncome - totalExpense;

    return {
      transactions,
      totalIncome,
      totalExpense,
      netCashflow
    };
  }

  /**
   * Generates goals with nested milestones and mathematically exact progress percentage
   */
  static createGoals(count: number = 3): GoalItemContract[] {
    return Array.from({ length: count }, (_, i) => {
      const milestoneCount = (i + 1) * 2; // 2, 4, 6 milestones
      const completedCount = i + 1; // 1, 2, 3 completed

      const milestones = Array.from({ length: milestoneCount }, (_, mIdx) => ({
        id: (i * 10) + mIdx + 1,
        title: `Sprint Step #${mIdx + 1}`,
        is_completed: mIdx < completedCount
      }));

      const progress = Math.round((completedCount / milestoneCount) * 100);

      return {
        id: i + 1,
        title: `Strategic Goal Q4 #${i + 1}`,
        category: 'Business Growth',
        target_date: '2026-12-31',
        progress,
        status: progress === 100 ? ('completed' as const) : ('in_progress' as const),
        milestones
      };
    });
  }

  /**
   * Generates a full day of timeblocked planner tasks
   */
  static createPlannerDay(date: string = '2026-10-07'): PlannerTaskContract[] {
    return [
      { id: 1, date, title: 'Morning Planning & Standup', priority: 'high', is_completed: true, start_time: '08:00', end_time: '08:30' },
      { id: 2, date, title: 'Deep Work: Platform Engineering', priority: 'high', is_completed: true, start_time: '09:00', end_time: '12:00' },
      { id: 3, date, title: 'Lunch & Workout', priority: 'medium', is_completed: true, start_time: '12:00', end_time: '13:30' },
      { id: 4, date, title: 'Code Reviews & Client Delivery', priority: 'medium', is_completed: false, start_time: '14:00', end_time: '16:00' },
      { id: 5, date, title: 'Evening Review & Next-Day Prep', priority: 'low', is_completed: false, start_time: '17:00', end_time: '17:30' },
    ];
  }
}
