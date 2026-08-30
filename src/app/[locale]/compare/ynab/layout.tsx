import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ynab | Tranvas',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}