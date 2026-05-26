"use client";

import { useMemo, useRef, useState } from "react";
import {
    AnimatePresence,
    motion,
    useMotionValueEvent,
    useScroll,
} from "framer-motion";
import { ArrowRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

type Location = "IST" | "SAW" | "CITY";

type RouteItem = {
    to: string;
    price: number;
};

type RouteGroup = {
    id: Location;
    routes: RouteItem[];
};

const routesData: Record<Location, RouteItem[]> = {
    IST: [
        { to: "Taksim / Beyoğlu", price: 2500 },
        { to: "Beşiktaş / Ortaköy", price: 2750 },
        { to: "Sultanahmet / Fatih", price: 2800 },
        { to: "Şişli / Nişantaşı", price: 2600 },
        { to: "Kadıköy / Moda", price: 3200 },
        { to: "Sarıyer / Maslak", price: 2900 },
    ],
    SAW: [
        { to: "Kadıköy / Moda", price: 2000 },
        { to: "Taksim / Beyoğlu", price: 2900 },
        { to: "Beşiktaş / Ortaköy", price: 3100 },
        { to: "Sultanahmet / Fatih", price: 3000 },
    ],
    CITY: [
        { to: "Taksim - Sultanahmet", price: 1500 },
        { to: "Beşiktaş - Kadıköy", price: 1800 },
        { to: "Nişantaşı - Bebek", price: 1200 },
    ],
};

const getLocationTone = (location: Location) => {
    if (location === "IST") {
        return {
            dot: "bg-[#22D3EE]",
            border: "border-[#22D3EE]/35",
            text: "text-[#22D3EE]",
            bg: "bg-[#22D3EE]/10",
        };
    }

    if (location === "SAW") {
        return {
            dot: "bg-[#C084FC]",
            border: "border-[#C084FC]/35",
            text: "text-[#C084FC]",
            bg: "bg-[#C084FC]/10",
        };
    }

    return {
        dot: "bg-[#FACC15]",
        border: "border-[#FACC15]/35",
        text: "text-[#FACC15]",
        bg: "bg-[#FACC15]/10",
    };
};

export function PricingSection() {
    const t = useTranslations("PricingSection");
    const sectionRef = useRef<HTMLElement | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [mobileActiveIndex, setMobileActiveIndex] = useState(0);

    const routeGroups = useMemo<RouteGroup[]>(
        () => [
            {
                id: "IST",
                routes: routesData.IST,
            },
            {
                id: "SAW",
                routes: routesData.SAW,
            },
            {
                id: "CITY",
                routes: routesData.CITY,
            },
        ],
        []
    );

    const activeGroup = routeGroups[activeIndex];
    const activeTone = getLocationTone(activeGroup.id);

    const mobileActiveGroup = routeGroups[mobileActiveIndex];
    const mobileActiveTone = getLocationTone(mobileActiveGroup.id);

    const sectionHeight = `${routeGroups.length * 108}vh`;

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    });

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const nextIndex = Math.min(
            routeGroups.length - 1,
            Math.max(0, Math.floor(latest * routeGroups.length))
        );

        setActiveIndex(nextIndex);
    });

    const scrollToGroup = (index: number) => {
        if (!sectionRef.current) return;

        const sectionTop = sectionRef.current.offsetTop;
        const sectionScrollableHeight =
            sectionRef.current.offsetHeight - window.innerHeight;
        const targetProgress =
            routeGroups.length <= 1 ? 0 : index / routeGroups.length + 0.01;

        window.scrollTo({
            top: sectionTop + sectionScrollableHeight * targetProgress,
            behavior: "smooth",
        });
    };

    return (
        <>
            {/* MOBİL VERSİYON */}
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

                    <div className="mt-7 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        <div className="flex min-w-max gap-2">
                            {routeGroups.map((group, index) => {
                                const isActive = mobileActiveIndex === index;
                                const tone = getLocationTone(group.id);

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
                                        {getLocationLabel(group.id, t)}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

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
                                        {getLocationLabel(mobileActiveGroup.id, t)}
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
                                            fromLabel={getLocationLabel(mobileActiveGroup.id, t)}
                                            compact
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
                                        <a href="#booking">{t("quoteButton")}</a>
                                    </Button>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            {/* DESKTOP / TABLET VERSİYON */}
            <section
                ref={sectionRef}
                id="pricing-desktop"
                style={{ height: sectionHeight }}
                className="relative hidden bg-[#0d0d0d] px-6 lg:block lg:px-8"
            >
                <div className="sticky top-0 flex min-h-screen items-center overflow-hidden py-16 md:py-20">
                    <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
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
                                    const tone = getLocationTone(group.id);

                                    return (
                                        <button
                                            key={group.id}
                                            type="button"
                                            onClick={() => scrollToGroup(index)}
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
                                                    {getLocationLabel(group.id, t)}
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

                        <div className="rounded-[2rem] border border-white/10 bg-white/[0.025] p-4 sm:p-5 lg:p-6">
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
                                                {getLocationLabel(activeGroup.id, t)}
                                            </h3>
                                        </div>

                                        <p className="max-w-sm text-sm leading-6 text-white/40 sm:text-right">
                                            Sık tercih edilen rotalar için başlangıç transfer
                                            ücretleri.
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
                                                        fromLabel={getLocationLabel(activeGroup.id, t)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-5 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 sm:flex-row">
                                        <div className="flex items-start gap-3">
                                            <Info className="mt-0.5 h-4 w-4 shrink-0 text-white/30" />
                                            <p className="text-sm leading-6 text-white/45">
                                                Fiyatlar başlangıç transfer ücretidir. Araç tipi,
                                                yolcu sayısı ve gidiş-dönüş seçimine göre
                                                rezervasyon adımında netleşir.
                                            </p>
                                        </div>

                                        <Button
                                            asChild
                                            className="h-11 w-full shrink-0 rounded-full bg-white px-6 text-sm font-semibold text-black transition-all hover:bg-white/90 sm:w-auto"
                                        >
                                            <a href="#booking">{t("quoteButton")}</a>
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
                       }: {
    route: RouteItem;
    index: number;
    fromLabel: string;
    compact?: boolean;
}) {
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
                            ₺{route.price.toLocaleString("tr-TR")}
                        </span>
                    </div>
                </div>
            </motion.article>
        );
    }

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
                        ₺{route.price.toLocaleString("tr-TR")}
                    </span>
                </div>
            </div>
        </motion.article>
    );
}

function getLocationLabel(location: Location, t: any) {
    return t(`tabs.${location}`);
}