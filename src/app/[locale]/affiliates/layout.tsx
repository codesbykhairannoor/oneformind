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
    path: '/affiliates',
    title: 'Affiliate Partner Program — Earn 30% Recurring',
    description: 'Join the Tranvas Affiliate Partner Program. Earn 30% lifetime recurring commissions promoting the unified Life OS. Fast payouts & 60-day cookies.',
  });
}

export default function AffiliatesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
