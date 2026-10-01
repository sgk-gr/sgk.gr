"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Printer, Download, ShieldCheck, Loader2 } from "lucide-react";
import { SIGNATURE_TSAVOS_BASE64 } from "@/lib/signatureTsavos";

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
  representativeAfm?: string;
  clientAfm?: string;
  address?: string;
  serviceType?: "ike_gemi" | "eshop" | "website" | "custom";
  serviceTitle?: string;
  serviceDescription?: string;
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
  includeSignature?: boolean;
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
  representativeAfm: "",
  clientAfm: "....................",
  serviceType: "ike_gemi",
  serviceTitle: "Κατασκευή Ιστοσελίδας Εταιρικής Διαφάνειας (Στοιχεία ΓΕΜΗ) & Σχεδιασμός Λογότυπου",
  serviceDescription: "Σχεδιασμός εταιρικού λογοτύπου (Logo Design), σχεδίαση, ανάπτυξη και παράδοση ιστοσελίδας εταιρικής διαφάνειας με τα βασικά στοιχεία της επιχείρησης έναντι του Γ.Ε.ΜΗ. (βάσει Ν.4072/2012), καταχώριση domain name (.gr), δημιουργία 1 επαγγελματικού εταιρικού email (info@...gr) και φιλοξενία (hosting) 1ου έτους.",
  totalAmountNum: 150,
  totalAmountText: "εκατόν πενήντα ευρώ (150,00 €)",
  advanceAmountNum: 0,
  advanceAmountText: "μηδέν ευρώ (0,00 €)",
  remainingAmountNum: 0,
  remainingAmountText: "μηδέν ευρώ (0,00 €)",
  renewalAmountNum: 150,
  renewalAmountText: "εκατόν πενήντα ευρώ (150,00 €)",
  deliveryDaysNum: 5,
  deliveryDaysText: "πέντε (5)",
  ibanDetails: "GR4602601970000830201330337 (Eurobank), δικαιούχος Σπυρίδων Τσάβος",
  includeSignature: true,
};

const normalizeContractData = (raw: any): ContractData => {
  const merged: ContractData = { ...DEFAULT_CONTRACT, ...raw };
  let title = merged.serviceTitle || DEFAULT_CONTRACT.serviceTitle || "";
  let desc = merged.serviceDescription || DEFAULT_CONTRACT.serviceDescription || "";

  // Always ensure Logo Design is clearly included
  if (!title.toLowerCase().includes("λογοτύπ") && !title.toLowerCase().includes("logo")) {
    title = `${title} & Σχεδιασμός Λογότυπου`;
  }
  if (!desc.toLowerCase().includes("λογοτύπ") && !desc.toLowerCase().includes("logo")) {
    desc = `Σχεδιασμός εταιρικού λογοτύπου (Logo Design), ${desc}`;
  }

  return {
    ...merged,
    serviceTitle: title,
    serviceDescription: desc,
  };
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
    if (contract?.companyName && contract.companyName !== "................................................") {
      document.title = `Ιδιωτικό Συμφωνητικό - ${contract.tradeName || contract.companyName}`;
    } else {
      document.title = "Ιδιωτικό Συμφωνητικό - SGK Digital";
    }
  }, [contract]);

  useEffect(() => {
    async function loadContract() {
      // 1. Try URL dataParam first (Instant 100% accurate data with no network needed)
      if (dataParam) {
        const decoded = safeDecodeBase64(dataParam);
        if (decoded) {
          setContract(normalizeContractData(decoded));
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
              setContract(normalizeContractData(found));
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
            const cdnRes = await fetch(`https://fgyecckvlbkgclsehcgf.supabase.co/storage/v1/object/public/pdf_uploads/documents/contract_${id}.json`);
            if (cdnRes.ok) {
              const cdnJson = await cdnRes.json();
              if (cdnJson?.data) fetchedData = cdnJson.data;
            }
          } catch (e) {}
        }

        if (fetchedData) {
          setContract(normalizeContractData(fetchedData));
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
    <div className="min-h-screen bg-[#f4f2ea] text-black font-serif antialiased print:bg-white print:text-black">
      
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
            className="px-5 py-2.5 bg-[#3b5bdb] hover:bg-[#2b4bba] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2 cursor-pointer"
          >
            <Download size={14} />
            <Printer size={14} />
            Λήψη PDF / Εκτύπωση
          </button>
        </div>
      </nav>

      {/* A4 Document Paper Container (Exact standard legal layout matching Image 1) */}
      <main className="max-w-[850px] mx-auto my-8 p-10 sm:p-14 bg-white border border-gray-200 rounded-sm shadow-2xl text-sm leading-relaxed text-black tracking-normal print:m-0 print:p-0 print:border-none print:shadow-none print:max-w-none print:rounded-none print:bg-white print:text-black">
        
        {/* DOCUMENT TITLE */}
        <div className="text-center font-bold mb-8 print:mb-6">
          <h1 className="text-base sm:text-lg uppercase tracking-tight text-black font-extrabold mb-1">
            ΙΔΙΩΤΙΚΟ ΣΥΜΦΩΝΗΤΙΚΟ ΠΑΡΟΧΗΣ ΥΠΗΡΕΣΙΩΝ
          </h1>
          <h2 className="text-sm uppercase tracking-tight text-black font-extrabold">
            {contract.serviceTitle ? contract.serviceTitle.toUpperCase() : "ΚΑΤΑΣΚΕΥΗΣ ΙΣΤΟΣΕΛΙΔΑΣ ΕΤΑΙΡΙΚΗΣ ΔΙΑΦΑΝΕΙΑΣ (ΣΤΟΙΧΕΙΑ ΓΕΜΗ) & ΣΧΕΔΙΑΣΜΟΥ ΛΟΓΟΤΥΠΟΥ"}
          </h2>
        </div>

        {/* INTRO PARAGRAPH */}
        <p className="mb-4 text-justify">
          Στην <strong>{contract.city || "Αθήνα"}</strong>, σήμερα στις <strong>{formatDateGreek(contract.contractDate)}</strong>, μεταξύ των κάτωθι συμβαλλόμενων:
        </p>

        <p className="mb-3 pl-4 text-justify">
          <strong>1. Αφενός:</strong> ο κ. <strong>{contract.contractorName}</strong>, με έδρα επιχείρησης στη {contract.contractorAddress}, με επάγγελμα «{contract.contractorProfession}», με Α.Φ.Μ. <strong>{contract.contractorAfm}</strong> / Δ.Ο.Υ. <strong>{contract.contractorDoy}</strong>, εφεξής καλούμενος «ο Ανάδοχος»,
        </p>

        <p className="mb-3">και</p>

        <p className="mb-4 pl-4 text-justify">
          <strong>2. Αφετέρου:</strong> η εταιρεία με την επωνυμία <strong>«{contract.companyName || "................................................"}»</strong> (διακριτικός τίτλος <strong>«{contract.tradeName || "................................"}»</strong>), με Α.Φ.Μ. <strong>{contract.clientAfm || "...................."}</strong> και αριθμό Γ.Ε.ΜΗ. <strong>{contract.gemiNo || "...................."}</strong>, νομίμως εκπροσωπούμενη από {contract.representativeTitle || "τον διαχειριστή αυτής"} κ. <strong>{contract.representativeName || "................................"}</strong> του <strong>{contract.representativeFatherName || "...................."}</strong>, με Α.Φ.Μ. <strong>{contract.representativeAfm || "...................."}</strong>, εφεξής καλούμενη «ο Εργοδότης» ή «ο Πελάτης»,
        </p>

        <p className="mb-6 text-justify">
          συμφωνήθηκαν, συνομολογήθηκαν και έγιναν αμοιβαία αποδεκτά τα ακόλουθα:
        </p>

        {/* ARTICLES */}
        <div className="space-y-5 text-justify print:space-y-4">
          
          <div className="contract-article">
            <h3 className="font-bold text-black text-sm mb-1.5">
              Άρθρο 1 – Αντικείμενο της σύμβασης
            </h3>
            <p className="mb-2">
              Ο Ανάδοχος αναλαμβάνει έναντι του Εργοδότη την υλοποίηση και παροχή της υπηρεσίας: <strong>{contract.serviceTitle || "Κατασκευή Ιστοσελίδας Εταιρικής Διαφάνειας (Στοιχεία ΓΕΜΗ) & Σχεδιασμός Λογότυπου"}</strong>.
            </p>
            <p className="mb-2">
              {contract.serviceDescription || "Στις παρεχόμενες υπηρεσίες περιλαμβάνονται: ο γραφιστικός σχεδιασμός εταιρικού λογοτύπου (Logo Design), η σχεδίαση, ανάπτυξη και παράδοση της ιστοσελίδας εταιρικής διαφάνειας με τα νόμιμα στοιχεία της επιχείρησης έναντι του Γ.Ε.ΜΗ. (βάσει Ν.4072/2012), η δημιουργία 1 επαγγελματικού εταιρικού λογαριασμού email (info@...gr), πιστοποιητικό ασφαλείας SSL και πλήρης συμμόρφωση GDPR."}
            </p>
            <p>
              Στην αμοιβή του Άρθρου 4 περιλαμβάνονται ο σχεδιασμός του λογοτύπου, η υλοποίηση του παραδοτέου έργου της ιστοσελίδας, η αγορά/ενεργοποίηση του domain name (.gr), η δημιουργία του εταιρικού email και η φιλοξενία (hosting) για τον πρώτο χρόνο.
            </p>
          </div>

          <div className="contract-article">
            <h3 className="font-bold text-black text-sm mb-1.5">
              Άρθρο 2 – Domain και φιλοξενία (hosting)
            </h3>
            <p className="mb-2">
              Το domain name και η φιλοξενία (hosting) της ιστοσελίδας περιλαμβάνονται στην αμοιβή του Άρθρου 4 για τον πρώτο χρόνο λειτουργίας.
            </p>
            <p>
              Μετά την παρέλευση του πρώτου έτους, η ανανέωση του domain και του hosting θα χρεώνεται στον Εργοδότη με το ποσό των <strong>{contract.renewalAmountText || "εκατόν πενήντα ευρώ (150,00 €)"}</strong> ετησίως, συμπεριλαμβανομένου Φ.Π.Α.
            </p>
          </div>

          <div className="contract-article">
            <h3 className="font-bold text-black text-sm mb-1.5">
              Άρθρο 3 – Χρόνος παράδοσης
            </h3>
            <p>
              Ο Ανάδοχος υποχρεούται να παραδώσει την ολοκληρωμένη ιστοσελίδα και το λογότυπο εντός <strong>{contract.deliveryDaysText || "πέντε (5)"}</strong> εργάσιμων ημερών από την {contract.advanceAmountNum && contract.advanceAmountNum > 0 ? "καταβολή της προκαταβολής του Άρθρου 4" : "εξόφληση της αμοιβής του Άρθρου 4"}. Ο Εργοδότης υποχρεούται να παρέχει εγκαίρως στον Ανάδοχο τα απαραίτητα στοιχεία της επιχείρησης για την κατασκευή της ιστοσελίδας και τις κατευθύνσεις για το λογότυπο.
            </p>
          </div>

          <div className="contract-article">
            <h3 className="font-bold text-black text-sm mb-1.5">
              Άρθρο 4 – Αμοιβή και τρόπος πληρωμής
            </h3>
            <p className="mb-1.5">
              <strong>4.1</strong> Η συνολική συμφωνηθείσα αμοιβή για τον σχεδιασμό του λογοτύπου, την κατασκευή της ιστοσελίδας, συμπεριλαμβανομένων του domain name, του εταιρικού email και του hosting για τον πρώτο χρόνο, ανέρχεται στο ποσό των <strong>{contract.totalAmountText || "εκατόν πενήντα ευρώ (150,00 €)"}</strong>, συμπεριλαμβανομένου Φ.Π.Α.
            </p>

            {contract.advanceAmountNum && contract.advanceAmountNum > 0 ? (
              <>
                <p className="mb-1.5">
                  <strong>4.2</strong> Ως προκαταβολή συμφωνείται το ποσό των <strong>{contract.advanceAmountText}</strong>, το οποίο καταβάλλεται από τον Εργοδότη στον Ανάδοχο πριν από την έναρξη των εργασιών. Ο Ανάδοχος δεν υπέχει καμία υποχρέωση έναρξης εργασιών πριν από την είσπραξη της προκαταβολής.
                </p>
                <p className="mb-1.5">
                  <strong>4.3</strong> Το υπόλοιπο ποσό των <strong>{contract.remainingAmountText}</strong> εξοφλείται από τον Εργοδότη με την παράδοση της ιστοσελίδας και των αρχείων του λογοτύπου.
                </p>
              </>
            ) : (
              <p className="mb-1.5">
                <strong>4.2</strong> Η εξόφληση της αμοιβής πραγματοποιείται <strong>εφάπαξ</strong> με την ανάθεση και πριν από την έναρξη των εργασιών. Ο Ανάδοχος δεν υπέχει καμία υποχρέωση έναρξης εργασιών πριν από την είσπραξη της αμοιβής.
              </p>
            )}

            <p className="mb-1.5">
              <strong>{contract.advanceAmountNum && contract.advanceAmountNum > 0 ? "4.4" : "4.3"}</strong> Το σχετικό φορολογικό παραστατικό (τιμολόγιο) θα εκδοθεί από τον Ανάδοχο κατά την είσπραξη της αμοιβής.
            </p>
            <p>
              <strong>{contract.advanceAmountNum && contract.advanceAmountNum > 0 ? "4.5" : "4.4"}</strong> Οι πληρωμές πραγματοποιούνται με κατάθεση/έμβασμα στον τραπεζικό λογαριασμό IBAN <strong>{contract.ibanDetails || "GR4602601970000830201330337 (Eurobank)"}</strong>, εκτός εάν άλλως συμφωνηθεί μεταξύ των μερών.
            </p>
          </div>

          <div className="contract-article">
            <h3 className="font-bold text-black text-sm mb-1.5">
              Άρθρο 5 – Λοιποί όροι
            </h3>
            <p className="mb-2">
              Με την ολοκλήρωση της πλήρους εξόφλησης της αμοιβής, τα πλήρη δικαιώματα πνευματικής ιδιοκτησίας και η κυριότητα επί του παραδοτέου λογοτύπου, του κώδικα και του σχεδιασμού της ιστοσελίδας περιέρχονται οριστικά και αποκλειστικά στον Εργοδότη. Τυχόν πρόσθετες απαιτήσεις ή αλλαγές πέραν του περιγραφόμενου αντικειμένου δύνανται να αποτελέσουν αντικείμενο νέας συμφωνίας.
            </p>
            <p className="mb-2">
              Το παρόν συμφωνητικό διέπεται από το Ελληνικό Δίκαιο. Για την επίλυση κάθε διαφοράς που τυχόν ανακύψει από ή σε σχέση με το παρόν, αρμόδια ορίζονται τα Δικαστήρια Αθηνών.
            </p>
            <p>
              Το παρόν συντάχθηκε σε δύο (2) όμοια πρωτότυπα, τα οποία αφού αναγνώσθηκαν και βεβαιώθηκαν από τους συμβαλλόμενους, υπεγράφησαν από αυτούς και έλαβε έκαστο εξ αυτών από ένα.
            </p>
          </div>

        </div>

        {/* SIGNATURES SECTION */}
        <div className="contract-signatures mt-10 pt-6 grid grid-cols-2 gap-8 text-center text-xs">
          <div>
            <p className="font-bold text-sm mb-3">Οι Συμβαλλόμενοι:</p>
            <p className="font-bold text-gray-900 mb-2">Ο Ανάδοχος</p>
            <div className="h-20 relative flex items-center justify-center border-b border-dashed border-gray-400 w-3/4 mx-auto mb-2">
              {contract.includeSignature !== false && (
                <img
                  src={SIGNATURE_TSAVOS_BASE64}
                  alt="Υπογραφή Αναδόχου"
                  className="h-16 max-h-16 w-auto object-contain pointer-events-none select-none"
                />
              )}
            </div>
            <p className="font-bold uppercase tracking-wider">{contract.contractorName}</p>
          </div>

          <div>
            <p className="font-bold text-sm mb-3">&nbsp;</p>
            <p className="font-bold text-gray-900 mb-2">Ο Εργοδότης / Πελάτης</p>
            <div className="h-20 border-b border-dashed border-gray-400 w-3/4 mx-auto mb-2" />
            <p className="font-bold uppercase tracking-wider">{contract.representativeName || "................................"}</p>
            <p className="text-[10px] text-gray-600 italic">
              (για λογαριασμό της {contract.tradeName || contract.companyName || "...................."})
            </p>
          </div>
        </div>

      </main>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          html, body {
            background: white !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
            min-height: 0 !important;
            overflow: visible !important;
            font-size: 10pt !important;
            line-height: 1.4 !important;
          }
          .no-print,
          .global-promo-bar,
          #floating-chatbot,
          nav,
          header,
          footer {
            display: none !important;
          }
          main {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 14mm 16mm !important;
            max-width: 100% !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            box-sizing: border-box !important;
          }
          .contract-article {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
            margin-bottom: 10px !important;
          }
          .contract-signatures {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
            margin-top: 20px !important;
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
