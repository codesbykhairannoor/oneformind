'use client';

import GuestLayout from '@/components/GuestLayout';
import ManagementToolsHero from '@/components/compare/management-tools/ManagementToolsHero';
import ManagementToolsProblemCycle from '@/components/compare/management-tools/ManagementToolsProblemCycle';
import ManagementToolsSolutionComparison from '@/components/compare/management-tools/ManagementToolsSolutionComparison';
import ManagementToolsScienceFaqCta from '@/components/compare/management-tools/ManagementToolsScienceFaqCta';

export default function ManagementToolsComparePage() {
    return (
        <GuestLayout>
            <main id="management-tools-compare" className="overflow-x-hidden">
                <ManagementToolsHero />
                <ManagementToolsProblemCycle />
                <ManagementToolsSolutionComparison />
                <ManagementToolsScienceFaqCta />
            </main>
        </GuestLayout>
    );
}
