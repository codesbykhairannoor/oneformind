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
    path: '/company/refund',
    title: 'Refund Policy — Satisfaction Guarantee',
    description: 'Review our transparent 14-day refund policy, subscription cancellation rules, and billing guarantees.',
  });
}

export default function CompanyRefundLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
