"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Quote } from "lucide-react";
import { useTranslations } from "next-intl";

const testimonialConfig = [
    {
        key: "t1",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop",
    },
    {
        key: "t2",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
    },
    {
        key: "t3",
        image: "https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?q=80&w=200&auto=format&fit=crop",
    },
    {
        key: "t4",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
    },
    {
        key: "t5",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    },
    {
        key: "t6",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop",
    },
];

export function TestimonialSection() {
    const t = useTranslations("TestimonialSection");
    const targetRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    const [scrollRange, setScrollRange] = useState(0);

    useEffect(() => {
        const updateScrollRange = () => {
            if (containerRef.current && trackRef.current) {
                const trackWidth = trackRef.current.scrollWidth;
                const containerWidth = containerRef.current.offsetWidth;
                setScrollRange(Math.max(0, trackWidth - containerWidth));
            }
        };

        updateScrollRange();
        window.addEventListener("resize", updateScrollRange);

        return () => window.removeEventListener("resize", updateScrollRange);
    }, []);

    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"],
    });

    const x = useTransform(scrollYProgress, [0, 1], [0, -scrollRange]);

    return (
        <>
            {/* MOBİL VERSİYON */}
            <section className="bg-[#0d0d0d] px-4 py-20 sm:px-6 md:hidden">
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

                    <div className="-mx-4 mt-8 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:px-6">
                        <div className="flex w-max gap-4">
                            {testimonialConfig.map((item) => (
                                <div
                                    key={item.key}
                                    className="w-[82vw] max-w-[320px] shrink-0"
                                >
                                    <TestimonialCard
                                        compact
                                        data={{
                                            name: t(`testimonials.${item.key}.name`),
                                            role: t(`testimonials.${item.key}.role`),
                                            text: t(`testimonials.${item.key}.text`),
                                            image: item.image,
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* DESKTOP / TABLET VERSİYON */}
            <section
                ref={targetRef}
                style={{
                    height: scrollRange > 0 ? `calc(100vh + ${scrollRange}px)` : "250vh",
                }}
                className="relative hidden rounded-t-[2.5rem] bg-[#0d0d0d] md:block md:rounded-t-[4rem]"
            >
                <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden py-16 md:py-24">
                    <div className="mx-auto mb-12 w-full max-w-7xl px-6 md:mb-16 lg:px-8">
                        <div className="flex flex-col items-start text-left lg:items-end lg:text-right">
                            <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
                                {t("titlePart1")}{" "}
                                <span className="text-white/45">{t("titlePart2")}</span>
                            </h2>

                            <p className="mt-5 max-w-xl text-base leading-8 text-white/45 md:text-lg">
                                {t("description")}
                            </p>
                        </div>
                    </div>

                    <div
                        ref={containerRef}
                        className="mx-auto w-full max-w-7xl overflow-visible px-6 lg:px-8"
                    >
                        <motion.div
                            ref={trackRef}
                            style={{ x }}
                            className="flex w-max gap-5"
                        >
                            {testimonialConfig.map((item, index) => (
                                <div
                                    key={`${item.key}-${index}`}
                                    className="w-[280px] shrink-0 sm:w-[310px]"
                                >
                                    <TestimonialCard
                                        data={{
                                            name: t(`testimonials.${item.key}.name`),
                                            role: t(`testimonials.${item.key}.role`),
                                            text: t(`testimonials.${item.key}.text`),
                                            image: item.image,
                                        }}
                                    />
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>
        </>
    );
}

function TestimonialCard({
                             data,
                             compact = false,
                         }: {
    data: {
        name: string;
        role: string;
        image: string;
        text: string;
    };
    compact?: boolean;
}) {
    return (
        <article
            className={`group flex flex-col justify-between rounded-[1.75rem] border border-white/10 bg-white/[0.02] transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04] ${
                compact ? "min-h-[245px] p-5" : "h-[260px] p-6"
            }`}
        >
            <div>
                <div className="flex h-9 w-9 items-center justify-center rounded-[0.9rem] bg-white/[0.06] text-white/25 transition-colors duration-300 group-hover:text-white/45">
                    <Quote className="h-4 w-4" />
                </div>

                <p className="mt-4 text-sm leading-relaxed text-white/60 transition-colors duration-300 group-hover:text-white/80">
                    "{data.text}"
                </p>
            </div>

            <div className="mt-6 flex items-center gap-3">
                <img
                    src={data.image}
                    alt={data.name}
                    className="h-10 w-10 shrink-0 rounded-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                />

                <div className="min-w-0">
                    <h4 className="truncate text-sm font-semibold tracking-tight text-white">
                        {data.name}
                    </h4>
                    <p className="mt-0.5 truncate text-[10px] font-medium uppercase tracking-[0.18em] text-white/35">
                        {data.role}
                    </p>
                </div>
            </div>
        </article>
    );
}