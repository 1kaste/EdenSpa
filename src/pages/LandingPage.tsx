
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Page } from '../types';
import Button from '../components/Button';
import ServiceCard from '../components/ServiceCard';

interface LandingPageProps {
  setPage: (page: Page) => void;
}

const StarRatingDisplay = ({ rating }: { rating: number }) => {
    return (
        <div className="flex justify-center mb-4 text-yellow-400">
            {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.25 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
                </svg>
            ))}
        </div>
    );
};

const DefaultAvatar = ({ name }: { name: string }) => {
  const { theme } = useAppContext();
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  return (
    <div 
      className="w-24 h-24 rounded-full mb-4 -mt-24 border-4 flex items-center justify-center"
      style={{
        borderColor: theme.background,
        backgroundColor: theme.accent,
        color: theme.background
      }}
    >
      <span className="text-4xl font-bold">{initial}</span>
    </div>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ setPage }) => {
  const { appData, theme } = useAppContext();
  
  if (!appData) return null;

  const { reviews, featuredServices, heroConfig, whyChooseUsItems, seasonalOffer, instagramFeed } = appData;
  const featuredReviews = reviews.filter(r => r.featured);
  const [parallaxOffset, setParallaxOffset] = useState(0);

  const whyChooseUsIcons = [
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={theme.textPrimary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={theme.textPrimary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>,
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={theme.textPrimary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
  ];

  // Parallax effect for hero section
  useEffect(() => {
    const handleScroll = () => {
      setParallaxOffset(window.pageYOffset);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // On-scroll animations for sections
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Optional: Unobserve after animation to save resources
            // observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );

    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach((el) => observer.observe(el));

    return () => {
      elementsToAnimate.forEach((el) => observer.unobserve(el));
    };
  }, [featuredServices, featuredReviews, whyChooseUsItems, seasonalOffer, instagramFeed]); // Re-observe if content changes


  return (
    <div style={{ backgroundColor: theme.background, color: theme.textPrimary }} className="overflow-x-hidden">
      {/* Hero Section */}
      <section 
        className="relative min-h-[60vh] flex flex-col justify-center text-center bg-cover bg-center px-6 pt-32 pb-16"
        style={{ 
          backgroundImage: `url('${heroConfig.heroImage}')`,
          backgroundPositionY: parallaxOffset * 0.4,
        }}
      >
        <div 
          className="absolute inset-0 transition-colors duration-300"
          style={{
            backgroundColor: heroConfig.heroOverlayColor,
            opacity: heroConfig.heroOverlayOpacity,
          }}
        ></div>
        <div className="relative z-10 animate-on-scroll is-visible">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4 font-heading">
            {heroConfig.heroTitle}
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            {heroConfig.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => setPage(Page.Services)}
              className="px-6 py-3 font-bold shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 rounded-lg"
              style={{
                backgroundColor: heroConfig.heroButtonPrimaryBg,
                color: heroConfig.heroButtonPrimaryText,
                letterSpacing: '0.5px',
              }}
            >
              View Services
            </button>
            <button
              onClick={() => setPage(Page.BookNow)}
              className="px-6 py-3 font-bold shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 rounded-lg"
              style={{
                backgroundColor: heroConfig.heroButtonSecondaryBg,
                border: `2px solid ${heroConfig.heroButtonSecondaryBorder}`,
                color: heroConfig.heroButtonSecondaryText,
                letterSpacing: '0.5px',
              }}
            >
              Book an Appointment
            </button>
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      {featuredServices.length > 0 && (
        <section className="py-20 md:py-24" style={{backgroundColor: theme.background}}>
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-12 animate-on-scroll" style={{color: theme.textPrimary}}>Featured Services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredServices.map((service, index) => (
                <ServiceCard 
                    key={service.id} 
                    service={service} 
                    className="animate-on-scroll"
                    style={{ transitionDelay: `${index * 100}ms` }}
                />
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Why Choose Us Section */}
      <section className="py-20 md:py-24" style={{ backgroundColor: theme.secondary }}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl font-bold" style={{ color: theme.textPrimary }}>Why Choose Eden Spa?</h2>
            <p className="mt-2 text-lg" style={{ color: theme.textSecondary }}>Experience the difference with our dedicated approach to beauty and wellness.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 text-center">
            {whyChooseUsItems.map((item, index) => (
              <div key={item.id} className="animate-on-scroll" style={{ transitionDelay: `${index * 150}ms` }}>
                <div className="mx-auto mb-6 w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.primary }}>
                  {whyChooseUsIcons[index]}
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: theme.textPrimary }}>{item.title}</h3>
                <p style={{ color: theme.textSecondary }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about-us-section" className="py-20 md:py-24" style={{backgroundColor: theme.background}}>
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="md:pr-8 animate-on-scroll">
            <h2 className="text-3xl font-bold mb-4" style={{color: theme.textPrimary}}>Welcome to Our Sanctuary</h2>
            <p className="mb-4" style={{color: theme.textSecondary}}>
              At Eden Spa, we believe that self-care is not a luxury, but a necessity. Our mission is to provide a tranquil and welcoming environment where you can escape the stresses of daily life and indulge in treatments that rejuvenate your body, mind, and soul. 
            </p>
            <p style={{color: theme.textSecondary}}>
              Our team of highly skilled estheticians is dedicated to delivering exceptional results using only the highest quality products. From precise waxing to luxurious facials, every service is tailored to meet your unique needs.
            </p>
          </div>
          <div className="animate-on-scroll" style={{ transitionDelay: '100ms' }}>
            <img src="https://picsum.photos/seed/about/600/450" alt="Spa interior" className="rounded-lg shadow-xl w-full h-auto object-cover" loading="lazy" decoding="async"/>
          </div>
        </div>
      </section>

      {/* Special Offer Section */}
      <section className="animate-on-scroll">
        <div className="container mx-auto px-6 py-20 md:py-24">
          <div
            className="relative rounded-2xl shadow-xl overflow-hidden text-center text-white py-20 px-8 flex flex-col items-center justify-center"
          >
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${seasonalOffer.backgroundImage}')`, transform: 'scale(1.1)' }}></div>
            <div className="absolute inset-0 bg-black/60"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-3">{seasonalOffer.title}</h2>
              <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
                {seasonalOffer.description}
              </p>
              <Button
                onClick={() => setPage(Page.BookNow)}
                className="text-lg px-8 py-3"
                style={{
                  backgroundColor: theme.primary,
                  color: theme.textPrimary,
                }}
              >
                {seasonalOffer.buttonText}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {featuredReviews.length > 0 && (
        <section className="py-24 md:py-32" style={{ backgroundColor: theme.secondary }}>
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-20 animate-on-scroll" style={{color: theme.textPrimary}}>What Our Clients Say</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 sm:gap-8">
              {featuredReviews.map((review, index) => (
                <div 
                    key={review.id} 
                    className="pt-12 px-8 pb-8 rounded-lg shadow-xl flex flex-col items-center animate-on-scroll" 
                    style={{
                        backgroundColor: theme.background,
                        transitionDelay: `${index * 100}ms`
                    }}
                >
                  {review.photoUrl ? (
                    <img src={review.photoUrl} alt={review.name} className="w-24 h-24 rounded-full mb-4 object-cover -mt-24 border-4" style={{borderColor: theme.background}} />
                  ) : (
                    <DefaultAvatar name={review.name} />
                  )}
                  <div className="flex flex-col flex-grow text-center">
                    <StarRatingDisplay rating={review.rating} />
                    <p className="italic mb-4 flex-grow" style={{color: theme.textSecondary}}>"{review.comment}"</p>
                    <p className="font-semibold" style={{color: theme.textPrimary}}>- {review.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Instagram Section */}
      <section className="py-20 md:py-24" style={{ backgroundColor: theme.background }}>
        <div className="container mx-auto px-6 text-center">
          <div className="animate-on-scroll">
            <h2 className="text-3xl font-bold mb-3" style={{ color: theme.textPrimary }}>{instagramFeed.title}</h2>
            <a href={`https://instagram.com/${instagramFeed.username.replace('@','')}`} target="_blank" rel="noopener noreferrer" className="text-lg hover:underline" style={{ color: theme.textSecondary }}>
              {instagramFeed.username}
            </a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4 mt-12">
            {instagramFeed.imageUrls.map((url, index) => (
              <div key={index} className="animate-on-scroll group" style={{ transitionDelay: `${index * 100}ms` }}>
                <a href={`https://instagram.com/${instagramFeed.username.replace('@','')}`} target="_blank" rel="noopener noreferrer" className="block relative overflow-hidden rounded-lg shadow-md aspect-square">
                  <img 
                    src={url} 
                    alt={`Instagram post ${index + 1}`}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300" 
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-100 transition-opacity"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
