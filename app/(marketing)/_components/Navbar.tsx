"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
    { label: "Hakkımızda", href: "/hakkimizda" },
    { label: "Galeri", href: "/galeri" },
    { label: "İletişim", href: "/iletisim" },
];

const languages = [
    { code: "TR", label: "Türkçe" },
    { code: "EN", label: "English" },
    { code: "DE", label: "Deutsch" },
    { code: "RU", label: "Русский" },
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

    // Mobil menü açıldığında arkadaki sayfanın kaymasını engellemek için
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMobileMenuOpen]);

    return (
        <header
            className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
                isScrolled
                    ? "border-b border-white/5 bg-[#0d0d0d]/80 backdrop-blur-md py-4"
                    : "bg-transparent py-6"
            }`}
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 md:px-8">

                {/* LOGO: Önerdiğimiz İnce Tipografik Hat (MATILDA) */}
                <Link href="/" className="flex items-center gap-2.5 group relative z-50">
                    <Shield className="h-4 w-4 text-white/50 stroke-[1.2] transition-colors group-hover:text-white" />
                    <span className="text-sm font-bold tracking-[0.4em] text-white uppercase">
                        MATILDA
                    </span>
                </Link>

                {/* DESKTOP NAVIGASYON (Büyük Ekranlar) */}
                <nav className="hidden items-center gap-8 md:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="text-xs font-semibold tracking-widest text-white/50 uppercase transition-colors hover:text-white"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* DESKTOP DİL SEÇİMİ VE BUTON */}
                <div className="hidden items-center gap-6 md:flex">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-1.5 text-xs font-semibold tracking-widest text-white/50 uppercase outline-none transition-colors hover:text-white">
                            <span>TR</span>
                            <ChevronDown className="h-3 w-3 opacity-60" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="border-white/5 bg-[#121212] min-w-[120px] rounded-xl">
                            {languages.map((lang) => (
                                <DropdownMenuItem
                                    key={lang.code}
                                    className="text-xs font-medium text-white/60 focus:bg-white/5 focus:text-white cursor-pointer py-2.5 px-3"
                                >
                                    {lang.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Link
                        href="/rezervasyon"
                        className="inline-flex h-10 items-center justify-center rounded-full bg-white px-6 text-xs font-semibold tracking-wider text-black uppercase transition-all hover:bg-white/90"
                    >
                        Rezervasyon Yap
                    </Link>
                </div>

                {/* MOBİL TETİKLEYİCİ: Arka planı tamamen silinmiş temiz buton */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="relative z-50 flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white md:hidden bg-transparent border-none outline-none focus:outline-none"
                    aria-label="Menüyü aç/kapa"
                >
                    {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {/* PREMİUM VE FLAT MOBİL SEKME TASARIMI */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        // Tamamen düz siyah, tam ekranı kaplayan, taşma yapmayan modern menü yapısı
                        className="fixed inset-0 z-40 flex flex-col justify-between bg-[#0d0d0d] px-8 pt-32 pb-12 md:hidden"
                    >
                        {/* Menü Linkleri: Büyük, Editoryal ve Harf Aralığı Geniş */}
                        <div className="flex flex-col gap-8">
                            {navItems.map((item, index) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.08, duration: 0.4 }}
                                    key={item.label}
                                >
                                    <Link
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-2xl font-semibold tracking-[0.15em] text-white/90 uppercase transition-colors active:text-white"
                                    >
                                        {item.label}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* Alt Kısım: Dil Seçenekleri ve Aksiyon Butonu */}
                        <div className="flex flex-col gap-8 border-t border-white/5 pt-8">
                            {/* Temiz Dil Matrisi */}
                            <div className="flex flex-col gap-3">
                                <span className="text-xs font-bold text-white/30 uppercase tracking-widest">Dil Seçimi</span>
                                <div className="flex flex-wrap gap-2">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-xs font-semibold tracking-wider text-white/70 active:bg-white active:text-black transition-all"
                                        >
                                            {lang.code}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Geniş ve Rahat Mobil Rezervasyon Butonu */}
                            <Link
                                href="/rezervasyon"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex h-14 w-full items-center justify-center rounded-full bg-white text-sm font-bold tracking-widest text-black uppercase transition-colors active:bg-white/90"
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