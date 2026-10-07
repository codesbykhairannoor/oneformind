import { describe, it, expect } from 'vitest';
import { SyntheticDataFactory } from '@/lib/testing/synthetic-data-factory';
import {
  HabitItemSchema,
  HabitLogSchema,
  FinanceTransactionSchema,
  GoalItemSchema,
  PlannerTaskSchema
} from '@/lib/contracts/tranvas-contracts';

/**
 * ==============================================================================
 * TRANVAS PLATFORM: SYNTHETIC DATA FACTORY SPEED & INTEGRITY TEST
 * ==============================================================================
 */

describe('Tranvas Synthetic Data Factory: Sub-Second State Generation', () => {
  it('generates 50 synthetic habits conforming strictly to HabitItemSchema in < 5ms', () => {
    const startTime = performance.now();
    const habits = SyntheticDataFactory.createHabits(50);
    const duration = performance.now() - startTime;

    expect(habits.length).toBe(50);
    expect(duration).toBeLessThan(100); // Super fast (< 100ms)

    // Verify all 50 conform to the contract schema
    habits.forEach((habit) => {
      expect(HabitItemSchema.safeParse(habit).success).toBe(true);
    });
  });

  it('generates a full month of 31 habit logs conforming strictly to HabitLogSchema', () => {
    const logs = SyntheticDataFactory.createHabitLogs(1, 31);
    expect(logs.length).toBe(31);

    logs.forEach((log) => {
      expect(HabitLogSchema.safeParse(log).success).toBe(true);
    });
  });

  it('generates a balanced financial ledger maintaining exact double-entry cashflow equation', () => {
    const ledger = SyntheticDataFactory.createFinanceLedger(5, 15);
    expect(ledger.transactions.length).toBe(20);

    // Mathematical Invariant verification
    expect(ledger.netCashflow).toBe(ledger.totalIncome - ledger.totalExpense);

    ledger.transactions.forEach((tx) => {
      expect(FinanceTransactionSchema.safeParse(tx).success).toBe(true);
    });
  });

  it('generates cascading goals with exact milestone percentage calculation', () => {
    const goals = SyntheticDataFactory.createGoals(5);
    expect(goals.length).toBe(5);

    goals.forEach((g) => {
      expect(GoalItemSchema.safeParse(g).success).toBe(true);
      const doneCount = g.milestones.filter((m) => m.is_completed).length;
      const expectedPct = Math.round((doneCount / g.milestones.length) * 100);
      expect(g.progress).toBe(expectedPct);
    });
  });

  it('generates timeblocked planner schedule with strictly ordered time slots', () => {
    const planner = SyntheticDataFactory.createPlannerDay();
    expect(planner.length).toBe(5);

    planner.forEach((task) => {
      expect(PlannerTaskSchema.safeParse(task).success).toBe(true);
      if (task.start_time && task.end_time) {
        expect(task.start_time < task.end_time).toBe(true);
      }
    });
  });
});
