import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server'; // Eksik olan import satırını ekledik

const intlMiddleware = createMiddleware({
  locales: ['tr', 'en', 'ru', 'de'],
  defaultLocale: 'tr'
});

// "Request" yerine "NextRequest" tipini tanımladık
export function proxy(request: NextRequest) {
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};