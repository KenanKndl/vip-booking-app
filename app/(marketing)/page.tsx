import { HeroSection } from "./_components/HeroSection";
import { PricingSection } from "./_components/PricingSection";
import { ExploreSection } from "./_components/ExploreSection";
import { TestimonialSection } from "./_components/TestimonialSection";

export default function MarketingHomePage() {
    return (
        <main className="min-h-screen bg-[#0d0d0d]">
            <HeroSection />
            <ExploreSection />
            <TestimonialSection />
            <PricingSection />
        </main>
    );
}