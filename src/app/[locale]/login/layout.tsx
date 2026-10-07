import { Metadata } from 'next';
import { constructPageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isId = locale === 'id';
  return constructPageMetadata({
    locale,
    path: '/login',
    title: isId ? 'Masuk' : 'Log in',
    description: isId
      ? 'Masuk ke akun Tranvas Anda untuk mengakses planner harian, matriks habit, manajemen keuangan, dan target hidup terpadu.'
      : 'Sign in to access your personal dashboard, habits, daily planner, finance tracking, and neural productivity tools.',
    noIndex: true,
  });
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
