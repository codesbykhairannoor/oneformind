'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import HabitFeatureHero from '@/components/features/habit/HabitFeatureHero';
import HabitFeatureHeatmap from '@/components/features/habit/HabitFeatureHeatmap';
import HabitFeatureMoodIdentity from '@/components/features/habit/HabitFeatureMoodIdentity';
import HabitFeatureScienceNeural from '@/components/features/habit/HabitFeatureScienceNeural';
import HabitFeatureFaqCta from '@/components/features/habit/HabitFeatureFaqCta';

export default function FeatureHabitPage() {
    const t = useTranslations();

    // Seeded opacity values matching laravel backup rand(0, 4)
    const opacities = [
        20, 40, 60, 80, 100, 40, 80, 20, 100, 60, 20, 80, 100, 40, 60,
        60, 20, 80, 100, 40, 80, 20, 100, 60, 20, 80, 100, 40, 60, 20,
        100, 40, 80, 20, 100, 60, 20, 80, 100, 40, 60, 80, 20, 100, 40,
        20, 80, 100, 40, 60, 80, 20, 100, 60, 20, 80, 100, 40, 60, 80,
        40, 80, 20, 100, 60, 20, 80, 100, 40, 60, 80, 20, 100, 60, 20,
        80, 100, 40, 60, 80, 20, 100, 60, 20, 80, 100, 40, 60, 80, 20,
        100, 60, 20, 80, 100, 40, 60, 80
    ];

    return (
        <GuestLayout>
            <main id="feature-habit" className="overflow-x-hidden">
                <HabitFeatureHero t={t} />
                <HabitFeatureHeatmap t={t} opacities={opacities} />
                <HabitFeatureMoodIdentity t={t} />
                <HabitFeatureScienceNeural t={t} />
                <HabitFeatureFaqCta t={t} />
            </main>
        </GuestLayout>
    );
}
