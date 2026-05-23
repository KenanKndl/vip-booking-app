import { AboutSection } from "../_components/AboutSection";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "AboutPage" });

    return {
        title: t("title"),
        description: t("description"),
    };
}

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#0d0d0d] pt-20">
            <AboutSection />
        </main>
    );
}