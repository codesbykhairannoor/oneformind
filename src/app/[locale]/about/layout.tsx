import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | OneForMind',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
