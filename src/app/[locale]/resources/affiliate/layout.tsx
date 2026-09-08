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
    path: '/resources/affiliate',
    title: 'Affiliate Partner Program — 60% Recurring Commission',
    description: 'Join the Tranvas partner program. Earn 60% monthly recurring commission for up to 8 months per subscriber with a 90-day cookie window.',
  });
}

export default function AffiliateResourceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
