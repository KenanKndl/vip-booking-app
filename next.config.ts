import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

// i18n dosyamızın yolunu belirtiyoruz (artık ana dizinde)
const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  // Arkadaşının eklediği başka ayarlar varsa buraya dokunma, içinde kalsın
};

export default withNextIntl(nextConfig);