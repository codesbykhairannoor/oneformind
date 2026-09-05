import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us — Support & Inquiries',
  description: 'Connect directly with our customer experience team for support, feature feedback, and partnership opportunities.',
};

export default function CompanyContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
