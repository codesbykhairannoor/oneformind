import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import PlannerDashboardClient from './PlannerDashboardClient';

export async function generateMetadata() {
    return {
        title: 'Planner Dashboard - OneForMind',
    };
}

export default async function PlannerDashboardPage({ searchParams }: { searchParams: { month?: string } }) {
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
    
    // Fetch data for the requested month
    const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
    
    const tasks = await prisma.plannerTask.findMany({
        where: {
            userId,
            date: {
                gte: startDate,
                lte: endDate,
            },
        },
        orderBy: [
            { startTime: 'asc' },
            { id: 'asc' }
        ]
    });

    // We serialize the dates so they can be passed to the Client Component
    const serializedTasks = tasks.map((t: any) => ({
        id: t.id,
        title: t.title,
        date: t.date.toISOString(),
        isCompleted: t.isCompleted,
        type: t.type,
        startTime: t.startTime ? t.startTime.toISOString() : null,
        endTime: t.endTime ? t.endTime.toISOString() : null,
        notes: t.notes
    }));

    const dailies = await prisma.plannerDaily.findMany({
        where: {
            userId,
            date: {
                gte: startDate,
                lte: endDate,
            },
        },
    });

    const serializedDailies = dailies.map((d: any) => ({
        date: d.date.toISOString(),
        waterGlasses: d.waterGlasses,
        meals: d.meals,
        inbox: d.inbox,
        notes: d.notes
    }));

    return (
        <PlannerDashboardClient 
            initialDateStr={initialDateStr} 
            realTasks={serializedTasks} 
            realDailies={serializedDailies}
        />
    );
}
