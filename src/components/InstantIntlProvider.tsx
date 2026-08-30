'use client';

import React, { useState, useEffect } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import enMessages from '@/messages/en.json';
import idMessages from '@/messages/id.json';

const messagesMap: Record<string, any> = {
  en: enMessages,
  id: idMessages,
};

export default function InstantIntlProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: string;
}) {
  const [locale, setLocale] = useState(initialLocale);

  // Sync state if initialLocale changes externally (e.g. user manually changes URL prefix)
  useEffect(() => {
    setLocale(initialLocale);
  }, [initialLocale]);

  // Sync HTML lang attribute
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <NextIntlClientProvider locale={locale} messages={messagesMap[locale]}>
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
      if (messagesMap[newLocale] && newLocale !== locale) {
        setLocale(newLocale);
        localStorage.setItem('tranvas_locale', newLocale);

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
