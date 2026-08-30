import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing | Tranvas',
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
