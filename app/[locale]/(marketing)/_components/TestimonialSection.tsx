"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Quote } from "lucide-react";

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
];

export function TestimonialSection() {
    const targetRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"],
    });

    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-58%"]);
    const titleOpacity = useTransform(scrollYProgress, [0, 0.08, 0.9, 1], [0, 1, 1, 0]);
    const titleY = useTransform(scrollYProgress, [0, 0.12], [28, 0]);

    return (
        <section
            ref={targetRef}
            className="relative h-[260vh] rounded-t-[2.5rem] bg-[#0d0d0d] md:rounded-t-[4rem]"
        >
            <div className="sticky top-0 flex h-screen items-center overflow-hidden px-6 py-24 lg:px-8">
                <div className="mx-auto grid w-full max-w-7xl gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                    <div className="relative min-w-0 overflow-visible">
                        <motion.div
                            style={{ x }}
                            className="flex w-max gap-5 pr-[20vw]"
                        >
                            {testimonials.map((testimonial, index) => (
                                <motion.div
                                    key={`${testimonial.name}-${index}`}
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
                                    <TestimonialCard data={testimonial} featured={index === 0} />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    <motion.div
                        style={{ opacity: titleOpacity, y: titleY }}
                        className="hidden text-right lg:block lg:pt-6"
                    >
                        <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
                            Misafirlerimizin{" "}
                            <span className="text-white/45">VIP deneyimleri.</span>
                        </h2>

                        <p className="ml-auto mt-6 max-w-lg text-base leading-8 text-white/45 md:text-lg">
                            Havalimanı transferlerinden özel etkinliklere kadar farklı
                            yolculuklarda bizi tercih eden misafirlerimizin deneyimlerine göz atın.
                        </p>

                        <div className="ml-auto mt-8 flex w-fit items-center gap-3 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white/35">
                            <span className="h-1.5 w-1.5 rounded-full bg-white/35" />
                            Kaydırdıkça yorumları keşfedin
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    style={{ opacity: titleOpacity, y: titleY }}
                    className="absolute left-6 right-6 top-24 block lg:hidden"
                >
                    <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
                        Misafirlerimizin{" "}
                        <span className="text-white/45">VIP deneyimleri.</span>
                    </h2>

                    <p className="mt-5 max-w-xl text-base leading-8 text-white/45">
                        Havalimanı transferlerinden özel etkinliklere kadar farklı
                        yolculuklarda bizi tercih eden misafirlerimizin deneyimlerine göz atın.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

function TestimonialCard({
                             data,
                             featured = false,
                         }: {
    data: (typeof testimonials)[0];
    featured?: boolean;
}) {
    return (
        <article
            className={[
                "group flex h-full flex-col justify-between border border-white/8 bg-white/[0.03] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/14 hover:bg-white/[0.05]",
                featured
                    ? "min-h-[390px] rounded-[2rem] p-8"
                    : "min-h-[330px] rounded-[1.75rem] p-6",
            ].join(" ")}
        >
            <div>
                <div
                    className={[
                        "flex items-center justify-center bg-white/[0.06] text-white/25 transition-colors duration-300 group-hover:text-white/45",
                        featured
                            ? "h-12 w-12 rounded-[1.2rem]"
                            : "h-10 w-10 rounded-[1.1rem]",
                    ].join(" ")}
                >
                    <Quote className={featured ? "h-6 w-6" : "h-5 w-5"} />
                </div>

                <p
                    className={[
                        "mt-6 leading-relaxed text-white/58 transition-colors duration-300 group-hover:text-white/75",
                        featured ? "text-lg md:text-xl md:leading-9" : "text-sm",
                    ].join(" ")}
                >
                    “{data.text}”
                </p>
            </div>

            <div className="mt-8 flex items-center gap-4">
                <img
                    src={data.image}
                    alt={data.name}
                    className={[
                        "shrink-0 rounded-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0",
                        featured ? "h-14 w-14" : "h-11 w-11",
                    ].join(" ")}
                />

                <div>
                    <h4
                        className={[
                            "font-semibold tracking-tight text-white",
                            featured ? "text-lg" : "text-base",
                        ].join(" ")}
                    >
                        {data.name}
                    </h4>

                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-white/35">
                        {data.role}
                    </p>
                </div>
            </div>
        </article>
    );
}