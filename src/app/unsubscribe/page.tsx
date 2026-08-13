"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const unsubscribe = async () => {
      try {
        if (token) {
          await fetch(`/api/unsubscribe?token=${token}`);
        }
        setStatus("success");
      } catch (error) {
        console.error("Unsubscribe error:", error);
        setStatus("success");
      }
    };

    unsubscribe();
  }, [token]);

  return (
    <div className="flex-grow flex items-center justify-center p-6 bg-[#f4f2ea] min-h-[60vh] font-sans">
      <div className="max-w-md w-full bg-white border border-gray-250 p-10 text-center shadow-lg rounded-xl">
        {status === "loading" && (
          <div className="flex flex-col items-center">
            <div className="text-xl font-bold text-black mb-3 animate-pulse">Επεξεργασία...</div>
            <p className="text-gray-500 text-sm">Γίνεται διαγραφή από τη λίστα μας.</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center animate-in fade-in duration-300">
            <h1 className="text-3xl font-light text-black mb-4">Διαγραφή επιτυχής</h1>
            <p className="text-gray-600 mb-8 text-[15px] leading-relaxed">
              Το email σας έχει αφαιρεθεί επιτυχώς από τη λίστα ενημερώσεων μας. Δεν θα λάβετε άλλα αυτοματοποιημένα emails από εμάς.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center justify-center bg-[#3b5bdb] hover:bg-[#2b4bba] text-white font-medium px-8 py-3 rounded-lg transition-all duration-300 text-sm shadow-sm"
            >
              Επιστροφή στην αρχική
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center animate-in fade-in duration-300">
            <h1 className="text-3xl font-light text-black mb-4">Παρουσιάστηκε σφάλμα</h1>
            <p className="text-gray-600 mb-8 text-[15px] leading-relaxed">
              Ο σύνδεσμος διαγραφής δεν είναι έγκυρος ή έχει λήξει. Παρακαλώ επικοινωνήστε μαζί μας στο info@sgk.gr αν το πρόβλημα παραμένει.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center justify-center bg-[#3b5bdb] hover:bg-[#2b4bba] text-white font-medium px-8 py-3 rounded-lg transition-all duration-300 text-sm shadow-sm"
            >
              Επιστροφή στην αρχική
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow flex flex-col pt-12">
        <Suspense fallback={
          <div className="flex-grow flex items-center justify-center min-h-[60vh] bg-[#f4f2ea]">
             <div className="text-base text-gray-500 animate-pulse">Φόρτωση...</div>
          </div>
        }>
          <UnsubscribeContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
