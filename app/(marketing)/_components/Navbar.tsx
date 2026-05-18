"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X, MapPinned } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCookieConsent } from "./CookieConsentProvider";
import type { LanguageCode } from "@/lib/cookie-consent";

const navItems = [
    { label: "Hakkımızda", href: "/hakkimizda" },
    { label: "Galeri", href: "/galeri" },
    { label: "İletişim", href: "/iletisim" },
];

const languages: {
    code: LanguageCode;
    label: string;
    flagClass: string;
}[] = [
    { code: "TR", label: "Türkçe", flagClass: "fi fi-tr" },
    { code: "EN", label: "English", flagClass: "fi fi-gb" },
    { code: "DE", label: "Deutsch", flagClass: "fi fi-de" },
    { code: "RU", label: "Русский", flagClass: "fi fi-ru" },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { selectedLanguage, setLanguagePreference } = useCookieConsent();

    const selectedLanguageData =
        languages.find((language) => language.code === selectedLanguage) ?? languages[0];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed left-0 top-0 z-50 h-20 w-full transition-all duration-300 ${
                isScrolled ? "border-none bg-[#0d0d0d] shadow-none" : "bg-transparent"
            }`}
        >
            <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 lg:px-8">
                <div className="flex items-center gap-12">
                    <Link href="/" className="group flex items-center gap-3">
                        <MapPinned className="h-8 w-8 shrink-0 text-white/60 stroke-[1.1] transition-colors group-hover:text-white" />

                        <div className="flex flex-col leading-none">
                            <span className="text-sm font-bold tracking-[0.22em] text-white uppercase sm:tracking-[0.3em]">
                                MATILDA
                            </span>

                            <span className="mt-1 text-[10px] font-medium tracking-[0.18em] text-white/40 uppercase sm:text-[11px] sm:tracking-[0.22em]">
                                VIP Transfer
                            </span>
                        </div>
                    </Link>

                    <nav className="hidden items-center gap-8 md:flex">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="py-2 text-sm font-medium text-white/55 transition-colors duration-200 hover:text-white"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="hidden items-center gap-4 md:flex">
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                className="flex h-10 min-w-[82px] items-center justify-center gap-2 rounded-full px-4 text-xs font-semibold text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                            >
                                <span
                                    className={`${selectedLanguageData.flagClass} bg-transparent text-base outline-none shadow-none`}
                                />
                                <span>{selectedLanguageData.code}</span>
                                <ChevronDown className="h-3.5 w-3.5 text-white/40" />
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="end"
                            className="min-w-40 border-white/10 bg-[#111111] p-1 text-white !shadow-none [box-shadow:none]"
                        >
                            {languages.map((language) => {
                                const isActive = selectedLanguage === language.code;
                                return (
                                    <DropdownMenuItem
                                        key={language.code}
                                        onSelect={() => setLanguagePreference(language.code)}
                                        className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 !text-white outline-none transition-colors hover:!bg-white/10 hover:!text-white focus:!bg-white/10 focus:!text-white data-[highlighted]:!bg-white/10 data-[highlighted]:!text-white [&_span]:!text-white"
                                    >
    <span
        className={`${language.flagClass} bg-transparent text-base outline-none shadow-none`}
    />
                                        <span className="text-sm">{language.label}</span>
                                        <span className="ml-auto text-xs">
        {language.code}
    </span>
                                    </DropdownMenuItem>
                                );
                            })}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Link
                        href="/rezervasyon"
                        className="inline-flex h-10 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black transition-colors hover:bg-white/90"
                    >
                        Rezervasyon Yap
                    </Link>
                </div>

                <div className="flex md:hidden">
                    <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                        aria-label={isMobileMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
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
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-lg font-medium text-white/70 transition-colors hover:text-white"
                                    >
                                        {item.label}
                                    </Link>
                                ))}

                                <div className="my-2 h-px w-full bg-white/5" />

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-white/40">
                                        Dil Seçimi
                                    </span>

                                    <div className="flex gap-1.5">
                                        {languages.map((language) => {
                                            const isActive = selectedLanguage === language.code;

                                            return (
                                                <button
                                                    key={language.code}
                                                    type="button"
                                                    onClick={() =>
                                                        setLanguagePreference(language.code)
                                                    }
                                                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                                                        isActive
                                                            ? "bg-white text-black"
                                                            : "text-white/55 hover:bg-white/10 hover:text-white"
                                                    }`}
                                                >
                                                    {language.code}
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
                                Rezervasyon Yap
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}