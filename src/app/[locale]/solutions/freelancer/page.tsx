'use client';

import GuestLayout from '@/components/GuestLayout';
import FreelancerHero from '@/components/solutions/freelancer/FreelancerHero';
import FreelancerProblem from '@/components/solutions/freelancer/FreelancerProblem';
import FreelancerCommandCenter from '@/components/solutions/freelancer/FreelancerCommandCenter';
import FreelancerBentoLifecycle from '@/components/solutions/freelancer/FreelancerBentoLifecycle';
import FreelancerScienceFaqCta from '@/components/solutions/freelancer/FreelancerScienceFaqCta';

export default function SolutionFreelancerPage() {
    return (
        <GuestLayout>
            <main id="solution-freelancer" className="overflow-x-hidden text-left">
                <FreelancerHero />
                <FreelancerProblem />
                <FreelancerCommandCenter />
                <FreelancerBentoLifecycle />
                <FreelancerScienceFaqCta />
            </main>
        </GuestLayout>
    );
}
