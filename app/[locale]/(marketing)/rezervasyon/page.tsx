import { ReservationSection } from "../_components/ReservationSection";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "ReservationPage" });

    return {
        title: t("title"),
        description: t("description"),
    };
}

export const dynamic = "force-dynamic";

export default async function RezervasyonPage() {
    // YENİ: Sadece isActive: true olan aktif rotaları çekiyoruz
    const routes = await prisma.route.findMany({
        where: { isActive: true }, 
        include: {
            prices: {
                include: {
                    vehicle: true
                }
            }
        }
    });

    // Veritabanından kurları çekiyoruz
    const settings = await prisma.adminSettings.findFirst();
    
    const exchangeRates = {
        eurToTl: settings ? Number(settings.eurToTl) : 35.0,
        eurToUsd: settings ? Number(settings.eurToUsd) : 1.08,
    };

    return (
        <main className="min-h-screen bg-[#0d0d0d] pt-20">
            <ReservationSection dbRoutes={routes} exchangeRates={exchangeRates} />
        </main>
    );
}