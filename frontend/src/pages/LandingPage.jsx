import React from 'react'
import Navbar from '../components/LandingPage/Navbar'
import HeroSection from '../components/LandingPage/HeroSection';
import FeaturesSection from '../components/LandingPage/FeatureSection';
import AboutSection from '../components/LandingPage/AboutSection';
import ContactSection from '../components/LandingPage/ContactSection';
import Footer from '../components/LandingPage/Footer';
import CodeBackground from '../components/LandingPage/CodeBackground';

const LandingPage = () => {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative w-full">
        <CodeBackground />
        <div className="relative z-10">
          <Navbar />
          <HeroSection />
          <FeaturesSection />
          <AboutSection />
          <ContactSection />
          <Footer />
        </div>
      </div>
    </>
  )
}

export default LandingPage
