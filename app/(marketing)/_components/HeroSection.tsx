"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, Variants } from "framer-motion";

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

const animatedPhrases = [
    { highlight: "size özel", suffix: " transfer.", color: "text-[#FACC15]" },
    { highlight: "premium", suffix: " yolculuk.", color: "text-[#C084FC]" },
    { highlight: "kusursuz", suffix: " deneyim.", color: "text-[#22D3EE]" },
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }, // Biraz daha seri bir akış
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 }, // Yukarı kayma mesafesini de azalttık (Sakinlik için)
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: "easeOut" },
    },
};

export function HeroSection() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % animatedPhrases.length);
        }, 2500);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="min-h-screen bg-[#0d0d0d]">
            {/* pt-24 -> pt-32 yapıldı, navbar'dan daha dengeli uzaklaşması için */}
            <div className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pt-32 lg:px-8">
                {/* pb-32 pt-20 -> pb-20 pt-12 düşürülerek genel dikey yığılma sıkılaştırıldı */}
                <div className="relative flex min-h-[580px] items-center justify-center overflow-hidden px-6 pb-20 pt-12 md:px-12">
                    <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">

                        <motion.div
                            className="flex flex-col items-center gap-5" // gap-6 -> gap-5 indirildi
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.p variants={itemVariants} className="text-xs font-medium tracking-[0.35em] text-white/40 uppercase md:text-sm">
                                Premium VIP Transfer
                            </motion.p>

                            {/* DEĞİŞİKLİK: md:text-6xl lg:text-7xl -> md:text-7xl lg:text-8xl yapıldı. Yazı büyütüldü ve leading-tight ile sıkıştırıldı */}
                            <motion.h1 variants={itemVariants} className="max-w-4xl text-5xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl leading-[1.1] md:leading-[1.05]">
                                Güvenli, konforlu ve

                                {/* DEĞİŞİKLİK: mt-2 kaldırıldı, h-[1.3em] -> h-[1.15em] çekilerek kelimeler arası dikey boşluk tamamen kapatıldı */}
                                <div className="relative flex h-[1.15em] w-full justify-center overflow-hidden">
                                    <AnimatePresence mode="popLayout">
                                        <motion.span
                                            key={index}
                                            initial={{ y: 40, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: -40, opacity: 0 }}
                                            transition={{ type: "spring", stiffness: 320, damping: 32 }}
                                            className="whitespace-nowrap block"
                                        >
                                            <span className={`${animatedPhrases[index].color}`}>
                                                {animatedPhrases[index].highlight}
                                            </span>
                                            <span className="text-white">
                                                {animatedPhrases[index].suffix}
                                            </span>
                                        </motion.span>
                                    </AnimatePresence>
                                </div>
                            </motion.h1>

                            {/* DEĞİŞİKLİK: mt-8 -> mt-5 çekilerek açıklama metni başlığa yaklaştırıldı */}
                            <motion.p variants={itemVariants} className="mt-5 max-w-2xl text-base leading-relaxed text-white/55 md:text-lg">
                                Havalimanı, şehir içi ve özel etkinlik transferleriniz için lüks
                                araçlar, profesyonel sürücüler ve zamanında ulaşım anlayışıyla
                                rezervasyonunuzu kolayca oluşturun.
                            </motion.p>

                            {/* DEĞİŞİKLİK: mt-8 -> mt-6 düşürüldü */}
                            <motion.div variants={itemVariants} className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
                                <Button
                                    asChild
                                    className="h-12 rounded-full bg-white px-7 text-sm font-semibold text-black hover:bg-white/90"
                                >
                                    <Link href="#booking">Rezervasyon Yap</Link>
                                </Button>

                                <Button
                                    asChild
                                    variant="ghost"
                                    className="h-12 rounded-full px-7 text-sm font-semibold text-white/75 hover:bg-white/10 hover:text-white"
                                >
                                    <Link href="#gallery">Araçları İncele</Link>
                                </Button>
                            </motion.div>
                        </motion.div>

                        {/* DEĞİŞİKLİK: mt-16 -> mt-12 çekilerek iş ortakları alanı yukarı yaklaştırıldı */}
                        <div className="mt-12 w-full max-w-3xl">
                            <p className="mb-8 text-xs font-medium tracking-[0.25em] text-white/50 uppercase">
                                Bize güvenen{" "}
                                <span className="bg-[#C084FC]/60 px-2 py-0.5 font-bold text-white">
                                    yüzlerce
                                </span>{" "}
                                marka ve iş ortağı
                            </p>

                            <div className="relative overflow-hidden">
                                <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-[#0d0d0d] to-transparent" />
                                <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-[#0d0d0d] to-transparent" />

                                <div className="flex w-max animate-trusted-scroll items-center gap-16">
                                    {[...trustedNames, ...trustedNames].map((name, index) => (
                                        <span
                                            key={`${name}-${index}`}
                                            className="whitespace-nowrap text-2xl font-semibold tracking-wide text-white/35 md:text-3xl"
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