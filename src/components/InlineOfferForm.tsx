"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { sendContactEmail } from '@/lib/resend';
import { CheckCircle, Loader2, Mail, Check, AlertCircle, ShieldCheck, Phone, User } from 'lucide-react';
import confetti from 'canvas-confetti';

interface InlineOfferFormProps {
  type: 'eshop_offer' | 'website_offer';
  offerPrice: string;
  redirectUrl: string;
  slotsRemaining: number;
}

export const InlineOfferForm: React.FC<InlineOfferFormProps> = ({
  type,
  offerPrice,
  redirectUrl,
  slotsRemaining,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    marketingConsent: true,
  });

  const [isValidEmail, setIsValidEmail] = useState<boolean | null>(null);
  const [isValidPhone, setIsValidPhone] = useState<boolean | null>(null);
  const [isValidName, setIsValidName] = useState<boolean | null>(null);
  const [honeypot, setHoneypot] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const isCheckbox = e.target.type === 'checkbox';
    const checked = e.target.checked;

    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox ? checked : value,
    }));

    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsValidEmail(value.trim() === '' ? null : emailRegex.test(value));
    }

    if (name === 'phone') {
      const phoneRegex = /^[0-9+-\s]{10,}$/;
      setIsValidPhone(value.trim() === '' ? null : phoneRegex.test(value));
    }

    if (name === 'name') {
      setIsValidName(value.trim().length >= 2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (honeypot) {
      setIsSuccess(true);
      return;
    }

    // Validation checks
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailOk = emailRegex.test(formData.email);
    const isNameOk = formData.name.trim().length >= 2;
    const isPhoneOk = formData.phone.trim().length >= 10;

    setIsValidEmail(isEmailOk);
    setIsValidName(isNameOk);
    setIsValidPhone(isPhoneOk);

    if (!isEmailOk || !isNameOk || !isPhoneOk) {
      setError('Παρακαλώ συμπληρώστε σωστά όλα τα υποχρεωτικά πεδία.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await sendContactEmail({
        type,
        offerPrice,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        marketingConsent: formData.marketingConsent,
      });

      // Google Ads Conversion tracking
      if (typeof window !== 'undefined' && (window as any).gtag) {
        console.log(`🔔 [Analytics] Triggering Google Ads Conversion (Inline Form - ${type})...`);
        (window as any).gtag('event', 'conversion', {
          'send_to': 'AW-18166808794/sHuvCLrHgq4cENqBztZD',
          'value': 1.0,
          'currency': 'EUR'
        });
        console.log("✅ [Analytics] Conversion sent to AW-18166808794");
      }

      setIsSuccess(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF6B00', '#00D16B', '#FFD100', '#1a1a1a']
      });

      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Παρουσιάστηκε σφάλμα. Παρακαλώ προσπαθήστε ξανά.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-glow border border-vivid-outline-variant/30 overflow-hidden relative z-10 self-center">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#fdfaf8] to-[#fbebe3] p-6 text-center border-b border-[#fcebe2] flex flex-col items-center">
        <h3 className="text-xl font-bold text-vivid-on-surface">
          Ζητήστε Δωρεάν Προσφορά
        </h3>
        <p className="text-vivid-on-surface-variant text-xs mt-1 max-w-[280px]">
          Συμπληρώστε τα στοιχεία σας και θα επικοινωνήσουμε άμεσα μαζί σας.
        </p>
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-vivid-primary/10 text-vivid-primary text-xs font-bold rounded-full mt-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          ⚡ Απομένουν {slotsRemaining} slots για αυτόν το μήνα
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-6 flex flex-col items-center"
          >
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={32} />
            </div>
            <h4 className="text-lg font-bold text-vivid-on-surface mb-2">
              Το αίτημα καταχωρήθηκε! 🎉
            </h4>
            <p className="text-vivid-on-surface-variant text-sm mb-4">
              Μεταφορά στη σελίδα επιβεβαίωσης...
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {/* Honeypot field (hidden from users, visible to bots) */}
            <input
              type="text"
              name="website_url_field"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
            />

            {/* Name Field */}
            <div>
              <label htmlFor="inline-name" className="block text-xs font-semibold text-vivid-on-surface mb-1">
                Όνομα *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  id="inline-name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl border focus:outline-none focus:ring-2 transition-all text-sm text-vivid-on-surface bg-gray-50/50 ${
                    isValidName === true
                      ? 'border-green-500 focus:ring-green-200'
                      : isValidName === false
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-gray-200 focus:ring-vivid-primary/50 focus:border-vivid-primary'
                  }`}
                  placeholder="Το ονοματεπώνυμό σας"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  {isValidName === true && <Check size={16} className="text-green-500" />}
                  {isValidName === false && <AlertCircle size={16} className="text-red-500" />}
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="inline-email" className="block text-xs font-semibold text-vivid-on-surface mb-1">
                Email *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  id="inline-email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl border focus:outline-none focus:ring-2 transition-all text-sm text-vivid-on-surface bg-gray-50/50 ${
                    isValidEmail === true
                      ? 'border-green-500 focus:ring-green-200'
                      : isValidEmail === false
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-gray-200 focus:ring-vivid-primary/50 focus:border-vivid-primary'
                  }`}
                  placeholder="Το email σας"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  {isValidEmail === true && <Check size={16} className="text-green-500" />}
                  {isValidEmail === false && <AlertCircle size={16} className="text-red-500" />}
                </div>
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="inline-phone" className="block text-xs font-semibold text-vivid-on-surface mb-1">
                Τηλέφωνο *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Phone size={16} />
                </div>
                <input
                  type="tel"
                  id="inline-phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl border focus:outline-none focus:ring-2 transition-all text-sm text-vivid-on-surface bg-gray-50/50 ${
                    isValidPhone === true
                      ? 'border-green-500 focus:ring-green-200'
                      : isValidPhone === false
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-gray-200 focus:ring-vivid-primary/50 focus:border-vivid-primary'
                  }`}
                  placeholder="π.χ. 69..."
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  {isValidPhone === true && <Check size={16} className="text-green-500" />}
                  {isValidPhone === false && <AlertCircle size={16} className="text-red-500" />}
                </div>
              </div>
            </div>

            {/* Consent */}
            <div className="flex items-start gap-2.5 mt-1">
              <input
                type="checkbox"
                id="inline-marketingConsent"
                name="marketingConsent"
                checked={formData.marketingConsent}
                onChange={handleChange}
                className="mt-0.5 w-4 h-4 text-vivid-primary border-gray-300 rounded focus:ring-vivid-primary cursor-pointer shrink-0"
              />
              <label htmlFor="inline-marketingConsent" className="text-[11px] text-vivid-on-surface-variant leading-snug cursor-pointer select-none">
                Συμφωνώ να λαμβάνω ενημερώσεις και προσφορές από την SGK Software Development.
              </label>
            </div>

            {error && (
              <div className="p-2.5 text-xs text-red-600 bg-red-50 rounded-lg">
                {error}
              </div>
            )}

            <div className="mt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-vivid-primary-container hover:bg-vivid-primary text-vivid-on-primary font-bold py-3.5 rounded-xl shadow-glow active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer text-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Αποστολή...
                  </>
                ) : (
                  "Θέλω Δωρεάν Προσφορά →"
                )}
              </button>
              
              <p className="text-[10px] text-vivid-on-surface-variant/70 text-center flex items-center justify-center gap-1 mt-2">
                <ShieldCheck size={10} className="text-vivid-primary" />
                100% Ασφαλές & GDPR Συμβατό
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
