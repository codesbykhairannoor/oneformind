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
    path: '/pricing',
    title: 'Pricing & Plans — Choose Your Journey',
    description: 'Flexible pricing plans for individuals, creators, and teams. Master daily habits, planner tasks, and finances with Tranvas Life OS.',
  });
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
