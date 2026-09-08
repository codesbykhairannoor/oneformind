'use client';

import GuestLayout from '@/components/GuestLayout';
import { usePageTitle } from '@/hooks/usePageTitle';
import LandingHero from '@/components/landing/LandingHero';
import LandingFriction from '@/components/landing/LandingFriction';
import LandingPillars from '@/components/landing/LandingPillars';
import LandingScienceMatrix from '@/components/landing/LandingScienceMatrix';
import LandingSynergy from '@/components/landing/LandingSynergy';
import LandingPreview from '@/components/landing/LandingPreview';
import LandingSwitch from '@/components/landing/LandingSwitch';
import LandingSolutions from '@/components/landing/LandingSolutions';
import LandingWaitlist from '@/components/landing/LandingWaitlist';
import LandingFAQ from '@/components/landing/LandingFAQ';
import LandingBottomCTA from '@/components/landing/LandingBottomCTA';

export default function HomePage() {
    usePageTitle('Home');

    return (
        <GuestLayout>
            <main id="neural-interface" className="overflow-x-hidden">
                <LandingHero />
                <LandingFriction />
                <LandingPillars />
                <LandingScienceMatrix />
                <LandingSynergy />
                <LandingPreview />
                <LandingSwitch />
                <LandingSolutions />
                <LandingWaitlist />
                <LandingFAQ />
                <LandingBottomCTA />
            </main>
        </GuestLayout>
    );
}
