const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://postgres.esahuobozjxkyjvpxslu:Khairanaja09@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require',
});
client.connect().then(async () => {
  const res = await client.query("SELECT email, is_premium, plan_type FROM users WHERE email='khairannoor@gmail.com'");
  console.log(res.rows);
  client.end();
});
