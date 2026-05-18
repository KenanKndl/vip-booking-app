import { GallerySection } from "../_components/GallerySection";
export const metadata = {
    title: "Galeri | VIP Booking",
    description: "VIP transfer araçlarımızın premium iç ve dış görünümleri, lüks yolculuk deneyimi.",
};

export default function GalleryPage() {
    return (
        <main className="min-h-screen bg-[#0d0d0d] pt-20">
            <GallerySection />
        </main>
    );
}