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
    path: '/solutions/student',
    title: isId ? "Life OS untuk Mahasiswa: IPK, Jadwal Kuliah & Budget" : "Life OS for Students: GPA, Study Habits & Budget",
    description: isId ? "Raih prestasi akademik tanpa burnout—kelola mata kuliah, simulasi IPK, habit belajar, tugas, dan uang saku dalam satu aplikasi." : "Ace exams without burnout—manage courses, GPA forecasting, study habits, assignment deadlines, and student budgets in one unified app.",
  });
}

export default async function StudentSolutionLayout({
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
    { name: isId ? "Untuk Mahasiswa" : "For Students", url: isId ? '/id/solutions/student' : '/solutions/student' },
  ];

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
