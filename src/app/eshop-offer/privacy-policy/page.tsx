import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Πολιτική Απορρήτου | SGK Eshop Offer",
  description: "Πολιτική Απορρήτου για την προσφορά eshop της SGK Software Development.",
};

export default function EshopOfferPrivacy() {
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
              Πολιτική Απορρήτου
          </h1>
          <div className="space-y-6 text-vivid-on-surface-variant leading-relaxed font-body-lg">
              <section>
                  <h2 className="text-2xl font-heading font-semibold text-vivid-on-surface mb-4">
                      1. Εισαγωγή
                  </h2>
                  <p>
                      Στην SGK Software Development, σεβόμαστε την ιδιωτικότητά σας και δεσμευόμαστε για την προστασία των προσωπικών σας δεδομένων. Η παρούσα πολιτική περιγράφει πώς συλλέγουμε και χρησιμοποιούμε τα δεδομένα σας.
                  </p>
              </section>

              <section>
                  <h2 className="text-2xl font-heading font-semibold text-vivid-on-surface mb-4">
                      2. Δεδομένα που Συλλέγουμε
                  </h2>
                  <p>
                      Συλλέγουμε μόνο τα απαραίτητα στοιχεία που μας παρέχετε μέσω της φόρμας επικοινωνίας (όπως email και τηλέφωνο) με σκοπό την εξυπηρέτησή σας.
                  </p>
              </section>

              <section>
                  <h2 className="text-2xl font-heading font-semibold text-vivid-on-surface mb-4">
                      3. Χρήση Δεδομένων
                  </h2>
                  <p>
                      Τα δεδομένα σας χρησιμοποιούνται αποκλειστικά για την επικοινωνία μαζί σας σχετικά με τα projects που σας ενδιαφέρουν. Δεν μοιραζόμαστε ούτε πουλάμε τα στοιχεία σας σε τρίτους.
                  </p>
              </section>

              <section>
                  <h2 className="text-2xl font-heading font-semibold text-vivid-on-surface mb-4">
                      4. GDPR και Δικαιώματα
                  </h2>
                  <p>
                      Σύμφωνα με τον Γενικό Κανονισμό Προστασίας Δεδομένων (GDPR), έχετε το δικαίωμα πρόσβασης, διόρθωσης ή διαγραφής των δεδομένων σας ανά πάσα στιγμή.
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
