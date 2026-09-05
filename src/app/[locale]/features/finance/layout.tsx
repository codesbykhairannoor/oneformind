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
    path: '/features/finance',
    title: 'Finance OS — Master Your Money Flow',
    description: 'Track income, expenses, monthly budgets, and multi-currency accounts with interactive charts and automated financial insights.',
  });
}

export default function FinanceFeatureLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
