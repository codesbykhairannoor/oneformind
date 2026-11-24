import { Metadata } from 'next';
import { getComparePageMetadata } from '@/lib/compareSeoData';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getComparePageMetadata('notion', locale);
}

export default function CompareNotionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
