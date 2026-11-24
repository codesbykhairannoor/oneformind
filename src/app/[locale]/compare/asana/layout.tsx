import { Metadata } from 'next';
import { getComparePageMetadata } from '@/lib/compareSeoData';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getComparePageMetadata('asana', locale);
}

export default function CompareAsanaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
