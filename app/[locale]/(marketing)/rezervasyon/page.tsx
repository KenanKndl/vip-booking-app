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
    // 1. Tüm verileri standart şekilde çekiyoruz
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

    // 2. 85 MB'LIK ŞİŞMEYİ ÖNLEYEN HAYAT KURTARICI KOD (DEDUPLICATION)
    // Devasa resim kodlarının yüzlerce kez tekrar etmesini önlemek için araçları ayırıyoruz.
    const vehiclesMap = new Map();

    const optimizedRoutes = routes.map((route) => ({
        id: route.id,
        pickup: route.pickup,
        dropoff: route.dropoff,
        prices: route.prices.map((price) => {
            if (price.vehicle) {
                // Sadece ihtiyacımız olan alanları alıp Map'e kaydediyoruz (her araç sadece 1 kez eklenir)
                vehiclesMap.set(price.vehicle.id, {
                    id: price.vehicle.id,
                    isActive: price.vehicle.isActive,
                    name: price.vehicle.name,
                    pax: price.vehicle.pax,
                    luggage: price.vehicle.luggage,
                    features: price.vehicle.features,
                    imageUrl: price.vehicle.imageUrl
                });
            }
            // Araç objesini fiyattan koparıp sadece ID'sini bırakıyoruz (Yükü hafifleten kısım)
            const { vehicle, ...restPrice } = price as any;
            return {
                ...restPrice,
                vehicleId: vehicle?.id
            };
        })
    }));

    // Benzersiz araçları diziye çeviriyoruz
    const uniqueVehicles = Array.from(vehiclesMap.values());

    const settings = await prisma.adminSettings.findFirst();
    
    const exchangeRates = {
        eurToTl: settings ? Number(settings.eurToTl) : 35.0,
        eurToUsd: settings ? Number(settings.eurToUsd) : 1.08,
    };

    return (
        <main className="min-h-screen bg-[#0d0d0d] pt-20">
            <ReservationSection 
                dbRoutes={optimizedRoutes} 
                vehicles={uniqueVehicles} 
                exchangeRates={exchangeRates} 
            />
        </main>
    );
}