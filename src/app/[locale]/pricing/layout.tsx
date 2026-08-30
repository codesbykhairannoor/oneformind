import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing & Plans | Tranvas',
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
