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
            <ReservationSection dbRoutes={routes} />
        </main>
    );
}