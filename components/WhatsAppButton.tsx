
import React from 'react';
import { useAppContext } from '../context/AppContext';

const WhatsAppButton: React.FC = () => {
    const { whatsappNumber, whatsappMessage } = useAppContext();

    if (!whatsappNumber) {
        return null;
    }
    
    // Clean the number for the URL by removing all non-numeric characters.
    const cleanedNumber = whatsappNumber.replace(/\D/g, '');

    if (!cleanedNumber) {
        return null;
    }

    let whatsappUrl = `https://wa.me/${cleanedNumber}`;

    if (whatsappMessage) {
        whatsappUrl += `?text=${encodeURIComponent(whatsappMessage)}`;
    }


    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed right-4 top-[60%] -translate-y-1/2 z-40 bg-[#25D366] text-white p-3 rounded-full shadow-lg transition-transform transform hover:scale-110 flex items-center justify-center"
            aria-label="Chat with us on WhatsApp"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="currentColor"
            >
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.77 3.05 1.18 4.79 1.18h.01c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.91-9.91-9.91zM17.43 15.65c-.22.12-.83.41-1.03.56-.2.12-.4.18-.6.06-.22-.12-.83-1.03-1.68-1.88-.65-.68-1.1-1.32-1.22-1.54s-.06-.35.06-.48c.12-.12.24-.24.36-.36.12-.12.18-.2.24-.36.12-.12.06-.24 0-.48s-1.03-2.48-1.42-3.32c-.36-.83-.71-.71-.95-.71-.22 0-.46 0-.71.06-.24.06-.6.24-.95.6s-1.1 1.03-1.1 2.48c0 1.48 1.13 2.87 1.28 3.05.18.18 2.21 3.38 5.36 4.73.74.36 1.32.56 1.77.71.74.24 1.42.22 1.96.12.6-.12 1.88-1.13 2.12-1.42.24-.3.24-.54.18-.66l-.6-.3z"/>
            </svg>
        </a>
    );
};

export default WhatsAppButton;
