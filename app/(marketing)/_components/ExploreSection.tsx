"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Car, Handshake, ArrowRight } from "lucide-react";
import { FaInstagram, FaWhatsapp, FaLinkedinIn, FaYoutube } from "react-icons/fa";

const exploreItems = [
    {
        title: "Araçlarımız",
        description: "Konforlu, bakımlı ve özel transfer deneyimine uygun araçlarımızı yakından inceleyin.",
        href: "/araclarimiz",
        icon: Car,
        action: "Filoyu incele",
        accent: "hover:border-[#22D3EE]/30", // Camgöbeği
        iconColor: "text-[#22D3EE]",
    },
    {
        title: "Kimlerle Çalıştık",
        description: "Oteller, organizasyon firmaları ve kurumsal iş ortaklarımızla yürüttüğümüz çalışmaları görün.",
        href: "/referanslar",
        icon: Handshake,
        action: "Referansları gör",
        accent: "hover:border-[#C084FC]/30", // Lila
        iconColor: "text-[#C084FC]",
    },
];

const socialLinks = [
    { name: "Instagram", href: "https://instagram.com", icon: FaInstagram },
    { name: "YouTube", href: "https://youtube.com", icon: FaYoutube },
    { name: "LinkedIn", href: "https://linkedin.com", icon: FaLinkedinIn },
    { name: "WhatsApp", href: "https://wa.me/905000000000", icon: FaWhatsapp },
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: "easeOut" },
    },
};

export function ExploreSection() {
    return (
        <section id="explore" className="bg-[#0d0d0d] px-6 py-32 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mx-auto max-w-3xl text-center"
                >
                    <p className="text-xs font-medium tracking-[0.35em] text-white/35 uppercase">
                        Bizi Tanıyın
                    </p>

                    <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">
                        Yolculuğunuz başlamadan önce <span className="text-white/60">bizi yakından tanıyın.</span>
                    </h2>

                    <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/45 md:text-lg">
                        Araçlarımızı, referanslarımızı ve güncel paylaşımlarımızı tek bir
                        alanda keşfedin.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="mt-16 grid gap-5 lg:grid-cols-3"
                >
                    {exploreItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <motion.div variants={itemVariants} key={item.title}>
                                <Link
                                    href={item.href}
                                    className={`group flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.02] p-7 transition-all duration-300 hover:bg-white/[0.04] ${item.accent}`}
                                >
                                    <div>
                                        {/* Başlık ve İkon yan yana, aynı renkte birleştirildi */}
                                        <div className="flex items-center gap-3">
                                            <Icon className={`h-6 w-6 ${item.iconColor}`} />
                                            <h3 className={`text-2xl font-semibold tracking-tight ${item.iconColor}`}>
                                                {item.title}
                                            </h3>
                                        </div>

                                        <p className="mt-4 text-sm leading-relaxed text-white/45">
                                            {item.description}
                                        </p>
                                    </div>

                                    <div className="mt-6 mt-auto pt-2 flex items-center text-sm font-medium text-white/50 transition-colors group-hover:text-white">
                                        {item.action}
                                        <ArrowRight className="ml-2 h-4 w-4 -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}

                    <motion.div variants={itemVariants}>
                        <div className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.02] p-7 transition-all duration-300 hover:border-[#FACC15]/30 hover:bg-white/[0.04]">
                            <div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <FaInstagram className="h-6 w-6 text-[#FACC15]" />
                                        <h3 className="text-2xl font-semibold tracking-tight text-[#FACC15]">
                                            Bizi takip edin.
                                        </h3>
                                    </div>
                                    <span className="rounded-full bg-white/[0.04] px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-white/40">
                                        Güncel
                                    </span>
                                </div>

                                <p className="mt-4 text-sm leading-relaxed text-white/45">
                                    Araçlarımızı, transfer deneyimlerini ve duyurularımızı sosyal
                                    medya hesaplarımızdan takip edebilirsiniz.
                                </p>
                            </div>

                            <div className="mt-6 mt-auto pt-2 flex flex-wrap gap-2.5">
                                {socialLinks.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title={item.name}
                                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] text-white/55 transition-all duration-300 hover:scale-105 hover:bg-white hover:text-black"
                                        >
                                            <Icon className="h-4 w-4" />
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}