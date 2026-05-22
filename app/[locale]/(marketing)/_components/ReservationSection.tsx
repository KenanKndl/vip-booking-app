"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { MapPin, Calendar, Clock, Users, CreditCard, ChevronRight, CheckCircle2, Baby, Check, ChevronLeft, Camera, Users2 } from "lucide-react";
import { VehicleGalleryModal } from "./VehicleGalleryModal";

export function ReservationSection({ dbRoutes = [] }: { dbRoutes: any[] }) {
    const [step, setStep] = useState(1);
    
    // Modal State'leri
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [activeGalleryData, setActiveGalleryData] = useState<{ images: string[]; name: string }>({ images: [], name: "" });

    // 1. Adım State'leri (Güzergah ve Tarih)
    const [pickup, setPickup] = useState("");
    const [dropoff, setDropoff] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [adults, setAdults] = useState("1");
    const [children, setChildren] = useState("0");

    // 2. Adım State'leri (Araç)
    const [selectedRoute, setSelectedRoute] = useState<any>(null);
    const [selectedPricing, setSelectedPricing] = useState<any>(null);

    // 3. Adım State'leri (Ödeme/Müşteri)
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Veritabanındaki rotalardan benzersiz Kalkış ve Varış lokasyonlarını süzüyoruz
    const pickupLocations = useMemo(() => Array.from(new Set(dbRoutes.map(r => r.pickup))), [dbRoutes]);
    const dropoffLocations = useMemo(() => Array.from(new Set(dbRoutes.map(r => r.dropoff))), [dbRoutes]);

    // Toplam yolcu sayısı hesaplaması
    const totalPassengers = useMemo(() => {
        return Number(adults) + Number(children);
    }, [adults, children]);

    // Seçilen rotadaki araçları kişi sayısına göre filtreleme motoru
    const availablePricings = useMemo(() => {
        if (!selectedRoute) return [];
        
        return selectedRoute.prices.filter((pricing: any) => {
            const car = pricing.vehicle;
            if (!car.isActive) return false;

            // Veritabanından gelen "1-6 PAX", "13" gibi string ifadelerden sadece maksimum yolcu rakamını ayıklar
            const maxCapacity = parseInt(String(car.pax).replace(/[^\d]/g, '')) || 6;
            
            // Toplam yolcu araç kapasitesinden küçük veya eşitse aracı listeye dahil et
            return totalPassengers <= maxCapacity;
        });
    }, [selectedRoute, totalPassengers]);

    const formVariants: Variants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
        exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
    };

    // Araç Bulma Mantığı
    const handleFindVehicles = () => {
        if (!pickup || !dropoff || !date || !time) {
            alert("Lütfen nereden, nereye, tarih ve saat alanlarını eksikosiz doldurun.");
            return;
        }

        const matchedRoute = dbRoutes.find(r => r.pickup === pickup && r.dropoff === dropoff);
        
        if (!matchedRoute || matchedRoute.prices.length === 0) {
            alert("Seçtiğiniz güzergah için aktif bir güzergah bulunmamaktadır.");
            return;
        }

        setSelectedRoute(matchedRoute);
        setStep(2);
    };

    // Rezervasyonu Tamamlama ve Veritabanına Yazma
    const handleCompleteReservation = async () => {
        if (!name || !phone) {
            alert("Lütfen ad soyad ve telefon bilgilerinizi giriniz.");
            return;
        }

        setIsSubmitting(true);

        const payload = {
            pickupDateTime: new Date(`${date}T${time}:00`).toISOString(),
            adultCount: adults,
            childCount: children,
            routeId: selectedRoute.id,
            vehicleId: selectedPricing.vehicle.id,
            customerName: name,
            customerPhone: phone,
            customerEmail: email,
            totalPrice: selectedPricing.price,
            currency: selectedPricing.currency
        };

        try {
            const response = await fetch('/api/client/reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            
            if (data.success) {
                alert(`Rezervasyonunuz Başarıyla Tamamlandı! PNR Kodunuz: ${data.data.pnrCode}`);
                window.location.reload();
            } else {
                alert("Rezervasyon sırasında bir hata oluştu.");
            }
        } catch (error) {
            alert("Sunucu ile iletişim kurulamadı.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <section id="booking" className="bg-[#0d0d0d] px-6 py-16 lg:px-8 min-h-[80vh] flex items-center">
                <div className="mx-auto w-full max-w-5xl">

                    {/* İlerleme Çubuğu */}
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

                    <div className="border border-white/5 bg-white/[0.02] p-6 md:p-12 rounded-3xl backdrop-blur-md shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 h-64 w-64 bg-[#22D3EE] opacity-5 blur-[120px] rounded-full pointer-events-none" />

                        <AnimatePresence mode="wait">

                            {/* 1. ADIM: ROTA VE TARİH */}
                            {step === 1 && (
                                <motion.div key="step1" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-10 max-w-4xl mx-auto relative z-10">
                                    <div className="text-center md:text-left">
                                        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Yolculuğunuzu Planlayın</h2>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="flex flex-col gap-2.5">
                                            <label className="text-xs font-semibold text-white/50 uppercase tracking-widest pl-1 flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-[#22D3EE]" /> Nereden</label>
                                            <select value={pickup} onChange={(e) => setPickup(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-5 text-sm text-white outline-none">
                                                <option value="" disabled>Alınış noktası seçin</option>
                                                {pickupLocations.map((loc, idx) => <option key={idx} value={loc as string} className="bg-[#111]">{loc as string}</option>)}
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-2.5">
                                            <label className="text-xs font-semibold text-white/50 uppercase tracking-widest pl-1 flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-[#C084FC]" /> Nereye</label>
                                            <select value={dropoff} onChange={(e) => setDropoff(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-5 text-sm text-white outline-none">
                                                <option value="" disabled>Varış noktası seçin</option>
                                                {dropoffLocations.map((loc, idx) => <option key={idx} value={loc as string} className="bg-[#111]">{loc as string}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                                        <div className="flex flex-col gap-2.5">
                                            <label className="text-xs font-semibold text-white/50 uppercase tracking-widest pl-1 flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-white/70" /> Tarih</label>
                                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-5 text-sm text-white outline-none [color-scheme:dark]" />
                                        </div>
                                        <div className="flex flex-col gap-2.5">
                                            <label className="text-xs font-semibold text-white/50 uppercase tracking-widest pl-1 flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-white/70" /> Saat</label>
                                            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-5 text-sm text-white outline-none [color-scheme:dark]" />
                                        </div>
                                        <div className="flex flex-col gap-2.5">
                                            <label className="text-xs font-semibold text-white/50 uppercase tracking-widest pl-1 flex items-center gap-2"><Users className="h-3.5 w-3.5 text-white/70" /> Yetişkin</label>
                                            <select value={adults} onChange={(e) => setAdults(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-5 text-sm text-white outline-none">
                                                {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].map(n => <option key={n} value={n} className="bg-[#111]">{n} Yetişkin</option>)}
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-2.5">
                                            <label className="text-xs font-semibold text-white/50 uppercase tracking-widest pl-1 flex items-center gap-2"><Baby className="h-3.5 w-3.5 text-white/70" /> Çocuk</label>
                                            <select value={children} onChange={(e) => setChildren(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-5 text-sm text-white outline-none">
                                                {[0,1,2,3,4,5,6].map(n => <option key={n} value={n} className="bg-[#111]">{n} Çocuk</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <button onClick={handleFindVehicles} className="mt-6 flex h-14 w-full items-center justify-center gap-2 bg-white text-sm font-bold text-black transition-all hover:bg-[#22D3EE] rounded-full group">
                                        Uygun Araçları Bul <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </button>
                                </motion.div>
                            )}

                            {/* 2. ADIM: ARAÇ SEÇIMI (Kapasite Filtreli) */}
                            {step === 2 && selectedRoute && (
                                <motion.div key="step2" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-10 relative z-10">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                                        <div>
                                            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Size Uygun Araçlar</h2>
                                            <p className="text-sm text-[#22D3EE]">{pickup} ➔ {dropoff} ({totalPassengers} Yolcu)</p>
                                        </div>
                                        <button onClick={() => setStep(1)} className="text-xs font-semibold text-white/60 hover:text-white uppercase tracking-widest border border-white/10 px-5 py-2.5 rounded-full flex items-center gap-2">
                                            <ChevronLeft className="h-3.5 w-3.5" /> Geri Dön
                                        </button>
                                    </div>

                                    <div className="grid gap-8">
                                        {/* Filtrelenmiş araç listesini ekrana basıyoruz */}
                                        {availablePricings.map((pricing: any) => {
                                            const car = pricing.vehicle;

                                            return (
                                                <div key={pricing.id} className="group flex flex-col lg:grid lg:grid-cols-[1.1fr_1.4fr] border border-white/5 bg-white/[0.02] rounded-3xl overflow-hidden transition-all hover:border-white/10 hover:bg-white/[0.04]">
                                                    <div className="h-64 lg:h-auto min-h-[300px] relative overflow-hidden bg-[#111]">
                                                        {car.imageUrl && <img src={car.imageUrl} alt={car.name} className="h-full w-full object-cover opacity-80" />}
                                                        
                                                        <div className="absolute top-0 left-0 w-full p-5 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none">
                                                            <h3 className="text-lg font-bold text-[#FACC15] uppercase tracking-wider">{car.name}</h3>
                                                            <div className="flex items-center gap-3 mt-1.5">
                                                                <span className="bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-md text-xs text-white font-medium">{car.pax} Kişi</span>
                                                                <span className="bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-md text-xs text-white font-medium">{car.luggage} Bagaj</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="p-8 flex flex-col justify-between">
                                                        <div>
                                                            <p className="text-xs text-[#22D3EE] font-semibold uppercase tracking-widest mb-5">Araç Özellikleri</p>
                                                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 mb-8">
                                                                {car.features.map((feature: string, idx: number) => (
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
                                                            <div className="flex flex-col">
                                                                <p className="text-xs text-[#FACC15] mb-1 font-semibold tracking-widest uppercase">Tek Yön Fiyatı</p>
                                                                <p className="text-3xl font-bold text-white">{pricing.price} {pricing.currency}</p>
                                                            </div>
                                                            <button 
                                                                onClick={() => { setSelectedPricing(pricing); setStep(3); }} 
                                                                className="w-full sm:w-auto px-8 h-12 bg-white text-black font-bold text-sm hover:bg-[#22D3EE] rounded-full flex items-center justify-center gap-2 group/btn"
                                                            >
                                                                Seç ve İlerle <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* EĞER BU YOLCU SAYISINA UYGUN BİR ARAÇ BULUNAMDIYSA BURASI TETİKLENİR */}
                                        {availablePricings.length === 0 && (
                                            <div className="py-16 flex flex-col items-center justify-center text-center border-2 border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
                                                <Users2 size={48} className="text-white/20 mb-4 animate-pulse" />
                                                <h3 className="text-xl font-bold text-white mb-2">Kapasite Aşımı</h3>
                                                <p className="text-white/50 text-sm max-w-sm">
                                                    Seçtiğiniz toplam {totalPassengers} yolcu için tek bir araçta uygun kapasitemiz bulunmamaktadır. Lütfen yolcu sayısını azaltın veya bizimle doğrudan iletişime geçin.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* 3. ADIM: İLETİŞİM VE ONAY */}
                            {step === 3 && selectedPricing && (
                                <motion.div key="step3" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-10 max-w-4xl mx-auto relative z-10">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Son Adım: İletişim Bilgileri</h2>
                                        </div>
                                        <button onClick={() => setStep(2)} className="text-xs font-semibold text-white/60 hover:text-white uppercase tracking-widest border border-white/10 px-5 py-2.5 rounded-full flex items-center gap-2">
                                            <ChevronLeft className="h-3.5 w-3.5" /> Geri Dön
                                        </button>
                                    </div>

                                    <div className="grid gap-10 md:grid-cols-2">
                                        <div className="flex flex-col gap-5">
                                            <h3 className="text-sm font-semibold text-[#22D3EE] uppercase tracking-widest mb-2 pl-1">İletişim Bilgileriniz</h3>
                                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ad Soyad" className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-5 text-sm text-white" />
                                            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Telefon Numarası" className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-5 text-sm text-white" />
                                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-Posta Adresi" className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-5 text-sm text-white" />
                                        </div>

                                        <div className="flex flex-col gap-5">
                                            <h3 className="text-sm font-semibold text-[#C084FC] uppercase tracking-widest mb-2 pl-1 flex items-center gap-2">Özet</h3>
                                            <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
                                                <p className="text-white font-bold">{selectedPricing.vehicle.name}</p>
                                                <p className="text-white/50 text-sm">{pickup} ➔ {dropoff}</p>
                                                <p className="text-[#FACC15] text-2xl font-bold mt-4">{selectedPricing.price} {selectedPricing.currency}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        disabled={isSubmitting}
                                        onClick={handleCompleteReservation} 
                                        className="mt-8 flex h-14 w-full items-center justify-center gap-2 bg-[#22D3EE] text-sm font-bold text-black rounded-full hover:shadow-[0_0_35px_rgba(34,211,238,0.5)] disabled:opacity-50"
                                    >
                                        {isSubmitting ? "Lütfen Bekleyin..." : "Rezervasyonu Tamamla"} <CheckCircle2 className="h-4 w-4 ml-1" />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </section>
        </>
    );
}