"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useTranslations } from "next-intl";

const trustedNames = [
    "Royal Transfer",
    "Prime Hotel",
    "Elite Events",
    "Airport Plus",
    "Luxury Tours",
    "Executive Club",
    "Blue Coast",
    "MICE Travel",
];

const animatedPhrasesConfig = [
    { key: "phrase1", color: "text-[#FACC15]" },
    { key: "phrase2", color: "text-[#C084FC]" },
    { key: "phrase3", color: "text-[#22D3EE]" },
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: "easeOut" },
    },
};

export function HeroSection() {
    const t = useTranslations("HeroSection");
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % animatedPhrasesConfig.length);
        }, 2500);

        return () => clearInterval(interval);
    }, []);

    const currentPhrase = animatedPhrasesConfig[index];

    return (
        <section className="min-h-[100svh] overflow-hidden bg-[#0d0d0d]">
            <div className="mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-4 pt-20 sm:px-6 sm:pt-28 lg:px-8 lg:pt-32">
                <div className="relative flex min-h-[calc(100svh-5rem)] items-center justify-center overflow-hidden px-0 pb-10 pt-8 sm:min-h-[560px] sm:px-6 sm:pb-16 sm:pt-10 md:min-h-[580px] md:px-12 md:pb-20 md:pt-12">
                    <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center text-center">
                        <motion.div
                            className="flex w-full flex-col items-center gap-5"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {/* Desktop Başlık */}
                            <motion.h1
                                variants={itemVariants}
                                className="hidden max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight text-white sm:block md:text-7xl lg:text-8xl"
                            >
                                {t("desktopTitlePrefix")}

                                <div className="relative mx-auto flex h-[1.15em] w-full justify-center overflow-hidden">
                                    <AnimatePresence mode="popLayout">
                                        <motion.span
                                            key={index}
                                            initial={{ y: 40, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: -40, opacity: 0 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 320,
                                                damping: 32,
                                            }}
                                            className="block whitespace-nowrap text-center"
                                        >
                                            <span className={currentPhrase.color}>
                                                {t(`animatedPhrases.${currentPhrase.key}.highlight`)}
                                            </span>
                                            <span className="text-white">
                                                {t(`animatedPhrases.${currentPhrase.key}.suffix`)}
                                            </span>
                                        </motion.span>
                                    </AnimatePresence>
                                </div>
                            </motion.h1>

                            {/* Mobil Başlık */}
                            <motion.h1
                                variants={itemVariants}
                                className="block max-w-[21rem] text-[2.3rem] font-bold leading-[1.06] tracking-tight text-white sm:hidden"
                            >
                                <span className="block">
                                    {t("mobileTitlePrefix")}
                                </span>

                                <div className="relative mx-auto flex h-[1.15em] w-full justify-center overflow-hidden">
                                    <AnimatePresence mode="popLayout">
                                        <motion.span
                                            key={index}
                                            initial={{ y: 36, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: -36, opacity: 0 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 320,
                                                damping: 32,
                                            }}
                                            className="block whitespace-nowrap text-center"
                                        >
                                            <span className={currentPhrase.color}>
                                                {t(`animatedPhrases.${currentPhrase.key}.highlight`)}
                                            </span>
                                            <span className="text-white">
                                                {t(`animatedPhrases.${currentPhrase.key}.suffix`)}
                                            </span>
                                        </motion.span>
                                    </AnimatePresence>
                                </div>
                            </motion.h1>

                            <motion.p
                                variants={itemVariants}
                                className="mt-3 max-w-[21rem] text-sm leading-7 text-white/55 sm:mt-5 sm:max-w-2xl sm:text-base md:text-lg"
                            >
                                {t("description")}
                            </motion.p>

                            <motion.div
                                variants={itemVariants}
                                className="mt-5 flex w-full max-w-xs flex-col items-center justify-center gap-3 sm:mt-6 sm:max-w-none sm:flex-row sm:gap-4"
                            >
                                <Button
                                    asChild
                                    className="h-12 w-full rounded-full bg-white px-7 text-sm font-semibold text-black hover:bg-white/90 sm:w-auto"
                                >
                                    <Link href="/rezervasyon">{t("buttons.book")}</Link>
                                </Button>

                                <Button
                                    asChild
                                    variant="ghost"
                                    className="h-12 w-full rounded-full px-7 text-sm font-semibold text-white/75 hover:bg-white/10 hover:text-white sm:w-auto"
                                >
                                    <Link href="/galeri">{t("buttons.fleet")}</Link>
                                </Button>
                            </motion.div>
                        </motion.div>

                        <div className="mt-8 w-full max-w-3xl sm:mt-12">
                            <p className="mb-5 text-[10px] font-medium tracking-[0.2em] text-white/50 uppercase sm:mb-8 sm:text-xs sm:tracking-[0.25em]">
                                {t("trusted.prefix")}
                                <span className="bg-[#C084FC]/60 px-2 py-0.5 font-bold text-white">
                                    {t("trusted.highlight")}
                                </span>{" "}
                                {t("trusted.suffix")}
                            </p>

                            <div className="relative overflow-hidden">
                                <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-10 bg-gradient-to-r from-[#0d0d0d] to-transparent sm:w-20" />
                                <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-10 bg-gradient-to-l from-[#0d0d0d] to-transparent sm:w-20" />

                                <div className="flex w-max animate-trusted-scroll items-center gap-8 sm:gap-16">
                                    {[...trustedNames, ...trustedNames].map((name, index) => (
                                        <span
                                            key={`${name}-${index}`}
                                            className="whitespace-nowrap text-base font-semibold tracking-wide text-white/35 sm:text-2xl md:text-3xl"
                                        >
                                            {name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}