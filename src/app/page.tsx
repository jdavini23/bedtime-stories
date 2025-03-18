import HeroSection from "@/components/sections/hero-section"
import FeaturesSection from "@/components/sections/features-section"
import HowItWorksSection from "@/components/sections/how-it-works-section"
import StoriesSection from "@/components/sections/stories-section"
import TestimonialsSection from "@/components/sections/testimonials-section"
import PricingSection from "@/components/sections/pricing-section"
import CtaSection from "@/components/sections/cta-section"
import Footer from "@/components/sections/footer"
import Navbar from "@/components/sections/navbar"

export default function HomePage() {
  console.log('Home page accessed without authentication');
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-violet-50">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <StoriesSection />
      <TestimonialsSection />
      <PricingSection />
      <CtaSection />
      <Footer />
    </div>
  )
}

