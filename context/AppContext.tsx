import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Service, Theme, SocialLink, CustomFormField, Review, GalleryItem, HeroConfig, FontConfig, WhyChooseUsItem, SeasonalOffer, InstagramFeed } from '../types';
import { 
  DEFAULT_SERVICES, 
  DEFAULT_THEME, 
  DARK_THEME, 
  DEFAULT_SOCIAL_LINKS, 
  DEFAULT_CUSTOM_FIELDS,
  DEFAULT_REVIEWS,
  DEFAULT_WHATSAPP_NUMBER, 
  DEFAULT_WHATSAPP_MESSAGE,
  DEFAULT_CONTACT_EMAIL,
  DEFAULT_CONTACT_TIP,
  DEFAULT_LOGO_URL,
  DEFAULT_BUSINESS_NAME,
  DEFAULT_TAGLINE,
  DEFAULT_SHOW_PHOTO_GALLERY,
  DEFAULT_SHOW_VIDEO_GALLERY,
  DEFAULT_SHOW_MAIN_GALLERY,
  DEFAULT_GALLERY_ITEMS,
  DEFAULT_FEATURED_SERVICES,
  DEFAULT_SHOW_DESIGNER_CREDIT,
  DEFAULT_DESIGNER_CREDIT_URL,
  DEFAULT_USER_PASSWORD,
  DEFAULT_INACTIVITY_TIMEOUT,
  DEFAULT_HERO_CONFIG,
  DEFAULT_FONT_CONFIG,
  DEFAULT_WHY_CHOOSE_US_ITEMS,
  DEFAULT_SEASONAL_OFFER,
  DEFAULT_INSTAGRAM_FEED
} from '../constants';

interface AppContextType {
  theme: Theme;
  lightTheme: Theme;
  setLightTheme: React.Dispatch<React.SetStateAction<Theme>>;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  services: Service[];
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  featuredServices: Service[];
  setFeaturedServices: React.Dispatch<React.SetStateAction<Service[]>>;
  socialLinks: SocialLink[];
  setSocialLinks: React.Dispatch<React.SetStateAction<SocialLink[]>>;
  customFields: CustomFormField[];
  setCustomFields: React.Dispatch<React.SetStateAction<CustomFormField[]>>;
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  whatsappNumber: string;
  setWhatsappNumber: React.Dispatch<React.SetStateAction<string>>;
  whatsappMessage: string;
  setWhatsappMessage: React.Dispatch<React.SetStateAction<string>>;
  contactEmail: string;
  setContactEmail: React.Dispatch<React.SetStateAction<string>>;
  contactTip: string;
  setContactTip: React.Dispatch<React.SetStateAction<string>>;
  logoUrl: string;
  setLogoUrl: React.Dispatch<React.SetStateAction<string>>;
  businessName: string;
  setBusinessName: React.Dispatch<React.SetStateAction<string>>;
  tagline: string;
  setTagline: React.Dispatch<React.SetStateAction<string>>;
  showPhotoGallery: boolean;
  setShowPhotoGallery: React.Dispatch<React.SetStateAction<boolean>>;
  showVideoGallery: boolean;
  setShowVideoGallery: React.Dispatch<React.SetStateAction<boolean>>;
  showMainGallery: boolean;
  setShowMainGallery: React.Dispatch<React.SetStateAction<boolean>>;
  galleryItems: GalleryItem[];
  setGalleryItems: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  showDesignerCredit: boolean;
  setShowDesignerCredit: React.Dispatch<React.SetStateAction<boolean>>;
  designerCreditUrl: string;
  setDesignerCreditUrl: React.Dispatch<React.SetStateAction<string>>;
  userPassword: string;
  setUserPassword: React.Dispatch<React.SetStateAction<string>>;
  inactivityTimeout: number;
  setInactivityTimeout: React.Dispatch<React.SetStateAction<number>>;
  heroConfig: HeroConfig;
  setHeroConfig: React.Dispatch<React.SetStateAction<HeroConfig>>;
  fontConfig: FontConfig;
  setFontConfig: React.Dispatch<React.SetStateAction<FontConfig>>;
  whyChooseUsItems: WhyChooseUsItem[];
  setWhyChooseUsItems: React.Dispatch<React.SetStateAction<WhyChooseUsItem[]>>;
  seasonalOffer: SeasonalOffer;
  setSeasonalOffer: React.Dispatch<React.SetStateAction<SeasonalOffer>>;
  instagramFeed: InstagramFeed;
  setInstagramFeed: React.Dispatch<React.SetStateAction<InstagramFeed>>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [lightTheme, setLightTheme] = useState<Theme>(DEFAULT_THEME);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);
  const [featuredServices, setFeaturedServices] = useState<Service[]>(DEFAULT_FEATURED_SERVICES);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(DEFAULT_SOCIAL_LINKS);
  const [customFields, setCustomFields] = useState<CustomFormField[]>(DEFAULT_CUSTOM_FIELDS);
  const [reviews, setReviews] = useState<Review[]>(DEFAULT_REVIEWS);
  const [whatsappNumber, setWhatsappNumber] = useState<string>(DEFAULT_WHATSAPP_NUMBER);
  const [whatsappMessage, setWhatsappMessage] = useState<string>(DEFAULT_WHATSAPP_MESSAGE);
  const [contactEmail, setContactEmail] = useState<string>(DEFAULT_CONTACT_EMAIL);
  const [contactTip, setContactTip] = useState<string>(DEFAULT_CONTACT_TIP);
  const [logoUrl, setLogoUrl] = useState<string>(DEFAULT_LOGO_URL);
  const [businessName, setBusinessName] = useState<string>(DEFAULT_BUSINESS_NAME);
  const [tagline, setTagline] = useState<string>(DEFAULT_TAGLINE);
  const [showPhotoGallery, setShowPhotoGallery] = useState<boolean>(DEFAULT_SHOW_PHOTO_GALLERY);
  const [showVideoGallery, setShowVideoGallery] = useState<boolean>(DEFAULT_SHOW_VIDEO_GALLERY);
  const [showMainGallery, setShowMainGallery] = useState<boolean>(DEFAULT_SHOW_MAIN_GALLERY);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(DEFAULT_GALLERY_ITEMS);
  const [showDesignerCredit, setShowDesignerCredit] = useState<boolean>(DEFAULT_SHOW_DESIGNER_CREDIT);
  const [designerCreditUrl, setDesignerCreditUrl] = useState<string>(DEFAULT_DESIGNER_CREDIT_URL);
  const [userPassword, setUserPassword] = useState<string>(DEFAULT_USER_PASSWORD);
  const [inactivityTimeout, setInactivityTimeout] = useState<number>(DEFAULT_INACTIVITY_TIMEOUT);
  const [heroConfig, setHeroConfig] = useState<HeroConfig>(DEFAULT_HERO_CONFIG);
  const [fontConfig, setFontConfig] = useState<FontConfig>(DEFAULT_FONT_CONFIG);
  const [whyChooseUsItems, setWhyChooseUsItems] = useState<WhyChooseUsItem[]>(DEFAULT_WHY_CHOOSE_US_ITEMS);
  const [seasonalOffer, setSeasonalOffer] = useState<SeasonalOffer>(DEFAULT_SEASONAL_OFFER);
  const [instagramFeed, setInstagramFeed] = useState<InstagramFeed>(DEFAULT_INSTAGRAM_FEED);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);
  const currentTheme = isDarkMode ? DARK_THEME : lightTheme;

  return (
    <AppContext.Provider value={{ 
      theme: currentTheme, 
      lightTheme,
      setLightTheme,
      isDarkMode,
      toggleDarkMode,
      services, setServices, 
      featuredServices, setFeaturedServices,
      socialLinks, setSocialLinks, 
      customFields, setCustomFields,
      reviews, setReviews,
      whatsappNumber, setWhatsappNumber, 
      whatsappMessage, setWhatsappMessage,
      contactEmail, setContactEmail,
      contactTip, setContactTip,
      logoUrl, setLogoUrl,
      businessName, setBusinessName,
      tagline, setTagline,
      showPhotoGallery, setShowPhotoGallery,
      showVideoGallery, setShowVideoGallery,
      showMainGallery, setShowMainGallery,
      galleryItems, setGalleryItems,
      showDesignerCredit, setShowDesignerCredit,
      designerCreditUrl, setDesignerCreditUrl,
      userPassword, setUserPassword,
      inactivityTimeout, setInactivityTimeout,
      heroConfig, setHeroConfig,
      fontConfig, setFontConfig,
      whyChooseUsItems, setWhyChooseUsItems,
      seasonalOffer, setSeasonalOffer,
      instagramFeed, setInstagramFeed
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};