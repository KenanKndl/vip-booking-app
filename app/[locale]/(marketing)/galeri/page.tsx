import { GallerySection } from "../_components/GallerySection";
import { prisma } from "@/lib/prisma";

export const metadata = {
    title: "Galeri | VIP Booking",
    description: "VIP transfer araçlarımızın premium iç ve dış görünümleri, lüks yolculuk deneyimi.",
};

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