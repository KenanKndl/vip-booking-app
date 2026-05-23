import { ContactSection } from "../_components/ContactSection";
import { getTranslations } from "next-intl/server";

// Next.js App Router'da dinamik dil bazlı metadata oluşturma
export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale, namespace: "ContactPage" });

    return {
        title: t("title"),
        description: t("description"),
    };
}

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-[#0d0d0d] pt-20">
            <ContactSection />
        </main>
    );
}