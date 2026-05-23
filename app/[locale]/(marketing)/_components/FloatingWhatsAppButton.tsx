import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { useTranslations } from "next-intl";

export function FloatingWhatsAppButton() {
    const t = useTranslations("FloatingWhatsAppButton");

    return (
        <Link
            href="https://wa.me/905000000000"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("ariaLabel")}
            className="fixed bottom-6 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/30 transition-transform duration-300 hover:scale-105 md:right-8 md:bottom-8"
        >
            <FaWhatsapp className="h-7 w-7" />
        </Link>
    );
}