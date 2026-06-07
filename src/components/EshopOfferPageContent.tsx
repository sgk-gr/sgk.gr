"use client";

import React, { useState, useEffect } from 'react';
import { EshopOfferModal } from './EshopOfferModal';

const EshopOfferPageContent = () => {
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-vivid-surface text-vivid-on-surface font-body-md antialiased overflow-x-hidden">
      {/* TopNavBar */}
      <header className="bg-vivid-surface/90 backdrop-blur-md dark:bg-vivid-surface-dim/90 docked full-width top-0 sticky shadow-sm dark:bg-vivid-surface-container z-50">
        <div className="flex justify-between items-center w-full px-gutter py-base max-w-container-max mx-auto z-50">
          <div className="flex items-center">
            <img src="/sgk-logo.png" alt="SGK Logo" className="h-14 md:h-20 w-auto object-contain brightness-0" />
          </div>
          <nav className="hidden md:flex gap-6 items-center">
            {/* No links defined in JSON, placeholder if needed */}
          </nav>
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
        {/* Mobile Background Image */}
        <div className="absolute inset-0 z-0 md:hidden opacity-[0.08] pointer-events-none flex items-center justify-center">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqyfplGuIgO2qai0CnHiEUA-gGpr3t26Ws07L_PuQHbUhAighB1yvOqXTP_zyr1285V9M1P9KIRP3GZ3KVBcX_fq2MPqytk-R4-lst58ojz5nJcL7J81XKhF2zrRNDBpKnnYnmG4jbs3xg6u0qXKRh6poPEUmeU47_W2IwmjOorR2jbDHLdnKwYebxEuc6pEI2gX4Fm35pj6vfEHlzc4KoVf9i7A5eUKBpSNTGMTXTIA3GKqo02NySZJFR8cxz5x6Mf4QGiyptYvQB" alt="E-shop Mockup Faint Background" className="w-full h-full object-cover grayscale" />
        </div>
        
        <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 gap-stack-lg items-center relative z-10">
          <div className="flex flex-col gap-stack-md">
            <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-vivid-on-surface leading-tight">
              Αποκτήστε ένα <span className="font-sans font-black text-vivid-primary tracking-tight">E-</span><br className="hidden md:block" />
              <span className="font-sans font-black text-vivid-primary tracking-tight">shop</span> με αστραπιαία{' '}<br className="hidden md:block" />
              ταχύτητα που φέρνει{' '}<br className="hidden md:block" />
              Πωλήσεις.
            </h1>
            <p className="font-body-lg text-body-lg text-vivid-on-surface-variant max-w-lg">
              Ένα γρήγορο e-shop φέρνει διπλάσιες πωλήσεις. Εγγύηση επιστροφής χρημάτων αν το e-shop σας δεν είναι τόσο γρήγορο όσο υποσχόμαστε.
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
                Μόνο με 1500€
              </span>
            </div>
            <div className="flex items-center gap-2 mt-4 text-vivid-secondary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>verified</span>
              <span className="font-caption text-caption">100% Εγγύηση Ταχύτητας & SEO, Επιστροφής Χρημάτων</span>
            </div>
          </div>
          <div className="relative z-10 hidden md:flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-2xl shadow-glow border-4 border-white">
              <img alt="Modern Retail E-shop Homepage Design" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqyfplGuIgO2qai0CnHiEUA-gGpr3t26Ws07L_PuQHbUhAighB1yvOqXTP_zyr1285V9M1P9KIRP3GZ3KVBcX_fq2MPqytk-R4-lst58ojz5nJcL7J81XKhF2zrRNDBpKnnYnmG4jbs3xg6u0qXKRh6poPEUmeU47_W2IwmjOorR2jbDHLdnKwYebxEuc6pEI2gX4Fm35pj6vfEHlzc4KoVf9i7A5eUKBpSNTGMTXTIA3GKqo02NySZJFR8cxz5x6Mf4QGiyptYvQB" />
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
              
              {/* Duplicate set for seamless mobile marquee loop (hidden on desktop) */}
              <img src="/logo.png" alt="Kastanidis" className="h-6 w-auto object-contain opacity-60 grayscale transition-all duration-500 shrink-0 md:hidden" />
              <img src="/logotipo13.33eb14ea.png" alt="Vaia Charms" className="h-20 w-auto object-contain opacity-60 grayscale transition-all duration-500 shrink-0 md:hidden" />
              <div className="font-headline-md text-headline-md text-vivid-tertiary font-bold tracking-tighter opacity-60 grayscale transition-all duration-500 shrink-0 md:hidden">H2<span className="text-vivid-secondary">o</span></div>
              <div className="font-headline-md text-headline-md text-vivid-tertiary font-bold tracking-tighter opacity-60 grayscale transition-all duration-500 shrink-0 md:hidden">Yolo<span className="text-vivid-primary-container">8</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Offer Details Bento Grid */}
      <section className="py-section-padding-desktop px-gutter bg-vivid-surface">
        <div className="max-w-container-max mx-auto flex flex-col gap-stack-lg">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-headline-md text-headline-md text-vivid-on-surface mb-4">Όλα όσα περιλαμβάνει το πακέτο σας</h2>
            <p className="font-body-md text-body-md text-vivid-on-surface-variant">Πλήρης λύση χωρίς κρυφά κόστη, σχεδιασμένη για να πουλάτε από την πρώτη μέρα.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Hosting */}
            <div className="bg-vivid-surface-container-lowest rounded-2xl p-8 shadow-soft flex flex-col gap-4 border border-vivid-surface-container hover:shadow-glow transition-shadow duration-300 md:col-span-2 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-64 h-64 bg-vivid-secondary-fixed opacity-20 rounded-full blur-3xl -mr-20 -mt-20"></div>
              <div className="w-12 h-12 rounded-full bg-vivid-secondary-fixed flex items-center justify-center text-vivid-secondary-container relative z-10">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>dns</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-vivid-on-surface relative z-10">Φιλοξενία (Hosting)</h3>
              <p className="font-body-md text-body-md text-vivid-on-surface-variant relative z-10 max-w-md"><b>Δωρεάν για τον 1ο χρόνο.</b> VPS Server για αστραπιαίες ταχύτητες. (180€/έτος μετά τον πρώτο χρόνο)</p>
            </div>

            {/* Domain Name */}
            <div className="bg-vivid-surface-container-lowest rounded-2xl p-8 shadow-soft flex flex-col gap-4 border border-vivid-surface-container hover:shadow-glow transition-shadow duration-300">
              <div className="w-12 h-12 rounded-full bg-vivid-primary-fixed flex items-center justify-center text-vivid-primary-container">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>language</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-vivid-on-surface">Domain Name</h3>
              <p className="font-body-md text-body-md text-vivid-on-surface-variant"><b>Δωρεάν για 2 χρόνια.</b> (20€/έτος μετά τα δύο χρόνια)</p>
            </div>

            {/* Security & Payments */}
            <div className="bg-vivid-surface-container-lowest rounded-2xl p-8 shadow-soft flex flex-col gap-4 border border-vivid-surface-container hover:shadow-glow transition-shadow duration-300">
              <div className="w-12 h-12 rounded-full bg-vivid-secondary-fixed flex items-center justify-center text-vivid-secondary-container">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>payments</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-vivid-on-surface">Ασφάλεια & Πληρωμές</h3>
              <p className="font-body-md text-body-md text-vivid-on-surface-variant"><b>Δωρεάν SSL για ασφαλείς συναλλαγές.</b> Σύνδεση με τράπεζες και IRIS.</p>
            </div>

            {/* Speed & SEO */}
            <div className="bg-vivid-surface-container-lowest rounded-2xl p-8 shadow-soft flex flex-col gap-4 border border-vivid-surface-container hover:shadow-glow transition-shadow duration-300 md:col-span-2 relative overflow-hidden">
              <div className="absolute left-0 bottom-0 w-64 h-64 bg-vivid-primary-fixed opacity-20 rounded-full blur-3xl -ml-20 -mb-20"></div>
              <div className="w-12 h-12 rounded-full bg-vivid-primary-fixed flex items-center justify-center text-vivid-primary-container relative z-10">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>rocket_launch</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-vivid-on-surface relative z-10">Ταχύτητα & SEO Εγγύηση</h3>
              <p className="font-body-md text-body-md text-vivid-on-surface-variant relative z-10 max-w-md">Βελτιστοποίηση για μέγιστη ταχύτητα φόρτωσης και εγγυημένη εμφάνιση στην πρώτη σελίδα της Google. <b>100% Εγγύηση Ταχύτητας & Επιστροφής Χρημάτων</b>.</p>
            </div>

            {/* Skroutz */}
            <div className="bg-vivid-surface-container-lowest rounded-2xl p-8 shadow-soft flex flex-col gap-4 border border-vivid-surface-container hover:shadow-glow transition-shadow duration-300">
              <div className="w-12 h-12 rounded-full bg-vivid-primary-fixed flex items-center justify-center text-vivid-primary-container">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>shopping_basket</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-vivid-on-surface">Διασύνδεση Skroutz</h3>
              <p className="font-body-md text-body-md text-vivid-on-surface-variant">Πλήρης διασύνδεση με το Skroutz Marketplace για αύξηση των πωλήσεών σας.</p>
            </div>

            {/* Products */}
            <div className="bg-vivid-surface-container-lowest rounded-2xl p-8 shadow-soft flex flex-col gap-4 border border-vivid-surface-container hover:shadow-glow transition-shadow duration-300">
              <div className="w-12 h-12 rounded-full bg-vivid-secondary-fixed flex items-center justify-center text-vivid-secondary-container">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>inventory_2</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-vivid-on-surface">Απεριόριστα Προϊόντα</h3>
              <p className="font-body-md text-body-md text-vivid-on-surface-variant">Δημιουργήστε απεριόριστες κατηγορίες και προϊόντα χωρίς κανέναν περιορισμό.</p>
            </div>

            {/* Courier */}
            <div className="bg-vivid-surface-container-lowest rounded-2xl p-8 shadow-soft flex flex-col gap-4 border border-vivid-surface-container hover:shadow-glow transition-shadow duration-300">
              <div className="w-12 h-12 rounded-full bg-vivid-primary-fixed flex items-center justify-center text-vivid-primary-container">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>local_shipping</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-vivid-on-surface">Τρόποι Πληρωμής & Courier</h3>
              <p className="font-body-md text-body-md text-vivid-on-surface-variant">Διασύνδεση με όλες τις δημοφιλείς εταιρείες courier και πύλες πληρωμών.</p>
            </div>

            {/* ERP */}
            <div className="bg-vivid-surface-container-lowest rounded-2xl p-8 shadow-soft flex flex-col gap-4 border border-vivid-surface-container hover:shadow-glow transition-shadow duration-300">
              <div className="w-12 h-12 rounded-full bg-vivid-secondary-fixed flex items-center justify-center text-vivid-secondary-container">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>sync</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-vivid-on-surface">Σύνδεση με ERP Συστήματα</h3>
              <p className="font-body-md text-body-md text-vivid-on-surface-variant">Πλήρης διασύνδεση με το ERP σύστημά σας (Soft1, Entersoft κ.α.) για αυτόματο συγχρονισμό.</p>
            </div>

            {/* Platform Training */}
            <div className="bg-vivid-surface-container-lowest rounded-2xl p-8 shadow-soft flex flex-col gap-4 border border-vivid-surface-container hover:shadow-glow transition-shadow duration-300 md:col-span-2 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 w-48 h-48 bg-vivid-secondary-fixed opacity-10 rounded-full blur-2xl -mr-16 -mb-16"></div>
              <div className="w-12 h-12 rounded-full bg-vivid-secondary-fixed flex items-center justify-center text-vivid-secondary-container relative z-10">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>school</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-vivid-on-surface relative z-10">Εκμάθηση Πλατφόρμας</h3>
              <p className="font-body-md text-body-md text-vivid-on-surface-variant relative z-10 max-w-md">Σας εκπαιδεύουμε στην αποτελεσματική διαχείριση παραγγελιών και προϊόντων για να λειτουργείτε το e-shop σας με αυτοπεποίθηση.</p>
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
              <h2 className="font-headline-md text-headline-md text-vivid-on-surface mb-2">Εγγύηση Επιστροφής Χρημάτων</h2>
              <p className="font-body-lg text-body-lg text-vivid-on-surface-variant mb-6">
                Είμαστε τόσο σίγουροι για την τεχνολογία μας. Αν το e-shop σας δεν πετύχει κορυφαία σκορ ταχύτητας στο Google PageSpeed Insights, σας επιστρέφουμε τα χρήματά σας.
              </p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-vivid-primary-container text-vivid-on-primary rounded-full px-8 py-3 font-label-bold text-label-bold hover:bg-vivid-primary transition-colors duration-200 shadow-glow active:scale-95"
              >
                Ξεκινήστε Χωρίς Ρίσκο
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
          <div className="flex gap-4">
            <a href="/eshop-offer/privacy-policy" className="font-body-md text-body-md text-vivid-on-tertiary-fixed-variant hover:text-vivid-primary transition-all underline underline-offset-4 uppercase">ΠΟΛΙΤΙΚΗ ΑΠΟΡΡΗΤΟΥ</a>
            <a href="/eshop-offer/terms-of-use" className="font-body-md text-body-md text-vivid-on-tertiary-fixed-variant hover:text-vivid-primary transition-all underline underline-offset-4 uppercase">ΟΡΟΙ ΧΡΗΣΗΣ</a>
          </div>
          <div className="font-caption text-caption text-vivid-on-tertiary-fixed-variant">
            © 2026 sgk.gr. Όλα τα δικαιώματα διατηρούνται.
          </div>
        </div>
      </footer>
      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 p-3 rounded-full bg-vivid-primary text-vivid-on-primary shadow-lg transition-all duration-300 flex items-center justify-center hover:bg-vivid-primary/90 active:scale-95 ${
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>arrow_upward</span>
      </button>

      {/* Offer Modal */}
      <EshopOfferModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default EshopOfferPageContent;
