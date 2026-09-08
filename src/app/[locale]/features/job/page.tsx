'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import JobFeatureHero from '@/components/features/job/JobFeatureHero';
import JobFeatureFunnelMatrix from '@/components/features/job/JobFeatureFunnelMatrix';
import JobFeatureValueScience from '@/components/features/job/JobFeatureValueScience';
import JobFeatureFaqCta from '@/components/features/job/JobFeatureFaqCta';

export default function FeatureJobPage() {
    const t = useTranslations();

    return (
        <GuestLayout>
            <main id="feature-job" className="overflow-x-hidden">
                <JobFeatureHero t={t} />
                <JobFeatureFunnelMatrix t={t} />
                <JobFeatureValueScience t={t} />
                <JobFeatureFaqCta t={t} />
            </main>
        </GuestLayout>
    );
}
