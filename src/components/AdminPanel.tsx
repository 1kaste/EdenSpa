

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AppContext, useAppContext } from '../context/AppContext';
import { Theme, Service, SocialLink, SocialPlatform, CustomFormField, CustomFormFieldType, Page, Review, GalleryItem, HeroConfig, FontConfig, WhyChooseUsItem, SeasonalOffer, InstagramFeed, LoginMode } from '../types';
import ColorPicker from './ColorPicker';
import Header from './Header';
import Footer from './Footer';
import LandingPage from '../pages/LandingPage';
import ServicesPage from '../pages/ServicesPage';
import ContactPage from '../pages/ContactPage';
import BookNowPage from '../pages/BookNowPage';
import { DARK_THEME } from '../constants';

const socialPlatformOptions: { value: SocialPlatform; label: string }[] = [
  { value: 'instagram', label: 'Instagram' }, { value: 'facebook', label: 'Facebook' }, { value: 'twitter', label: 'Twitter' }, { value: 'tiktok', label: 'TikTok' }, { value: 'snapchat', label: 'Snapchat' }, { value: 'pinterest', label: 'Pinterest' }, { value: 'youtube', label: 'YouTube' }, { value: 'linkedin', label: 'LinkedIn' }, { value: 'email', label: 'Email' },
];

const slugify = (text: string) => text.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/\s+/g, '_').replace(/[^\w-]+/g, '').replace(/--+/g, '-');

type AdminTab = 'branding' | 'homepage' | 'featured' | 'services' | 'media' | 'reviews' | 'form' | 'settings' | 'developer';

const StarRatingInput = ({ rating, setRating }: { rating: number, setRating: (r: number) => void }) => (
    <div>
        {[1, 2, 3, 4, 5].map(star => (
            <button key={star} onClick={() => setRating(star)} type="button" className="p-1 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded-full">
                <svg className={`w-6 h-6 transition-colors ${star <= rating ? 'text-yellow-400' : 'text-zinc-300 dark:text-zinc-600 hover:text-yellow-300'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.25 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
                </svg>
            </button>
        ))}
    </div>
);

const TabButton = ({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) => {
    const { theme } = useAppContext();
    return (
        <button onClick={onClick} className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-200 ${isActive ? 'shadow-sm' : 'hover:bg-gray-500/10'}`} style={{ backgroundColor: isActive ? theme.primary : 'transparent', color: isActive ? theme.textPrimary : theme.textSecondary }}>
            {icon}
            <span className="font-semibold">{label}</span>
        </button>
    );
};

const PreviewPane: React.FC = () => {
    const [previewPage, _setPreviewPage] = useState<Page>(Page.Home);
    const [targetSection, setTargetSection] = useState<string | null>(null);

    const navigateTo = (page: Page) => {
        const previewContainer = document.getElementById('preview-scroll-container');
        if (page === Page.About) {
            _setPreviewPage(Page.Home);
            setTargetSection('about-us-section');
        } else {
            _setPreviewPage(page);
            setTargetSection(null);
            if (previewContainer) previewContainer.scrollTo({ top: 0, behavior: 'auto' });
        }
    };
    
    useEffect(() => {
        if (targetSection) {
            const timer = setTimeout(() => {
                const previewContainer = document.getElementById('preview-scroll-container');
                const element = document.getElementById(targetSection);
                if (element && previewContainer) {
                    const offsetTop = element.offsetTop;
                    previewContainer.scrollTo({ top: offsetTop, behavior: 'smooth' });
                }
                setTargetSection(null);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [targetSection, previewPage]);

    const renderPreviewPage = () => {
        switch (previewPage) {
            case Page.Home: return <LandingPage setPage={navigateTo} />;
            case Page.Services: return <ServicesPage />;
            case Page.Contact: return <ContactPage />;
            case Page.BookNow: return <BookNowPage />;
            default: return <LandingPage setPage={navigateTo} />;
        }
    };

    return (
        <div id="preview-scroll-container" className="w-full h-full bg-white overflow-y-auto relative" style={{ scrollbarWidth: 'thin' }}>
            <Header setPage={navigateTo} isPreview={true} />
            <main>{renderPreviewPage()}</main>
            <Footer />
        </div>
    );
};

interface AdminPanelProps { isOpen: boolean; onClose: () => void; initialLoginMode: LoginMode | null; }

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, initialLoginMode }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('branding');
  const [controlPanelWidth, setControlPanelWidth] = useState(640);
  const isResizing = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isDevSettingsLocked, setIsDevSettingsLocked] = useState(true);
  const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState(false);
  const [showForceResetModal, setShowForceResetModal] = useState(false);
  const [newUserPassword, setNewUserPassword] = useState('');
  const [devTabPasswordInput, setDevTabPasswordInput] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const listLengths = useRef({ services: 0, reviews: 0, socialLinks: 0, customFields: 0, galleryItems: 0 });
  const appContext = useAppContext();
  const { appData, saveState, theme } = appContext;
  const [draftState, setDraftState] = useState<any>(null);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const inactivityTimeout = appData?.inactivityTimeout ?? 7;

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    if (inactivityTimeout <= 0) return;
    inactivityTimerRef.current = setTimeout(() => onClose(), inactivityTimeout * 1000);
  }, [inactivityTimeout, onClose]);

  useEffect(() => {
    if (isOpen) {
      const panelElement = panelRef.current;
      if (!panelElement) return;
      const events: (keyof DocumentEventMap)[] = ['mousemove', 'keydown', 'click', 'scroll'];
      resetInactivityTimer();
      events.forEach(event => panelElement.addEventListener(event, resetInactivityTimer, true));
      return () => {
        if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
        events.forEach(event => panelElement.removeEventListener(event, resetInactivityTimer, true));
      };
    }
  }, [isOpen, resetInactivityTimer]);

  useEffect(() => {
    if (isOpen && appData) {
        setDraftState(JSON.parse(JSON.stringify(appData)));
        listLengths.current = { services: appData.services.length, reviews: appData.reviews.length, socialLinks: appData.socialLinks.length, customFields: appData.customFields.length, galleryItems: appData.galleryItems.length };
        setIsDirty(false);
        setPasswordUpdateSuccess(false);
        setDevTabPasswordInput('');
        if (initialLoginMode === 'developer') {
            setIsDevSettingsLocked(false);
            setNewUserPassword('');
            setShowForceResetModal(true);
        } else {
            setIsDevSettingsLocked(true);
        }
    }
  }, [isOpen, appData, initialLoginMode]);

  useEffect(() => {
    if (!isOpen || !draftState || !scrollContainerRef.current) return;
    const scroll = () => setTimeout(() => scrollContainerRef.current?.scrollTo({ top: scrollContainerRef.current.scrollHeight, behavior: 'smooth' }), 100);
    let shouldScroll = false;
    if (activeTab === 'services' && draftState.services.length > listLengths.current.services) shouldScroll = true;
    else if (activeTab === 'reviews' && draftState.reviews.length > listLengths.current.reviews) shouldScroll = true;
    else if (activeTab === 'settings' && draftState.socialLinks.length > listLengths.current.socialLinks) shouldScroll = true;
    else if (activeTab === 'form' && draftState.customFields.length > listLengths.current.customFields) shouldScroll = true;
    else if (activeTab === 'media' && draftState.galleryItems.length > listLengths.current.galleryItems) shouldScroll = true;
    if(shouldScroll) scroll();
    listLengths.current = { services: draftState.services.length, reviews: draftState.reviews.length, socialLinks: draftState.socialLinks.length, customFields: draftState.customFields.length, galleryItems: draftState.galleryItems.length };
  }, [draftState, activeTab, isOpen]);

  const updateDraft = (updater: (prevState: any) => any) => { setDraftState(updater); if (!isDirty) setIsDirty(true); };

  const handleSave = () => {
      if (!draftState || (!isDirty && !devTabPasswordInput.trim())) return;
      
      const devSettingsWereActive = !isDevSettingsLocked;
      const stateToSave = { ...draftState };

      if (devTabPasswordInput.trim()) {
        stateToSave.userPassword = devTabPasswordInput.trim();
        setPasswordUpdateSuccess(true);
        setTimeout(() => setPasswordUpdateSuccess(false), 3000);
      }
      
      saveState(stateToSave);
      
      setIsSaved(true);
      setIsDirty(false);
      setDevTabPasswordInput('');
      setTimeout(() => setIsSaved(false), 2000);

      if (devSettingsWereActive) {
          setTimeout(() => {
              onClose();
          }, 500);
      }
  };

  const handleForceResetPassword = () => {
    if (!newUserPassword.trim()) { alert("Password cannot be empty."); return; }
    const stateWithNewPassword = { ...draftState, userPassword: newUserPassword };
    saveState(stateWithNewPassword);
    
    setPasswordUpdateSuccess(true);
    setTimeout(() => setPasswordUpdateSuccess(false), 3000);

    setShowForceResetModal(false);
    setActiveTab('developer');
  };

  const handleResizeMove = useCallback((clientX: number) => { if (!isResizing.current || !panelRef.current) return; const panelLeft = panelRef.current.getBoundingClientRect().left; let newWidth = clientX - panelLeft; const minWidth = 450; const maxWidth = panelRef.current.clientWidth - 400; if (newWidth < minWidth) newWidth = minWidth; if (newWidth > maxWidth) newWidth = maxWidth; setControlPanelWidth(newWidth); }, []);
  const handleMouseMove = useCallback((e: MouseEvent) => handleResizeMove(e.clientX), [handleResizeMove]);
  const handleTouchMove = useCallback((e: TouchEvent) => { if (e.touches.length > 0) handleResizeMove(e.touches[0].clientX); }, [handleResizeMove]);
  const handleResizeEnd = useCallback(() => { isResizing.current = false; document.removeEventListener('mousemove', handleMouseMove); document.removeEventListener('mouseup', handleResizeEnd); document.removeEventListener('touchmove', handleTouchMove); document.removeEventListener('touchend', handleResizeEnd); }, [handleMouseMove, handleTouchMove]);
  const handleResizeStart = useCallback(() => { isResizing.current = true; document.addEventListener('mousemove', handleMouseMove); document.addEventListener('mouseup', handleResizeEnd); document.addEventListener('touchmove', handleTouchMove, { passive: false }); document.addEventListener('touchend', handleResizeEnd); }, [handleMouseMove, handleResizeEnd, handleTouchMove]);
  const handleMouseDown = (e: React.MouseEvent) => { e.preventDefault(); handleResizeStart(); };
  const handleTouchStart = (e: React.TouchEvent) => { e.preventDefault(); handleResizeStart(); };
  useEffect(() => handleResizeEnd, [handleResizeEnd]);

  const handleThemeChange = (key: keyof Theme, value: string | number) => updateDraft(prev => ({ ...prev, lightTheme: { ...prev.lightTheme, [key]: value } }));
  const handleFontConfigChange = (key: keyof FontConfig, value: string) => updateDraft(prev => ({...prev, fontConfig: { ...prev.fontConfig, [key]: value }}));
  const handleHeroConfigChange = (key: keyof HeroConfig, value: string | number) => updateDraft(prev => ({...prev, heroConfig: { ...prev.heroConfig, [key]: value }}));
  const handleServiceChange = (id: number, field: keyof Service, value: any) => updateDraft(prev => ({...prev, services: prev.services.map(s => s.id === id ? { ...s, [field]: value } : s)}));
  const handleFeaturedServiceChange = (index: number, field: keyof Service, value: any) => updateDraft(prev => { const newFeaturedServices = [...prev.featuredServices]; const updatedService = { ...newFeaturedServices[index], [field]: value }; newFeaturedServices[index] = updatedService; let newServices = [...prev.services]; const pushedServiceIndex = newServices.findIndex(s => s.originId === updatedService.id); if (pushedServiceIndex > -1) { const { id, originId, ...restOfUpdatedService } = updatedService; newServices[pushedServiceIndex] = { ...newServices[pushedServiceIndex], ...restOfUpdatedService }; } return { ...prev, featuredServices: newFeaturedServices, services: newServices }; });
  const handleToggleShowOnServicesPage = (index: number, show: boolean) => updateDraft(prev => { const newFeaturedServices = JSON.parse(JSON.stringify(prev.featuredServices)); let newServices = JSON.parse(JSON.stringify(prev.services)); const featuredService = newFeaturedServices[index]; featuredService.showOnServicesPage = show; if (show) { if (!newServices.some((s: Service) => s.originId === featuredService.id)) newServices.push({ ...featuredService, id: Date.now(), originId: featuredService.id }); } else { newServices = newServices.filter((s: Service) => s.originId !== featuredService.id); } return { ...prev, featuredServices: newFeaturedServices, services: newServices }; });
  const addService = () => updateDraft(prev => ({ ...prev, services: [...prev.services, { id: Date.now(), name: 'New Service', description: 'A wonderful new service offering.', price: '$50', photoUrl: `https://picsum.photos/seed/${Date.now()}/600/400`, videoUrl: '', videoOrientation: 'landscape', layout: 'standard', discountPercentage: 0, promotion: '', showInPopup: false }]}));
  const removeService = (id: number) => updateDraft(prev => ({...prev, services: prev.services.filter(s => s.id !== id)}));
  const handleReviewChange = (id: number, field: keyof Omit<Review, 'id'>, value: string | number | boolean) => updateDraft(prev => ({...prev, reviews: prev.reviews.map(r => r.id === id ? { ...r, [field]: value } : r)}));
  const addReview = () => updateDraft(prev => ({...prev, reviews: [{ id: Date.now(), name: 'New Client', comment: '', rating: 5, photoUrl: '', featured: false }, ...prev.reviews]}));
  const removeReview = (id: number) => updateDraft(prev => ({...prev, reviews: prev.reviews.filter(r => r.id !== id)}));
  const handleSocialLinkChange = (id: number, field: keyof Omit<SocialLink, 'id'>, value: string) => updateDraft(prev => ({...prev, socialLinks: prev.socialLinks.map(l => l.id === id ? { ...l, [field]: value } : l)}));
  const addSocialLink = () => updateDraft(prev => ({...prev, socialLinks: [...prev.socialLinks, { id: Date.now(), platform: 'instagram', url: 'https://' }]}));
  const removeSocialLink = (id: number) => updateDraft(prev => ({...prev, socialLinks: prev.socialLinks.filter(l => l.id !== id)}));
  const handleCustomFieldChange = (id: number, field: keyof CustomFormField, value: string | boolean | string[]) => updateDraft(prev => ({...prev, customFields: prev.customFields.map(f => f.id === id ? { ...f, [field]: value } : f)}));
  const addCustomField = () => updateDraft(prev => ({...prev, customFields: [...prev.customFields, { id: Date.now(), label: 'New Field', name: 'new_field_' + Date.now(), type: 'text', required: false, options: [] }]}));
  const removeCustomField = (id: number) => updateDraft(prev => ({...prev, customFields: prev.customFields.filter(f => f.id !== id)}));
  const updateCustomFieldLabel = (id: number, newLabel: string) => updateDraft(prev => ({...prev, customFields: prev.customFields.map(f => f.id === id ? { ...f, label: newLabel, name: slugify(newLabel) } : f)}));
  const handleGalleryItemChange = (id: number, field: keyof GalleryItem, value: any) => updateDraft(prev => ({ ...prev, galleryItems: prev.galleryItems.map(item => item.id === id ? { ...item, [field]: value } : item) }));
  const addGalleryItem = () => updateDraft(prev => ({ ...prev, galleryItems: [...prev.galleryItems, { id: Date.now(), type: 'photo', title: 'New Media', url: `https://picsum.photos/seed/${Date.now()}/600/400`, videoOrientation: 'landscape' }] }));
  const removeGalleryItem = (id: number) => updateDraft(prev => ({ ...prev, galleryItems: prev.galleryItems.filter(item => item.id !== id) }));
  const handleSimpleChange = (key: keyof typeof draftState, value: any) => updateDraft(prev => ({...prev, [key]: value}));
  const handleWhyChooseUsChange = (id: number, field: keyof Omit<WhyChooseUsItem, 'id'>, value: string) => updateDraft(prev => ({...prev, whyChooseUsItems: prev.whyChooseUsItems.map(item => item.id === id ? { ...item, [field]: value } : item)}));
  const handleSeasonalOfferChange = (field: keyof SeasonalOffer, value: string) => updateDraft(prev => ({...prev, seasonalOffer: { ...prev.seasonalOffer, [field]: value }}));
  const handleInstagramFeedChange = (field: keyof Omit<InstagramFeed, 'imageUrls'>, value: string) => updateDraft(prev => ({...prev, instagramFeed: { ...prev.instagramFeed, [field]: value }}));
  const handleInstagramImageChange = (index: number, value: string) => updateDraft(prev => { const newImageUrls = [...prev.instagramFeed.imageUrls]; newImageUrls[index] = value; return { ...prev, instagramFeed: { ...prev.instagramFeed, imageUrls: newImageUrls } }; });

  if (!isOpen) return null;
  if (!draftState) return <div className="fixed inset-0 z-50 bg-white/80 flex items-center justify-center"><p>Loading Editor...</p></div>;
  
  const previewContextValue = { ...appContext, appData: draftState, theme: appContext.isDarkMode ? DARK_THEME : draftState.lightTheme, saveState: () => {}, authenticate: () => Promise.resolve({ success: false }) };
  
  const tabs: { id: AdminTab, label: string, icon: React.ReactNode }[] = [ { id: 'branding', label: 'Branding & Appearance', icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L3 7v10l9 5 9-5V7l-9-5z"/><path d="M3 7l9 5 9-5"/><path d="M12 22V12"/></svg> }, { id: 'homepage', label: 'Homepage Content', icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> }, { id: 'featured', label: 'Featured Services', icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> }, { id: 'services', label: 'Services & Content', icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg> }, { id: 'reviews', label: 'Client Reviews', icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M5 12H3"/><path d="M21 12h-2"/></svg> }, { id: 'media', label: 'Media & Gallery', icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg> }, { id: 'form', label: 'Booking Form', icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> }, { id: 'settings', label: 'Contact & Socials', icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> }, ];
  if (!isDevSettingsLocked) tabs.push({ id: 'developer', label: 'Developer', icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><path d="m3.5 14.5 l7-7"/></svg> });

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" aria-hidden="true"></div>
      <div className="fixed inset-0 z-50 p-4 sm:p-6 md:p-8">
        <div ref={panelRef} className="bg-white dark:bg-zinc-900 w-full h-full rounded-2xl shadow-2xl flex overflow-hidden">
          <div style={{ width: `${controlPanelWidth}px` }} className="flex-shrink-0 p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6 flex-shrink-0">
                <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-200">Admin Panel</h2>
                <div className="flex items-center space-x-2">
                    <button onClick={handleSave} disabled={!isDirty && !devTabPasswordInput.trim()} className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors ${!isDirty && !devTabPasswordInput.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`} style={{backgroundColor: theme.accent, color: theme.background}}>{isSaved ? "Saved!" : "Save Changes"}</button>
                    <button onClick={onClose} className="p-2 rounded-full text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors" aria-label="Close Admin Panel"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
                </div>
              </div>
              <div className="flex space-x-4 flex-1 min-h-0">
                  <div className="w-48 space-y-2 flex-shrink-0">
                    {tabs.map(tab => ( <TabButton key={tab.id} {...tab} isActive={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} /> ))}
                  </div>
                  <div ref={scrollContainerRef} className="flex-1 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                      <div style={{color: theme.textPrimary}}>
                        {activeTab === 'branding' && ( <div className="space-y-8"> <div> <h3 className="text-xl font-semibold border-b pb-2">Branding</h3> <div className="space-y-4 pt-4"> <div><label className="block text-sm font-medium" style={{color: theme.textSecondary}}>Custom Logo URL</label><input type="text" value={draftState.logoUrl} onChange={(e) => handleSimpleChange('logoUrl', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white dark:bg-zinc-800" placeholder="https://example.com/logo.png" /></div> {draftState.logoUrl && <div><label className="block text-sm font-medium" style={{color: theme.textSecondary}}>Logo Preview:</label><div className="mt-2 p-4 border rounded-lg flex items-center justify-center" style={{borderColor: theme.secondary}}><img src={draftState.logoUrl} alt="Logo Preview" className="max-h-16" /></div></div>} <div><label className="block text-sm font-medium" style={{color: theme.textSecondary}}>Business Name</label><input type="text" value={draftState.businessName} onChange={(e) => handleSimpleChange('businessName', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white dark:bg-zinc-800" /></div> <div><label className="block text-sm font-medium" style={{color: theme.textSecondary}}>Tagline</label><input type="text" value={draftState.tagline} onChange={(e) => handleSimpleChange('tagline', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white dark:bg-zinc-800" /></div> </div> </div> <div> <h3 className="text-xl font-semibold border-b pb-2 pt-4">Theme Colors</h3> {appContext.isDarkMode && <div className="p-3 my-4 rounded-lg text-sm bg-yellow-100 text-yellow-800">You are editing the <strong>Light Theme</strong>. Your changes apply in light mode.</div>} <div className="grid grid-cols-2 gap-4 pt-4"><ColorPicker label="Primary" color={draftState.lightTheme.primary} onChange={(c) => handleThemeChange('primary', c)} /><ColorPicker label="Secondary" color={draftState.lightTheme.secondary} onChange={(c) => handleThemeChange('secondary', c)} /><ColorPicker label="Accent" color={draftState.lightTheme.accent} onChange={(c) => handleThemeChange('accent', c)} /><ColorPicker label="Background" color={draftState.lightTheme.background} onChange={(c) => handleThemeChange('background',c)} /><ColorPicker label="Text Primary" color={draftState.lightTheme.textPrimary} onChange={(c) => handleThemeChange('textPrimary', c)} /><ColorPicker label="Text Secondary" color={draftState.lightTheme.textSecondary} onChange={(c) => handleThemeChange('textSecondary', c)} /></div> </div> <div> <h3 className="text-xl font-semibold border-b pb-2 pt-4">Fonts</h3> <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4"> <div> <label className="block text-sm font-medium" style={{color: theme.textSecondary}}>Heading Font</label> <select value={draftState.fontConfig.headingFont} onChange={(e) => handleFontConfigChange('headingFont', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white dark:bg-zinc-800"> <option value="'Playfair Display', serif">Playfair Display</option> <option value="'Roboto', sans-serif">Roboto</option> <option value="'Montserrat', sans-serif">Montserrat</option> <option value="'Lato', sans-serif">Lato</option> </select> </div> <div> <label className="block text-sm font-medium" style={{color: theme.textSecondary}}>Body Font</label> <select value={draftState.fontConfig.bodyFont} onChange={(e) => handleFontConfigChange('bodyFont', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white dark:bg-zinc-800"> <option value="'Lato', sans-serif">Lato</option> <option value="'Roboto', sans-serif">Roboto</option> <option value="'Montserrat', sans-serif">Montserrat</option> <option value="'Playfair Display', serif">Playfair Display</option> </select> </div> </div> </div> <div> <h3 className="text-xl font-semibold border-b pb-2 pt-4">Floating Header</h3> {appContext.isDarkMode && <div className="p-3 my-4 rounded-lg text-sm bg-yellow-100 text-yellow-800">You are editing settings for the <strong>Light Theme</strong> header.</div>} <div className="space-y-4 pt-4"> <div className="grid grid-cols-2 gap-6 items-center"> <ColorPicker label="Header Background" color={draftState.lightTheme.headerBg || '#ffffff'} onChange={(c) => handleThemeChange('headerBg', c)} /> <div> <label className="block text-sm font-medium" style={{ color: theme.textSecondary }}> Background Opacity ({Number(draftState.lightTheme.headerBgOpacity ?? 0.5).toFixed(2)}) </label> <input type="range" min="0" max="1" step="0.05" value={draftState.lightTheme.headerBgOpacity ?? 0.5} onChange={(e) => handleThemeChange('headerBgOpacity', parseFloat(e.target.value))} className="mt-1 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" /> </div> </div> <div className="pt-4"> <ColorPicker label="Header Text" color={draftState.lightTheme.headerText || '#2d2d2d'} onChange={(c) => handleThemeChange('headerText', c)} /> </div> </div> </div> <div> <h3 className="text-xl font-semibold border-b pb-2 pt-4">"Book Now" Button (Header)</h3> {appContext.isDarkMode && <div className="p-3 my-4 rounded-lg text-sm bg-yellow-100 text-yellow-800">You are editing settings for the <strong>Light Theme</strong> button.</div>} <div className="space-y-4 pt-4"> <div className="grid grid-cols-2 gap-6 items-center"> <ColorPicker label="Background Color" color={draftState.lightTheme.bookNowButtonBg || ''} onChange={(c) => handleThemeChange('bookNowButtonBg', c)} /> <ColorPicker label="Text Color" color={draftState.lightTheme.bookNowButtonText || ''} onChange={(c) => handleThemeChange('bookNowButtonText', c)} /> </div> <div className="grid grid-cols-2 gap-6 items-center pt-4"> <div> <label className="block text-sm font-medium" style={{ color: theme.textSecondary }}> Border Radius ({draftState.lightTheme.bookNowButtonBorderRadius ?? 8}px) </label> <input type="range" min="0" max="50" step="1" value={draftState.lightTheme.bookNowButtonBorderRadius ?? 8} onChange={(e) => handleThemeChange('bookNowButtonBorderRadius', parseInt(e.target.value, 10))} className="mt-1 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" /> </div> <div> <label className="block text-sm font-medium" style={{ color: theme.textSecondary }}> Border Width ({draftState.lightTheme.bookNowButtonBorderWidth ?? 0}px) </label> <input type="range" min="0" max="10" step="1" value={draftState.lightTheme.bookNowButtonBorderWidth ?? 0} onChange={(e) => handleThemeChange('bookNowButtonBorderWidth', parseInt(e.target.value, 10))} className="mt-1 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" /> </div> </div> {(draftState.lightTheme.bookNowButtonBorderWidth ?? 0) > 0 && ( <div className="pt-4"> <ColorPicker label="Border Color" color={draftState.lightTheme.bookNowButtonBorderColor || ''} onChange={(c) => handleThemeChange('bookNowButtonBorderColor', c)} /> </div> )} </div> </div> <div> <h3 className="text-xl font-semibold border-b pb-2 pt-4">Hero Section</h3> <div className="space-y-4 pt-4"> <div><label className="block text-sm font-medium" style={{color: theme.textSecondary}}>Hero Image URL</label><input type="text" value={draftState.heroConfig.heroImage} onChange={(e) => handleHeroConfigChange('heroImage', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white dark:bg-zinc-800" /></div> <div><label className="block text-sm font-medium" style={{color: theme.textSecondary}}>Hero Title</label><input type="text" value={draftState.heroConfig.heroTitle} onChange={(e) => handleHeroConfigChange('heroTitle', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white dark:bg-zinc-800" /></div> <div><label className="block text-sm font-medium" style={{color: theme.textSecondary}}>Hero Subtitle</label><textarea value={draftState.heroConfig.heroSubtitle} onChange={(e) => handleHeroConfigChange('heroSubtitle', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white dark:bg-zinc-800" rows={2}></textarea></div> <h4 className="text-lg font-semibold pt-4 border-t" style={{borderColor: theme.secondary}}>Hero Overlay</h4> <div className="grid grid-cols-2 gap-6 items-center"> <ColorPicker label="Overlay Color" color={draftState.heroConfig.heroOverlayColor} onChange={(c) => handleHeroConfigChange('heroOverlayColor', c)} /> <div> <label className="block text-sm font-medium" style={{ color: theme.textSecondary }}> Overlay Opacity ({Number(draftState.heroConfig.heroOverlayOpacity).toFixed(2)}) </label> <input type="range" min="0" max="1" step="0.05" value={draftState.heroConfig.heroOverlayOpacity} onChange={(e) => handleHeroConfigChange('heroOverlayOpacity', parseFloat(e.target.value))} className="mt-1 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" /> </div> </div> <h4 className="text-lg font-semibold pt-4 border-t" style={{borderColor: theme.secondary}}>Hero Buttons</h4> <div className="grid grid-cols-2 gap-4"> <ColorPicker label="Primary Btn BG" color={draftState.heroConfig.heroButtonPrimaryBg} onChange={(c) => handleHeroConfigChange('heroButtonPrimaryBg', c)} /> <ColorPicker label="Primary Btn Text" color={draftState.heroConfig.heroButtonPrimaryText} onChange={(c) => handleHeroConfigChange('heroButtonPrimaryText', c)} /> <ColorPicker label="Secondary Btn BG" color={draftState.heroConfig.heroButtonSecondaryBg} onChange={(c) => handleHeroConfigChange('heroButtonSecondaryBg', c)} /> <ColorPicker label="Secondary Btn Text" color={draftState.heroConfig.heroButtonSecondaryText} onChange={(c) => handleHeroConfigChange('heroButtonSecondaryText', c)} /> <ColorPicker label="Secondary Btn Border" color={draftState.heroConfig.heroButtonSecondaryBorder} onChange={(c) => handleHeroConfigChange('heroButtonSecondaryBorder', c)} /> </div> </div> </div> <div> <h3 className="text-xl font-semibold border-b pb-2 pt-4">Media Page Buttons</h3> <div className="space-y-4 pt-4"> <p className="text-xs italic" style={{color: theme.textSecondary}}>Customize the media toggle buttons on the Services page.</p> <div className="grid grid-cols-2 gap-4"> <ColorPicker label="Photo Tab BG" color={draftState.heroConfig.mediaButtonPhotoBg} onChange={(c) => handleHeroConfigChange('mediaButtonPhotoBg', c)} /> <ColorPicker label="Photo Tab Text" color={draftState.heroConfig.mediaButtonPhotoText} onChange={(c) => handleHeroConfigChange('mediaButtonPhotoText', c)} /> <ColorPicker label="Video Tab BG" color={draftState.heroConfig.mediaButtonVideoBg} onChange={(c) => handleHeroConfigChange('mediaButtonVideoBg', c)} /> <ColorPicker label="Video Tab Text" color={draftState.heroConfig.mediaButtonVideoText} onChange={(c) => handleHeroConfigChange('mediaButtonVideoText', c)} /> <ColorPicker label="Gallery Tab BG" color={draftState.heroConfig.mediaButtonGalleryBg} onChange={(c) => handleHeroConfigChange('mediaButtonGalleryBg', c)} /> <ColorPicker label="Gallery Tab Text" color={draftState.heroConfig.mediaButtonGalleryText} onChange={(c) => handleHeroConfigChange('mediaButtonGalleryText', c)} /> <ColorPicker label="Gallery Tab Border" color={draftState.heroConfig.mediaButtonGalleryBorder} onChange={(c) => handleHeroConfigChange('mediaButtonGalleryBorder', c)} /> </div> </div> </div> </div> )}
                        {activeTab === 'homepage' && ( <div className="space-y-8"> <div> <h3 className="text-xl font-semibold border-b pb-2">"Why Choose Us" Section</h3> <div className="space-y-6 pt-4"> {draftState.whyChooseUsItems.map((item: WhyChooseUsItem, index: number) => ( <div key={item.id} className="p-4 border rounded-lg" style={{borderColor: theme.secondary}}> <h4 className="font-bold text-lg mb-2">Feature #{index + 1}</h4> <div><label className="block text-sm font-medium" style={{color: theme.textSecondary}}>Title</label><input type="text" value={item.title} onChange={e => handleWhyChooseUsChange(item.id, 'title', e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-zinc-800"/></div> <div><label className="block text-sm font-medium mt-2" style={{color: theme.textSecondary}}>Description</label><textarea value={item.description} onChange={e => handleWhyChooseUsChange(item.id, 'description', e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-zinc-800" rows={3}></textarea></div> </div> ))} </div> </div> <div> <h3 className="text-xl font-semibold border-b pb-2 pt-4">Special Offer Section</h3> <div className="space-y-4 pt-4 p-4 border rounded-lg" style={{borderColor: theme.secondary}}> <div><label className="block text-sm font-medium" style={{color: theme.textSecondary}}>Background Image URL</label><input type="text" value={draftState.seasonalOffer.backgroundImage} onChange={e => handleSeasonalOfferChange('backgroundImage', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white dark:bg-zinc-800" /></div> <div><label className="block text-sm font-medium" style={{color: theme.textSecondary}}>Title</label><input type="text" value={draftState.seasonalOffer.title} onChange={e => handleSeasonalOfferChange('title', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white dark:bg-zinc-800" /></div> <div><label className="block text-sm font-medium" style={{color: theme.textSecondary}}>Description</label><textarea value={draftState.seasonalOffer.description} onChange={e => handleSeasonalOfferChange('description', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white dark:bg-zinc-800" rows={3}></textarea></div> <div><label className="block text-sm font-medium" style={{color: theme.textSecondary}}>Button Text</label><input type="text" value={draftState.seasonalOffer.buttonText} onChange={e => handleSeasonalOfferChange('buttonText', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white dark:bg-zinc-800" /></div> </div> </div> <div> <h3 className="text-xl font-semibold border-b pb-2 pt-4">Instagram Feed Section</h3> <div className="space-y-4 pt-4 p-4 border rounded-lg" style={{borderColor: theme.secondary}}> <div><label className="block text-sm font-medium" style={{color: theme.textSecondary}}>Title</label><input type="text" value={draftState.instagramFeed.title} onChange={e => handleInstagramFeedChange('title', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white dark:bg-zinc-800" /></div> <div><label className="block text-sm font-medium" style={{color: theme.textSecondary}}>Username (e.g. @username)</label><input type="text" value={draftState.instagramFeed.username} onChange={e => handleInstagramFeedChange('username', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white dark:bg-zinc-800" /></div> <h4 className="text-lg font-semibold pt-4 border-t" style={{borderColor: theme.secondary}}>Image URLs</h4> <div className="grid grid-cols-2 gap-4"> {draftState.instagramFeed.imageUrls.map((url: string, index: number) => ( <div key={index}> <label className="block text-sm font-medium" style={{color: theme.textSecondary}}>Image #{index + 1}</label> <input type="text" value={url} onChange={e => handleInstagramImageChange(index, e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white dark:bg-zinc-800" /> </div> ))} </div> </div> </div> </div> )}
                        {activeTab === 'featured' && ( <div> <h3 className="text-xl font-semibold mb-4 border-b pb-2">Manage Featured Services</h3> <p className="text-sm mb-6" style={{color: theme.textSecondary}}> Edit the 4 services that appear on your homepage. You can also select which ones to show in the initial popup or push to the main services page. </p> <div className="space-y-6"> {draftState.featuredServices.map((service: Service, index: number) => ( <div key={service.id} className="p-4 border rounded-lg" style={{borderColor: theme.secondary}}> <div className="flex justify-between items-center mb-4"> <h4 className="font-bold text-lg">Featured Slot #{index + 1}</h4> </div> <div className="space-y-2"> <div><label className="block text-sm font-medium" style={{color: theme.textSecondary}}>Name</label><input type="text" value={service.name} onChange={e => handleFeaturedServiceChange(index, 'name', e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-zinc-800"/></div> <div><label className="block text-sm font-medium" style={{color: theme.textSecondary}}>Price</label><input type="text" value={service.price} onChange={e => handleFeaturedServiceChange(index, 'price', e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-zinc-800"/></div> <div><label className="block text-sm font-medium" style={{color: theme.textSecondary}}>Photo URL</label><input type="text" value={service.photoUrl} onChange={e => handleFeaturedServiceChange(index, 'photoUrl', e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-zinc-800"/></div> <div><label className="block text-sm font-medium" style={{color: theme.textSecondary}}>Description</label><textarea value={service.description} onChange={e => handleFeaturedServiceChange(index, 'description', e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-zinc-800" rows={3}></textarea></div> <div><label className="block text-sm font-medium" style={{color: theme.textSecondary}}>Promotion Badge</label><input type="text" value={service.promotion || ''} onChange={e => handleFeaturedServiceChange(index, 'promotion', e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-zinc-800" placeholder="e.g., Sale, New!"/></div> </div> <div className="mt-4 pt-4 border-t" style={{borderColor: theme.secondary}}> <div className="flex items-center mb-2"> <input type="checkbox" id={`showInPopup-${service.id}`} checked={!!service.showInPopup} onChange={e => handleFeaturedServiceChange(index, 'showInPopup', e.target.checked)} className="h-4 w-4 rounded" /> <label htmlFor={`showInPopup-${service.id}`} className="ml-2 block text-sm font-medium">Show in Popup</label> </div> <div className="flex items-center"> <input type="checkbox" id={`showOnServices-${service.id}`} checked={!!service.showOnServicesPage} onChange={e => handleToggleShowOnServicesPage(index, e.target.checked)} className="h-4 w-4 rounded" /> <label htmlFor={`showOnServices-${service.id}`} className="ml-2 block text-sm font-medium">Show on Services Page</label> </div> </div> </div> ))} </div> </div> )}
                        {activeTab === 'services' && ( <div> <h3 className="text-xl font-semibold mb-4 border-b pb-2">Manage Services</h3> <button onClick={addService} className="w-full text-center py-2 mb-4 rounded-md" style={{backgroundColor: theme.accent, color: theme.background}}>+ Add New Service</button> <div className="space-y-6"> {draftState.services.map((service:Service) => ( <div key={service.id} className={`p-4 border rounded-lg transition-opacity ${service.originId ? 'opacity-70' : ''}`} style={{borderColor: theme.secondary, backgroundColor: service.originId ? theme.secondary : 'transparent' }}> <fieldset disabled={!!service.originId}> <div className="flex justify-between items-center mb-2"> <h4 className="font-bold text-lg">{service.name}</h4> <button onClick={() => removeService(service.id)} className="text-red-500 p-1 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!!service.originId}> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg> </button> </div> {service.originId && ( <div className="text-xs p-2 rounded-md mb-3 text-center" style={{ backgroundColor: theme.accent, color: theme.background }}> Managed from 'Featured Services' tab. </div> )} <div className="mb-4"> <label className="block text-sm font-medium" style={{color: theme.textSecondary}}>Card Layout</label> <select value={service.layout || 'standard'} onChange={e => handleServiceChange(service.id, 'layout', e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-zinc-800"> <option value="standard">Standard (with media & description)</option> <option value="compact">Compact (name, price & photo)</option> </select> </div> <div className="mb-2"><label className="block text-sm font-medium capitalize" style={{color: theme.textSecondary}}>Name</label><input type="text" value={service.name} onChange={e => handleServiceChange(service.id, 'name', e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-zinc-800"/></div> <div className="mb-2"><label className="block text-sm font-medium capitalize" style={{color: theme.textSecondary}}>Price</label><input type="text" value={service.price} onChange={e => handleServiceChange(service.id, 'price', e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-zinc-800"/></div> <div className="mb-2"><label className="block text-sm font-medium capitalize" style={{color: theme.textSecondary}}>Photo URL</label><input type="text" placeholder="https://..." value={service.photoUrl} onChange={e => handleServiceChange(service.id, 'photoUrl', e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-zinc-800"/></div> {(service.layout === 'standard' || !service.layout) && ( <> <div className="mb-2"><label className="block text-sm font-medium capitalize" style={{color: theme.textSecondary}}>Description</label><textarea value={service.description} onChange={e => handleServiceChange(service.id, 'description', e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-zinc-800" rows={3}></textarea></div> <div className="mb-2"><label className="block text-sm font-medium capitalize" style={{color: theme.textSecondary}}>Video URL</label><input type="text" placeholder="https://youtube.com/watch?v=..." value={service.videoUrl} onChange={e => handleServiceChange(service.id, 'videoUrl', e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-zinc-800"/></div> {service.videoUrl && ( <div className="mb-2"><label className="block text-sm font-medium" style={{color: theme.textSecondary}}>Video Orientation</label><select value={service.videoOrientation || 'landscape'} onChange={e => handleServiceChange(service.id, 'videoOrientation', e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-zinc-800"><option value="landscape">Landscape (16:9)</option><option value="portrait">Portrait (9:16)</option></select></div> )} <div className="mb-2"><label className="block text-sm font-medium" style={{color: theme.textSecondary}}>Discount Percentage</label><input type="number" value={service.discountPercentage || ''} onChange={e => handleServiceChange(service.id, 'discountPercentage', Number(e.target.value))} className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-zinc-800" placeholder="e.g., 15 for 15%"/></div> <div className="mb-2"><label className="block text-sm font-medium" style={{color: theme.textSecondary}}>Promotion Badge</label><input type="text" value={service.promotion || ''} onChange={e => handleServiceChange(service.id, 'promotion', e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-zinc-800" placeholder="e.g., Sale, New!"/></div> </> )} </fieldset> </div> ))} </div> </div> )}
                        {activeTab === 'reviews' && ( <div> <h3 className="text-xl font-semibold mb-4 border-b pb-2">Manage Client Reviews</h3> <button onClick={addReview} className="w-full text-center py-2 mb-4 rounded-md" style={{backgroundColor: theme.accent, color: theme.background}}>+ Add New Review</button> <div className="space-y-6"> {draftState.reviews.map((review: Review) => ( <div key={review.id} className="p-4 border rounded-lg" style={{borderColor: theme.secondary}}> <div className="flex justify-between items-start mb-2"> <div className="flex-1 space-y-2"><label className="block text-sm font-medium">Rating</label><StarRatingInput rating={review.rating} setRating={(r) => handleReviewChange(review.id, 'rating', r)} /></div> <button onClick={() => removeReview(review.id)} className="text-red-500 p-1 flex-shrink-0"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button> </div> <div className="mb-2"><label className="block text-sm font-medium" style={{color: theme.textSecondary}}>Client Name</label><input type="text" value={review.name} onChange={e => handleReviewChange(review.id, 'name', e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-zinc-800"/></div> <div className="mb-2"><label className="block text-sm font-medium" style={{color: theme.textSecondary}}>Comment</label><textarea value={review.comment} onChange={e => handleReviewChange(review.id, 'comment', e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-zinc-800" rows={3}></textarea></div> <div className="mb-2"><label className="block text-sm font-medium" style={{color: theme.textSecondary}}>Client Photo URL</label><input type="text" value={review.photoUrl} onChange={e => handleReviewChange(review.id, 'photoUrl', e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-zinc-800" placeholder="https://..." /></div> <div className="flex items-center"><input type="checkbox" id={`featured-${review.id}`} checked={review.featured} onChange={e => handleReviewChange(review.id, 'featured', e.target.checked)} className="h-4 w-4 rounded" /><label htmlFor={`featured-${review.id}`} className="ml-3 block text-sm font-medium">Feature on Homepage</label></div> </div> ))} </div> </div> )}
                        {activeTab === 'media' && ( <div className="space-y-8"> <h3 className="text-xl font-semibold border-b pb-2">Service-based Galleries</h3> <div className="space-y-3 p-4 border rounded-lg" style={{borderColor: theme.secondary}}> <div className="flex items-center"><input type="checkbox" id="showPhotoGallery" checked={draftState.showPhotoGallery} onChange={e => handleSimpleChange('showPhotoGallery', e.target.checked)} className="h-4 w-4 rounded" /><label htmlFor="showPhotoGallery" className="ml-3 block text-sm font-medium">Show Service Photo Gallery</label></div> <div className="flex items-center"><input type="checkbox" id="showVideoGallery" checked={draftState.showVideoGallery} onChange={e => handleSimpleChange('showVideoGallery', e.target.checked)} className="h-4 w-4 rounded" /><label htmlFor="showVideoGallery" className="ml-3 block text-sm font-medium">Show Service Video Gallery</label></div> </div> <h3 className="text-xl font-semibold border-b pb-2 pt-4">Main Gallery</h3> <div className="space-y-3 p-4 border rounded-lg" style={{borderColor: theme.secondary}}> <div className="flex items-center"><input type="checkbox" id="showMainGallery" checked={draftState.showMainGallery} onChange={e => handleSimpleChange('showMainGallery', e.target.checked)} className="h-4 w-4 rounded" /><label htmlFor="showMainGallery" className="ml-3 block text-sm font-medium">Show Main Gallery on website</label></div> </div> <button onClick={addGalleryItem} className="w-full text-center py-2 mb-4 rounded-md" style={{backgroundColor: theme.accent, color: theme.background}}>+ Add New Media Item</button> <div className="space-y-6"> {draftState.galleryItems.map((item: GalleryItem) => ( <div key={item.id} className="p-4 border rounded-lg" style={{borderColor: theme.secondary}}> <div className="flex justify-between items-center mb-2"><h4 className="font-bold text-lg">{item.title}</h4><button onClick={() => removeGalleryItem(item.id)} className="text-red-500 p-1"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button></div> <div className="mb-2"><label className="block text-sm font-medium">Title</label><input type="text" value={item.title} onChange={e => handleGalleryItemChange(item.id, 'title', e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-zinc-800"/></div> <div className="mb-2"><label className="block text-sm font-medium">URL (Photo or YouTube)</label><input type="text" value={item.url} onChange={e => handleGalleryItemChange(item.id, 'url', e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-zinc-800"/></div> <div className="mb-2"><label className="block text-sm font-medium">Type</label><select value={item.type} onChange={e => handleGalleryItemChange(item.id, 'type', e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-zinc-800"><option value="photo">Photo</option><option value="video">Video</option></select></div> {item.type === 'video' && (<div className="mb-2"><label className="block text-sm font-medium">Video Orientation</label><select value={item.videoOrientation || 'landscape'} onChange={e => handleGalleryItemChange(item.id, 'videoOrientation', e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-zinc-800"><option value="landscape">Landscape (16:9)</option><option value="portrait">Portrait (9:16)</option></select></div>)} </div> ))} </div> </div> )}
                        {activeTab === 'form' && ( <div> <h3 className="text-xl font-semibold mb-4 border-b pb-2">Customize Booking Form</h3> <button onClick={addCustomField} className="w-full text-center py-2 mb-4 rounded-md" style={{backgroundColor: theme.accent, color: theme.background}}>+ Add Custom Field</button> <div className="space-y-6"> {draftState.customFields.map((field: CustomFormField) => ( <div key={field.id} className="p-4 border rounded-lg" style={{borderColor: theme.secondary}}><div className="flex justify-between items-center mb-4"><h4 className="font-bold text-lg">{field.label}</h4><button onClick={() => removeCustomField(field.id)} className="text-red-500 p-1"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button></div><div className="space-y-3"><div><label className="block text-sm font-medium">Field Label</label><input type="text" value={field.label} onChange={e => updateCustomFieldLabel(field.id, e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-zinc-800"/></div><div><label className="block text-sm font-medium">Field Type</label><select value={field.type} onChange={e => handleCustomFieldChange(field.id, 'type', e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-zinc-800"><option value="text">Text</option><option value="textarea">Textarea</option><option value="select">Select</option></select></div>{field.type === 'select' && (<div><label className="block text-sm font-medium">Options (comma-separated)</label><textarea value={field.options?.join(', ') || ''} onChange={e => handleCustomFieldChange(field.id, 'options', e.target.value.split(',').map(s => s.trim()))} className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-zinc-800" rows={2}/></div>)}<div className="flex items-center"><input type="checkbox" id={`required-${field.id}`} checked={field.required} onChange={e => handleCustomFieldChange(field.id, 'required', e.target.checked)} className="h-4 w-4 rounded"/><label htmlFor={`required-${field.id}`} className="ml-2 block text-sm">Required</label></div></div></div>))} </div> </div> )}
                        {activeTab === 'settings' && ( <div className="space-y-8"> <h3 className="text-xl font-semibold border-b pb-2">Contact Settings</h3> <div className="space-y-4"> <div> <label className="block text-sm font-medium">WhatsApp Number</label> <p className="text-xs italic" style={{color: theme.textSecondary}}>Include country code, e.g., +15551234567</p> <input type="text" value={draftState.whatsappNumber} onChange={e => handleSimpleChange('whatsappNumber', e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-zinc-800" /> </div> <div> <label className="block text-sm font-medium">Contact Email Address</label> <input type="email" value={draftState.contactEmail} onChange={e => handleSimpleChange('contactEmail', e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-zinc-800" /> </div> <div> <label className="block text-sm font-medium">Default WhatsApp Message</label> <p className="text-xs italic" style={{color: theme.textSecondary}}>Optional: Pre-fill the message for users.</p> <textarea value={draftState.whatsappMessage} onChange={e => handleSimpleChange('whatsappMessage', e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-zinc-800" rows={3}/> </div> <div> <label className="block text-sm font-medium">Contact Page Tip</label> <p className="text-xs italic" style={{color: theme.textSecondary}}>A short message displayed on the contact page.</p> <textarea value={draftState.contactTip} onChange={e => handleSimpleChange('contactTip', e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-zinc-800" rows={3}/> </div> </div> <h3 className="text-xl font-semibold border-b pb-2 pt-4">Manage Social Links</h3> <button onClick={addSocialLink} className="w-full text-center py-2 mb-4 rounded-md" style={{backgroundColor: theme.accent, color: theme.background}}>+ Add New Social Link</button> <div className="space-y-4"> {draftState.socialLinks.map((link: SocialLink) => ( <div key={link.id} className="p-4 border rounded-lg" style={{borderColor: theme.secondary}}> <div className="flex justify-between items-center mb-2"><h4 className="font-bold text-lg capitalize">{link.platform}</h4><button onClick={() => removeSocialLink(link.id)} className="text-red-500 p-1"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button></div> <div className="mb-2"><label className="block text-sm font-medium">Platform</label><select value={link.platform} onChange={e => handleSocialLinkChange(link.id, 'platform', e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-zinc-800">{socialPlatformOptions.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}</select></div> <div className="mb-2"><label className="block text-sm font-medium">URL</label><input type="text" value={link.url} onChange={e => handleSocialLinkChange(link.id, 'url', e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-zinc-800"/></div> </div> ))} </div> </div> )}
                        {activeTab === 'developer' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold border-b pb-2">Developer Settings</h3>
                                <div className="space-y-4 p-4 border rounded-lg" style={{borderColor: theme.secondary}}>
                                    <div className="flex items-center">
                                        <input type="checkbox" id="showDesignerCredit" checked={draftState.showDesignerCredit} onChange={e => handleSimpleChange('showDesignerCredit', e.target.checked)} className="h-4 w-4 rounded" />
                                        <label htmlFor="showDesignerCredit" className="ml-3 block text-sm font-medium">Show 'Designed by Kaste Brands' credit</label>
                                    </div>
                                    {draftState.showDesignerCredit && (
                                      <div>
                                        <label className="block text-sm font-medium mt-2" style={{color: theme.textSecondary}}>Credit Link URL</label>
                                        <input type="text" value={draftState.designerCreditUrl} onChange={(e) => handleSimpleChange('designerCreditUrl', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white dark:bg-zinc-800" placeholder="https://example.com" />
                                      </div>
                                    )}
                                </div>
                                <h3 className="text-xl font-semibold border-b pb-2">Security</h3>
                                <div className="space-y-6 p-4 border rounded-lg" style={{borderColor: theme.secondary}}>
                                    <div>
                                        <label className="block text-sm font-medium" style={{color: theme.textSecondary}}>Update User Admin Password</label>
                                        <p className="text-xs italic" style={{color: theme.textSecondary}}>Enter a new password to update it. Leave blank to keep the current one.</p>
                                        <input type="text" value={devTabPasswordInput} onChange={(e) => setDevTabPasswordInput(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white dark:bg-zinc-800" placeholder="Enter new password" />
                                        {passwordUpdateSuccess && <p className="text-green-600 text-sm mt-2">User password updated successfully!</p> }
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium" style={{color: theme.textSecondary}}>Auto-lock Timeout (seconds)</label>
                                        <p className="text-xs italic" style={{color: theme.textSecondary}}>Panel will auto-lock after inactivity. Set to 0 to disable.</p>
                                        <input type="number" value={draftState.inactivityTimeout} onChange={(e) => { const val = parseInt(e.target.value, 10); handleSimpleChange('inactivityTimeout', isNaN(val) ? 0 : val) }} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white dark:bg-zinc-800" min="0" />
                                    </div>
                                </div>
                            </div>
                        )}
                      </div>
                  </div>
              </div>
          </div>
          <div onMouseDown={handleMouseDown} onTouchStart={handleTouchStart} className="w-1.5 cursor-col-resize bg-zinc-200 dark:bg-zinc-700 hover:bg-blue-500 active:bg-blue-600 transition-colors duration-200 flex-shrink-0" role="separator" aria-label="Resize panels" />
          <div className="flex-1 p-6 bg-zinc-100 dark:bg-zinc-800 flex flex-col items-center justify-center min-w-0">
              <div className="w-full h-full max-w-full max-h-full aspect-[16/9] shadow-lg rounded-xl overflow-hidden border-4 border-zinc-300 dark:border-zinc-700 isolate">
                <AppContext.Provider value={previewContextValue}>
                    <PreviewPane />
                </AppContext.Provider>
              </div>
          </div>
        </div>
      </div>
      
      {showForceResetModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 mb-2">Security Update Required</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                    For security, you must set a new password for user access. This action will apply immediately.
                </p>
                <label className="block text-sm font-medium mb-1" style={{color: theme.textSecondary}}>New User Admin Password</label>
                <input
                    type="text"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleForceResetPassword()}
                    className="mt-1 w-full p-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
                    autoFocus
                />
                <div className="flex justify-end mt-4">
                    <button onClick={handleForceResetPassword} className="w-full px-4 py-2 rounded-md text-sm font-semibold" style={{backgroundColor: theme.accent, color: theme.background}}>
                        Set Password & Continue
                    </button>
                </div>
            </div>
        </div>
      )}
    </>
  );
};

export default AdminPanel;