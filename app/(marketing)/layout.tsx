import { Footer } from "./_components/Footer";
import { Navbar } from "./_components/Navbar";
import { FloatingWhatsAppButton } from "./_components/FloatingWhatsAppButton";
import { CookieConsentProvider } from "./_components/CookieConsentProvider";
import { CookieConsentBanner } from "./_components/CookieConsentBanner";

export default function MarketingLayout({
                                            children,
                                        }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <CookieConsentProvider>
            <Navbar />
            {children}
            <Footer />
            <FloatingWhatsAppButton />
            <CookieConsentBanner />
        </CookieConsentProvider>
    );
}