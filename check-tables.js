const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://postgres.esahuobozjxkyjvpxslu:Khairanaja09@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1'
});

async function getCols(tableName) {
  const res = await pool.query(`
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = $1
    ORDER BY ordinal_position;
  `, [tableName]);
  console.log(`\n=== ${tableName.toUpperCase()} ===`);
  res.rows.forEach(r => console.log(`  ${r.column_name} | ${r.data_type} | nullable: ${r.is_nullable}`));
}

async function run() {
  try {
    const tables = [
      'finance_budgets',
      'finance_categories',
      'finance_savings',
      'finance_transactions',
      'planner_tasks'
    ];
    for (const t of tables) {
      await getCols(t);
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    pool.end();
  }
}
run();
