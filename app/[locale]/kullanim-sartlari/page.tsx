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
    const t = await getTranslations({ locale, namespace: "Footer" });

    return {
        title: `${t("termsOfUse")} | VIP Booking`,
        description:
            "VIP Booking web sitesi, rezervasyon ve transfer hizmetleri kullanım şartları.",
    };
}

const sections = [
    {
        title: "1. Genel Hükümler",
        content:
            "Bu kullanım şartları, VIP Booking web sitesi üzerinden sunulan rezervasyon, teklif alma, iletişim ve transfer hizmetlerine ilişkin temel kuralları düzenler. Web sitesini kullanan kullanıcılar bu şartları kabul etmiş sayılır.",
    },
    {
        title: "2. Hizmet Kapsamı",
        content:
            "VIP Booking; havalimanı transferi, şehir içi transfer, özel etkinlik transferi ve benzeri VIP ulaşım hizmetleri sunar. Hizmet kapsamı, seçilen güzergah, araç tipi, yolcu sayısı ve rezervasyon detaylarına göre değişiklik gösterebilir.",
    },
    {
        title: "3. Rezervasyon Süreci",
        content:
            "Kullanıcılar rezervasyon oluştururken tarih, saat, alınış ve varış noktası, yolcu sayısı, iletişim bilgileri ve varsa özel taleplerini eksiksiz ve doğru şekilde iletmelidir. Eksik veya hatalı bilgi nedeniyle oluşabilecek aksaklıklardan kullanıcı sorumludur.",
    },
    {
        title: "4. Fiyatlandırma",
        content:
            "Web sitesinde gösterilen fiyatlar seçilen güzergah, araç tipi, yolculuk tipi ve ek taleplere göre değişebilir. Nihai ücret, rezervasyon adımında veya teklif sürecinde kullanıcıya bildirilir. Listelenen fiyatlar aksi belirtilmedikçe başlangıç veya toplam transfer ücreti niteliğinde olabilir.",
    },
    {
        title: "5. Ek Talepler",
        content:
            "Bebek koltuğu, araç içi ekstra ürünler, özel karşılama veya benzeri talepler müsaitlik durumuna bağlı olarak sağlanır. Ek talepler için ayrıca ücret alınabilir ve bu ücret rezervasyon toplamına yansıtılabilir.",
    },
    {
        title: "6. İptal ve Değişiklikler",
        content:
            "Rezervasyon iptali veya değişiklik talepleri mümkün olan en kısa sürede VIP Booking ekibine iletilmelidir. İptal ve değişiklik koşulları, hizmetin türüne, rezervasyon saatine ve operasyon durumuna göre değişiklik gösterebilir.",
    },
    {
        title: "7. Kullanıcı Sorumlulukları",
        content:
            "Kullanıcı, web sitesi üzerinden ilettiği bilgilerin doğru ve güncel olduğunu kabul eder. Yanlış konum, tarih, saat veya iletişim bilgisi verilmesi nedeniyle oluşabilecek gecikme, iptal veya hizmet aksaklıklarından kullanıcı sorumludur.",
    },
    {
        title: "8. Sorumluluk Sınırları",
        content:
            "VIP Booking, hizmeti planlanan şekilde sunmak için gerekli özeni gösterir. Ancak trafik, hava koşulları, yol kapanmaları, uçuş değişiklikleri, mücbir sebepler veya üçüncü kişilerden kaynaklanan gecikmelerden dolayı sorumluluk sınırlı olabilir.",
    },
    {
        title: "9. Fikri Mülkiyet",
        content:
            "Web sitesinde yer alan tasarım, metin, görsel, logo, marka ve diğer içerikler ilgili hak sahiplerine aittir. Bu içerikler izinsiz şekilde kopyalanamaz, çoğaltılamaz veya ticari amaçla kullanılamaz.",
    },
    {
        title: "10. İletişim",
        content:
            "Kullanım şartları veya hizmet süreçleriyle ilgili sorularınız için reservation@vipbooking.com adresi üzerinden bizimle iletişime geçebilirsiniz.",
    },
];

export default async function TermsOfUsePage({ params }: PageProps) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Footer" });

    return (
        <main className="min-h-screen bg-[#0d0d0d] px-5 py-14 text-white sm:px-6 lg:px-8 lg:py-20">
            <div className="mx-auto max-w-4xl">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-medium text-white/45 transition hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Ana sayfaya dön
                </Link>

                <div className="mt-10 border-b border-white/10 pb-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/35">
                        Yasal Bilgilendirme
                    </p>

                    <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                        {t("termsOfUse")}
                    </h1>

                    <p className="mt-5 max-w-2xl text-sm leading-7 text-white/45 sm:text-base">
                        VIP Booking web sitesi, rezervasyon ve transfer
                        hizmetlerinden yararlanırken geçerli olan temel kullanım
                        koşulları.
                    </p>

                    <p className="mt-4 text-xs text-white/30">
                        Son güncelleme: 26 Mayıs 2026
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
                        Bu metin genel bilgilendirme amacıyla hazırlanmıştır.
                        Rezervasyon, iptal, iade ve sorumluluk süreçlerinizin
                        gerçek işleyişine göre hukuk uzmanı tarafından kontrol
                        edilmesi önerilir.
                    </p>
                </div>
            </div>
        </main>
    );
}