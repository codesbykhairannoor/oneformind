import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Security Architecture — Infrastructure & Trust',
  description: 'Learn about Tranvas multi-layered security infrastructure, encryption standards, vulnerability management, and data protection protocols.',
};

export default function CompanySecurityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
