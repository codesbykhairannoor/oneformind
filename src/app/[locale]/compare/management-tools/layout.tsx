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
    path: '/compare/management-tools',
    title: 'Tranvas vs Management Tools — Detailed Feature Comparison',
    description: 'Compare Tranvas and Management Tools. See feature differences, habit tracking, daily planning, pricing, and why Tranvas is the unified Life OS.',
  });
}

export default function CompareManagementtoolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
