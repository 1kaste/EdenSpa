

import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';
import { 
  Service, Theme, SocialLink, CustomFormField, Review, GalleryItem, 
  HeroConfig, FontConfig, WhyChooseUsItem, SeasonalOffer, InstagramFeed, LoginMode
} from '../types';
import { 
  DEFAULT_THEME, DARK_THEME
} from '../constants';


// Define the shape of the application state (passwords are excluded)
interface AppData {
  lightTheme: Theme;
  services: Service[];
  featuredServices: Service[];
  socialLinks: SocialLink[];
  customFields: CustomFormField[];
  reviews: Review[];
  whatsappNumber: string;
  whatsappMessage: string;
  contactEmail: string;
  contactTip: string;
  logoUrl: string;
  businessName: string;
  tagline: string;
  showPhotoGallery: boolean;
  showVideoGallery: boolean;
  showMainGallery: boolean;
  galleryItems: GalleryItem[];
  showDesignerCredit: boolean;
  designerCreditUrl: string;
  inactivityTimeout: number;
  heroConfig: HeroConfig;
  fontConfig: FontConfig;
  whyChooseUsItems: WhyChooseUsItem[];
  seasonalOffer: SeasonalOffer;
  instagramFeed: InstagramFeed;
}

// Define the context type, including the app data and functions
interface AppContextType {
  appData: AppData | null;
  theme: Theme;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isInitialized: boolean;
  saveState: (newState: any) => void;
  authenticate: (password: string) => Promise<{ success: boolean; mode?: LoginMode }>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

let socket: Socket;

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [appData, setAppData] = useState<AppData | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    socket = io();

    socket.on('connect', () => {
      console.log('Connected to server with ID:', socket.id);
    });

    socket.on('initialState', (state: AppData) => {
      console.log('Received initial state from server.');
      setAppData(state);
      setIsInitialized(true);
    });

    socket.on('stateUpdate', (newState: AppData) => {
      console.log('Received state update from server.');
      setAppData(newState);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server.');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const saveState = (newState: any) => {
    if (socket && socket.connected) {
      socket.emit('updateState', newState);
    } else {
      console.error('Socket not connected. Cannot save state.');
      alert('Error: Not connected to the server. Your changes could not be saved.');
    }
  };

  const authenticate = (password: string): Promise<{ success: boolean; mode?: LoginMode }> => {
    return new Promise((resolve) => {
        if (socket && socket.connected) {
            socket.emit('authenticate', password, (response: { success: boolean; mode?: LoginMode }) => {
                resolve(response);
            });
        } else {
            console.error('Socket not connected. Cannot authenticate.');
            resolve({ success: false });
        }
    });
  };

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);
  
  const theme = useMemo(() => {
    if (!appData) return isDarkMode ? DARK_THEME : DEFAULT_THEME;
    return isDarkMode ? DARK_THEME : appData.lightTheme;
  }, [isDarkMode, appData]);
  
  const contextValue = useMemo(() => ({
    appData,
    theme,
    isDarkMode,
    toggleDarkMode,
    isInitialized,
    saveState,
    authenticate
  }), [appData, theme, isDarkMode, isInitialized]);

  return (
    <AppContext.Provider value={contextValue}>
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