"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter, usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { useCurrencyStore } from "@/store/useCurrencyStore";

const navConfig = [
    { key: "about", href: "/hakkimizda" },
    { key: "gallery", href: "/galeri" },
    { key: "contact", href: "/iletisim" },
    { key: "pnrSearch", href: "/sorgula" },
];

const languages = [
    { code: "tr", label: "Türkçe", flagClass: "fi fi-tr" },
    { code: "en", label: "English", flagClass: "fi fi-gb" },
    { code: "de", label: "Deutsch", flagClass: "fi fi-de" },
    { code: "ru", label: "Русский", flagClass: "fi fi-ru" },
    { code: "nl", label: "Nederlands", flagClass: "fi fi-nl" },
];

const currencies = [
    { code: "EUR", symbol: "€", label: "Euro" },
    { code: "USD", symbol: "$", label: "US Dollar" },
    { code: "TRY", symbol: "₺", label: "Türk Lirası" },
];

export function Navbar() {
    const t = useTranslations("Navbar");
    const router = useRouter();
    const pathname = usePathname();
    const currentLocale = useLocale();

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const selectedCurrency = useCurrencyStore((state) => state.currency);
    const setSelectedCurrency = useCurrencyStore((state) => state.setCurrency);

    const selectedLanguageData =
        languages.find((language) => language.code === currentLocale) ?? languages[0];

    const activeCurrencyData =
        currencies.find((currency) => currency.code === selectedCurrency) ?? currencies[0];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLocaleChange = (locale: string) => {
        const segments = pathname.split("/");
        segments[1] = locale;
        router.push(segments.join("/"));
    };

    return (
        <header
            className={`fixed left-0 top-0 z-50 h-20 w-full transition-all duration-300 ${
                isScrolled ? "border-none bg-[#0d0d0d] shadow-none" : "bg-transparent"
            }`}
        >
            <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 lg:px-8">
                <div className="flex items-center gap-12">
                    <Link href="/" className="flex h-12 items-center">
                        <Image
                            src="/images/matilda-logo-cropped.png"
                            alt="Matilda Logo"
                            width={160}
                            height={60}
                            priority
                            className="h-10 w-auto object-contain sm:h-11"
                        />
                    </Link>

                    <nav className="hidden items-center gap-8 md:flex">
                        {navConfig.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="py-2 text-sm font-medium text-white/55 transition-colors duration-200 hover:text-white"
                            >
                                {t(`nav.${item.key}`)}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="hidden items-center gap-2 md:flex">
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                className="flex h-10 min-w-[82px] items-center justify-center gap-2 rounded-full px-4 text-xs font-semibold text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                            >
                                <span
                                    className={`${selectedLanguageData.flagClass} bg-transparent text-base outline-none shadow-none`}
                                />
                                <span>{selectedLanguageData.code.toUpperCase()}</span>
                                <ChevronDown className="h-3.5 w-3.5 text-white/40" />
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="end"
                            className="min-w-40 border-white/10 bg-[#111111] p-1 text-white !shadow-none [box-shadow:none]"
                        >
                            {languages.map((language) => (
                                <DropdownMenuItem
                                    key={language.code}
                                    onSelect={() => handleLocaleChange(language.code)}
                                    className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 !text-white outline-none transition-colors hover:!bg-white/10 hover:!text-white focus:!bg-white/10 focus:!text-white data-[highlighted]:!bg-white/10 data-[highlighted]:!text-white [&_span]:!text-white"
                                >
                                    <span
                                        className={`${language.flagClass} bg-transparent text-base outline-none shadow-none`}
                                    />
                                    <span className="text-sm">{language.label}</span>
                                    <span className="ml-auto text-xs">
                                        {language.code.toUpperCase()}
                                    </span>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                className="flex h-10 min-w-[70px] items-center justify-center gap-2 rounded-full px-3 text-xs font-semibold text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                            >
                                <span className="text-sm">{activeCurrencyData.symbol}</span>
                                <span>{activeCurrencyData.code}</span>
                                <ChevronDown className="h-3.5 w-3.5 text-white/40" />
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="end"
                            className="min-w-40 border-white/10 bg-[#111111] p-1 text-white !shadow-none [box-shadow:none]"
                        >
                            {currencies.map((currency) => (
                                <DropdownMenuItem
                                    key={currency.code}
                                    onSelect={() =>
                                        setSelectedCurrency(currency.code as "EUR" | "USD" | "TRY")
                                    }
                                    className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 !text-white outline-none transition-colors hover:!bg-white/10 hover:!text-white focus:!bg-white/10 focus:!text-white data-[highlighted]:!bg-white/10 data-[highlighted]:!text-white [&_span]:!text-white"
                                >
                                    <span className="w-4 text-center text-base font-bold text-white/70">
                                        {currency.symbol}
                                    </span>
                                    <span className="text-sm">{currency.label}</span>
                                    <span className="ml-auto text-xs">{currency.code}</span>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Link
                        href="/rezervasyon"
                        className="ml-2 inline-flex h-10 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black transition-colors hover:bg-white/90"
                    >
                        {t("buttons.book")}
                    </Link>
                </div>

                <div className="flex md:hidden">
                    <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                        aria-label={
                            isMobileMenuOpen
                                ? t("mobile.closeMenu")
                                : t("mobile.openMenu")
                        }
                        className="relative flex h-10 w-10 items-center justify-center rounded-full text-white/75 transition-colors duration-300 hover:text-white"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {isMobileMenuOpen ? (
                                <motion.span
                                    key="close"
                                    initial={{ opacity: 0, rotate: -90, scale: 0.85 }}
                                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                    exit={{ opacity: 0, rotate: 90, scale: 0.85 }}
                                    transition={{ duration: 0.18, ease: "easeOut" }}
                                    className="absolute"
                                >
                                    <X className="h-5 w-5" />
                                </motion.span>
                            ) : (
                                <motion.span
                                    key="menu"
                                    initial={{ opacity: 0, rotate: 90, scale: 0.85 }}
                                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                    exit={{ opacity: 0, rotate: -90, scale: 0.85 }}
                                    transition={{ duration: 0.18, ease: "easeOut" }}
                                    className="absolute"
                                >
                                    <Menu className="h-5 w-5" />
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="fixed left-0 top-20 z-40 flex h-[calc(100svh-5rem)] w-full flex-col bg-[#0d0d0d] px-6 py-8 md:hidden"
                    >
                        <div className="flex flex-1 flex-col">
                            <div className="flex flex-col gap-6">
                                {navConfig.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-lg font-medium text-white/70 transition-colors hover:text-white"
                                    >
                                        {t(`nav.${item.key}`)}
                                    </Link>
                                ))}

                                <div className="my-2 h-px w-full bg-white/5" />

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-white/40">
                                        {t("mobile.languageSelection")}
                                    </span>

                                    <div className="flex gap-1.5">
                                        {languages.map((language) => {
                                            const isActive = currentLocale === language.code;

                                            return (
                                                <button
                                                    key={language.code}
                                                    type="button"
                                                    onClick={() => handleLocaleChange(language.code)}
                                                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                                                        isActive
                                                            ? "bg-white text-black"
                                                            : "text-white/55 hover:bg-white/10 hover:text-white"
                                                    }`}
                                                >
                                                    {language.code.toUpperCase()}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="mt-2 flex items-center justify-between">
                                    <span className="text-sm font-medium text-white/40">
                                        {t("mobile.currencySelection")}
                                    </span>

                                    <div className="flex gap-1.5">
                                        {currencies.map((currency) => {
                                            const isActive = selectedCurrency === currency.code;

                                            return (
                                                <button
                                                    key={currency.code}
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedCurrency(
                                                            currency.code as "EUR" | "USD" | "TRY"
                                                        )
                                                    }
                                                    className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                                                        isActive
                                                            ? "bg-white text-black"
                                                            : "text-white/55 hover:bg-white/10 hover:text-white"
                                                    }`}
                                                >
                                                    <span>{currency.symbol}</span>
                                                    <span>{currency.code}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <Link
                                href="/rezervasyon"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="mt-auto inline-flex h-12 w-full items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black active:scale-[0.98]"
                            >
                                {t("buttons.book")}
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}