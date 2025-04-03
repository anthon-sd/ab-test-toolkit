import { useEffect } from 'react';
import { trackEvent, trackContactClick } from './utils/gtm';
import SampleSizeCalculator from './components/SampleSizeCalculator';
import SignificanceCalculator from './components/SignificanceCalculator';
import UpliftCalculator from './components/UpliftCalculator';
import HowToUseGuide from './components/HowToUseGuide';
import AboutSection from './components/AboutSection';
import WhatsNextSection from './components/WhatsNextSection';
import Footer from './components/Footer';
import { Routes, Route, Link } from 'react-router-dom';
import PrivacyPolicy from './pages/PrivacyPolicy';

function App() {
  useEffect(() => {
    // Track page view
    trackEvent('page_view', {
      page_title: 'A/B Test Stats Toolkit',
      page_location: window.location.href,
      page_path: window.location.pathname
    });
  }, []);

  const handleContactClick = (type: string, destination: string) => {
    trackContactClick(type, destination);
  };

  const footerLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Contact Us', href: 'https://swayvendigital.com/contact-us/' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-[#004f80] shadow-md sticky top-0 z-50">
        <div className="container-custom">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <Link 
                to="/"
                className="transition-opacity hover:opacity-90 focus:opacity-90"
                onClick={() => handleContactClick('logo', 'https://swayvendigital.com')}
              >
                <img 
                  src="https://gxhvwiwtmelfrxnwptrr.supabase.co/storage/v1/object/sign/branding-assets/New%20SD%20Logo%20Horizontal.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJicmFuZGluZy1hc3NldHMvTmV3IFNEIExvZ28gSG9yaXpvbnRhbC5wbmciLCJpYXQiOjE3MzkyODg5ODksImV4cCI6MTc3MDgyNDk4OX0.LqKW5eE56m5vfp6w5D4NxVgT7lBvGtQHCG9Qd0tV3ys"
                  alt="Swayven Digital Logo"
                  className="h-16 w-auto"
                />
              </Link>
            </div>
            <nav className="hidden md:flex items-center gap-4">
              <a 
                href="https://discord.gg/m9YwpA2Xjd"
                target="_blank"
                rel="noopener noreferrer"
                className="relative px-4 py-2 text-white hover:text-blue-100 transition-all duration-300 group"
                onClick={() => handleContactClick('discord', 'https://discord.gg/m9YwpA2Xjd')}
              >
                <span className="relative z-10">Join Discord</span>
                <span className="absolute inset-0 bg-white/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 ease-out origin-center"></span>
              </a>
              <a 
                href="https://swayvendigital.com/contact-us/"
                target="_blank"
                rel="noopener noreferrer" 
                className="relative inline-flex items-center px-6 py-3 overflow-hidden font-medium transition-all bg-white text-[#004f80] rounded-lg hover:bg-blue-50 group"
                onClick={() => handleContactClick('contact_us', 'https://swayvendigital.com/contact-us/')}
              >
                <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-[#004f80] opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                <span className="relative">Contact Us</span>
              </a>
            </nav>
          </div>
        </div>
      </header>

      <Routes>
        <Route path="/" element={
          <main className="container-custom py-8 space-y-8">
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <AboutSection />
            </div>

            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <HowToUseGuide />
            </div>

            <div className="space-y-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div>
                <UpliftCalculator />
              </div>
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="hover-card">
                  <SampleSizeCalculator />
                </div>
                <div className="hover-card">
                  <SignificanceCalculator />
                </div>
              </div>
            </div>

            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <WhatsNextSection />
            </div>
          </main>
        } />
        <Route path="/privacy" element={<PrivacyPolicy />} />
      </Routes>

      <Footer 
        companyName="Swayven Digital Ltd" 
        links={footerLinks}
      />
    </div>
  );
}

export default App;