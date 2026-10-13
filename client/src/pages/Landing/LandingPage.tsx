import { CallToAction } from '../../components/Landing/CallToAction';
import { Faq } from '../../components/Landing/Faq';
import { Features } from '../../components/Landing/Features';
import { Footer } from '../../components/Landing/Footer';
import { Hero } from '../../components/Landing/Hero';
import { HowItWorks } from '../../components/Landing/HowItWorks';
import Navbar from '../../components/Landing/Navbar';
import { ProductScreenshots } from '../../components/Landing/ProductScreenshots';
import { RoleManagement } from '../../components/Landing/RoleManagement';

export function LandingPage() {
  return (
    <div className="min-h-screen scroll-smooth bg-white text-slate-900">
      <Navbar />

      <main>
        <Hero />

        <Features />

        <HowItWorks />

        <RoleManagement />

        <ProductScreenshots />

        <Faq />

        <CallToAction />
      </main>

      <Footer />
    </div>
  );
}