import React from 'react';
import { useAppContext } from '../context/AppContext';
import { SocialPlatform } from '../types';

const socialIcons: Record<SocialPlatform, React.ReactNode> = {
  instagram: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>,
  facebook: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>,
  twitter: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>,
  tiktok: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12a4 4 0 1 0 4 4V8a8 8 0 1 0-8 8" /></svg>,
  snapchat: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 0 0-10 10c0 5 4.5 9 10 9s10-4 10-9c0-5-4.5-9-10-9z" /><path d="M8 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-1z" /><path d="M14 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1z" /><path d="M8 15s1.5 2 4 2 4-2 4-2" /></svg>,
  pinterest: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m14 11.5-3.5 6.5" /><path d="M12 12c-1 0-1.5 1-1.5 2C10.5 16 12 18 12 18s1.5-2 1.5-4c0-1-.5-2-1.5-2z" /><circle cx="12" cy="12" r="10" /></svg>,
  youtube: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10C2.5 6 4.5 4 7 4h10c2.5 0 4.5 2 4.5 3.5s0 3.5 0 3.5-2 1.5-4.5 1.5h-10C4.5 13 2.5 15 2.5 17" /><path d="m10 8 5 2.5-5 2.5z" /></svg>,
  linkedin: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>,
  email: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>,
};


const Footer: React.FC = () => {
  const { theme, socialLinks, showDesignerCredit, designerCreditUrl } = useAppContext();

  return (
    <footer className="py-8" style={{ backgroundColor: theme.secondary }}>
      <div className="container mx-auto px-6 text-center">
        <div className="flex justify-center space-x-6 mb-4">
          {socialLinks.map(link => {
            const isEmail = link.platform === 'email';
            const href = isEmail && !link.url.startsWith('mailto:') ? `mailto:${link.url}` : link.url;
            const ariaLabel = isEmail ? 'Email us' : `Visit our ${link.platform} page`;

            return (
              <a 
                key={link.id} 
                href={href} 
                target={isEmail ? '_self' : '_blank'} 
                rel="noopener noreferrer" 
                className="hover:opacity-75 transition-opacity duration-300" 
                style={{ color: theme.textSecondary }}
                aria-label={ariaLabel}
              >
                {socialIcons[link.platform]}
              </a>
            );
          })}
        </div>
        <p style={{ color: theme.textSecondary }}>&copy; {new Date().getFullYear()} Eden Spa. All Rights Reserved.</p>
        
        {showDesignerCredit && (
          <p className="mt-6 text-xs" style={{ color: theme.textSecondary }}>
            Designed by{' '}
            <a 
              href={designerCreditUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-semibold hover:underline"
              style={{ color: theme.textPrimary }}
            >
              Kaste Brands
            </a>
          </p>
        )}
      </div>
    </footer>
  );
};

export default Footer;