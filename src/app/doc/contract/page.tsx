"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Printer, Download, ArrowLeft, ShieldCheck, Loader2 } from "lucide-react";

interface ContractData {
  id?: string;
  contractDate?: string;
  city?: string;
  contractorName?: string;
  contractorAddress?: string;
  contractorAfm?: string;
  contractorDoy?: string;
  contractorProfession?: string;
  companyName?: string;
  tradeName?: string;
  gemiNo?: string;
  representativeName?: string;
  representativeFatherName?: string;
  representativeTitle?: string;
  clientAfm?: string;
  totalAmountNum?: number;
  totalAmountText?: string;
  advanceAmountNum?: number;
  advanceAmountText?: string;
  remainingAmountNum?: number;
  remainingAmountText?: string;
  renewalAmountNum?: number;
  renewalAmountText?: string;
  deliveryDaysNum?: number;
  deliveryDaysText?: string;
  ibanDetails?: string;
}

const DEFAULT_CONTRACT: ContractData = {
  contractDate: new Date().toISOString().split("T")[0],
  city: "Αθήνα",
  contractorName: "ΤΣΑΒΟΣ ΣΠΥΡΙΔΩΝ ΧΡΗΣΤΟΣ",
  contractorAddress: "Μεταμόρφωση Αττικής, οδός Ερμού 1 και Λυκοβρύσεως 14, Τ.Κ. 14452",
  contractorAfm: "131398972",
  contractorDoy: "ΚΕΦΟΔΕ ΑΤΤΙΚΗΣ",
  contractorProfession: "Παροχή Υπηρεσιών Πληροφορικής",
  companyName: "................................................",
  tradeName: "................................",
  gemiNo: "....................",
  representativeName: "................................",
  representativeFatherName: "....................",
  representativeTitle: "τον μοναδικό εταίρο και διαχειριστή αυτής",
  clientAfm: "....................",
  totalAmountNum: 124,
  totalAmountText: "εκατόν είκοσι τεσσάρων ευρώ (124,00 €)",
  advanceAmountNum: 0,
  advanceAmountText: "μηδέν ευρώ (0,00 €)",
  remainingAmountNum: 0,
  remainingAmountText: "μηδέν ευρώ (0,00 €)",
  renewalAmountNum: 124,
  renewalAmountText: "εκατόν είκοσι τεσσάρων ευρώ (124,00 €)",
  deliveryDaysNum: 5,
  deliveryDaysText: "πέντε (5)",
  ibanDetails: "GR4602601970000830201330337 (Eurobank), δικαιούχος Σπυρίδων Τσάβος",
};

const formatDateGreek = (dateStr?: string) => {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
};

// Safe UTF-8 Base64 decoder
function safeDecodeBase64(base64Str: string): any {
  try {
    const binary = atob(base64Str);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const jsonStr = new TextDecoder().decode(bytes);
    return JSON.parse(jsonStr);
  } catch (e) {
    try {
      return JSON.parse(decodeURIComponent(atob(base64Str)));
    } catch (e2) {
      return null;
    }
  }
}

function ContractViewer() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const dataParam = searchParams.get("data");
  const autoDownload = searchParams.get("download") === "1" || searchParams.get("download") === "true";

  const [contract, setContract] = useState<ContractData>(DEFAULT_CONTRACT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContract() {
      // 1. Try URL dataParam first (Instant 100% accurate data with no network needed)
      if (dataParam) {
        const decoded = safeDecodeBase64(dataParam);
        if (decoded) {
          setContract(prev => ({ ...DEFAULT_CONTRACT, ...decoded }));
          setLoading(false);
          if (autoDownload) {
            setTimeout(() => window.print(), 600);
          }
          return;
        }
      }

      // 2. Try localStorage if opened on same browser
      if (id) {
        const localSaved = localStorage.getItem("sgk_saved_contracts");
        if (localSaved) {
          try {
            const list = JSON.parse(localSaved);
            const found = list.find((c: any) => c.id === id || (c.clientAfm && id.includes(c.clientAfm)));
            if (found) {
              setContract(prev => ({ ...DEFAULT_CONTRACT, ...found }));
              setLoading(false);
              if (autoDownload) {
                setTimeout(() => window.print(), 600);
              }
              return;
            }
          } catch (e) {}
        }

        // 3. Try Cloud API fetch
        let fetchedData: any = null;
        try {
          const res = await fetch(`/api/documents?type=contract&id=${id}`);
          const json = await res.json();
          if (json.success && json.document?.data) {
            fetchedData = json.document.data;
          }
        } catch (e) {
          console.error(e);
        }

        // 4. Fallback direct public Supabase Storage CDN
        if (!fetchedData) {
          try {
            const cdnRes = await fetch(`https://xrmvingehhiymchoggka.supabase.co/storage/v1/object/public/pdf_uploads/documents/contract_${id}.json`);
            if (cdnRes.ok) {
              const cdnJson = await cdnRes.json();
              if (cdnJson?.data) fetchedData = cdnJson.data;
            }
          } catch (e) {}
        }

        if (fetchedData) {
          setContract(prev => ({ ...DEFAULT_CONTRACT, ...fetchedData }));
        }
      }

      setLoading(false);
      if (autoDownload) {
        setTimeout(() => window.print(), 600);
      }
    }

    loadContract();
  }, [id, dataParam, autoDownload]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <Loader2 className="animate-spin w-8 h-8 text-[#3b5bdb]" />
        <span className="ml-3 text-sm font-bold">Φόρτωση Συμφωνητικού...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f2ea] text-gray-900 font-serif antialiased print:bg-white print:text-black">
      
      {/* Top Floating Action Bar (No Print) */}
      <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white px-6 py-3.5 shadow-xl flex items-center justify-between no-print">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center p-1 shadow-inner">
            <span className="font-heading font-black text-sm tracking-tighter text-white">
              sgk<span className="text-[#3b5bdb]">.</span>
            </span>
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-wider block">Ιδιωτικο Συμφωνητικο (ΓΕΜΗ)</span>
            <span className="text-[10px] text-slate-400 font-mono">
              {contract.companyName && contract.companyName !== "................................................" ? (contract.tradeName || contract.companyName) : "Επίσημο Έγγραφο"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            <ShieldCheck size={12} />
            Επισημο Εγγραφο
          </span>
          <button
            onClick={() => window.print()}
            className="px-5 py-2 bg-[#3b5bdb] hover:bg-[#2b4bba] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2 cursor-pointer"
          >
            <Download size={14} />
            <Printer size={14} />
            Λήψη PDF / Εκτύπωση
          </button>
        </div>
      </nav>

      {/* A4 Document Paper Container */}
      <main className="max-w-[850px] mx-auto my-8 p-10 sm:p-14 bg-white border border-gray-200 rounded-2xl shadow-2xl print:m-0 print:p-0 print:border-none print:shadow-none print:max-w-none print:rounded-none">
        
        {/* Document Header */}
        <div className="text-center pb-6 border-b-2 border-gray-900 mb-8">
          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-gray-900 leading-tight">
            ΙΔΙΩΤΙΚΟ ΣΥΜΦΩΝΗΤΙΚΟ ΠΑΡΟΧΗΣ ΥΠΗΡΕΣΙΩΝ
          </h1>
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-700 mt-1">
            ΚΑΤΑΣΚΕΥΗΣ ΙΣΤΟΣΕΛΙΔΑΣ ΕΤΑΙΡΙΚΗΣ ΔΙΑΦΑΝΕΙΑΣ (ΣΤΟΙΧΕΙΑ ΓΕΜΗ)
          </h2>
        </div>

        {/* Intro */}
        <div className="text-justify text-[13px] leading-relaxed text-gray-800 space-y-4 mb-6">
          <p>
            Στην <strong>{contract.city || "Αθήνα"}</strong>, σήμερα στις <strong>{formatDateGreek(contract.contractDate)}</strong>, μεταξύ των κάτωθι συμβαλλόμενων:
          </p>

          {/* Contractor */}
          <div className="p-3.5 bg-gray-50/80 rounded-lg border border-gray-200">
            <p>
              <strong>1. Αφενός:</strong> ο κ. <strong>{contract.contractorName}</strong>, με έδρα επιχείρησης στη {contract.contractorAddress}, με επάγγελμα «{contract.contractorProfession}», με Α.Φ.Μ. <strong>{contract.contractorAfm}</strong> / Δ.Ο.Υ. <strong>{contract.contractorDoy}</strong>, εφεξής καλούμενος «ο Ανάδοχος»,
            </p>
          </div>

          <p className="text-center font-bold text-xs uppercase tracking-widest text-gray-500 my-2">ΚΑΙ</p>

          {/* Client */}
          <div className="p-3.5 bg-blue-50/40 rounded-lg border border-blue-100">
            <p>
              <strong>2. Αφετέρου:</strong> η εταιρεία με την επωνυμία «<strong>{contract.companyName || "................................................"}</strong>» (διακριτικός τίτλος «<strong>{contract.tradeName || "................................"}</strong>»), με αριθμό <strong>Γ.Ε.ΜΗ. {contract.gemiNo || "...................."}</strong>, νομίμως εκπροσωπούμενη από {contract.representativeTitle || "τον διαχειριστή αυτής"} κ. <strong>{contract.representativeName || "................................"}</strong> του <strong>{contract.representativeFatherName || "...................."}</strong>, με Α.Φ.Μ. <strong>{contract.clientAfm || "...................."}</strong>, εφεξής καλούμενη «ο Εργοδότης» ή «ο Πελάτης»,
            </p>
          </div>

          <p className="font-semibold text-center pt-2">
            συμφωνήθηκαν, συνομολογήθηκαν και έγιναν αμοιβαία αποδεκτά τα ακόλουθα:
          </p>
        </div>

        {/* Articles */}
        <div className="space-y-5 text-[12.5px] leading-relaxed text-gray-800">
          
          {/* Article 1 */}
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <h3 className="font-bold uppercase text-[13px] text-gray-900 mb-2 border-b pb-1">
              ΑΡΘΡΟ 1 – ΑΝΤΙΚΕΙΜΕΝΟ ΤΗΣ ΣΥΜΒΑΣΗΣ
            </h3>
            <p className="text-justify mb-2">
              Ο Ανάδοχος αναλαμβάνει έναντι του Εργοδότη τη σχεδίαση, ανάπτυξη και παράδοση μίας απλής ιστοσελίδας εταιρικής διαφάνειας με τα βασικά στοιχεία της επιχείρησης (Γ.Ε.ΜΗ., Α.Φ.Μ., έδρα, νόμιμη εκπροσώπηση, στοιχεία επικοινωνίας), σύμφωνα με το υπόδειγμα/παράδειγμα σχεδιασμού που έχει υποδείξει ο Εργοδότης.
            </p>
            <p className="text-justify mb-2">
              Σκοπός της ιστοσελίδας είναι να παρέχει στον Εργοδότη έναν δημόσια προσβάσιμο σύνδεσμο (link) με τα στοιχεία διαφάνειας της επιχείρησής του, ώστε να καλύπτονται οι σχετικές του υποχρεώσεις έναντι του Γ.Ε.ΜΗ.
            </p>
            <p className="text-justify">
              Στην αμοιβή του Άρθρου 4 περιλαμβάνονται η κατασκευή της ιστοσελίδας, η αγορά/ενεργοποίηση του domain name και η φιλοξενία (hosting) για τον πρώτο χρόνο.
            </p>
          </div>

          {/* Article 2 */}
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <h3 className="font-bold uppercase text-[13px] text-gray-900 mb-2 border-b pb-1">
              ΑΡΘΡΟ 2 – DOMAIN ΚΑΙ ΦΙΛΟΞΕΝΙΑ (HOSTING)
            </h3>
            <p className="text-justify mb-2">
              1. Το domain name και η φιλοξενία (hosting) της ιστοσελίδας παρέχονται από τον Ανάδοχο και συμπεριλαμβάνονται στο αρχικό κόστος για τους πρώτους δώδεκα (12) μήνες από την ημερομηνία παράδοσης.
            </p>
            <p className="text-justify">
              2. Μετά το πέρας του πρώτου έτους, η ετήσια ανανέωση του domain name και της φιλοξενίας ανέρχεται στο ποσό των <strong>{contract.renewalAmountText || "εκατόν είκοσι τεσσάρων ευρώ (124,00 €)"}</strong> συμπεριλαμβανομένου Φ.Π.Α. 24% ετησίως, καταβλητέο κατόπιν σχετικής ειδοποίησης του Αναδόχου.
            </p>
          </div>

          {/* Article 3 */}
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <h3 className="font-bold uppercase text-[13px] text-gray-900 mb-2 border-b pb-1">
              ΑΡΘΡΟ 3 – ΧΡΟΝΟΣ ΠΑΡΑΔΟΣΗΣ
            </h3>
            <p className="text-justify">
              Ο Ανάδοχος υποχρεούται να ολοκληρώσει και να παραδώσει την ιστοσελίδα σε πλήρη λειτουργία εντός <strong>{contract.deliveryDaysText || "πέντε (5)"}</strong> εργάσιμων ημερών από την ημερομηνία υπογραφής του παρόντος και την παροχή όλων των απαραίτητων στοιχείων από τον Εργοδότη.
            </p>
          </div>

          {/* Article 4 */}
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <h3 className="font-bold uppercase text-[13px] text-gray-900 mb-2 border-b pb-1">
              ΑΡΘΡΟ 4 – ΑΜΟΙΒΗ ΚΑΙ ΤΡΟΠΟΣ ΠΛΗΡΩΜΗΣ
            </h3>
            <p className="text-justify mb-2">
              1. Η συνολική αμοιβή του Αναδόχου για την πλήρη εκτέλεση του έργου ορίζεται στο ποσό των <strong>{contract.totalAmountText || "εκατόν είκοσι τεσσάρων ευρώ (124,00 €)"}</strong>, συμπεριλαμβανομένου Φ.Π.Α. 24%.
            </p>
            <p className="text-justify mb-2">
              2. Η καταβολή της αμοιβής πραγματοποιείται με κατάθεση στον τραπεζικό λογαριασμό του Αναδόχου: <strong>{contract.ibanDetails || "GR4602601970000830201330337 (Eurobank)"}</strong>.
            </p>
            <p className="text-justify">
              3. Με την ολοκλήρωση της πληρωμής, ο Ανάδοχος εκδίδει και αποστέλλει στον Εργοδότη το νόμιμο φορολογικό παραστατικό (Τιμολόγιο Παροχής Υπηρεσιών).
            </p>
          </div>

          {/* Article 5 */}
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <h3 className="font-bold uppercase text-[13px] text-gray-900 mb-2 border-b pb-1">
              ΑΡΘΡΟ 5 – ΤΕΛΙΚΕΣ ΔΙΑΤΑΞΕΙΣ & ΥΠΟΓΡΑΦΕΣ
            </h3>
            <p className="text-justify mb-4">
              Το παρόν συντάχθηκε σε δύο (2) πρωτότυπα αντίτυπα, αναγνώσθηκε, εγκρίθηκε και υπογράφεται από τους συμβαλλόμενους, λαμβάνοντας έκαστος από ένα αντίτυπο.
            </p>

            {/* Signature Area */}
            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-gray-200 text-center">
              <div>
                <p className="font-bold text-xs uppercase tracking-wider text-gray-900 mb-1">Ο ΑΝΑΔΟΧΟΣ</p>
                <p className="text-[11px] text-gray-600 mb-12">ΤΣΑΒΟΣ ΣΠΥΡΙΔΩΝ ΧΡΗΣΤΟΣ</p>
                <div className="border-t border-dashed border-gray-400 w-48 mx-auto pt-1 text-[10px] text-gray-400">
                  (Υπογραφή / Σφραγίδα)
                </div>
              </div>

              <div>
                <p className="font-bold text-xs uppercase tracking-wider text-gray-900 mb-1">Ο ΕΡΓΟΔΟΤΗΣ / ΠΕΛΑΤΗΣ</p>
                <p className="text-[11px] text-gray-600 mb-12">
                  {contract.representativeName || contract.companyName || "................................"}
                </p>
                <div className="border-t border-dashed border-gray-400 w-48 mx-auto pt-1 text-[10px] text-gray-400">
                  (Υπογραφή / Σφραγίδα)
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          main {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 20mm !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function ContractPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Φόρτωση...</div>}>
      <ContractViewer />
    </Suspense>
  );
}
