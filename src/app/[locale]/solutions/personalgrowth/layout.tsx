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
    path: '/solutions/personalgrowth',
    title: 'Personal Growth — Master Your Self-System',
    description: 'Design an intentional lifestyle through holistic daily planning, habit consistency, mindful reflection, and goal alignment.',
  });
}

export default function PersonalGrowthSolutionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
