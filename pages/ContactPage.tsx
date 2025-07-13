

import React from 'react';
import { useAppContext } from '../context/AppContext';

const ContactPage: React.FC = () => {
    const { theme, contactTip, contactEmail } = useAppContext();

    return (
        <div style={{ backgroundColor: theme.background, color: theme.textPrimary }} className="pt-32 animate-page-entry">
            <div className="container mx-auto px-6 py-12 md:py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold" style={{ color: theme.textPrimary }}>Contact Us</h1>
                    <p className="mt-4 text-lg max-w-3xl mx-auto" style={{ color: theme.textSecondary }}>
                        We'd love to hear from you. Here's how you can reach us.
                    </p>
                </div>
                
                <div className="max-w-3xl mx-auto">
                    {/* Contact Info Section */}
                    <div className="p-8 rounded-lg shadow-xl" style={{ backgroundColor: theme.secondary }}>
                        <h3 className="text-2xl font-bold mb-6" style={{ color: theme.textPrimary }}>Contact Information</h3>
                        <div className="space-y-4" style={{ color: theme.textSecondary }}>
                            <p className="flex items-start">
                                <svg className="w-6 h-6 mr-3 mt-1 flex-shrink-0" style={{color: theme.textPrimary}} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                <span>123 Serenity Lane, Blissville, USA</span>
                            </p>
                            <p className="flex items-start">
                                <svg className="w-6 h-6 mr-3 mt-1 flex-shrink-0" style={{color: theme.textPrimary}} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                <span>(555) 123-4567</span>
                            </p>
                            {contactEmail && (
                                <p className="flex items-start">
                                    <svg className="w-6 h-6 mr-3 mt-1 flex-shrink-0" style={{color: theme.textPrimary}} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                    <a href={`mailto:${contactEmail}`} className="hover:underline break-all">
                                        {contactEmail}
                                    </a>
                                </p>
                            )}
                        </div>
                        <div className="mt-8 pt-6 border-t" style={{borderColor: theme.primary}}>
                            <h4 className="text-xl font-bold mb-4" style={{ color: theme.textPrimary }}>Opening Hours</h4>
                            <ul className="space-y-2" style={{ color: theme.textSecondary }}>
                                <li className="flex justify-between"><span>Monday - Friday</span> <span>9:00 AM - 6:00 PM</span></li>
                                <li className="flex justify-between"><span>Saturday</span> <span>10:00 AM - 4:00 PM</span></li>
                                <li className="flex justify-between"><span>Sunday</span> <span>Closed</span></li>
                            </ul>
                        </div>
                    </div>

                    {contactTip && (
                        <div className="mt-8 text-center p-6 rounded-lg shadow-md" style={{ backgroundColor: theme.accent, color: theme.background }}>
                            <p className="font-semibold text-lg">A quick tip from us:</p>
                            <p className="mt-2">{contactTip}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactPage;