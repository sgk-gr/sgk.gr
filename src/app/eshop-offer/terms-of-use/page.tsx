import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Όροι Χρήσης | SGK Eshop Offer",
  description: "Όροι Χρήσης για την προσφορά eshop της SGK Software Development.",
};

export default function EshopOfferTerms() {
  return (
    <div className="bg-vivid-surface text-vivid-on-surface font-body-md antialiased overflow-x-hidden min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-vivid-surface/90 backdrop-blur-md docked full-width top-0 sticky shadow-sm z-50">
        <div className="flex justify-between items-center w-full px-gutter py-base max-w-container-max mx-auto z-50">
          <Link href="/eshop-offer" className="flex items-center">
            <img src="/sgk-logo.png" alt="SGK Logo" className="h-14 md:h-20 w-auto object-contain brightness-0" />
          </Link>
          <Link href="/eshop-offer">
            <button className="bg-vivid-primary-container text-vivid-on-primary rounded-full px-6 py-3 font-label-bold text-label-bold hover:bg-vivid-primary transition-colors duration-200 shadow-glow active:scale-95">
              Επιστροφή
            </button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-grow pt-16 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-8 text-vivid-on-surface">
              Όροι Χρήσης
          </h1>
          <div className="space-y-6 text-vivid-on-surface-variant leading-relaxed font-body-lg">
              <section>
                  <h2 className="text-2xl font-heading font-semibold text-vivid-on-surface mb-4">
                      1. Αποδοχή Όρων
                  </h2>
                  <p>
                      Χρησιμοποιώντας την ιστοσελίδα της SGK Software Development, αποδέχεστε πλήρως τους παρόντες όρους χρήσης. Εάν δεν συμφωνείτε, παρακαλούμε να μην χρησιμοποιείτε την υπηρεσία.
                  </p>
              </section>

              <section>
                  <h2 className="text-2xl font-heading font-semibold text-vivid-on-surface mb-4">
                      2. Υπηρεσίες & Ευθύνη
                  </h2>
                  <p>
                      Παρέχουμε υπηρεσίες ανάπτυξης λογισμικού, AI λύσεων και e-commerce. Καταβάλλουμε κάθε δυνατή προσπάθεια για την ακρίβεια των πληροφοριών και την ασφάλεια των συστημάτων μας.
                  </p>
              </section>

              <section>
                  <h2 className="text-2xl font-heading font-semibold text-vivid-on-surface mb-4">
                      3. Πνευματική Ιδιοκτησία
                  </h2>
                  <p>
                      Όλο το περιεχόμενο της ιστοσελίδας, συμπεριλαμβανομένων των κειμένων, γραφικών και κώδικα, αποτελεί πνευματική ιδιοκτησία της SGK Software Development εκτός αν αναφέρεται διαφορετικά.
                  </p>
              </section>

              <p className="pt-10 text-sm italic opacity-70">
                  Τελευταία ενημέρωση: Φεβρουάριος 2026
              </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-vivid-surface-container-low full-width border-t border-vivid-surface-variant/20 mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-gutter py-stack-lg max-w-container-max mx-auto gap-8">
          <div className="flex items-center">
            <img src="/sgk-logo.png" alt="SGK Logo" className="h-10 md:h-12 w-auto object-contain brightness-0" />
          </div>
          <div className="flex gap-4">
            <Link href="/eshop-offer/privacy-policy" className="font-body-md text-body-md text-vivid-on-tertiary-fixed-variant hover:text-vivid-primary transition-all underline underline-offset-4 uppercase">ΠΟΛΙΤΙΚΗ ΑΠΟΡΡΗΤΟΥ</Link>
            <Link href="/eshop-offer/terms-of-use" className="font-body-md text-body-md text-vivid-on-tertiary-fixed-variant hover:text-vivid-primary transition-all underline underline-offset-4 uppercase">ΟΡΟΙ ΧΡΗΣΗΣ</Link>
          </div>
          <div className="font-caption text-caption text-vivid-on-tertiary-fixed-variant">
            © 2026 sgk.gr. Όλα τα δικαιώματα διατηρούνται.
          </div>
        </div>
      </footer>
    </div>
  );
}
