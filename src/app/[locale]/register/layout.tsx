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
    path: '/register',
    title: isId ? 'Daftar Akun' : 'Get Started',
    description: isId
      ? 'Buat akun Tranvas Anda dan rasakan kemudahan mengelola seluruh aspek kehidupan dalam satu sistem terpadu.'
      : 'Create your Tranvas account and experience the unified life operating system designed for focus and clarity.',
    noIndex: true,
  });
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
