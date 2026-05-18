import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

const locales = ['tr', 'en', 'ru', 'de'];

// 'locale' yerine Promise olarak gelen 'requestLocale' parametresini alıyoruz
export default getRequestConfig(async ({requestLocale}) => {
  // Önce Promise'i await ile çözüp içindeki dili alıyoruz
  const locale = await requestLocale;

  // Eğer gelen dil desteklediğimiz dillerden biri değilse 404 sayfasına at
  if (!locale || !locales.includes(locale as any)) notFound();

  return {
    locale, 
    messages: (await import(`../messages/${locale}.json`)).default
  };
});