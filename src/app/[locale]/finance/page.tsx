import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import FinanceClient from './FinanceClient';

export async function generateMetadata() {
    return {
        title: 'Finance Manager | Tranvas',
    };
}

export default async function FinancePage({ searchParams }: { searchParams: { month?: string } }) {
    const session = await auth();
    if (!session?.user?.id) {
        redirect('/login');
    }

    const userId = parseInt(session.user.id);
    
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
    
    // Pass empty initial data so the fast Go backend loads it on the client
    // This removes the server-side Next.js navigation blocking!
    return (
        <FinanceClient 
            initialMonthKey={initialDateStr} 
            initialTransactions={[]} 
            initialCategories={[]}
            initialBudgets={[]}
            initialSavings={[]}
        />
    );
}
