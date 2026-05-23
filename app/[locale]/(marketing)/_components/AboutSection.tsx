"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useTranslations } from "next-intl";

// Sadece statik olan stil ve görsel verilerini tutuyoruz.
// Metinler next-intl ile çekilecek.
const featuresData = [
    {
        id: 0,
        key: "feature1",
        color: "text-[#FACC15]",
        image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=800&auto=format&fit=crop",
    },
    {
        id: 1,
        key: "feature2",
        color: "text-[#C084FC]",
        image: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=800&auto=format&fit=crop",
    },
    {
        id: 2,
        key: "feature3",
        color: "text-[#22D3EE]",
        image: "https://images.unsplash.com/photo-1549317336-206569e8475c?q=80&w=800&auto=format&fit=crop",
    },
];

export function AboutSection() {
    const t = useTranslations("AboutSection");
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(-1);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 80px", "end end"],
    });

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        if (latest < 0.25) {
            setActiveIndex(-1);
        } else if (latest < 0.50) {
            setActiveIndex(0);
        } else if (latest < 0.72) {
            setActiveIndex(1);
        } else {
            setActiveIndex(2);
        }
    });

    return (
        <section ref={containerRef} className="relative h-[400vh] bg-[#0d0d0d]">
            <div className="sticky top-20 flex h-[calc(100vh-80px)] w-full items-center justify-center overflow-hidden px-6 lg:px-8">

                {/* AÇILIŞ EKRANI */}
                <motion.div
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none"
                    animate={{
                        opacity: activeIndex === -1 ? 1 : 0,
                        y: activeIndex === -1 ? 0 : -100,
                        scale: activeIndex === -1 ? 1 : 0.9,
                        filter: activeIndex === -1 ? "blur(0px)" : "blur(12px)",
                    }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <p className="mb-6 max-w-md text-center text-sm font-medium tracking-[0.24em] text-white/40 uppercase">
                        {t("openingSub")}
                    </p>

                    <h2 className="flex flex-col items-center justify-center gap-4 text-center font-bold tracking-tighter uppercase select-none md:gap-6">
                        <span className="text-7xl leading-none text-white md:text-[9rem]">{t("openingTitle1")}</span>
                        <span className="text-7xl leading-none text-white/40 md:text-[9rem]">{t("openingTitle2")}</span>
                    </h2>
                </motion.div>

                {/* ANA İÇERIK IÇI GRID */}
                <motion.div
                    className="mx-auto grid w-full max-w-7xl grid-cols-1 lg:grid-cols-2 gap-16 items-center z-10"
                    initial={false}
                    animate={{
                        opacity: activeIndex >= 0 ? 1 : 0,
                        y: activeIndex >= 0 ? 0 : 100,
                        filter: activeIndex >= 0 ? "blur(0px)" : "blur(12px)",
                    }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >

                    {/* SOL TARAF: Metin Blokları */}
                    <div className="relative flex h-[450px] flex-col justify-center" style={{ perspective: "1000px" }}>
                        <p className="absolute top-0 left-0 text-xs font-medium tracking-[0.4em] text-white/35 uppercase mb-8">
                            {t("sectionHeader")}
                        </p>

                        <div className="relative mt-12 h-full w-full">
                            {featuresData.map((feature, index) => {
                                const isActive = activeIndex === index;
                                const isPast = index < activeIndex;

                                return (
                                    <motion.div
                                        key={feature.id}
                                        className="absolute inset-0 flex flex-col justify-center pointer-events-none"
                                        initial={false}
                                        animate={{
                                            opacity: isActive ? 1 : 0,
                                            y: isActive ? 0 : isPast ? -60 : 60,
                                            rotateX: isActive ? 0 : isPast ? 45 : -45,
                                            scale: isActive ? 1 : 0.85,
                                            filter: isActive ? "blur(0px)" : "blur(8px)",
                                        }}
                                        transition={{
                                            duration: 0.7,
                                            ease: [0.16, 1, 0.3, 1]
                                        }}
                                    >
                                        <motion.h3
                                            className="text-3xl font-bold tracking-tight text-white md:text-4xl leading-tight mb-4"
                                            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
                                            transition={{ duration: 0.5, delay: isActive ? 0.05 : 0 }}
                                        >
                                            <span className={`${feature.color} block text-lg font-semibold mb-1`}>
                                                {t(`${feature.key}.stat`)}
                                            </span>
                                            {t(`${feature.key}.title`)}
                                        </motion.h3>

                                        <motion.p
                                            className="max-w-xl text-xs md:text-sm leading-relaxed text-white/55 text-justify"
                                            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
                                            transition={{ duration: 0.5, delay: isActive ? 0.15 : 0 }}
                                        >
                                            {t(`${feature.key}.description`)}
                                        </motion.p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* SAĞ TARAF: Sinematik Derinlikli Görseller */}
                    <div className="relative flex h-[480px] w-full items-center justify-center">
                        {featuresData.map((feature, index) => {
                            const isActive = activeIndex === index;
                            const isPast = index < activeIndex;
                            const isFuture = index > activeIndex;

                            return (
                                <motion.div
                                    key={feature.id}
                                    className="absolute inset-0 h-full w-full overflow-hidden rounded-3xl border border-white/10 bg-[#111]"
                                    initial={false}
                                    animate={{
                                        opacity: activeIndex === -1 ? 0 : isActive ? 1 : 0,
                                        y: activeIndex === -1 ? 40 : isActive ? 0 : isFuture ? 80 : 0,
                                        scale: activeIndex === -1 ? 0.95 : isActive ? 1 : isPast ? 0.9 : 1.1,
                                        zIndex: isActive ? 10 : isPast ? 0 : 5,
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        ease: [0.16, 1, 0.3, 1]
                                    }}
                                >
                                    <motion.img
                                        src={feature.image}
                                        alt={t(`${feature.key}.title`)}
                                        className="h-full w-full object-cover"
                                        animate={{
                                            scale: isActive ? 1.05 : 1
                                        }}
                                        transition={{
                                            duration: 12,
                                            ease: "linear",
                                            repeat: Infinity,
                                            repeatType: "reverse"
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d]/80 via-[#0d0d0d]/20 to-transparent" />
                                </motion.div>
                            );
                        })}
                    </div>

                </motion.div>
            </div>
        </section>
    );
}