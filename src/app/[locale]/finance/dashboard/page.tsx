import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import FinanceDashboardClient from './FinanceDashboardClient';
import { goFetchJson } from '@/lib/go-fetch';

export async function generateMetadata() {
    return {
        title: 'Finance Dashboard | Tranvas',
    };
}

interface YearlyStat {
    month: string;
    total_income: number;
    total_expense: number;
    income_target: number;
    balance: number;
}

export default async function FinanceDashboardPage({
    searchParams
}: {
    searchParams?: Promise<{ year?: string }> | { year?: string };
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
        redirect('/login');
    }

    const resolvedParams = searchParams instanceof Promise ? await searchParams : searchParams;
    const currentYear = new Date().getFullYear();
    const selectedYear = resolvedParams?.year ? parseInt(resolvedParams.year, 10) || currentYear : currentYear;

    // Fetch yearly stats, savings, and assets in parallel
    const [yearlyData, savingsData, assetsData] = await Promise.all([
        goFetchJson<any>('finance-yearly', `year=${selectedYear}`),
        goFetchJson<any[]>('finance-savings', ''),
        goFetchJson<any[]>('finance-assets', ''),
    ]);

    const rawYearly = yearlyData[0];
    const savings = Array.isArray(savingsData[0]) ? savingsData[0] : [];
    const assets = Array.isArray(assetsData[0]) ? assetsData[0] : [];

    const totalSavings = savings.reduce(
        (acc: number, s: any) => acc + Number(s.current_amount || s.currentAmount || s.current || 0),
        0
    );

    const totalAssetsValue = assets.reduce(
        (acc: number, a: any) => {
            const val = Number(a.value || a.capital || a.amount || 0);
            return acc + (isNaN(val) ? 0 : val);
        },
        0
    );

    // Map Go API response (which returns monthlyStats map) or direct array into YearlyStat[]
    let stats: YearlyStat[] = [];
    if (rawYearly?.monthlyStats) {
        for (let i = 1; i <= 12; i++) {
            const monthKey = `${selectedYear}-${String(i).padStart(2, '0')}`;
            const m = rawYearly.monthlyStats[monthKey] || { income: 0, expense: 0 };
            const inc = Number(m.income || m.total_income || 0);
            const exp = Number(m.expense || m.total_expense || 0);
            stats.push({
                month: monthKey,
                total_income: inc,
                total_expense: exp,
                income_target: Number(m.income_target || 0),
                balance: inc - exp,
            });
        }
    } else if (Array.isArray(rawYearly) && rawYearly.length > 0) {
        stats = rawYearly.map((s: any) => ({
            month: s.month,
            total_income: Number(s.total_income || s.income || 0),
            total_expense: Number(s.total_expense || s.expense || 0),
            income_target: Number(s.income_target || 0),
            balance: Number(s.balance ?? (Number(s.total_income || s.income || 0) - Number(s.total_expense || s.expense || 0))),
        }));
    } else {
        for (let i = 1; i <= 12; i++) {
            stats.push({
                month: `${selectedYear}-${String(i).padStart(2, '0')}`,
                total_income: 0,
                total_expense: 0,
                income_target: 0,
                balance: 0,
            });
        }
    }

    // Calculate avg expense for the last 3 months
    const currentMonthIdx = selectedYear === currentYear ? new Date().getMonth() : 11; // 0-based
    const last3Months = stats.slice(Math.max(0, currentMonthIdx - 2), currentMonthIdx + 1);
    const avgExp = last3Months.reduce((acc, curr) => acc + curr.total_expense, 0) / (last3Months.length || 1);

    // Calculate accumulated balance up to current month
    const accumulatedBalance = stats.slice(0, currentMonthIdx + 1).reduce(
        (acc, curr) => acc + curr.balance,
        0
    );

    return (
        <FinanceDashboardClient
            selectedYear={selectedYear}
            yearlyStats={stats}
            totalSavings={totalSavings}
            totalAssetsValue={totalAssetsValue}
            currentBalance={accumulatedBalance}
            avgExpense={avgExp}
        />
    );
}
