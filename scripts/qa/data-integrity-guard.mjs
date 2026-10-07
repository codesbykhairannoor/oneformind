/**
 * ==============================================================================
 * ONEFORMIND SDET QUALITY NET: MATHEMATICAL INVARIANTS & DATA INTEGRITY GUARD
 * ==============================================================================
 * Standard: SDET Case Study Principle #2:
 * "Correctness is about data and outcome, not the screen.
 * A feature that shows the right thing while storing or computing the wrong thing
 * underneath is a serious defect, not a cosmetic one. Any data-integrity issue is at least P1."
 * ==============================================================================
 */

console.log("\n================================================================================");
console.log("📐  SDET SUITE 3: MATHEMATICAL INVARIANTS & DATA INTEGRITY GUARD");
console.log("================================================================================\n");

let passed = 0;
let failed = 0;

function assertCheck(condition, testName, details = '') {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName} ${details ? `-> ${details}` : ''}`);
    failed++;
  }
}

// ------------------------------------------------------------------------------
// 1. FINANCIAL MATHEMATICAL INVARIANTS & PRECISION
// ------------------------------------------------------------------------------
console.log("--- 1. Finance Mathematical Invariants & Precision Guard ---");

function calculateNetCashflow(income, expense) {
  // Safe integer cents calculation to avoid IEEE-754 floating point corruption
  const incomeCents = Math.round(income * 100);
  const expenseCents = Math.round(expense * 100);
  return (incomeCents - expenseCents) / 100;
}

function calculateNetWorth(assets, liabilities) {
  const assetCents = Math.round(assets * 100);
  const liabilityCents = Math.round(liabilities * 100);
  return (assetCents - liabilityCents) / 100;
}

function calculateBudgetUsage(spent, budgetLimit) {
  if (budgetLimit <= 0) return 0; // Division-by-zero protection
  return Math.min(Math.round((spent / budgetLimit) * 100), 100);
}

// Test Float Precision: 0.1 + 0.2 floating point check
const floatTest = calculateNetCashflow(0.3, 0.1);
assertCheck(floatTest === 0.2, 'Finance Precision: Float subtraction 0.3 - 0.1 evaluates strictly to 0.2 (No 0.19999999999999998)');

const normalCashflow = calculateNetCashflow(15000000, 4500000);
assertCheck(normalCashflow === 10500000, 'Finance Cashflow: Income - Expense == Net Cash Flow (15M - 4.5M = 10.5M)');

const netWorth = calculateNetWorth(250000000, 50000000);
assertCheck(netWorth === 200000000, 'Finance Net Worth: Assets - Liabilities == Net Worth (250M - 50M = 200M)');

const budgetZeroLimit = calculateBudgetUsage(50000, 0);
assertCheck(budgetZeroLimit === 0, 'Finance Division-by-Zero: Zero budget limit evaluates safely to 0% without NaN/Infinity');

const budgetNormalUsage = calculateBudgetUsage(750000, 1000000);
assertCheck(budgetNormalUsage === 75, 'Finance Budget Ratio: 750k / 1M evaluates exactly to 75%');

// ------------------------------------------------------------------------------
// 2. HABITS LIFECYCLE & TIER INVARIANTS
// ------------------------------------------------------------------------------
console.log("\n--- 2. Habit Lifecycle, Streaks & Tier Boundaries ---");

function determineHabitTier(completions) {
  if (completions < 0) throw new Error('Completions cannot be negative');
  if (completions >= 100) return 'diamond';
  if (completions >= 50) return 'gold';
  if (completions >= 25) return 'silver';
  return 'bronze';
}

function validateHabitStatus(status) {
  const ALLOWED_STATUSES = ['completed', 'skipped', 'rest', 'failed', 'empty'];
  return ALLOWED_STATUSES.includes(status);
}

assertCheck(determineHabitTier(100) === 'diamond', 'Habit Tier Boundary: 100 completions is Diamond');
assertCheck(determineHabitTier(99) === 'gold', 'Habit Tier Boundary: 99 completions is Gold');
assertCheck(determineHabitTier(50) === 'gold', 'Habit Tier Boundary: 50 completions is Gold');
assertCheck(determineHabitTier(49) === 'silver', 'Habit Tier Boundary: 49 completions is Silver');
assertCheck(determineHabitTier(25) === 'silver', 'Habit Tier Boundary: 25 completions is Silver');
assertCheck(determineHabitTier(24) === 'bronze', 'Habit Tier Boundary: 24 completions is Bronze');
assertCheck(determineHabitTier(0) === 'bronze', 'Habit Tier Boundary: 0 completions is Bronze');

let negativeErrorCaught = false;
try {
  determineHabitTier(-1);
} catch (e) {
  negativeErrorCaught = true;
}
assertCheck(negativeErrorCaught, 'Habit Invariant: Negative completion count is strictly rejected');

assertCheck(validateHabitStatus('completed'), 'Habit Status: "completed" is valid enum');
assertCheck(validateHabitStatus('rest'), 'Habit Status: "rest" (☕) is valid enum');
assertCheck(validateHabitStatus('skipped'), 'Habit Status: "skipped" (⏸️) is valid enum');
assertCheck(!validateHabitStatus('corrupted_status'), 'Habit Status: Arbitrary status string rejected');

// ------------------------------------------------------------------------------
// 3. GOALS MILESTONE COMPLETION & PROGRESS INTEGRITY
// ------------------------------------------------------------------------------
console.log("\n--- 3. Goal Hierarchy & Progress Invariants ---");

function calculateGoalProgress(milestones) {
  if (!milestones || milestones.length === 0) return 0;
  const completed = milestones.filter(m => m.is_completed).length;
  const pct = Math.round((completed / milestones.length) * 100);
  return Math.min(Math.max(pct, 0), 100);
}

const emptyMilestones = calculateGoalProgress([]);
assertCheck(emptyMilestones === 0, 'Goal Progress: 0 milestones yields 0% progress');

const partialMilestones = calculateGoalProgress([
  { id: 1, is_completed: true },
  { id: 2, is_completed: false },
  { id: 3, is_completed: false },
]);
assertCheck(partialMilestones === 33, 'Goal Progress: 1/3 milestones yields 33% progress');

const fullMilestones = calculateGoalProgress([
  { id: 1, is_completed: true },
  { id: 2, is_completed: true },
]);
assertCheck(fullMilestones === 100, 'Goal Progress: 2/2 milestones yields exactly 100% progress');

// ------------------------------------------------------------------------------
// 4. PLANNER TIME & DATE STRICT VALIDATION
// ------------------------------------------------------------------------------
console.log("\n--- 4. Planner Time Allocations & Date Domain Invariants ---");

function validatePlannerTimeSlot(startTime, endTime) {
  // Format HH:MM
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) return false;
  return startTime < endTime;
}

function validateIsoDate(dateString) {
  const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  if (!dateRegex.test(dateString)) return false;
  const d = new Date(dateString);
  return !isNaN(d.getTime());
}

assertCheck(validatePlannerTimeSlot('09:00', '10:30'), 'Planner Time Slot: 09:00 to 10:30 is valid time window');
assertCheck(!validatePlannerTimeSlot('14:00', '13:00'), 'Planner Time Slot: Inverted window 14:00 to 13:00 is rejected');
assertCheck(!validatePlannerTimeSlot('10:00', '10:00'), 'Planner Time Slot: Zero-length window 10:00 to 10:00 is rejected');
assertCheck(validateIsoDate('2026-10-07'), 'Planner Date: ISO format "2026-10-07" is valid');
assertCheck(!validateIsoDate('07-10-2026'), 'Planner Date: Non-ISO format "07-10-2026" is rejected');
assertCheck(!validateIsoDate('2026-13-45'), 'Planner Date: Out-of-bounds calendar date is rejected');

console.log("\n================================================================================");
console.log(`🏁 MATHEMATICAL INVARIANTS & DATA INTEGRITY GUARD: ${passed} PASSED | ${failed} FAILED`);
console.log("================================================================================\n");

if (failed > 0) {
  process.exit(1);
}
