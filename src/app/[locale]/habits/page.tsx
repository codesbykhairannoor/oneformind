import { prisma } from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import HabitsClient from './HabitsClient';

export async function generateMetadata() {
    return {
        title: 'Habits Tracker | Tranvas',
    };
}

export default async function HabitsPage({ searchParams }: { searchParams: { month?: string } }) {
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
    const habits = await prisma.habit.findMany({
      where: {
        userId,
        isArchived: false,
        period: initialDateStr,
      },
      orderBy: {
        position: 'asc',
      },
      include: {
        logs: true,
      }
    });

    const serializedHabits = habits.map(h => ({
        ...h,
        createdAt: h.createdAt ? h.createdAt.toISOString() : null,
        updatedAt: h.updatedAt ? h.updatedAt.toISOString() : null,
        logs: h.logs.map(l => ({
            ...l,
            date: l.date.toISOString(),
            createdAt: l.createdAt ? l.createdAt.toISOString() : null,
            updatedAt: l.updatedAt ? l.updatedAt.toISOString() : null,
        }))
    }));

    return (
        <HabitsClient 
            initialDateStr={initialDateStr} 
            initialHabits={serializedHabits} 
        />
    );
}
