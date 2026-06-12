"use client";

import React, { useState, useEffect } from 'react';
import { WebsiteOfferModal } from './WebsiteOfferModal';

const WebsiteOfferPageContent = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-vivid-surface text-vivid-on-surface font-body-md antialiased overflow-x-hidden">
      {/* TopNavBar */}
      <header className="bg-vivid-surface/90 backdrop-blur-md dark:bg-vivid-surface-dim/90 docked full-width top-0 sticky shadow-sm dark:bg-vivid-surface-container z-50">
        <div className="flex justify-between items-center w-full px-gutter py-base max-w-container-max mx-auto z-50">
          <div className="flex items-center">
            <img src="/sgk-logo.png" alt="SGK Logo" className="h-14 md:h-20 w-auto object-contain brightness-0" />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-vivid-primary-container text-vivid-on-primary rounded-full px-6 py-3 font-label-bold text-label-bold hover:bg-vivid-primary transition-colors duration-200 shadow-glow active:scale-95"
          >
            Πάρε Προσφορά
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-section-padding-mobile md:py-section-padding-desktop px-gutter relative overflow-hidden bg-gradient-to-br from-[#fdfaf8] to-[#fbebe3]">
        <div className="absolute inset-0 z-0 md:hidden opacity-[0.08] pointer-events-none flex items-center justify-center">
          <img src="/yolo.png" alt="Website Mockup Faint Background" className="w-full h-full object-cover grayscale" />
        </div>
        
        <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 gap-stack-lg items-center relative z-10">
          <div className="flex flex-col gap-stack-md">
            <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-vivid-on-surface leading-tight">
              Αποκτήστε <span className="font-sans font-black text-vivid-primary tracking-tight">Website</span><br className="hidden md:block" />
              νέας γενιάς με ασύλληπτη{' '}<br className="hidden md:block" />
              ταχύτητα και κορυφαίο{' '}<br className="hidden md:block" />
              τοπικό SEO.
            </h1>
            <p className="font-body-lg text-body-lg text-vivid-on-surface-variant max-w-lg">
              Μια γρήγορη και επαγγελματική ιστοσελίδα βοηθάει τους πελάτες σας να σας βρουν εύκολα στη Google και να κλείσουν ραντεβού ή να επικοινωνήσουν μαζί σας.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mt-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-vivid-primary-container text-vivid-on-primary rounded-full px-8 py-4 font-label-bold text-label-bold text-lg hover:bg-vivid-primary transition-all duration-300 shadow-glow active:scale-95 flex items-center gap-2"
              >
                Πάρε Προσφορά
                <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>arrow_forward</span>
              </button>
              <span className="font-label-bold text-label-bold text-vivid-primary-container bg-vivid-primary-fixed px-4 py-2 rounded-full border border-vivid-primary-container/20">
                Μόνο με 300€
              </span>
            </div>
            <div className="flex items-center gap-2 mt-4 text-vivid-secondary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>verified</span>
              <span className="font-caption text-caption">Επαγγελματική Παρουσία, SEO & Αστραπιαία Ταχύτητα</span>
            </div>
          </div>
          <div className="relative z-10 hidden md:flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-2xl shadow-glow border-4 border-white">
              <img alt="Modern Website Homepage Design" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700" src="/yolo.png" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
            </div>
            <div className="absolute -right-8 -bottom-8 w-72 h-72 bg-vivid-primary-fixed opacity-30 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-2 md:py-4 bg-vivid-surface-container-low px-gutter">
        <div className="max-w-container-max mx-auto text-center flex flex-col gap-2">
          <h3 className="font-headline-sm text-headline-sm text-vivid-tertiary">Μας εμπιστεύονται</h3>
          <div className="relative w-full overflow-hidden flex md:justify-center mix-blend-multiply">
            <div className="flex flex-nowrap md:flex-wrap items-center gap-12 md:gap-20 group animate-marquee md:animate-none w-max md:w-auto">
              <img src="/logo.png" alt="Kastanidis" className="h-6 md:h-8 w-auto object-contain opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 shrink-0" />
              <img src="/logotipo13.33eb14ea.png" alt="Vaia Charms" className="h-20 md:h-28 w-auto object-contain opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 shrink-0" />
              <div className="font-headline-md text-headline-md text-vivid-tertiary font-bold tracking-tighter opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 shrink-0">H2<span className="text-vivid-secondary">o</span></div>
              <div className="font-headline-md text-headline-md text-vivid-tertiary font-bold tracking-tighter opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 shrink-0">Yolo<span className="text-vivid-primary-container">8</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Offer Details Bento Grid */}
      <section className="py-section-padding-desktop px-gutter bg-vivid-surface">
        <div className="max-w-container-max mx-auto flex flex-col gap-stack-lg">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-headline-md text-headline-md text-vivid-on-surface mb-4">Όλα όσα περιλαμβάνει το πακέτο σας</h2>
            <p className="font-body-md text-body-md text-vivid-on-surface-variant">Ολοκληρωμένη πρόταση ψηφιακής παρουσίας, χωρίς κρυφά κόστη.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Hosting */}
            <div className="bg-vivid-surface-container-lowest rounded-2xl p-8 shadow-soft flex flex-col gap-4 border border-vivid-surface-container hover:shadow-glow transition-shadow duration-300 md:col-span-2 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-64 h-64 bg-vivid-secondary-fixed opacity-20 rounded-full blur-3xl -mr-20 -mt-20"></div>
              <div className="w-12 h-12 rounded-full bg-vivid-secondary-fixed flex items-center justify-center text-vivid-secondary-container relative z-10">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>dns</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-vivid-on-surface relative z-10">Φιλοξενία (Hosting)</h3>
              <p className="font-body-md text-body-md text-vivid-on-surface-variant relative z-10 max-w-md"><b>Δωρεάν για τον 1ο χρόνο.</b> Γρήγορος VPS Server για άμεση απόκριση. (100€/έτος μετά τον πρώτο χρόνο)</p>
            </div>

            {/* Domain Name */}
            <div className="bg-vivid-surface-container-lowest rounded-2xl p-8 shadow-soft flex flex-col gap-4 border border-vivid-surface-container hover:shadow-glow transition-shadow duration-300">
              <div className="w-12 h-12 rounded-full bg-vivid-primary-fixed flex items-center justify-center text-vivid-primary-container">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>language</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-vivid-on-surface">Domain Name</h3>
              <p className="font-body-md text-body-md text-vivid-on-surface-variant"><b>Δωρεάν για 2 χρόνια.</b> (.gr ή .com) (20€/έτος μετά τα δύο χρόνια)</p>
            </div>

            {/* Security & GDPR */}
            <div className="bg-vivid-surface-container-lowest rounded-2xl p-8 shadow-soft flex flex-col gap-4 border border-vivid-surface-container hover:shadow-glow transition-shadow duration-300">
              <div className="w-12 h-12 rounded-full bg-vivid-secondary-fixed flex items-center justify-center text-vivid-secondary-container">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>shield</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-vivid-on-surface">Ασφάλεια & GDPR</h3>
              <p className="font-body-md text-body-md text-vivid-on-surface-variant"><b>Δωρεάν SSL πιστοποιητικό ασφαλείας.</b> Πλήρης συμμόρφωση με τις οδηγίες GDPR.</p>
            </div>

            {/* Speed & SEO */}
            <div className="bg-vivid-surface-container-lowest rounded-2xl p-8 shadow-soft flex flex-col gap-4 border border-vivid-surface-container hover:shadow-glow transition-shadow duration-300 md:col-span-2 relative overflow-hidden">
              <div className="absolute left-0 bottom-0 w-64 h-64 bg-vivid-primary-fixed opacity-20 rounded-full blur-3xl -ml-20 -mb-20"></div>
              <div className="w-12 h-12 rounded-full bg-vivid-primary-fixed flex items-center justify-center text-vivid-primary-container relative z-10">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>rocket_launch</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-vivid-on-surface relative z-10">Αστραπιαία Ταχύτητα & SEO</h3>
              <p className="font-body-md text-body-md text-vivid-on-surface-variant relative z-10 max-w-md">Σχεδιασμένο με Next.js / React για κορυφαίες επιδόσεις Google PageSpeed (95+) και βελτιστοποιημένη εμφάνιση στα αποτελέσματα αναζήτησης (SEO).</p>
            </div>

            {/* Responsive Design */}
            <div className="bg-vivid-surface-container-lowest rounded-2xl p-8 shadow-soft flex flex-col gap-4 border border-vivid-surface-container hover:shadow-glow transition-shadow duration-300">
              <div className="w-12 h-12 rounded-full bg-vivid-primary-fixed flex items-center justify-center text-vivid-primary-container">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>devices</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-vivid-on-surface">Mobile-First Σχεδίαση</h3>
              <p className="font-body-md text-body-md text-vivid-on-surface-variant">Ιστοσελίδες που προσαρμόζονται τέλεια σε κινητά, tablet και υπολογιστές.</p>
            </div>

            {/* Maps & Social */}
            <div className="bg-vivid-surface-container-lowest rounded-2xl p-8 shadow-soft flex flex-col gap-4 border border-vivid-surface-container hover:shadow-glow transition-shadow duration-300">
              <div className="w-12 h-12 rounded-full bg-vivid-secondary-fixed flex items-center justify-center text-vivid-secondary-container">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>map</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-vivid-on-surface">Χάρτες & Social Media</h3>
              <p className="font-body-md text-body-md text-vivid-on-surface-variant">Ενσωμάτωση Google Maps και σύνδεση με Facebook, Instagram και WhatsApp.</p>
            </div>

            {/* Contact Form */}
            <div className="bg-vivid-surface-container-lowest rounded-2xl p-8 shadow-soft flex flex-col gap-4 border border-vivid-surface-container hover:shadow-glow transition-shadow duration-300">
              <div className="w-12 h-12 rounded-full bg-vivid-primary-fixed flex items-center justify-center text-vivid-primary-container">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>mail</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-vivid-on-surface">Φόρμες Επικοινωνίας</h3>
              <p className="font-body-md text-body-md text-vivid-on-surface-variant">Διαδραστικές φόρμες επικοινωνίας και online κλείσιμο ραντεβού.</p>
            </div>

            {/* Platform Training */}
            <div className="bg-vivid-surface-container-lowest rounded-2xl p-8 shadow-soft flex flex-col gap-4 border border-vivid-surface-container hover:shadow-glow transition-shadow duration-300 md:col-span-2 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 w-48 h-48 bg-vivid-secondary-fixed opacity-10 rounded-full blur-2xl -mr-16 -mb-16"></div>
              <div className="w-12 h-12 rounded-full bg-vivid-secondary-fixed flex items-center justify-center text-vivid-secondary-container relative z-10">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>school</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-vivid-on-surface relative z-10">Εκμάθηση & Υποστήριξη</h3>
              <p className="font-body-md text-body-md text-vivid-on-surface-variant relative z-10 max-w-md"><b>1 μήνας δωρεάν υποστήριξη</b> και εκπαίδευση για να διαχειρίζεστε το περιεχόμενο του site σας εύκολα και γρήγορα.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee Block */}
      <section className="py-section-padding-mobile px-gutter">
        <div className="max-w-4xl mx-auto bg-vivid-surface-container-high rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-soft border-2 border-vivid-primary-fixed">
          <div className="absolute inset-0 bg-gradient-to-r from-vivid-primary-fixed/30 to-transparent"></div>
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center text-center md:text-left">
            <div className="w-24 h-24 shrink-0 rounded-full bg-vivid-surface flex items-center justify-center text-vivid-primary shadow-sm">
              <span className="material-symbols-outlined text-[48px]" style={{ fontVariationSettings: '"FILL" 1' }}>security</span>
            </div>
            <div className="flex-1">
              <h2 className="font-headline-md text-headline-md text-vivid-on-surface mb-2">Η Δέσμευσή μας</h2>
              <p className="font-body-lg text-body-lg text-vivid-on-surface-variant mb-6">
                Είμαστε τόσο σίγουροι για την τεχνολογία μας. Δεσμευόμαστε να πετύχουμε κορυφαία σκορ ταχύτητας στο Google PageSpeed Insights για το δικό σας έργο.
              </p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-vivid-primary-container text-vivid-on-primary rounded-full px-8 py-3 font-label-bold text-label-bold hover:bg-vivid-primary transition-colors duration-200 shadow-glow active:scale-95"
              >
                Ξεκινήστε Σήμερα
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-vivid-surface-container-low dark:bg-vivid-surface-container-highest full-width bg-vivid-tertiary-fixed dark:bg-vivid-tertiary-container flat no shadows border-t border-vivid-surface-variant/20">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-gutter py-stack-lg max-w-container-max mx-auto gap-8">
          <div className="flex items-center">
            <img src="/sgk-logo.png" alt="SGK Logo" className="h-10 md:h-12 w-auto object-contain brightness-0" />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex gap-4 text-vivid-on-tertiary-fixed-variant font-body-md text-body-md">
              <a href="tel:6999524389" className="hover:text-vivid-primary transition-all">📞 6999524389</a>
              <a href="mailto:info@sgk.gr" className="hover:text-vivid-primary transition-all">📧 info@sgk.gr</a>
            </div>
            <div className="flex gap-4">
              <a href="/website-offer/privacy-policy" className="font-body-md text-body-md text-vivid-on-tertiary-fixed-variant hover:text-vivid-primary transition-all underline underline-offset-4 uppercase">ΠΟΛΙΤΙΚΗ ΑΠΟΡΡΗΤΟΥ</a>
              <a href="/website-offer/terms-of-use" className="font-body-md text-body-md text-vivid-on-tertiary-fixed-variant hover:text-vivid-primary transition-all underline underline-offset-4 uppercase">ΟΡΟΙ ΧΡΗΣΗΣ</a>
            </div>
          </div>
          <div className="font-caption text-caption text-vivid-on-tertiary-fixed-variant">
            © 2026 sgk.gr. Όλα τα δικαιώματα διατηρούνται.
          </div>
        </div>
      </footer>

      {/* Lead Capture Modal */}
      <WebsiteOfferModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default WebsiteOfferPageContent;
