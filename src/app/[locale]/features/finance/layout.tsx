import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Finance | OneForMind',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}