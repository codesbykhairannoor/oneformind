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
    path: '/features/finance',
    title: isId ? "Finance OS: Zero-Based Budget & Cashflow Pribadi" : "Zero-Based Personal Finance & Cashflow OS",
    description: isId ? "Kelola cashflow pribadi dengan multi-dompet, budgeting zero-based, target tabungan, dan analitik pengeluaran terhubung habit." : "Master personal cashflow with multi-wallet tracking, zero-based monthly budgets, savings milestones, and habit-linked spending insights.",
  });
}

export default async function FinanceFeatureLayout({
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
    { name: isId ? 'Fitur' : 'Features', url: isId ? '/id/features' : '/features' },
    { name: isId ? "Finance OS" : "Finance OS", url: isId ? '/id/features/finance' : '/features/finance' },
  ];

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
