import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Press Kit & Brand Assets',
  description: 'Download official Tranvas brand assets, logos, product screenshots, founder story, and media guidelines.',
};

export default function CompanyPressKitLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
