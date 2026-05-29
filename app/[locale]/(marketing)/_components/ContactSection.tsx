"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { motion, Variants } from "framer-motion";
import {
    MapPin,
    Phone,
    Mail,
    Building2,
    Send,
    ArrowUpRight,
    ChevronDown,
    Check,
    ShieldCheck,
    Search,
} from "lucide-react";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import {
    allPhoneCountries,
    preferredPhoneCountries,
    type PhoneCountry,
} from "@/lib/phone-countries";

const pageVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const fadeUpVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 18,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.55,
            ease: "easeOut",
        },
    },
};

const cardVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 14,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.45,
            ease: "easeOut",
        },
    },
};

const inputClass =
    "w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none transition duration-200 placeholder:text-white/25 hover:border-white/15 hover:bg-black/25 focus:border-white/30 focus:bg-black/30";

const labelClass =
    "pl-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/45 sm:tracking-[0.18em]";

const contactFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Ad soyad en az 2 karakter olmalı.")
        .max(80, "Ad soyad çok uzun."),

    email: z
        .string()
        .trim()
        .email("Geçerli bir e-posta adresi girin."),

    phoneDigits: z
        .string()
        .min(7, "Telefon numarası çok kısa.")
        .max(15, "Telefon numarası çok uzun.")
        .regex(/^\d+$/, "Telefon numarası sadece rakamlardan oluşmalı."),

    message: z
        .string()
        .trim()
        .min(10, "Mesaj en az 10 karakter olmalı.")
        .max(1000, "Mesaj çok uzun."),

    isHumanChecked: z
        .boolean()
        .refine((value) => value === true, {
            message: "Mesaj göndermeden önce onaylamalısınız.",
        }),
});

function getPhoneDigits(value: string) {
    return value.replace(/\D/g, "").slice(0, 15);
}

function formatPhoneInput(value: string) {
    const digits = getPhoneDigits(value);

    if (digits.length <= 3) return digits;

    if (digits.length <= 6) {
        return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    }

    if (digits.length <= 10) {
        return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    }

    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(
        6,
        10
    )} ${digits.slice(10)}`;
}

export function ContactSection() {
    const t = useTranslations("ContactSection");

    const countryDropdownRef = useRef<HTMLDivElement | null>(null);

    const [selectedPhoneCountry, setSelectedPhoneCountry] =
        useState<PhoneCountry>(preferredPhoneCountries[0]);

    const [isPhoneDropdownOpen, setIsPhoneDropdownOpen] = useState(false);
    const [phoneCountrySearch, setPhoneCountrySearch] = useState("");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [isHumanChecked, setIsHumanChecked] = useState(false);

    const [hasTriedSubmit, setHasTriedSubmit] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const otherPhoneCountries = useMemo(() => {
        return allPhoneCountries
            .filter(
                (country) =>
                    !preferredPhoneCountries.some(
                        (preferred) => preferred.code === country.code
                    )
            )
            .sort((a, b) => a.label.localeCompare(b.label));
    }, []);

    const filteredPreferredCountries = useMemo(() => {
        const query = phoneCountrySearch.trim().toLowerCase();

        if (!query) return preferredPhoneCountries;

        return preferredPhoneCountries.filter((country) => {
            return (
                country.label.toLowerCase().includes(query) ||
                country.code.toLowerCase().includes(query) ||
                country.dialCode.includes(query)
            );
        });
    }, [phoneCountrySearch]);

    const filteredOtherCountries = useMemo(() => {
        const query = phoneCountrySearch.trim().toLowerCase();

        if (!query) return otherPhoneCountries;

        return otherPhoneCountries.filter((country) => {
            return (
                country.label.toLowerCase().includes(query) ||
                country.code.toLowerCase().includes(query) ||
                country.dialCode.includes(query)
            );
        });
    }, [otherPhoneCountries, phoneCountrySearch]);

    const hasCountryResults =
        filteredPreferredCountries.length > 0 ||
        filteredOtherCountries.length > 0;

    const phoneDigits = getPhoneDigits(phone);

    const validationResult = contactFormSchema.safeParse({
        name,
        email,
        phoneDigits,
        message,
        isHumanChecked,
    });

    const fieldErrors = validationResult.success
        ? {}
        : validationResult.error.flatten().fieldErrors;

    const isFormValid = validationResult.success;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                countryDropdownRef.current &&
                !countryDropdownRef.current.contains(event.target as Node)
            ) {
                setIsPhoneDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectPhoneCountry = (country: PhoneCountry) => {
        setSelectedPhoneCountry(country);
        setIsPhoneDropdownOpen(false);
        setPhoneCountrySearch("");
    };

    const handlePhoneChange = (value: string) => {
        setPhone(formatPhoneInput(value));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setHasTriedSubmit(true);

        const result = contactFormSchema.safeParse({
            name,
            email,
            phoneDigits,
            message,
            isHumanChecked,
        });

        if (!result.success) return;

        setIsSubmitting(true);

        // Veritabanı ContactMessage modeline birebir uyan gerçek veri paketi
        const payload = {
            fullName: name.trim(),
            email: email.trim(),
            phone: `${selectedPhoneCountry.dialCode}${phoneDigits}`,
            message: message.trim(),
        };

        try {
            const response = await fetch("/api/client/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            
            const data = await response.json();

            if (!data.success) {
                throw new Error("Contact request failed");
            }

            alert("Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.");

            setName("");
            setEmail("");
            setPhone("");
            setMessage("");
            setIsHumanChecked(false);
            setHasTriedSubmit(false);
        } catch {
            alert("Mesaj gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactCards = [
        {
            key: "phone",
            icon: Phone,
            iconColor: "text-[#22D3EE]",
            iconBg: "bg-[#22D3EE]/10",
            label: t("info.phoneLabel"),
            title: "+90 553 685 67 67",
            description:
                "Rezervasyon ve transfer talepleriniz için arayabilirsiniz.",
            href: "tel:+905536856767",
        },
        {
            key: "email",
            icon: Mail,
            iconColor: "text-[#C084FC]",
            iconBg: "bg-[#C084FC]/10",
            label: t("info.emailLabel"),
            title: "reservation@vipbooking.com",
            description:
                "Rezervasyon, teklif ve genel sorularınız için yazabilirsiniz.",
            href: "mailto:reservation@vipbooking.com",
        },
        {
            key: "company",
            icon: Building2,
            iconColor: "text-[#FACC15]",
            iconBg: "bg-[#FACC15]/12",
            label: t("info.companyLabel"),
            title: t("info.companyName"),
            description: "VIP transfer ve özel ulaşım hizmetleri.",
            href: null,
        },
    ];

    return (
        <section
            id="contact"
            className="min-h-screen bg-[#0d0d0d] px-4 pb-16 pt-28 text-white sm:px-6 sm:pb-20 lg:px-8 lg:pb-28 lg:pt-32"
        >
            <motion.div
                variants={pageVariants}
                initial="hidden"
                animate="visible"
                className="mx-auto max-w-7xl"
            >
                <motion.div variants={fadeUpVariants} className="max-w-3xl">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/35 sm:text-xs sm:tracking-[0.35em]">
                        {t("subTitle")}
                    </p>

                    <h1 className="mt-4 max-w-4xl text-3xl font-semibold tracking-tight text-white sm:mt-5 sm:text-5xl lg:text-6xl">
                        {t("titlePart1")}{" "}
                        <span className="text-white/45">
                            {t("titlePart2")}
                        </span>
                    </h1>

                    <p className="mt-4 max-w-2xl text-sm leading-7 text-white/45 sm:mt-5 sm:text-base">
                        {t("description")}
                    </p>
                </motion.div>

                <div className="mt-8 grid gap-5 sm:mt-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch lg:gap-6">
                    <motion.div
                        variants={fadeUpVariants}
                        className="h-full rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-4 sm:rounded-[1.75rem] sm:p-6 lg:p-8"
                    >
                        <div className="mb-6 flex flex-col gap-2 border-b border-white/10 pb-5 sm:mb-7 sm:pb-6">
                            <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                                {t("form.submitButton")}
                            </h2>

                            <p className="max-w-xl text-sm leading-6 text-white/45">
                                Size en kısa sürede dönüş yapalım.{" "}
                                <span className="font-medium text-[#22D3EE]">
                                    Transfer talebinizi
                                </span>{" "}
                                detaylıca iletebilirsiniz.
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="grid gap-5"
                            noValidate
                        >
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <label
                                        htmlFor="name"
                                        className={labelClass}
                                    >
                                        {t("form.nameLabel")}
                                    </label>

                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        placeholder={t("form.namePlaceholder")}
                                        autoComplete="name"
                                        className={`${inputClass} ${
                                            hasTriedSubmit && fieldErrors.name
                                                ? "border-red-400/50 focus:border-red-400/60"
                                                : ""
                                        }`}
                                    />

                                    {hasTriedSubmit &&
                                        fieldErrors.name?.[0] && (
                                            <p className="pl-1 text-xs text-red-300">
                                                {fieldErrors.name[0]}
                                            </p>
                                        )}
                                </div>

                                <div className="grid gap-2">
                                    <label
                                        htmlFor="email"
                                        className={labelClass}
                                    >
                                        {t("form.emailLabel")}
                                    </label>

                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder={t("form.emailPlaceholder")}
                                        autoComplete="email"
                                        className={`${inputClass} ${
                                            hasTriedSubmit && fieldErrors.email
                                                ? "border-red-400/50 focus:border-red-400/60"
                                                : ""
                                        }`}
                                    />

                                    {hasTriedSubmit &&
                                        fieldErrors.email?.[0] && (
                                            <p className="pl-1 text-xs text-red-300">
                                                {fieldErrors.email[0]}
                                            </p>
                                        )}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label htmlFor="phone" className={labelClass}>
                                    {t("form.phoneLabel")}
                                </label>

                                <div className="relative" ref={countryDropdownRef}>
                                    <div
                                        className={`flex overflow-hidden rounded-2xl border bg-black/20 transition duration-200 hover:bg-black/25 focus-within:bg-black/30 ${
                                            hasTriedSubmit &&
                                            fieldErrors.phoneDigits
                                                ? "border-red-400/50 focus-within:border-red-400/60"
                                                : "border-white/10 hover:border-white/15 focus-within:border-white/30"
                                        }`}
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsPhoneDropdownOpen(
                                                    (prev) => !prev
                                                )
                                            }
                                            className="flex min-w-[108px] items-center justify-center gap-1.5 border-r border-white/10 px-3 py-3.5 text-sm font-semibold text-white/70 outline-none transition hover:bg-white/[0.04] hover:text-white sm:min-w-[126px] sm:gap-2 sm:px-4"
                                        >
                                            <span
                                                className={`${selectedPhoneCountry.flagClass} bg-transparent text-base outline-none shadow-none`}
                                            />
                                            <span>
                                                {selectedPhoneCountry.dialCode}
                                            </span>
                                            <ChevronDown
                                                className={`h-3.5 w-3.5 text-white/35 transition duration-200 ${
                                                    isPhoneDropdownOpen
                                                        ? "rotate-180"
                                                        : ""
                                                }`}
                                            />
                                        </button>

                                        <input
                                            type="tel"
                                            id="phone"
                                            value={phone}
                                            onChange={(e) =>
                                                handlePhoneChange(
                                                    e.target.value
                                                )
                                            }
                                            placeholder={t(
                                                "form.phonePlaceholder"
                                            )}
                                            inputMode="numeric"
                                            autoComplete="tel"
                                            className="min-w-0 w-full bg-transparent px-3 py-3.5 text-sm text-white outline-none placeholder:text-white/25 sm:px-4"
                                        />
                                    </div>

                                    {isPhoneDropdownOpen && (
                                        <div className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-2xl shadow-black/40 sm:w-[360px]">
                                            <div className="border-b border-white/10 p-2">
                                                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-3">
                                                    <Search className="h-4 w-4 shrink-0 text-[#22D3EE]/70" />

                                                    <input
                                                        value={phoneCountrySearch}
                                                        onChange={(e) =>
                                                            setPhoneCountrySearch(
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Ülke veya kod ara..."
                                                        className="h-10 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                                                        autoFocus
                                                    />
                                                </div>
                                            </div>

                                            <div className="max-h-[52svh] overflow-y-auto p-1.5 sm:max-h-[320px]">
                                                {!hasCountryResults && (
                                                    <div className="px-4 py-8 text-center text-sm text-white/40">
                                                        Ülke bulunamadı.
                                                    </div>
                                                )}

                                                {filteredPreferredCountries.length >
                                                    0 && (
                                                        <div>
                                                            <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                                                                Sık kullanılanlar
                                                            </p>

                                                            <div className="grid gap-1">
                                                                {filteredPreferredCountries.map(
                                                                    (country) => {
                                                                        const isActive =
                                                                            selectedPhoneCountry.code ===
                                                                            country.code;

                                                                        return (
                                                                            <button
                                                                                key={
                                                                                    country.code
                                                                                }
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    handleSelectPhoneCountry(
                                                                                        country
                                                                                    )
                                                                                }
                                                                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-white outline-none transition hover:bg-white/10"
                                                                            >
                                                                            <span
                                                                                className={`${country.flagClass} bg-transparent text-base outline-none shadow-none`}
                                                                            />

                                                                                <div className="min-w-0 flex-1">
                                                                                    <p className="truncate text-sm font-medium text-white">
                                                                                        {
                                                                                            country.label
                                                                                        }
                                                                                    </p>

                                                                                    <p className="text-xs text-white/40">
                                                                                        {
                                                                                            country.code
                                                                                        }{" "}
                                                                                        {
                                                                                            country.dialCode
                                                                                        }
                                                                                    </p>
                                                                                </div>

                                                                                {isActive && (
                                                                                    <Check className="h-4 w-4 shrink-0 text-[#22D3EE]" />
                                                                                )}
                                                                            </button>
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                {filteredPreferredCountries.length >
                                                    0 &&
                                                    filteredOtherCountries.length >
                                                    0 && (
                                                        <div className="my-1 h-px bg-white/10" />
                                                    )}

                                                {filteredOtherCountries.length >
                                                    0 && (
                                                        <div>
                                                            <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                                                                Tüm ülkeler
                                                            </p>

                                                            <div className="grid gap-1">
                                                                {filteredOtherCountries.map(
                                                                    (country) => {
                                                                        const isActive =
                                                                            selectedPhoneCountry.code ===
                                                                            country.code;

                                                                        return (
                                                                            <button
                                                                                key={
                                                                                    country.code
                                                                                }
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    handleSelectPhoneCountry(
                                                                                        country
                                                                                    )
                                                                                }
                                                                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-white outline-none transition hover:bg-white/10"
                                                                            >
                                                                            <span
                                                                                className={`${country.flagClass} bg-transparent text-base outline-none shadow-none`}
                                                                            />

                                                                                <div className="min-w-0 flex-1">
                                                                                    <p className="truncate text-sm font-medium text-white">
                                                                                        {
                                                                                            country.label
                                                                                        }
                                                                                    </p>

                                                                                    <p className="text-xs text-white/40">
                                                                                        {
                                                                                            country.code
                                                                                        }{" "}
                                                                                        {
                                                                                            country.dialCode
                                                                                        }
                                                                                    </p>
                                                                                </div>

                                                                                {isActive && (
                                                                                    <Check className="h-4 w-4 shrink-0 text-[#22D3EE]" />
                                                                                )}
                                                                            </button>
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {hasTriedSubmit &&
                                    fieldErrors.phoneDigits?.[0] && (
                                        <p className="pl-1 text-xs text-red-300">
                                            {fieldErrors.phoneDigits[0]}
                                        </p>
                                    )}
                            </div>

                            <div className="grid gap-2">
                                <label htmlFor="message" className={labelClass}>
                                    {t("form.messageLabel")}
                                </label>

                                <Textarea
                                    id="message"
                                    value={message}
                                    onChange={(e) =>
                                        setMessage(e.target.value)
                                    }
                                    placeholder={t("form.messagePlaceholder")}
                                    className={`min-h-[140px] w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white shadow-none outline-none transition duration-200 placeholder:text-white/25 hover:border-white/15 hover:bg-black/25 focus-visible:border-white/30 focus-visible:bg-black/30 focus-visible:ring-0 focus-visible:ring-offset-0 sm:min-h-[150px] ${
                                        hasTriedSubmit && fieldErrors.message
                                            ? "border-red-400/50 focus-visible:border-red-400/60"
                                            : ""
                                    }`}
                                />

                                <div className="flex items-center justify-between gap-3 pl-1">
                                    {hasTriedSubmit &&
                                    fieldErrors.message?.[0] ? (
                                        <p className="text-xs text-red-300">
                                            {fieldErrors.message[0]}
                                        </p>
                                    ) : (
                                        <p className="text-xs text-white/30">
                                            En az 10 karakter.
                                        </p>
                                    )}

                                    <p className="shrink-0 text-xs text-white/25">
                                        {message.trim().length}/1000
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setIsHumanChecked((prev) => !prev)
                                }
                                className={`flex items-center justify-between gap-4 rounded-2xl border px-4 py-3.5 text-left transition duration-200 ${
                                    isHumanChecked
                                        ? "border-[#22D3EE]/25 bg-[#22D3EE]/10"
                                        : "border-white/10 bg-black/20 hover:border-white/15 hover:bg-black/25"
                                }`}
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <span
                                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition duration-200 ${
                                            isHumanChecked
                                                ? "border-[#22D3EE] bg-[#22D3EE] text-black"
                                                : "border-white/20 bg-white/[0.03] text-transparent"
                                        }`}
                                    >
                                        <Check className="h-3.5 w-3.5" />
                                    </span>

                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-white">
                                            Ben robot değilim
                                        </p>

                                        <p className="mt-0.5 text-xs text-white/35">
                                            Mesaj göndermeden önce onaylayın.
                                        </p>
                                    </div>
                                </div>

                                <ShieldCheck
                                    className={`h-5 w-5 shrink-0 transition duration-200 ${
                                        isHumanChecked
                                            ? "text-[#22D3EE]"
                                            : "text-white/25"
                                    }`}
                                />
                            </button>

                            {hasTriedSubmit &&
                                fieldErrors.isHumanChecked?.[0] && (
                                    <p className="-mt-3 pl-1 text-xs text-red-300">
                                        {fieldErrors.isHumanChecked[0]}
                                    </p>
                                )}

                            <button
                                type="submit"
                                disabled={!isFormValid || isSubmitting}
                                className={`group flex h-12 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition duration-300 ${
                                    isFormValid && !isSubmitting
                                        ? "bg-white text-black hover:bg-white/90 active:scale-[0.99]"
                                        : "cursor-not-allowed bg-white/30 text-black/45"
                                }`}
                            >
                                <span>
                                    {isSubmitting
                                        ? "Gönderiliyor..."
                                        : t("form.submitButton")}
                                </span>
                                <Send className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5" />
                            </button>
                        </form>
                    </motion.div>

                    <div className="flex h-full flex-col gap-4">
                        <motion.div
                            variants={cardVariants}
                            className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1"
                        >
                            {contactCards.map((item) => {
                                const Icon = item.icon;

                                const content = (
                                    <div className="group flex h-full items-start gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-4 transition duration-300 hover:border-white/15 hover:bg-white/[0.045] sm:p-5">
                                        <div
                                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 ${item.iconBg} ${item.iconColor} transition duration-300`}
                                        >
                                            <Icon className="h-5 w-5" />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-3">
                                                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
                                                    {item.label}
                                                </p>

                                                {item.href && (
                                                    <ArrowUpRight className="h-4 w-4 shrink-0 text-white/25 transition duration-300 group-hover:text-white/60" />
                                                )}
                                            </div>

                                            <h3 className="mt-2 break-words text-sm font-semibold text-white">
                                                {item.title}
                                            </h3>

                                            <p className="mt-1 line-clamp-2 text-sm leading-5 text-white/45">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                );

                                if (item.href) {
                                    return (
                                        <a
                                            key={item.key}
                                            href={item.href}
                                            className="block h-full"
                                        >
                                            {content}
                                        </a>
                                    );
                                }

                                return (
                                    <div key={item.key} className="h-full">
                                        {content}
                                    </div>
                                );
                            })}
                        </motion.div>

                        <motion.div
                            variants={cardVariants}
                            className="flex min-h-[360px] flex-1 flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.035] sm:min-h-[420px] sm:rounded-[1.75rem]"
                        >
                            <div className="flex items-start gap-4 p-4 sm:p-5">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#FACC15]/12 text-[#FACC15]">
                                    <MapPin className="h-5 w-5" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
                                        {t("info.addressLabel")}
                                    </p>

                                    <h3 className="mt-2 text-sm font-semibold leading-6 text-white">
                                        {t("info.addressValue")}
                                    </h3>
                                </div>
                            </div>

                            <div className="relative min-h-[240px] flex-1 border-t border-white/10 bg-black/20 sm:min-h-[320px] lg:min-h-[360px]">
                                <iframe
                                    src="https://maps.google.com/maps?q=G%C3%BCzelyurt%20Mah.%2026065%20sokak%20No:6%20Aksu%20Antalya&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="absolute inset-0 h-full w-full"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}