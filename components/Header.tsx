import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Page } from '../types';
import Button from './Button';

interface HeaderProps {
  setPage: (page: Page) => void;
  isPreview?: boolean;
}

const hexToRgb = (hex: string): { r: number, g: number, b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return null;
    return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    };
};

const Header: React.FC<HeaderProps> = ({ setPage, isPreview = false }) => {
  const { theme, logoUrl, businessName, tagline, isDarkMode, toggleDarkMode } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const textShadowStyle = {
    textShadow: isDarkMode ? '0 1px 4px rgba(0, 0, 0, 0.5)' : '0 1px 2px rgba(0, 0, 0, 0.2)'
  };

  const handleNavClick = (page: Page) => {
    setPage(page);
    setIsMenuOpen(false); // Close menu on navigation
  };

  const headerPillStyle: React.CSSProperties = {};
  if (theme.headerBg && typeof theme.headerBgOpacity === 'number') {
    const rgb = hexToRgb(theme.headerBg);
    if(rgb) {
        headerPillStyle.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${theme.headerBgOpacity})`;
    }
  }
  headerPillStyle.color = theme.headerText || theme.textPrimary;

  const NavLink: React.FC<{ page: Page; label: string; isMobile?: boolean }> = ({ page, label, isMobile }) => {
    const commonClasses = "transition-colors duration-300";
    const desktopClasses = `px-4 py-2 rounded-full text-sm font-medium hover:bg-black/10 dark:hover:bg-white/10 ${commonClasses}`;
    const mobileClasses = `text-3xl font-medium text-white hover:opacity-75 ${commonClasses}`;

    return (
       <a
          href="#"
          onClick={(e) => { e.preventDefault(); handleNavClick(page); }}
          className={isMobile ? mobileClasses : desktopClasses}
          style={!isMobile ? textShadowStyle : undefined}
        >
          {label}
        </a>
    );
  };

  const DarkModeToggleButton = () => (
    <button
        onClick={toggleDarkMode}
        className="p-2 rounded-full transition-colors hover:bg-black/10 dark:hover:bg-white/10"
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
        {isDarkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
        )}
    </button>
  );

  return (
    <>
      <header 
        className={`${isPreview ? 'absolute' : 'fixed'} top-0 left-0 right-0 z-30 pt-4 md:pt-6 transition-all duration-300`}
      >
        <div className="container mx-auto px-4">
            <div className="flex items-center justify-between gap-4">
                {/* Navigation Pill */}
                <div 
                    className="flex-1 flex items-center justify-between p-2 rounded-full shadow-lg border border-black/5 dark:border-white/10 backdrop-blur-lg"
                    style={headerPillStyle}
                >
                  {/* Logo */}
                  <div 
                    className="flex items-center cursor-pointer flex-shrink-0"
                    onClick={() => handleNavClick(Page.Home)}
                  >
                    {logoUrl ? (
                      <img 
                        src={logoUrl} 
                        alt={`${businessName} Logo`}
                        className="h-10 w-auto object-contain"
                      />
                    ) : (
                      <div className="pl-4" style={textShadowStyle}>
                        {businessName && (
                          <div className="text-lg font-bold leading-tight font-heading">
                            {businessName}
                          </div>
                        )}
                        {tagline && (
                          <p className="text-xs" style={{ color: theme.textSecondary }}>
                            {tagline}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Desktop Nav */}
                  <nav className="hidden md:flex flex-1 justify-center items-center gap-2">
                      <NavLink page={Page.Home} label="Home" />
                      <NavLink page={Page.About} label="About" />
                      <NavLink page={Page.Services} label="Services" />
                      <NavLink page={Page.Contact} label="Contact" />
                  </nav>

                  {/* Desktop Actions (inside pill) */}
                  <div className="hidden md:flex items-center pr-2">
                    <DarkModeToggleButton />
                  </div>

                  {/* Mobile Menu Button */}
                  <div className="md:hidden flex items-center space-x-1">
                    <DarkModeToggleButton />
                    <button onClick={() => setIsMenuOpen(true)} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10" aria-label="Open menu">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* External Book Now button for Desktop */}
                <div className="hidden md:block">
                    <Button onClick={() => handleNavClick(Page.BookNow)} className="text-sm px-4 py-2" variant="bookNow">
                        Book Now
                    </Button>
                </div>
            </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className={`${isPreview ? 'absolute' : 'fixed'} inset-0 z-50 flex flex-col items-center justify-center md:hidden bg-black/60 backdrop-blur-lg`}>
          <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6 p-2" aria-label="Close menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <nav className="flex flex-col items-center space-y-6">
            <NavLink page={Page.Home} label="Home" isMobile />
            <NavLink page={Page.About} label="About" isMobile />
            <NavLink page={Page.Services} label="Services" isMobile />
            <NavLink page={Page.Contact} label="Contact" isMobile />
            <Button onClick={() => { handleNavClick(Page.BookNow); setIsMenuOpen(false); }} className="text-2xl mt-4 px-8 py-3" variant="bookNow">
              Book Now
            </Button>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;