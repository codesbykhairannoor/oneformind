import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up — Start Your Journey',
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
