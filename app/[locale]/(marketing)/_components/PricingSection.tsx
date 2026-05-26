"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useCurrencyStore } from "@/store/useCurrencyStore"; 

type RouteItem = {
    to: string;
    price: number;
};

type RouteGroup = {
    id: string;
    label: string;
    routes: RouteItem[];
};

type ExchangeRates = {
    eurToTl: number;
    eurToUsd: number;
};

// Arkadaşının eklediği 'bg' özellikleri dinamik yapıya (PALETTES) entegre edildi
const PALETTES = [
    { dot: "bg-[#22D3EE]", border: "border-[#22D3EE]/35", text: "text-[#22D3EE]", bg: "bg-[#22D3EE]/10" }, 
    { dot: "bg-[#C084FC]", border: "border-[#C084FC]/35", text: "text-[#C084FC]", bg: "bg-[#C084FC]/10" }, 
    { dot: "bg-[#FACC15]", border: "border-[#FACC15]/35", text: "text-[#FACC15]", bg: "bg-[#FACC15]/10" }, 
    { dot: "bg-[#34D399]", border: "border-[#34D399]/35", text: "text-[#34D399]", bg: "bg-[#34D399]/10" }, 
    { dot: "bg-[#F87171]", border: "border-[#F87171]/35", text: "text-[#F87171]", bg: "bg-[#F87171]/10" }, 
];

const getLocationTone = (index: number) => {
    return PALETTES[index % PALETTES.length];
};

export function PricingSection({ 
    routeGroups = [], 
    exchangeRates 
}: { 
    routeGroups?: RouteGroup[], 
    exchangeRates?: ExchangeRates 
}) {
    const t = useTranslations("PricingSection");
    
    // Hem masaüstü hem de mobil için ayrı state'ler tutuluyor
    const [activeIndex, setActiveIndex] = useState(0);
    const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
    
    // Kur işlemleri
    const { currency } = useCurrencyStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!routeGroups || routeGroups.length === 0) {
        return null; 
    }

    // Aktif grupların dinamik atamaları
    const activeGroup = routeGroups[activeIndex];
    const activeTone = getLocationTone(activeIndex);

    const mobileActiveGroup = routeGroups[mobileActiveIndex];
    const mobileActiveTone = getLocationTone(mobileActiveIndex);

    return (
        <>
            {/* ========================================== */}
            {/* 📱 MOBİL VERSİYON (Arkadaşının Tasarımı) */}
            {/* ========================================== */}
            <section
                id="pricing"
                className="bg-[#0d0d0d] px-4 py-20 sm:px-6 lg:hidden"
            >
                <div className="mx-auto max-w-2xl">
                    <div>
                        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                            {t("titlePart1")}{" "}
                            <span className="text-white/45">{t("titlePart2")}</span>
                        </h2>

                        <p className="mt-4 text-sm leading-7 text-white/45 sm:text-base">
                            {t("description")}
                        </p>
                    </div>

                    {/* Yatay Kaydırılabilir Sekmeler */}
                    <div className="mt-7 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        <div className="flex min-w-max gap-2">
                            {routeGroups.map((group, index) => {
                                const isActive = mobileActiveIndex === index;
                                const tone = getLocationTone(index);

                                return (
                                    <button
                                        key={group.id}
                                        type="button"
                                        onClick={() => setMobileActiveIndex(index)}
                                        className={`flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition ${
                                            isActive
                                                ? `${tone.border} ${tone.bg} text-white`
                                                : "border-white/10 bg-white/[0.03] text-white/45 active:bg-white/[0.06]"
                                        }`}
                                    >
                                        <span
                                            className={`h-2 w-2 rounded-full ${
                                                isActive ? tone.dot : "bg-white/25"
                                            }`}
                                        />
                                        {group.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Mobilde Seçili Rotanın Detayları */}
                    <div className="mt-5 rounded-[1.75rem] border border-white/10 bg-white/[0.025] p-4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={mobileActiveGroup.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.18, ease: "easeOut" }}
                            >
                                <div className="border-b border-white/10 pb-4">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`h-2.5 w-2.5 rounded-full ${mobileActiveTone.dot}`}
                                        />
                                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/35">
                                            Kalkış noktası
                                        </p>
                                    </div>

                                    <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                                        {mobileActiveGroup.label}
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-white/40">
                                        Sık tercih edilen rotalar için başlangıç transfer ücretleri.
                                    </p>
                                </div>

                                <div className="mt-4 grid gap-2.5">
                                    {mobileActiveGroup.routes.map((route, index) => (
                                        <RoutePriceRow
                                            key={`${mobileActiveGroup.id}-${route.to}`}
                                            route={route}
                                            index={index}
                                            fromLabel={mobileActiveGroup.label}
                                            compact={true} // Mobil için sıkıştırılmış görünüm
                                            exchangeRates={exchangeRates}
                                            activeCurrency={mounted ? currency : "EUR"}
                                        />
                                    ))}
                                </div>

                                <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                                    <div className="flex items-start gap-3">
                                        <Info className="mt-0.5 h-4 w-4 shrink-0 text-white/30" />
                                        <p className="text-sm leading-6 text-white/45">
                                            Fiyatlar başlangıç transfer ücretidir. Araç tipi,
                                            yolcu sayısı ve gidiş-dönüş seçimine göre rezervasyon
                                            adımında netleşir.
                                        </p>
                                    </div>

                                    <Button
                                        asChild
                                        className="mt-4 h-11 w-full rounded-full bg-white px-6 text-sm font-semibold text-black transition-all hover:bg-white/90"
                                    >
                                        <Link href="/rezervasyon">{t("quoteButton")}</Link>
                                    </Button>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            {/* ========================================== */}
            {/* 💻 MASAÜSTÜ VERSİYON (Bizim Düzenlememiz) */}
            {/* ========================================== */}
            <section
                id="pricing-desktop"
                className="relative hidden bg-[#0d0d0d] px-6 lg:block lg:px-8"
            >
                <div className="flex items-start py-16 md:py-24">
                    <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
                        <div className="relative z-10">
                            <h2 className="max-w-xl text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
                                {t("titlePart1")}{" "}
                                <span className="text-white/45">{t("titlePart2")}</span>
                            </h2>

                            <p className="mt-5 max-w-xl text-base leading-8 text-white/45 md:text-lg">
                                {t("description")}
                            </p>

                            <div className="mt-8 grid gap-2.5">
                                {routeGroups.map((group, index) => {
                                    const isActive = activeIndex === index;
                                    const tone = getLocationTone(index);

                                    return (
                                        <button
                                            key={group.id}
                                            type="button"
                                            onClick={() => setActiveIndex(index)} // Kaydırma (scroll) hatası giderildi, artık tıklanabilir!
                                            className={`group flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition duration-300 ${
                                                isActive
                                                    ? `${tone.border} bg-white/[0.045]`
                                                    : "border-white/10 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.035]"
                                            }`}
                                        >
                                            <span className="flex min-w-0 items-center gap-3">
                                                <span
                                                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${tone.dot}`}
                                                />
                                                <span
                                                    className={`truncate text-sm font-semibold ${
                                                        isActive
                                                            ? "text-white"
                                                            : "text-white/55 group-hover:text-white/80"
                                                    }`}
                                                >
                                                    {group.label}
                                                </span>
                                            </span>

                                            <span
                                                className={`flex shrink-0 items-center gap-1.5 text-xs font-medium transition ${
                                                    isActive
                                                        ? tone.text
                                                        : "text-white/30 group-hover:text-white/45"
                                                }`}
                                            >
                                                {group.routes.length} popüler rota
                                                <ArrowRight
                                                    className={`h-3.5 w-3.5 transition duration-300 ${
                                                        isActive
                                                            ? "translate-x-0 opacity-100"
                                                            : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60"
                                                    }`}
                                                />
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="rounded-[2rem] border border-white/10 bg-white/[0.025] p-4 sm:p-5 lg:p-6 lg:sticky lg:top-24">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeGroup.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.22, ease: "easeOut" }}
                                >
                                    <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`h-2.5 w-2.5 rounded-full ${activeTone.dot}`}
                                                />
                                                <p className="text-sm font-medium text-white/40">
                                                    Kalkış noktası
                                                </p>
                                            </div>

                                            <h3 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                                                {activeGroup.label}
                                            </h3>
                                        </div>

                                        <p className="max-w-sm text-sm leading-6 text-white/40 sm:text-right">
                                            Sık tercih edilen rotalar için başlangıç transfer ücretleri.
                                        </p>
                                    </div>

                                    <div className="relative mt-4">
                                        <div className="max-h-[392px] overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                                            <div className="grid gap-2.5 py-1">
                                                {activeGroup.routes.map((route, index) => (
                                                    <RoutePriceRow
                                                        key={`${activeGroup.id}-${route.to}`}
                                                        route={route}
                                                        index={index}
                                                        fromLabel={activeGroup.label}
                                                        compact={false}
                                                        exchangeRates={exchangeRates} 
                                                        activeCurrency={mounted ? currency : "EUR"} 
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-5 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 sm:flex-row">
                                        <div className="flex items-start gap-3">
                                            <Info className="mt-0.5 h-4 w-4 shrink-0 text-white/30" />
                                            <p className="text-sm leading-6 text-white/45">
                                                Fiyatlar başlangıç transfer ücretidir. Araç tipi, yolcu sayısı ve gidiş-dönüş seçimine göre rezervasyon adımında netleşir.
                                            </p>
                                        </div>

                                        <Button
                                            asChild
                                            className="h-11 w-full shrink-0 rounded-full bg-white px-6 text-sm font-semibold text-black transition-all hover:bg-white/90 sm:w-auto"
                                        >
                                            <Link href="/rezervasyon">{t("quoteButton")}</Link>
                                        </Button>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

function RoutePriceRow({
    route,
    index,
    fromLabel,
    compact = false,
    exchangeRates,
    activeCurrency,
}: {
    route: RouteItem;
    index: number;
    fromLabel: string;
    compact?: boolean;
    exchangeRates?: ExchangeRates;
    activeCurrency: string;
}) {
    // Kur ve Sembol Hesaplama (Hem mobil hem masaüstü için geçerli)
    let displayPrice = route.price;
    let symbol = "€";

    if (activeCurrency === "TRY" || activeCurrency === "₺") {
        displayPrice = Math.round(route.price * (exchangeRates?.eurToTl || 35));
        symbol = "₺";
    } else if (activeCurrency === "USD" || activeCurrency === "$") {
        displayPrice = Math.round(route.price * (exchangeRates?.eurToUsd || 1.08));
        symbol = "$";
    } else if (activeCurrency === "GBP" || activeCurrency === "£") {
        displayPrice = Math.round(route.price * 0.85); 
        symbol = "£";
    }

    // Mobil İçin Sıkıştırılmış Görünüm
    if (compact) {
        return (
            <motion.article
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.18,
                    delay: Math.min(index, 8) * 0.018,
                    ease: "easeOut",
                }}
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
            >
                <div className="flex flex-col gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                        <span className="truncate text-xs text-white/35">
                            {fromLabel}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-white/25" />
                        <span className="truncate text-sm font-semibold text-white">
                            {route.to}
                        </span>
                    </div>

                    <div className="flex items-baseline justify-between gap-3">
                        <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/25">
                            Başlangıç
                        </span>
                        <span className="text-xl font-semibold tracking-tight text-white">
                            {symbol}{displayPrice.toLocaleString("en-US")}
                        </span>
                    </div>
                </div>
            </motion.article>
        );
    }

    // Masaüstü İçin Standart Görünüm
    return (
        <motion.article
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.18,
                delay: Math.min(index, 8) * 0.018,
                ease: "easeOut",
            }}
            className="group rounded-2xl border border-white/10 bg-black/20 px-4 py-3 transition duration-300 hover:border-white/15 hover:bg-white/[0.04] sm:px-5"
        >
            <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-2">
                    <span className="truncate text-sm text-white/35">
                        {fromLabel}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-white/25" />
                    <span className="truncate text-sm font-semibold text-white">
                        {route.to}
                    </span>
                </div>

                <div className="flex shrink-0 items-baseline gap-3 text-right">
                    <span className="hidden text-[11px] font-medium uppercase tracking-[0.14em] text-white/25 sm:inline">
                        Başlangıç
                    </span>
                    <span className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                        {symbol}{displayPrice.toLocaleString("en-US")}
                    </span>
                </div>
            </div>
        </motion.article>
    );
}