import { Metadata } from 'next';
import { constructPageMetadata } from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd';
import { getBreadcrumbSchema } from '@/lib/schema';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isId = locale === 'id';
  return constructPageMetadata({
    locale,
    path: '/resources/stories',
    title: isId ? "Kisah Pengguna: Transformasi Produktivitas Tranvas" : "Customer Stories: Real Life OS Transformations",
    description: isId ? "Simak bagaimana profesional, mahasiswa, dan freelancer menggantikan 5+ aplikasi terpisah dengan Tranvas Life OS." : "Read how professionals, students, and freelancers replaced 5+ fragmented apps with Tranvas to achieve lasting habits and financial calm.",
  });
}

export default async function StoriesLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isId = locale === 'id';
  const breadcrumbs = [
    { name: 'Home', url: isId ? '/id' : '/' },
    { name: isId ? "Kisah Pengguna" : "Customer Stories", url: isId ? '/id/resources/stories' : '/resources/stories' },
  ];

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
