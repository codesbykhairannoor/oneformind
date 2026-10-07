/**
 * ==============================================================================
 * TRANVAS PLATFORM: ZERO-DRIFT CONTRACT & SCHEMA ENGINE
 * ==============================================================================
 * Architecture: End-to-End Type Safety & Data Contract Assurance
 * Standard: Eliminates Seam Mismatches between Frontend UI and Backend Database.
 * ==============================================================================
 */

import { z } from 'zod';

// ------------------------------------------------------------------------------
// 1. HABITS CONTRACT
// ------------------------------------------------------------------------------
export const HabitLogStatusSchema = z.enum([
  'completed',
  'skipped',
  'rest',
  'failed',
  'empty'
]);

export const HabitItemSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(100),
  icon: z.string().default('🌱'),
  color: z.string().default('#10b981'),
  period: z.string().regex(/^\d{4}-\d{2}$/, 'Period must be in YYYY-MM format'),
  is_numeric: z.boolean().default(false),
  numeric_target: z.number().nonnegative().optional(),
  numeric_unit: z.string().max(20).optional(),
  is_archived: z.boolean().default(false),
  status: z.enum(['active', 'archived', 'graduated']).default('active'),
  goal_id: z.number().int().positive().nullable().optional(),
  goal_title: z.string().optional(),
});

export const HabitLogSchema = z.object({
  id: z.number().int().positive().optional(),
  habit_id: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be ISO YYYY-MM-DD'),
  status: HabitLogStatusSchema,
  value: z.number().nonnegative().optional(),
  note: z.string().max(500).optional(),
});

// ------------------------------------------------------------------------------
// 2. FINANCE CONTRACT
// ------------------------------------------------------------------------------
export const FinanceTransactionSchema = z.object({
  id: z.number().int().positive().optional(),
  amount: z.number().positive('Transaction amount must be strictly greater than 0'),
  type: z.enum(['income', 'expense']),
  category_id: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be ISO YYYY-MM-DD'),
  description: z.string().max(255),
  idempotency_key: z.string().uuid().optional(),
});

export const FinanceBudgetSchema = z.object({
  id: z.number().int().positive().optional(),
  category_id: z.number().int().positive(),
  month: z.string().regex(/^\d{4}-\d{2}$/, 'Month must be YYYY-MM'),
  amount_limit: z.number().positive(),
  spent: z.number().nonnegative().default(0),
});

// ------------------------------------------------------------------------------
// 3. GOALS CONTRACT
// ------------------------------------------------------------------------------
export const GoalMilestoneSchema = z.object({
  id: z.number().int().positive().optional(),
  goal_id: z.number().int().positive().optional(),
  title: z.string().min(1).max(200),
  is_completed: z.boolean().default(false),
  completed_at: z.string().nullable().optional(),
});

export const GoalItemSchema = z.object({
  id: z.number().int().positive().optional(),
  title: z.string().min(1).max(200),
  category: z.string().min(1),
  target_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  progress: z.number().min(0).max(100).default(0),
  status: z.enum(['not_started', 'in_progress', 'completed', 'archived']).default('in_progress'),
  milestones: z.array(GoalMilestoneSchema).default([]),
});

// ------------------------------------------------------------------------------
// 4. PLANNER CONTRACT
// ------------------------------------------------------------------------------
export const PlannerTaskSchema = z.object({
  id: z.number().int().positive().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  title: z.string().min(1).max(255),
  priority: z.enum(['high', 'medium', 'low']).default('medium'),
  is_completed: z.boolean().default(false),
  start_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
  end_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
}).refine(
  (data) => {
    if (data.start_time && data.end_time) {
      return data.start_time < data.end_time;
    }
    return true;
  },
  { message: 'start_time must be strictly before end_time', path: ['end_time'] }
);

// ------------------------------------------------------------------------------
// 5. JOURNAL CONTRACT
// ------------------------------------------------------------------------------
export const JournalEntrySchema = z.object({
  id: z.number().int().positive().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  mood_score: z.number().int().min(1).max(5).default(3),
  tags: z.array(z.string()).default([]),
});

// ------------------------------------------------------------------------------
// 6. JOBS CONTRACT
// ------------------------------------------------------------------------------
export const JobApplicationSchema = z.object({
  id: z.number().int().positive().optional(),
  company_name: z.string().min(1).max(100),
  position: z.string().min(1).max(100),
  stage: z.enum(['applied', 'screening', 'interview', 'offer', 'rejected']).default('applied'),
  applied_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  salary_offered: z.number().nonnegative().optional(),
});

// ------------------------------------------------------------------------------
// 7. STUDY CONTRACT
// ------------------------------------------------------------------------------
export const StudyCourseSchema = z.object({
  id: z.number().int().positive().optional(),
  title: z.string().min(1).max(200),
  platform: z.string().min(1).max(100),
  total_modules: z.number().int().positive(),
  completed_modules: z.number().int().nonnegative().default(0),
  certificate_url: z.string().url().nullable().optional(),
});

// ------------------------------------------------------------------------------
// 8. CALENDAR CONTRACT
// ------------------------------------------------------------------------------
export const CalendarEventSchema = z.object({
  id: z.number().int().positive().optional(),
  title: z.string().min(1).max(200),
  start_date: z.string(),
  end_date: z.string(),
  is_all_day: z.boolean().default(false),
  module_source: z.enum(['planner', 'habits', 'goals', 'custom']).default('custom'),
});

// Export Type Inferences
export type HabitItemContract = z.infer<typeof HabitItemSchema>;
export type HabitLogContract = z.infer<typeof HabitLogSchema>;
export type FinanceTransactionContract = z.infer<typeof FinanceTransactionSchema>;
export type GoalItemContract = z.infer<typeof GoalItemSchema>;
export type PlannerTaskContract = z.infer<typeof PlannerTaskSchema>;
export type JournalEntryContract = z.infer<typeof JournalEntrySchema>;
export type JobApplicationContract = z.infer<typeof JobApplicationSchema>;
export type StudyCourseContract = z.infer<typeof StudyCourseSchema>;
export type CalendarEventContract = z.infer<typeof CalendarEventSchema>;
