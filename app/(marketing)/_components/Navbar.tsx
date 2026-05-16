"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
    { label: "Hakkımızda", href: "#about" },
    { label: "Galeri", href: "#gallery" },
    { label: "Rezervasyonlar", href: "#reservations" },
    { label: "İletişim", href: "#contact" },
];

const languages = [
    { code: "TR", label: "Türkçe", flagClass: "fi fi-tr" },
    { code: "EN", label: "English", flagClass: "fi fi-gb" },
    { code: "DE", label: "Deutsch", flagClass: "fi fi-de" },
    { code: "RU", label: "Русский", flagClass: "fi fi-ru" },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        // DEĞİŞİKLİK BURADA: border-b border-white/5 sınıfı tamamen kaldırıldı, jilet gibi düz olması sağlandı
        <header className={`fixed left-0 top-0 z-50 w-full h-20 transition-all duration-300 ${
            isScrolled
                ? "bg-[#0d0d0d] border-none shadow-none"
                : "bg-transparent"
        }`}>
            <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 lg:px-8">
                <div className="flex items-center gap-12">
                    <Link
                        href="/"
                        className="text-sm font-semibold tracking-[0.35em] text-white uppercase"
                    >
                        VIP BOOKING
                    </Link>

                    {/* Masaüstü Navigasyon */}
                    <nav className="hidden items-center gap-8 md:flex">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-sm font-medium text-white/55 transition-colors duration-200 hover:text-white py-2"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Sağ Taraf - Masaüstü */}
                <div className="hidden items-center gap-4 md:flex">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                className="flex h-10 items-center gap-2 rounded-full px-3 text-xs font-semibold text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                            >
                                <span className="fi fi-tr text-base" />
                                <span>TR</span>
                                <ChevronDown className="h-3.5 w-3.5 text-white/40" />
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="end"
                            className="min-w-40 border-white/10 bg-[#111111] p-1 text-white"
                        >
                            {languages.map((language) => (
                                <DropdownMenuItem
                                    key={language.code}
                                    className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-white/70 focus:bg-white/10 focus:text-white"
                                >
                                    <span className={`${language.flagClass} text-base`} />
                                    <span className="text-sm">{language.label}</span>
                                    <span className="ml-auto text-xs text-white/30">{language.code}</span>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Link
                        href="#booking"
                        className="inline-flex h-10 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black transition-colors hover:bg-white/90"
                    >
                        Rezervasyon Yap
                    </Link>
                </div>

                {/* Mobil Menü Butonu */}
                <div className="flex md:hidden">
                    <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white"
                    >
                        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobil Menü Paneli */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        // DEĞİŞİKLİK BURADA: Mobil panel altındaki border-b de temizlendi
                        className="absolute left-0 top-20 z-40 w-full bg-[#0d0d0d] px-6 py-8 md:hidden border-none"
                    >
                        <div className="flex flex-col gap-6">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-lg font-medium text-white/70 hover:text-white transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ))}

                            <div className="h-px w-full bg-white/5 my-2" />

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-white/40 font-medium">Dil Seçimi</span>
                                <div className="flex gap-2">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            className="px-3 py-1 rounded-md bg-white/5 text-xs font-semibold text-white/70 hover:bg-white hover:text-black transition-all"
                                        >
                                            {lang.code}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Link
                                href="#booking"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="inline-flex h-12 items-center justify-center rounded-full bg-white text-base font-semibold text-black"
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