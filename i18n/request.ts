import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

const locales = ['tr', 'en', 'de', 'ru', 'nl']; // YENİ: 'nl' eklendi

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  const currentLocale = locale || 'tr';
  if (!locales.includes(currentLocale)) notFound();

  return {
    locale: currentLocale,
    messages: (await import(`../messages/${currentLocale}.json`)).default
  };
});