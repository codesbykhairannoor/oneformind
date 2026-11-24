import { Metadata } from 'next';
import { getComparePageMetadata } from '@/lib/compareSeoData';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getComparePageMetadata('habit-apps', locale);
}

export default function CompareHabitAppsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
