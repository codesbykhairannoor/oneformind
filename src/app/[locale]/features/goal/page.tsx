'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import GoalFeatureHero from '@/components/features/goal/GoalFeatureHero';
import GoalFeatureAscentOrbit from '@/components/features/goal/GoalFeatureAscentOrbit';
import GoalFeatureStepsScience from '@/components/features/goal/GoalFeatureStepsScience';
import GoalFeatureFaqCta from '@/components/features/goal/GoalFeatureFaqCta';

export default function FeatureGoalPage() {
    const t = useTranslations();

    return (
        <GuestLayout>
            <main id="feature-goal" className="overflow-x-hidden">
                <GoalFeatureHero t={t} />
                <GoalFeatureAscentOrbit t={t} />
                <GoalFeatureStepsScience t={t} />
                <GoalFeatureFaqCta t={t} />
            </main>
        </GuestLayout>
    );
}
