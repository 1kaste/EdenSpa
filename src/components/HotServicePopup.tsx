
import React, { useState, useEffect, useRef, memo } from 'react';
import { useAppContext } from '../context/AppContext';
import ServiceCard from './ServiceCard';

const HotServicePopup: React.FC = () => {
    const { appData, theme } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!appData) return null;
    
    const { featuredServices } = appData;
    const popupServices = featuredServices.filter(s => s.showInPopup);
    const hasMultipleServices = popupServices.length > 1;

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const carouselRef = useRef<HTMLDivElement>(null);

    // State for drag-to-swipe
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
    const dragStartRef = useRef(0);

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    const startTimeout = () => {
        resetTimeout();
        if (isOpen && hasMultipleServices) {
            timeoutRef.current = setTimeout(() => {
                goToNext(false);
            }, 4000); // Increased duration for better UX
        }
    };

    useEffect(() => {
        startTimeout();
        return () => resetTimeout();
    }, [currentIndex, isOpen, popupServices.length]);

    useEffect(() => {
        if (popupServices.length > 0) {
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [popupServices.length]);
    
    const handleClose = () => {
        setIsOpen(false);
    };

    const goToNext = (resetTimer = true) => {
        if (resetTimer) resetTimeout();
        setCurrentIndex((prevIndex) => (prevIndex + 1) % popupServices.length);
    };

    const goToPrevious = (resetTimer = true) => {
        if (resetTimer) resetTimeout();
        setCurrentIndex((prevIndex) => (prevIndex - 1 + popupServices.length) % popupServices.length);
    };
    
    const goToIndex = (index: number) => {
        resetTimeout();
        setCurrentIndex(index);
    };
    
    // --- Drag-to-swipe handlers ---
    const handleDragStart = (clientX: number) => {
        if (!hasMultipleServices) return;
        resetTimeout();
        setIsDragging(true);
        dragStartRef.current = clientX;
    };
    
    const handleDragMove = (clientX: number) => {
        if (!isDragging || !hasMultipleServices) return;
        setDragOffset(clientX - dragStartRef.current);
    };

    const handleDragEnd = () => {
        if (!isDragging || !hasMultipleServices) return;
        
        const carouselWidth = carouselRef.current?.offsetWidth || 0;
        const swipeThreshold = carouselWidth / 4;

        setIsDragging(false);

        if (dragOffset < -swipeThreshold) {
            goToNext(false);
        } else if (dragOffset > swipeThreshold) {
            goToPrevious(false);
        }
        
        setDragOffset(0);
        startTimeout(); // Restart autoplay after interaction
    };

    useEffect(() => {
        const handleMouseUp = () => {
            if (isDragging) {
                handleDragEnd();
            }
        };
        
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);


    if (!isOpen || popupServices.length === 0) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4" 
            onClick={handleClose} 
            role="dialog" 
            aria-modal="true" 
            aria-labelledby="hot-service-popup-title"
        >
            <div 
                className="relative w-full max-w-[18rem] sm:max-w-sm rounded-2xl shadow-xl p-4" 
                style={{ backgroundColor: theme.background }}
                onClick={(e) => e.stopPropagation()}
                onMouseLeave={isDragging ? handleDragEnd : undefined}
            >
                <button 
                    onClick={handleClose} 
                    className="absolute top-3 right-3 z-20 p-2 rounded-full hover:bg-gray-500/10 transition-colors" 
                    aria-label="Close popup"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={theme.textPrimary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                
                <div className="text-center mb-4">
                    <h2 id="hot-service-popup-title" className="text-xl sm:text-2xl font-bold" style={{ color: theme.textPrimary }}>
                        🔥 Don't Miss Out!
                    </h2>
                    <p className="mt-2 text-sm" style={{ color: theme.textSecondary }}>
                        Check out our featured services.
                    </p>
                </div>
                
                {/* Carousel */}
                <div 
                    ref={carouselRef}
                    className="relative cursor-grab active:cursor-grabbing"
                    onMouseDown={(e) => handleDragStart(e.clientX)}
                    onMouseMove={(e) => handleDragMove(e.clientX)}
                    onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
                    onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
                    onTouchEnd={handleDragEnd}
                >
                    {hasMultipleServices && (
                        <>
                            <button 
                                onClick={(e) => { e.stopPropagation(); goToPrevious(); }} 
                                className="absolute left-0 top-[6rem] -translate-y-1/2 z-10 p-2 rounded-full text-white bg-black/30 hover:bg-black/50 transition-colors" 
                                aria-label="Previous service"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); goToNext(); }} 
                                className="absolute right-0 top-[6rem] -translate-y-1/2 z-10 p-2 rounded-full text-white bg-black/30 hover:bg-black/50 transition-colors" 
                                aria-label="Next service"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </button>
                        </>
                    )}

                    <div className="overflow-hidden">
                        <div 
                            className={`flex ${!isDragging ? 'transition-transform ease-out duration-300' : ''}`}
                            style={{ transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))` }}
                            onClick={(e) => { if(isDragging && dragOffset !== 0) e.preventDefault() }}
                        >
                            {popupServices.map((service, index) => (
                                <div key={service.id} className="w-full flex-shrink-0" aria-hidden={currentIndex !== index}>
                                    <ServiceCard service={service} />
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {hasMultipleServices && (
                        <div className="flex justify-center space-x-2 pt-4">
                            {popupServices.map((_, index) => (
                                <button 
                                    key={index}
                                    onClick={(e) => { e.stopPropagation(); goToIndex(index); }}
                                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentIndex === index ? 'w-5 bg-opacity-100' : 'bg-opacity-50'}`}
                                    style={{ backgroundColor: theme.textPrimary }}
                                    aria-label={`Go to service ${index + 1}`}
                                ></button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default memo(HotServicePopup);
