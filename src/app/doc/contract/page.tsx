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

function ContractViewer() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const dataParam = searchParams.get("data");

  const [contract, setContract] = useState<ContractData>(DEFAULT_CONTRACT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContract() {
      // 1. Try URL dataParam first
      if (dataParam) {
        try {
          const decoded = JSON.parse(decodeURIComponent(atob(dataParam)));
          setContract({ ...DEFAULT_CONTRACT, ...decoded });
          setLoading(false);
          return;
        } catch (e) {}
      }

      // 2. Try localStorage if opened locally
      if (id) {
        const localSaved = localStorage.getItem("sgk_saved_contracts");
        if (localSaved) {
          try {
            const list = JSON.parse(localSaved);
            const found = list.find((c: any) => c.id === id);
            if (found) {
              setContract({ ...DEFAULT_CONTRACT, ...found });
              setLoading(false);
              return;
            }
          } catch (e) {}
        }

        // 3. Try Cloud API fetch
        try {
          const res = await fetch(`/api/documents?type=contract&id=${id}`);
          const json = await res.json();
          if (json.success && json.document?.data) {
            setContract({ ...DEFAULT_CONTRACT, ...json.document.data });
          }
        } catch (e) {
          console.error(e);
        }
      }

      setLoading(false);
    }

    loadContract();
  }, [id, dataParam]);

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
              {contract.companyName && contract.companyName !== "................................................" ? contract.companyName : "Επίσημο Έγγραφο"}
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
            className="px-5 py-2 bg-[#3b5bdb] hover:bg-[#2b4bba] text-white font-sans font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 cursor-pointer"
          >
            <Printer size={14} />
            <span>Εκτυπωση / Ληψη PDF</span>
          </button>
        </div>
      </nav>

      {/* Contract Document Container (Standard A4 styling) */}
      <main className="max-w-[850px] mx-auto my-8 bg-white p-12 md:p-16 shadow-2xl rounded-2xl border border-slate-200 print:shadow-none print:border-none print:my-0 print:p-0 print:max-w-full">
        
        {/* Header Titles */}
        <div className="text-center mb-8 pb-4 border-b-2 border-slate-900">
          <h1 className="text-xl md:text-2xl font-black tracking-tight uppercase leading-tight mb-1 text-black font-sans">
            ΙΔΙΩΤΙΚΟ ΣΥΜΦΩΝΗΤΙΚΟ ΠΑΡΟΧΗΣ ΥΠΗΡΕΣΙΩΝ
          </h1>
          <h2 className="text-sm md:text-base font-bold tracking-tight uppercase text-slate-700 font-sans">
            ΚΑΤΑΣΚΕΥΗΣ ΙΣΤΟΣΕΛΙΔΑΣ ΕΤΑΙΡΙΚΗΣ ΔΙΑΦΑΝΕΙΑΣ (ΣΤΟΙΧΕΙΑ ΓΕΜΗ)
          </h2>
        </div>

        {/* Date & Intro */}
        <p className="text-sm md:text-[15px] leading-relaxed mb-4 text-justify">
          Στην <strong>{contract.city || "Αθήνα"}</strong>, σήμερα στις <strong>{formatDateGreek(contract.contractDate)}</strong>, μεταξύ των κάτωθι συμβαλλόμενων:
        </p>

        {/* Contractor */}
        <p className="text-sm md:text-[15px] leading-relaxed mb-3 text-justify pl-4 border-l-2 border-slate-300">
          <strong>1. Αφενός:</strong> ο κ. <strong>{contract.contractorName}</strong>, με έδρα επιχείρησης στη {contract.contractorAddress}, με επάγγελμα «{contract.contractorProfession}», με Α.Φ.Μ. <strong>{contract.contractorAfm}</strong> / Δ.Ο.Υ. <strong>{contract.contractorDoy}</strong>, εφεξής καλούμενος «ο Ανάδοχος»,
        </p>

        <p className="text-center font-bold text-xs uppercase tracking-widest my-2 text-slate-500 font-sans">και</p>

        {/* Client */}
        <p className="text-sm md:text-[15px] leading-relaxed mb-6 text-justify pl-4 border-l-2 border-slate-300">
          <strong>2. Αφετέρου:</strong> η εταιρεία με την επωνυμία <strong>«{contract.companyName || "................................................"}»</strong> (διακριτικός τίτλος <strong>«{contract.tradeName || "................................"}»</strong>), με αριθμό Γ.Ε.ΜΗ. <strong>{contract.gemiNo || "...................."}</strong>, νομίμως εκπροσωπούμενη από {contract.representativeTitle || "τον διαχειριστή αυτής"} κ. <strong>{contract.representativeName || "................................"}</strong> του <strong>{contract.representativeFatherName || "...................."}</strong>, με Α.Φ.Μ. <strong>{contract.clientAfm || "...................."}</strong>, εφεξής καλούμενη «ο Εργοδότης» ή «ο Πελάτης»,
        </p>

        <p className="text-sm md:text-[15px] leading-relaxed mb-6 font-semibold">
          συμφωνήθηκαν, συνομολογήθηκαν και έγιναν αμοιβαία αποδεκτά τα ακόλουθα:
        </p>

        {/* Articles */}
        <div className="space-y-6 text-sm md:text-[15px] leading-relaxed text-justify">
          
          {/* Article 1 */}
          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 print:border-slate-400 print:bg-transparent print:p-0 print:border-none">
            <h3 className="font-bold text-black font-sans uppercase text-xs tracking-wider mb-2">
              Άρθρο 1 – Αντικείμενο της σύμβασης
            </h3>
            <p className="mb-2">
              Ο Ανάδοχος αναλαμβάνει έναντι του Εργοδότη τη σχεδίαση, ανάπτυξη και παράδοση μίας απλής ιστοσελίδας εταιρικής διαφάνειας με τα βασικά στοιχεία της επιχείρησης (Γ.Ε.ΜΗ., Α.Φ.Μ., έδρα, νόμιμη εκπροσώπηση, στοιχεία επικοινωνίας), σύμφωνα με το υπόδειγμα/παράδειγμα σχεδιασμού που έχει υποδείξει ο Εργοδότης.
            </p>
            <p className="mb-2">
              Σκοπός της ιστοσελίδας είναι να παρέχει στον Εργοδότη έναν δημόσια προσβάσιμο σύνδεσμο (link) με τα στοιχεία διαφάνειας της επιχείρησής του, ώστε να καλύπτονται οι σχετικές του υποχρεώσεις έναντι του Γ.Ε.ΜΗ.
            </p>
            <p>
              Στην αμοιβή του Άρθρου 4 περιλαμβάνονται η κατασκευή της ιστοσελίδας, η αγορά/ενεργοποίηση του domain name και η φιλοξενία (hosting) για τον πρώτο χρόνο.
            </p>
          </div>

          {/* Article 2 */}
          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 print:border-slate-400 print:bg-transparent print:p-0 print:border-none">
            <h3 className="font-bold text-black font-sans uppercase text-xs tracking-wider mb-2">
              Άρθρο 2 – Domain και φιλοξενία (hosting)
            </h3>
            <p className="mb-2">
              Το domain name και η φιλοξενία (hosting) της ιστοσελίδας περιλαμβάνονται στην αμοιβή του Άρθρου 4 για τον πρώτο χρόνο λειτουργίας.
            </p>
            <p>
              Μετά την παρέλευση του πρώτου έτους, η ανανέωση του domain και του hosting θα χρεώνεται στον Εργοδότη με το ποσό των <strong>{contract.renewalAmountText}</strong> ετησίως, συμπεριλαμβανομένου Φ.Π.Α.
            </p>
          </div>

          {/* Article 3 */}
          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 print:border-slate-400 print:bg-transparent print:p-0 print:border-none">
            <h3 className="font-bold text-black font-sans uppercase text-xs tracking-wider mb-2">
              Άρθρο 3 – Χρόνος παράδοσης
            </h3>
            <p>
              Ο Ανάδοχος υποχρεούται να παραδώσει την ολοκληρωμένη ιστοσελίδα εντός <strong>{contract.deliveryDaysText}</strong> εργάσιμων ημερών από την {(contract.advanceAmountNum || 0) > 0 ? "καταβολή της προκαταβολής του Άρθρου 4" : "εξόφληση της αμοιβής του Άρθρου 4"}. Ο Εργοδότης υποχρεούται να παρέχει εγκαίρως στον Ανάδοχο τα απαραίτητα στοιχεία της επιχείρησης για την κατασκευή της ιστοσελίδας.
            </p>
          </div>

          {/* Article 4 */}
          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 print:border-slate-400 print:bg-transparent print:p-0 print:border-none">
            <h3 className="font-bold text-black font-sans uppercase text-xs tracking-wider mb-2">
              Άρθρο 4 – Αμοιβή και τρόπος πληρωμής
            </h3>
            <p className="mb-2">
              <strong>4.1</strong> Η συνολική συμφωνηθείσα αμοιβή για την κατασκευή της ιστοσελίδας, συμπεριλαμβανομένων του domain name και του hosting για τον πρώτο χρόνο, ανέρχεται στο ποσό των <strong>{contract.totalAmountText}</strong>, συμπεριλαμβανομένου Φ.Π.Α.
            </p>
            {(contract.advanceAmountNum || 0) === 0 ? (
              <p className="mb-2">
                <strong>4.2</strong> Η εξόφληση της αμοιβής πραγματοποιείται <strong>εφάπαξ</strong> με την ανάθεση και πριν από την έναρξη των εργασιών. Ο Ανάδοχος δεν υπέχει καμία υποχρέωση έναρξης εργασιών πριν από την είσπραξη της αμοιβής.
              </p>
            ) : (
              <>
                <p className="mb-2">
                  <strong>4.2</strong> Ως προκαταβολή συμφωνείται το ποσό των <strong>{contract.advanceAmountText}</strong>, το οποίο καταβάλλεται από τον Εργοδότη στον Ανάδοχο πριν από την έναρξη των εργασιών.
                </p>
                <p className="mb-2">
                  <strong>4.3</strong> Το υπόλοιπο ποσό των <strong>{contract.remainingAmountText}</strong> εξοφλείται από τον Εργοδότη με την παράδοση της ιστοσελίδας.
                </p>
              </>
            )}
            <p className="mb-2">
              <strong>{(contract.advanceAmountNum || 0) === 0 ? "4.3" : "4.4"}</strong> Το σχετικό φορολογικό παραστατικό (τιμολόγιο) θα εκδοθεί από τον Ανάδοχο κατά την είσπραξη της αμοιβής.
            </p>
            <p>
              <strong>{(contract.advanceAmountNum || 0) === 0 ? "4.4" : "4.5"}</strong> Οι πληρωμές πραγματοποιούνται με κατάθεση/έμβασμα στον τραπεζικό λογαριασμό IBAN <strong>{contract.ibanDetails}</strong>.
            </p>
          </div>

          {/* Article 5 */}
          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 print:border-slate-400 print:bg-transparent print:p-0 print:border-none">
            <h3 className="font-bold text-black font-sans uppercase text-xs tracking-wider mb-2">
              Άρθρο 5 – Λοιποί όροι
            </h3>
            <p className="mb-2">
              Με την ολοκλήρωση της πλήρους εξόφλησης της αμοιβής, τα δικαιώματα επί του παραδοτέου κώδικα και του σχεδιασμού της ιστοσελίδας περιέρχονται στον Εργοδότη. Τυχόν πρόσθετες απαιτήσεις ή αλλαγές πέραν του περιγραφόμενου αντικειμένου δύνανται να αποτελέσουν αντικείμενο νέας συμφωνίας.
            </p>
            <p className="mb-2">
              Το παρόν συμφωνητικό διέπεται από το Ελληνικό Δίκαιο. Για την επίλυση κάθε διαφοράς που τυχόν ανακύψει από ή σε σχέση με το παρόν, αρμόδια ορίζονται τα Δικαστήρια Αθηνών.
            </p>
            <p>
              Το παρόν συντάχθηκε σε δύο (2) όμοια πρωτότυπα, τα οποία αφού αναγνώσθηκαν και βεβαιώθηκαν από τους συμβαλλόμενους, υπεγράφησαν από αυτούς και έλαβε έκαστο εξ αυτών από ένα.
            </p>
          </div>

        </div>

        {/* Signatures Section */}
        <div className="mt-14 pt-8 border-t border-slate-200 print:mt-10">
          <p className="text-center font-bold text-sm uppercase tracking-wider mb-8 text-slate-800 font-sans">
            Οι Συμβαλλόμενοι
          </p>

          <div className="grid grid-cols-2 gap-12 text-center text-sm font-sans">
            {/* Contractor */}
            <div className="space-y-4">
              <p className="font-black text-black">Ο Ανάδοχος</p>
              <div className="h-20 flex items-center justify-center">
                <span className="text-xs text-slate-400 italic">Υπογραφή & Σφραγίδα</span>
              </div>
              <div className="w-48 mx-auto border-b border-dashed border-slate-400 pb-1">
                <p className="font-bold text-xs">{contract.contractorName}</p>
              </div>
            </div>

            {/* Employer */}
            <div className="space-y-4">
              <p className="font-black text-black">Ο Εργοδότης / Πελάτης</p>
              <div className="h-20 flex items-center justify-center">
                <span className="text-xs text-slate-400 italic">Υπογραφή & Σφραγίδα</span>
              </div>
              <div className="w-48 mx-auto border-b border-dashed border-slate-400 pb-1">
                <p className="font-bold text-xs">
                  {contract.representativeName && contract.representativeName !== "................................" ? contract.representativeName : "................................"}
                </p>
                <p className="text-[10px] text-slate-500">
                  (για την {contract.tradeName || contract.companyName || "επιχείρηση"})
                </p>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Print CSS Rules */}
      <style jsx global>{`
        @media print {
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 15mm;
          }
        }
      `}</style>

    </div>
  );
}

export default function ContractPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <Loader2 className="animate-spin w-8 h-8 text-[#3b5bdb]" />
        <span className="ml-3 text-sm font-bold">Φόρτωση...</span>
      </div>
    }>
      <ContractViewer />
    </Suspense>
  );
}
