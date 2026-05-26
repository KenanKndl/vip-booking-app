import { HeroSection } from "./_components/HeroSection";
import { PricingSection } from "./_components/PricingSection";
import { ExploreSection } from "./_components/ExploreSection";
import { TestimonialSection } from "./_components/TestimonialSection";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "HomePage" });

    return {
        title: t("title"),
        description: t("description"),
    };
}

export default async function MarketingHomePage() {
    const rawRoutes = await prisma.route.findMany({
        where: { isActive: true },
        include: { prices: true }
    });

    // 1. DÜZELTME: Veritabanından güncel kurları çekiyoruz
    const settings = await prisma.adminSettings.findFirst();
    const exchangeRates = {
        eurToTl: settings ? Number(settings.eurToTl) : 35.0,
        eurToUsd: settings ? Number(settings.eurToUsd) : 1.08,
    };

    const groupedMap = new Map<string, any[]>();

    rawRoutes.forEach((route) => {
        if (!groupedMap.has(route.pickup)) {
            groupedMap.set(route.pickup, []);
        }

        let minPrice = 0;
        if (route.prices && route.prices.length > 0) {
            const allPrices = route.prices.map((p: any) => p.price || 0).filter((p: number) => p > 0);
            if (allPrices.length > 0) {
                minPrice = Math.min(...allPrices);
            }
        }

        groupedMap.get(route.pickup)!.push({
            to: route.dropoff,
            price: minPrice,
        });
    });

    const dynamicRouteGroups = Array.from(groupedMap.entries())
        .map(([pickup, routes]) => ({
            id: pickup,
            label: pickup,
            routes: routes.sort((a, b) => a.price - b.price),
        }))
        .slice(0, 3);

    return (
        <main className="min-h-screen bg-[#0d0d0d]">
            <HeroSection />

            <div className="relative z-10 -mt-10 rounded-t-[2.5rem] bg-[#fafafa] md:-mt-16 md:rounded-t-[4rem]">
                <ExploreSection />
                <TestimonialSection />
                {/* 2. DÜZELTME: Çekilen kurları bileşene gönderiyoruz */}
                <PricingSection routeGroups={dynamicRouteGroups} exchangeRates={exchangeRates} />
            </div>
        </main>
    );
}