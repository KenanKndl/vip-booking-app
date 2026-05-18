"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Quote, Star } from "lucide-react";

// Örnek VIP Müşteri Yorumları
const testimonials = [
    {
        name: "Ahmet Yılmaz",
        role: "İş İnsanı",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop",
        text: "Toplantılarım için gün boyu araç tahsisi istedim. Araç içi temizlik, Wi-Fi hızı ve kaptanın profesyonelliği dünya standartlarındaydı. Kesinlikle tekrar tercih edeceğim.",
    },
    {
        name: "Selin Karaca",
        role: "Mimar",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
        text: "Gece geç saatteki uçuşumuz için Antalya Havalimanı'ndan alındık. Araç tam vaktinde oradaydı ve yolculuk o kadar sarsıntısızdı ki uyuyakalmışım. Harika bir deneyim.",
    },
    {
        name: "Caner & Cansu",
        role: "Balayı Çifti",
        image: "https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?q=80&w=200&auto=format&fit=crop",
        text: "Balayı tatilimiz için Maybach serisi bir araç kiraladık. Şampanya ikramı, yıldız tavan ve araç içi lüks detaylar tatilimize muazzam bir başlangıç yapmamızı sağladı.",
    },
    {
        name: "Murat Demir",
        role: "Turizm Acentesi",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
        text: "VIP misafirlerimizi yıllardır gözümüz kapalı emanet ediyoruz. Operasyon ekibi çok hızlı, araçlar her zaman pırıl pırıl. Sektördeki en iyi partnerlerimizden biri.",
    },
    {
        name: "Elena Petrova",
        role: "Turist",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
        text: "Şoförümüz Rusça biliyordu ve bize şehir hakkında harika ipuçları verdi. Ara bölmeli VIP tasarım sayesinde ailece tamamen izole ve güvende hissettik.",
    },
    {
        name: "Ozan Tekin",
        role: "Girişimci",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop",
        text: "Sürpriz fiyat yok, geç kalma yok, stres yok. Uygulama üzerinden saniyeler içinde rezervasyon yapıp ödemeyi tamamladım. Kurumsal taşımacılıkta tek geçerim.",
    },
    {
        name: "Ayşe Çelik",
        role: "Etkinlik Direktörü",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop",
        text: "Geniş Sprinter araçlarıyla tüm ekibimizi fuar alanına sorunsuz taşıdılar. Bagaj kapasitesi ve araç içi konfor kalabalık gruplar için hayat kurtarıcı.",
    },
    {
        name: "David Smith",
        role: "CEO",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
        text: "Seamless experience from start to finish. The vehicle was immaculately clean and the driver navigated through traffic perfectly. Highly recommended.",
    },
];

export function TestimonialSection() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        // Animasyonun başlangıç ve bitiş noktalarını daha pürüzsüz hale getiriyoruz
        offset: ["start start", "end end"]
    });

    // Daha iyi bir oran için başlangıcı %5'ten alıp %80'e kadar kaydırıyoruz.
    const x = useTransform(scrollYProgress, [0, 1], ["5%", "-80%"]);

    return (
        // Rahat bir scroll hissiyatı için yükseklik
        <section ref={targetRef} className="relative h-[250vh] bg-[#0d0d0d]">

            {/* Ekrana yapışan, ortalanmış ana kapsayıcı */}
            <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">

                {/* Birebir ExploreSection hiyerarşisinde üst başlık */}
                <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 mb-12 shrink-0">
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-xs font-medium tracking-[0.35em] text-[#FACC15] uppercase flex items-center gap-2">
                                <Star className="h-4 w-4 fill-[#FACC15]" /> Müşteri Memnuniyeti
                            </p>
                            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">
                                Misafirlerimizin <span className="text-white/60">VIP deneyimleri.</span>
                            </h2>
                        </div>
                        <div className="hidden md:block pb-2">
                            <p className="text-sm text-white/30 uppercase tracking-widest font-semibold flex items-center gap-2 animate-pulse">
                                Yana Kaydırın <span className="text-lg">→</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Yığılmayı engelleyen TEK SATIR (Row) Flex Kapsayıcı */}
                <motion.div style={{ x }} className="flex px-6 lg:px-8 w-max items-center">
                    <div className="flex gap-6">
                        {testimonials.map((data, index) => (
                            <div
                                key={index}
                                // Tekli veya çiftli numaralara göre yukarıdan hafif boşluk verip zarif bir "dalga" efekti oluşturuyoruz
                                className={`w-[320px] md:w-[400px] shrink-0 transition-transform duration-500 ${index % 2 !== 0 ? 'mt-12' : ''}`}
                            >
                                <TestimonialCard data={data} />
                            </div>
                        ))}
                    </div>
                </motion.div>

            </div>
        </section>
    );
}

// Birebir ExploreSection mantığına uyarlanmış "Yumuşak" (Rounded-[2rem]) Yorum Kartı
function TestimonialCard({ data }: { data: typeof testimonials[0] }) {
    return (
        <div className="group flex h-full flex-col justify-between overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.02] p-7 transition-all duration-300 hover:bg-white/[0.04] hover:border-white/10 min-h-[280px]">
            <div>
                {/* Tırnak işareti yıldız rengine (Altın) uyarlandı */}
                <Quote className="h-8 w-8 text-[#FACC15]/20 mb-5 transition-colors duration-300 group-hover:text-[#FACC15]/40" />
                <p className="text-sm leading-relaxed text-white/50 transition-colors group-hover:text-white/70">
                    "{data.text}"
                </p>
            </div>
            <div className="mt-8 flex items-center gap-4">
                <img
                    src={data.image}
                    alt={data.name}
                    className="h-12 w-12 rounded-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                />
                <div>
                    <h4 className="text-base font-semibold text-white">{data.name}</h4>
                    <p className="text-xs font-medium text-white/40 uppercase tracking-wider mt-0.5">{data.role}</p>
                </div>
            </div>
        </div>
    );
}