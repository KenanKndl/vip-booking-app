import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import { getTranslations, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import Script from "next/script"; 

const figtree = Figtree({
    subsets: ["latin"],
    variable: "--font-sans",
});

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
        // YENİ: Google AdSense Doğrulama Meta Etiketi
        other: {
            "google-adsense-account": "ca-pub-5995294488210697"
        }
    };
}

export default async function RootLayout({
                                       children,
                                       params,
                                   }: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}>) {
    
    const { locale } = await params;
    const messages = await getMessages();

    return (
        <html lang={locale} className={cn("h-full antialiased scroll-smooth", figtree.variable)}>
        <body className="min-h-full bg-[#0d0d0d] font-sans text-foreground overflow-x-hidden">
        
        {/* YENİ: Google AdSense Scripti */}
        <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5995294488210697"
            crossOrigin="anonymous"
            strategy="afterInteractive"
        />

        {/* Google Analytics Başlangıç */}
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

        <NextIntlClientProvider messages={messages}>
            {children}
        </NextIntlClientProvider>
        </body>
        </html>
    );
}