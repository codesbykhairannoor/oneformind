'use client';

import GuestLayout from '@/components/GuestLayout';
import HabitAppsHero from '@/components/compare/habit-apps/HabitAppsHero';
import HabitAppsProblemCycle from '@/components/compare/habit-apps/HabitAppsProblemCycle';
import HabitAppsSolutionComparison from '@/components/compare/habit-apps/HabitAppsSolutionComparison';
import HabitAppsScienceFaqCta from '@/components/compare/habit-apps/HabitAppsScienceFaqCta';

export default function HabitAppsComparePage() {
    return (
        <GuestLayout>
            <main id="habit-apps-compare" className="overflow-x-hidden">
                <HabitAppsHero />
                <HabitAppsProblemCycle />
                <HabitAppsSolutionComparison />
                <HabitAppsScienceFaqCta />
            </main>
        </GuestLayout>
    );
}
