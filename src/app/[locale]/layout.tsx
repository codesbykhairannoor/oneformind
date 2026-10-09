import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import { getMessages } from 'next-intl/server';
import Script from 'next/script';
import InstantIntlProvider from "@/components/InstantIntlProvider";
import SwrProvider from "@/components/SwrProvider";
import { SessionProvider } from "@/components/SessionProvider";

import AffiliateTracker from "@/components/AffiliateTracker";
import TranvasDevHud from "@/components/dev/TranvasDevHud";

import "../globals.css";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap", // PERF: Use font-display:swap to prevent invisible text during font load
});

import { constructPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = 'https://tranvas.com';
  const isId = locale === 'id';

  const rootTitle = isId
    ? 'Tranvas | Life OS Terpadu'
    : 'Tranvas | The Unified Life OS';
  const rootDesc = isId
    ? 'Tranvas adalah Life Operating System terpadu: satukan Daily Planner, Habit Matrix 28 Hari, Smart Finance, WOOP Goals, Pipeline Karir, dan Jurnal Refleksi dalam satu sistem cerdas.'
    : 'Tranvas is the unified Life Operating System: seamlessly align daily planning, 28-day habit streaks, zero-based budgeting, WOOP goal cascading, career pipeline, and mindful reflections.';

  const baseMeta = constructPageMetadata({
    locale,
    path: '',
    title: rootTitle,
    description: rootDesc,
  });

  return {
    metadataBase: new URL(baseUrl),
    ...baseMeta,
    title: {
      template: '%s | Tranvas',
      default: rootTitle,
    },
  };
}

// PERF: Pre-generate both locale routes at build time so they're served
// from Vercel CDN edge cache with zero server function invocations.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}


export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} translate="no" className={`${plusJakartaSans.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('theme');
                var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (theme === 'dark' || (!theme && prefersDark)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
                var p = window.location.pathname;
                if (/\/(dashboard|planner|habits|finance|goals|jobs|journal|study|calendar|settings|profile|coach)(\/|$)/.test(p)) {
                  document.documentElement.classList.add('app-authenticated');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="selection:bg-indigo-100 selection:text-indigo-700 font-sans min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100" suppressHydrationWarning>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-7PNK1P4WZN" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7PNK1P4WZN');
          `}
        </Script>
          <InstantIntlProvider initialLocale={locale} initialMessages={messages as any}>
            <AffiliateTracker />
            <SessionProvider>
              <SwrProvider>
                {children}
                <TranvasDevHud />
              </SwrProvider>
            </SessionProvider>
          </InstantIntlProvider>
      </body>
    </html>
  );
}
