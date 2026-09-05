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
    path: '/company/status',
    title: 'System Status — Operational Uptime',
    description: 'Check real-time operational status, uptime metrics, incident reports, and maintenance schedules for Tranvas services.',
  });
}

export default function CompanyStatusLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
