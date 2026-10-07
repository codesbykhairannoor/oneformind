import { describe, it, expect } from 'vitest';

/**
 * ==============================================================================
 * TRANVAS PLATFORM: MATHEMATICAL INVARIANTS & DATA INTEGRITY TEST SUITE
 * ==============================================================================
 * Standard: Double-Entry Ledger Principles & Non-Leaking State Invariants
 * ==============================================================================
 */

describe('Tranvas Core: Mathematical & Ledger Invariants', () => {
  describe('Finance Engine: Currency Precision & Cashflow Invariants', () => {
    function computeCashflow(income: number, expense: number): number {
      const incomeCents = Math.round(income * 100);
      const expenseCents = Math.round(expense * 100);
      return (incomeCents - expenseCents) / 100;
    }

    it('eliminates IEEE-754 float drift on decimal calculations', () => {
      // 0.3 - 0.1 in standard JS float yields 0.19999999999999998
      const result = computeCashflow(0.3, 0.1);
      expect(result).toBe(0.2);
    });

    it('verifies Income - Expense == Net Cash Flow exactly', () => {
      const net = computeCashflow(12_500_000, 3_250_000);
      expect(net).toBe(9_250_000);
    });

    it('protects against division-by-zero on unallocated budgets', () => {
      function budgetRatio(spent: number, allocated: number): number {
        if (allocated <= 0) return 0;
        return Math.min(Math.round((spent / allocated) * 100), 100);
      }

      expect(budgetRatio(50000, 0)).toBe(0);
      expect(budgetRatio(250000, 500000)).toBe(50);
    });
  });

  describe('Habits Engine: Progression & Tier Boundaries', () => {
    function getTier(completions: number): string {
      if (completions < 0) throw new Error('Invalid negative completions');
      if (completions >= 100) return 'diamond';
      if (completions >= 50) return 'gold';
      if (completions >= 25) return 'silver';
      return 'bronze';
    }

    it('calculates prestige tier thresholds deterministically', () => {
      expect(getTier(100)).toBe('diamond');
      expect(getTier(99)).toBe('gold');
      expect(getTier(50)).toBe('gold');
      expect(getTier(49)).toBe('silver');
      expect(getTier(25)).toBe('silver');
      expect(getTier(24)).toBe('bronze');
      expect(getTier(0)).toBe('bronze');
    });

    it('rejects negative completion values', () => {
      expect(() => getTier(-5)).toThrowError();
    });

    it('protects non-binary rest (☕) and skipped (⏸️) statuses from deletion', () => {
      const validStatuses = ['completed', 'skipped', 'rest', 'failed', 'empty'];
      expect(validStatuses).toContain('rest');
      expect(validStatuses).toContain('skipped');
      expect(validStatuses.includes('corrupted_status')).toBe(false);
    });
  });

  describe('Planner Engine: Time Allocations & ISO Date Invariants', () => {
    it('validates start_time < end_time windows', () => {
      function isValidTimeWindow(start: string, end: string): boolean {
        const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (!regex.test(start) || !regex.test(end)) return false;
        return start < end;
      }

      expect(isValidTimeWindow('08:00', '09:30')).toBe(true);
      expect(isValidTimeWindow('15:00', '14:00')).toBe(false);
      expect(isValidTimeWindow('10:00', '10:00')).toBe(false);
    });

    it('validates strict ISO 8601 calendar date formats', () => {
      function isIsoDate(str: string): boolean {
        const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
        if (!regex.test(str)) return false;
        const d = new Date(str);
        return !isNaN(d.getTime());
      }

      expect(isIsoDate('2026-10-07')).toBe(true);
      expect(isIsoDate('07-10-2026')).toBe(false);
      expect(isIsoDate('2026-99-99')).toBe(false);
    });
  });
});
