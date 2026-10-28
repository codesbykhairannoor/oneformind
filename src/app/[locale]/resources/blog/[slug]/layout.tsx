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

  return constructPageMetadata({
    locale,
    path: `/resources/blog/${slug}`,
    title: post.title,
    description: post.excerpt,
    image: post.image,
  });
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

