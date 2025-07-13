


import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';
import { CustomFormField } from '../types';

const renderCustomField = (field: CustomFormField, value: string, handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void, theme: any) => {
    const commonProps = {
        id: field.name,
        name: field.name,
        required: field.required,
        value: value,
        onChange: handleChange,
        className: "w-full p-3 border border-zinc-300 rounded-md shadow-sm focus:ring-1",
        style: {
            '--tw-ring-color': theme.primary,
        } as React.CSSProperties
    };

    return (
        <div key={field.id}>
            <label htmlFor={field.name} className="block text-sm font-medium mb-1" style={{ color: theme.textSecondary }}>
                {field.label}{field.required && <span className="text-red-500">*</span>}
            </label>
            {field.type === 'textarea' ? (
                <textarea {...commonProps} rows={4}></textarea>
            ) : field.type === 'select' ? (
                <select {...commonProps} className={`${commonProps.className} bg-white`}>
                    <option value="" disabled>-- Select an option --</option>
                    {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            ) : (
                <input type={field.type} {...commonProps} />
            )}
        </div>
    );
};

const BookNowPage: React.FC = () => {
    const { theme, services, whatsappNumber, customFields } = useAppContext();
    
    const initialFormState = useMemo(() => {
        const customState = customFields.reduce((acc, field) => {
            acc[field.name] = '';
            return acc;
        }, {} as Record<string, string>);

        return {
            name: '',
            phone: '',
            email: '',
            serviceId: '',
            date: '',
            time: '',
            ...customState
        };
    }, [customFields]);

    const [formData, setFormData] = useState(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const timeSlots = [
        '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
        '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
    ];
    
    const inputStyle = {
      '--tw-ring-color': theme.primary,
    } as React.CSSProperties;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.serviceId) {
            alert('Please select a service.');
            return;
        }

        setIsSubmitting(true);
        const cleanedNumber = whatsappNumber.replace(/\D/g, '');
        if (!cleanedNumber) {
            alert('The business WhatsApp number is not configured correctly. Please contact us directly.');
            setIsSubmitting(false);
            return;
        }

        const selectedService = services.find(s => s.id === parseInt(formData.serviceId, 10));
        
        const customFieldsPart = customFields
            .map(field => {
                const value = formData[field.name];
                return value ? `${field.label}: ${value}` : null;
            })
            .filter(Boolean)
            .join('\n');

        const messageBody = `
New appointment from ${formData.name}.
-----------------------------------
Service: ${selectedService?.name || 'Not specified'}
Price: ${selectedService?.price || 'N/A'}
Date: ${formData.date}
Time: ${formData.time}
-----------------------------------
Client Contact:
Phone: ${formData.phone}
Email: ${formData.email}
${customFieldsPart ? '-----------------------------------\nAdditional Details:\n' + customFieldsPart : ''}
-----------------------------------
Please confirm availability.
        `.trim().replace(/\n\s*\n/g, '\n');

        const encodedMessage = encodeURIComponent(messageBody);
        const whatsappUrl = `https://wa.me/${cleanedNumber}?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        
        alert(`Your booking request has been prepared. You will be redirected to WhatsApp. Please tap 'Send' to confirm your appointment request.`);
        
        setFormData(initialFormState);
        setIsSubmitting(false);
    };
    
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="min-h-screen flex items-center justify-center p-4 pt-32 animate-page-entry" style={{ backgroundColor: theme.secondary }}>
            <div className="w-full max-w-2xl mx-auto p-8 md:p-12 rounded-2xl shadow-2xl" style={{ backgroundColor: theme.background, color: theme.textPrimary }}>
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold font-heading" style={{ color: theme.textPrimary }}>Book Your Moment of Bliss</h1>
                    <p className="mt-3 text-lg" style={{ color: theme.textSecondary }}>
                        Select your preferred service and time.
                    </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-1" style={{ color: theme.textSecondary }}>Full Name</label>
                            <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="w-full p-3 border border-zinc-300 rounded-md shadow-sm focus:ring-1" style={inputStyle} />
                        </div>
                         <div>
                            <label htmlFor="phone" className="block text-sm font-medium mb-1" style={{ color: theme.textSecondary }}>Phone Number</label>
                            <input type="tel" name="phone" id="phone" required value={formData.phone} onChange={handleChange} className="w-full p-3 border border-zinc-300 rounded-md shadow-sm focus:ring-1" style={inputStyle} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: theme.textSecondary }}>Email Address</label>
                        <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="w-full p-3 border border-zinc-300 rounded-md shadow-sm focus:ring-1" style={inputStyle} />
                    </div>
                    <div>
                        <label htmlFor="serviceId" className="block text-sm font-medium mb-1" style={{ color: theme.textSecondary }}>Select a Service</label>
                        <select name="serviceId" id="serviceId" required value={formData.serviceId} onChange={handleChange} className="w-full p-3 border border-zinc-300 rounded-md shadow-sm focus:ring-1 bg-white" style={inputStyle}>
                            <option value="" disabled>-- Please choose a service --</option>
                            {services.map(service => (
                                <option key={service.id} value={service.id}>{service.name} - {service.price}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium mb-1" style={{ color: theme.textSecondary }}>Preferred Date</label>
                            <input type="date" name="date" id="date" required value={formData.date} onChange={handleChange} min={today} className="w-full p-3 border border-zinc-300 rounded-md shadow-sm focus:ring-1" style={inputStyle} />
                        </div>
                        <div>
                            <label htmlFor="time" className="block text-sm font-medium mb-1" style={{ color: theme.textSecondary }}>Preferred Time</label>
                            <select name="time" id="time" required value={formData.time} onChange={handleChange} className="w-full p-3 border border-zinc-300 rounded-md shadow-sm focus:ring-1 bg-white" style={inputStyle}>
                                <option value="" disabled>-- Select a time --</option>
                                {timeSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                            </select>
                        </div>
                    </div>

                    {customFields.map(field => renderCustomField(field, formData[field.name], handleChange, theme))}

                    <div className="pt-4">
                        <Button type="submit" className="w-full text-lg py-3" disabled={isSubmitting}>
                            {isSubmitting ? 'Processing...' : 'Request via WhatsApp'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookNowPage;