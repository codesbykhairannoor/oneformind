import { prisma } from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import FinanceClient from './FinanceClient';

export async function generateMetadata() {
    return {
        title: 'Finance Manager | Tranvas',
    };
}

export default async function FinancePage({ searchParams }: { searchParams: { month?: string } }) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
        redirect('/login');
    }
    let dbUser = await prisma.user.findUnique({ where: { email: user.email } });
    if (!dbUser) {
        dbUser = await prisma.user.create({ data: { email: user.email, name: user.user_metadata?.name || user.user_metadata?.full_name || user.email } });
    }
    const userId = dbUser.id;
    
    // Default to current month if not provided in URL
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    
    if (searchParams?.month) {
        const parts = searchParams.month.split('-');
        if (parts.length === 2) {
            year = parseInt(parts[0]);
            month = parseInt(parts[1]);
        }
    }

    const initialDateStr = `${year}-${String(month).padStart(2, '0')}`;
    
    // Fetch data for the requested month
    const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
    
    const [transactions, categories, budgets, savings] = await Promise.all([
        prisma.financeTransaction.findMany({
            where: {
                userId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: [
                { date: 'desc' },
                { id: 'desc' }
            ]
        }),
        prisma.financeCategory.findMany({
            where: { userId }
        }),
        prisma.financeBudget.findMany({
            where: { userId, month: initialDateStr }
        }),
        prisma.financeSaving.findMany({
            where: { userId }
        })
    ]);

    const serializedCategories = categories.map((c: any) => ({
        slug: c.slug,
        name: c.name,
        icon: c.icon,
        type: c.type as 'income' | 'expense'
    }));

    const serializedTransactions = transactions.map((t: any) => ({
        ...t,
        amount: Number(t.amount),
        date: t.date.toISOString().split('T')[0]
    }));

    const serializedBudgets = budgets.map((b: any) => ({
        ...b,
        limit: Number(b.limitAmount),
        spent: 0 // Will be computed client-side
    }));

    const serializedSavings = savings.map((s: any) => ({
        id: s.id,
        name: s.title,
        target: Number(s.targetAmount),
        current: Number(s.currentAmount),
        icon: s.icon,
        color: s.color || '#6366f1'
    }));

    return (
        <FinanceClient 
            initialMonthKey={initialDateStr} 
            initialTransactions={serializedTransactions} 
            initialCategories={serializedCategories}
            initialBudgets={serializedBudgets}
            initialSavings={serializedSavings}
        />
    );
}
