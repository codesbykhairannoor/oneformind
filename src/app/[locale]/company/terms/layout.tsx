import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — Legal & Agreement',
  description: 'Legal terms, transparent policies, user obligations, and intellectual property terms for Tranvas users worldwide.',
};

export default function CompanyTermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
