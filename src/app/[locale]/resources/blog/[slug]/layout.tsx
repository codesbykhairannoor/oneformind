import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug, getAllBlogSlugs } from '@/lib/blogPosts';
import { constructPageMetadata } from '@/lib/seo';

export function generateStaticParams() {
  const slugs = getAllBlogSlugs();
  const locales = ['en', 'id'];
  return locales.flatMap((locale) =>
    slugs.map((slug) => ({
      locale,
      slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return constructPageMetadata({
      locale,
      path: `/resources/blog/${slug}`,
      title: 'Post Not Found',
      description: 'The requested blog article was not found on Tranvas.',
      noIndex: true,
    });
  }

  const rawTitle = post.seoTitle || post.title;
  const conciseTitle = rawTitle.length > 48
    ? `${rawTitle.slice(0, 47).replace(/\s+\S*$/, '').trim()}`
    : rawTitle;

  return constructPageMetadata({
    locale,
    path: `/resources/blog/${slug}`,
    title: conciseTitle,
    description: post.excerpt,
    image: '/og-banner',
  });
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

