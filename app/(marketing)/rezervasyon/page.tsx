import { ReservationSection } from "../_components/ReservationSection";

export const metadata = {
    title: "Rezervasyon Yap | VIP Booking",
    description: "VIP transferiniz için anında online rezervasyon oluşturun. Güvenli ödeme ve lüks araç garantisi.",
};

export default function ReservationPage() {
    return (
        <main className="min-h-screen bg-[#0d0d0d] pt-20">
            <ReservationSection />
        </main>
    );
}