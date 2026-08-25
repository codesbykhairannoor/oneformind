import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ynab | OneForMind',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}