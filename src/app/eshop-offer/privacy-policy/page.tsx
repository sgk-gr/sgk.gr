import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Πολιτική Απορρήτου | SGK Eshop Offer",
  description: "Πολιτική Απορρήτου για την προσφορά eshop της SGK Software Development.",
  robots: {
    index: false,
  },
};

export default function EshopOfferPrivacy() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-grow bg-[#f4f2ea] pt-24 pb-20">
        <div className="container mx-auto px-6 max-w-4xl bg-white border border-gray-250 p-8 md:p-12 shadow-lg rounded-xl mt-8">
          <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
            <h1 className="text-3xl md:text-4xl font-light text-black">
              Πολιτική απορρήτου
            </h1>
            <Link 
              href="/eshop-offer"
              className="inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-5 rounded-lg transition-colors text-xs"
            >
              Επιστροφή
            </Link>
          </div>

          <div className="space-y-8 text-gray-700 leading-relaxed text-[15px]">
            <section>
              <h2 className="text-xl font-bold text-black mb-3">
                1. Εισαγωγή
              </h2>
              <p>
                Στην SGK Software Development, σεβόμαστε την ιδιωτικότητά σας και δεσμευόμαστε για την προστασία των προσωπικών σας δεδομένων. Η παρούσα πολιτική περιγράφει πώς συλλέγουμε και χρησιμοποιούμε τα δεδομένα σας.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">
                2. Δεδομένα που συλλέγουμε
              </h2>
              <p>
                Συλλέγουμε μόνο τα απαραίτητα στοιχεία που μας παρέχετε μέσω της φόρμας επικοινωνίας (όπως email και τηλέφωνο) με σκοπό την εξυπηρέτησή σας.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">
                3. Χρήση δεδομένων
              </h2>
              <p>
                Τα δεδομένα σας χρησιμοποιούνται αποκλειστικά για την επικοινωνία μαζί σας σχετικά με τα projects που σας ενδιαφέρουν. Δεν μοιραζόμαστε ούτε πουλάμε τα στοιχεία σας σε τρίτους.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">
                4. GDPR και δικαιώματα
              </h2>
              <p>
                Σύμφωνα με τον Γενικό Κανονισμό Προστασίας Δεδομένων (GDPR), έχετε το δικαίωμα πρόσβασης, διόρθωσης ή διαγραφής των δεδομένων σας ανά πάσα στιγμή.
              </p>
            </section>

            <p className="pt-6 text-xs italic text-gray-400">
              Τελευταία ενημέρωση: Φεβρουάριος 2026
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
