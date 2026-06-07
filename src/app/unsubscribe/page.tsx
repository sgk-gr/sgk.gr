"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    const unsubscribe = async () => {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        
        if (!supabaseUrl) {
          throw new Error("Supabase URL not found");
        }

        const response = await fetch(`${supabaseUrl}/functions/v1/unsubscribe?token=${token}`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to unsubscribe");
        }

        setStatus("success");
      } catch (error) {
        console.error("Unsubscribe error:", error);
        setStatus("error");
      }
    };

    unsubscribe();
  }, [token]);

  return (
    <div className="flex-grow flex items-center justify-center p-6 bg-vivid-surface min-h-[60vh]">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-vivid-surface-container-highest">
        {status === "loading" && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-vivid-primary animate-spin mb-4" />
            <h1 className="text-2xl font-bold text-vivid-on-surface mb-2">Επεξεργασία...</h1>
            <p className="text-vivid-on-surface-variant">Γίνεται διαγραφή από τη λίστα μας.</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center fade-in">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
              <CheckCircle size={40} />
            </div>
            <h1 className="text-3xl font-bold text-vivid-on-surface mb-4">Διαγραφή Επιτυχής</h1>
            <p className="text-vivid-on-surface-variant mb-8 text-lg">
              Το email σας έχει αφαιρεθεί επιτυχώς από τη λίστα ενημερώσεων μας. Δεν θα λάβετε άλλα αυτοματοποιημένα emails από εμάς.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white transition-all duration-300 rounded-full bg-vivid-primary hover:bg-vivid-primary/90 shadow-glow"
            >
              Επιστροφή στην Αρχική
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center fade-in">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
              <XCircle size={40} />
            </div>
            <h1 className="text-3xl font-bold text-vivid-on-surface mb-4">Παρουσιάστηκε Σφάλμα</h1>
            <p className="text-vivid-on-surface-variant mb-8 text-lg">
              Ο σύνδεσμος διαγραφής δεν είναι έγκυρος ή έχει λήξει. Παρακαλώ επικοινωνήστε μαζί μας στο info@sgk.gr αν το πρόβλημα παραμένει.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white transition-all duration-300 rounded-full bg-vivid-primary hover:bg-vivid-primary/90 shadow-glow"
            >
              Επιστροφή στην Αρχική
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex flex-col pt-24">
        <Suspense fallback={
          <div className="flex-grow flex items-center justify-center min-h-[60vh]">
             <Loader2 className="w-12 h-12 text-vivid-primary animate-spin" />
          </div>
        }>
          <UnsubscribeContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
