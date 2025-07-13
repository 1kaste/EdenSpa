import React, { useState, useEffect } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import LandingPage from './pages/LandingPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import BookNowPage from './pages/BookNowPage';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import { Page } from './types';
import WhatsAppButton from './components/WhatsAppButton';
import HotServicePopup from './components/HotServicePopup';
import AdminTrigger from './components/AdminTrigger';

export type LoginMode = 'user' | 'developer';

// A small component to apply global styles from context
const GlobalStyles: React.FC = () => {
  const { fontConfig } = useAppContext();

  useEffect(() => {
    document.documentElement.style.setProperty('--font-heading', fontConfig.headingFont);
    document.documentElement.style.setProperty('--font-body', fontConfig.bodyFont);
  }, [fontConfig]);

  return null; // This component doesn't render anything
}

export default function App(): React.ReactNode {
  const [currentPage, _setCurrentPage] = useState<Page>(Page.Home);
  const [targetSection, setTargetSection] = useState<string | null>(null);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [loginMode, setLoginMode] = useState<LoginMode | null>(null);

  const navigateTo = (page: Page) => {
    if (page === Page.About) {
      _setCurrentPage(Page.Home);
      setTargetSection('about-us-section');
    } else {
      _setCurrentPage(page);
      setTargetSection(null);
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  // Effect to scroll to a specific section when targetSection is set
  useEffect(() => {
    if (targetSection) {
      const timer = setTimeout(() => {
        const element = document.getElementById(targetSection);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setTargetSection(null); // Reset after scrolling attempt
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [targetSection]);


  const renderPage = () => {
    switch (currentPage) {
      case Page.Home:
        return <LandingPage setPage={navigateTo} />;
      case Page.Services:
        return <ServicesPage />;
      case Page.Contact:
        return <ContactPage />;
      case Page.BookNow:
        return <BookNowPage />;
      default:
        return <LandingPage setPage={navigateTo} />;
    }
  };
  
  const handleUnlock = (mode: LoginMode) => {
    setLoginMode(mode);
    setIsAdminPanelOpen(true);
  };

  const handleCloseAdminPanel = () => {
    setIsAdminPanelOpen(false);
    setLoginMode(null); // Reset login mode when panel is closed
  };

  return (
    <AppProvider>
      <GlobalStyles />
      <div className="flex flex-col min-h-screen bg-gray-50">
        <HotServicePopup />
        <Header setPage={navigateTo} />
        <main className="flex-grow">
          {renderPage()}
        </main>
        <Footer />
        <WhatsAppButton />
        <AdminTrigger onUnlock={handleUnlock} />
        <AdminPanel 
          isOpen={isAdminPanelOpen} 
          onClose={handleCloseAdminPanel} 
          initialLoginMode={loginMode}
        />
      </div>
    </AppProvider>
  );
}