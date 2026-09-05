import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us — Get in Touch with Support',
  description: 'Have questions or need assistance? Contact the Tranvas support and engineering team for product inquiries, partnership, or account help.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
