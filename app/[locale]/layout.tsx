import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "../globals.css"; // [locale] klasörüne girdiğimiz için yol bir üst klasör oldu
import { cn } from "@/lib/utils";

const figtree = Figtree({
    subsets: ["latin"],
    variable: "--font-sans",
});

export const metadata: Metadata = {
    title: "VIP Booking App",
    description: "Premium reservation and booking experience.",
};

// Çoklu dil için asenkron yapıya çevrildi
export default async function RootLayout({
                                       children,
                                       params,
                                   }: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}>) {
    
    // URL'den dili yakalıyoruz
    const { locale } = await params;

    return (
        <html lang={locale} className={cn("h-full antialiased scroll-smooth", figtree.variable)}>
        <body className="min-h-full bg-[#0d0d0d] font-sans text-foreground overflow-x-hidden">
        {children}
        </body>
        </html>
    );
}