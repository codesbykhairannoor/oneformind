const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.esahuobozjxkyjvpxslu:Khairanaja09@aws-1-ap-south-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => client.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'id'
    UNION ALL
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'accounts' AND column_name = 'userId'
  `))
  .then(res => {
    console.log(res.rows);
    client.end();
  })
  .catch(err => {
    console.error(err);
    client.end();
  });
