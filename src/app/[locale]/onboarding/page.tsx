import FullPageOnboarding from '@/components/onboarding/FullPageOnboarding';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
        absolute: 'Workspace Setup & Onboarding | Tranvas',
    },
    description: 'Customize your active productivity tabs, choose your persona, and launch your personalized Tranvas Life Operating System.',
};

export default function OnboardingPage() {
    return <FullPageOnboarding isStandalonePage={true} />;
}
