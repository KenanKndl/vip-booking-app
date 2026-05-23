"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
    {
        name: "Ahmet Yılmaz",
        role: "İş İnsanı",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop",
        text: "Toplantılarım için gün boyu araç tahsisi istedim. Araç içi temizlik, Wi-Fi hızı ve kaptanın profesyonelliği dünya standartlarındaydı.",
    },
    {
        name: "Selin Karaca",
        role: "Mimar",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
        text: "Gece geç saatteki uçuşumuz için Antalya Havalimanı'ndan alındık. Araç tam vaktinde oradaydı ve yolculuk harikaydı.",
    },
    {
        name: "Caner & Cansu",
        role: "Balayı Çifti",
        image: "https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?q=80&w=200&auto=format&fit=crop",
        text: "Maybach serisi bir araç kiraladık. Yıldız tavan ve araç içi lüks detaylar tatilimize muazzam bir başlangıç yapmamızı sağladı.",
    },
    {
        name: "Murat Demir",
        role: "Turizm Acentesi",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
        text: "VIP misafirlerimizi yıllardır gözümüz kapalı emanet ediyoruz. Operasyon ekibi çok hızlı, araçlar her zaman pırıl pırıl.",
    },
    {
        name: "Elena Petrova",
        role: "Turist",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
        text: "Şoförümüz Rusça biliyordu. Ara bölmeli VIP tasarım sayesinde ailece tamamen izole ve güvende hissettik.",
    },
    {
        name: "Ozan Tekin",
        role: "Girişimci",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop",
        text: "Sürpriz fiyat yok, geç kalma yok. Uygulama üzerinden saniyeler içinde rezervasyon yapıp ödemeyi tamamladım.",
    },
];

export function TestimonialSection() {
    const targetRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    const [scrollRange, setScrollRange] = useState(0);

    // Kayan şeridin gerçek genişliğini hesaplayıp, sınırları çiziyoruz
    useEffect(() => {
        const updateScrollRange = () => {
            if (containerRef.current && trackRef.current) {
                const trackWidth = trackRef.current.scrollWidth;
                const containerWidth = containerRef.current.offsetWidth;
                // Kaydırılması gereken net mesafe (Piksel cinsinden)
                setScrollRange(trackWidth - containerWidth);
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

    // Artık string oranlar yok. 0'dan, hesaplanan net piksele kadar kayıyor. (%100 Pürüzsüz)
    const x = useTransform(scrollYProgress, [0, 1], [0, -scrollRange]);

    return (
        <section
            ref={targetRef}
            // Dinamik Yükseklik: Sabit vh yerine, ekranda kapladığı alan + kayma mesafesi.
            // Bu, 1px dikey scroll = 1px yatay scroll olmasını sağlar.
            style={{ height: scrollRange > 0 ? `calc(100vh + ${scrollRange}px)` : "250vh" }}
            className="relative rounded-t-[2.5rem] bg-[#0d0d0d] md:rounded-t-[4rem]"
        >
            <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden py-16 md:py-24">

                {/* ÜST SATIR: Başlık */}
                <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 mb-12 md:mb-16">
                    <div className="flex flex-col items-start lg:items-end text-left lg:text-right">
                        <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
                            Misafirlerimizin{" "}
                            <span className="text-white/45">VIP deneyimleri.</span>
                        </h2>
                        <p className="mt-5 max-w-xl text-base leading-8 text-white/45 md:text-lg">
                            Havalimanı transferlerinden özel etkinliklere kadar farklı
                            yolculuklarda bizi tercih eden misafirlerimizin gerçek deneyimlerine göz atın.
                        </p>
                    </div>
                </div>

                {/* ALT SATIR: Bağımsız Kayan Kartlar Pisti */}
                <div
                    ref={containerRef}
                    // Container genişliği üstteki yazıyla birebir aynı. (max-w-7xl px-6)
                    // overflow-visible sayesinde kartlar bu alanın dışına ekran sonuna kadar taşabiliyor.
                    className="mx-auto w-full max-w-7xl px-6 lg:px-8 overflow-visible"
                >
                    <motion.div
                        ref={trackRef}
                        style={{ x }}
                        className="flex w-max gap-5"
                    >
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={`${testimonial.name}-${index}`}
                                className="w-[280px] shrink-0 sm:w-[310px]"
                            >
                                <TestimonialCard data={testimonial} />
                            </div>
                        ))}
                    </motion.div>
                </div>

            </div>
        </section>
    );
}

function TestimonialCard({ data }: { data: (typeof testimonials)[0] }) {
    return (
        <article className="group flex h-[260px] flex-col justify-between rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04]">
            <div>
                <div className="flex h-9 w-9 items-center justify-center rounded-[0.9rem] bg-white/[0.06] text-white/25 transition-colors duration-300 group-hover:text-white/45">
                    <Quote className="h-4 w-4" />
                </div>

                <p className="mt-4 text-sm leading-relaxed text-white/60 transition-colors duration-300 group-hover:text-white/80">
                    “{data.text}”
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