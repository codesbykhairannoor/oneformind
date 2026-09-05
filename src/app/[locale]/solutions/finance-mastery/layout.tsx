import { Metadata } from 'next';
import { constructPageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return constructPageMetadata({
    locale,
    path: '/solutions/finance-mastery',
    title: 'Financial Clarity — Manage Assets & Cashflow',
    description: 'Take full control of personal finances, build emergency funds, track investments, and eliminate wasteful spending with ease.',
  });
}

export default function FinanceMasterySolutionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
