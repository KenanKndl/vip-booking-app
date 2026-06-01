import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";

type PageProps = {
    params: Promise<{
        locale: string;
    }>;
};

export async function generateMetadata({ params }: PageProps) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "PrivacyPolicyPage" });

    return {
        title: `${t("title")} | VIP Booking`,
        description: t("description"),
    };
}

export default async function PrivacyPolicyPage({ params }: PageProps) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "PrivacyPolicyPage" });

    // Dinamik olarak çeviri dosyasındaki 9 maddeyi döngüyle çekiyoruz
    const sections = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => ({
        title: t(`sections.${i}.title`),
        content: t(`sections.${i}.content`),
    }));

    return (
        <main className="min-h-screen bg-[#0d0d0d] px-5 py-14 text-white sm:px-6 lg:px-8 lg:py-20">
            <div className="mx-auto max-w-4xl">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-medium text-white/45 transition hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" />
                    {t("backToHome")}
                </Link>

                <div className="mt-10 border-b border-white/10 pb-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/35">
                        {t("legalNotice")}
                    </p>

                    <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                        {t("title")}
                    </h1>

                    <p className="mt-5 max-w-2xl text-sm leading-7 text-white/45 sm:text-base">
                        {t("description")}
                    </p>

                    <p className="mt-4 text-xs text-white/30">
                        {t("lastUpdate")}
                    </p>
                </div>

                <div className="mt-8 grid gap-4">
                    {sections.map((section) => (
                        <section
                            key={section.title}
                            className="rounded-[1.5rem] border border-white/10 bg-white/[0.025] p-5 sm:p-6"
                        >
                            <h2 className="text-lg font-semibold tracking-tight text-white">
                                {section.title}
                            </h2>

                            <p className="mt-3 text-sm leading-7 text-white/50">
                                {section.content}
                            </p>
                        </section>
                    ))}
                </div>

                <div className="mt-8 rounded-[1.5rem] border border-[#FACC15]/20 bg-[#FACC15]/10 p-5">
                    <p className="text-sm leading-7 text-white/65">
                        {t("warning")}
                    </p>
                </div>
            </div>
        </main>
    );
}