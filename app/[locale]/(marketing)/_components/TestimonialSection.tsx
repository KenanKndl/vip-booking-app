"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Quote } from "lucide-react";
import { useTranslations } from "next-intl";

// Sadece görselleri ve anahtarları tutuyoruz
const testimonialConfig = [
    {
        key: "t1",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop",
<<<<<<< Updated upstream
        text: "Toplantılarım için gün boyu araç tahsisi istedim. Araç içi temizlik, Wi-Fi hızı ve kaptanın profesyonelliği dünya standartlarındaydı.",
=======
>>>>>>> Stashed changes
    },
    {
        key: "t2",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
<<<<<<< Updated upstream
        text: "Gece geç saatteki uçuşumuz için Antalya Havalimanı'ndan alındık. Araç tam vaktinde oradaydı ve yolculuk harikaydı.",
=======
>>>>>>> Stashed changes
    },
    {
        key: "t3",
        image: "https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?q=80&w=200&auto=format&fit=crop",
<<<<<<< Updated upstream
        text: "Maybach serisi bir araç kiraladık. Yıldız tavan ve araç içi lüks detaylar tatilimize muazzam bir başlangıç yapmamızı sağladı.",
=======
>>>>>>> Stashed changes
    },
    {
        key: "t4",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
<<<<<<< Updated upstream
        text: "VIP misafirlerimizi yıllardır gözümüz kapalı emanet ediyoruz. Operasyon ekibi çok hızlı, araçlar her zaman pırıl pırıl.",
=======
>>>>>>> Stashed changes
    },
    {
        key: "t5",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
<<<<<<< Updated upstream
        text: "Şoförümüz Rusça biliyordu. Ara bölmeli VIP tasarım sayesinde ailece tamamen izole ve güvende hissettik.",
=======
>>>>>>> Stashed changes
    },
    {
        key: "t6",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop",
<<<<<<< Updated upstream
        text: "Sürpriz fiyat yok, geç kalma yok. Uygulama üzerinden saniyeler içinde rezervasyon yapıp ödemeyi tamamladım.",
=======
>>>>>>> Stashed changes
    },
];

export function TestimonialSection() {
    const t = useTranslations("TestimonialSection");
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
<<<<<<< Updated upstream
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
=======
            <div className="sticky top-0 flex h-screen items-center overflow-hidden px-6 py-24 lg:px-8">
                <div className="mx-auto grid w-full max-w-7xl gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                    <div className="relative min-w-0 overflow-visible">
                        <motion.div
                            style={{ x }}
                            className="flex w-max gap-5 pr-[20vw]"
                        >
                            {testimonialConfig.map((item, index) => {
                                // Çeviri verisini kartın beklediği formata uygun hale getiriyoruz
                                const translatedData = {
                                    name: t(`testimonials.${item.key}.name`),
                                    role: t(`testimonials.${item.key}.role`),
                                    text: t(`testimonials.${item.key}.text`),
                                    image: item.image
                                };

                                return (
                                    <motion.div
                                        key={`${item.key}-${index}`}
                                        initial={{ opacity: 0, y: 26, scale: 0.98 }}
                                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                        viewport={{ once: true, amount: 0.35 }}
                                        transition={{
                                            duration: 0.75,
                                            ease: "easeOut",
                                            delay: index * 0.04,
                                        }}
                                        className={[
                                            "w-[300px] shrink-0 sm:w-[360px] lg:w-[390px]",
                                            index % 2 === 1 ? "lg:translate-y-10" : "",
                                        ].join(" ")}
                                    >
                                        <TestimonialCard data={translatedData} featured={index === 0} />
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>

                    <motion.div
                        style={{ opacity: titleOpacity, y: titleY }}
                        className="hidden text-right lg:block lg:pt-6"
                    >
                        <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
                            {t("titlePart1")}
                            <span className="text-white/45">{t("titlePart2")}</span>
                        </h2>

                        <p className="ml-auto mt-6 max-w-lg text-base leading-8 text-white/45 md:text-lg">
                            {t("description")}
>>>>>>> Stashed changes
                        </p>
                    </div>
                </div>

<<<<<<< Updated upstream
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

=======
                        <div className="ml-auto mt-8 flex w-fit items-center gap-3 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white/35">
                            <span className="h-1.5 w-1.5 rounded-full bg-white/35" />
                            {t("scrollHint")}
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    style={{ opacity: titleOpacity, y: titleY }}
                    className="absolute left-6 right-6 top-24 block lg:hidden"
                >
                    <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
                        {t("titlePart1")}
                        <span className="text-white/45">{t("titlePart2")}</span>
                    </h2>

                    <p className="mt-5 max-w-xl text-base leading-8 text-white/45">
                        {t("description")}
                    </p>
                </motion.div>
>>>>>>> Stashed changes
            </div>
        </section>
    );
}

<<<<<<< Updated upstream
function TestimonialCard({ data }: { data: (typeof testimonials)[0] }) {
=======
function TestimonialCard({
                             data,
                             featured = false,
                         }: {
    data: { name: string; role: string; image: string; text: string; };
    featured?: boolean;
}) {
>>>>>>> Stashed changes
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