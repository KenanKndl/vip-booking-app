import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
<<<<<<< Updated upstream
import { useTranslations } from "next-intl";

export function FloatingWhatsAppButton() {
    const t = useTranslations("FloatingWhatsAppButton");

=======
import { prisma } from "@/lib/prisma";

export async function FloatingWhatsAppButton() {
    // Veritabanından admin ayarlarını çekiyoruz
    const settings = await prisma.adminSettings.findFirst();
    
    // Veritabanında numara varsa onu al, yoksa geçici bir numara kullan
    const rawNumber = settings?.whatsappNumber || "+905000000000";
    
    // WhatsApp linkinin bozulmaması için boşlukları ve gereksiz karakterleri temizliyoruz (sadece rakamlar ve + kalır)
    const cleanNumber = rawNumber.replace(/[^0-9+]/g, '');

>>>>>>> Stashed changes
    return (
        <Link
            href={`https://wa.me/${cleanNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("ariaLabel")}
            className="fixed bottom-6 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/30 transition-transform duration-300 hover:scale-105 md:right-8 md:bottom-8"
        >
            <FaWhatsapp className="h-7 w-7" />
        </Link>
    );
}