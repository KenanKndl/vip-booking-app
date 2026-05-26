import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaInstagram, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { CookieSettingsTrigger } from "./CookieSettingsTrigger";
import { useTranslations } from "next-intl";

const footerLinks = [
    {
        key: "about",
        href: "/hakkimizda",
    },
    {
        key: "gallery",
        href: "/galeri",
    },
    {
        key: "reservations",
        href: "/rezervasyon",
    },
    {
        key: "contact",
        href: "/iletisim",
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
    const t = useTranslations("Footer");

    return (
        <footer className="border-t border-white/10 bg-[#0d0d0d] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-10 sm:gap-12 lg:grid-cols-[1.2fr_0.8fr_1fr]">
                    <div>
                        <Link
                            href="/"
                            className="inline-flex text-sm font-semibold tracking-[0.28em] text-white uppercase sm:tracking-[0.35em]"
                        >
                            {t("brandName")}
                        </Link>

                        <p className="mt-5 max-w-md text-sm leading-7 text-white/45">
                            {t("description")}
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
                                        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white/45 transition-all duration-300 active:scale-[0.96] hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.04] hover:text-white sm:h-10 sm:w-10"
                                    >
                                        <Icon className="h-4 w-4" />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-white">
                            {t("quickLinksTitle")}
                        </h3>

                        <nav className="mt-4 grid gap-1 sm:mt-5">
                            {footerLinks.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="-mx-2 rounded-xl px-2 py-2 text-sm text-white/45 transition-colors hover:bg-white/[0.03] hover:text-white sm:mx-0 sm:px-0 sm:py-0 sm:hover:bg-transparent"
                                >
                                    {t(`links.${item.key}`)}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div id="contact">
                        <h3 className="text-sm font-semibold text-white">
                            {t("contactTitle")}
                        </h3>

                        <div className="mt-5 space-y-4">
                            <div className="flex gap-3 text-sm leading-6 text-white/45">
                                <MapPin className="mt-1 h-4 w-4 shrink-0 text-white/35" />
                                <span>{t("address")}</span>
                            </div>

                            <Link
                                href="tel:+905000000000"
                                className="-mx-2 flex rounded-xl px-2 py-2 text-sm text-white/45 transition-colors hover:bg-white/[0.03] hover:text-white sm:mx-0 sm:px-0 sm:py-0 sm:hover:bg-transparent"
                            >
                                <Phone className="mr-3 h-4 w-4 shrink-0 text-white/35" />
                                <span>+90 500 000 00 00</span>
                            </Link>

                            <Link
                                href="mailto:reservation@vipbooking.com"
                                className="-mx-2 flex rounded-xl px-2 py-2 text-sm text-white/45 transition-colors hover:bg-white/[0.03] hover:text-white sm:mx-0 sm:px-0 sm:py-0 sm:hover:bg-transparent"
                            >
                                <Mail className="mr-3 h-4 w-4 shrink-0 text-white/35" />
                                <span className="break-all">
                                    reservation@vipbooking.com
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex flex-col gap-5 border-t border-white/10 pt-6 text-xs text-white/30 sm:mt-14 md:flex-row md:items-center md:justify-between">
                    <p className="leading-6">{t("copyright")}</p>

                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-5">
                        <Link
                            href="/gizlilik-politikasi"
                            className="transition-colors hover:text-white/60"
                        >
                            {t("privacyPolicy")}
                        </Link>

                        <Link
                            href="/kullanim-sartlari"
                            className="transition-colors hover:text-white/60"
                        >
                            {t("termsOfUse")}
                        </Link>

                        <CookieSettingsTrigger />
                    </div>
                </div>
            </div>
        </footer>
    );
}