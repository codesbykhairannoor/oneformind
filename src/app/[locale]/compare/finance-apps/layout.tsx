import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tranvas vs Finance-apps — Which is Better?',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}