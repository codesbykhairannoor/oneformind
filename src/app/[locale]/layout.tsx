import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import { getMessages } from 'next-intl/server';
import Script from 'next/script';
import InstantIntlProvider from "@/components/InstantIntlProvider";

import "../globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap", // PERF: Use font-display:swap to prevent invisible text during font load
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const baseUrl = 'https://tranvas.com';
  const canonicalUrl = isEn ? baseUrl : `${baseUrl}/id`;

  return {
    metadataBase: new URL(baseUrl),
    title: {
      template: '%s | Tranvas',
      default: 'Tranvas | The Unified Life Operating System',
    },
    description:
      'Tranvas is the all-in-one Life Operating System. Master daily habits, plan tasks, track finances, and achieve your goals with total clarity and control.',
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': baseUrl,
        'id': `${baseUrl}/id`,
        'x-default': baseUrl,
      },
    },
    openGraph: {
      title: 'Tranvas | The Unified Life Operating System',
      description:
        'Tranvas is the all-in-one Life Operating System. Master daily habits, plan tasks, track finances, and achieve your goals with total clarity and control.',
      url: canonicalUrl,
      siteName: 'Tranvas',
      locale: isEn ? 'en_US' : 'id_ID',
      type: 'website',
      images: [
        {
          url: '/icon.png',
          width: 512,
          height: 512,
          alt: 'Tranvas - Unified Life Operating System',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Tranvas | The Unified Life Operating System',
      description:
        'Tranvas is the all-in-one Life Operating System. Master daily habits, plan tasks, track finances, and achieve your goals with total clarity and control.',
      images: ['/icon.png'],
      creator: '@tranvas_app',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
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
      <body className="selection:bg-indigo-100 selection:text-indigo-700 font-sans min-h-screen flex flex-col bg-white text-slate-900" suppressHydrationWarning>
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
            {children}
          </InstantIntlProvider>
      </body>
    </html>
  );
}
