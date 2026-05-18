"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { MapPin, Calendar, Clock, Users, CreditCard, ChevronRight, CheckCircle2, Baby, Check, ChevronLeft, Camera } from "lucide-react";
// YENİ MODAL BİLEŞENİNİ İMPORT EDİYORUZ
import { VehicleGalleryModal } from "./VehicleGalleryModal";

const vehicles = [
    {
        id: 1,
        name: "MAYBACH EXCLUSIVE VIP",
        pax: "1-6 PAX",
        luggage: "6 Bagaj",
        price: "2.340 ₺",
        images: [
            "https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1555008872-f03b347ffb53?q=80&w=800&auto=format&fit=crop"
        ],
        features: [
            "Atıştırmalık & İkramlar",
            "Soğuk İçecekler (Alkolsüz)",
            "Sınırsız Wi-Fi",
            "Smart TV & Netflix",
            "Bebek Koltuğu (Talep Üzerine)",
            "Ultra Lüks İç Dizayn",
            "Ara Bölme (Kaptan ile bağlantı yok)"
        ],
        description: "Kişi başı değildir, aracın toplam fiyatıdır. Benzersiz konfor sunan lüks serimiz."
    },
    {
        id: 2,
        name: "MAYBACH ROYAL CLASS VIP",
        pax: "1-6 PAX",
        luggage: "6 Bagaj",
        price: "2.600 ₺",
        images: [
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop"
        ],
        features: [
            "Atıştırmalık & İkramlar",
            "Soğuk İçecekler (Alkolsüz)",
            "Rolls-Royce Yıldız Tavan",
            "Koltuk Masaj & Isıtma",
            "Koltuk Soğutma",
            "Ultra Top Lux Dizayn",
            "Full VIP Servis"
        ],
        description: "Tasarım ödüllü, üstün donanımlı, filomuzun en lüks ve ayrıcalıklı serisi."
    },
    {
        id: 3,
        name: "PRIME XL COMFORT LUXURY",
        pax: "1-10 PAX",
        luggage: "10 Bagaj",
        price: "3.380 ₺",
        images: [
            "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=800&auto=format&fit=crop"
        ],
        features: [
            "Geniş Aile Tasarımı",
            "Soğuk İçecekler",
            "Premium Ses Sistemi",
            "Smart TV",
            "Bebek Koltuğu",
            "Ara Bölmeli Kabin",
            "Full VIP Servis"
        ],
        description: "Kalabalık aileler ve fazla bagajı olan misafirlerimiz için ferah iç mekan."
    }
];

const locations = [
    "Antalya Havalimanı (AYT)", "İstanbul Havalimanı (IST)", "Sabiha Gökçen Havalimanı (SAW)",
    "Lara / Kundu", "Belek", "Kemer", "Alanya", "Taksim / Beyoğlu", "Kadıköy / Moda"
];

function VehicleCarousel({ images, name, onOpenGallery }: { images: string[]; name: string; onOpenGallery: () => void }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setDirection(1);
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 4500);
        return () => clearInterval(timer);
    }, [images.length]);

    const nextSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        setDirection(-1);
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    return (
        <div className="relative h-full w-full overflow-hidden bg-[#111] group/carousel">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.img
                    key={currentIndex}
                    src={images[currentIndex]}
                    alt={name}
                    custom={direction}
                    initial={{ x: direction > 0 ? "100%" : "-100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: direction < 0 ? "100%" : "-100%", opacity: 0 }}
                    transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.25 } }}
                    className="h-full w-full object-cover opacity-80 group-hover/carousel:opacity-100 transition-opacity duration-500"
                />
            </AnimatePresence>

            {/* Yumuşak Karartma Efekti */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

            <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
                <button onClick={prevSlide} className="pointer-events-auto flex h-10 w-10 items-center justify-center border border-white/10 bg-black/40 backdrop-blur-sm text-white transition-all hover:bg-white hover:text-black hover:scale-110 rounded-full">
                    <ChevronLeft className="h-5 w-5 mr-0.5" />
                </button>
                <button onClick={nextSlide} className="pointer-events-auto flex h-10 w-10 items-center justify-center border border-white/10 bg-black/40 backdrop-blur-sm text-white transition-all hover:bg-white hover:text-black hover:scale-110 rounded-full">
                    <ChevronRight className="h-5 w-5 ml-0.5" />
                </button>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300">
                <button
                    onClick={(e) => { e.stopPropagation(); onOpenGallery(); }}
                    className="flex items-center gap-2 bg-black/60 border border-white/10 px-5 py-2.5 text-xs font-semibold text-white uppercase tracking-wider hover:bg-white hover:text-black transition-all rounded-full backdrop-blur-md shadow-lg"
                >
                    <Camera className="h-4 w-4" /> Galeriyi İncele
                </button>
            </div>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                {images.map((_, idx) => (
                    <div key={idx} className={`h-1 transition-all duration-300 rounded-full ${currentIndex === idx ? "w-5 bg-[#22D3EE]" : "w-1.5 bg-white/30"}`} />
                ))}
            </div>
        </div>
    );
}

export function ReservationSection() {
    const [step, setStep] = useState(1);
    const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);

    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [activeGalleryData, setActiveGalleryData] = useState<{ images: string[]; name: string }>({ images: [], name: "" });

    const formVariants: Variants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
        exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
    };

    return (
        <>
            <section className="bg-[#0d0d0d] px-6 py-32 lg:px-8 min-h-screen flex items-center">
                <div className="mx-auto w-full max-w-5xl">

                    {/* Premium İlerleme Çubuğu */}
                    <div className="mb-16 max-w-4xl mx-auto">
                        <div className="flex items-center justify-between relative">
                            <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/10 z-0" />
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="relative z-10 flex flex-col items-center gap-3 bg-[#0d0d0d] px-6">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-500 ${
                                        step >= i ? "border-[#22D3EE] bg-[#22D3EE]/10 text-[#22D3EE] shadow-[0_0_20px_rgba(34,211,238,0.2)]" : "border-white/10 bg-[#0d0d0d] text-white/30"
                                    }`}>
                                        {step > i ? <CheckCircle2 className="h-6 w-6" /> : <span className="text-sm font-bold">{i}</span>}
                                    </div>
                                    <span className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-500 ${step >= i ? "text-white" : "text-white/30"}`}>
                                        {i === 1 ? "Rota & Tarih" : i === 2 ? "Araç Seçimi" : "Ödeme"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form Kapsayıcı (Glassmorphism) */}
                    <div className="border border-white/5 bg-white/[0.02] p-6 md:p-12 rounded-3xl backdrop-blur-md shadow-2xl relative overflow-hidden">

                        {/* Hafif Glow Efekti Arka Plan */}
                        <div className="absolute top-0 right-0 h-64 w-64 bg-[#22D3EE] opacity-5 blur-[120px] rounded-full pointer-events-none" />

                        <AnimatePresence mode="wait">

                            {/* 1. ADIM: ROTA VE TARİH */}
                            {step === 1 && (
                                <motion.div key="step1" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-10 max-w-4xl mx-auto relative z-10">
                                    <div className="text-center md:text-left">
                                        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Yolculuğunuzu Planlayın</h2>
                                        <p className="text-sm text-white/50">Lütfen alınış, varış ve kişi bilgilerinizi seçin.</p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="flex flex-col gap-2.5">
                                            <label className="text-xs font-semibold text-white/50 uppercase tracking-widest pl-1 flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-[#22D3EE]" /> Nereden</label>
                                            <div className="relative rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 hover:bg-white/10 focus-within:border-[#22D3EE]/50 focus-within:bg-white/10 overflow-hidden">
                                                <select defaultValue="" className="w-full bg-transparent py-4 px-5 text-sm text-white outline-none appearance-none cursor-pointer">
                                                    <option value="" disabled className="bg-[#111] text-white/50">Alınış noktası seçin</option>
                                                    {locations.map((loc, idx) => <option key={idx} value={loc} className="bg-[#111]">{loc}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2.5">
                                            <label className="text-xs font-semibold text-white/50 uppercase tracking-widest pl-1 flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-[#C084FC]" /> Nereye</label>
                                            <div className="relative rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 hover:bg-white/10 focus-within:border-[#C084FC]/50 focus-within:bg-white/10 overflow-hidden">
                                                <select defaultValue="" className="w-full bg-transparent py-4 px-5 text-sm text-white outline-none appearance-none cursor-pointer">
                                                    <option value="" disabled className="bg-[#111] text-white/50">Varış noktası seçin</option>
                                                    {locations.map((loc, idx) => <option key={idx} value={loc} className="bg-[#111]">{loc}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                                        <div className="flex flex-col gap-2.5">
                                            <label className="text-xs font-semibold text-white/50 uppercase tracking-widest pl-1 flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-white/70" /> Tarih</label>
                                            <input type="date" className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-5 text-sm text-white outline-none transition-all duration-300 hover:bg-white/10 focus:border-[#22D3EE]/50 focus:bg-white/10 [color-scheme:dark]" />
                                        </div>
                                        <div className="flex flex-col gap-2.5">
                                            <label className="text-xs font-semibold text-white/50 uppercase tracking-widest pl-1 flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-white/70" /> Saat</label>
                                            <input type="time" className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-5 text-sm text-white outline-none transition-all duration-300 hover:bg-white/10 focus:border-[#22D3EE]/50 focus:bg-white/10 [color-scheme:dark]" />
                                        </div>
                                        <div className="flex flex-col gap-2.5">
                                            <label className="text-xs font-semibold text-white/50 uppercase tracking-widest pl-1 flex items-center gap-2"><Users className="h-3.5 w-3.5 text-white/70" /> Yetişkin</label>
                                            <div className="relative rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 hover:bg-white/10 focus-within:border-[#22D3EE]/50 focus-within:bg-white/10 overflow-hidden">
                                                <select defaultValue="1" className="w-full bg-transparent py-4 px-5 text-sm text-white outline-none appearance-none cursor-pointer">
                                                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => <option key={n} value={n} className="bg-[#111]">{n} Yetişkin</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2.5">
                                            <label className="text-xs font-semibold text-white/50 uppercase tracking-widest pl-1 flex items-center gap-2"><Baby className="h-3.5 w-3.5 text-white/70" /> Çocuk</label>
                                            <div className="relative rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 hover:bg-white/10 focus-within:border-[#22D3EE]/50 focus-within:bg-white/10 overflow-hidden">
                                                <select defaultValue="0" className="w-full bg-transparent py-4 px-5 text-sm text-white outline-none appearance-none cursor-pointer">
                                                    {[0,1,2,3,4,5,6].map(n => <option key={n} value={n} className="bg-[#111]">{n} Çocuk</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <button onClick={() => setStep(2)} className="mt-6 flex h-14 w-full items-center justify-center gap-2 bg-white text-sm font-bold text-black transition-all duration-300 hover:bg-[#22D3EE] hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] rounded-full group">
                                        Uygun Araçları Bul <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </button>
                                </motion.div>
                            )}

                            {/* 2. ADIM: ARAÇ SEÇİMİ */}
                            {step === 2 && (
                                <motion.div key="step2" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-10 relative z-10">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                                        <div>
                                            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Lütfen Size Uygun Aracı Seçiniz</h2>
                                            <p className="text-sm text-white/50">Araçlarımız konfor ve donanım seviyelerine göre sıralanmıştır.</p>
                                        </div>
                                        <button onClick={() => setStep(1)} className="text-xs font-semibold text-white/60 hover:text-white uppercase tracking-widest border border-white/10 px-5 py-2.5 hover:bg-white/5 rounded-full transition-all flex items-center gap-2">
                                            <ChevronLeft className="h-3.5 w-3.5" /> Geri Dön
                                        </button>
                                    </div>

                                    <div className="grid gap-8">
                                        {vehicles.map((car) => (
                                            <div key={car.id} className="group flex flex-col lg:grid lg:grid-cols-[1.1fr_1.4fr] border border-white/5 bg-white/[0.02] rounded-3xl overflow-hidden transition-all duration-500 hover:border-white/10 hover:bg-white/[0.04]">

                                                <div className="h-64 lg:h-auto min-h-[300px] relative overflow-hidden">
                                                    <VehicleCarousel
                                                        images={car.images}
                                                        name={car.name}
                                                        onOpenGallery={() => {
                                                            setActiveGalleryData({ images: car.images, name: car.name });
                                                            setIsGalleryOpen(true);
                                                        }}
                                                    />
                                                    <div className="absolute top-0 left-0 w-full p-5 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none">
                                                        <h3 className="text-lg font-bold text-[#FACC15] uppercase tracking-wider">{car.name}</h3>
                                                        <div className="flex items-center gap-3 mt-1.5">
                                                            <span className="bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-md text-xs text-white font-medium">{car.pax}</span>
                                                            <span className="bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-md text-xs text-white font-medium">{car.luggage}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-8 flex flex-col justify-between">
                                                    <div>
                                                        <p className="text-xs text-[#22D3EE] font-semibold uppercase tracking-widest mb-5">Araç Özellikleri</p>
                                                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 mb-8">
                                                            {car.features.map((feature, idx) => (
                                                                <li key={idx} className="flex items-start gap-3 text-sm text-white/60">
                                                                    <div className="flex items-center justify-center h-5 w-5 rounded-full bg-white/5 border border-white/10 shrink-0 mt-0.5">
                                                                        <Check className="h-3 w-3 text-[#C084FC]" />
                                                                    </div>
                                                                    <span>{feature}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-white/10">
                                                        <div className="flex items-center gap-5 w-full sm:w-auto">
                                                            <div className="flex flex-col">
                                                                <p className="text-xs text-[#FACC15] mb-1 font-semibold tracking-widest uppercase">Tek Yön Fiyatı</p>
                                                                <p className="text-3xl font-bold text-white">{car.price}</p>
                                                            </div>
                                                            <div className="h-10 w-px bg-white/10 hidden sm:block" />
                                                            <div className="text-xs text-white/40 max-w-[180px] leading-relaxed hidden sm:block">
                                                                {car.description}
                                                            </div>
                                                        </div>
                                                        <button onClick={() => { setSelectedVehicle(car.id); setStep(3); }} className="w-full sm:w-auto px-8 h-12 bg-white text-black font-bold text-sm hover:bg-[#22D3EE] hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all rounded-full flex items-center justify-center gap-2 shrink-0 group/btn">
                                                            Seç ve İlerle <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* 3. ADIM: ÖDEME VE ONAY */}
                            {step === 3 && (
                                <motion.div key="step3" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-10 max-w-4xl mx-auto relative z-10">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Rezervasyonu Tamamla</h2>
                                            <p className="text-sm text-white/50">İletişim ve ödeme bilgilerinizi girerek işleminizi bitirin.</p>
                                        </div>
                                        <button onClick={() => setStep(2)} className="text-xs font-semibold text-white/60 hover:text-white uppercase tracking-widest border border-white/10 px-5 py-2.5 hover:bg-white/5 rounded-full transition-all flex items-center gap-2">
                                            <ChevronLeft className="h-3.5 w-3.5" /> Geri Dön
                                        </button>
                                    </div>

                                    <div className="grid gap-10 md:grid-cols-2">
                                        <div className="flex flex-col gap-5">
                                            <h3 className="text-sm font-semibold text-[#22D3EE] uppercase tracking-widest mb-2 pl-1">Yolcu Bilgileri</h3>
                                            <input type="text" placeholder="Ad Soyad" className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-5 text-sm text-white placeholder-white/30 outline-none transition-all duration-300 hover:bg-white/10 focus:border-[#22D3EE]/50 focus:bg-white/10" />
                                            <input type="tel" placeholder="Telefon Numarası" className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-5 text-sm text-white placeholder-white/30 outline-none transition-all duration-300 hover:bg-white/10 focus:border-[#22D3EE]/50 focus:bg-white/10" />
                                            <input type="email" placeholder="E-Posta Adresi" className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-5 text-sm text-white placeholder-white/30 outline-none transition-all duration-300 hover:bg-white/10 focus:border-[#22D3EE]/50 focus:bg-white/10" />
                                        </div>

                                        <div className="flex flex-col gap-5">
                                            <h3 className="text-sm font-semibold text-[#C084FC] uppercase tracking-widest mb-2 pl-1 flex items-center gap-2">
                                                <CreditCard className="h-4 w-4" /> Ödeme Bilgileri
                                            </h3>
                                            <input type="text" placeholder="Kart Üzerindeki İsim" className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-5 text-sm text-white placeholder-white/30 outline-none transition-all duration-300 hover:bg-white/10 focus:border-[#C084FC]/50 focus:bg-white/10" />
                                            <input type="text" placeholder="Kart Numarası" maxLength={16} className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-5 text-sm text-white placeholder-white/30 outline-none transition-all duration-300 hover:bg-white/10 focus:border-[#C084FC]/50 focus:bg-white/10" />
                                            <div className="grid grid-cols-2 gap-4">
                                                <input type="text" placeholder="SKT (AA/YY)" className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-5 text-sm text-white placeholder-white/30 outline-none transition-all duration-300 hover:bg-white/10 focus:border-[#C084FC]/50 focus:bg-white/10" />
                                                <input type="text" placeholder="CVC" maxLength={3} className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-5 text-sm text-white placeholder-white/30 outline-none transition-all duration-300 hover:bg-white/10 focus:border-[#C084FC]/50 focus:bg-white/10" />
                                            </div>
                                        </div>
                                    </div>

                                    <button onClick={() => alert("Rezervasyon Başarıyla Tamamlandı!")} className="mt-8 flex h-14 w-full items-center justify-center gap-2 bg-[#22D3EE] text-sm font-bold text-black transition-all duration-300 hover:scale-[1.02] rounded-full shadow-[0_0_25px_rgba(34,211,238,0.3)] hover:shadow-[0_0_35px_rgba(34,211,238,0.5)]">
                                        Rezervasyonu Tamamla ve Öde <CheckCircle2 className="h-4 w-4 ml-1" />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            {/* HARİÇTE KODLADIĞIMIZ YENİ GALERİ MODALI BAĞLANTISI */}
            <VehicleGalleryModal
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
                images={activeGalleryData.images}
                vehicleName={activeGalleryData.name}
            />
        </>
    );
}