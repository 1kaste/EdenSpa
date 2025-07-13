
import React, { useState, useEffect, lazy, Suspense, useCallback } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import { Page, LoginMode } from './types';
import WhatsAppButton from './components/WhatsAppButton';
import HotServicePopup from './components/HotServicePopup';
import AdminTrigger from './components/AdminTrigger';

// Lazy-loaded components
const LandingPage = lazy(() => import('./pages/LandingPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const BookNowPage = lazy(() => import('./pages/BookNowPage'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));


// A small component to apply global styles from context
const GlobalStyles: React.FC = () => {
  const { appData } = useAppContext();

  useEffect(() => {
    if (appData?.fontConfig) {
        document.documentElement.style.setProperty('--font-heading', appData.fontConfig.headingFont);
        document.documentElement.style.setProperty('--font-body', appData.fontConfig.bodyFont);
    }
  }, [appData?.fontConfig]);

  return null; // This component doesn't render anything
}

const FullPageLoader: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen bg-gray-50 dark:bg-zinc-900">
        <div 
            className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-pink-400"
            style={{ borderTopColor: 'transparent' }}
        ></div>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">{message}</p>
    </div>
);

const AppContent: React.FC = () => {
  const { isInitialized } = useAppContext();
  const [currentPage, _setCurrentPage] = useState<Page>(Page.Home);
  const [targetSection, setTargetSection] = useState<string | null>(null);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [loginMode, setLoginMode] = useState<LoginMode | null>(null);

  const navigateTo = useCallback((page: Page) => {
    if (page === Page.About) {
      _setCurrentPage(Page.Home);
      setTargetSection('about-us-section');
    } else {
      _setCurrentPage(page);
      setTargetSection(null);
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    if (targetSection) {
      const timer = setTimeout(() => {
        const element = document.getElementById(targetSection);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setTargetSection(null);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [targetSection]);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home: return <LandingPage setPage={navigateTo} />;
      case Page.Services: return <ServicesPage />;
      case Page.Contact: return <ContactPage />;
      case Page.BookNow: return <BookNowPage />;
      default: return <LandingPage setPage={navigateTo} />;
    }
  };
  
  const handleUnlock = (mode: LoginMode) => {
    setLoginMode(mode);
    setIsAdminPanelOpen(true);
  };

  const handleCloseAdminPanel = () => {
    setIsAdminPanelOpen(false);
    setLoginMode(null);
  };
  
  if (!isInitialized) {
      return <FullPageLoader message="Connecting to server..." />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <GlobalStyles />
      <HotServicePopup />
      <Header setPage={navigateTo} />
      <main className="flex-grow">
        <Suspense fallback={<FullPageLoader message="Loading page..."/>}>
          {renderPage()}
        </Suspense>
      </main>
      <Footer />
      <WhatsAppButton />
      <AdminTrigger onUnlock={handleUnlock} />
      {isAdminPanelOpen && (
        <Suspense fallback={<FullPageLoader message="Loading editor..."/>}>
          <AdminPanel 
            isOpen={isAdminPanelOpen} 
            onClose={handleCloseAdminPanel} 
            initialLoginMode={loginMode}
          />
        </Suspense>
      )}
    </div>
  );
}


export default function App(): React.ReactNode {
  return (
    <AppProvider>
        <AppContent />
    </AppProvider>
  );
}