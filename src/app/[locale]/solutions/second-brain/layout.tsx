import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Second Brain System | Tranvas',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}