"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendContactEmail } from '@/lib/resend';
import { X, CheckCircle, Loader2 } from 'lucide-react';
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
    email: '',
    marketingConsent: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await sendContactEmail({
        type: 'eshop_offer',
        offerPrice: '1500',
        firstName: '', // Pass empty strings to satisfy potential backend checks
        lastName: '',
        phone: '',
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
          email: '',
          marketingConsent: true,
        });
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
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-[#fdfaf8] to-[#fbebe3] p-6 text-center relative border-b border-[#fcebe2]">
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 text-vivid-on-surface-variant hover:text-vivid-primary transition-colors"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold text-vivid-on-surface mb-2">
                Αποκτήστε την Προσφορά
              </h2>
              <p className="text-vivid-on-surface-variant text-sm">
                Συμπληρώστε το email σας και θα επικοινωνήσουμε άμεσα μαζί σας.
              </p>
            </div>

            {/* Content */}
            <div className="p-6">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8 flex flex-col items-center"
                >
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-vivid-on-surface mb-2">
                    Το αίτημά σας στάλθηκε!
                  </h3>
                  <p className="text-vivid-on-surface-variant mb-6">
                    Ελέγξτε το email σας για επιβεβαίωση. Ένας συνεργάτης μας θα επικοινωνήσει σύντομα μαζί σας.
                  </p>
                  <button
                    onClick={handleClose}
                    className="w-full bg-vivid-surface-container text-vivid-on-surface font-semibold py-3 rounded-full hover:bg-vivid-surface-variant transition-colors"
                  >
                    Κλείσιμο
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-vivid-on-surface mb-1">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-vivid-primary/50 focus:border-vivid-primary transition-all text-vivid-on-surface bg-gray-50/50"
                      placeholder="Το email σας"
                    />
                  </div>

                  <div className="flex items-start gap-3 mt-2">
                    <input
                      type="checkbox"
                      id="marketingConsent"
                      name="marketingConsent"
                      checked={formData.marketingConsent}
                      onChange={handleChange}
                      className="mt-1 w-4 h-4 text-vivid-primary border-gray-300 rounded focus:ring-vivid-primary"
                    />
                    <label htmlFor="marketingConsent" className="text-xs text-vivid-on-surface-variant leading-tight">
                      Συμφωνώ να λαμβάνω ενημερώσεις και προσφορές από την SGK Software Development.
                    </label>
                  </div>

                  {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 w-full bg-vivid-primary text-white font-bold py-4 rounded-xl shadow-glow hover:bg-vivid-primary/90 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
