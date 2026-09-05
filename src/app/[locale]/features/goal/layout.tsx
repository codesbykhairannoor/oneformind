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
    path: '/features/goal',
    title: 'Goal Tracker — Track Your Milestones',
    description: 'Break down ambitious yearly goals into actionable milestones, track key results, and celebrate continuous progress.',
  });
}

export default function GoalFeatureLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
