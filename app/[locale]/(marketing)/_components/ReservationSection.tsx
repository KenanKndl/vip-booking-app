"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { AnimatePresence, motion, Variants } from "framer-motion";
import {
    MapPin,
    Calendar,
    Clock,
    Users,
    ChevronRight,
    CheckCircle2,
    Baby,
    Check,
    ChevronLeft,
    Users2,
    Search,
    ChevronDown,
    Minus,
    Plus,
    Mail,
    Phone,
    User,
    Route,
    Info,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import {
    allPhoneCountries,
    preferredPhoneCountries,
    type PhoneCountry,
} from "@/lib/phone-countries";

type ReservationSectionProps = {
    dbRoutes: any[];
    exchangeRates: {
        eurToTl: number;
        eurToUsd: number;
    };
};

type SearchSelectProps = {
    label: string;
    icon: React.ElementType;
    value: string;
    placeholder: string;
    options: string[];
    onChange: (value: string) => void;
};

type TripType = "oneWay" | "roundTrip";

type AddonItem = {
    id: string;
    title: string;
    ageRange?: string;
    description: string;
    priceEur: number;
    icon: React.ElementType;
};

type AddonQuantities = Record<string, number>;

const reservationStep3Schema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Ad soyad en az 2 karakter olmalı.")
        .max(80, "Ad soyad çok uzun."),

    phoneDigits: z
        .string()
        .min(7, "Telefon numarası çok kısa.")
        .max(15, "Telefon numarası çok uzun.")
        .regex(/^\d+$/, "Telefon numarası sadece rakamlardan oluşmalı."),

    email: z
        .string()
        .trim()
        .optional()
        .refine(
            (value) => !value || z.string().email().safeParse(value).success,
            {
                message: "Geçerli bir e-posta adresi girin.",
            }
        ),

    pickupAddressDetail: z
        .string()
        .trim()
        .max(160, "Alınacak adres detayı çok uzun.")
        .optional(),

    dropoffAddressDetail: z
        .string()
        .trim()
        .max(160, "Bırakılacak adres detayı çok uzun.")
        .optional(),

    reservationNote: z
        .string()
        .trim()
        .max(1000, "Rezervasyon notu çok uzun.")
        .optional(),
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


const babySeatOptions: AddonItem[] = [
    {
        id: "infant-seat",
        title: "Puset",
        ageRange: "0 - 1 Yaş",
        description: "Yeni doğan ve küçük bebekler için güvenli puset koltuk.",
        priceEur: 8,
        icon: Baby,
    },
    {
        id: "child-seat",
        title: "Bebek Koltuğu",
        ageRange: "1 - 8 Yaş",
        description: "Çocuk yolcular için kemer destekli standart bebek koltuğu.",
        priceEur: 8,
        icon: Baby,
    },
    {
        id: "booster-seat",
        title: "Yükseltici",
        ageRange: "4 - 8 Yaş",
        description: "Daha büyük çocuklar için yükseltici koltuk desteği.",
        priceEur: 8,
        icon: Baby,
    },
];

const vehicleExtraOptions: AddonItem[] = [
    {
        id: "celebration-package",
        title: "Kutlama Paketi",
        description: "Araç içi özel karşılama, küçük süsleme ve kutlama sunumu.",
        priceEur: 60,
        icon: Plus,
    },
    {
        id: "flower",
        title: "Çiçek",
        description: "Araç içerisinde hazır bekleyen çiçek karşılama paketi.",
        priceEur: 25,
        icon: Plus,
    },
    {
        id: "efes-special-50cl",
        title: "Bira (Efes Özel Seri 50cl)",
        description: "Yolculuk başlangıcı için araç içinde soğuk servis edilir.",
        priceEur: 4,
        icon: Plus,
    },
    {
        id: "fruit-plate",
        title: "Meyve Tabağı",
        description: "Araç içinde sunulmak üzere hazırlanmış taze meyve tabağı.",
        priceEur: 12,
        icon: Plus,
    },
    {
        id: "chivas-35cl",
        title: "Viski (Chivas 35cl)",
        description: "Araç içi premium içecek seçeneği olarak eklenir.",
        priceEur: 46,
        icon: Plus,
    },
    {
        id: "vodka-absolute-35cl",
        title: "Vodka (Absolute 35cl)",
        description: "Araç içi premium içecek seçeneği olarak eklenir.",
        priceEur: 38,
        icon: Plus,
    },
    {
        id: "champagne-wine-70cl",
        title: "Şampanya / Şarap (70cl)",
        description: "Özel günler için araç içinde hazır bekleyen içecek seçeneği.",
        priceEur: 34,
        icon: Plus,
    },
    {
        id: "redbull",
        title: "Enerji İçeceği (Redbull)",
        description: "Yolculuk için soğuk enerji içeceği seçeneği.",
        priceEur: 4,
        icon: Plus,
    },
];

const createInitialAddonQuantities = (items: AddonItem[]) =>
    items.reduce<AddonQuantities>((acc, item) => {
        acc[item.id] = 0;
        return acc;
    }, {});

const getSelectedAddonItems = (items: AddonItem[], quantities: AddonQuantities) =>
    items
        .map((item) => ({ ...item, quantity: quantities[item.id] || 0 }))
        .filter((item) => item.quantity > 0);


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
        y: 16,
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

const stepVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 12,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.35,
            ease: "easeOut",
        },
    },
    exit: {
        opacity: 0,
        y: -8,
        transition: {
            duration: 0.2,
            ease: "easeIn",
        },
    },
};

const inputClass =
    "w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none transition duration-200 placeholder:text-white/25 hover:border-white/15 hover:bg-black/25 focus:border-white/30 focus:bg-black/30";

const contactInputClass =
    "h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition duration-200 placeholder:text-white/25 hover:border-white/15 hover:bg-black/25 focus:border-white/30 focus:bg-black/30";

const contactTextareaClass =
    "min-h-[112px] w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm leading-6 text-white outline-none transition duration-200 placeholder:text-white/25 hover:border-white/15 hover:bg-black/25 focus:border-white/30 focus:bg-black/30";

const labelClass =
    "flex items-center gap-2 pl-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/45";

export function ReservationSection({
                                       dbRoutes = [],
                                       exchangeRates,
                                   }: ReservationSectionProps) {
    const t = useTranslations("ReservationSection");

    const [step, setStep] = useState(1);

    const [pickup, setPickup] = useState("");
    const [dropoff, setDropoff] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);

    const [selectedRoute, setSelectedRoute] = useState<any>(null);
    const [selectedPricing, setSelectedPricing] = useState<any>(null);
    const [selectedTripType, setSelectedTripType] =
        useState<TripType>("oneWay");

    const displayCurrency = useCurrencyStore((state) => state.currency);

    const countryDropdownRef = useRef<HTMLDivElement | null>(null);

    const [selectedPhoneCountry, setSelectedPhoneCountry] =
        useState<PhoneCountry>(preferredPhoneCountries[0]);

    const [isPhoneDropdownOpen, setIsPhoneDropdownOpen] = useState(false);
    const [phoneCountrySearch, setPhoneCountrySearch] = useState("");
    const [hasTriedSubmit, setHasTriedSubmit] = useState(false);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [pickupAddressDetail, setPickupAddressDetail] = useState("");
    const [dropoffAddressDetail, setDropoffAddressDetail] = useState("");
    const [reservationNote, setReservationNote] = useState("");
    const [babySeatQuantities, setBabySeatQuantities] = useState<AddonQuantities>(
        () => createInitialAddonQuantities(babySeatOptions)
    );
    const [vehicleExtraQuantities, setVehicleExtraQuantities] =
        useState<AddonQuantities>(() =>
            createInitialAddonQuantities(vehicleExtraOptions)
        );
    const [isBabySeatModalOpen, setIsBabySeatModalOpen] = useState(false);
    const [isVehicleExtraModalOpen, setIsVehicleExtraModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const pickupLocations = useMemo(
        () => Array.from(new Set(dbRoutes.map((r) => r.pickup))).filter(Boolean),
        [dbRoutes]
    ) as string[];

    const dropoffLocations = useMemo(
        () =>
            Array.from(new Set(dbRoutes.map((r) => r.dropoff))).filter(Boolean),
        [dbRoutes]
    ) as string[];

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

    const totalPassengers = adults + children;

    const availablePricings = useMemo(() => {
        if (!selectedRoute) return [];

        return selectedRoute.prices.filter((pricing: any) => {
            const car = pricing.vehicle;
            if (!car.isActive) return false;

            const maxCapacity =
                parseInt(String(car.pax).replace(/[^\d]/g, "")) || 6;

            return totalPassengers <= maxCapacity;
        });
    }, [selectedRoute, totalPassengers]);

    const getTripBasePrice = (pricing: any, tripType: TripType) => {
        if (tripType === "oneWay") return Number(pricing.price);

        return Number(
            pricing.roundTripPrice ??
            pricing.returnPrice ??
            pricing.roundTripPriceEur ??
            Number(pricing.price) * 2
        );
    };

    const getFormattedPrice = (baseEurPrice: number) => {
        if (displayCurrency === "TRY") {
            const calculated = baseEurPrice * exchangeRates.eurToTl;
            return `₺ ${calculated.toFixed(2).replace(/\.00$/, "")}`;
        }

        if (displayCurrency === "USD") {
            const calculated = baseEurPrice * exchangeRates.eurToUsd;
            return `$ ${calculated.toFixed(2).replace(/\.00$/, "")}`;
        }

        return `€ ${baseEurPrice}`;
    };

    const selectedBasePrice = selectedPricing
        ? getTripBasePrice(selectedPricing, selectedTripType)
        : 0;

    const selectedBabySeatItems = useMemo(
        () => getSelectedAddonItems(babySeatOptions, babySeatQuantities),
        [babySeatQuantities]
    );

    const selectedVehicleExtraItems = useMemo(
        () => getSelectedAddonItems(vehicleExtraOptions, vehicleExtraQuantities),
        [vehicleExtraQuantities]
    );

    const babySeatTotalPrice = selectedBabySeatItems.reduce(
        (total, item) => total + item.priceEur * item.quantity,
        0
    );

    const vehicleExtraTotalPrice = selectedVehicleExtraItems.reduce(
        (total, item) => total + item.priceEur * item.quantity,
        0
    );

    const addonTotalPrice = babySeatTotalPrice + vehicleExtraTotalPrice;
    const reservationTotalPrice = selectedBasePrice + addonTotalPrice;

    const totalBabySeatCount = selectedBabySeatItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const totalVehicleExtraCount = selectedVehicleExtraItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const hasBabySeatSelection = totalBabySeatCount > 0;
    const hasVehicleExtraSelection = totalVehicleExtraCount > 0;

    const phoneDigits = getPhoneDigits(phone);

    const reservationValidationResult = reservationStep3Schema.safeParse({
        name,
        phoneDigits,
        email,
        pickupAddressDetail,
        dropoffAddressDetail,
        reservationNote,
    });

    const reservationFieldErrors = reservationValidationResult.success
        ? {}
        : reservationValidationResult.error.flatten().fieldErrors;

    const isReservationFormValid = reservationValidationResult.success;

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

    useEffect(() => {
        const hasOpenModal = isBabySeatModalOpen || isVehicleExtraModalOpen;

        if (!hasOpenModal) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isBabySeatModalOpen, isVehicleExtraModalOpen]);

    const handleSelectPhoneCountry = (country: PhoneCountry) => {
        setSelectedPhoneCountry(country);
        setIsPhoneDropdownOpen(false);
        setPhoneCountrySearch("");
    };

    const handlePhoneChange = (value: string) => {
        setPhone(formatPhoneInput(value));
    };

    const handleAddonQuantityChange = (
        type: "babySeat" | "vehicleExtra",
        id: string,
        value: number
    ) => {
        const safeValue = Math.min(3, Math.max(0, value));
        const setter =
            type === "babySeat"
                ? setBabySeatQuantities
                : setVehicleExtraQuantities;

        setter((prev) => ({
            ...prev,
            [id]: safeValue,
        }));
    };

    const handleFindVehicles = () => {
        if (!pickup || !dropoff || !date || !time) {
            alert(t("alerts.missingFieldsStep1"));
            return;
        }

        const matchedRoute = dbRoutes.find(
            (route) => route.pickup === pickup && route.dropoff === dropoff
        );

        if (!matchedRoute || matchedRoute.prices.length === 0) {
            alert(t("alerts.noRoute"));
            return;
        }

        setSelectedRoute(matchedRoute);
        setSelectedPricing(null);
        setSelectedTripType("oneWay");
        setStep(2);
    };

    const handleSelectVehicle = (pricing: any, tripType: TripType) => {
        setSelectedPricing(pricing);
        setSelectedTripType(tripType);
        setStep(3);
    };

    const handleCompleteReservation = async () => {
        setHasTriedSubmit(true);

        const result = reservationStep3Schema.safeParse({
            name,
            phoneDigits,
            email,
            pickupAddressDetail,
            dropoffAddressDetail,
            reservationNote,
        });

        if (!result.success) {
            return;
        }

        setIsSubmitting(true);

        const finalPrice =
            displayCurrency === "TRY"
                ? reservationTotalPrice * exchangeRates.eurToTl
                : displayCurrency === "USD"
                    ? reservationTotalPrice * exchangeRates.eurToUsd
                    : reservationTotalPrice;

        const finalCurrencySymbol =
            displayCurrency === "TRY"
                ? "₺"
                : displayCurrency === "USD"
                    ? "$"
                    : "€";

        const payload = {
            pickupDateTime: new Date(`${date}T${time}:00`).toISOString(),
            adultCount: String(adults),
            childCount: String(children),
            routeId: selectedRoute.id,
            vehicleId: selectedPricing.vehicle.id,
            customerName: name.trim(),
            customerPhone: `${selectedPhoneCountry.dialCode}${phoneDigits}`,
            customerEmail: email.trim(),
            pickupAddressDetail: pickupAddressDetail.trim(),
            dropoffAddressDetail: dropoffAddressDetail.trim(),
            reservationNote: reservationNote.trim(),
            babySeatSelections: selectedBabySeatItems.map((item) => ({
                id: item.id,
                title: item.title,
                quantity: item.quantity,
                priceEur: item.priceEur,
            })),
            vehicleExtraSelections: selectedVehicleExtraItems.map((item) => ({
                id: item.id,
                title: item.title,
                quantity: item.quantity,
                priceEur: item.priceEur,
            })),
            wantsBabySeat: hasBabySeatSelection,
            wantsExtraInVehicle: hasVehicleExtraSelection,
            addonTotalPriceEur: addonTotalPrice,
            totalPrice: Number(finalPrice.toFixed(2)),
            currency: finalCurrencySymbol,
            tripType: selectedTripType,
        };

        try {
            const response = await fetch("/api/client/reservations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (data.success) {
                alert(t("alerts.success", { pnr: data.data.pnrCode }));
                window.location.reload();
            } else {
                alert(data.error || t("alerts.error"));
            }
        } catch (error) {
            alert(t("alerts.networkError"));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section
            id="booking"
            className="min-h-screen bg-[#0d0d0d] px-5 pb-20 pt-14 text-white sm:px-6 lg:px-8 lg:pb-28 lg:pt-20"
        >
            <motion.div
                variants={pageVariants}
                initial="hidden"
                animate="visible"
                className="mx-auto max-w-6xl"
            >
                <motion.div variants={fadeUpVariants} className="max-w-3xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/35">
                        Rezervasyon
                    </p>

                    <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                        Transferinizi{" "}
                        <span className="text-white/45">planlayın.</span>
                    </h1>

                    <p className="mt-5 max-w-2xl text-sm leading-7 text-white/45 sm:text-base">
                        Güzergahınızı, yolcu bilgilerinizi ve araç seçiminizi
                        birkaç adımda tamamlayın.
                    </p>
                </motion.div>

                <motion.div
                    variants={fadeUpVariants}
                    className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.035] p-4 sm:p-5 lg:p-6"
                >
                    <StepHeader step={step} t={t} />

                    <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-black/20 p-5 sm:p-6 lg:p-8">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    variants={stepVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="grid gap-8"
                                >
                                    <div>
                                        <h2 className="text-2xl font-semibold tracking-tight text-white">
                                            {t("step1.title")}
                                        </h2>
                                        <p className="mt-2 text-sm leading-6 text-white/45">
                                            Alış ve varış noktalarınızı seçerek
                                            uygun araçları görüntüleyin.
                                        </p>
                                    </div>

                                    <div className="grid gap-5 md:grid-cols-2">
                                        <SearchSelect
                                            label={t("step1.fromLabel")}
                                            icon={MapPin}
                                            value={pickup}
                                            placeholder={t(
                                                "step1.fromPlaceholder"
                                            )}
                                            options={pickupLocations}
                                            onChange={setPickup}
                                        />

                                        <SearchSelect
                                            label={t("step1.toLabel")}
                                            icon={MapPin}
                                            value={dropoff}
                                            placeholder={t(
                                                "step1.toPlaceholder"
                                            )}
                                            options={dropoffLocations}
                                            onChange={setDropoff}
                                        />
                                    </div>

                                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                                        <div className="grid gap-2">
                                            <label className={labelClass}>
                                                <Calendar className="h-3.5 w-3.5" />
                                                {t("step1.dateLabel")}
                                            </label>

                                            <input
                                                type="date"
                                                value={date}
                                                onChange={(e) =>
                                                    setDate(e.target.value)
                                                }
                                                className={`${inputClass} [color-scheme:dark]`}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <label className={labelClass}>
                                                <Clock className="h-3.5 w-3.5" />
                                                {t("step1.timeLabel")}
                                            </label>

                                            <input
                                                type="time"
                                                value={time}
                                                onChange={(e) =>
                                                    setTime(e.target.value)
                                                }
                                                className={`${inputClass} [color-scheme:dark]`}
                                            />
                                        </div>

                                        <PassengerCounter
                                            label={t("step1.adultsLabel")}
                                            icon={Users}
                                            value={adults}
                                            min={1}
                                            max={16}
                                            helperText="12 yaş ve üzeri"
                                            onChange={setAdults}
                                        />

                                        <PassengerCounter
                                            label={t("step1.childrenLabel")}
                                            icon={Baby}
                                            value={children}
                                            min={0}
                                            max={6}
                                            helperText="0 - 11 yaş"
                                            onChange={setChildren}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                                            <Users className="h-4 w-4 text-[#C084FC]" />
                                            <p className="text-sm text-white/45">
                                                Toplam yolcu:{" "}
                                                <span className="font-semibold text-[#C084FC]">
                                                    {totalPassengers}
                                                </span>
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleFindVehicles}
                                            className="group flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-black transition duration-300 hover:bg-white/90 active:scale-[0.99]"
                                        >
                                            {t("step1.findButton")}
                                            <ChevronRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && selectedRoute && (
                                <motion.div
                                    key="step2"
                                    variants={stepVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="grid gap-8"
                                >
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <h2 className="text-2xl font-semibold tracking-tight text-white">
                                                {t("step2.title")}
                                            </h2>

                                            <p className="mt-2 text-sm leading-6 text-white/45">
                                                {pickup} → {dropoff} ·{" "}
                                                {totalPassengers}{" "}
                                                {t("step2.passengerSuffix")}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="flex h-10 w-fit items-center gap-2 px-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/55 transition hover:text-white"
                                        >
                                            <ChevronLeft className="h-3.5 w-3.5" />
                                            {t("step2.goBack")}
                                        </button>
                                    </div>

                                    <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#FACC15]/20 bg-[#FACC15]/10 text-[#FACC15]">
                                                <Info className="h-4 w-4" />
                                            </div>

                                            <div>
                                                <p className="text-sm font-semibold text-white">
                                                    Fiyatlar yolculuğun toplam
                                                    ücretidir.
                                                </p>
                                                <p className="mt-1 text-sm leading-6 text-white/45">
                                                    Gösterilen tutarlar kişi
                                                    başı değildir. Seçtiğiniz
                                                    araç ve güzergah için toplam
                                                    transfer ücretini ifade eder.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {availablePricings.length > 0 ? (
                                        <div className="grid gap-5">
                                            {availablePricings.map(
                                                (pricing: any) => {
                                                    const car = pricing.vehicle;
                                                    const oneWayPrice =
                                                        getTripBasePrice(
                                                            pricing,
                                                            "oneWay"
                                                        );
                                                    const roundTripPrice =
                                                        getTripBasePrice(
                                                            pricing,
                                                            "roundTrip"
                                                        );

                                                    return (
                                                        <VehicleCard
                                                            key={pricing.id}
                                                            pricing={pricing}
                                                            car={car}
                                                            oneWayPrice={getFormattedPrice(
                                                                oneWayPrice
                                                            )}
                                                            roundTripPrice={getFormattedPrice(
                                                                roundTripPrice
                                                            )}
                                                            t={t}
                                                            onSelect={(
                                                                tripType
                                                            ) =>
                                                                handleSelectVehicle(
                                                                    pricing,
                                                                    tripType
                                                                )
                                                            }
                                                        />
                                                    );
                                                }
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.025] px-6 text-center">
                                            <Users2 className="h-11 w-11 text-white/20" />
                                            <h3 className="mt-5 text-xl font-semibold text-white">
                                                {t("step2.capacityErrorTitle")}
                                            </h3>
                                            <p className="mt-2 max-w-md text-sm leading-6 text-white/45">
                                                {t("step2.capacityErrorDesc", {
                                                    total: totalPassengers,
                                                })}
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {step === 3 && selectedPricing && (
                                <motion.div
                                    key="step3"
                                    variants={stepVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="grid gap-6"
                                >
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <h2 className="text-2xl font-semibold tracking-tight text-white">
                                                {t("step3.title")}
                                            </h2>
                                            <p className="mt-2 text-sm leading-6 text-white/45">
                                                Rezervasyonu tamamlamak için
                                                iletişim bilgilerinizi girin.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setStep(2)}
                                            className="flex h-10 w-fit items-center gap-2 px-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/55 transition hover:text-white"
                                        >
                                            <ChevronLeft className="h-3.5 w-3.5" />
                                            {t("step3.goBack")}
                                        </button>
                                    </div>

                                    <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
                                        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                                            <div className="grid gap-4">
                                                <div className="grid gap-2">
                                                    <label className={labelClass}>
                                                        <User className="h-3.5 w-3.5" />
                                                        {t("step3.contactInfoTitle")}
                                                    </label>

                                                    <input
                                                        type="text"
                                                        value={name}
                                                        onChange={(e) =>
                                                            setName(e.target.value)
                                                        }
                                                        placeholder={t(
                                                            "step3.namePlaceholder"
                                                        )}
                                                        autoComplete="name"
                                                        className={`${contactInputClass} ${
                                                            hasTriedSubmit &&
                                                            reservationFieldErrors.name
                                                                ? "border-red-400/50 focus:border-red-400/60"
                                                                : ""
                                                        }`}
                                                    />

                                                    {hasTriedSubmit &&
                                                        reservationFieldErrors.name?.[0] && (
                                                            <p className="pl-1 text-xs text-red-300">
                                                                {reservationFieldErrors.name[0]}
                                                            </p>
                                                        )}
                                                </div>

                                                <div className="grid gap-2">
                                                    <label className={labelClass}>
                                                        <Phone className="h-3.5 w-3.5" />
                                                        Telefon
                                                    </label>

                                                    <div
                                                        className="relative"
                                                        ref={countryDropdownRef}
                                                    >
                                                        <div
                                                            className={`flex overflow-hidden rounded-2xl border bg-black/20 transition duration-200 hover:bg-black/25 focus-within:bg-black/30 ${
                                                                hasTriedSubmit &&
                                                                reservationFieldErrors.phoneDigits
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
                                                                className="flex min-w-[126px] items-center justify-center gap-2 border-r border-white/10 px-4 py-3.5 text-sm font-semibold text-white/70 outline-none transition hover:bg-white/[0.04] hover:text-white"
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
                                                                value={phone}
                                                                onChange={(e) =>
                                                                    handlePhoneChange(
                                                                        e.target.value
                                                                    )
                                                                }
                                                                placeholder={t(
                                                                    "step3.phonePlaceholder"
                                                                )}
                                                                inputMode="numeric"
                                                                autoComplete="tel"
                                                                className="w-full bg-transparent px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/25"
                                                            />
                                                        </div>

                                                        {isPhoneDropdownOpen && (
                                                            <div className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#111111] sm:w-[360px]">
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

                                                                <div className="max-h-[320px] overflow-y-auto p-1.5">
                                                                    {!hasCountryResults && (
                                                                        <div className="px-4 py-8 text-center text-sm text-white/40">
                                                                            Ülke bulunamadı.
                                                                        </div>
                                                                    )}

                                                                    {filteredPreferredCountries.length > 0 && (
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
                                                                                                key={country.code}
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
                                                                                                        {country.label}
                                                                                                    </p>

                                                                                                    <p className="text-xs text-white/40">
                                                                                                        {country.code}{" "}
                                                                                                        {country.dialCode}
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

                                                                    {filteredPreferredCountries.length > 0 &&
                                                                        filteredOtherCountries.length > 0 && (
                                                                            <div className="my-1 h-px bg-white/10" />
                                                                        )}

                                                                    {filteredOtherCountries.length > 0 && (
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
                                                                                                key={country.code}
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
                                                                                                        {country.label}
                                                                                                    </p>

                                                                                                    <p className="text-xs text-white/40">
                                                                                                        {country.code}{" "}
                                                                                                        {country.dialCode}
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
                                                        reservationFieldErrors.phoneDigits?.[0] && (
                                                            <p className="pl-1 text-xs text-red-300">
                                                                {reservationFieldErrors.phoneDigits[0]}
                                                            </p>
                                                        )}
                                                </div>

                                                <div className="grid gap-2">
                                                    <label className={labelClass}>
                                                        <Mail className="h-3.5 w-3.5" />
                                                        E-posta
                                                    </label>

                                                    <input
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) =>
                                                            setEmail(e.target.value)
                                                        }
                                                        placeholder={t(
                                                            "step3.emailPlaceholder"
                                                        )}
                                                        autoComplete="email"
                                                        className={`${contactInputClass} ${
                                                            hasTriedSubmit &&
                                                            reservationFieldErrors.email
                                                                ? "border-red-400/50 focus:border-red-400/60"
                                                                : ""
                                                        }`}
                                                    />

                                                    {hasTriedSubmit &&
                                                        reservationFieldErrors.email?.[0] && (
                                                            <p className="pl-1 text-xs text-red-300">
                                                                {reservationFieldErrors.email[0]}
                                                            </p>
                                                        )}
                                                </div>
                                            </div>

                                            <div className="mt-6 border-t border-white/10 pt-5">
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="h-2 w-2 rounded-full bg-[#22D3EE]" />
                                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                                                            Transfer detayı
                                                        </p>
                                                    </div>

                                                    <span className="hidden text-xs font-medium text-white/30 sm:inline">
            Opsiyonel bilgiler
        </span>
                                                </div>

                                                <div className="mt-4 grid gap-3 md:grid-cols-2">
                                                    <div className="grid gap-2">
                                                        <label className="pl-1 text-xs font-medium text-white/45">
                                                            Alınacak adres / hotel adı
                                                        </label>

                                                        <input
                                                            type="text"
                                                            value={pickupAddressDetail}
                                                            onChange={(e) =>
                                                                setPickupAddressDetail(e.target.value)
                                                            }
                                                            placeholder="Otel, lobi, blok veya kapı no"
                                                            className={`${contactInputClass} ${
                                                                hasTriedSubmit &&
                                                                reservationFieldErrors.pickupAddressDetail
                                                                    ? "border-red-400/50 focus:border-red-400/60"
                                                                    : ""
                                                            }`}
                                                        />

                                                        {hasTriedSubmit &&
                                                            reservationFieldErrors.pickupAddressDetail?.[0] && (
                                                                <p className="pl-1 text-xs text-red-300">
                                                                    {reservationFieldErrors.pickupAddressDetail[0]}
                                                                </p>
                                                            )}
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <label className="pl-1 text-xs font-medium text-white/45">
                                                            Bırakılacak adres / hotel adı
                                                        </label>

                                                        <input
                                                            type="text"
                                                            value={dropoffAddressDetail}
                                                            onChange={(e) =>
                                                                setDropoffAddressDetail(e.target.value)
                                                            }
                                                            placeholder="Otel, terminal, villa veya adres"
                                                            className={`${contactInputClass} ${
                                                                hasTriedSubmit &&
                                                                reservationFieldErrors.dropoffAddressDetail
                                                                    ? "border-red-400/50 focus:border-red-400/60"
                                                                    : ""
                                                            }`}
                                                        />

                                                        {hasTriedSubmit &&
                                                            reservationFieldErrors.dropoffAddressDetail?.[0] && (
                                                                <p className="pl-1 text-xs text-red-300">
                                                                    {reservationFieldErrors.dropoffAddressDetail[0]}
                                                                </p>
                                                            )}
                                                    </div>
                                                </div>

                                                <div className="mt-3 grid gap-2">
                                                    <label className="pl-1 text-xs font-medium text-white/45">
                                                        Rezervasyon notu
                                                    </label>

                                                    <textarea
                                                        value={reservationNote}
                                                        onChange={(e) =>
                                                            setReservationNote(e.target.value)
                                                        }
                                                        placeholder="Uçuş numarası, özel karşılama notu veya ek talebinizi yazabilirsiniz."
                                                        className={`min-h-[96px] w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm leading-6 text-white outline-none transition duration-200 placeholder:text-white/25 hover:border-white/15 hover:bg-black/25 focus:border-white/30 focus:bg-black/30 ${
                                                            hasTriedSubmit &&
                                                            reservationFieldErrors.reservationNote
                                                                ? "border-red-400/50 focus:border-red-400/60"
                                                                : ""
                                                        }`}
                                                    />

                                                    <div className="flex items-center justify-between gap-3 pl-1">
                                                        {hasTriedSubmit &&
                                                        reservationFieldErrors.reservationNote?.[0] ? (
                                                            <p className="text-xs text-red-300">
                                                                {reservationFieldErrors.reservationNote[0]}
                                                            </p>
                                                        ) : (
                                                            <p className="text-xs text-white/30">
                                                                Maksimum 1000 karakter.
                                                            </p>
                                                        )}

                                                        <p className="text-xs text-white/25">
                                                            {reservationNote.trim().length}/1000
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-6 border-t border-white/10 pt-6">
                                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                                                    Ek talepler
                                                </p>
                                                <p className="mt-2 text-sm leading-6 text-white/45">
                                                    İsterseniz rezervasyonunuza
                                                    birkaç ek not bırakın.
                                                </p>

                                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                                    <AddonToggle
                                                        icon={Baby}
                                                        tone="purple"
                                                        title="Bebek koltuğu istiyorum"
                                                        description={
                                                            hasBabySeatSelection
                                                                ? `${totalBabySeatCount} adet seçildi · ${getFormattedPrice(
                                                                    babySeatTotalPrice
                                                                )}`
                                                                : "Puset, bebek koltuğu veya yükseltici seçin"
                                                        }
                                                        active={hasBabySeatSelection}
                                                        onClick={() =>
                                                            setIsBabySeatModalOpen(true)
                                                        }
                                                    />

                                                    <AddonToggle
                                                        icon={Plus}
                                                        tone="yellow"
                                                        title="Araç içinde ekstra istiyorum"
                                                        description={
                                                            hasVehicleExtraSelection
                                                                ? `${totalVehicleExtraCount} ekstra seçildi · ${getFormattedPrice(
                                                                    vehicleExtraTotalPrice
                                                                )}`
                                                                : "Kutlama, çiçek veya içecek paketi seçin"
                                                        }
                                                        active={hasVehicleExtraSelection}
                                                        onClick={() =>
                                                            setIsVehicleExtraModalOpen(true)
                                                        }
                                                    />
                                                </div>
                                            </div>

                                        </div>

                                        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5 sm:p-6 lg:sticky lg:top-6">
                                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                                                {t("step3.summaryTitle")}
                                            </p>

                                            <div className="mt-5 grid gap-4">
                                                <SummaryRow
                                                    label="Araç"
                                                    value={
                                                        selectedPricing.vehicle
                                                            .name
                                                    }
                                                />
                                                <SummaryRow
                                                    label="Güzergah"
                                                    value={`${pickup} → ${dropoff}`}
                                                />
                                                <SummaryRow
                                                    label="Yolculuk tipi"
                                                    value={
                                                        selectedTripType ===
                                                        "oneWay"
                                                            ? "Tek yön"
                                                            : "Gidiş dönüş"
                                                    }
                                                />
                                                <SummaryRow
                                                    label="Tarih"
                                                    value={`${date} · ${time}`}
                                                />
                                                <SummaryRow
                                                    label="Yolcu"
                                                    value={`${totalPassengers}`}
                                                />
                                            </div>

                                            {(pickupAddressDetail ||
                                                dropoffAddressDetail ||
                                                reservationNote) && (
                                                <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                                                        Transfer detayı
                                                    </p>
                                                    <div className="mt-3 grid gap-3">
                                                        {pickupAddressDetail && (
                                                            <SummaryRow
                                                                label="Alınacak yer"
                                                                value={pickupAddressDetail}
                                                            />
                                                        )}
                                                        {dropoffAddressDetail && (
                                                            <SummaryRow
                                                                label="Bırakılacak yer"
                                                                value={dropoffAddressDetail}
                                                            />
                                                        )}
                                                        {reservationNote && (
                                                            <SummaryRow
                                                                label="Not"
                                                                value={reservationNote}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {(hasBabySeatSelection ||
                                                hasVehicleExtraSelection) && (
                                                <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                                                        Ek talepler
                                                    </p>
                                                    <div className="mt-3 grid gap-3">
                                                        {selectedBabySeatItems.map((item) => (
                                                            <SummaryRow
                                                                key={item.id}
                                                                label={`${item.quantity} x ${item.title}`}
                                                                value={getFormattedPrice(
                                                                    item.priceEur * item.quantity
                                                                )}
                                                            />
                                                        ))}
                                                        {selectedVehicleExtraItems.map((item) => (
                                                            <SummaryRow
                                                                key={item.id}
                                                                label={`${item.quantity} x ${item.title}`}
                                                                value={getFormattedPrice(
                                                                    item.priceEur * item.quantity
                                                                )}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                                                    Toplam yolculuk ücreti
                                                </p>
                                                <p className="mt-1 text-3xl font-semibold tracking-tight text-[#FACC15]">
                                                    {getFormattedPrice(
                                                        reservationTotalPrice
                                                    )}
                                                </p>
                                                <p className="mt-2 text-xs leading-5 text-white/40">
                                                    Bu tutara seçili araç, yolculuk tipi
                                                    ve varsa ek talepler dahildir.
                                                </p>
                                            </div>

                                            <div className="mt-6 border-t border-white/10 pt-6 pb-1">
                                                <p className="mb-4 text-sm leading-6 text-white/40">
                                                    Bilgilerinizi kontrol edip rezervasyonunuzu tek adımda tamamlayabilirsiniz.
                                                </p>

                                                <button
                                                    type="button"
                                                    disabled={!isReservationFormValid || isSubmitting}
                                                    onClick={handleCompleteReservation}
                                                    className={`group inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition duration-300 ${
                                                        isReservationFormValid && !isSubmitting
                                                            ? "bg-white text-black hover:bg-white/90 active:scale-[0.99]"
                                                            : "cursor-not-allowed bg-white/30 text-black/45"
                                                    }`}
                                                >
                                                    {isSubmitting
                                                        ? t("step3.loadingButton")
                                                        : t("step3.submitButton")}
                                                    <CheckCircle2 className="h-4 w-4 transition duration-300 group-hover:scale-105" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </motion.div>

            <AddonSelectionModal
                isOpen={isBabySeatModalOpen}
                title="Bebek koltuğu seçimi"
                description="Her seçenekten en fazla 3 adet ekleyebilirsiniz. Seçimler toplam ücrete otomatik eklenir."
                items={babySeatOptions}
                quantities={babySeatQuantities}
                getFormattedPrice={getFormattedPrice}
                onQuantityChange={(id, value) =>
                    handleAddonQuantityChange("babySeat", id, value)
                }
                onClose={() => setIsBabySeatModalOpen(false)}
            />

            <AddonSelectionModal
                isOpen={isVehicleExtraModalOpen}
                title="Araç içi ekstra seçimi"
                description="Yolculuk deneyimini kişiselleştirmek için mock ekstra paketlerden seçim yapabilirsiniz."
                items={vehicleExtraOptions}
                quantities={vehicleExtraQuantities}
                getFormattedPrice={getFormattedPrice}
                onQuantityChange={(id, value) =>
                    handleAddonQuantityChange("vehicleExtra", id, value)
                }
                onClose={() => setIsVehicleExtraModalOpen(false)}
            />
        </section>
    );
}

function StepHeader({ step, t }: { step: number; t: any }) {
    const steps = [
        { number: 1, label: t("steps.step1") },
        { number: 2, label: t("steps.step2") },
        { number: 3, label: t("steps.step3") },
    ];

    return (
        <div className="grid gap-3 sm:grid-cols-3">
            {steps.map((item) => {
                const isActive = step === item.number;
                const isCompleted = step > item.number;

                return (
                    <div
                        key={item.number}
                        className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition duration-300 ${
                            isActive
                                ? "border-white/20 bg-white/[0.06]"
                                : isCompleted
                                    ? "border-white/10 bg-white/[0.035]"
                                    : "border-white/10 bg-black/20"
                        }`}
                    >
                        <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition duration-300 ${
                                isCompleted
                                    ? "border-[#22D3EE] bg-[#22D3EE] text-black"
                                    : isActive
                                        ? "border-[#22D3EE]/35 bg-[#22D3EE]/10 text-[#22D3EE]"
                                        : "border-white/10 bg-black/20 text-white/35"
                            }`}
                        >
                            {isCompleted ? (
                                <Check className="h-4 w-4" />
                            ) : (
                                item.number
                            )}
                        </div>

                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
                                Adım {item.number}
                            </p>
                            <p
                                className={`mt-0.5 text-sm font-medium ${
                                    isActive || isCompleted
                                        ? "text-white"
                                        : "text-white/45"
                                }`}
                            >
                                {item.label}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function SearchSelect({
                          label,
                          icon: Icon,
                          value,
                          placeholder,
                          options,
                          onChange,
                      }: SearchSelectProps) {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");

    const filteredOptions = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) return options;

        return options.filter((option) =>
            option.toLowerCase().includes(query)
        );
    }, [options, search]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option: string) => {
        onChange(option);
        setSearch("");
        setIsOpen(false);
    };

    return (
        <div ref={wrapperRef} className="relative grid gap-2">
            <label className={labelClass}>
                <Icon className="h-3.5 w-3.5" />
                {label}
            </label>

            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className={`flex h-[50px] w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 text-left text-sm outline-none transition duration-200 hover:border-white/15 hover:bg-black/25 ${
                    value ? "text-white" : "text-white/30"
                }`}
            >
                <span className="truncate">{value || placeholder}</span>
                <ChevronDown
                    className={`h-4 w-4 shrink-0 text-white/35 transition duration-200 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            {isOpen && (
                <div className="absolute left-0 top-[calc(100%+0.5rem)] z-40 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#111111]">
                    <div className="border-b border-white/10 p-2">
                        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-3">
                            <Search className="h-4 w-4 text-[#22D3EE]/70" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Ara..."
                                className="h-10 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="max-h-[260px] overflow-y-auto p-1.5">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => {
                                const isActive = value === option;

                                return (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => handleSelect(option)}
                                        className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-white transition hover:bg-white/10"
                                    >
                                        <span className="truncate">
                                            {option}
                                        </span>

                                        {isActive && (
                                            <Check className="h-4 w-4 shrink-0 text-[#22D3EE]" />
                                        )}
                                    </button>
                                );
                            })
                        ) : (
                            <div className="px-4 py-8 text-center text-sm text-white/40">
                                Sonuç bulunamadı.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function PassengerCounter({
                              label,
                              icon: Icon,
                              value,
                              min,
                              max,
                              helperText,
                              onChange,
                          }: {
    label: string;
    icon: React.ElementType;
    value: number;
    min: number;
    max: number;
    helperText: string;
    onChange: (value: number) => void;
}) {
    const decrease = () => onChange(Math.max(min, value - 1));
    const increase = () => onChange(Math.min(max, value + 1));

    return (
        <div className="grid gap-2">
            <label className="flex items-center justify-between gap-3 pl-1">
                <span className="flex min-w-0 items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{label}</span>
                </span>

                <span className="shrink-0 text-[10px] font-medium normal-case tracking-normal text-white/35">
                    {helperText}
                </span>
            </label>

            <div className="flex h-[50px] items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-2">
                <button
                    type="button"
                    onClick={decrease}
                    disabled={value <= min}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-white/55 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
                >
                    <Minus className="h-4 w-4" />
                </button>

                <p className="text-base font-semibold leading-none text-white">
                    {value}
                </p>

                <button
                    type="button"
                    onClick={increase}
                    disabled={value >= max}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-white/55 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
                >
                    <Plus className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

function VehicleCard({
                         pricing,
                         car,
                         oneWayPrice,
                         roundTripPrice,
                         t,
                         onSelect,
                     }: {
    pricing: any;
    car: any;
    oneWayPrice: string;
    roundTripPrice: string;
    t: any;
    onSelect: (tripType: TripType) => void;
}) {
    return (
        <article className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.03] transition duration-300 hover:border-white/15 hover:bg-white/[0.045] lg:grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative min-h-[230px] overflow-hidden bg-black/30 lg:min-h-[320px]">
                {car.imageUrl ? (
                    <img
                        src={car.imageUrl}
                        alt={car.name}
                        className="h-full w-full object-cover opacity-90 transition duration-500 hover:scale-[1.02]"
                    />
                ) : (
                    <div className="flex h-full min-h-[230px] items-center justify-center text-sm text-white/35">
                        Görsel yok
                    </div>
                )}

                <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                    {car.pax} {t("step2.paxSuffix")}
                </div>
            </div>

            <div className="flex flex-col justify-between gap-8 p-5 sm:p-6">
                <div>
                    <h3 className="text-2xl font-semibold tracking-tight text-white">
                        {car.name}
                    </h3>

                    <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-medium text-white/50">
                            {car.pax} {t("step2.paxSuffix")}
                        </span>
                        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-medium text-white/50">
                            {car.luggage} {t("step2.luggageSuffix")}
                        </span>
                    </div>

                    {Array.isArray(car.features) && car.features.length > 0 && (
                        <div className="mt-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                                {t("step2.featuresLabel")}
                            </p>

                            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                                {car.features.map(
                                    (feature: string, index: number) => (
                                        <li
                                            key={`${pricing.id}-${index}`}
                                            className="flex items-start gap-3 text-sm leading-5 text-white/55"
                                        >
                                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                                                <Check className="h-3 w-3 text-white/70" />
                                            </span>
                                            <span>{feature}</span>
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="border-t border-white/10 pt-5">
                    <div className="mb-4 flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-3">
                        <Route className="mt-0.5 h-4 w-4 shrink-0 text-[#22D3EE]" />
                        <p className="text-xs leading-5 text-white/45">
                            Aşağıdaki fiyatlar kişi başı değil, seçilen araç
                            için toplam yolculuk ücretidir.
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <TripPriceOption
                            title="Tek yön"
                            description="Sadece seçilen güzergah"
                            price={oneWayPrice}
                            onClick={() => onSelect("oneWay")}
                        />

                        <TripPriceOption
                            title="Gidiş dönüş"
                            description="Gidiş ve dönüş toplamı"
                            price={roundTripPrice}
                            onClick={() => onSelect("roundTrip")}
                        />
                    </div>
                </div>
            </div>
        </article>
    );
}

function TripPriceOption({
                             title,
                             description,
                             price,
                             onClick,
                         }: {
    title: string;
    description: string;
    price: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-left transition duration-300 hover:border-white/20 hover:bg-white/[0.06] active:scale-[0.99]"
        >
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="mt-1 text-xs leading-5 text-white/40">
                        {description}
                    </p>
                </div>

                <ChevronRight className="h-4 w-4 shrink-0 text-white/30 transition duration-300 group-hover:translate-x-0.5 group-hover:text-white/70" />
            </div>

            <p className="mt-5 text-2xl font-semibold tracking-tight text-white">
                {price}
            </p>

            <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white/30">
                Toplam ücret
            </p>
        </button>
    );
}

function AddonSelectionModal({
                                 isOpen,
                                 title,
                                 description,
                                 items,
                                 quantities,
                                 getFormattedPrice,
                                 onQuantityChange,
                                 onClose,
                             }: {
    isOpen: boolean;
    title: string;
    description: string;
    items: AddonItem[];
    quantities: AddonQuantities;
    getFormattedPrice: (baseEurPrice: number) => string;
    onQuantityChange: (id: string, value: number) => void;
    onClose: () => void;
}) {
    const selectedItems = useMemo(
        () => getSelectedAddonItems(items, quantities),
        [items, quantities]
    );

    const totalCount = selectedItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const totalPrice = selectedItems.reduce(
        (total, item) => total + item.priceEur * item.quantity,
        0
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 px-4 py-5 backdrop-blur-sm sm:items-center sm:py-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onMouseDown={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 28, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 18, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        onMouseDown={(event) => event.stopPropagation()}
                        className="w-full max-w-4xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#121212]"
                    >
                        <div className="flex items-start justify-between gap-5 border-b border-white/10 bg-white/[0.035] p-5 sm:p-6">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                                    Ek talep
                                </p>
                                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                                    {title}
                                </h3>
                                <p className="mt-2 max-w-xl text-sm leading-6 text-white/45">
                                    {description}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/20 text-xl leading-none text-white/55 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                                aria-label="Kapat"
                            >
                                ×
                            </button>
                        </div>

                        <div className="max-h-[min(62vh,540px)] overflow-y-auto p-5 sm:p-6">
                            <div className="grid gap-3 md:grid-cols-2">
                                {items.map((item) => {
                                    const quantity = quantities[item.id] || 0;
                                    const Icon = item.icon;

                                    return (
                                        <div
                                            key={item.id}
                                            className={`rounded-2xl border p-4 transition duration-200 ${
                                                quantity > 0
                                                    ? "border-white/20 bg-white/[0.06]"
                                                    : "border-white/10 bg-black/20"
                                            }`}
                                        >
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                <div className="flex items-start gap-4">
                                                    <div
                                                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${
                                                            quantity > 0
                                                                ? "border-[#C084FC]/25 bg-[#C084FC]/10 text-[#C084FC]"
                                                                : "border-white/10 bg-white/[0.04] text-white/65"
                                                        }`}
                                                    >
                                                        <Icon className="h-5 w-5" />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <p className="text-base font-semibold text-white">
                                                                {item.title}
                                                            </p>
                                                            {item.ageRange && (
                                                                <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[11px] font-semibold text-white/45">
                                                                    {item.ageRange}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="mt-1 text-sm leading-6 text-white/45">
                                                            {item.description}
                                                        </p>
                                                        <p className="mt-2 text-sm font-semibold text-white/80">
                                                            {getFormattedPrice(item.priceEur)}
                                                            <span className="ml-1 font-normal text-white/35">
                                                                / adet
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex h-11 w-full items-center justify-between rounded-full border border-white/10 bg-black/25 px-2 sm:w-[150px]">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onQuantityChange(
                                                                item.id,
                                                                quantity - 1
                                                            )
                                                        }
                                                        disabled={quantity <= 0}
                                                        className="flex h-8 w-8 items-center justify-center rounded-full text-white/55 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </button>

                                                    <span className="min-w-10 text-center text-sm font-semibold text-white">
                                                        {quantity}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onQuantityChange(
                                                                item.id,
                                                                quantity + 1
                                                            )
                                                        }
                                                        disabled={quantity >= 3}
                                                        className="flex h-8 w-8 items-center justify-center rounded-full text-white/55 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="border-t border-white/10 bg-white/[0.025] p-5 sm:p-6">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                                        Modal toplamı
                                    </p>
                                    <p className="mt-1 text-2xl font-semibold tracking-tight text-[#FACC15]">
                                        {getFormattedPrice(totalPrice)}
                                    </p>
                                    <p className="mt-1 text-xs text-white/35">
                                        {totalCount} adet seçim
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="inline-flex h-12 w-full items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90 active:scale-[0.99] sm:w-auto sm:min-w-[180px]"
                                >
                                    Seçimi onayla
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function AddonToggle({
                         icon: Icon,
                         tone = "cyan",
                         title,
                         description,
                         active,
                         onClick,
                     }: {
    icon: React.ElementType;
    tone?: "cyan" | "purple" | "yellow";
    title: string;
    description: string;
    active: boolean;
    onClick: () => void;
}) {
    const toneClass = {
        cyan: {
            icon: "border-[#22D3EE]/20 bg-[#22D3EE]/10 text-[#22D3EE]",
            active: "border-[#22D3EE]/30 bg-[#22D3EE]/10",
        },
        purple: {
            icon: "border-[#C084FC]/20 bg-[#C084FC]/10 text-[#C084FC]",
            active: "border-[#C084FC]/30 bg-[#C084FC]/10",
        },
        yellow: {
            icon: "border-[#FACC15]/20 bg-[#FACC15]/12 text-[#FACC15]",
            active: "border-[#FACC15]/30 bg-[#FACC15]/10",
        },
    }[tone];

    return (
        <button
            type="button"
            onClick={onClick}
            className={`rounded-2xl border p-4 text-left transition duration-300 ${
                active
                    ? toneClass.active
                    : "border-white/10 bg-black/20 hover:border-white/15 hover:bg-white/[0.04]"
            }`}
        >
            <div className="flex items-start gap-3">
                <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                        active
                            ? toneClass.icon
                            : "border-white/10 bg-white/[0.04] text-white/70"
                    }`}
                >
                    <Icon className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="mt-1 text-xs leading-5 text-white/40">
                        {description}
                    </p>
                </div>
            </div>
        </button>
    );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3 last:border-b-0 last:pb-0">
            <span className="text-sm text-white/40">{label}</span>
            <span className="text-right text-sm font-medium text-white">
                {value}
            </span>
        </div>
    );
}