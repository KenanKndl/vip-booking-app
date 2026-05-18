import { AboutSection } from "../_components/AboutSection";

export const metadata = {
    title: "Hakkımızda | VIP Booking",
    description: "Premium VIP transfer hizmetlerimizin arkasındaki profesyonel vizyon, deneyimli kadromuz ve lüks ulaşım ilkelerimiz.",
};

export default function AboutPage() {
    return (
        // Navbar yüksekliğini kurtarmak ve içeriği ortalamak için üst boşluk eklendi
        <main className="min-h-screen bg-[#0d0d0d] pt-20">
            <AboutSection />
        </main>
    );
}