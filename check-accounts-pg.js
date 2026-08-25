const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.esahuobozjxkyjvpxslu:Khairanaja09@aws-1-ap-south-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => client.query("SELECT id, \"userId\", provider, \"providerAccountId\" FROM accounts"))
  .then(res => {
    console.log(res.rows);
    return client.query("SELECT id, email FROM users");
  })
  .then(res => {
    console.log("Users:", res.rows);
    client.end();
  })
  .catch(err => {
    console.error(err);
    client.end();
  });
