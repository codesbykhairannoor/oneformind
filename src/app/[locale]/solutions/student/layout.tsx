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
    path: '/solutions/student',
    title: 'For Students — Optimize Your Learning',
    description: 'Ace your studies with academic schedule planning, assignment tracking, study routines, and exam preparation workflows.',
  });
}

export default function StudentSolutionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
