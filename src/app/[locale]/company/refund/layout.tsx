import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy — Transparent Guarantee',
  description: 'Our 14-day money-back satisfaction guarantee and clear billing refund policies for Tranvas Pro subscriptions.',
};

export default function CompanyRefundLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
