import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['tr', 'en', 'ru', 'de', 'nl'],
  defaultLocale: 'tr'
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};