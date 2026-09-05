import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — How We Protect Your Data',
  description: 'Understand how Tranvas safeguards, encrypts, and handles your personal data, habits, finances, and journal entries with strict privacy standards.',
};

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
