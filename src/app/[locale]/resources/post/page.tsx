import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';

export default async function LegacyPostRedirect() {
  const locale = await getLocale();
  const prefix = locale === 'id' ? '/id' : '';
  redirect(`${prefix}/resources/blog/why-habit-and-finance-in-one-app-beats-notion`);
}
