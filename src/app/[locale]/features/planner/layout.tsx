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
    path: '/features/planner',
    title: 'Daily Planner — Focus on What Matters',
    description: 'Supercharge your daily workflow with an adaptive daily task planner, batch time-blocking, priority matrix, and intelligent focus modes.',
  });
}

export default function PlannerFeatureLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
