import React from 'react';
import { Service } from '../types';
import { useAppContext } from '../context/AppContext';

interface ServiceCardProps {
  service: Service;
  className?: string;
  style?: React.CSSProperties;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, className, style }) => {
  const { theme } = useAppContext();

  const getDiscountedPrice = () => {
    if (!service.discountPercentage || service.discountPercentage <= 0 || service.discountPercentage > 100) {
      return null;
    }
    const priceMatch = service.price.match(/([\d\.]+)/);
    if (!priceMatch) return null;
    
    const priceNum = parseFloat(priceMatch[1]);
    if (isNaN(priceNum)) return null;
    
    const newPrice = priceNum * (1 - service.discountPercentage / 100);
    return service.price.replace(priceMatch[1], newPrice.toFixed(2));
  };
  
  const discountedPrice = getDiscountedPrice();


  if (service.layout === 'compact') {
    return (
      <div 
        className={`relative rounded-lg shadow-md p-4 flex items-center space-x-4 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl ${className || ''}`}
        style={{ backgroundColor: theme.secondary, ...style }}
      >
        {service.promotion && (
          <div className="absolute top-0 right-0 text-white text-xs font-bold px-2 py-0.5 rounded-bl-md rounded-tr-lg" style={{backgroundColor: theme.accent, color: theme.background}}>
            {service.promotion}
          </div>
        )}
        {service.photoUrl ? (
          <img src={service.photoUrl} alt={service.name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
        ) : (
          <div className="w-16 h-16 rounded-lg flex-shrink-0 flex items-center justify-center" style={{backgroundColor: theme.primary}}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 opacity-70" style={{color: theme.textPrimary}} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
          </div>
        )}
        <div className="flex-grow">
          <h3 className="text-lg font-bold" style={{ color: theme.textPrimary }}>
            {service.name}
          </h3>
          {discountedPrice ? (
            <div className="flex items-baseline space-x-2">
              <p className="text-md font-semibold" style={{ color: theme.textPrimary }}>{discountedPrice}</p>
              <p className="text-sm line-through" style={{ color: theme.textSecondary }}>{service.price}</p>
            </div>
          ) : (
            <p className="text-md font-semibold" style={{ color: theme.textPrimary }}>
              {service.price}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`rounded-lg overflow-hidden shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl flex flex-col ${className || ''}`} 
      style={{ backgroundColor: theme.secondary, ...style }}
    >
      <div className="relative">
        {service.photoUrl && <img src={service.photoUrl} alt={service.name} className="w-full h-48 object-cover" />}
        {service.promotion && (
            <div 
                className="absolute top-0 right-0 text-white text-sm font-bold px-4 py-1 rounded-bl-xl" 
                style={{backgroundColor: theme.accent, color: theme.background}}
            >
                {service.promotion}
            </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-2" style={{ color: theme.textPrimary }}>
          {service.name}
        </h3>
        {service.description && (
          <p className="text-sm flex-grow mb-4" style={{ color: theme.textSecondary }}>
            {service.description}
          </p>
        )}
        <div className="flex justify-between items-center mt-auto">
          {discountedPrice ? (
              <div className="flex items-baseline space-x-2">
                  <span className="text-lg font-semibold" style={{ color: theme.textPrimary }}>{discountedPrice}</span>
                  <span className="text-md line-through" style={{ color: theme.textSecondary }}>{service.price}</span>
              </div>
          ) : (
             <span className="text-lg font-semibold" style={{ color: theme.textPrimary }}>
                {service.price}
             </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;