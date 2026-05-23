"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

type Currency = "TRY" | "USD" | "EUR";
type Location = "IST" | "SAW" | "CITY";

const currencySymbols: Record<Currency, string> = {
    TRY: "₺",
    USD: "$",
    EUR: "€",
};

const routesData = {
    IST: [
        { to: "Taksim / Beyoğlu", prices: { TRY: 2500, USD: 75, EUR: 70 } },
        { to: "Beşiktaş / Ortaköy", prices: { TRY: 2750, USD: 85, EUR: 80 } },
        { to: "Sultanahmet / Fatih", prices: { TRY: 2800, USD: 88, EUR: 82 } },
        { to: "Şişli / Nişantaşı", prices: { TRY: 2600, USD: 80, EUR: 75 } },
        { to: "Kadıköy / Moda", prices: { TRY: 3200, USD: 95, EUR: 90 } },
        { to: "Sarıyer / Maslak", prices: { TRY: 2900, USD: 88, EUR: 82 } },
    ],
    SAW: [
        { to: "Kadıköy / Moda", prices: { TRY: 2000, USD: 60, EUR: 55 } },
        { to: "Taksim / Beyoğlu", prices: { TRY: 2900, USD: 90, EUR: 85 } },
        { to: "Beşiktaş / Ortaköy", prices: { TRY: 3100, USD: 95, EUR: 90 } },
        { to: "Sultanahmet / Fatih", prices: { TRY: 3000, USD: 92, EUR: 88 } },
    ],
    CITY: [
        { to: "Taksim - Sultanahmet", prices: { TRY: 1500, USD: 45, EUR: 40 } },
        { to: "Beşiktaş - Kadıköy", prices: { TRY: 1800, USD: 55, EUR: 50 } },
        { to: "Nişantaşı - Bebek", prices: { TRY: 1200, USD: 35, EUR: 32 } },
    ],
};

const tabsConfig: { id: Location; activeBg: string }[] = [
    { id: "IST", activeBg: "bg-[#22D3EE]" },
    { id: "SAW", activeBg: "bg-[#C084FC]" },
    { id: "CITY", activeBg: "bg-[#FACC15]" },
];

export function PricingSection() {
    const t = useTranslations("PricingSection");
    const [currency, setCurrency] = useState<Currency>("TRY");
    const [activeTab, setActiveTab] = useState<Location>("IST");

    return (
        <section id="pricing" className="bg-[#0d0d0d] px-6 py-32 lg:px-8">
            <div className="mx-auto max-w-5xl">

                {/* Başlık Grubu */}
                <div className="mx-auto max-w-3xl text-center">
                    <p className="text-xs font-medium tracking-[0.4em] text-white/35 uppercase">
                        {t("subtitle")}
                    </p>
                    <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">
                        {t("titlePart1")} <span className="text-white/60">{t("titlePart2")}</span>
                    </h2>
                    <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/45 md:text-lg">
                        {t("description")}
                    </p>
                </div>

                {/* Kontrol Paneli */}
                <div className="mt-16 flex flex-col items-center justify-between gap-6 md:flex-row">

                    {/* Tablar */}
                    <div className="flex rounded-full bg-white/[0.03] p-1.5 border border-white/5 w-full md:w-auto overflow-x-auto hide-scrollbar">
                        {tabsConfig.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300 ${
                                    activeTab === tab.id ? "text-black" : "text-white/50 hover:text-white"
                                }`}
                            >
                                {activeTab === tab.id && (
                                    <motion.span
                                        layoutId="activeTabIndicator"
                                        className={`absolute inset-0 rounded-full ${tab.activeBg}`}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10">{t(`tabs.${tab.id}`)}</span>
                            </button>
                        ))}
                    </div>

                    {/* Para Birimi */}
                    <div className="flex rounded-full bg-white/[0.03] p-1.5 border border-white/5">
                        {(["TRY", "USD", "EUR"] as Currency[]).map((cur) => (
                            <button
                                key={cur}
                                onClick={() => setCurrency(cur)}
                                className={`relative rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-300 ${
                                    currency === cur ? "text-white" : "text-white/30 hover:text-white/70"
                                }`}
                            >
                                {currency === cur && (
                                    <motion.span
                                        layoutId="activeCurrencyIndicator"
                                        className="absolute inset-0 rounded-full bg-white/10"
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10">{cur}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid Rota Listesi */}
                <div className="mt-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="grid gap-4 md:grid-cols-2"
                        >
                            {routesData[activeTab].map((route, idx) => (
                                <div
                                    key={idx}
                                    className="group flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04]"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/30 pr-0.5 transition-colors duration-300 
                                            ${activeTab === "IST" ? "group-hover:bg-[#22D3EE]/10 group-hover:text-[#22D3EE]" : ""}
                                            ${activeTab === "SAW" ? "group-hover:bg-[#C084FC]/10 group-hover:text-[#C084FC]" : ""}
                                            ${activeTab === "CITY" ? "group-hover:bg-[#FACC15]/10 group-hover:text-[#FACC15]" : ""}
                                        `}>
                                            <MapPin className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white/40 mb-1">{t("destinationLabel")}</p>
                                            <p className="text-base font-semibold text-white">
                                                {route.to}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className={`text-xl font-bold tracking-tight transition-colors duration-300
                                            ${activeTab === "IST" ? "text-[#22D3EE]" : ""}
                                            ${activeTab === "SAW" ? "text-[#C084FC]" : ""}
                                            ${activeTab === "CITY" ? "text-[#FACC15]" : ""}
                                        `}>
                                            <AnimatePresence mode="wait">
                                                <motion.span
                                                    key={currency}
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="inline-block"
                                                >
                                                    {currencySymbols[currency]}
                                                    {route.prices[currency].toLocaleString("tr-TR")}
                                                </motion.span>
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Alt Bilgilendirme */}
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl border border-white/5 bg-white/[0.02] p-5 md:p-6">
                    <div className="flex items-start gap-3">
                        <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-white/30" />
                        <p className="text-sm leading-relaxed text-white/45">
                            {t("infoText")}
                        </p>
                    </div>
                    <Button
                        asChild
                        className="w-full sm:w-auto h-11 rounded-full bg-white px-6 text-sm font-semibold text-black hover:bg-white/90 transition-all flex-shrink-0"
                    >
                        <a href="#booking">{t("quoteButton")}</a>
                    </Button>
                </div>

            </div>
        </section>
    );
}