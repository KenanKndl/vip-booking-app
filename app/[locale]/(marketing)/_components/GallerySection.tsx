"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";

// Kategori anahtarları (Çeviri ve filtreleme için kullanılacak)
const categoryKeys = ["all", "interior", "exterior", "special"];

// Veritabanı İngilizce Enum -> Kategori Key Eşleştirmesi
const CAT_MAP: Record<string, string> = {
    'EXTERIOR': 'exterior',
    'INTERIOR': 'interior',
    'SPECIAL': 'special'
};

const MASONRY_STYLES = ["aspect-square", "aspect-[3/4]", "aspect-[4/3]", "aspect-video"];

export function GallerySection({ dbImages = [] }: { dbImages: any[] }) {
    const t = useTranslations("GallerySection");
    
    // Artık Türkçe metinleri değil, kategori anahtarlarını state içinde tutuyoruz
    const [activeCategoryKey, setActiveCategoryKey] = useState("all");
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [direction, setDirection] = useState(0);

    const galleryData = useMemo(() => {
        return dbImages.map((img, index) => ({
            id: img.id,
            src: img.url,
            categoryKey: CAT_MAP[img.category] || "other",
            title: t("defaultImageTitle"), 
            style: MASONRY_STYLES[index % MASONRY_STYLES.length] 
        }));
    }, [dbImages, t]);

    const filteredImages = galleryData.filter(
        (img) => activeCategoryKey === "all" || img.categoryKey === activeCategoryKey
    );

    const showNext = useCallback(() => {
        if (selectedIndex !== null) {
            setDirection(1);
            setSelectedIndex((prevIndex) =>
                prevIndex! === filteredImages.length - 1 ? 0 : prevIndex! + 1
            );
        }
    }, [selectedIndex, filteredImages.length]);

    const showPrev = useCallback(() => {
        if (selectedIndex !== null) {
            setDirection(-1);
            setSelectedIndex((prevIndex) =>
                prevIndex! === 0 ? filteredImages.length - 1 : prevIndex! - 1
            );
        }
    }, [selectedIndex, filteredImages.length]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedIndex !== null) {
                if (e.key === "ArrowRight") showNext();
                if (e.key === "ArrowLeft") showPrev();
                if (e.key === "Escape") setSelectedIndex(null);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedIndex, showNext, showPrev]);

    useEffect(() => {
        if (selectedIndex !== null) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [selectedIndex]);

    const currentImage = selectedIndex !== null ? filteredImages[selectedIndex] : null;

    const imageVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0,
            scale: 0.95
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 100 : -100,
            opacity: 0,
            scale: 0.95
        })
    };

    return (
        <>
            <section id="gallery" className="bg-[#0d0d0d] px-6 py-32 lg:px-8 min-h-screen">
                <div className="mx-auto max-w-7xl">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="mx-auto max-w-3xl text-center"
                    >
                        <p className="text-xs font-medium tracking-[0.4em] text-white/35 uppercase mb-6">
                            {t("subtitle")}
                        </p>
                        <h2 className="text-3xl font-semibold tracking-tight text-white md:text-5xl leading-tight">
                            {t("titlePart1")} <br className="hidden md:block" />
                            <span className="text-white/50">{t("titlePart2")}</span>
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                        className="mt-16 flex justify-center"
                    >
                        <div className="flex flex-wrap items-center justify-center gap-2 rounded-full bg-white/[0.02] p-1.5 border border-white/5 backdrop-blur-sm">
                            {categoryKeys.map((catKey) => (
                                <button
                                    key={catKey}
                                    onClick={() => setActiveCategoryKey(catKey)}
                                    className={`relative px-6 py-2.5 text-sm font-medium transition-colors duration-300 rounded-full ${
                                        activeCategoryKey === catKey
                                            ? "text-black"
                                            : "text-white/60 hover:text-white hover:bg-white/5"
                                    }`}
                                >
                                    {activeCategoryKey === catKey && (
                                        <motion.span
                                            layoutId="activeGalleryFilter"
                                            className="absolute inset-0 bg-white rounded-full shadow-lg"
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10">{t(`categories.${catKey}`)}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Premium Grid Alanı */}
                    <div className="mt-16">
                        {filteredImages.length > 0 ? (
                            <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
                                <AnimatePresence mode="popLayout">
                                    {filteredImages.map((img, index) => (
                                        <motion.div
                                            key={img.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                            onClick={() => {
                                                setDirection(0);
                                                setSelectedIndex(index);
                                            }}
                                            className="relative mb-6 break-inside-avoid overflow-hidden rounded-3xl group cursor-pointer bg-white/[0.02]"
                                        >
                                            <div className={`relative w-full ${img.style} overflow-hidden rounded-3xl`}>
                                                <img
                                                    src={img.src}
                                                    alt={img.title}
                                                    className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                                                    loading="lazy"
                                                />

                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                                <div className="absolute inset-0 p-6 flex flex-col justify-end translate-y-4 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold text-white bg-white/20 backdrop-blur-md rounded-full uppercase tracking-wider">
                                                                {t(`categories.${img.categoryKey}`)}
                                                            </span>
                                                            <h3 className="text-xl font-medium text-white">
                                                                {img.title}
                                                            </h3>
                                                        </div>
                                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-xl transition-transform duration-300 hover:scale-110">
                                                            <Maximize2 className="h-5 w-5" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="py-24 flex flex-col items-center justify-center text-center">
                                <ImageIcon size={48} className="text-white/20 mb-4" />
                                <h3 className="text-xl font-medium text-white mb-2">{t("emptyTitle")}</h3>
                                <p className="text-white/50 text-sm">{t("emptyDescription")}</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Premium Lightbox Modalı */}
            <AnimatePresence initial={false} custom={direction}>
                {currentImage && (
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
                        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        transition={{ duration: 0.4 }}
                        onClick={() => setSelectedIndex(null)}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0d0d0d]/90 p-4 md:p-8"
                    >
                        <button
                            onClick={(e) => { e.stopPropagation(); showPrev(); }}
                            className="absolute left-4 md:left-10 z-[110] flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-md transition-all hover:bg-white hover:text-black hover:scale-110"
                        >
                            <ChevronLeft className="h-6 w-6 mr-1" />
                        </button>

                        <button
                            onClick={(e) => { e.stopPropagation(); showNext(); }}
                            className="absolute right-4 md:right-10 z-[110] flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-md transition-all hover:bg-white hover:text-black hover:scale-110"
                        >
                            <ChevronRight className="h-6 w-6 ml-1" />
                        </button>

                        <button
                            onClick={() => setSelectedIndex(null)}
                            className="absolute right-6 top-6 md:right-10 md:top-10 z-[120] flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white hover:text-black hover:rotate-90"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="relative flex flex-col items-center max-h-full w-full max-w-5xl"
                        >
                            <div className="relative w-full overflow-hidden rounded-3xl shadow-2xl">
                                <AnimatePresence initial={false} custom={direction} mode="wait">
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
                                            x: { type: "spring", stiffness: 300, damping: 30 },
                                            opacity: { duration: 0.3 },
                                            scale: { duration: 0.3 }
                                        }}
                                        className="max-h-[75vh] w-full object-contain bg-black/20"
                                    />
                                </AnimatePresence>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="mt-6 flex w-full items-center justify-between px-2"
                            >
                                <div className="flex flex-col">
                                    <span className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-1">
                                        {t(`categories.${currentImage.categoryKey}`)}
                                    </span>
                                    <h3 className="text-xl font-medium text-white">
                                        {currentImage.title}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md">
                                    <span className="text-sm font-medium text-white">{(selectedIndex ?? 0) + 1}</span>
                                    <span className="text-sm text-white/30">/</span>
                                    <span className="text-sm font-medium text-white/50">{filteredImages.length}</span>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}