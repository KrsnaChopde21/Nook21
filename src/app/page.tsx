import BenefitsSection from './components/BenefitsSection';
import Features from './components/Features';
import HeroSection from './components/HeroSection';
import PricingSection from './components/PricingSection';
import SecuritySection from './components/SecuritySection';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <Features />
      <SecuritySection />
      <BenefitsSection />
      <PricingSection />
    </main>
  );
}
