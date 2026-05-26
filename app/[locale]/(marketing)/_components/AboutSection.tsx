"use client";

import { useRef, useState } from "react";
import {
    AnimatePresence,
    motion,
    useMotionValueEvent,
    useScroll,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

const featuresData = [
    {
        id: 0,
        key: "feature1",
        color: "text-[#FACC15]",
        border: "border-[#FACC15]/35",
        dot: "bg-[#FACC15]",
        image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=800&auto=format&fit=crop",
    },
    {
        id: 1,
        key: "feature2",
        color: "text-[#C084FC]",
        border: "border-[#C084FC]/35",
        dot: "bg-[#C084FC]",
        image: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=800&auto=format&fit=crop",
    },
    {
        id: 2,
        key: "feature3",
        color: "text-[#22D3EE]",
        border: "border-[#22D3EE]/35",
        dot: "bg-[#22D3EE]",
        image: "https://images.unsplash.com/photo-1549317336-206569e8475c?q=80&w=800&auto=format&fit=crop",
    },
];

export function AboutSection() {
    const t = useTranslations("AboutSection");
    const sectionRef = useRef<HTMLElement | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    });

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const nextIndex = Math.min(
            featuresData.length - 1,
            Math.max(0, Math.floor(latest * featuresData.length))
        );

        setActiveIndex(nextIndex);
    });

    const activeFeature = featuresData[activeIndex];

    return (
        <section
            ref={sectionRef}
            style={{ height: `${featuresData.length * 105}vh` }}
            className="relative bg-[#0d0d0d] px-6 lg:px-8"
        >
            <div className="sticky top-0 flex min-h-screen items-center overflow-hidden py-16 md:py-20">
                <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                    <div>
                        <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
                            {t("openingTitle1")}{" "}
                            <span className="text-white/45">
                                {t("openingTitle2")}
                            </span>
                        </h2>

                        <p className="mt-5 max-w-xl text-base leading-8 text-white/45 md:text-lg">
                            {t("openingSub")}
                        </p>

                        <div className="mt-8 grid gap-2.5">
                            {featuresData.map((feature, index) => {
                                const isActive = activeIndex === index;

                                return (
                                    <button
                                        key={feature.id}
                                        type="button"
                                        className={`group flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition duration-300 ${
                                            isActive
                                                ? `${feature.border} bg-white/[0.045]`
                                                : "border-white/10 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.035]"
                                        }`}
                                    >
                                        <span className="flex min-w-0 items-center gap-3">
                                            <span
                                                className={`h-2.5 w-2.5 shrink-0 rounded-full ${feature.dot}`}
                                            />

                                            <span className="min-w-0">
                                                <span
                                                    className={`block truncate text-sm font-semibold ${
                                                        isActive
                                                            ? "text-white"
                                                            : "text-white/60"
                                                    }`}
                                                >
                                                    {t(`${feature.key}.title`)}
                                                </span>

                                                <span
                                                    className={`mt-0.5 block text-xs font-medium ${feature.color}`}
                                                >
                                                    {t(`${feature.key}.stat`)}
                                                </span>
                                            </span>
                                        </span>

                                        <ArrowRight
                                            className={`h-4 w-4 shrink-0 transition duration-300 ${
                                                isActive
                                                    ? `${feature.color} translate-x-0 opacity-100`
                                                    : "-translate-x-1 text-white/20 opacity-0 group-hover:translate-x-0 group-hover:opacity-60"
                                            }`}
                                        />
                                    </button>
                                );
                            })}
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeFeature.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                                className="mt-5 rounded-[1.5rem] border border-white/10 bg-white/[0.025] p-5"
                            >
                                <p
                                    className={`text-sm font-semibold ${activeFeature.color}`}
                                >
                                    {t(`${activeFeature.key}.stat`)}
                                </p>

                                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                                    {t(`${activeFeature.key}.title`)}
                                </h3>

                                <p className="mt-3 max-w-xl text-sm leading-7 text-white/45">
                                    {t(`${activeFeature.key}.description`)}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="rounded-[2rem] border border-white/10 bg-white/[0.025] p-4 sm:p-5">
                        <div className="relative h-[420px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20 md:h-[520px]">
                            {featuresData.map((feature, index) => {
                                const isActive = activeIndex === index;

                                return (
                                    <motion.div
                                        key={feature.id}
                                        initial={false}
                                        animate={{
                                            opacity: isActive ? 1 : 0,
                                            clipPath: isActive
                                                ? "inset(0% 0% 0% 0% round 1.5rem)"
                                                : "inset(12% 12% 12% 12% round 2rem)",
                                            scale: isActive ? 1 : 1.04,
                                        }}
                                        transition={{
                                            opacity: {
                                                duration: 0.2,
                                                ease: "easeOut",
                                            },
                                            clipPath: {
                                                duration: 0.65,
                                                ease: [0.16, 1, 0.3, 1],
                                            },
                                            scale: {
                                                duration: 0.65,
                                                ease: [0.16, 1, 0.3, 1],
                                            },
                                        }}
                                        className="absolute inset-0"
                                    >
                                        <motion.img
                                            src={feature.image}
                                            alt={t(`${feature.key}.title`)}
                                            initial={false}
                                            animate={{
                                                scale: isActive ? 1 : 1.08,
                                                y: isActive ? 0 : 16,
                                            }}
                                            transition={{
                                                duration: 0.85,
                                                ease: [0.16, 1, 0.3, 1],
                                            }}
                                            className="h-full w-full object-cover"
                                        />

                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d]/75 via-[#0d0d0d]/10 to-transparent" />
                                    </motion.div>
                                );
                            })}

                            <div className="pointer-events-none absolute inset-0 rounded-[1.5rem] ring-1 ring-inset ring-white/10" />

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeFeature.id}
                                    initial={{ opacity: 0, y: 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{
                                        duration: 0.3,
                                        ease: "easeOut",
                                    }}
                                    className="absolute bottom-5 left-5 right-5"
                                >
                                    <div className="max-w-xl rounded-[1.25rem] border border-white/10 bg-[#0d0d0d]/55 p-4 backdrop-blur-md">
                                        <p
                                            className={`text-sm font-semibold ${activeFeature.color}`}
                                        >
                                            {t(`${activeFeature.key}.stat`)}
                                        </p>

                                        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl">
                                            {t(`${activeFeature.key}.title`)}
                                        </h3>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}