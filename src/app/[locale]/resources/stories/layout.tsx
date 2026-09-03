import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Success Stories — User Transformations',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}