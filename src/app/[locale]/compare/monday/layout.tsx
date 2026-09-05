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
    path: '/compare/monday',
    title: 'Tranvas vs Monday — Detailed Feature Comparison',
    description: 'Compare Tranvas and Monday. See feature differences, habit tracking, daily planning, pricing, and why Tranvas is the unified Life OS.',
  });
}

export default function CompareMondayLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
