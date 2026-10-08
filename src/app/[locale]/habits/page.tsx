import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import HabitsClient from './HabitsClient';
import { goFetchJson } from '@/lib/go-fetch';

import { getLocale } from 'next-intl/server';
import { getRouteTitle } from '@/lib/titles';

export async function generateMetadata() {
    const locale = await getLocale();
    return {
        title: {
            absolute: getRouteTitle('/habits', locale),
        },
    };
}

export default async function HabitsPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
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

    // Fetch habits from Go API (no Prisma!)
    const [habits] = await goFetchJson<any[]>('habits', `period=${initialDateStr}`);

    const serializedHabits = (habits || []).map((h: any) => ({
        ...h,
        createdAt: h.createdAt || h.created_at || null,
        updatedAt: h.updatedAt || h.updated_at || null,
        logs: (h.logs || []).map((l: any) => ({
            ...l,
            date: l.date,
            createdAt: l.createdAt || l.created_at || null,
            updatedAt: l.updatedAt || l.updated_at || null,
        }))
    }));

    return (
        <HabitsClient
            initialDateStr={initialDateStr}
            initialHabits={serializedHabits}
        />
    );
}
