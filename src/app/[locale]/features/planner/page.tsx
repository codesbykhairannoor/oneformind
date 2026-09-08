'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import PlannerFeatureHero from '@/components/features/planner/PlannerFeatureHero';
import PlannerFeatureTimelineFlow from '@/components/features/planner/PlannerFeatureTimelineFlow';
import PlannerFeatureMatrixScience from '@/components/features/planner/PlannerFeatureMatrixScience';
import PlannerFeatureFaqCta from '@/components/features/planner/PlannerFeatureFaqCta';

export default function FeaturePlannerPage() {
    const t = useTranslations();

    return (
        <GuestLayout>
            <main id="feature-planner" className="overflow-x-hidden">
                <PlannerFeatureHero t={t} />
                <PlannerFeatureTimelineFlow t={t} />
                <PlannerFeatureMatrixScience t={t} />
                <PlannerFeatureFaqCta t={t} />
            </main>
        </GuestLayout>
    );
}
