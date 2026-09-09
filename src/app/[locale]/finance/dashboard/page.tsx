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
        goFetchJson<YearlyStat[]>('finance-yearly', `year=${selectedYear}`),
        goFetchJson<any[]>('finance-savings', ''),
        goFetchJson<any[]>('finance-assets', ''),
    ]);

    const yearlyStats: YearlyStat[] = yearlyData[0] || [];
    const savings = savingsData[0] || [];
    const assets = assetsData[0] || [];

    const totalSavings = savings.reduce(
        (acc: number, s: any) => acc + Number(s.current_amount || s.currentAmount || s.current || 0),
        0
    );

    const totalAssetsValue = assets.reduce(
        (acc: number, a: any) => {
            const capital = Number(a.value || a.capital || 0);
            const percent = Number(a.color || a.percent || 0);
            return acc + (capital * (1 + percent / 100));
        },
        0
    );

    // If Go already returns computed yearly stats, use them directly
    // Otherwise build fallback empty stats for all 12 months
    let stats: YearlyStat[] = [];
    if (yearlyStats.length > 0) {
        stats = yearlyStats;
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
