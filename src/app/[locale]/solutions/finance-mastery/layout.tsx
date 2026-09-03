import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Financial Clarity — Manage Assets & Cashflow',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}