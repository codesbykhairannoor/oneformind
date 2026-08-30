import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up | Tranvas',
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
