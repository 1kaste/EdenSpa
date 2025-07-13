import { Service, Theme, SocialLink, CustomFormField, Review, GalleryItem, HeroConfig, FontConfig, WhyChooseUsItem, SeasonalOffer, InstagramFeed } from './types';

export const DEFAULT_THEME: Theme = {
  primary: '#D4C1C2',      // Muted Rose
  secondary: '#F7F5F5',    // Very Light Off-White/Grey
  accent: '#B0A0A1',       // Warm Grey
  textPrimary: '#2d2d2d',  // Charcoal
  textSecondary: '#6e6e6e',// Medium Grey
  background: '#FFFFFF',    // White
  headerBg: '#FFFFFF',
  headerBgOpacity: 0.5,
  headerText: '#2d2d2d',
  bookNowButtonBg: '#D4C1C2',
  bookNowButtonText: '#2d2d2d',
  bookNowButtonBorderColor: '#D4C1C2',
  bookNowButtonBorderWidth: 0,
  bookNowButtonBorderRadius: 8,
};

export const DARK_THEME: Theme = {
  primary: '#BDBDBD',      // Was Soft Pink, now a neutral gray
  secondary: '#212121',    // Was Lighter Pink, now a very dark gray
  accent: '#757575',       // Was Muted Mauve, now a mid-gray
  textPrimary: '#FFFFFF',  // Was Dark Brown, now white
  textSecondary: '#E0E0E0',// Was Medium Brown, now light gray
  background: '#121212',  // Was White, now near black
  headerBg: '#27272a',
  headerBgOpacity: 0.5,
  headerText: '#FFFFFF',
  bookNowButtonBg: '#BDBDBD',
  bookNowButtonText: '#121212',
  bookNowButtonBorderColor: '#BDBDBD',
  bookNowButtonBorderWidth: 0,
  bookNowButtonBorderRadius: 8,
};

export const DEFAULT_HERO_CONFIG: HeroConfig = {
  heroImage: 'https://picsum.photos/seed/spa-hero/1600/900',
  heroTitle: 'Discover Your Inner Serenity',
  heroSubtitle: 'Your sanctuary for professional waxing and beauty treatments.',
  heroOverlayColor: '#000000',
  heroOverlayOpacity: 0.5,
  heroButtonPrimaryBg: DEFAULT_THEME.primary,
  heroButtonPrimaryText: DEFAULT_THEME.textPrimary,
  heroButtonSecondaryBg: 'transparent',
  heroButtonSecondaryText: '#FFFFFF',
  heroButtonSecondaryBorder: '#FFFFFF',
  mediaButtonPhotoBg: DEFAULT_THEME.primary,
  mediaButtonPhotoText: DEFAULT_THEME.textPrimary,
  mediaButtonVideoBg: DEFAULT_THEME.accent,
  mediaButtonVideoText: DEFAULT_THEME.background,
  mediaButtonGalleryBg: DEFAULT_THEME.secondary,
  mediaButtonGalleryText: DEFAULT_THEME.textPrimary,
  mediaButtonGalleryBorder: DEFAULT_THEME.primary,
};

export const DEFAULT_FONT_CONFIG: FontConfig = {
  headingFont: "'Montserrat', sans-serif",
  bodyFont: "'Roboto', sans-serif",
};

export const DEFAULT_SERVICES: Service[] = [
  {
    id: 1,
    name: 'Luxury Facial Treatment',
    description: 'A rejuvenating facial treatment customized to your skin type. Includes cleansing, exfoliation, extraction, massage, and a nourishing mask.',
    price: '$120',
    photoUrl: 'https://picsum.photos/seed/facial/600/400',
    videoUrl: 'https://www.youtube.com/watch?v=9g2wG8onorI',
    videoOrientation: 'landscape',
    layout: 'standard',
    promotion: 'Popular',
    discountPercentage: 0,
    showInPopup: false,
  },
  {
    id: 2,
    name: 'Full Leg Waxing',
    description: 'Our professional waxing service leaves your legs smooth and hair-free for weeks. We use high-quality, gentle wax for sensitive skin.',
    price: '$75',
    photoUrl: 'https://picsum.photos/seed/legwax/600/400',
    videoUrl: '',
    videoOrientation: 'landscape',
    layout: 'standard',
    promotion: '20% Off',
    discountPercentage: 20,
    showInPopup: false,
  },
  {
    id: 3,
    name: 'Eyebrow Shaping & Tinting',
    description: 'Perfectly sculpted and tinted eyebrows to frame your face. Our experts will create the ideal shape and color to enhance your features.',
    price: '$45',
    photoUrl: 'https://picsum.photos/seed/eyebrow/600/400',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoOrientation: 'landscape',
    layout: 'standard',
    promotion: '',
    discountPercentage: 0,
    showInPopup: false,
  },
   {
    id: 4,
    name: 'Relaxing Swedish Massage',
    description: 'A classic full-body massage using long, flowing strokes to reduce tension, improve circulation, and promote deep relaxation.',
    price: '$95 / 60 min',
    photoUrl: 'https://picsum.photos/seed/massage/600/400',
    videoUrl: '',
    videoOrientation: 'landscape',
    layout: 'standard',
    promotion: 'New!',
    discountPercentage: 0,
    showInPopup: false,
  },
];

export const DEFAULT_FEATURED_SERVICES: Service[] = [
  {
    id: 101,
    name: 'Featured Facial',
    description: 'An exclusive facial treatment only available for a limited time. Experience pure bliss.',
    price: '$150',
    photoUrl: 'https://picsum.photos/seed/feature1/600/400',
    videoUrl: '',
    videoOrientation: 'landscape',
    layout: 'standard',
    promotion: 'Homepage Special',
    discountPercentage: 10,
    showInPopup: true,
    showOnServicesPage: false,
  },
  {
    id: 102,
    name: 'Deluxe Pedicure',
    description: 'Pamper your feet with our deluxe pedicure, including a soak, scrub, mask, and massage.',
    price: '$85',
    photoUrl: 'https://picsum.photos/seed/feature2/600/400',
    videoUrl: '',
    videoOrientation: 'landscape',
    layout: 'standard',
    promotion: 'Must Try!',
    discountPercentage: 0,
    showInPopup: true,
    showOnServicesPage: false,
  },
  {
    id: 103,
    name: 'Hot Stone Massage',
    description: 'Melt away tension with our hot stone massage, using smooth, heated stones for deep relaxation.',
    price: '$110 / 75 min',
    photoUrl: 'https://picsum.photos/seed/feature3/600/400',
    videoUrl: '',
    videoOrientation: 'landscape',
    layout: 'standard',
    promotion: 'Fan Favorite',
    discountPercentage: 0,
    showInPopup: true,
    showOnServicesPage: false,
  },
  {
    id: 104,
    name: 'Full Body Scrub',
    description: 'Exfoliate and hydrate your skin with our invigorating full-body scrub treatment.',
    price: '$90',
    photoUrl: 'https://picsum.photos/seed/feature4/600/400',
    videoUrl: '',
    videoOrientation: 'landscape',
    layout: 'standard',
    promotion: '',
    discountPercentage: 0,
    showInPopup: false,
    showOnServicesPage: false,
  },
];


export const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  { id: 1, platform: 'instagram', url: 'https://instagram.com' },
  { id: 2, platform: 'facebook', url: 'https://facebook.com' },
  { id: 3, platform: 'twitter', url: 'https://twitter.com' },
];

export const DEFAULT_CUSTOM_FIELDS: CustomFormField[] = [];

export const DEFAULT_REVIEWS: Review[] = [
  {
    id: 1,
    name: 'Jessica M.',
    comment: "An absolutely divine experience! The best facial I've ever had. My skin feels incredible. I'll definitely be back.",
    rating: 5,
    photoUrl: 'https://i.pravatar.cc/150?img=1',
    featured: true,
  },
  {
    id: 2,
    name: 'Sarah L.',
    comment: "The waxing service was so quick and virtually painless. The staff are so professional and friendly. Highly recommend!",
    rating: 5,
    photoUrl: 'https://i.pravatar.cc/150?img=2',
    featured: true,
  },
  {
    id: 3,
    name: 'Emily R.',
    comment: "I floated out of Eden Spa after my massage. A truly relaxing atmosphere and a wonderful escape from the city.",
    rating: 5,
    photoUrl: 'https://i.pravatar.cc/150?img=3',
    featured: true,
  },
  {
    id: 4,
    name: 'Michael B.',
    comment: "Great attention to detail on the eyebrow shaping. The tint color was perfect. Very happy with the result.",
    rating: 4,
    photoUrl: '', // Example with no photo
    featured: false,
  },
];

export const DEFAULT_WHY_CHOOSE_US_ITEMS: WhyChooseUsItem[] = [
  {
    id: 1,
    title: 'Expert Estheticians',
    description: 'Our certified professionals are passionate about their craft and dedicated to providing personalized care.',
  },
  {
    id: 2,
    title: 'Premium Products',
    description: 'We use only high-quality, gentle, and effective products to ensure the best results for your skin.',
  },
  {
    id: 3,
    title: 'Tranquil Atmosphere',
    description: 'Escape the everyday hustle in our serene and beautifully designed sanctuary built for your relaxation.',
  },
];

export const DEFAULT_SEASONAL_OFFER: SeasonalOffer = {
  backgroundImage: 'https://picsum.photos/seed/offer/1200/600',
  title: 'Seasonal Rejuvenation Package',
  description: 'Indulge in our limited-time offer! Get a Luxury Facial and a 30-minute back massage for just $150. A perfect escape to refresh your body and soul.',
  buttonText: 'Claim This Offer',
};

export const DEFAULT_INSTAGRAM_FEED: InstagramFeed = {
  title: 'Follow Our Journey',
  username: '@edenspa_official',
  imageUrls: [
    'https://picsum.photos/seed/insta1/300/300',
    'https://picsum.photos/seed/insta2/300/300',
    'https://picsum.photos/seed/insta3/300/300',
    'https://picsum.photos/seed/insta4/300/300',
    'https://picsum.photos/seed/insta5/300/300',
    'https://picsum.photos/seed/insta6/300/300',
  ],
};


export const DEFAULT_WHATSAPP_NUMBER = '+15551234567';
export const DEFAULT_WHATSAPP_MESSAGE = 'Hello! I am interested in your services.';
export const DEFAULT_CONTACT_EMAIL = 'contact@edenspa.com';
export const DEFAULT_CONTACT_TIP = 'For urgent inquiries, please call us. For all other questions, feel free to use the WhatsApp chat!';
export const DEFAULT_INACTIVITY_TIMEOUT = 7; // seconds
export const DEFAULT_LOGO_URL = '';
export const DEFAULT_BUSINESS_NAME = 'Eden Spa';
export const DEFAULT_TAGLINE = 'Waxing & Beauty';
export const DEFAULT_SHOW_PHOTO_GALLERY = true;
export const DEFAULT_SHOW_VIDEO_GALLERY = true;
export const DEFAULT_SHOW_MAIN_GALLERY = true;
export const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [];
export const DEFAULT_SHOW_DESIGNER_CREDIT = true;
export const DEFAULT_DESIGNER_CREDIT_URL = 'https://x.com/kastebrands';
