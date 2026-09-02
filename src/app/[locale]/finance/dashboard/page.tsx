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

export default async function FinanceDashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
        redirect('/login');
    }

    const currentYear = new Date().getFullYear();

    // Fetch yearly stats and savings from Go API (no Prisma!)
    const [yearlyData, savingsData] = await Promise.all([
        goFetchJson<YearlyStat[]>('finance-yearly', `year=${currentYear}`),
        goFetchJson<any[]>('finance-savings', ''),
    ]);

    const yearlyStats: YearlyStat[] = yearlyData[0] || [];
    const savings = savingsData[0] || [];

    const totalSavings = savings.reduce(
        (acc: number, s: any) => acc + Number(s.current_amount || s.currentAmount || s.current || 0),
        0
    );

    // If Go already returns computed yearly stats, use them directly
    // Otherwise build them from raw transactions
    let stats: YearlyStat[] = [];
    if (yearlyStats.length > 0) {
        stats = yearlyStats;
    } else {
        // Fallback: build empty stats for all 12 months
        for (let i = 1; i <= 12; i++) {
            stats.push({
                month: `${currentYear}-${String(i).padStart(2, '0')}`,
                total_income: 0,
                total_expense: 0,
                income_target: 0,
                balance: 0,
            });
        }
    }

    // Calculate avg expense for the last 3 months
    const currentMonthIdx = new Date().getMonth(); // 0-based
    const last3Months = stats.slice(Math.max(0, currentMonthIdx - 2), currentMonthIdx + 1);
    const avgExp = last3Months.reduce((acc, curr) => acc + curr.total_expense, 0) / (last3Months.length || 1);

    // Calculate accumulated balance up to current month
    const accumulatedBalance = stats.slice(0, currentMonthIdx + 1).reduce(
        (acc, curr) => acc + curr.balance,
        0
    );

    return (
        <FinanceDashboardClient
            yearlyStats={stats}
            totalSavings={totalSavings}
            currentBalance={accumulatedBalance}
            avgExpense={avgExp}
        />
    );
}
