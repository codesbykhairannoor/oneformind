'use client';

import GuestLayout from '@/components/GuestLayout';
import FinanceAppsHero from '@/components/compare/finance-apps/FinanceAppsHero';
import FinanceAppsProblemCycle from '@/components/compare/finance-apps/FinanceAppsProblemCycle';
import FinanceAppsSolutionComparison from '@/components/compare/finance-apps/FinanceAppsSolutionComparison';
import FinanceAppsScienceFaqCta from '@/components/compare/finance-apps/FinanceAppsScienceFaqCta';

export default function FinanceAppsComparePage() {
    return (
        <GuestLayout>
            <main id="finance-apps-compare" className="overflow-x-hidden">
                <FinanceAppsHero />
                <FinanceAppsProblemCycle />
                <FinanceAppsSolutionComparison />
                <FinanceAppsScienceFaqCta />
            </main>
        </GuestLayout>
    );
}
