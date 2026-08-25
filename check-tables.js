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
  if (res.rows.length === 0) {
    console.log('  (table not found or empty)');
  }
  res.rows.forEach(r => console.log(`  ${r.column_name} | ${r.data_type} | nullable: ${r.is_nullable}`));
}

async function run() {
  try {
    const res = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `);
    
    console.log("All tables in public schema:");
    res.rows.forEach(r => console.log(`- ${r.table_name}`));
    
    const tables = [
      'users',
      'subscriptions',
      'payments',
      'transactions'
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
