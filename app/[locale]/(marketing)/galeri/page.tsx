import { GallerySection } from "../_components/GallerySection";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "GalleryPage" });

    return {
        title: t("title"),
        description: t("description"),
    };
}

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
    const dbImages = await prisma.galleryImage.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <main className="min-h-screen bg-[#0d0d0d] pt-20">
            <GallerySection dbImages={dbImages} />
        </main>
    );
}