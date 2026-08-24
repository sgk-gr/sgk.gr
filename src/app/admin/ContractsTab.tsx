"use client";

import React, { useState, useEffect } from "react";
import { 
  FileCheck, Printer, Plus, Trash2, Edit3, Download, Eye, 
  Building2, User, CreditCard
} from "lucide-react";
import { toast } from "sonner";

export interface ContractData {
  id: string;
  createdAt: string;
  contractDate: string; // YYYY-MM-DD
  city: string;
  
  // Contractor (Ανάδοχος) - Fixed Defaults
  contractorName: string;
  contractorAddress: string;
  contractorAfm: string;
  contractorDoy: string;
  contractorProfession: string;

  // Client (Εργοδότης / Πελάτης)
  companyName: string;
  tradeName: string;
  gemiNo: string;
  representativeName: string;
  representativeFatherName: string;
  representativeTitle: string;
  clientAfm: string;

  // Amounts & Terms
  totalAmountNum: number;
  totalAmountText: string;
  advanceAmountNum: number;
  advanceAmountText: string;
  remainingAmountNum: number;
  remainingAmountText: string;
  renewalAmountNum: number;
  renewalAmountText: string;
  deliveryDaysNum: number;
  deliveryDaysText: string;
  ibanDetails: string;
  includeSignature: boolean;
}

const DEFAULT_CONTRACT: ContractData = {
  id: "contract_default",
  createdAt: new Date().toISOString(),
  contractDate: new Date().toISOString().split("T")[0],
  city: "Αθήνα",
  
  contractorName: "ΤΣΑΒΟΣ ΣΠΥΡΙΔΩΝ ΧΡΗΣΤΟΣ",
  contractorAddress: "Μεταμόρφωση Αττικής, οδός Ερμού 1 και Λυκοβρύσεως 14, Τ.Κ. 14452",
  contractorAfm: "131398972",
  contractorDoy: "ΚΕΦΟΔΕ ΑΤΤΙΚΗΣ",
  contractorProfession: "Παροχή Υπηρεσιών Πληροφορικής",

  companyName: "LYROUDIS CONSULTING SERVICES ΜΟΝΟΠΡΟΣΩΠΗ Ι.Κ.Ε.",
  tradeName: "LYROUDIS CONSULTING SERVICES",
  gemiNo: "195135303000",
  representativeName: "ΒΑΣΙΛΕΙΟΣ ΛΥΡΟΥΔΗΣ",
  representativeFatherName: "ΧΡΗΣΤΟΥ",
  representativeTitle: "τον μοναδικό εταίρο και διαχειριστή αυτής",
  clientAfm: "050480299",

  totalAmountNum: 124.00,
  totalAmountText: "εκατόν είκοσι τεσσάρων ευρώ (124,00 €)",
  advanceAmountNum: 0.00,
  advanceAmountText: "μηδέν ευρώ (0,00 €)",
  remainingAmountNum: 0.00,
  remainingAmountText: "μηδέν ευρώ (0,00 €)",
  renewalAmountNum: 124.00,
  renewalAmountText: "εκατόν είκοσι τεσσάρων ευρώ (124,00 €)",
  deliveryDaysNum: 5,
  deliveryDaysText: "πέντε (5)",
  ibanDetails: "GR4602601970000830201330337 (Eurobank), δικαιούχος Σπυρίδων Τσάβος",
  includeSignature: true,
};

// Helper function to format Greek date
const formatDateGreek = (dateStr: string) => {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
};

export function ContractsTab({ initialLead }: { initialLead?: { company?: string; email?: string; first_name?: string } }) {
  const [contracts, setContracts] = useState<ContractData[]>([]);
  const [currentContract, setCurrentContract] = useState<ContractData>(DEFAULT_CONTRACT);
  const [isEditing, setIsEditing] = useState(true);

  // Load saved contracts from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("sgk_saved_contracts");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setContracts(parsed);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Handle initialLead if passed from EmailsTab
  useEffect(() => {
    if (initialLead) {
      const comp = initialLead.company || "";
      const name = initialLead.first_name || "";
      setCurrentContract(prev => ({
        ...prev,
        id: "contract_" + Date.now(),
        companyName: comp || prev.companyName,
        tradeName: comp.replace(/ (ΜΟΝΟΠΡΟΣΩΠΗ|Ι\.Κ\.Ε\.|Ι K E|IKE)/gi, "").trim() || comp || prev.tradeName,
        representativeName: name || prev.representativeName,
      }));
    }
  }, [initialLead]);

  // Save contract to list
  const handleSaveContract = () => {
    const existingIdx = contracts.findIndex(c => c.id === currentContract.id);
    let updated: ContractData[];
    if (existingIdx >= 0) {
      updated = [...contracts];
      updated[existingIdx] = currentContract;
    } else {
      const newContract = { ...currentContract, id: "contract_" + Date.now() };
      updated = [newContract, ...contracts];
      setCurrentContract(newContract);
    }
    setContracts(updated);
    localStorage.setItem("sgk_saved_contracts", JSON.stringify(updated));
    toast.success("Το συμφωνητικό αποθηκεύτηκε επιτυχώς!");
  };

  // Delete contract
  const handleDeleteContract = (id: string) => {
    if (!window.confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το συμφωνητικό;")) return;
    const updated = contracts.filter(c => c.id !== id);
    setContracts(updated);
    localStorage.setItem("sgk_saved_contracts", JSON.stringify(updated));
    toast.info("Το συμφωνητικό διαγράφηκε.");
  };

  // Create New Empty Contract
  const handleCreateNew = () => {
    const newContract: ContractData = {
      ...DEFAULT_CONTRACT,
      id: "contract_" + Date.now(),
      contractDate: new Date().toISOString().split("T")[0],
      companyName: "",
      tradeName: "",
      gemiNo: "",
      representativeName: "",
      representativeFatherName: "",
      clientAfm: "",
    };
    setCurrentContract(newContract);
    setIsEditing(true);
  };

  // Print Contract
  const handlePrint = () => {
    window.print();
  };

  // Helper for auto-calculating amounts
  const handleTotalChange = (val: number) => {
    const total = val || 0;
    const advance = currentContract.advanceAmountNum || 0;
    const remaining = Math.max(0, total - advance);
    setCurrentContract(prev => ({
      ...prev,
      totalAmountNum: total,
      totalAmountText: `${total === 124 ? "εκατόν είκοσι τεσσάρων" : total} ευρώ (${total.toFixed(2).replace(".", ",")} €)`,
      advanceAmountNum: advance,
      advanceAmountText: advance === 0 ? "μηδέν ευρώ (0,00 €)" : `${advance === 50 ? "πενήντα" : advance} ευρώ (${advance.toFixed(2).replace(".", ",")} €)`,
      remainingAmountNum: remaining,
      remainingAmountText: remaining === 0 ? "μηδέν ευρώ (0,00 €)" : `${remaining === 74 ? "εβδομήντα τεσσάρων" : remaining} ευρώ (${remaining.toFixed(2).replace(".", ",")} €)`,
      renewalAmountNum: total,
      renewalAmountText: `${total === 124 ? "εκατόν είκοσι τεσσάρων" : total} ευρώ (${total.toFixed(2).replace(".", ",")} €)`
    }));
  };

  return (
    <div className="space-y-8 no-print-wrapper">
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-xl border border-gray-200 p-6 rounded-3xl shadow-sm no-print">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <FileCheck className="text-[#3b5bdb]" size={22} />
            Ιδιωτικά Συμφωνητικά (ΓΕΜΗ)
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Δημιουργία, Προεπισκόπηση & Εκτύπωση Επίσημου Συμφωνητικού Κατασκευής Ιστοσελίδας
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
              isEditing 
                ? "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-gray-200" 
                : "bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/20"
            }`}
          >
            {isEditing ? <Eye size={14} /> : <Edit3 size={14} />}
            {isEditing ? "Προεπισκόπηση PDF" : "Επεξεργασία Φόρμας"}
          </button>

          <button
            onClick={handleSaveContract}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20"
          >
            <Download size={14} />
            Αποθήκευση
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-[#3b5bdb] hover:bg-[#2b4bba] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-500/20"
          >
            <Printer size={14} />
            Εκτύπωση / PDF
          </button>

          <button
            onClick={handleCreateNew}
            className="px-4 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Plus size={14} />
            Νέο
          </button>
        </div>
      </div>

      {/* Main Grid: Form + Saved Contracts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form or List */}
        <div className={`no-print ${isEditing ? "lg:col-span-6" : "lg:col-span-4"}`}>
          {/* Saved Contracts Selector list */}
          {contracts.length > 0 && (
            <div className="mb-6 bg-white/80 backdrop-blur-xl border border-gray-200 p-5 rounded-3xl shadow-sm space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>Αποθηκευμένα Συμφωνητικά ({contracts.length})</span>
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {contracts.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setCurrentContract(c)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      currentContract.id === c.id 
                        ? "bg-blue-50/80 border-[#3b5bdb] ring-1 ring-[#3b5bdb]/30" 
                        : "bg-gray-50/60 border-gray-200 hover:bg-gray-100/80"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-gray-900 truncate">
                        {c.companyName || "Χωρίς Επωνυμία"}
                      </p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                        ΓΕΜΗ: {c.gemiNo || "-"} | {formatDateGreek(c.contractDate)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteContract(c.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Διαγραφή"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form Editor */}
          {isEditing && (
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 p-6 rounded-3xl shadow-sm space-y-6">
              <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <Building2 size={16} className="text-[#3b5bdb]" />
                  Στοιχεία Συμφωνητικού
                </h3>
                <span className="text-[10px] bg-blue-50 text-[#3b5bdb] px-2.5 py-1 rounded-full font-bold">
                  Φόρμα Εισαγωγής
                </span>
              </div>

              {/* General Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                    Ημερομηνία Σύμβασης
                  </label>
                  <input
                    type="date"
                    value={currentContract.contractDate}
                    onChange={(e) => setCurrentContract({ ...currentContract, contractDate: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#3b5bdb]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                    Πόλη Σύνταξης
                  </label>
                  <input
                    type="text"
                    value={currentContract.city}
                    onChange={(e) => setCurrentContract({ ...currentContract, city: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#3b5bdb]"
                  />
                </div>
              </div>

              {/* Client Info */}
              <div className="space-y-4 pt-2 border-t border-gray-100">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <User size={14} className="text-emerald-600" />
                  Στοιχεία Εργοδότη / Πελάτη
                </h4>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                    Επωνυμία Εταιρείας (π.χ. LYROUDIS CONSULTING SERVICES Μ.Ι.Κ.Ε.)
                  </label>
                  <input
                    type="text"
                    value={currentContract.companyName}
                    onChange={(e) => setCurrentContract({ ...currentContract, companyName: e.target.value })}
                    placeholder="π.χ. LYROUDIS CONSULTING SERVICES ΜΟΝΟΠΡΟΣΩΠΗ Ι.Κ.Ε."
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#3b5bdb]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                      Διακριτικός Τίτλος
                    </label>
                    <input
                      type="text"
                      value={currentContract.tradeName}
                      onChange={(e) => setCurrentContract({ ...currentContract, tradeName: e.target.value })}
                      placeholder="π.χ. LYROUDIS CONSULTING SERVICES"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#3b5bdb]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                      Αριθμός Γ.Ε.ΜΗ.
                    </label>
                    <input
                      type="text"
                      value={currentContract.gemiNo}
                      onChange={(e) => setCurrentContract({ ...currentContract, gemiNo: e.target.value })}
                      placeholder="195135303000"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#3b5bdb]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                      Ονοματεπώνυμο Εκπροσώπου
                    </label>
                    <input
                      type="text"
                      value={currentContract.representativeName}
                      onChange={(e) => setCurrentContract({ ...currentContract, representativeName: e.target.value })}
                      placeholder="ΒΑΣΙΛΕΙΟΣ ΛΥΡΟΥΔΗΣ"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#3b5bdb]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                      Πατρώνυμο Εκπροσώπου
                    </label>
                    <input
                      type="text"
                      value={currentContract.representativeFatherName}
                      onChange={(e) => setCurrentContract({ ...currentContract, representativeFatherName: e.target.value })}
                      placeholder="ΧΡΗΣΤΟΥ"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#3b5bdb]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                      Ιδιότητα Εκπροσώπου
                    </label>
                    <input
                      type="text"
                      value={currentContract.representativeTitle}
                      onChange={(e) => setCurrentContract({ ...currentContract, representativeTitle: e.target.value })}
                      placeholder="τον μοναδικό εταίρο και διαχειριστή αυτής"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#3b5bdb]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                      Α.Φ.Μ. Πελάτη
                    </label>
                    <input
                      type="text"
                      value={currentContract.clientAfm}
                      onChange={(e) => setCurrentContract({ ...currentContract, clientAfm: e.target.value })}
                      placeholder="050480299"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#3b5bdb]"
                    />
                  </div>
                </div>
              </div>

              {/* Financial Terms */}
              <div className="space-y-4 pt-2 border-t border-gray-100">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard size={14} className="text-[#3b5bdb]" />
                  Οικονομικοί Όροι & Πληρωμή
                </h4>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                      Συνολικό Ποσό (€)
                    </label>
                    <input
                      type="number"
                      value={currentContract.totalAmountNum}
                      onChange={(e) => handleTotalChange(parseFloat(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#3b5bdb]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                      Προκαταβολή (€)
                    </label>
                    <input
                      type="number"
                      value={currentContract.advanceAmountNum}
                      onChange={(e) => {
                        const adv = parseFloat(e.target.value) || 0;
                        const rem = Math.max(0, currentContract.totalAmountNum - adv);
                        setCurrentContract({
                          ...currentContract,
                          advanceAmountNum: adv,
                          advanceAmountText: `${adv === 50 ? "πενήντα" : adv} ευρώ (${adv.toFixed(2).replace(".", ",")} €)`,
                          remainingAmountNum: rem,
                          remainingAmountText: `${rem === 74 ? "εβδομήντα τεσσάρων" : rem} ευρώ (${rem.toFixed(2).replace(".", ",")} €)`
                        });
                      }}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#3b5bdb]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                      Υπόλοιπο (€)
                    </label>
                    <input
                      type="number"
                      readOnly
                      value={currentContract.remainingAmountNum}
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                      Ημέρες Παράδοσης
                    </label>
                    <input
                      type="number"
                      value={currentContract.deliveryDaysNum}
                      onChange={(e) => {
                        const num = parseInt(e.target.value) || 5;
                        setCurrentContract({
                          ...currentContract,
                          deliveryDaysNum: num,
                          deliveryDaysText: `${num === 5 ? "πέντε" : num} (${num})`
                        });
                      }}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#3b5bdb]"
                    />
                  </div>
                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentContract.includeSignature}
                        onChange={(e) => setCurrentContract({ ...currentContract, includeSignature: e.target.checked })}
                        className="rounded border-gray-300 text-[#3b5bdb] focus:ring-[#3b5bdb] h-4 w-4"
                      />
                      <span className="text-xs font-bold text-slate-800">
                        Ψηφιακή Υπογραφή Αναδόχου
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                    Στοιχεία IBAN Πληρωμής
                  </label>
                  <input
                    type="text"
                    value={currentContract.ibanDetails}
                    onChange={(e) => setCurrentContract({ ...currentContract, ibanDetails: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#3b5bdb]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Dynamic A4 Document Preview (Formatted exactly like uploaded Idiotiko_Symfonitiko.pdf) */}
        <div className={isEditing ? "lg:col-span-6" : "lg:col-span-8"}>
          <div className="sticky top-24">
            <div className="bg-white text-black font-serif shadow-2xl rounded-sm p-10 md:p-14 border border-gray-200 text-sm leading-relaxed tracking-normal print-contract-area">
              
              {/* DOCUMENT TITLE */}
              <div className="text-center font-bold mb-8">
                <h1 className="text-base uppercase tracking-tight text-black font-extrabold mb-1">
                  ΙΔΙΩΤΙΚΟ ΣΥΜΦΩΝΗΤΙΚΟ ΠΑΡΟΧΗΣ ΥΠΗΡΕΣΙΩΝ
                </h1>
                <h2 className="text-sm uppercase tracking-tight text-black font-extrabold">
                  ΚΑΤΑΣΚΕΥΗΣ ΙΣΤΟΣΕΛΙΔΑΣ ΕΤΑΙΡΙΚΗΣ ΔΙΑΦΑΝΕΙΑΣ (ΣТОΙΧΕΙΑ ΓΕΜΗ)
                </h2>
              </div>

              {/* INTRO PARAGRAPH */}
              <p className="mb-4">
                Στην <strong>{currentContract.city || "Αθήνα"}</strong>, σήμερα στις <strong>{formatDateGreek(currentContract.contractDate)}</strong>, μεταξύ των κάτωθι συμβαλλόμενων:
              </p>

              <p className="mb-3 pl-4">
                <strong>1. Αφενός:</strong> ο κ. <strong>{currentContract.contractorName}</strong>, με έδρα επιχείρησης στη {currentContract.contractorAddress}, με επάγγελμα «{currentContract.contractorProfession}», με Α.Φ.Μ. <strong>{currentContract.contractorAfm}</strong> / Δ.Ο.Υ. <strong>{currentContract.contractorDoy}</strong>, εφεξής καλούμενος «ο Ανάδοχος»,
              </p>

              <p className="mb-3">και</p>

              <p className="mb-4 pl-4">
                <strong>2. Αφετέρου:</strong> η εταιρεία με την επωνυμία <strong>«{currentContract.companyName || "________________________"}»</strong> (διακριτικός τίτλος <strong>«{currentContract.tradeName || "________________________"}»</strong>), με αριθμό Γ.Ε.ΜΗ. <strong>{currentContract.gemiNo || "________________"}</strong>, νομίμως εκπροσωπούμενη από {currentContract.representativeTitle || "τον διαχειριστή αυτής"} κ. <strong>{currentContract.representativeName || "________________________"}</strong> του <strong>{currentContract.representativeFatherName || "________________"}</strong>, με Α.Φ.Μ. <strong>{currentContract.clientAfm || "________________"}</strong>, εφεξής καλούμενη «ο Εργοδότης» ή «ο Πελάτης»,
              </p>

              <p className="mb-6">
                συμφωνήθηκαν, συνομολογήθηκαν και έγιναν αμοιβαία αποδεκτά τα ακόλουθα:
              </p>

              {/* ARTICLES */}
              <div className="space-y-5 text-justify">
                <div>
                  <h3 className="font-bold text-black text-sm mb-1.5">
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

                <div>
                  <h3 className="font-bold text-black text-sm mb-1.5">
                    Άρθρο 2 – Domain και φιλοξενία (hosting)
                  </h3>
                  <p className="mb-2">
                    Το domain name και η φιλοξενία (hosting) της ιστοσελίδας περιλαμβάνονται στην αμοιβή του Άρθρου 4 για τον πρώτο χρόνο λειτουργίας.
                  </p>
                  <p>
                    Μετά την παρέλευση του πρώτου έτους, η ανανέωση του domain και του hosting θα χρεώνεται στον Εργοδότη με το ποσό των <strong>{currentContract.renewalAmountText}</strong> ετησίως, συμπεριλαμβανομένου Φ.Π.Α.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-black text-sm mb-1.5">
                    Άρθρο 3 – Χρόνος παράδοσης
                  </h3>
                  <p>
                    Ο Ανάδοχος υποχρεούται να παραδώσει την ολοκληρωμένη ιστοσελίδα εντός <strong>{currentContract.deliveryDaysText}</strong> εργάσιμων ημερών από την {currentContract.advanceAmountNum > 0 ? "καταβολή της προκαταβολής του Άρθρου 4" : "εξόφληση της αμοιβής του Άρθρου 4"}. Ο Εργοδότης υποχρεούται να παρέχει εγκαίρως στον Ανάδοχο τα απαραίτητα στοιχεία της επιχείρησης για την κατασκευή της ιστοσελίδας.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-black text-sm mb-1.5">
                    Άρθρο 4 – Αμοιβή και τρόπος πληρωμής
                  </h3>
                  <p className="mb-1.5">
                    <strong>4.1</strong> Η συνολική συμφωνηθείσα αμοιβή για την κατασκευή της ιστοσελίδας, συμπεριλαμβανομένων του domain name και του hosting για τον πρώτο χρόνο, ανέρχεται στο ποσό των <strong>{currentContract.totalAmountText}</strong>, συμπεριλαμβανομένου Φ.Π.Α.
                  </p>

                  {currentContract.advanceAmountNum === 0 ? (
                    <p className="mb-1.5">
                      <strong>4.2</strong> Η εξόφληση της αμοιβής πραγματοποιείται <strong>εφάπαξ</strong> με την ανάθεση και πριν από την έναρξη των εργασιών. Ο Ανάδοχος δεν υπέχει καμία υποχρέωση έναρξης εργασιών πριν από την είσπραξη της αμοιβής.
                    </p>
                  ) : (
                    <>
                      <p className="mb-1.5">
                        <strong>4.2</strong> Ως προκαταβολή συμφωνείται το ποσό των <strong>{currentContract.advanceAmountText}</strong>, το οποίο καταβάλλεται από τον Εργοδότη στον Ανάδοχο πριν από την έναρξη των εργασιών. Ο Ανάδοχος δεν υπέχει καμία υποχρέωση έναρξης εργασιών πριν από την είσπραξη της προκαταβολής.
                      </p>
                      <p className="mb-1.5">
                        <strong>4.3</strong> Το υπόλοιπο ποσό των <strong>{currentContract.remainingAmountText}</strong> εξοφλείται από τον Εργοδότη με την παράδοση της ιστοσελίδας.
                      </p>
                    </>
                  )}

                  <p className="mb-1.5">
                    <strong>{currentContract.advanceAmountNum === 0 ? "4.3" : "4.4"}</strong> Το σχετικό φορολογικό παραστατικό (τιμολόγιο) θα εκδοθεί από τον Ανάδοχο κατά την είσπραξη της αμοιβής.
                  </p>
                  <p>
                    <strong>{currentContract.advanceAmountNum === 0 ? "4.4" : "4.5"}</strong> Οι πληρωμές πραγματοποιούνται με κατάθεση/έμβασμα στον τραπεζικό λογαριασμό IBAN <strong>{currentContract.ibanDetails}</strong>, εκτός εάν άλλως συμφωνηθεί μεταξύ των μερών.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-black text-sm mb-1.5">
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

              {/* SIGNATURES SECTION */}
              <div className="mt-12 pt-8 grid grid-cols-2 gap-8 text-center text-xs">
                <div>
                  <p className="font-bold text-sm mb-4">Οι Συμβαλλόμενοι:</p>
                  <p className="font-bold text-gray-900 mb-6">Ο Ανάδοχος</p>
                  
                  {/* Digital Signature graphic */}
                  {currentContract.includeSignature ? (
                    <div className="my-2 flex flex-col items-center justify-center">
                      <svg width="180" height="60" viewBox="0 0 200 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 45 C 35 15, 45 60, 70 30 C 95 10, 85 55, 115 35 C 135 20, 150 50, 185 25" stroke="#1d4ed8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                        <path d="M40 50 C 60 55, 100 48, 160 52" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" fill="none" />
                      </svg>
                    </div>
                  ) : (
                    <div className="h-16" />
                  )}

                  <p className="font-bold uppercase tracking-wider">{currentContract.contractorName}</p>
                </div>

                <div>
                  <p className="font-bold text-sm mb-4">&nbsp;</p>
                  <p className="font-bold text-gray-900 mb-6">Ο Εργοδότης / Πελάτης</p>
                  <div className="h-16 border-b border-dashed border-gray-300 w-3/4 mx-auto mb-2" />
                  <p className="font-bold uppercase tracking-wider">{currentContract.representativeName || "____________________"}</p>
                  <p className="text-[10px] text-gray-600 italic">
                    (για λογαριασμό της {currentContract.tradeName || currentContract.companyName || "εταιρείας"})
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* PRINT MEDIA STYLES FOR CLEAN PDF GENERATION */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .no-print, .no-print-wrapper > div:first-child, nav, header, footer {
            display: none !important;
          }
          .print-contract-area {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            font-size: 11pt !important;
            line-height: 1.4 !important;
          }
          @page {
            size: A4;
            margin: 15mm 20mm 15mm 20mm;
          }
        }
      `}</style>
    </div>
  );
}
