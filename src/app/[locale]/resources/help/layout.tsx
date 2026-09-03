import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help Center — Find Solutions',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}