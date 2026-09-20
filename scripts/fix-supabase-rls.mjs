import pg from 'pg';
const { Pool } = pg;

const connectionString = "postgresql://postgres.esahuobozjxkyjvpxslu:Khairanaja09@aws-1-ap-south-1.pooler.supabase.com:6543/postgres";

const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
});

async function main() {
    const client = await pool.connect();
    try {
        console.log('--- 1. Connected to PostgreSQL ---');

        // Check tables in public schema
        const tablesRes = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name LIKE 'affiliate%';
        `);
        console.log('Affiliate Tables:', tablesRes.rows.map(r => r.table_name));

        // Disable and configure proper RLS policies
        const sql = `
            -- Drop existing policies if any
            DROP POLICY IF EXISTS "Public profiles can be read by all" ON affiliate_profiles;
            DROP POLICY IF EXISTS "Users can manage their own profile" ON affiliate_profiles;
            DROP POLICY IF EXISTS "Allow select on affiliate_profiles" ON affiliate_profiles;
            DROP POLICY IF EXISTS "Allow insert on affiliate_profiles" ON affiliate_profiles;
            DROP POLICY IF EXISTS "Allow update on affiliate_profiles" ON affiliate_profiles;
            DROP POLICY IF EXISTS "Allow all on affiliate_profiles" ON affiliate_profiles;

            DROP POLICY IF EXISTS "Allow select on affiliate_referrals" ON affiliate_referrals;
            DROP POLICY IF EXISTS "Allow insert on affiliate_referrals" ON affiliate_referrals;
            DROP POLICY IF EXISTS "Allow update on affiliate_referrals" ON affiliate_referrals;
            DROP POLICY IF EXISTS "Allow all on affiliate_referrals" ON affiliate_referrals;

            DROP POLICY IF EXISTS "Allow select on affiliate_commissions" ON affiliate_commissions;
            DROP POLICY IF EXISTS "Allow insert on affiliate_commissions" ON affiliate_commissions;
            DROP POLICY IF EXISTS "Allow update on affiliate_commissions" ON affiliate_commissions;
            DROP POLICY IF EXISTS "Allow all on affiliate_commissions" ON affiliate_commissions;

            DROP POLICY IF EXISTS "Allow select on affiliate_payouts" ON affiliate_payouts;
            DROP POLICY IF EXISTS "Allow insert on affiliate_payouts" ON affiliate_payouts;
            DROP POLICY IF EXISTS "Allow update on affiliate_payouts" ON affiliate_payouts;
            DROP POLICY IF EXISTS "Allow all on affiliate_payouts" ON affiliate_payouts;

            -- Enable RLS and grant full permissions to anon and authenticated roles
            ALTER TABLE affiliate_profiles ENABLE ROW LEVEL SECURITY;
            CREATE POLICY "Allow all on affiliate_profiles" ON affiliate_profiles FOR ALL USING (true) WITH CHECK (true);

            ALTER TABLE affiliate_referrals ENABLE ROW LEVEL SECURITY;
            CREATE POLICY "Allow all on affiliate_referrals" ON affiliate_referrals FOR ALL USING (true) WITH CHECK (true);

            ALTER TABLE affiliate_commissions ENABLE ROW LEVEL SECURITY;
            CREATE POLICY "Allow all on affiliate_commissions" ON affiliate_commissions FOR ALL USING (true) WITH CHECK (true);

            ALTER TABLE affiliate_payouts ENABLE ROW LEVEL SECURITY;
            CREATE POLICY "Allow all on affiliate_payouts" ON affiliate_payouts FOR ALL USING (true) WITH CHECK (true);

            -- Grant table privileges to anon, authenticated, service_role
            GRANT ALL ON affiliate_profiles TO anon, authenticated, service_role;
            GRANT ALL ON affiliate_referrals TO anon, authenticated, service_role;
            GRANT ALL ON affiliate_commissions TO anon, authenticated, service_role;
            GRANT ALL ON affiliate_payouts TO anon, authenticated, service_role;
        `;

        await client.query(sql);
        console.log('--- 2. RLS Policies & Grants Applied Successfully ---');

        // Check users in auth.users
        const usersRes = await client.query(`
            SELECT id, email, created_at, raw_user_meta_data 
            FROM auth.users 
            ORDER BY created_at DESC 
            LIMIT 10;
        `);
        console.log('\n--- 3. Recent Auth Users ---');
        console.log(usersRes.rows);

        // Ensure affiliate profiles exist for all active users
        for (const user of usersRes.rows) {
            const rawName = user.raw_user_meta_data?.full_name || user.raw_user_meta_data?.name || user.email?.split('@')[0] || 'PARTNER';
            const cleanHandle = rawName.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
            const defaultRefCode = `${cleanHandle || 'TRANVAS'}${Math.floor(1000 + Math.random() * 9000)}`;

            const checkProf = await client.query(`SELECT id, ref_code FROM affiliate_profiles WHERE user_id = $1`, [user.id]);
            if (checkProf.rows.length === 0) {
                // If user is khairan, assign KHAIRANNOO107
                let finalCode = defaultRefCode;
                if (user.email?.toLowerCase().includes('khairan') || rawName.toLowerCase().includes('khairan')) {
                    finalCode = 'KHAIRANNOO107';
                }

                await client.query(`
                    INSERT INTO affiliate_profiles (user_id, ref_code, commission_rate, is_active, total_clicks, total_signups, total_earned, total_paid)
                    VALUES ($1, $2, 0.60, true, 0, 0, 0, 0)
                    ON CONFLICT (user_id) DO NOTHING;
                `, [user.id, finalCode]);
                console.log(`Created profile for user ${user.email} with ref_code: ${finalCode}`);
            } else {
                console.log(`Profile exists for user ${user.email} (ref_code: ${checkProf.rows[0].ref_code})`);
            }
        }

        // Verify current profiles in database
        const profRes = await client.query(`SELECT * FROM affiliate_profiles`);
        console.log('\n--- 4. Active Affiliate Profiles in DB ---');
        console.log(profRes.rows);

    } finally {
        client.release();
        await pool.end();
    }
}

main().catch(console.error);
