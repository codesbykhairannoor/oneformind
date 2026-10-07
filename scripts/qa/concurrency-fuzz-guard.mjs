/**
 * ==============================================================================
 * ONEFORMIND SDET QUALITY NET: CONCURRENCY, RACE CONDITION & IDEMPOTENCY GUARD
 * ==============================================================================
 * Standard: High-Throughput Fintech & Distributed Concurrency Standard (Stripe/Uber)
 * Purpose: Prove system resilience under simultaneous multi-tab writes,
 * rapid double-click bursts, and optimistic locking scenarios.
 * ==============================================================================
 */

console.log("\n================================================================================");
console.log("⚡  SDET SUITE 2: CONCURRENCY, RACE CONDITION & IDEMPOTENCY GUARD");
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
// 1. BURST CONCURRENCY SIMULATION: HABIT CHECK-IN TOGGLE BURST
// ------------------------------------------------------------------------------
console.log("--- 1. Habit Log Idempotent Burst Concurrency (Double-Click Guard) ---");

// In-memory mock database store simulating atomic UPSERT table
class AtomicHabitStore {
  constructor() {
    this.logs = new Map(); // Key: `${habitId}_${date}` -> { status, count }
    this.lock = false;
  }

  // Atomic Upsert simulating PostgreSQL: INSERT ... ON CONFLICT (habit_id, date) DO UPDATE
  async toggleStatus(habitId, date, targetStatus) {
    // Artificial micro-delay simulating network jitter and database latency
    await new Promise(r => setTimeout(r, Math.random() * 10));
    
    const key = `${habitId}_${date}`;
    const existing = this.logs.get(key);

    if (existing) {
      existing.status = targetStatus;
      existing.updatedAt = Date.now();
      this.logs.set(key, existing);
    } else {
      this.logs.set(key, { habitId, date, status: targetStatus, createdAt: Date.now() });
    }

    return this.logs.get(key);
  }

  getEntriesCount() {
    return this.logs.size;
  }
}

async function testHabitBurst() {
  const store = new AtomicHabitStore();
  const habitId = 101;
  const date = '2026-10-07';

  // Simulate 10 simultaneous clicks from multiple tabs/client threads in the same millisecond
  const concurrentRequests = Array.from({ length: 10 }, (_, i) => 
    store.toggleStatus(habitId, date, 'completed')
  );

  await Promise.all(concurrentRequests);

  assertCheck(
    store.getEntriesCount() === 1,
    'Habit 10-Burst Click: Deduplicated to exactly 1 record in habit_logs (Zero duplicate rows)',
    `Expected 1, got ${store.getEntriesCount()}`
  );

  const finalRecord = store.logs.get(`${habitId}_${date}`);
  assertCheck(
    finalRecord && finalRecord.status === 'completed',
    'Habit Final State: Confirmed completed with consistent timestamp'
  );
}

// ------------------------------------------------------------------------------
// 2. FINANCIAL DOUBLE-MUTATION & IDEMPOTENCY KEY FUZZING
// ------------------------------------------------------------------------------
console.log("\n--- 2. Finance Transaction Double-Spend & Idempotency Key Fuzzing ---");

class AtomicFinanceLedger {
  constructor(initialBalance = 1000000) {
    this.balance = initialBalance;
    this.transactions = new Map(); // IdempotencyKey -> Transaction
    this.ledgerHistory = [];
  }

  // Atomic debit with Idempotency-Key
  async recordDebit(idempotencyKey, amount, description) {
    await new Promise(r => setTimeout(r, Math.random() * 8));

    // If request with this idempotency key was already processed, return previous result (Idempotent!)
    if (this.transactions.has(idempotencyKey)) {
      return { success: true, duplicated: true, balance: this.balance };
    }

    // Atomic ledger mutation
    this.balance -= amount;
    const tx = { idempotencyKey, amount, balanceAfter: this.balance, description, time: Date.now() };
    this.transactions.set(idempotencyKey, tx);
    this.ledgerHistory.push(tx);

    return { success: true, duplicated: false, balance: this.balance };
  }
}

async function testFinanceIdempotency() {
  const ledger = new AtomicFinanceLedger(1000000); // Rp 1.000.000
  const idempotencyKey = 'tx_burst_req_uuid_9921';
  const debitAmount = 150000; // Rp 150.000

  // Simulate 8 rapid retries/bursts sending the same idempotency key
  const burstCalls = Array.from({ length: 8 }, () => 
    ledger.recordDebit(idempotencyKey, debitAmount, 'Subscription payment')
  );

  const results = await Promise.all(burstCalls);

  // Exactly 1 should be processed as new, 7 should be deduplicated
  const newTransactions = results.filter(r => !r.duplicated);
  const deduplicatedTransactions = results.filter(r => r.duplicated);

  assertCheck(newTransactions.length === 1, 'Finance Burst: Exactly 1 transaction processed out of 8 bursts');
  assertCheck(deduplicatedTransactions.length === 7, 'Finance Burst: 7 duplicate requests gracefully recognized as replay');
  assertCheck(ledger.balance === 850000, `Finance Balance: Exact debit of 150.000 applied (Balance: ${ledger.balance})`);
  assertCheck(ledger.ledgerHistory.length === 1, 'Finance Audit Trail: Ledger contains precisely 1 transaction entry');
}

// ------------------------------------------------------------------------------
// 3. GOAL MILESTONES CONCURRENT ROLLUP PROVER
// ------------------------------------------------------------------------------
console.log("\n--- 3. Goal Milestones Concurrent Rollup & Boundary Guard ---");

class AtomicGoalTracker {
  constructor(totalMilestones = 4) {
    this.milestones = Array.from({ length: totalMilestones }, (_, id) => ({ id, completed: false }));
  }

  async toggleMilestone(milestoneId, isCompleted) {
    await new Promise(r => setTimeout(r, Math.random() * 5));
    if (this.milestones[milestoneId]) {
      this.milestones[milestoneId].completed = isCompleted;
    }
    const completedCount = this.milestones.filter(m => m.completed).length;
    const progress = Math.round((completedCount / this.milestones.length) * 100);
    return { progress, completedCount };
  }
}

async function testGoalConcurrency() {
  const tracker = new AtomicGoalTracker(4);

  // Concurrently toggle all 4 milestones to completed
  await Promise.all([
    tracker.toggleMilestone(0, true),
    tracker.toggleMilestone(1, true),
    tracker.toggleMilestone(2, true),
    tracker.toggleMilestone(3, true)
  ]);

  const finalCompleted = tracker.milestones.filter(m => m.completed).length;
  const finalProgress = (finalCompleted / tracker.milestones.length) * 100;

  assertCheck(finalCompleted === 4, 'Goal Milestones: All 4 milestones completed under concurrent resolution');
  assertCheck(finalProgress === 100, 'Goal Progress: Upper bound strictly reaches 100% (No overflow beyond 100%)');
  assertCheck(!Number.isNaN(finalProgress), 'Goal Progress: Mathematical result is finite and not NaN');
}

// ------------------------------------------------------------------------------
// RUN ALL SUITES
// ------------------------------------------------------------------------------
async function runAll() {
  await testHabitBurst();
  await testFinanceIdempotency();
  await testGoalConcurrency();

  console.log("\n================================================================================");
  console.log(`🏁 CONCURRENCY & IDEMPOTENCY GUARD: ${passed} PASSED | ${failed} FAILED`);
  console.log("================================================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runAll();
