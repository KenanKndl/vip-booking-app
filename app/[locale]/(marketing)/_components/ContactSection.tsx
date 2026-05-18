"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Building2, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export function ContactSection() {
    return (
        <section id="contact" className="bg-[#0d0d0d] px-6 py-24 lg:px-8">
            <div className="mx-auto max-w-7xl">

                {/* Ana Düzen: Sol tarafta Başlık ve Tek Büyük İletişim Kartı, Sağ tarafta Form ve Harita */}
                <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] xl:gap-24 items-stretch">

                    {/* SOL TARAF: BAŞLIK & TEK ASİL KART */}
                    <div className="flex flex-col justify-between gap-10">

                        {/* Minimalist Başlık */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="max-w-md"
                        >
                            <p className="text-xs font-medium tracking-[0.4em] text-white/35 uppercase mb-4">
                                İletişim
                            </p>
                            <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl leading-tight mb-4">
                                Bize <span className="text-white/50">ulaşın.</span>
                            </h2>
                            <p className="text-sm leading-relaxed text-white/40">
                                Transfer talepleriniz, özel organizasyonlarınız veya sorularınız için profesyonel ekibimizle dilediğiniz an iletişime geçebilirsiniz.
                            </p>
                        </motion.div>

                        {/* Önerin Üzerine: Tüm Bilgilerin Toplandığı Tek ve Sade Kart */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                            className="flex-1 flex flex-col justify-center gap-8 rounded-3xl bg-white/[0.015] border border-white/5 p-8 shadow-none"
                        >
                            {/* Şirket */}
                            <div className="flex items-start gap-4">
                                <Building2 className="h-5 w-5 text-white/30 shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="text-xs font-semibold text-white/35 uppercase tracking-widest mb-1">Şirket Ünvanı</h3>
                                    <p className="text-sm font-medium text-white/80 leading-relaxed">VIP Booking Turizm Taşımacılık Sanayi Ve Tic.Ltd.Şti</p>
                                </div>
                            </div>

                            {/* Adres */}
                            <div className="flex items-start gap-4">
                                <MapPin className="h-5 w-5 text-white/30 shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="text-xs font-semibold text-white/35 uppercase tracking-widest mb-1">Adres</h3>
                                    <p className="text-sm font-medium text-white/80 leading-relaxed">Güzelyurt Mah. 26065 sokak No:6, Aksu / Antalya</p>
                                </div>
                            </div>

                            {/* Telefon */}
                            <div className="flex items-start gap-4">
                                <Phone className="h-5 w-5 text-white/30 shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="text-xs font-semibold text-white/35 uppercase tracking-widest mb-1">Telefon</h3>
                                    <p className="text-sm font-medium text-white/80 leading-relaxed">+90 553 685 67 67</p>
                                    <p className="text-sm font-medium text-white/50 leading-relaxed mt-0.5">+90 500 000 00 00</p>
                                </div>
                            </div>

                            {/* E-Posta */}
                            <div className="flex items-start gap-4">
                                <Mail className="h-5 w-5 text-white/30 shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="text-xs font-semibold text-white/35 uppercase tracking-widest mb-1">E-Posta</h3>
                                    <p className="text-sm font-medium text-white/80 leading-relaxed">reservation@vipbooking.com</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* SAĞ TARAF: FORM VE ALTINDAKİ HARİTA */}
                    <div className="flex flex-col gap-6">

                        {/* Düz ve Clean Form (Tüm parlamalar ve gölgeler temizlendi) */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                        >
                            <form className="flex flex-col gap-5 bg-white/[0.015] border border-white/5 p-8 rounded-3xl shadow-none">
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="name" className="text-xs font-medium text-white/40 uppercase tracking-wider pl-1">Ad Soyad</label>
                                        <input
                                            type="text"
                                            id="name"
                                            placeholder="Adınız Soyadınız"
                                            className="w-full rounded-xl border border-white/5 bg-white/[0.02] py-3 px-4 text-sm text-white placeholder-white/20 transition-all duration-200 hover:bg-white/5 focus:border-white/20 focus:bg-white/5 outline-none shadow-none"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="email" className="text-xs font-medium text-white/40 uppercase tracking-wider pl-1">E-Mail</label>
                                        <input
                                            type="email"
                                            id="email"
                                            placeholder="ornek@mail.com"
                                            className="w-full rounded-xl border border-white/5 bg-white/[0.02] py-3 px-4 text-sm text-white placeholder-white/20 transition-all duration-200 hover:bg-white/5 focus:border-white/20 focus:bg-white/5 outline-none shadow-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="phone" className="text-xs font-medium text-white/40 uppercase tracking-wider pl-1">Telefon</label>
                                    <div className="flex rounded-xl border border-white/5 bg-white/[0.02] transition-all duration-200 hover:bg-white/5 focus-within:border-white/20 focus-within:bg-white/5 overflow-hidden">
                                        <select className="bg-transparent py-3 pl-4 pr-2 text-sm text-white/50 outline-none appearance-none cursor-pointer border-r border-white/5">
                                            <option value="+90" className="bg-[#111]">TR +90</option>
                                            <option value="+49" className="bg-[#111]">DE +49</option>
                                            <option value="+44" className="bg-[#111]">UK +44</option>
                                        </select>
                                        <input
                                            type="tel"
                                            id="phone"
                                            placeholder="555 000 00 00"
                                            className="w-full bg-transparent py-3 px-4 text-sm text-white placeholder-white/20 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="message" className="text-xs font-medium text-white/40 uppercase tracking-wider pl-1">Mesaj</label>
                                    <Textarea
                                        id="message"
                                        placeholder="Mesajınızı buraya yazabilirsiniz..."
                                        className="w-full min-h-[120px] rounded-xl border border-white/5 bg-white/[0.02] py-3 px-4 text-sm text-white placeholder-white/20 transition-all duration-200 hover:bg-white/5 focus-visible:border-white/20 focus-visible:ring-0 focus-visible:ring-offset-0 outline-none resize-none shadow-none"
                                    />
                                </div>

                                <button
                                    type="button"
                                    className="group mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white text-sm font-semibold text-black transition-all duration-300 hover:bg-white/90 shadow-none"
                                >
                                    <span>Mesajı Gönder</span>
                                    <Send className="h-3.5 w-3.5" />
                                </button>
                            </form>
                        </motion.div>

                        {/* Tam Oturtulmuş Harita */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
                            className="relative h-[200px] w-full rounded-3xl overflow-hidden border border-white/5 bg-white/[0.015] shadow-none"
                        >
                            <div className="absolute inset-0 bg-black/40 pointer-events-none z-10" />
                            <iframe
                                src="https://maps.google.com/maps?q=G%C3%BCzelyurt%20Mah.%2026065%20sokak%20No:6%20Aksu%20Antalya&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="relative z-0 filter grayscale opacity-40 contrast-125"
                            />
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}