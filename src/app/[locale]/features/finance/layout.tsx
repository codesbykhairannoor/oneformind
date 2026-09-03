import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Finance OS — Master Your Money Flow',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}