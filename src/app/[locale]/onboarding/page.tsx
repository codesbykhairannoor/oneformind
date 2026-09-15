import FullPageOnboarding from '@/components/onboarding/FullPageOnboarding';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Onboarding & Workspace Setup | Tranvas OS',
    description: 'Customize your 3 free productivity tabs, choose your persona, and launch your personalized Tranvas Life Operating System.',
};

export default function OnboardingPage() {
    return <FullPageOnboarding isStandalonePage={true} />;
}
