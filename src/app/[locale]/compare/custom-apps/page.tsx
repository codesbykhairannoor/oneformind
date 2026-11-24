'use client';

import GuestLayout from '@/components/GuestLayout';
import CompareGeoSection from '@/components/compare/CompareGeoSection';
import CustomAppsHero from '@/components/compare/custom-apps/CustomAppsHero';
import CustomAppsProblemCycle from '@/components/compare/custom-apps/CustomAppsProblemCycle';
import CustomAppsSolutionComparison from '@/components/compare/custom-apps/CustomAppsSolutionComparison';
import CustomAppsScienceFaqCta from '@/components/compare/custom-apps/CustomAppsScienceFaqCta';

export default function CustomAppsComparePage() {
    return (
        <GuestLayout>
            <main id="custom-apps-compare" className="overflow-x-hidden">
                <CustomAppsHero />
                <CustomAppsProblemCycle />
                <CustomAppsSolutionComparison />
                <CustomAppsScienceFaqCta />
                <CompareGeoSection
                    slug="custom-apps"
                    includeVerdictAndSchema={true}
                    includeTable={true}
                    includeFaqSection={true}
                />
            </main>
        </GuestLayout>
    );
}
