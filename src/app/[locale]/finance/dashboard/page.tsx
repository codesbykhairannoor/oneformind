import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import FinanceDashboardClient from './FinanceDashboardClient';

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
    let dbUser = await prisma.user.findUnique({ where: { email: user.email } });
    if (!dbUser) {
        dbUser = await prisma.user.create({ data: { email: user.email, name: user.user_metadata?.name || user.user_metadata?.full_name || user.email } });
    }
    const userId = dbUser.id;
    const currentYear = new Date().getFullYear();
    const startDate = new Date(`${currentYear}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${currentYear}-12-31T23:59:59.999Z`);

    const [transactions, savings] = await Promise.all([
        prisma.financeTransaction.findMany({
            where: {
                userId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        }),
        prisma.financeSaving.findMany({
            where: { userId }
        })
    ]);

    const monthlyStats: Record<string, { income: number; expense: number }> = {};
    for (let i = 1; i <= 12; i++) {
        const monthKey = `${currentYear}-${String(i).padStart(2, '0')}`;
        monthlyStats[monthKey] = { income: 0, expense: 0 };
    }

    transactions.forEach(t => {
        const monthKey = t.date.toISOString().substring(0, 7); // e.g., "2026-08"
        if (monthlyStats[monthKey]) {
            if (t.type === 'income') {
                monthlyStats[monthKey].income += Number(t.amount);
            } else if (t.type === 'expense') {
                monthlyStats[monthKey].expense += Number(t.amount);
            }
        }
    });

    const totalSavings = savings.reduce((acc: number, s: any) => acc + Number(s.currentAmount || 0), 0);

    const stats: YearlyStat[] = [];
    const target = 0; // Fixed target for now
    
    for (let i = 1; i <= 12; i++) {
        const monthStr = `${currentYear}-${String(i).padStart(2, '0')}`;
        const stat = monthlyStats[monthStr] || { income: 0, expense: 0 };
        const balance = stat.income - stat.expense; // Net balance per month
        
        stats.push({
            month: monthStr,
            total_income: stat.income,
            total_expense: stat.expense,
            income_target: target,
            balance: balance
        });
    }

    // Calculate avg expense for the last 3 months
    const currentMonthIdx = new Date().getMonth(); // 0-based
    const last3Months = stats.slice(Math.max(0, currentMonthIdx - 2), currentMonthIdx + 1);
    const avgExp = last3Months.reduce((acc, curr) => acc + curr.total_expense, 0) / (last3Months.length || 1);
    
    // Calculate accumulated balance up to current month
    const accumulatedBalance = stats.slice(0, currentMonthIdx + 1).reduce((acc, curr) => acc + curr.balance, 0);

    return (
        <FinanceDashboardClient 
            yearlyStats={stats} 
            totalSavings={totalSavings}
            currentBalance={accumulatedBalance}
            avgExpense={avgExp}
        />
    );
}
