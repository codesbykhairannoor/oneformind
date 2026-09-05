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
    path: '/solutions/mental-clarity',
    title: 'Mental Health — Journaling & Mindfulness',
    description: 'Cultivate mindfulness, reduce stress, and reflect on life with guided gratitude journaling and wellness habit routines.',
  });
}

export default function MentalClaritySolutionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
