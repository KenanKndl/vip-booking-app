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
        title: `${t("privacyPolicy")} | VIP Booking`,
        description:
            "VIP Booking gizlilik politikası, kişisel verilerin işlenmesi ve çerez kullanımı hakkında bilgilendirme.",
    };
}

const sections = [
    {
        title: "1. Veri Sorumlusu",
        content:
            "Bu gizlilik politikası, VIP Booking Turizm Taşımacılık Sanayi Ve Tic.Ltd.Şti tarafından sunulan web sitesi, rezervasyon ve iletişim süreçlerinde kişisel verilerin nasıl işlendiğini açıklamak amacıyla hazırlanmıştır.",
    },
    {
        title: "2. Toplanan Kişisel Veriler",
        content:
            "Rezervasyon, iletişim veya teklif talebi süreçlerinde ad soyad, telefon numarası, e-posta adresi, alınış ve varış noktası, rezervasyon tarihi, yolcu bilgileri, özel talepler ve mesaj içerikleri gibi bilgiler işlenebilir.",
    },
    {
        title: "3. Kişisel Verilerin İşlenme Amaçları",
        content:
            "Kişisel verileriniz; rezervasyon taleplerinin alınması, transfer hizmetinin planlanması, müşteri iletişiminin sağlanması, teklif oluşturulması, hizmet kalitesinin artırılması ve yasal yükümlülüklerin yerine getirilmesi amacıyla işlenir.",
    },
    {
        title: "4. Kişisel Verilerin Aktarılması",
        content:
            "Kişisel verileriniz, hizmetin sağlanması için gerekli olması halinde operasyon ekibi, sürücüler, teknik hizmet sağlayıcılar ve yetkili kamu kurumları ile sınırlı şekilde paylaşılabilir. Verileriniz üçüncü kişilerle gereksiz veya amaç dışı şekilde paylaşılmaz.",
    },
    {
        title: "5. Saklama Süresi",
        content:
            "Kişisel verileriniz, işlenme amacı için gerekli olan süre boyunca ve ilgili mevzuatta öngörülen yasal saklama süreleri kapsamında muhafaza edilir. Sürenin sona ermesi halinde veriler silinir, yok edilir veya anonim hale getirilir.",
    },
    {
        title: "6. Çerez Kullanımı",
        content:
            "Web sitemizde zorunlu çerezler, tercih çerezleri, analitik çerezler ve pazarlama çerezleri kullanılabilir. Zorunlu çerezler sitenin güvenli ve doğru çalışması için gereklidir. Tercih, analitik ve pazarlama çerezleri kullanıcı tercihine bağlı olarak aktif edilir.",
    },
    {
        title: "7. Çerez Tercihleri",
        content:
            "Çerez tercihlerinizi web sitesinin alt kısmında yer alan 'Çerez Tercihleri' bağlantısı üzerinden dilediğiniz zaman değiştirebilirsiniz. Zorunlu çerezler kapatılamaz; diğer çerez kategorileri isteğinize bağlı olarak açılıp kapatılabilir.",
    },
    {
        title: "8. Haklarınız",
        content:
            "Kişisel verilerinizle ilgili olarak bilgi talep etme, düzeltme isteme, silinmesini veya yok edilmesini isteme, işleme faaliyetlerine itiraz etme ve mevzuat kapsamındaki diğer haklarınızı kullanma hakkına sahipsiniz.",
    },
    {
        title: "9. İletişim",
        content:
            "Gizlilik politikası ve kişisel verilerinizle ilgili talepleriniz için reservation@vipbooking.com adresi üzerinden bizimle iletişime geçebilirsiniz.",
    },
];

export default async function PrivacyPolicyPage({ params }: PageProps) {
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
                        {t("privacyPolicy")}
                    </h1>

                    <p className="mt-5 max-w-2xl text-sm leading-7 text-white/45 sm:text-base">
                        VIP Booking web sitesi ve rezervasyon süreçlerinde
                        kişisel verilerin nasıl işlendiğine ilişkin
                        bilgilendirme.
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
                        Şirketinizin gerçek veri işleme süreçlerine göre bir
                        hukuk uzmanı tarafından kontrol edilmesi önerilir.
                    </p>
                </div>
            </div>
        </main>
    );
}