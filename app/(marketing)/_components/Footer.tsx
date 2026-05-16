import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaInstagram, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";

const footerLinks = [
    {
        label: "Hakkımızda",
        href: "#about",
    },
    {
        label: "Araçlarımız",
        href: "/araclarimiz",
    },
    {
        label: "Galeri",
        href: "#gallery",
    },
    {
        label: "Rezervasyonlar",
        href: "#reservations",
    },
    {
        label: "İletişim",
        href: "#contact",
    },
];

const socialLinks = [
    {
        label: "Instagram",
        href: "https://instagram.com",
        icon: FaInstagram,
    },
    {
        label: "LinkedIn",
        href: "https://linkedin.com",
        icon: FaLinkedinIn,
    },
    {
        label: "WhatsApp",
        href: "https://wa.me/905000000000",
        icon: FaWhatsapp,
    },
];

export function Footer() {
    return (
        <>
            <footer className="border-t border-white/10 bg-[#0d0d0d] px-6 py-16 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr_1fr]">
                        <div>
                            <Link
                                href="/"
                                className="text-sm font-semibold tracking-[0.35em] text-white uppercase"
                            >
                                VIP BOOKING
                            </Link>

                            <p className="mt-5 max-w-md text-sm leading-7 text-white/45">
                                Havalimanı, şehir içi ve özel etkinlik transferleriniz için
                                güvenilir, konforlu ve profesyonel VIP ulaşım deneyimi.
                            </p>

                            <div className="mt-7 flex items-center gap-3">
                                {socialLinks.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={item.label}
                                            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/45 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.04] hover:text-white"
                                        >
                                            <Icon className="h-4 w-4" />
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-white">
                                Hızlı Linkler
                            </h3>

                            <nav className="mt-5 flex flex-col gap-3">
                                {footerLinks.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="text-sm text-white/45 transition-colors hover:text-white"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        <div id="contact">
                            <h3 className="text-sm font-semibold text-white">
                                İletişim Bilgileri
                            </h3>

                            <div className="mt-5 space-y-4">
                                <div className="flex gap-3 text-sm leading-6 text-white/45">
                                    <MapPin className="mt-1 h-4 w-4 shrink-0 text-white/35" />
                                    <span>
                    Antalya Havalimanı, Lara, Belek, Kemer ve şehir içi VIP
                    transfer hizmetleri
                  </span>
                                </div>

                                <Link
                                    href="tel:+905000000000"
                                    className="flex gap-3 text-sm text-white/45 transition-colors hover:text-white"
                                >
                                    <Phone className="h-4 w-4 shrink-0 text-white/35" />
                                    <span>+90 500 000 00 00</span>
                                </Link>

                                <Link
                                    href="mailto:reservation@vipbooking.com"
                                    className="flex gap-3 text-sm text-white/45 transition-colors hover:text-white"
                                >
                                    <Mail className="h-4 w-4 shrink-0 text-white/35" />
                                    <span>reservation@vipbooking.com</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/30 md:flex-row md:items-center md:justify-between">
                        <p>© 2026 VIP Booking. Tüm hakları saklıdır.</p>

                        <div className="flex gap-5">
                            <Link href="#" className="transition-colors hover:text-white/60">
                                Gizlilik Politikası
                            </Link>
                            <Link href="#" className="transition-colors hover:text-white/60">
                                Kullanım Şartları
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>

            <Link
                href="https://wa.me/905000000000"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp ile iletişime geç"
                className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/30 transition-transform duration-300 hover:scale-105"
            >
                <FaWhatsapp className="h-7 w-7" />
            </Link>
        </>
    );
}