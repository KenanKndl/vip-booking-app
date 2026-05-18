"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Car, Handshake, ArrowRight } from "lucide-react";
import { FaInstagram, FaYoutube, FaTripadvisor, FaGoogle } from "react-icons/fa";

const exploreItems = [
    {
        title: "Araçlarımız",
        description:
            "Konforlu, bakımlı ve özel transfer deneyimine uygun araçlarımızı yakından inceleyin.",
        href: "/araclarimiz",
        icon: Car,
        action: "Filoyu incele",
        iconColor: "text-[#0891B2]",
        iconBg: "bg-[#22D3EE]/12",
        hoverBorder: "hover:border-[#22D3EE]/35",
        details: [
            "Mercedes Vito & V-Class",
            "Havalimanı ve şehir içi transfer",
            "Konfor odaklı araç seçimi",
        ],
    },
    {
        title: "Kimlerle Çalıştık",
        description:
            "Oteller, organizasyon firmaları ve kurumsal iş ortaklarımızla yürüttüğümüz çalışmaları görün.",
        href: "/referanslar",
        icon: Handshake,
        action: "Referansları gör",
        iconColor: "text-[#CA8A04]",
        iconBg: "bg-[#FACC15]/18",
        hoverBorder: "hover:border-[#FACC15]/40",
        details: [
            "Oteller ve turizm markaları",
            "Organizasyon firmaları",
            "Kurumsal ulaşım çözümleri",
        ],
    },
];

const socialLinks = [
    { name: "Instagram", href: "https://instagram.com", icon: FaInstagram },
    { name: "YouTube", href: "https://youtube.com", icon: FaYoutube },
    { name: "Tripadvisor", href: "https://tripadvisor.com", icon: FaTripadvisor },
    { name: "Google Reviews", href: "https://google.com", icon: FaGoogle },
];

const socialDetails = [
    "Araç ve transfer paylaşımları",
    "Güncel duyurular",
    "Etkinlik ve yolculuk içerikleri",
];

const featureChipClass =
    "cursor-pointer select-none rounded-full px-3 py-1.5 text-sm font-medium text-black/55 transition-all duration-300 hover:bg-[#0d0d0d] hover:text-white";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.12 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: "easeOut" },
    },
};

export function ExploreSection() {
    return (
        <section id="explore" className="px-6 py-28 lg:px-8 lg:py-40">
            <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="lg:sticky lg:top-32 lg:pt-6"
                >
                    <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-black md:text-5xl lg:text-6xl">
                        Yolculuğunuz başlamadan önce{" "}
                        <span className="text-black/45">bizi yakından tanıyın.</span>
                    </h2>

                    <p className="mt-6 max-w-lg text-base leading-8 text-black/55 md:text-lg">
                        Araçlarımızı, referanslarımızı ve güncel paylaşımlarımızı tek bir
                        alanda keşfedin. Rezervasyon öncesinde markamızı, çalışma şeklimizi
                        ve deneyim anlayışımızı daha net görün.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-1">
                        <span className={featureChipClass}>Premium filo</span>
                        <span className={featureChipClass}>Kurumsal referanslar</span>
                        <span className={featureChipClass}>Güncel paylaşımlar</span>
                    </div>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid gap-4"
                >
                    {exploreItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <motion.div variants={itemVariants} key={item.title}>
                                <Link
                                    href={item.href}
                                    className={`group block rounded-[1.75rem] border border-black/10 bg-white px-6 py-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${item.hoverBorder}`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div
                                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[1.1rem] ${item.iconBg}`}
                                        >
                                            <Icon className={`h-5 w-5 ${item.iconColor}`} />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-4 pt-0.5">
                                                <h3 className="text-2xl font-semibold tracking-tight text-black md:text-[1.7rem] md:leading-tight">
                                                    {item.title}
                                                </h3>
                                            </div>

                                            <p className="mt-2 max-w-2xl text-sm leading-6 text-black/55">
                                                {item.description}
                                            </p>

                                            <div className="mt-5 grid gap-2">
                                                {item.details.map((detail) => (
                                                    <div
                                                        key={detail}
                                                        className="flex items-center gap-2 text-sm font-medium text-black/45"
                                                    >
                                                        <span className="h-1.5 w-1.5 rounded-full bg-black/25" />
                                                        {detail}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-6 flex items-center text-sm font-semibold text-black/45 transition-colors group-hover:text-black">
                                                {item.action}
                                                <ArrowRight className="ml-2 h-4 w-4 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}

                    <motion.div variants={itemVariants}>
                        <div className="group rounded-[1.75rem] border border-black/10 bg-[#111111] px-6 py-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C084FC]/40 hover:shadow-md">
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[1.1rem] bg-[#C084FC]/15">
                                    <FaInstagram className="h-5 w-5 text-[#C084FC]" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-4 pt-0.5">
                                        <h3 className="text-2xl font-semibold tracking-tight text-white md:text-[1.7rem] md:leading-tight">
                                            Bizi takip edin.
                                        </h3>

                                        <span className="hidden shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/40 sm:block">
                                            Güncel
                                        </span>
                                    </div>

                                    <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">
                                        Araçlarımızı, transfer deneyimlerini ve duyurularımızı sosyal
                                        medya hesaplarımızdan takip edebilirsiniz.
                                    </p>

                                    <div className="mt-5 grid gap-2">
                                        {socialDetails.map((detail) => (
                                            <div
                                                key={detail}
                                                className="flex items-center gap-2 text-sm font-medium text-white/45"
                                            >
                                                <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
                                                {detail}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-5 flex flex-wrap gap-2.5">
                                        {socialLinks.map((item) => {
                                            const Icon = item.icon;

                                            return (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    title={item.name}
                                                    className="flex h-9 w-9 items-center justify-center rounded-[0.9rem] bg-white/8 text-white/55 transition-all duration-300 hover:bg-white hover:text-black"
                                                >
                                                    <Icon className="h-4 w-4" />
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}