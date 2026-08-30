import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Log In | Tranvas',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
