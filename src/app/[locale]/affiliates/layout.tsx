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
    title: 'Affiliate Partner Program — Earn 60% Recurring for 8 Months',
    description: 'Join the Tranvas Affiliate Partner Program. Earn 60% monthly recurring commissions for up to 8 months with a 90-day cookie window and multi-gateway payouts.',
  });
}

export default function AffiliatesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
