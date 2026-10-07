import { describe, it, expect } from 'vitest';
import {
  HabitItemSchema,
  HabitLogSchema,
  FinanceTransactionSchema,
  GoalItemSchema,
  PlannerTaskSchema,
  JournalEntrySchema,
  JobApplicationSchema,
  StudyCourseSchema,
  CalendarEventSchema
} from '@/lib/contracts/tranvas-contracts';

/**
 * ==============================================================================
 * TRANVAS PLATFORM: ZERO-DRIFT CONTRACT & SCHEMA VERIFICATION
 * ==============================================================================
 */

describe('Tranvas Contracts: Zero-Drift Type & Schema Enforcer', () => {
  describe('1. Habit Contracts', () => {
    it('validates a correct habit item payload', () => {
      const valid = {
        id: 1,
        name: 'Morning Run',
        period: '2026-10',
        status: 'active' as const,
      };
      const res = HabitItemSchema.safeParse(valid);
      expect(res.success).toBe(true);
    });

    it('rejects invalid period format (must be YYYY-MM)', () => {
      const invalid = {
        id: 1,
        name: 'Morning Run',
        period: '2026/10',
      };
      const res = HabitItemSchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });

    it('accepts rest (☕) and skipped (⏸️) statuses in habit logs', () => {
      const restLog = {
        habit_id: 1,
        date: '2026-10-07',
        status: 'rest' as const,
        note: 'Rest Day ☕',
      };
      const skippedLog = {
        habit_id: 1,
        date: '2026-10-08',
        status: 'skipped' as const,
      };
      expect(HabitLogSchema.safeParse(restLog).success).toBe(true);
      expect(HabitLogSchema.safeParse(skippedLog).success).toBe(true);
    });
  });

  describe('2. Finance Contracts', () => {
    it('validates legitimate income and expense transactions', () => {
      const tx = {
        id: 10,
        amount: 2500000,
        type: 'income' as const,
        category_id: 1,
        date: '2026-10-07',
        description: 'Consulting Fee',
      };
      expect(FinanceTransactionSchema.safeParse(tx).success).toBe(true);
    });

    it('strictly rejects negative or zero transaction amounts', () => {
      const negativeTx = {
        amount: -500,
        type: 'expense' as const,
        category_id: 2,
        date: '2026-10-07',
        description: 'Fraudulent negative debit',
      };
      expect(FinanceTransactionSchema.safeParse(negativeTx).success).toBe(false);
    });
  });

  describe('3. Goal Contracts', () => {
    it('validates goal with nested milestones', () => {
      const goal = {
        id: 1,
        title: 'Launch SaaS Platform v2',
        category: 'Business',
        progress: 50,
        milestones: [
          { id: 1, title: 'Deploy Staging', is_completed: true },
          { id: 2, title: 'Release to Production', is_completed: false },
        ],
      };
      expect(GoalItemSchema.safeParse(goal).success).toBe(true);
    });

    it('rejects goal progress out of bounds (> 100 or < 0)', () => {
      const overflowGoal = {
        title: 'Overflow Goal',
        category: 'Test',
        progress: 150,
      };
      expect(GoalItemSchema.safeParse(overflowGoal).success).toBe(false);
    });
  });

  describe('4. Planner Contracts', () => {
    it('enforces start_time < end_time invariant', () => {
      const valid = {
        id: 1,
        date: '2026-10-07',
        title: 'Architecture Meeting',
        start_time: '10:00',
        end_time: '11:00',
      };
      const invalid = {
        id: 2,
        date: '2026-10-07',
        title: 'Inverted Meeting',
        start_time: '14:00',
        end_time: '13:00',
      };
      expect(PlannerTaskSchema.safeParse(valid).success).toBe(true);
      expect(PlannerTaskSchema.safeParse(invalid).success).toBe(false);
    });
  });

  describe('5. Journal, Jobs, Study, Calendar Contracts', () => {
    it('validates journal mood score between 1 and 5', () => {
      expect(JournalEntrySchema.safeParse({
        date: '2026-10-07',
        title: 'Reflections',
        content: 'Great productivity day.',
        mood_score: 5,
      }).success).toBe(true);

      expect(JournalEntrySchema.safeParse({
        date: '2026-10-07',
        title: 'Reflections',
        content: 'Invalid mood score.',
        mood_score: 10,
      }).success).toBe(false);
    });

    it('validates job application stages enum', () => {
      expect(JobApplicationSchema.safeParse({
        company_name: 'Tech Corp',
        position: 'Staff Engineer',
        stage: 'offer' as const,
        applied_date: '2026-10-01',
      }).success).toBe(true);
    });

    it('validates study course module counts', () => {
      expect(StudyCourseSchema.safeParse({
        title: 'Advanced Distributed Systems',
        platform: 'MIT OpenCourseWare',
        total_modules: 12,
        completed_modules: 6,
      }).success).toBe(true);
    });

    it('validates calendar event source enum', () => {
      expect(CalendarEventSchema.safeParse({
        title: 'Product Launch Stream',
        start_date: '2026-10-07T10:00:00Z',
        end_date: '2026-10-07T11:00:00Z',
        module_source: 'planner' as const,
      }).success).toBe(true);
    });
  });
});
