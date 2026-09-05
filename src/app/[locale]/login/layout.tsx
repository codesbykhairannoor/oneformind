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
    path: '/login',
    title: 'Log In — Welcome Back to Tranvas',
    description: 'Sign in to access your personal dashboard, habits, daily planner, finance tracking, and neural productivity tools.',
  });
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
