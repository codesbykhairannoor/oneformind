import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Personal Growth — Master Your Self-System',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}