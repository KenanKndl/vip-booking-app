"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface VehicleGalleryModalProps {
    isOpen: boolean;
    onClose: () => void;
    images: string[];
    vehicleName: string;
}

export function VehicleGalleryModal({ isOpen, onClose, images, vehicleName }: VehicleGalleryModalProps) {
    const t = useTranslations("VehicleGalleryModal");
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [direction, setDirection] = useState(0);

    // Lightbox Navigasyon Fonksiyonları
    const showNext = useCallback(() => {
        if (lightboxIndex !== null) {
            setDirection(1);
            setLightboxIndex((prev) => (prev! === images.length - 1 ? 0 : prev! + 1));
        }
    }, [lightboxIndex, images.length]);

    const showPrev = useCallback(() => {
        if (lightboxIndex !== null) {
            setDirection(-1);
            setLightboxIndex((prev) => (prev! === 0 ? images.length - 1 : prev! - 1));
        }
    }, [lightboxIndex, images.length]);

    // Klavye Desteği
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (lightboxIndex !== null) {
                if (e.key === "ArrowRight") showNext();
                if (e.key === "ArrowLeft") showPrev();
                if (e.key === "Escape") setLightboxIndex(null);
            } else if (isOpen && e.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [lightboxIndex, isOpen, showNext, showPrev, onClose]);

    const imageVariants: Variants = {
        enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
        center: { zIndex: 1, x: 0, opacity: 1 },
        exit: (dir: number) => ({ zIndex: 0, x: dir < 0 ? 300 : -300, opacity: 0 })
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-6 backdrop-blur-md overflow-y-auto"
                >
                    {/* MODAL ANA PANEL */}
                    <div className="relative w-full max-w-5xl bg-[#0a0a0a] border border-white/10 p-6 md:p-10 my-auto rounded-none shadow-2xl">

                        {/* Kapat Butonu */}
                        <button
                            onClick={onClose}
                            className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-none border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/20"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        {/* Üst Başlık */}
                        <div className="mb-8 border-b border-white/5 pb-4 max-w-[calc(100%-48px)]">
                            <p className="text-xs font-semibold text-[#22D3EE] uppercase tracking-widest mb-1">{t("subtitle")}</p>
                            <h3 className="text-xl font-bold text-white uppercase md:text-2xl">{vehicleName}</h3>
                        </div>

                        {/* FOTOĞRAF GRID ALANI (Jilet gibi keskin ve simetrik) */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                            {images.map((src, index) => (
                                <div
                                    key={index}
                                    onClick={() => {
                                        setDirection(0);
                                        setLightboxIndex(index);
                                    }}
                                    className="relative aspect-video overflow-hidden border border-white/5 bg-white/[0.02] cursor-pointer group rounded-none"
                                >
                                    <img
                                        src={src}
                                        alt={t("imageAlt", { vehicleName, index: index + 1 })}
                                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                    />
                                    {/* Hover Filtresi */}
                                    <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:opacity-10 flex items-center justify-center">
                                        <Maximize2 className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* GRID İÇİNDEKİ FOTOĞRAFA TIKLAYINCA AÇILAN TAM EKRAN LIGHTBOX */}
                    <AnimatePresence initial={false} custom={direction}>
                        {lightboxIndex !== null && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                onClick={() => setLightboxIndex(null)}
                                className="fixed inset-0 z-[110] flex items-center justify-center bg-black/98 p-4 md:p-8"
                            >
                                {/* Lightbox Okları */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); showPrev(); }}
                                    className="absolute left-6 z-[120] flex h-16 w-16 items-center justify-center rounded-none border border-white/10 bg-black/50 text-white transition-colors hover:bg-[#22D3EE] hover:text-black hover:border-transparent group"
                                >
                                    <ChevronLeft className="h-8 w-8 group-hover:scale-110 transition-transform" />
                                </button>

                                <button
                                    onClick={(e) => { e.stopPropagation(); showNext(); }}
                                    className="absolute right-6 z-[120] flex h-16 w-16 items-center justify-center rounded-none border border-white/10 bg-black/50 text-white transition-colors hover:bg-[#22D3EE] hover:text-black hover:border-transparent group"
                                >
                                    <ChevronRight className="h-8 w-8 group-hover:scale-110 transition-transform" />
                                </button>

                                {/* Lightbox Kapat */}
                                <button
                                    onClick={() => setLightboxIndex(null)}
                                    className="absolute right-6 top-6 z-[130] flex h-12 w-12 items-center justify-center rounded-none border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/20"
                                >
                                    <X className="h-6 w-6" />
                                </button>

                                {/* Görsel Taşıyıcı */}
                                <motion.div
                                    onClick={(e) => e.stopPropagation()}
                                    className="relative max-h-full max-w-5xl border border-white/10 overflow-hidden bg-black rounded-none"
                                >
                                    <AnimatePresence initial={false} custom={direction} mode="wait">
                                        <motion.img
                                            key={lightboxIndex}
                                            src={images[lightboxIndex]}
                                            alt={t("enlargedAlt", { vehicleName })}
                                            custom={direction}
                                            variants={imageVariants}
                                            initial="enter"
                                            animate="center"
                                            exit="exit"
                                            transition={{
                                                x: { type: "spring", stiffness: 300, damping: 30 },
                                                opacity: { duration: 0.2 }
                                            }}
                                            className="h-auto max-h-[80vh] w-full object-contain"
                                        />
                                    </AnimatePresence>

                                    {/* Sayaç */}
                                    <div className="absolute bottom-4 right-4 bg-black/70 px-4 py-1.5 text-xs font-mono text-white/50 tracking-wider border border-white/5 rounded-none backdrop-blur-sm z-20">
                                        {lightboxIndex + 1} / {images.length}
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    );
}