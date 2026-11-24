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
    path: '/resources/blog',
    title: isId ? "Blog Produktivitas, Atomic Habits & Finance OS" : "Productivity, Atomic Habits & Finance OS Blog",
    description: isId ? "Panduan berbasis sains tentang atomic habits, deep work 90 menit, zero-based personal finance, dan membangun Second Brain aktif." : "Evidence-based guides on atomic habits, 90-minute deep work, zero-based personal finance, and building an actionable Second Brain.",
  });
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
