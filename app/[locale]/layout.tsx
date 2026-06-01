import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import { getTranslations, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import Script from "next/script"; // YENİ: Google Analytics için Script eklendi

const figtree = Figtree({
    subsets: ["latin"],
    variable: "--font-sans",
});

// ÇÖZÜM 2: params artık bir Promise, bu yüzden önce await ile çözümlüyoruz
export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "RootLayout" });

    return {
        title: t("title"),
        description: t("description"),
    };
}

export default async function RootLayout({
                                       children,
                                       params,
                                   }: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}>) {
    
    // URL'den dili yakalıyoruz
    const { locale } = await params;
    
    // ÇÖZÜM 1: Client bileşenleri için (Navbar vb.) çevirileri alıyoruz
    const messages = await getMessages();

    return (
        <html lang={locale} className={cn("h-full antialiased scroll-smooth", figtree.variable)}>
        <body className="min-h-full bg-[#0d0d0d] font-sans text-foreground overflow-x-hidden">
        
        {/* YENİ: Google Analytics Başlangıç */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-3F1DJ3LTWK`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-3F1DJ3LTWK', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        {/* Google Analytics Bitiş */}

        {/* Tüm uygulamayı Provider ile sarmalıyoruz ki Client Component'lar çevirilere erişebilsin */}
        <NextIntlClientProvider messages={messages}>
            {children}
        </NextIntlClientProvider>
        </body>
        </html>
    );
}