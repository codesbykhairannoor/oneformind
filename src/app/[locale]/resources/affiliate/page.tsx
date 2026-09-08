'use client';

import GuestLayout from '@/components/GuestLayout';
import AffiliateHero from '@/components/affiliate/AffiliateHero';
import AffiliateAdvantages from '@/components/affiliate/AffiliateAdvantages';
import AffiliateCalculator from '@/components/affiliate/AffiliateCalculator';
import AffiliateDurationBanner from '@/components/affiliate/AffiliateDurationBanner';
import AffiliateSteps from '@/components/affiliate/AffiliateSteps';
import AffiliatePersonas from '@/components/affiliate/AffiliatePersonas';
import AffiliateComparisonMatrix from '@/components/affiliate/AffiliateComparisonMatrix';
import AffiliateFaq from '@/components/affiliate/AffiliateFaq';
import AffiliateBottomCTA from '@/components/affiliate/AffiliateBottomCTA';

export default function AffiliatePage() {
    return (
        <GuestLayout>
            <main id="affiliate-program-page" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500 overflow-x-hidden">
                <AffiliateHero />
                <AffiliateAdvantages />
                <AffiliateCalculator />
                <AffiliateDurationBanner />
                <AffiliateSteps />
                <AffiliatePersonas />
                <AffiliateComparisonMatrix />
                <AffiliateFaq />
                <AffiliateBottomCTA />
            </main>
        </GuestLayout>
    );
}
