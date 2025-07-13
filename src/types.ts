export interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
  photoUrl: string;
  videoUrl:string;
  videoOrientation?: 'landscape' | 'portrait';
  layout?: 'standard' | 'compact';
  discountPercentage?: number;
  promotion?: string;
  showInPopup?: boolean;
  originId?: number;
  showOnServicesPage?: boolean;
}

export interface Theme {
  primary: string;
  secondary: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  background: string;
  headerBg?: string;
  headerBgOpacity?: number;
  headerText?: string;
  bookNowButtonBg?: string;
  bookNowButtonText?: string;
  bookNowButtonBorderColor?: string;
  bookNowButtonBorderWidth?: number;
  bookNowButtonBorderRadius?: number;
}

export interface FontConfig {
  headingFont: string;
  bodyFont: string;
}

export interface HeroConfig {
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  heroOverlayColor: string;
  heroOverlayOpacity: number;
  heroButtonPrimaryBg: string;
  heroButtonPrimaryText: string;
  heroButtonSecondaryBg: string;
  heroButtonSecondaryText: string;
  heroButtonSecondaryBorder: string;
  mediaButtonPhotoBg: string;
  mediaButtonPhotoText: string;
  mediaButtonVideoBg: string;
  mediaButtonVideoText: string;
  mediaButtonGalleryBg: string;
  mediaButtonGalleryText: string;
  mediaButtonGalleryBorder: string;
}

export type SocialPlatform = 'instagram' | 'facebook' | 'twitter' | 'tiktok' | 'snapchat' | 'pinterest' | 'youtube' | 'linkedin' | 'email';

export interface SocialLink {
  id: number;
  platform: SocialPlatform;
  url: string;
}

export type CustomFormFieldType = 'text' | 'textarea' | 'select';

export interface CustomFormField {
  id: number;
  name: string;
  label: string;
  type: CustomFormFieldType;
  required: boolean;
  options?: string[]; // For 'select' type
}

export interface Review {
  id: number;
  name: string;
  comment: string;
  rating: number; // 1 to 5
  photoUrl: string;
  featured: boolean;
}

export interface GalleryItem {
  id: number;
  type: 'photo' | 'video';
  url: string;
  title: string;
  videoOrientation?: 'landscape' | 'portrait';
}

export interface WhyChooseUsItem {
  id: number;
  title: string;
  description: string;
}

export interface SeasonalOffer {
  backgroundImage: string;
  title: string;
  description: string;
  buttonText: string;
}

export interface InstagramFeed {
  title: string;
  username: string;
  imageUrls: string[];
}


export enum Page {
  Home = 'Home',
  Services = 'Services',
  About = 'About',
  Contact = 'Contact',
  BookNow = 'BookNow',
}

export type LoginMode = 'user' | 'developer';
