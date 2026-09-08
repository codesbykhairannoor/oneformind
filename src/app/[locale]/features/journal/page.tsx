'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import JournalFeatureHero from '@/components/features/journal/JournalFeatureHero';
import JournalFeatureEditorialNebula from '@/components/features/journal/JournalFeatureEditorialNebula';
import JournalFeatureAnalyticsScience from '@/components/features/journal/JournalFeatureAnalyticsScience';
import JournalFeatureFaqCta from '@/components/features/journal/JournalFeatureFaqCta';

export default function FeatureJournalPage() {
    const t = useTranslations();

    return (
        <GuestLayout>
            <main id="feature-journal" className="overflow-x-hidden">
                <JournalFeatureHero t={t} />
                <JournalFeatureEditorialNebula t={t} />
                <JournalFeatureAnalyticsScience t={t} />
                <JournalFeatureFaqCta t={t} />
            </main>
        </GuestLayout>
    );
}
