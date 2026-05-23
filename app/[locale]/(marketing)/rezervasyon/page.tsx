import { ReservationSection } from "../_components/ReservationSection";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";

// Next.js App Router'da dinamik dil bazlı metadata oluşturma
export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale, namespace: "ReservationPage" });

    return {
        title: t("title"),
        description: t("description"),
    };
}

// Sayfanın her zaman en güncel veriyi çekmesini sağlar
export const dynamic = "force-dynamic";

export default async function RezervasyonPage() {
    // Veritabanındaki rotaları, içindeki araç fiyatlandırmalarıyla birlikte çekiyoruz
    const routes = await prisma.route.findMany({
        include: {
            prices: {
                include: {
                    vehicle: true
                }
            }
        }
    });

    return (
        <main className="min-h-screen bg-[#0d0d0d] pt-20">
            {/* Veritabanından gelen rotaları forma aktarıyoruz */}
            <ReservationSection dbRoutes={routes} />
        </main>
    );
}