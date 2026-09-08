'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import CalendarFeatureHero from '@/components/features/calendar/CalendarFeatureHero';
import CalendarFeatureLayeredPulse from '@/components/features/calendar/CalendarFeatureLayeredPulse';
import CalendarFeatureSyncScience from '@/components/features/calendar/CalendarFeatureSyncScience';
import CalendarFeatureFaqCta from '@/components/features/calendar/CalendarFeatureFaqCta';

export default function FeatureCalendarPage() {
    const t = useTranslations();

    return (
        <GuestLayout>
            <main id="feature-calendar" className="overflow-x-hidden">
                <CalendarFeatureHero t={t} />
                <CalendarFeatureLayeredPulse t={t} />
                <CalendarFeatureSyncScience t={t} />
                <CalendarFeatureFaqCta t={t} />
            </main>
        </GuestLayout>
    );
}
