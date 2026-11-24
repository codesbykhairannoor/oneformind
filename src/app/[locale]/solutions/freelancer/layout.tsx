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
    path: '/solutions/freelancer',
    title: isId ? "Life OS untuk Freelancer: Klien, Cashflow & Fokus" : "Life OS for Freelancers: Clients, Cashflow & Focus",
    description: isId ? "Seimbangkan tenggat klien, pendapatan tidak tetap, blok fokus, dan kesehatan pribadi dalam satu sistem kerja freelancer." : "Balance client deadlines, variable freelance income, deep work blocks, and personal wellbeing in one calm operating system.",
  });
}

export default async function FreelancerSolutionLayout({
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
    { name: isId ? "Untuk Freelancer" : "For Freelancers", url: isId ? '/id/solutions/freelancer' : '/solutions/freelancer' },
  ];

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
