"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Printer, ShieldCheck, Loader2 } from "lucide-react";

interface OfferItem {
  id: string;
  title: string;
  description: string;
  duration: string;
}

interface InvoiceDocData {
  id?: string;
  clientName?: string;
  clientAfm?: string;
  clientAddress?: string;
  docNo?: string;
  date?: string;
  net?: number;
  vat?: number;
  gross?: number;
  withholding?: number;
  payable?: number;
  offerItems?: OfferItem[];
}

const DEFAULT_INVOICE: InvoiceDocData = {
  clientName: "ΕΤΑΙΡΕΙΑ ΠΕΛΑΤΗ",
  clientAfm: "000000000",
  clientAddress: "Αθήνα",
  docNo: "1",
  date: new Date().toISOString().split("T")[0],
  net: 100,
  vat: 24,
  gross: 124,
  withholding: 20,
  payable: 104,
  offerItems: [
    {
      id: "1",
      title: "Κατασκευή Eshop (WooCommerce & Custom Design)",
      description: "Σχεδιασμός & ανάπτυξη custom ηλεκτρονικού καταστήματος. Περιλαμβάνει responsive σχεδίαση για κινητά/tablets, διασύνδεση με τράπεζες, Google PageSpeed 95+ και βασικό SEO.",
      duration: "25 εργάσιμες ημέρες"
    },
    {
      id: "2",
      title: "Premium Hosting & Τεχνική Υποστήριξη (VPS & Cloudflare)",
      description: "Φιλοξενία σε dedicated cloud server, διαμόρφωση Cloudflare CDN/WAF για μέγιστη ασφάλεια, αυτόματα daily backups και 12 μήνες συνεχή υποστήριξη.",
      duration: "12 μήνες"
    }
  ]
};

const formatDateGreek = (dateStr?: string) => {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
};

function InvoiceViewer() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const dataParam = searchParams.get("data");

  const [doc, setDoc] = useState<InvoiceDocData>(DEFAULT_INVOICE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDoc() {
      // 1. Try URL dataParam first
      if (dataParam) {
        try {
          const decoded = JSON.parse(decodeURIComponent(atob(dataParam)));
          setDoc({ ...DEFAULT_INVOICE, ...decoded });
          setLoading(false);
          return;
        } catch (e) {}
      }

      // 2. Try localStorage
      if (id) {
        const localSaved = localStorage.getItem("sgk_saved_invoices");
        if (localSaved) {
          try {
            const list = JSON.parse(localSaved);
            const found = list.find((c: any) => c.id === id);
            if (found) {
              setDoc({ ...DEFAULT_INVOICE, ...found });
              setLoading(false);
              return;
            }
          } catch (e) {}
        }

        // 3. Try Cloud API fetch
        try {
          const res = await fetch(`/api/documents?type=invoice&id=${id}`);
          const json = await res.json();
          if (json.success && json.document?.data) {
            setDoc({ ...DEFAULT_INVOICE, ...json.document.data });
          }
        } catch (e) {
          console.error(e);
        }
      }

      setLoading(false);
    }

    loadDoc();
  }, [id, dataParam]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <Loader2 className="animate-spin w-8 h-8 text-[#3b5bdb]" />
        <span className="ml-3 text-sm font-bold">Φόρτωση Τιμολογίου & Προσφοράς...</span>
      </div>
    );
  }

  const net = doc.net || 100;
  const vat = doc.vat || 24;
  const gross = doc.gross || 124;
  const withholding = doc.withholding || (gross >= 300 ? net * 0.2 : 0);
  const payable = doc.payable || (gross - withholding);

  return (
    <div className="min-h-screen bg-[#f4f2ea] text-slate-800 font-sans antialiased print:bg-white print:text-black">
      
      {/* Top Floating Action Bar (No Print) */}
      <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white px-6 py-3.5 shadow-xl flex items-center justify-between no-print">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center p-1 shadow-inner">
            <span className="font-heading font-black text-sm tracking-tighter text-white">
              sgk<span className="text-[#3b5bdb]">.</span>
            </span>
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-wider block">Τεχνικη Προσφορα & Προτιμολογιο</span>
            <span className="text-[10px] text-slate-400 font-mono">
              #{doc.docNo || "1"} | {doc.clientName || "Πελάτης"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            <ShieldCheck size={12} />
            2 Σελιδες (PDF)
          </span>
          <button
            onClick={() => window.print()}
            className="px-5 py-2 bg-[#3b5bdb] hover:bg-[#2b4bba] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 cursor-pointer"
          >
            <Printer size={14} />
            <span>Εκτυπωση / Ληψη PDF</span>
          </button>
        </div>
      </nav>

      <main className="max-w-[850px] mx-auto my-8 space-y-8 print:space-y-0 print:my-0">
        
        {/* --- PAGE 1: AADE INVOICE MOCKUP --- */}
        <div className="bg-white p-8 md:p-12 shadow-2xl rounded-2xl border border-slate-200 print:shadow-none print:border-none print:p-0 print:break-after-page">
          
          <div className="text-[9px] text-rose-600 font-extrabold text-center bg-rose-50/50 border border-rose-200 py-2.5 px-4 rounded-xl mb-4 italic tracking-wide leading-relaxed shadow-sm">
            ⚠️ Το παρόν δεν αποτελεί φορολογικό στοιχείο (τιμολόγιο), αλλά απεικόνιση της προσφοράς και του συμφωνηθέντος ποσού.
          </div>

          {/* Seller Header */}
          <div className="flex justify-between items-start gap-4 border-b-2 border-slate-200 pb-6">
            <div className="space-y-1.5 text-[11px] text-slate-700 w-2/3">
              <div className="flex gap-2">
                <span className="bg-slate-100 border border-slate-300 text-slate-800 font-bold px-2 py-0.5 rounded text-[9px] uppercase min-w-[75px] text-center">Επωνυμια</span>
                <span className="font-bold text-slate-900">ΤΣΑΒΟΣ ΣΠΥΡΙΔΩΝ ΧΡΗΣΤΟΣ</span>
              </div>
              <div className="flex gap-2">
                <span className="bg-slate-100 border border-slate-300 text-slate-800 font-bold px-2 py-0.5 rounded text-[9px] uppercase min-w-[75px] text-center">Α.Φ.Μ.</span>
                <span className="font-bold text-slate-900">131398972</span>
              </div>
              <div className="flex gap-2">
                <span className="bg-slate-100 border border-slate-300 text-slate-800 font-bold px-2 py-0.5 rounded text-[9px] uppercase min-w-[75px] text-center">Επαγγελμα</span>
                <span className="font-bold text-slate-900">ΠΑΡΟΧΗ ΥΠΗΡΕΣΙΩΝ ΠΛΗΡΟΦΟΡΙΚΗΣ</span>
              </div>
              <div className="flex gap-2">
                <span className="bg-slate-100 border border-slate-300 text-slate-800 font-bold px-2 py-0.5 rounded text-[9px] uppercase min-w-[75px] text-center">Δ.Ο.Υ.</span>
                <span className="font-bold text-slate-900">ΚΕΦΟΔΕ ΑΤΤΙΚΗΣ</span>
              </div>
              <div className="flex gap-2">
                <span className="bg-slate-100 border border-slate-300 text-slate-800 font-bold px-2 py-0.5 rounded text-[9px] uppercase min-w-[75px] text-center">Διευθυνση</span>
                <span className="font-bold text-slate-900 text-[10px]">ΕΡΜΟΥ 1 ΚΑΙ ΛΥΚΟΒΡΥΣΕΩΣ 14 - ΜΕΤΑΜΟΡΦΩΣΗ, Τ.Κ: 14452</span>
              </div>
            </div>

            {/* SGK Logo */}
            <div className="flex flex-col items-end w-1/3">
              <span className="font-heading font-black text-3xl tracking-tighter text-[#0f2d59] leading-none">
                sgk<span className="text-[#3b5bdb]">.</span>
              </span>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">
                Software Development
              </span>
            </div>
          </div>

          {/* Doc Title */}
          <div className="bg-[#0f2d59] text-white text-center py-2.5 text-xs font-black uppercase tracking-widest rounded-lg mt-4 shadow-sm">
            Τιμολογιο Παροχης Υπηρεσιων
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-5 gap-2 mt-2 text-[10px] font-bold text-slate-800">
            <div className="border border-slate-200 p-2 rounded-lg bg-slate-50/50">
              <span className="text-[8px] text-slate-500 block uppercase mb-1">Σειρα</span>
              <span>A</span>
            </div>
            <div className="border border-slate-200 p-2 rounded-lg bg-slate-50/50">
              <span className="text-[8px] text-slate-500 block uppercase mb-1">Α.Α.</span>
              <span>{doc.docNo || "1"}</span>
            </div>
            <div className="border border-slate-200 p-2 rounded-lg bg-slate-50/50">
              <span className="text-[8px] text-slate-500 block uppercase mb-1">Ημερομηνια</span>
              <span>{formatDateGreek(doc.date)}</span>
            </div>
            <div className="border border-slate-200 p-2 rounded-lg bg-slate-50/50">
              <span className="text-[8px] text-slate-500 block uppercase mb-1">ΜΑΡΚ</span>
              <span className="font-mono text-[9px] truncate block">4000135...</span>
            </div>
            <div className="border border-slate-200 p-2 rounded-lg bg-slate-50/50">
              <span className="text-[8px] text-slate-500 block uppercase mb-1">Τροπος Πληρωμης</span>
              <span>Web Banking</span>
            </div>
          </div>

          {/* Buyer Details */}
          <div className="mt-4 border border-slate-200 p-4 rounded-xl bg-slate-50/50">
            <h4 className="text-[10px] font-black text-slate-900 uppercase border-b border-slate-200 pb-1 mb-2">
              Στοιχεια Ληπτη (Πελατη)
            </h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <div className="text-[10px] text-slate-500 uppercase">Επωνυμια / Διακριτικος Τιτλος</div>
                <div className="font-black text-slate-900">{doc.clientName || "-"}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] text-slate-500 uppercase">Α.Φ.Μ. / Δ.Ο.Υ.</div>
                <div className="font-black text-slate-900">{doc.clientAfm || "-"}</div>
              </div>
              <div className="col-span-2 space-y-1">
                <div className="text-[10px] text-slate-500 uppercase">Διευθυνση Εδρας</div>
                <div className="font-semibold text-slate-800">{doc.clientAddress || "-"}</div>
              </div>
            </div>
          </div>

          {/* Pricing Table */}
          <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0f2d59] text-white text-[10px] uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-3">Περιγραφη Υπηρεσιων</th>
                  <th className="p-3 text-right">Ποσοτητα</th>
                  <th className="p-3 text-right">Καθαρη Αξια</th>
                  <th className="p-3 text-right">Φ.Π.Α. (24%)</th>
                  <th className="p-3 text-right">Συνολο</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                <tr>
                  <td className="p-3">
                    <strong className="block text-slate-900">Κατασκευή & Ανάπτυξη Λογισμικού / Ιστοσελίδας</strong>
                    <span className="text-[10px] text-slate-500">Σύμφωνα με την τεχνική προσφορά (Σελίδα 2)</span>
                  </td>
                  <td className="p-3 text-right font-mono">1</td>
                  <td className="p-3 text-right font-mono font-bold">{net.toFixed(2).replace(".", ",")} €</td>
                  <td className="p-3 text-right font-mono font-bold text-blue-600">{vat.toFixed(2).replace(".", ",")} €</td>
                  <td className="p-3 text-right font-mono font-black text-slate-900">{gross.toFixed(2).replace(".", ",")} €</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Financial Summary */}
          <div className="mt-4 flex justify-end">
            <div className="w-full sm:w-1/2 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 font-bold">
                <span>Καθαρή Αξία:</span>
                <span className="font-mono text-slate-900">{net.toFixed(2).replace(".", ",")} €</span>
              </div>
              <div className="flex justify-between text-blue-600 font-bold">
                <span>Φ.Π.Α. 24%:</span>
                <span className="font-mono">+{vat.toFixed(2).replace(".", ",")} €</span>
              </div>
              <div className="flex justify-between text-slate-900 font-black text-sm pt-2 border-t border-slate-200">
                <span>Συνολική Αξία:</span>
                <span className="font-mono">{gross.toFixed(2).replace(".", ",")} €</span>
              </div>
              {withholding > 0 && (
                <div className="flex justify-between text-rose-600 font-bold text-xs pt-1">
                  <span>Παρακράτηση Φόρου 20%:</span>
                  <span className="font-mono">-{withholding.toFixed(2).replace(".", ",")} €</span>
                </div>
              )}
              <div className="flex justify-between text-emerald-700 font-black text-sm pt-2 border-t-2 border-emerald-500">
                <span>Πληρωτέο Ποσό:</span>
                <span className="font-mono font-black">{payable.toFixed(2).replace(".", ",")} €</span>
              </div>
            </div>
          </div>

          {/* Bank IBAN */}
          <div className="mt-4 p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-xs">
            <span className="font-black text-[#0f2d59] uppercase block text-[10px] mb-1">Τραπεζικος Λογαριασμος Εξοφλησης</span>
            <div className="font-mono font-bold text-slate-800">
              Eurobank IBAN: <span className="text-[#3b5bdb]">GR46 0260 1970 0008 3020 1330 337</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Δικαιούχος: ΤΣΑΒΟΣ ΣΠΥΡΙΔΩΝ ΧΡΗΣΤΟΣ</div>
          </div>

        </div>

        {/* --- PAGE 2: TECHNICAL PROPOSAL --- */}
        <div className="bg-white p-8 md:p-12 shadow-2xl rounded-2xl border border-slate-200 print:shadow-none print:border-none print:p-0">
          
          <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-center">
            <div>
              <span className="text-[10px] font-black text-[#3b5bdb] uppercase tracking-widest block">SGK Digital Technical Scope</span>
              <h2 className="text-xl font-black uppercase text-slate-900 tracking-tight">Αναλυτικη Τεχνικη Προσφορα</h2>
            </div>
            <div className="text-right text-xs font-bold text-slate-500">
              Σελίδα 2 / 2
            </div>
          </div>

          <div className="space-y-6">
            {(doc.offerItems || []).map((item, idx) => (
              <div key={item.id || idx} className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-sm text-[#0f2d59]">
                    {idx + 1}. {item.title}
                  </h3>
                  {item.duration && (
                    <span className="text-[10px] font-bold font-mono bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      ⏱️ {item.duration}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed text-justify">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Security & Guarantee Footer */}
          <div className="mt-8 pt-6 border-t border-slate-200 text-center text-xs text-slate-500 font-semibold space-y-1">
            <p>Όλα τα παραδοτέα συνοδεύονται από εγγύηση καλής λειτουργίας & υποστήριξη της <strong>SGK Digital</strong>.</p>
            <p className="text-[10px] text-slate-400">SGK Software Development • info@sgk.gr • 211 114 0013</p>
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
            margin: 12mm;
          }
        }
      `}</style>

    </div>
  );
}

export default function InvoicePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <Loader2 className="animate-spin w-8 h-8 text-[#3b5bdb]" />
        <span className="ml-3 text-sm font-bold">Φόρτωση...</span>
      </div>
    }>
      <InvoiceViewer />
    </Suspense>
  );
}
