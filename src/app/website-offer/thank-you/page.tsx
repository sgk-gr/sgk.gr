import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Ευχαριστούμε | SGK Digital",
  description: "Ευχαριστούμε για το ενδιαφέρον σας. Θα επικοινωνήσουμε μαζί σας σύντομα.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex flex-col pt-12 bg-[#f4f2ea] font-sans">
        <div className="flex-1 flex items-center justify-center py-20 px-6">
          <div className="max-w-2xl w-full">
            <div className="bg-[#3b5bdb] border border-black/10 p-10 text-center shadow-lg rounded-xl text-white mb-10">
              <h1 className="text-4xl md:text-5xl font-light mb-6 tracking-tight leading-tight">
                Ευχαριστούμε για το ενδιαφέρον σας
              </h1>
              <p className="text-lg text-white/90 leading-relaxed max-w-md mx-auto font-light">
                Θα επικοινωνήσουμε μαζί σας εντός 24 ωρών για να συζητήσουμε τις ανάγκες της επιχείρησής σας.
              </p>
            </div>

            <div className="bg-white border border-gray-250 p-8 rounded-xl shadow-md text-center mb-10">
              <span className="inline-block px-3 py-1 bg-[#facc15] text-black text-xs font-bold uppercase tracking-wider mb-4 rounded-sm">
                Αποκλειστική προσφορά
              </span>
              <p className="text-lg md:text-xl font-bold leading-relaxed text-black">
                Δώρο για εσάς: δωρεάν 1 χρόνο hosting αξίας €100 με την ολοκλήρωση της κατασκευής σας.
              </p>
            </div>

            <div className="flex justify-center">
              <Link 
                href="/" 
                className="inline-flex items-center justify-center bg-[#3b5bdb] hover:bg-[#2b4bba] text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 text-base shadow-sm w-full sm:w-auto text-center"
              >
                Επιστροφή στην αρχική
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
