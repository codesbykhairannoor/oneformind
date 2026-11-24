import { Metadata } from 'next';
import { getComparePageMetadata } from '@/lib/compareSeoData';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getComparePageMetadata('management-tools', locale);
}

export default function CompareManagementToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
