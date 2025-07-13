

import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import ServiceCard from '../components/ServiceCard';

const getYouTubeEmbedUrl = (url: string): string | null => {
  if (!url) return null;
  let videoId = '';
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'youtu.be') {
      videoId = urlObj.pathname.slice(1);
    } else if (urlObj.hostname.includes('youtube.com')) {
      videoId = urlObj.searchParams.get('v') || '';
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch (error) {
    // console.error("Invalid video URL:", url);
    return null;
  }
};

type MediaTabType = 'servicePhotos' | 'serviceVideos' | 'mainGallery';

const ServicesPage: React.FC = () => {
  const { theme, services, showPhotoGallery, showVideoGallery, showMainGallery, galleryItems, heroConfig } = useAppContext();
  
  const servicePhotos = services.filter(s => s.photoUrl);
  const serviceVideos = services.filter(s => s.videoUrl && getYouTubeEmbedUrl(s.videoUrl));
  const mainGalleryPhotos = galleryItems.filter(item => item.type === 'photo');
  const mainGalleryVideos = galleryItems.filter(item => item.type === 'video' && getYouTubeEmbedUrl(item.url));

  const canShowServicePhotos = showPhotoGallery && servicePhotos.length > 0;
  const canShowServiceVideos = showVideoGallery && serviceVideos.length > 0;
  const canShowMainGallery = showMainGallery && galleryItems.length > 0;
  
  const [activeTab, setActiveTab] = useState<'services' | 'media'>('services');
  const [activeMediaTab, setActiveMediaTab] = useState<MediaTabType>('servicePhotos');

  useEffect(() => {
    if (canShowServicePhotos) {
      setActiveMediaTab('servicePhotos');
    } else if (canShowServiceVideos) {
      setActiveMediaTab('serviceVideos');
    } else if (canShowMainGallery) {
      setActiveMediaTab('mainGallery');
    }
  }, [canShowServicePhotos, canShowServiceVideos, canShowMainGallery]);

  const showMediaTab = canShowServicePhotos || canShowServiceVideos || canShowMainGallery;

  const MediaGallery = () => {
    const mediaTabs = [];
    if (canShowServicePhotos) mediaTabs.push({ key: 'servicePhotos', label: 'Photos', color: heroConfig.mediaButtonPhotoBg, textColor: heroConfig.mediaButtonPhotoText });
    if (canShowServiceVideos) mediaTabs.push({ key: 'serviceVideos', label: 'Videos', color: heroConfig.mediaButtonVideoBg, textColor: heroConfig.mediaButtonVideoText });
    if (canShowMainGallery) mediaTabs.push({ key: 'mainGallery', label: 'Our Gallery', color: heroConfig.mediaButtonGalleryBg, textColor: heroConfig.mediaButtonGalleryText, borderColor: heroConfig.mediaButtonGalleryBorder });

    return (
      <div>
        {mediaTabs.length > 1 && (
          <div className="flex justify-center flex-wrap items-center gap-4 mb-12">
            {mediaTabs.map(tab => {
                const isActive = activeMediaTab === tab.key;
                const buttonStyle: React.CSSProperties = {
                    backgroundColor: tab.color,
                    color: tab.textColor,
                };
                if(tab.borderColor) {
                    buttonStyle.border = `2px solid ${tab.borderColor}`;
                }
                if (isActive) {
                    // This creates a ring effect using boxShadow that respects the background color
                    buttonStyle.boxShadow = `0 0 0 2px ${theme.background}, 0 0 0 4px ${theme.accent}`;
                }

                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveMediaTab(tab.key as MediaTabType)}
                    className={`px-6 py-2 rounded-full font-semibold shadow-md transition-all duration-300 focus:outline-none ${isActive ? 'scale-110' : 'hover:scale-105'}`}
                    style={buttonStyle}
                  >
                    {tab.label}
                  </button>
                );
            })}
          </div>
        )}

        <div className="space-y-16">
          {activeMediaTab === 'servicePhotos' && canShowServicePhotos && (
            <div>
              <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: theme.textPrimary }}>Photos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {servicePhotos.map(service => (
                  <div key={`photo-${service.id}`} className="group relative overflow-hidden rounded-lg shadow-lg">
                    <img src={service.photoUrl} alt={service.name} className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-end p-4">
                      <p className="text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-y-4 group-hover:translate-y-0">{service.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeMediaTab === 'serviceVideos' && canShowServiceVideos && (
            <div>
              <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: theme.textPrimary }}>Videos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {serviceVideos.map(service => {
                  const embedUrl = getYouTubeEmbedUrl(service.videoUrl);
                  if (!embedUrl) return null;
                  const orientation = service.videoOrientation || 'landscape';
                  const aspectRatioClass = orientation === 'portrait' ? 'aspect-[9/16]' : 'aspect-video';
                  const containerClass = orientation === 'portrait' ? 'max-w-xs mx-auto' : '';
                  return (
                      <div key={`video-${service.id}`} className="rounded-lg shadow-lg overflow-hidden flex flex-col" style={{backgroundColor: theme.secondary}}>
                        <div className={containerClass}>
                           <div className={aspectRatioClass}>
                              <iframe src={embedUrl} title={`${service.name} Video`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full"></iframe>
                            </div>
                        </div>
                        <div className="p-4"><h3 className="text-lg font-bold" style={{color: theme.textPrimary}}>{service.name}</h3></div>
                      </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeMediaTab === 'mainGallery' && canShowMainGallery && (
             <div>
                <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: theme.textPrimary }}>Our Gallery</h2>
                {mainGalleryPhotos.length > 0 && (
                    <div className="mb-16">
                        <h3 className="text-2xl font-semibold mb-6 text-center" style={{color: theme.textSecondary}}>Photos</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {mainGalleryPhotos.map(item => (
                               <div key={`gallery-photo-${item.id}`} className="group relative overflow-hidden rounded-lg shadow-lg">
                                 <img src={item.url} alt={item.title} className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300" />
                                 <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-end p-4">
                                   <p className="text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-y-4 group-hover:translate-y-0">{item.title}</p>
                                 </div>
                               </div>
                            ))}
                        </div>
                    </div>
                )}
                {mainGalleryVideos.length > 0 && (
                    <div>
                        <h3 className="text-2xl font-semibold mb-6 text-center" style={{color: theme.textSecondary}}>Videos</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {mainGalleryVideos.map(item => {
                                const embedUrl = getYouTubeEmbedUrl(item.url);
                                if (!embedUrl) return null;
                                const orientation = item.videoOrientation || 'landscape';
                                const aspectRatioClass = orientation === 'portrait' ? 'aspect-[9/16]' : 'aspect-video';
                                const containerClass = orientation === 'portrait' ? 'max-w-xs mx-auto' : '';
                                return (
                                    <div key={`gallery-video-${item.id}`} className="rounded-lg shadow-lg overflow-hidden flex flex-col" style={{backgroundColor: theme.secondary}}>
                                      <div className={containerClass}>
                                         <div className={aspectRatioClass}>
                                            <iframe src={embedUrl} title={item.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full"></iframe>
                                          </div>
                                      </div>
                                      <div className="p-4"><h3 className="text-lg font-bold" style={{color: theme.textPrimary}}>{item.title}</h3></div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
             </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: theme.background, color: theme.textPrimary }} className="pt-32 animate-page-entry">
      <div className="container mx-auto px-6 py-12 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold" style={{ color: theme.textPrimary }}>Our Offerings</h1>
          <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: theme.textSecondary }}>
            Explore our curated services and media gallery.
          </p>
        </div>

        <div className="flex justify-center border-b mb-8" style={{ borderColor: theme.secondary }}>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-6 py-3 text-lg font-semibold transition-colors duration-300 focus:outline-none -mb-px`}
            style={{ 
              color: activeTab === 'services' ? theme.textPrimary : theme.textSecondary,
              borderBottom: activeTab === 'services' ? `2px solid ${theme.primary}` : '2px solid transparent'
            }}
          >
            Services
          </button>
          {showMediaTab && (
            <button
              onClick={() => setActiveTab('media')}
              className={`px-6 py-3 text-lg font-semibold transition-colors duration-300 focus:outline-none -mb-px`}
              style={{ 
                color: activeTab === 'media' ? theme.textPrimary : theme.textSecondary,
                borderBottom: activeTab === 'media' ? `2px solid ${theme.primary}` : '2px solid transparent'
              }}
            >
              Media
            </button>
          )}
        </div>

        <div>
          {activeTab === 'services' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}

          {activeTab === 'media' && <MediaGallery />}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;