import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import CompanyModes from '../components/landing/CompanyModes';
import CtaBand from '../components/landing/CtaBand';

export default function Landing() {
  return (
    <div className="min-h-screen bg-paper text-ink dark:bg-ink dark:text-paper">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <CompanyModes />
        <CtaBand />
      </main>
      <Footer />
    </div>
  );
}
