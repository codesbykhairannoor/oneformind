import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — User Agreement & Usage Rules',
  description: 'Review the Terms of Service governing your account, usage rights, subscription plans, and service commitments on the Tranvas platform.',
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
