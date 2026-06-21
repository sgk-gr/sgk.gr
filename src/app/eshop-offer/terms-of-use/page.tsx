import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Όροι Χρήσης | SGK Eshop Offer",
  description: "Όροι Χρήσης για την προσφορά eshop της SGK Software Development.",
  robots: {
    index: false,
  },
};

export default function EshopOfferTerms() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-grow bg-[#f4f2ea] pt-24 pb-20">
        <div className="container mx-auto px-6 max-w-4xl bg-white border border-gray-250 p-8 md:p-12 shadow-lg rounded-xl mt-8">
          <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
            <h1 className="text-3xl md:text-4xl font-light text-black">
              Όροι χρήσης
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
                1. Αποδοχή όρων
              </h2>
              <p>
                Χρησιμοποιώντας την ιστοσελίδα της SGK Software Development, αποδέχεστε πλήρως τους παρόντες όρους χρήσης. Εάν δεν συμφωνείτε, παρακαλούμε να μην χρησιμοποιείτε την υπηρεσία.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">
                2. Υπηρεσίες & ευθύνη
              </h2>
              <p>
                Παρέχουμε υπηρεσίες ανάπτυξης λογισμικού, AI λύσεων και e-commerce. Καταβάλλουμε κάθε δυνατή προσπάθεια για την ακρίβεια των πληροφοριών και την ασφάλεια των συστημάτων μας.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">
                3. Πνευματική ιδιοκτησία
              </h2>
              <p>
                Όλο το περιεχόμενο της ιστοσελίδας, συμπεριλαμβανομένων των κειμένων, γραφικών και κώδικα, αποτελεί πνευματική ιδιοκτησία της SGK Software Development εκτός αν αναφέρεται διαφορετικά.
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
