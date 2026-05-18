import { HeroSection } from "./_components/HeroSection";
import { PricingSection } from "./_components/PricingSection";
import { ExploreSection } from "./_components/ExploreSection";
import { TestimonialSection } from "./_components/TestimonialSection";

export default function MarketingHomePage() {
    return (
        <main className="min-h-screen bg-[#0d0d0d]">
            <HeroSection />

            <div className="relative z-10 -mt-10 rounded-t-[2.5rem] bg-[#fafafa] md:-mt-16 md:rounded-t-[4rem]">
                <ExploreSection />
                <TestimonialSection />
                <PricingSection />
            </div>
        </main>
    );
}