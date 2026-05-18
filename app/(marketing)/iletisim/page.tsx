import { ContactSection } from "../_components/ContactSection";

export const metadata = {
    title: "İletişim | VIP Booking",
    description: "Transfer talepleriniz ve sorularınız için bizimle iletişime geçin. 7/24 VIP müşteri desteği.",
};

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-[#0d0d0d] pt-20">
            <ContactSection />
        </main>
    );
}