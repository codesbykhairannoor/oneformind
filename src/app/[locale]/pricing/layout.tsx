import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing & Plans — Choose Your Journey',
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
