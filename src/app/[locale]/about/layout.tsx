import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us — Our Mission',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
