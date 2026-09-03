import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tranvas vs Monday — Which is Better?',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}