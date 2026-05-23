import { GallerySection } from "../_components/GallerySection";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";

// Next.js App Router'da dinamik dil bazlı metadata oluşturma
export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale, namespace: "GalleryPage" });

    return {
        title: t("title"),
        description: t("description"),
    };
}

// Sayfanın her zaman en güncel veriyi çekmesini sağlar
export const dynamic = "force-dynamic";

export default async function GalleryPage() {
    // Veritabanındaki fotoğrafları en yeniden eskiye doğru çekiyoruz
    const dbImages = await prisma.galleryImage.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <main className="min-h-screen bg-[#0d0d0d] pt-20">
            {/* Çekilen veriyi galeri bileşenine iletiyoruz */}
            <GallerySection dbImages={dbImages} />
        </main>
    );
}