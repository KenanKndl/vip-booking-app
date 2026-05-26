"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import {
    Maximize2,
    X,
    ChevronLeft,
    ChevronRight,
    ImageIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

const categoryKeys = ["all", "interior", "exterior", "special"];

const CAT_MAP: Record<string, string> = {
    EXTERIOR: "exterior",
    INTERIOR: "interior",
    SPECIAL: "special",
};

const pageVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const fadeUpVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 18,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.55,
            ease: "easeOut",
        },
    },
};

const gridVariants: Variants = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.045,
            delayChildren: 0.08,
        },
    },
};

const cardVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 14,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.42,
            ease: "easeOut",
        },
    },
};

export function GallerySection({ dbImages = [] }: { dbImages: any[] }) {
    const t = useTranslations("GallerySection");

    const [activeCategoryKey, setActiveCategoryKey] = useState("all");
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [direction, setDirection] = useState(0);

    const galleryData = useMemo(() => {
        return dbImages.map((img) => ({
            id: img.id,
            src: img.url,
            categoryKey: CAT_MAP[img.category] || "other",
            title: t("defaultImageTitle"),
        }));
    }, [dbImages, t]);

    const filteredImages = useMemo(() => {
        return galleryData.filter(
            (img) =>
                activeCategoryKey === "all" ||
                img.categoryKey === activeCategoryKey
        );
    }, [galleryData, activeCategoryKey]);

    const currentImage =
        selectedIndex !== null ? filteredImages[selectedIndex] : null;

    const handleCategoryChange = (catKey: string) => {
        setActiveCategoryKey(catKey);
        setSelectedIndex(null);
    };

    const showNext = useCallback(() => {
        if (selectedIndex === null || filteredImages.length === 0) return;

        setDirection(1);
        setSelectedIndex((prevIndex) =>
            prevIndex! === filteredImages.length - 1 ? 0 : prevIndex! + 1
        );
    }, [selectedIndex, filteredImages.length]);

    const showPrev = useCallback(() => {
        if (selectedIndex === null || filteredImages.length === 0) return;

        setDirection(-1);
        setSelectedIndex((prevIndex) =>
            prevIndex! === 0 ? filteredImages.length - 1 : prevIndex! - 1
        );
    }, [selectedIndex, filteredImages.length]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedIndex === null) return;

            if (e.key === "ArrowRight") showNext();
            if (e.key === "ArrowLeft") showPrev();
            if (e.key === "Escape") setSelectedIndex(null);
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedIndex, showNext, showPrev]);

    useEffect(() => {
        document.body.style.overflow =
            selectedIndex !== null ? "hidden" : "unset";

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [selectedIndex]);

    const imageVariants: Variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 32 : -32,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 32 : -32,
            opacity: 0,
        }),
    };

    return (
        <>
            <section
                id="gallery"
                className="min-h-screen bg-[#0d0d0d] px-4 pb-16 pt-28 text-white sm:px-6 sm:pb-20 lg:px-8 lg:pb-28 lg:pt-32"
            >
                <motion.div
                    variants={pageVariants}
                    initial="hidden"
                    animate="visible"
                    className="mx-auto max-w-7xl"
                >
                    <motion.div variants={fadeUpVariants} className="max-w-3xl">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/35 sm:text-xs sm:tracking-[0.35em]">
                            {t("subtitle")}
                        </p>

                        <h1 className="mt-4 max-w-4xl text-3xl font-semibold tracking-tight text-white sm:mt-5 sm:text-5xl lg:text-6xl">
                            {t("titlePart1")}{" "}
                            <span className="text-white/45">
                                {t("titlePart2")}
                            </span>
                        </h1>
                    </motion.div>

                    <motion.div
                        variants={fadeUpVariants}
                        className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-5 sm:mt-10 sm:pt-6 lg:flex-row lg:items-center lg:justify-between"
                    >
                        <div className="-mx-4 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0">
                            <div className="flex w-max items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] p-1.5">
                                {categoryKeys.map((catKey) => {
                                    const isActive =
                                        activeCategoryKey === catKey;

                                    return (
                                        <button
                                            key={catKey}
                                            type="button"
                                            onClick={() =>
                                                handleCategoryChange(catKey)
                                            }
                                            className={`rounded-full px-4 py-2.5 text-sm font-medium transition-colors duration-200 sm:px-5 ${
                                                isActive
                                                    ? "bg-white text-black"
                                                    : "text-white/50 hover:bg-white/[0.06] hover:text-white"
                                            }`}
                                        >
                                            {t(`categories.${catKey}`)}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/45">
                            <span className="text-white">
                                {filteredImages.length}
                            </span>
                            <span>/</span>
                            <span>{galleryData.length}</span>
                        </div>
                    </motion.div>

                    <div className="mt-8 sm:mt-10">
                        {filteredImages.length > 0 ? (
                            <motion.div
                                key={activeCategoryKey}
                                variants={gridVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-5"
                            >
                                {filteredImages.map((img, index) => (
                                    <motion.button
                                        variants={cardVariants}
                                        key={img.id}
                                        type="button"
                                        onClick={() => {
                                            setDirection(0);
                                            setSelectedIndex(index);
                                        }}
                                        className="group overflow-hidden rounded-[1.35rem] border border-white/[0.08] bg-white/[0.025] text-left transition duration-300 active:scale-[0.99] hover:border-white/15 hover:bg-white/[0.04] sm:rounded-[1.5rem]"
                                    >
                                        <div className="relative aspect-[4/3] overflow-hidden">
                                            <img
                                                src={img.src}
                                                alt={img.title}
                                                loading="lazy"
                                                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                                            />

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-75 transition-opacity duration-300 group-hover:opacity-85" />

                                            <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white/75 opacity-100 backdrop-blur-md transition-all duration-300 group-hover:bg-white group-hover:text-black sm:right-4 sm:top-4 md:opacity-0 md:group-hover:opacity-100">
                                                <Maximize2 className="h-3.5 w-3.5" />
                                            </div>

                                            <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4">
                                                <span className="inline-flex rounded-full bg-black/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70 backdrop-blur-md">
                                                    {t(
                                                        `categories.${img.categoryKey}`
                                                    )}
                                                </span>

                                                <h3 className="mt-2 truncate text-sm font-medium text-white">
                                                    {img.title}
                                                </h3>
                                            </div>
                                        </div>
                                    </motion.button>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                variants={fadeUpVariants}
                                className="flex min-h-[300px] flex-col items-center justify-center rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-5 text-center sm:min-h-[360px] sm:rounded-[1.75rem] sm:px-6"
                            >
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.05] text-white/25">
                                    <ImageIcon className="h-7 w-7" />
                                </div>

                                <h3 className="mt-5 text-xl font-medium text-white">
                                    {t("emptyTitle")}
                                </h3>

                                <p className="mt-2 max-w-md text-sm leading-6 text-white/45">
                                    {t("emptyDescription")}
                                </p>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </section>

            <AnimatePresence initial={false} custom={direction}>
                {currentImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setSelectedIndex(null)}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 px-3 py-4 backdrop-blur-md sm:px-6 sm:py-5"
                    >
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedIndex(null);
                            }}
                            className="absolute right-3 top-3 z-[120] flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/35 text-white/75 backdrop-blur-md transition active:scale-[0.96] hover:border-white/20 hover:bg-white hover:text-black sm:right-6 sm:top-6"
                            aria-label="Close gallery image"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        {filteredImages.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        showPrev();
                                    }}
                                    className="absolute left-5 top-1/2 z-[110] hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/25 text-white/70 backdrop-blur-md transition hover:border-white/20 hover:bg-white hover:text-black md:flex"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft className="h-[18px] w-[18px]" />
                                </button>

                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        showNext();
                                    }}
                                    className="absolute right-5 top-1/2 z-[110] hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/25 text-white/70 backdrop-blur-md transition hover:border-white/20 hover:bg-white hover:text-black md:flex"
                                    aria-label="Next image"
                                >
                                    <ChevronRight className="h-[18px] w-[18px]" />
                                </button>
                            </>
                        )}

                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="flex max-h-[calc(100svh-2rem)] w-full max-w-6xl flex-col"
                        >
                            <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-[1.25rem] bg-white/[0.03] sm:rounded-[1.5rem]">
                                <AnimatePresence
                                    initial={false}
                                    custom={direction}
                                    mode="wait"
                                >
                                    <motion.img
                                        key={currentImage.id}
                                        src={currentImage.src}
                                        alt={currentImage.title}
                                        custom={direction}
                                        variants={imageVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{
                                            duration: 0.22,
                                            ease: "easeOut",
                                        }}
                                        className="max-h-[62svh] w-full object-contain sm:max-h-[72vh]"
                                    />
                                </AnimatePresence>
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-4 sm:mt-4">
                                <div className="min-w-0">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                                        {t(
                                            `categories.${currentImage.categoryKey}`
                                        )}
                                    </p>

                                    <h3 className="mt-1 truncate text-sm font-medium text-white sm:text-base">
                                        {currentImage.title}
                                    </h3>
                                </div>

                                <div className="hidden shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white/55 backdrop-blur-md md:flex">
                                    <span className="text-white">
                                        {(selectedIndex ?? 0) + 1}
                                    </span>
                                    <span>/</span>
                                    <span>{filteredImages.length}</span>
                                </div>
                            </div>

                            {filteredImages.length > 1 && (
                                <div className="mt-4 flex items-center justify-center gap-3 md:hidden">
                                    <button
                                        type="button"
                                        onClick={showPrev}
                                        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/70 backdrop-blur-md transition active:scale-[0.96]"
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeft className="h-[18px] w-[18px]" />
                                    </button>

                                    <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white/55 backdrop-blur-md">
                                        <span className="text-white">
                                            {(selectedIndex ?? 0) + 1}
                                        </span>
                                        <span className="mx-1.5 text-white/30">
                                            /
                                        </span>
                                        <span>{filteredImages.length}</span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={showNext}
                                        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/70 backdrop-blur-md transition active:scale-[0.96]"
                                        aria-label="Next image"
                                    >
                                        <ChevronRight className="h-[18px] w-[18px]" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}