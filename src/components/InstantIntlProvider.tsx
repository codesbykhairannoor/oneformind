'use client';

import React, { useState, useEffect, useRef } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';

// PERF: Do NOT statically import both JSON files here.
// Doing `import enMessages from '@/messages/en.json'` would bundle 800KB of
// translation data into every page's JS, even for users who only need one lang.
// Instead we lazy-load only the active locale's messages at runtime.
type Messages = Record<string, string>;

async function loadMessages(locale: string): Promise<Messages> {
  if (locale === 'id') {
    const mod = await import('../messages/id.json');
    return mod.default as unknown as Messages;
  }
  const mod = await import('../messages/en.json');
  return mod.default as unknown as Messages;
}

export default function InstantIntlProvider({
  children,
  initialLocale,
  initialMessages,
}: {
  children: React.ReactNode;
  initialLocale: string;
  initialMessages?: Messages;
}) {
  const [locale, setLocale] = useState(initialLocale);
  const [messages, setMessages] = useState<Messages | null>(initialMessages || null);
  const loadedLocaleRef = useRef<string | null>(initialMessages ? initialLocale : null);

  // Load messages for the current locale if changed or not provided
  useEffect(() => {
    if (loadedLocaleRef.current === locale && messages) return;
    loadedLocaleRef.current = locale;
    loadMessages(locale).then(setMessages);
  }, [locale, messages]);

  // Sync state if initialLocale changes externally (e.g. user manually changes URL prefix)
  useEffect(() => {
    setLocale(initialLocale);
  }, [initialLocale]);

  // Sync HTML lang attribute
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  // Don't render children until messages are loaded (prevents flash of untranslated content)
  if (!messages) return null;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LocaleSwitcherListener locale={locale} setLocale={setLocale} />
      {children}
    </NextIntlClientProvider>
  );
}

function LocaleSwitcherListener({
  locale,
  setLocale,
}: {
  locale: string;
  setLocale: (l: string) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleSwitch = (e: CustomEvent<{ locale: string }>) => {
      const newLocale = e.detail.locale;
      if (newLocale && newLocale !== locale) {
        setLocale(newLocale);
        localStorage.setItem('tranvas_locale', newLocale);
        document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;

        // next-intl's custom router automatically formats the URL prefix depending on the newLocale
        const currentSearch = window.location.search;
        const currentHash = window.location.hash;
        router.replace(`${pathname}${currentSearch}${currentHash}`, { locale: newLocale, scroll: false });
      }
    };

    window.addEventListener('switch-locale' as any, handleSwitch);
    return () => {
      window.removeEventListener('switch-locale' as any, handleSwitch);
    };
  }, [locale, pathname, router, setLocale]);

  return null;
}

