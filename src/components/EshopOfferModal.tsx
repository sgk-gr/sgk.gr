"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendContactEmail } from '@/lib/resend';
import { X, CheckCircle, Loader2, Mail, Check, AlertCircle, ShieldCheck, User, Phone, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';

interface EshopOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EshopOfferModal: React.FC<EshopOfferModalProps> = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    phone: '',
    email: '',
    projectInfo: '',
    marketingConsent: true,
  });
  const [isValidEmail, setIsValidEmail] = useState<boolean | null>(null);
  
  const [captcha, setCaptcha] = useState({ question: "", result: 0, answer: "" });
  const [honeypot, setHoneypot] = useState("");

  const generateCaptcha = () => {
    const n1 = Math.floor(Math.random() * 9) + 1;
    const n2 = Math.floor(Math.random() * 9) + 1;
    return { question: `${n1} + ${n2}`, result: n1 + n2, answer: "" };
  };

  useEffect(() => {
    if (isOpen) {
      setCaptcha(generateCaptcha());
      setHoneypot("");
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isCheckbox = e.target instanceof HTMLInputElement && e.target.type === 'checkbox';
    const checked = e.target instanceof HTMLInputElement && e.target.type === 'checkbox' ? e.target.checked : false;

    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox ? checked : value,
    }));

    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsValidEmail(value.trim() === '' ? null : emailRegex.test(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (honeypot) {
      // Silent discard for bots
      setIsSuccess(true);
      return;
    }

    if (parseInt(captcha.answer) !== captcha.result) {
      setError("Λάθος απάντηση ελέγχου ασφαλείας. Προσπαθήστε ξανά.");
      setCaptcha(generateCaptcha());
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await sendContactEmail({
        type: 'eshop_offer',
        offerPrice: '1500',
        lastName: '',
        ...formData,
      });
      setIsSuccess(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF6B00', '#00D16B', '#FFD100', '#1a1a1a']
      });
    } catch (err: any) {
      setError(err.message || 'Παρουσιάστηκε σφάλμα. Παρακαλώ προσπαθήστε ξανά.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      // Reset form after exit animation
      setTimeout(() => {
        setIsSuccess(false);
        setError('');
        setFormData({
          firstName: '',
          phone: '',
          email: '',
          projectInfo: '',
          marketingConsent: true,
        });
        setIsValidEmail(null);
      }, 300);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[95vh] flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-[#fdfaf8] to-[#fbebe3] p-6 text-center relative border-b border-[#fcebe2] flex flex-col items-center flex-shrink-0">
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 text-vivid-on-surface-variant hover:text-vivid-primary transition-colors cursor-pointer"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold text-vivid-on-surface mb-2">
                Αποκτήστε την Προσφορά
              </h2>
              <p className="text-vivid-on-surface-variant text-sm">
                Συμπληρώστε τα στοιχεία σας και θα επικοινωνήσουμε άμεσα μαζί σας.
              </p>
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-vivid-primary/10 text-vivid-primary text-xs font-bold rounded-full mt-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                142+ αιτήματα προσφοράς αυτή την εβδομάδα
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8 flex flex-col items-center"
                >
                  <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-vivid-on-surface mb-2">
                    Το αίτημά σας καταχωρήθηκε! 🎉
                  </h3>
                  <p className="text-vivid-on-surface-variant mb-6 text-sm">
                    Σας στείλαμε έναν μοναδικό κωδικό προσφοράς (έκπτωση 300€) στο email σας. Ελέγξτε τα εισερχόμενά σας (και τα spam) για να τον βρείτε!
                  </p>
                  <button
                    onClick={handleClose}
                    className="w-full bg-vivid-surface-container text-vivid-on-surface font-semibold py-3 rounded-full hover:bg-vivid-surface-variant transition-colors cursor-pointer"
                  >
                    Κλείσιμο
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* Name */}
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-vivid-on-surface mb-1">Όνομα *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <User size={18} />
                      </div>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-vivid-primary/50 focus:border-vivid-primary text-vivid-on-surface bg-gray-50/50"
                        placeholder="Το όνομά σας"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-vivid-on-surface mb-1">Τηλέφωνο *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <Phone size={18} />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-vivid-primary/50 focus:border-vivid-primary text-vivid-on-surface bg-gray-50/50"
                        placeholder="Το τηλέφωνό σας"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-vivid-on-surface mb-1">Email *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-11 pr-10 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all text-vivid-on-surface bg-gray-50/50 ${
                          isValidEmail === true
                            ? 'border-green-500 focus:ring-green-200'
                            : isValidEmail === false
                            ? 'border-red-500 focus:ring-red-200'
                            : 'border-gray-200 focus:ring-vivid-primary/50 focus:border-vivid-primary'
                        }`}
                        placeholder="Το email σας"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        {isValidEmail === true && <Check size={18} className="text-green-500" />}
                        {isValidEmail === false && <AlertCircle size={18} className="text-red-500" />}
                      </div>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div>
                    <label htmlFor="projectInfo" className="block text-sm font-medium text-vivid-on-surface mb-1">Περιγραφή Έργου *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 pt-3 flex items-start pointer-events-none text-gray-400">
                        <FileText size={18} />
                      </div>
                      <textarea
                        id="projectInfo"
                        name="projectInfo"
                        required
                        rows={3}
                        value={formData.projectInfo}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-vivid-primary/50 focus:border-vivid-primary text-vivid-on-surface bg-gray-50/50 font-sans resize-none"
                        placeholder="Περιγράψτε σύντομα τι eshop θέλετε να φτιάξετε..."
                      />
                    </div>
                  </div>

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

                  {/* Math Captcha */}
                  <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex flex-col gap-2">
                    <label htmlFor="captchaAnswer" className="text-xs font-bold text-vivid-primary uppercase tracking-wider">
                      Επαλήθευση Ασφαλείας: Πόσο κάνει {captcha.question} ; *
                    </label>
                    <input
                      type="text"
                      id="captchaAnswer"
                      required
                      value={captcha.answer}
                      onChange={(e) => setCaptcha(prev => ({ ...prev, answer: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-vivid-primary/30 focus:border-vivid-primary text-vivid-on-surface bg-white text-sm"
                      placeholder="Αποτέλεσμα"
                    />
                  </div>

                  {/* Marketing Consent */}
                  <div className="flex items-start gap-3 mt-1">
                    <input
                      type="checkbox"
                      id="marketingConsent"
                      name="marketingConsent"
                      checked={formData.marketingConsent}
                      onChange={handleChange}
                      className="mt-1 w-4 h-4 text-vivid-primary border-gray-300 rounded focus:ring-vivid-primary cursor-pointer"
                    />
                    <label htmlFor="marketingConsent" className="text-xs text-vivid-on-surface-variant leading-tight cursor-pointer select-none">
                      Συμφωνώ να λαμβάνω ενημερώσεις και προσφορές από την SGK Software Development.
                    </label>
                  </div>

                  {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                      {error}
                    </div>
                  )}

                  <div className="mt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-vivid-primary text-white font-bold py-4 rounded-xl shadow-glow hover:bg-vivid-primary/90 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          Αποστολή...
                        </>
                      ) : (
                        "Αποστολή"
                      )}
                    </button>
                    
                    <p className="text-[11px] text-vivid-on-surface-variant/80 text-center flex items-center justify-center gap-1 mt-2">
                      <ShieldCheck size={12} className="text-vivid-primary" />
                      100% Ασφαλές & GDPR Συμβατό • Απεγγραφή με 1 κλικ
                    </p>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

