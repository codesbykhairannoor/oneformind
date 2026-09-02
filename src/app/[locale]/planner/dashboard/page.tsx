import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import PlannerDashboardClient from './PlannerDashboardClient';
import { goFetchJson } from '@/lib/go-fetch';

export async function generateMetadata() {
    return {
        title: 'Planner Dashboard | Tranvas',
    };
}

export default async function PlannerDashboardPage({ searchParams }: { searchParams: { month?: string } }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
        redirect('/login');
    }

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

    // Fetch tasks and dailies from Go API in parallel (no Prisma!)
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
        date: t.date,
        isCompleted: t.isCompleted ?? t.is_completed ?? false,
        type: t.type,
        startTime: t.startTime || t.start_time || null,
        endTime: t.endTime || t.end_time || null,
        notes: t.notes || null,
    }));

    const serializedDailies = dailies.map((d: any) => ({
        date: d.date,
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
