import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Career Accelerator | Tranvas',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}