import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Data Security & Privacy Commitment',
  description: 'Our uncompromising commitment to user privacy: end-to-end security, zero advertising monetization, and complete data ownership.',
};

export default function CompanyPrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
