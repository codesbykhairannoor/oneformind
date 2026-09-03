import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'For Freelancers — Scale Your Workflow',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}