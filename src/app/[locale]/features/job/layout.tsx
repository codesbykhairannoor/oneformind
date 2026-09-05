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
    path: '/features/job',
    title: 'Job Tracker — Manage Career Growth',
    description: 'Organize your job search, interviews, application stages, follow-ups, and recruiter communications in one centralized pipeline.',
  });
}

export default function JobFeatureLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
