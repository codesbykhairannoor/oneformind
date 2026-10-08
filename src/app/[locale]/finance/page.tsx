import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import FinanceClient from './FinanceClient';
import { goFetchJson } from '@/lib/go-fetch';

import { getLocale } from 'next-intl/server';
import { getRouteTitle } from '@/lib/titles';

export async function generateMetadata() {
    const locale = await getLocale();
    return {
        title: {
            absolute: getRouteTitle('/finance', locale),
        },
    };
}

export default async function FinancePage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
        redirect('/login');
    }

    const resolvedParams = await searchParams;

    // Default to current month if not provided in URL
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;

    if (resolvedParams?.month) {
        const parts = resolvedParams.month.split('-');
        if (parts.length === 2) {
            year = parseInt(parts[0]);
            month = parseInt(parts[1]);
        }
    }

    const initialDateStr = `${year}-${String(month).padStart(2, '0')}`;

    // Fetch all finance data from Go API in parallel (no Prisma!)
    const [transactionsData, categoriesData, budgetsData, savingsData] = await Promise.all([
        goFetchJson<any[]>('finance-transactions', `month=${initialDateStr}`),
        goFetchJson<any[]>('finance-categories', ''),
        goFetchJson<any[]>('finance-budgets', `month=${initialDateStr}`),
        goFetchJson<any[]>('finance-savings', ''),
    ]);

    const transactions = transactionsData[0] || [];
    const categories = categoriesData[0] || [];
    const budgets = budgetsData[0] || [];
    const savings = savingsData[0] || [];

    const serializedCategories = categories.map((c: any) => ({
        slug: c.slug,
        name: c.name,
        icon: c.icon,
        type: c.type as 'income' | 'expense'
    }));

    const serializedTransactions = transactions.map((t: any) => ({
        ...t,
        amount: Number(t.amount),
        date: t.date ? t.date.split('T')[0] : t.date,
    }));

    const serializedBudgets = budgets.map((b: any) => ({
        ...b,
        limit: Number(b.limit_amount || b.limitAmount || b.limit),
        spent: 0, // computed client-side
    }));

    const serializedSavings = savings.map((s: any) => ({
        id: s.id,
        name: s.title || s.name,
        target: Number(s.target_amount || s.targetAmount || s.target),
        current: Number(s.current_amount || s.currentAmount || s.current),
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
