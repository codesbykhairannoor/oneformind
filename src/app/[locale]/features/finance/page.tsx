'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import FinanceFeatureHero from '@/components/features/finance/FinanceFeatureHero';
import FinanceFeatureWalletsFlow from '@/components/features/finance/FinanceFeatureWalletsFlow';
import FinanceFeaturePrivacyTrajectory from '@/components/features/finance/FinanceFeaturePrivacyTrajectory';
import FinanceFeatureScienceFaq from '@/components/features/finance/FinanceFeatureScienceFaq';

export default function FeatureFinancePage() {
    const t = useTranslations();

    return (
        <GuestLayout>
            <main id="feature-finance" className="overflow-x-hidden">
                <FinanceFeatureHero t={t} />
                <FinanceFeatureWalletsFlow t={t} />
                <FinanceFeaturePrivacyTrajectory t={t} />
                <FinanceFeatureScienceFaq t={t} />
            </main>
        </GuestLayout>
    );
}
