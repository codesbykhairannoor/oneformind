'use client';

import GuestLayout from '@/components/GuestLayout';
import SecondBrainHero from '@/components/solutions/second-brain/SecondBrainHero';
import SecondBrainProblem from '@/components/solutions/second-brain/SecondBrainProblem';
import SecondBrainFramework from '@/components/solutions/second-brain/SecondBrainFramework';
import SecondBrainFeatures from '@/components/solutions/second-brain/SecondBrainFeatures';
import SecondBrainScienceFaqCta from '@/components/solutions/second-brain/SecondBrainScienceFaqCta';

export default function SolutionSecondBrainPage() {
    return (
        <GuestLayout>
            <main id="solution-second-brain" className="overflow-x-hidden text-left">
                <SecondBrainHero />
                <SecondBrainProblem />
                <SecondBrainFramework />
                <SecondBrainFeatures />
                <SecondBrainScienceFaqCta />
            </main>
            <style jsx>{`
                .animate-spin-slow {
                    animation: spin 40s linear infinite;
                }
                .animate-spin-reverse-slow {
                    animation: spin 45s linear infinite reverse;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(-6deg); }
                    50% { transform: translateY(-10px) rotate(-6deg); }
                }
                @keyframes float-reverse {
                    0%, 100% { transform: translateY(0px) rotate(6deg); }
                    50% { transform: translateY(-10px) rotate(6deg); }
                }
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
                .animate-float-reverse {
                    animation: float-reverse 5s ease-in-out infinite;
                }
            `}</style>
        </GuestLayout>
    );
}
