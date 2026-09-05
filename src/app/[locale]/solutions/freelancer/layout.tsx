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
    path: '/solutions/freelancer',
    title: 'For Freelancers — Scale Your Workflow',
    description: 'Manage client projects, deadlines, invoices, billable hours, and personal capacity in a unified freelancer workspace.',
  });
}

export default function FreelancerSolutionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
