import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Success Stories | Tranvas',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}