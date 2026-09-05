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
    path: '/compare/custom-apps',
    title: 'Tranvas vs Custom Apps — Detailed Feature Comparison',
    description: 'Compare Tranvas and Custom Apps. See feature differences, habit tracking, daily planning, pricing, and why Tranvas is the unified Life OS.',
  });
}

export default function CompareCustomappsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
