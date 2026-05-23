import { AboutSection } from "../_components/AboutSection";
import { getTranslations } from "next-intl/server";

// Next.js App Router'da dinamik dil bazlı metadata oluşturma
export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale, namespace: "AboutPage" });

    return {
        title: t("title"),
        description: t("description"),
    };
}

export default function AboutPage() {
    return (
        // Navbar yüksekliğini kurtarmak ve içeriği ortalamak için üst boşluk eklendi
        <main className="min-h-screen bg-[#0d0d0d] pt-20">
            <AboutSection />
        </main>
    );
}