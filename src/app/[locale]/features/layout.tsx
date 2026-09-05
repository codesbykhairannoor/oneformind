import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Features Overview — All-in-One Life Operating System',
  description: 'Explore the 8 core modules of Tranvas: Task Planner, Atomic Habits, Smart Finance, Mindful Journal, Gemini Neural OS AI, and more.',
  openGraph: {
    title: 'Features Overview — Tranvas Life Operating System',
    description: 'Explore the 8 core modules of Tranvas: Task Planner, Atomic Habits, Smart Finance, Mindful Journal, Gemini Neural OS AI, and more.',
  },
};

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
