import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register | OneForMind',
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
