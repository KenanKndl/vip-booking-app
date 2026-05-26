"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Car, Handshake, ArrowRight } from "lucide-react";
import { FaInstagram, FaYoutube, FaTripadvisor, FaGoogle } from "react-icons/fa";
import { useTranslations } from "next-intl";

const exploreConfig = [
    {
        key: "vehicles",
        href: "/araclarimiz",
        icon: Car,
        iconColor: "text-[#0891B2]",
        iconBg: "bg-[#22D3EE]/12",
        hoverBorder: "hover:border-[#22D3EE]/35",
    },
    {
        key: "references",
        href: "/referanslar",
        icon: Handshake,
        iconColor: "text-[#CA8A04]",
        iconBg: "bg-[#FACC15]/18",
        hoverBorder: "hover:border-[#FACC15]/40",
    },
];

const socialLinks = [
    { name: "Instagram", href: "https://instagram.com", icon: FaInstagram },
    { name: "YouTube", href: "https://youtube.com", icon: FaYoutube },
    { name: "Tripadvisor", href: "https://tripadvisor.com", icon: FaTripadvisor },
    { name: "Google Reviews", href: "https://google.com", icon: FaGoogle },
];

const featureChipClass =
    "cursor-pointer select-none rounded-full bg-black/[0.03] px-3 py-1.5 text-xs font-medium text-black/55 transition-all duration-300 hover:bg-[#0d0d0d] hover:text-white sm:text-sm";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.12 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: "easeOut" },
    },
};

export function ExploreSection() {
    const t = useTranslations("ExploreSection");

    return (
        <section id="explore" className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-40">
            <div className="mx-auto grid max-w-7xl gap-10 sm:gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-14">
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="lg:sticky lg:top-32 lg:pt-6"
                >
                    <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-black sm:text-4xl md:text-5xl lg:text-6xl">
                        {t("titlePart1")}
                        <span className="text-black/45">{t("titlePart2")}</span>
                    </h2>

                    <p className="mt-5 max-w-lg text-sm leading-7 text-black/55 sm:mt-6 sm:text-base sm:leading-8 md:text-lg">
                        {t("description")}
                    </p>

                    <div className="mt-7 flex flex-wrap gap-2 sm:mt-8">
                        <span className={featureChipClass}>{t("chips.chip1")}</span>
                        <span className={featureChipClass}>{t("chips.chip2")}</span>
                        <span className={featureChipClass}>{t("chips.chip3")}</span>
                    </div>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid gap-4"
                >
                    {exploreConfig.map((item) => {
                        const Icon = item.icon;

                        return (
                            <motion.div variants={itemVariants} key={item.key}>
                                <Link
                                    href={item.href}
                                    className={`group block rounded-[1.5rem] border border-black/10 bg-white px-4 py-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:rounded-[1.75rem] sm:px-6 sm:py-6 ${item.hoverBorder}`}
                                >
                                    <div className="flex items-start gap-3.5 sm:gap-4">
                                        <div
                                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[1.1rem] ${item.iconBg}`}
                                        >
                                            <Icon className={`h-5 w-5 ${item.iconColor}`} />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-4 pt-0.5">
                                                <h3 className="text-xl font-semibold tracking-tight text-black sm:text-2xl md:text-[1.7rem] md:leading-tight">
                                                    {t(`${item.key}.title`)}
                                                </h3>
                                            </div>

                                            <p className="mt-2 max-w-2xl text-sm leading-6 text-black/55">
                                                {t(`${item.key}.description`)}
                                            </p>

                                            <div className="mt-5 grid gap-2">
                                                {[1, 2, 3].map((num) => (
                                                    <div
                                                        key={num}
                                                        className="flex items-start gap-2 text-sm font-medium leading-6 text-black/45"
                                                    >
                                                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black/25" />
                                                        <span>{t(`${item.key}.details.detail${num}`)}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-6 flex items-center text-sm font-semibold text-black/45 transition-colors group-hover:text-black">
                                                {t(`${item.key}.action`)}
                                                <ArrowRight className="ml-2 h-4 w-4 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}

                    <motion.div variants={itemVariants}>
                        <div className="group rounded-[1.5rem] border border-black/10 bg-[#111111] px-4 py-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C084FC]/40 hover:shadow-md sm:rounded-[1.75rem] sm:px-6 sm:py-6">
                            <div className="flex items-start gap-3.5 sm:gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[1.1rem] bg-[#C084FC]/15">
                                    <FaInstagram className="h-5 w-5 text-[#C084FC]" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-4 pt-0.5">
                                        <h3 className="text-xl font-semibold tracking-tight text-white sm:text-2xl md:text-[1.7rem] md:leading-tight">
                                            {t("social.title")}
                                        </h3>

                                        <span className="hidden shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/40 sm:block">
                                            {t("social.badge")}
                                        </span>
                                    </div>

                                    <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">
                                        {t("social.description")}
                                    </p>

                                    <div className="mt-5 grid gap-2">
                                        {[1, 2, 3].map((num) => (
                                            <div
                                                key={num}
                                                className="flex items-start gap-2 text-sm font-medium leading-6 text-white/45"
                                            >
                                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/25" />
                                                <span>{t(`social.details.detail${num}`)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-5 flex flex-wrap gap-2.5">
                                        {socialLinks.map((item) => {
                                            const Icon = item.icon;

                                            return (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    title={item.name}
                                                    className="flex h-10 w-10 items-center justify-center rounded-[0.95rem] bg-white/8 text-white/55 transition-all duration-300 hover:bg-white hover:text-black sm:h-9 sm:w-9 sm:rounded-[0.9rem]"
                                                >
                                                    <Icon className="h-4 w-4" />
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}