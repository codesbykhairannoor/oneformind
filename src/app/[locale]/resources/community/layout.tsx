import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community — Connect with Users',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}