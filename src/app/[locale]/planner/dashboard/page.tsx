import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import PlannerDashboardClient from './PlannerDashboardClient';
import { goFetchJson } from '@/lib/go-fetch';

export async function generateMetadata() {
    return {
        title: 'Planner Dashboard | Tranvas',
    };
}

export default async function PlannerDashboardPage({ 
    searchParams 
}: { 
    searchParams?: Promise<{ month?: string }> | { month?: string } 
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
        redirect('/login');
    }

    const resolvedParams = searchParams instanceof Promise ? await searchParams : searchParams;

    // Default to current month if not provided in URL
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;

    if (resolvedParams?.month) {
        const parts = resolvedParams.month.split('-');
        if (parts.length === 2) {
            const parsedYear = parseInt(parts[0], 10);
            const parsedMonth = parseInt(parts[1], 10);
            if (!isNaN(parsedYear) && !isNaN(parsedMonth)) {
                year = parsedYear;
                month = parsedMonth;
            }
        }
    }

    const initialDateStr = `${year}-${String(month).padStart(2, '0')}`;

    // Fetch tasks and dailies from Go API in parallel
    const [tasksData, dailiesData] = await Promise.all([
        goFetchJson<any[]>('planner-tasks', `month=${initialDateStr}`),
        goFetchJson<any[]>('planner-daily', `month=${initialDateStr}`),
    ]);

    const tasks = tasksData[0] || [];
    const dailies = dailiesData[0] || [];

    // Serialize for client component
    const serializedTasks = tasks.map((t: any) => ({
        id: t.id,
        title: t.title,
        date: t.date?.split('T')[0] || t.date,
        isCompleted: t.isCompleted ?? t.is_completed ?? false,
        type: t.type,
        startTime: t.startTime || t.start_time || null,
        endTime: t.endTime || t.end_time || null,
        notes: t.notes || null,
    }));

    const serializedDailies = dailies.map((d: any) => ({
        date: d.date?.split('T')[0] || d.date,
        waterGlasses: d.waterGlasses ?? d.water_glasses ?? 0,
        meals: d.meals || null,
        inbox: d.inbox || null,
        notes: d.notes || null,
    }));

    return (
        <PlannerDashboardClient
            initialDateStr={initialDateStr}
            realTasks={serializedTasks}
            realDailies={serializedDailies}
        />
    );
}
