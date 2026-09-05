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
    path: '/solutions/career-accelerator',
    title: 'Career Tracker — Professional Growth System',
    description: 'Accelerate your career trajectory with skill development roadmaps, interview logs, achievement tracking, and mentor notes.',
  });
}

export default function CareerAcceleratorSolutionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
