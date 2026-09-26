"use client";

import React, { useState, useEffect } from "react";
import { 
  FileCheck, Printer, Plus, Trash2, Edit3, Download, Eye, 
  Building2, User, CreditCard, Search, Sparkles, Loader2, RefreshCw,
  X, Check, Copy, Landmark, Mail, ExternalLink, Receipt
} from "lucide-react";
import { toast } from "sonner";

// Safe UTF-8 Base64 encoder
function safeEncodeBase64(data: any): string {
  try {
    const jsonStr = JSON.stringify(data);
    const utf8Bytes = new TextEncoder().encode(jsonStr);
    let binary = "";
    for (let i = 0; i < utf8Bytes.length; i++) {
      binary += String.fromCharCode(utf8Bytes[i]);
    }
    return btoa(binary);
  } catch (e) {
    return "";
  }
}

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
  representativeAfm?: string;
  clientAfm: string;
  address?: string;

  // Service / Scope
  serviceType: "ike_gemi" | "eshop" | "website" | "custom";
  serviceTitle: string;
  serviceDescription: string;

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

  // Digital Signatures (Base64 Canvas Drawings)
  contractorSignatureData?: string;
  clientSignatureData?: string;
}

export const DEFAULT_CONTRACT: ContractData = {
  id: "contract_default",
  createdAt: new Date().toISOString(),
  contractDate: new Date().toISOString().split("T")[0],
  city: "Αθήνα",
  
  contractorName: "ΤΣΑΒΟΣ ΣΠΥΡΙΔΩΝ ΧΡΗΣΤΟΣ",
  contractorAddress: "Μεταμόρφωση Αττικής, οδός Ερμού 1 και Λυκοβρύσεως 14, Τ.Κ. 14452",
  contractorAfm: "131398972",
  contractorDoy: "ΚΕΦΟΔΕ ΑΤΤΙΚΗΣ",
  contractorProfession: "Παροχή Υπηρεσιών Πληροφορικής",

  companyName: "",
  tradeName: "",
  gemiNo: "",
  representativeName: "",
  representativeFatherName: "",
  representativeTitle: "τον μοναδικό εταίρο και διαχειριστή αυτής",
  representativeAfm: "",
  clientAfm: "",
  address: "",

  serviceType: "ike_gemi",
  serviceTitle: "Κατασκευή Ιστοσελίδας Εταιρικής Διαφάνειας (Στοιχεία ΓΕΜΗ)",
  serviceDescription: "Σχεδίαση, ανάπτυξη και παράδοση απλής ιστοσελίδας εταιρικής διαφάνειας με τα βασικά στοιχεία της επιχείρησης έναντι του Γ.Ε.ΜΗ., καταχώριση domain name (.gr) και φιλοξενία (hosting) 1ου έτους.",

  totalAmountNum: 150.00,
  totalAmountText: "εκατόν πενήντα ευρώ (150,00 €)",
  advanceAmountNum: 0.00,
  advanceAmountText: "μηδέν ευρώ (0,00 €)",
  remainingAmountNum: 0.00,
  remainingAmountText: "μηδέν ευρώ (0,00 €)",
  renewalAmountNum: 150.00,
  renewalAmountText: "εκατόν πενήντα ευρώ (150,00 €)",
  deliveryDaysNum: 5,
  deliveryDaysText: "πέντε (5)",
  ibanDetails: "GR4602601970000830201330337 (Eurobank), δικαιούχος Σπυρίδων Τσάβος",
  includeSignature: false,
  contractorSignatureData: "",
  clientSignatureData: "",
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

export function ContractsTab({ 
  initialLead, 
  onSendToEmail 
}: { 
  initialLead?: { company?: string; email?: string; first_name?: string };
  onSendToEmail?: () => void;
}) {
  const [contracts, setContracts] = useState<ContractData[]>([]);
  const [currentContract, setCurrentContract] = useState<ContractData>(DEFAULT_CONTRACT);
  const [isEditing, setIsEditing] = useState(true);
  const [previewDocType, setPreviewDocType] = useState<"contract" | "invoice">("contract");
  const [ymsDetectedInfo, setYmsDetectedInfo] = useState<{ detected: boolean; afm?: string; father?: string; name?: string } | null>(null);

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

  const [gemiSearchQuery, setGemiSearchQuery] = useState("");
  const [isSearchingGemi, setIsSearchingGemi] = useState(false);

  // GEMI Auto Lookup Handler
  const handleGemiLookup = async (overrideQuery?: string) => {
    const q = (overrideQuery || gemiSearchQuery || currentContract.clientAfm || currentContract.gemiNo || "").trim();
    if (!q) {
      toast.error("Παρακαλώ εισάγετε Α.Φ.Μ. (9 ψηφία) ή Αριθμό Γ.Ε.ΜΗ. (12 ψηφία).");
      return;
    }

    setIsSearchingGemi(true);
    try {
      const res = await fetch(`/api/gemi-lookup?query=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (data.success && data.company) {
        const co = data.company;
        setCurrentContract(prev => ({
          ...prev,
          companyName: co.companyName || prev.companyName,
          tradeName: co.tradeName || prev.tradeName,
          gemiNo: co.gemiNo || prev.gemiNo,
          clientAfm: co.clientAfm || prev.clientAfm,
          city: co.city || prev.city,
          representativeName: co.representativeName || prev.representativeName,
          representativeFatherName: co.representativeFatherName || prev.representativeFatherName,
          representativeAfm: co.representativeAfm || prev.representativeAfm || "",
          representativeTitle: co.representativeTitle || prev.representativeTitle,
        }));

        if (co.ymsFound && (co.representativeAfm || co.representativeFatherName)) {
          setYmsDetectedInfo({
            detected: true,
            afm: co.representativeAfm,
            father: co.representativeFatherName,
            name: co.representativeName,
          });
          toast.success(`✨ Αντλήθηκαν τα στοιχεία & η Ανακοίνωση Σύστασης ΥΜΣ! (ΑΦΜ Διαχειριστή: ${co.representativeAfm || "-"}, Πατρώνυμο: ${co.representativeFatherName || "-"})`);
        } else {
          setYmsDetectedInfo(null);
          toast.success(`✨ Αντλήθηκαν τα στοιχεία της «${co.tradeName || co.companyName}» από το Γ.Ε.ΜΗ.!`);
        }
      } else {
        toast.error(data.error || "Δεν βρέθηκε επιχείρηση στο Γ.Ε.ΜΗ. με αυτά τα στοιχεία.");
      }
    } catch (err: any) {
      toast.error("Σφάλμα σύνδεσης με το API του Γ.Ε.ΜΗ.");
    } finally {
      setIsSearchingGemi(false);
    }
  };

  // Invoice Calculations based on contract state
  const getInvoiceCalculations = (c: ContractData) => {
    const gross = c.totalAmountNum || 150;
    const net = Number((gross / 1.24).toFixed(2));
    const vat = Number((gross - net).toFixed(2));
    const withholding = gross >= 300 ? Number((net * 0.20).toFixed(2)) : 0;
    const payable = Number((gross - withholding).toFixed(2));

    let offerItems: { title: string; description: string; duration: string }[] = [];
    if (c.serviceType === "ike_gemi") {
      offerItems = [
        {
          title: "Κατασκευή Ιστοσελίδας ΓΕΜΗ (Single Page)",
          description: "Ανάρτηση στοιχείων επιχείρησης, διοίκησης, ΑΦΜ, ΓΕΜΗ, ΚΑΔ και νομικών γνωστοποιήσεων σύμφωνα με τις προδιαγραφές του Γ.Ε.ΜΗ.",
          duration: `${c.deliveryDaysNum || 5} εργάσιμες ημέρες`
        },
        {
          title: "Κατοχύρωση Domain (.gr) & Cloud Hosting",
          description: "Κατοχύρωση επίσημου .gr domain name και φιλοξενία σε ταχύτατο cloud server με πιστοποιητικό SSL.",
          duration: "12 μήνες"
        }
      ];
    } else if (c.serviceType === "eshop") {
      offerItems = [
        {
          title: "Κατασκευή Eshop (WooCommerce & Custom Design)",
          description: "Σχεδιασμός & ανάπτυξη custom ηλεκτρονικού καταστήματος. Περιλαμβάνει responsive σχεδίαση για κινητά/tablets, διασύνδεση με τράπεζες, Google PageSpeed 95+ και βασικό SEO.",
          duration: `${c.deliveryDaysNum || 25} εργάσιμες ημέρες`
        },
        {
          title: "Premium Hosting & Τεχνική Υποστήριξη (VPS & Cloudflare)",
          description: "Φιλοξενία σε dedicated cloud server, διαμόρφωση Cloudflare CDN/WAF για μέγιστη ασφάλεια, αυτόματα daily backups και 12 μήνες συνεχή υποστήριξη.",
          duration: "12 μήνες"
        }
      ];
    } else if (c.serviceType === "website") {
      offerItems = [
        {
          title: "Κατασκευή Εταιρικής Ιστοσελίδας (Corporate Website)",
          description: "Σχεδίαση και υλοποίηση σύγχρονου εταιρικού website παρουσίασης υπηρεσιών, δυναμική φόρμα επικοινωνίας, διασύνδεση social media και mobile-first responsive σχεδιασμός.",
          duration: `${c.deliveryDaysNum || 15} εργάσιμες ημέρες`
        },
        {
          title: "Cloud Hosting & SSL Encryption",
          description: "Υψηλής ταχύτητας cloud hosting, SSL Encryption και υποστήριξη 1ου έτους.",
          duration: "12 μήνες"
        }
      ];
    } else {
      offerItems = [
        {
          title: c.serviceTitle || "Υπηρεσίες Πληροφορικής & Ανάπτυξης",
          description: c.serviceDescription || "Εξατομικευμένη σχεδίαση, υλοποίηση και τεχνική παράδοση σύμφωνα με τις προδιαγραφές.",
          duration: `${c.deliveryDaysNum || 10} εργάσιμες ημέρες`
        }
      ];
    }

    return { gross, net, vat, withholding, payable, offerItems };
  };

  // Helper to switch service preset
  const handleApplyPreset = (presetId: "ike_gemi" | "eshop" | "website" | "custom") => {
    if (presetId === "ike_gemi") {
      setCurrentContract(prev => ({
        ...prev,
        serviceType: "ike_gemi",
        serviceTitle: "Κατασκευή Ιστοσελίδας Εταιρικής Διαφάνειας (Στοιχεία ΓΕΜΗ)",
        serviceDescription: "Σχεδίαση, ανάπτυξη και παράδοση απλής ιστοσελίδας εταιρικής διαφάνειας με τα βασικά στοιχεία της επιχείρησης έναντι του Γ.Ε.ΜΗ., καταχώριση domain name (.gr) και φιλοξενία (hosting) 1ου έτους.",
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
      }));
      toast.info("Επιλέχθηκε το πακέτο: Ι.Κ.Ε. ΓΕΜΗ (150€)");
    } else if (presetId === "eshop") {
      setCurrentContract(prev => ({
        ...prev,
        serviceType: "eshop",
        serviceTitle: "Κατασκευή Ηλεκτρονικού Καταστήματος (E-Shop)",
        serviceDescription: "Custom σχεδιασμός & ανάπτυξη e-shop, διασύνδεση με τράπεζα, σύστημα διαχείρισης παραγγελιών, responsive UI και SEO.",
        totalAmountNum: 1240,
        totalAmountText: "χιλίων διακοσίων σαράντα ευρώ (1.240,00 €)",
        advanceAmountNum: 620,
        advanceAmountText: "εξακοσίων είκοσι ευρώ (620,00 €)",
        remainingAmountNum: 620,
        remainingAmountText: "εξακοσίων είκοσι ευρώ (620,00 €)",
        renewalAmountNum: 180,
        renewalAmountText: "εκατόν ογδόντα ευρώ (180,00 €)",
        deliveryDaysNum: 25,
        deliveryDaysText: "είκοσι πέντε (25)",
      }));
      toast.info("Επιλέχθηκε το πακέτο: Κατασκευή Eshop (1.240€)");
    } else if (presetId === "website") {
      setCurrentContract(prev => ({
        ...prev,
        serviceType: "website",
        serviceTitle: "Κατασκευή Εταιρικής Ιστοσελίδας (Corporate Website)",
        serviceDescription: "Σχεδίαση και υλοποίηση σύγχρονου εταιρικού website παρουσίασης υπηρεσιών, δυναμική φόρμα επικοινωνίας, διασύνδεση social media και responsive σχεδιασμός.",
        totalAmountNum: 620,
        totalAmountText: "εξακοσίων είκοσι ευρώ (620,00 €)",
        advanceAmountNum: 310,
        advanceAmountText: "τριακοσίων δέκα ευρώ (310,00 €)",
        remainingAmountNum: 310,
        remainingAmountText: "τριακοσίων δέκα ευρώ (310,00 €)",
        renewalAmountNum: 120,
        renewalAmountText: "εκατόν είκοσι ευρώ (120,00 €)",
        deliveryDaysNum: 15,
        deliveryDaysText: "δεκαπέντε (15)",
      }));
      toast.info("Επιλέχθηκε το πακέτο: Εταιρική Ιστοσελίδα (620€)");
    } else {
      setCurrentContract(prev => ({
        ...prev,
        serviceType: "custom",
      }));
      toast.info("Επιλέχθηκε: Προσαρμοσμένο Έργο");
    }
  };

  // Save contract to list and cloud (also syncs invoice data)
  const handleSaveContract = () => {
    const docId = currentContract.id || ("contract_" + (currentContract.clientAfm || currentContract.gemiNo || Date.now()));
    const toSave: ContractData = {
      ...currentContract,
      id: docId,
    };

    const existingIdx = contracts.findIndex(c => c.id === toSave.id || (c.clientAfm && c.clientAfm === toSave.clientAfm && toSave.clientAfm !== "...................."));
    let updated: ContractData[];
    if (existingIdx >= 0) {
      updated = [...contracts];
      updated[existingIdx] = toSave;
    } else {
      updated = [toSave, ...contracts];
    }
    setCurrentContract(toSave);
    setContracts(updated);
    localStorage.setItem("sgk_saved_contracts", JSON.stringify(updated));

    // Save corresponding Invoice to localStorage as well
    const calc = getInvoiceCalculations(toSave);
    const invoiceDoc = {
      id: toSave.id,
      clientName: toSave.tradeName || toSave.companyName,
      clientAfm: toSave.clientAfm,
      clientAddress: toSave.address || toSave.city || "Αθήνα",
      docNo: "1",
      date: toSave.contractDate,
      serviceTitle: toSave.serviceTitle,
      serviceDescription: toSave.serviceDescription,
      net: calc.net,
      vat: calc.vat,
      gross: calc.gross,
      withholding: calc.withholding,
      payable: calc.payable,
      offerItems: calc.offerItems,
    };
    try {
      const savedInvoices = localStorage.getItem("sgk_saved_invoices");
      const invoicesList = savedInvoices ? JSON.parse(savedInvoices) : [];
      const invIdx = invoicesList.findIndex((i: any) => i.id === toSave.id);
      if (invIdx >= 0) {
        invoicesList[invIdx] = invoiceDoc;
      } else {
        invoicesList.unshift(invoiceDoc);
      }
      localStorage.setItem("sgk_saved_invoices", JSON.stringify(invoicesList));
    } catch(e) {}

    // Async sync to Supabase cloud storage (both contract & invoice)
    try {
      fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "contract", id: toSave.id, data: toSave })
      }).catch(e => console.error(e));

      fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "invoice", id: toSave.id, data: invoiceDoc })
      }).catch(e => console.error(e));
    } catch(e) {}

    toast.success("Το συμφωνητικό και το τιμολόγιο αποθηκεύτηκαν επιτυχώς!");
    return toSave;
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
      representativeAfm: "",
      clientAfm: "",
    };
    setCurrentContract(newContract);
    setYmsDetectedInfo(null);
    setIsEditing(true);
  };

  // Contract HTML Builder for Printing
  const getContractBodyHtml = (c: ContractData) => `
    <div style="font-family: 'Times New Roman', Times, Georgia, serif; font-size: 13px; line-height: 1.45; color: #000; text-align: justify;">
      <div style="text-align: center; font-weight: bold; margin-bottom: 18px;">
        <h1 style="font-size: 14.5px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px;">ΙΔΙΩΤΙΚΟ ΣΥΜΦΩΝΗΤΙΚΟ ΠΑΡΟΧΗΣ ΥΠΗΡΕΣΙΩΝ</h1>
        <h2 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">${(c.serviceTitle || "ΚΑΤΑΣΚΕΥΗΣ ΙΣΤΟΣΕΛΙΔΑΣ ΕΤΑΙΡΙΚΗΣ ΔΙΑΦΑΝΕΙΑΣ (ΣΤΟΙΧΕΙΑ ΓΕΜΗ)").toUpperCase()}</h2>
      </div>

      <p style="margin-bottom: 9px;">Στην <strong>${c.city || 'Αθήνα'}</strong>, σήμερα στις <strong>${formatDateGreek(c.contractDate)}</strong>, μεταξύ των κάτωθι συμβαλλόμενων:</p>

      <p style="padding-left: 18px; margin-bottom: 8px;"><strong>1. Αφενός:</strong> ο κ. <strong>${c.contractorName}</strong>, με έδρα επιχείρησης στη ${c.contractorAddress}, με επάγγελμα «${c.contractorProfession}», με Α.Φ.Μ. <strong>${c.contractorAfm}</strong> / Δ.Ο.Υ. <strong>${c.contractorDoy}</strong>, εφεξής καλούμενος «ο Ανάδοχος»,</p>

      <p style="margin-bottom: 8px;">και</p>

      <p style="padding-left: 18px; margin-bottom: 10px;"><strong>2. Αφετέρου:</strong> η εταιρεία με την επωνυμία <strong>«${c.companyName || '................................................'}»</strong> (διακριτικός τίτλος <strong>«${c.tradeName || '................................'}»</strong>), με Α.Φ.Μ. <strong>${c.clientAfm || '....................'}</strong> και αριθμό Γ.Ε.ΜΗ. <strong>${c.gemiNo || '....................'}</strong>, νομίμως εκπροσωπούμενη από ${c.representativeTitle || 'τον διαχειριστή αυτής'} κ. <strong>${c.representativeName || '................................'}</strong> του <strong>${c.representativeFatherName || '....................'}</strong>, με Α.Φ.Μ. <strong>${c.representativeAfm || '....................'}</strong>, εφεξής καλούμενη «ο Εργοδότης» ή «ο Πελάτης»,</p>

      <p style="margin-bottom: 12px;">συμφωνήθηκαν, συνομολογήθηκαν και έγιναν αμοιβαία αποδεκτά τα ακόλουθα:</p>

      <div style="margin-bottom: 10px;">
        <div style="font-weight: bold; margin-bottom: 3px; font-size: 13px;">Άρθρο 1 – Αντικείμενο της σύμβασης</div>
        <p style="margin-bottom: 6px;">Ο Ανάδοχος αναλαμβάνει έναντι του Εργοδότη την υλοποίηση και παροχή της υπηρεσίας: <strong>${c.serviceTitle || "Κατασκευή Ιστοσελίδας Εταιρικής Διαφάνειας (Στοιχεία ΓΕΜΗ)"}</strong>.</p>
        <p style="margin-bottom: 6px;">${c.serviceDescription || "Σχεδίαση, ανάπτυξη και παράδοση απλής ιστοσελίδας εταιρικής διαφάνειας με τα βασικά στοιχεία της επιχείρησης έναντι του Γ.Ε.ΜΗ., καταχώριση domain name (.gr) και φιλοξενία (hosting) 1ου έτους."}</p>
        <p style="margin-bottom: 6px;">Στην αμοιβή του Άρθρου 4 περιλαμβάνονται η υλοποίηση του παραδοτέου έργου, η αγορά/ενεργοποίηση του domain name και η φιλοξενία (hosting) για τον πρώτο χρόνο.</p>
      </div>

      <div style="margin-bottom: 10px;">
        <div style="font-weight: bold; margin-bottom: 3px; font-size: 13px;">Άρθρο 2 – Domain και φιλοξενία (hosting)</div>
        <p style="margin-bottom: 6px;">Το domain name και η φιλοξενία (hosting) της ιστοσελίδας περιλαμβάνονται στην αμοιβή του Άρθρου 4 για τον πρώτο χρόνο λειτουργίας.</p>
        <p style="margin-bottom: 6px;">Μετά την παρέλευση του πρώτου έτους, η ανανέωση του domain και του hosting θα χρεώνεται στον Εργοδότη με το ποσό των <strong>${c.renewalAmountText}</strong> ετησίως, συμπεριλαμβανομένου Φ.Π.Α.</p>
      </div>

      <div style="margin-bottom: 10px;">
        <div style="font-weight: bold; margin-bottom: 3px; font-size: 13px;">Άρθρο 3 – Χρόνος παράδοσης</div>
        <p style="margin-bottom: 6px;">Ο Ανάδοχος υποχρεούται να παραδώσει το έργο εντός <strong>${c.deliveryDaysText}</strong> εργάσιμων ημερών από την ${c.advanceAmountNum > 0 ? 'καταβολή της προκαταβολής του Άρθρου 4' : 'εξόφληση της αμοιβής του Άρθρου 4'}. Ο Εργοδότης υποχρεούται να παρέχει εγκαίρως στον Ανάδοχο τα απαραίτητα στοιχεία για την υλοποίηση.</p>
      </div>

      <div style="margin-bottom: 10px;">
        <div style="font-weight: bold; margin-bottom: 3px; font-size: 13px;">Άρθρο 4 – Αμοιβή και τρόπος πληρωμής</div>
        <p style="margin-bottom: 4px;"><strong>4.1</strong> Η συνολική συμφωνηθείσα αμοιβή ανέρχεται στο ποσό των <strong>${c.totalAmountText}</strong>, συμπεριλαμβανομένου Φ.Π.Α.</p>
        ${c.advanceAmountNum === 0 
          ? `<p style="margin-bottom: 4px;"><strong>4.2</strong> Η εξόφληση της αμοιβής πραγματοποιείται <strong>εφάπαξ</strong> με την ανάθεση και πριν από την έναρξη των εργασιών. Ο Ανάδοχος δεν υπέχει καμία υποχρέωση έναρξης εργασιών πριν από την είσπραξη της αμοιβής.</p>` 
          : `<p style="margin-bottom: 4px;"><strong>4.2</strong> Ως προκαταβολή συμφωνείται το ποσό των <strong>${c.advanceAmountText}</strong>, το οποίο καταβάλλεται από τον Εργοδότη στον Ανάδοχο πριν από την έναρξη των εργασιών.</p>
             <p style="margin-bottom: 4px;"><strong>4.3</strong> Το υπόλοιπο ποσό των <strong>${c.remainingAmountText}</strong> εξοφλείται από τον Εργοδότη με την παράδοση του έργου.</p>`
        }
        <p style="margin-bottom: 4px;"><strong>${c.advanceAmountNum === 0 ? '4.3' : '4.4'}</strong> Το σχετικό φορολογικό παραστατικό (τιμολόγιο) θα εκδοθεί από τον Ανάδοχο κατά την είσπραξη της αμοιβής.</p>
        <p style="margin-bottom: 4px;"><strong>${c.advanceAmountNum === 0 ? '4.4' : '4.5'}</strong> Οι πληρωμές πραγματοποιούνται με κατάθεση/έμβασμα στον τραπεζικό λογαριασμό IBAN <strong>${c.ibanDetails}</strong>, εκτός εάν άλλως συμφωνηθεί μεταξύ των μερών.</p>
      </div>

      <div style="margin-bottom: 12px;">
        <div style="font-weight: bold; margin-bottom: 3px; font-size: 13px;">Άρθρο 5 – Λοιποί όροι</div>
        <p style="margin-bottom: 4px;">Με την ολοκλήρωση της πλήρους εξόφλησης της αμοιβής, τα δικαιώματα επί του παραδοτέου κώδικα και του σχεδιασμού περιέρχονται στον Εργοδότη. Τυχόν πρόσθετες απαιτήσεις ή αλλαγές πέραν του περιγραφόμενου αντικειμένου δύνανται να αποτελέσουν αντικείμενο νέας συμφωνίας.</p>
        <p style="margin-bottom: 4px;">Το παρόν συμφωνητικό διέπεται από το Ελληνικό Δίκαιο. Για την επίλυση κάθε διαφοράς που τυχόν ανακύψει από ή σε σχέση με το παρόν, αρμόδια ορίζονται τα Δικαστήρια Αθηνών.</p>
        <p style="margin-bottom: 4px;">Το παρόν συντάχθηκε σε δύο (2) όμοια πρωτότυπα, τα οποία αφού αναγνώσθηκαν και βεβαιώθηκαν από τους συμβαλλόμενους, υπεγράφησαν από αυτούς και έλαβε έκαστο εξ αυτών από ένα.</p>
      </div>

      <div style="margin-top: 24px; display: flex; justify-content: space-between; page-break-inside: avoid;">
        <div style="width: 45%; text-align: center; font-size: 12px;">
          <p style="font-weight: bold; margin-bottom: 2px;">Οι Συμβαλλόμενοι:</p>
          <p style="font-weight: bold; margin-bottom: 4px;">Ο Ανάδοχος</p>
          <div style="height: 48px; border-bottom: 1px dashed #555; margin: 6px auto 8px auto; width: 75%;"></div>
          <p style="font-weight: bold; text-transform: uppercase;">${c.contractorName}</p>
        </div>

        <div style="width: 45%; text-align: center; font-size: 12px;">
          <p style="font-weight: bold; margin-bottom: 2px;">&nbsp;</p>
          <p style="font-weight: bold; margin-bottom: 4px;">Ο Εργοδότης / Πελάτης</p>
          <div style="height: 48px; border-bottom: 1px dashed #555; margin: 6px auto 8px auto; width: 75%;"></div>
          <p style="font-weight: bold; text-transform: uppercase;">${c.representativeName || '................................'}</p>
          <p style="font-size: 11px; font-style: italic; color: #444;">(για λογαριασμό της ${c.tradeName || c.companyName || '....................'})</p>
        </div>
      </div>
    </div>
  `;

  // Invoice Page 1 (AADE Mockup) HTML Builder
  const getInvoicePage1BodyHtml = (c: ContractData, calc: ReturnType<typeof getInvoiceCalculations>) => `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; font-size: 12px; line-height: 1.4;">
      <div style="font-size: 8.5px; color: #e11d48; font-weight: 800; text-align: center; background: #fff1f2; border: 1px solid #fecdd3; padding: 7px 12px; border-radius: 8px; margin-bottom: 14px; font-style: italic;">
        ⚠️ Το παρόν δεν αποτελεί φορολογικό στοιχείο (τιμολόγιο), αλλά απεικόνιση της προσφοράς και του συμφωνηθέντος ποσού.
      </div>

      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #cbd5e1; padding-bottom: 14px; margin-bottom: 12px;">
        <div style="font-size: 10.5px; width: 68%;">
          <div style="display: flex; gap: 8px; margin-bottom: 3px;">
            <span style="background: #f1f5f9; border: 1px solid #cbd5e1; font-weight: bold; padding: 1px 6px; border-radius: 4px; font-size: 8.5px; min-width: 65px; text-align: center;">ΕΠΩΝΥΜΙΑ</span>
            <span style="font-weight: 800; color: #0f172a;">${c.contractorName}</span>
          </div>
          <div style="display: flex; gap: 8px; margin-bottom: 3px;">
            <span style="background: #f1f5f9; border: 1px solid #cbd5e1; font-weight: bold; padding: 1px 6px; border-radius: 4px; font-size: 8.5px; min-width: 65px; text-align: center;">Α.Φ.Μ.</span>
            <span style="font-weight: 800; color: #0f172a;">${c.contractorAfm}</span>
          </div>
          <div style="display: flex; gap: 8px; margin-bottom: 3px;">
            <span style="background: #f1f5f9; border: 1px solid #cbd5e1; font-weight: bold; padding: 1px 6px; border-radius: 4px; font-size: 8.5px; min-width: 65px; text-align: center;">ΕΠΑΓΓΕΛΜΑ</span>
            <span style="font-weight: 800; color: #0f172a;">${c.contractorProfession}</span>
          </div>
          <div style="display: flex; gap: 8px; margin-bottom: 3px;">
            <span style="background: #f1f5f9; border: 1px solid #cbd5e1; font-weight: bold; padding: 1px 6px; border-radius: 4px; font-size: 8.5px; min-width: 65px; text-align: center;">Δ.Ο.Υ.</span>
            <span style="font-weight: 800; color: #0f172a;">${c.contractorDoy}</span>
          </div>
          <div style="display: flex; gap: 8px;">
            <span style="background: #f1f5f9; border: 1px solid #cbd5e1; font-weight: bold; padding: 1px 6px; border-radius: 4px; font-size: 8.5px; min-width: 65px; text-align: center;">ΔΙΕΥΘΥΝΣΗ</span>
            <span style="font-weight: 800; color: #0f172a; font-size: 9.5px;">${c.contractorAddress}</span>
          </div>
        </div>

        <div style="text-align: right; width: 30%;">
          <div style="font-size: 26px; font-weight: 900; color: #0f2d59; letter-spacing: -1px; line-height: 1;">
            sgk<span style="color: #3b5bdb;">.</span>
          </div>
          <div style="font-size: 8px; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 3px;">
            Software Development
          </div>
        </div>
      </div>

      <div style="background: #0f2d59; color: #fff; text-align: center; padding: 7px; font-size: 11.5px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; border-radius: 6px; margin-bottom: 10px;">
        Τιμολογιο Παροχης Υπηρεσιων
      </div>

      <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; margin-bottom: 12px; font-size: 9.5px; font-weight: bold;">
        <div style="border: 1px solid #e2e8f0; padding: 6px; border-radius: 6px; background: #f8fafc;">
          <span style="font-size: 7.5px; color: #64748b; display: block; text-transform: uppercase;">ΣΕΙΡΑ</span>
          <span>A</span>
        </div>
        <div style="border: 1px solid #e2e8f0; padding: 6px; border-radius: 6px; background: #f8fafc;">
          <span style="font-size: 7.5px; color: #64748b; display: block; text-transform: uppercase;">Α.Α.</span>
          <span>1</span>
        </div>
        <div style="border: 1px solid #e2e8f0; padding: 6px; border-radius: 6px; background: #f8fafc;">
          <span style="font-size: 7.5px; color: #64748b; display: block; text-transform: uppercase;">ΗΜΕΡΟΜΗΝΙΑ</span>
          <span>${formatDateGreek(c.contractDate)}</span>
        </div>
        <div style="border: 1px solid #e2e8f0; padding: 6px; border-radius: 6px; background: #f8fafc;">
          <span style="font-size: 7.5px; color: #64748b; display: block; text-transform: uppercase;">ΜΑΡΚ</span>
          <span style="font-family: monospace; font-size: 8.5px;">4000135...</span>
        </div>
        <div style="border: 1px solid #e2e8f0; padding: 6px; border-radius: 6px; background: #f8fafc;">
          <span style="font-size: 7.5px; color: #64748b; display: block; text-transform: uppercase;">ΤΡΟΠΟΣ ΠΛΗΡΩΜΗΣ</span>
          <span>Web Banking</span>
        </div>
      </div>

      <div style="border: 1px solid #e2e8f0; padding: 10px 14px; border-radius: 8px; background: #f8fafc; margin-bottom: 12px;">
        <div style="font-size: 9.5px; font-weight: 900; color: #0f172a; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px; margin-bottom: 6px;">
          Στοιχεια Ληπτη (Πελατη)
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11px;">
          <div>
            <div style="font-size: 8.5px; color: #64748b; text-transform: uppercase;">Επωνυμια / Διακριτικος Τιτλος</div>
            <div style="font-weight: 900; color: #0f172a;">${c.tradeName || c.companyName || '-'}</div>
          </div>
          <div>
            <div style="font-size: 8.5px; color: #64748b; text-transform: uppercase;">Α.Φ.Μ. / Γ.Ε.ΜΗ.</div>
            <div style="font-weight: 900; color: #0f172a;">${c.clientAfm || '-'} ${c.gemiNo ? ' | ' + c.gemiNo : ''}</div>
          </div>
          <div style="grid-column: span 2;">
            <div style="font-size: 8.5px; color: #64748b; text-transform: uppercase;">Διευθυνση Εδρας / Εκπροσωπος</div>
            <div style="font-weight: 600; color: #334155;">${c.address || c.city || 'Αθήνα'} • Εκπρόσωπος: ${c.representativeName || '-'}</div>
          </div>
        </div>
      </div>

      <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 12px;">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 11px;">
          <thead style="background: #0f2d59; color: #fff; font-size: 9px; text-transform: uppercase; font-weight: bold;">
            <tr>
              <th style="padding: 7px 10px;">Περιγραφη Υπηρεσιων</th>
              <th style="padding: 7px 10px; text-align: right;">Ποσοτητα</th>
              <th style="padding: 7px 10px; text-align: right;">Καθαρη Αξια</th>
              <th style="padding: 7px 10px; text-align: right;">Φ.Π.Α. (24%)</th>
              <th style="padding: 7px 10px; text-align: right;">Συνολο</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-top: 1px solid #e2e8f0;">
              <td style="padding: 8px 10px;">
                <strong style="display: block; color: #0f172a;">${c.serviceTitle || "Κατασκευή & Ανάπτυξη Λογισμικού / Ιστοσελίδας"}</strong>
                <span style="font-size: 9.5px; color: #64748b;">${c.serviceDescription || "Σύμφωνα με την τεχνική προσφορά (Σελίδα 2)"}</span>
              </td>
              <td style="padding: 8px 10px; text-align: right; font-family: monospace;">1</td>
              <td style="padding: 8px 10px; text-align: right; font-family: monospace; font-weight: bold;">${calc.net.toFixed(2).replace(".", ",")} €</td>
              <td style="padding: 8px 10px; text-align: right; font-family: monospace; font-weight: bold; color: #3b5bdb;">${calc.vat.toFixed(2).replace(".", ",")} €</td>
              <td style="padding: 8px 10px; text-align: right; font-family: monospace; font-weight: 900; color: #0f172a;">${calc.gross.toFixed(2).replace(".", ",")} €</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="display: flex; justify-content: flex-end; margin-bottom: 12px;">
        <div style="width: 50%; background: #f8fafc; padding: 10px 14px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 11px;">
          <div style="display: flex; justify-content: space-between; color: #475569; font-weight: bold; margin-bottom: 4px;">
            <span>Καθαρή Αξία:</span>
            <span style="font-family: monospace; color: #0f172a;">${calc.net.toFixed(2).replace(".", ",")} €</span>
          </div>
          <div style="display: flex; justify-content: space-between; color: #3b5bdb; font-weight: bold; margin-bottom: 4px;">
            <span>Φ.Π.Α. 24%:</span>
            <span style="font-family: monospace;">+${calc.vat.toFixed(2).replace(".", ",")} €</span>
          </div>
          <div style="display: flex; justify-content: space-between; color: #0f172a; font-weight: 900; font-size: 12.5px; padding-top: 5px; border-top: 1px solid #e2e8f0; margin-bottom: 4px;">
            <span>Συνολική Αξία:</span>
            <span style="font-family: monospace;">${calc.gross.toFixed(2).replace(".", ",")} €</span>
          </div>
          ${calc.withholding > 0 ? `
            <div style="display: flex; justify-content: space-between; color: #e11d48; font-weight: bold; font-size: 10.5px; margin-bottom: 4px;">
              <span>Παρακράτηση Φόρου 20%:</span>
              <span style="font-family: monospace;">-${calc.withholding.toFixed(2).replace(".", ",")} €</span>
            </div>
          ` : ''}
          <div style="display: flex; justify-content: space-between; color: #047857; font-weight: 900; font-size: 13px; padding-top: 5px; border-top: 2px solid #10b981;">
            <span>Πληρωτέο Ποσό:</span>
            <span style="font-family: monospace;">${calc.payable.toFixed(2).replace(".", ",")} €</span>
          </div>
        </div>
      </div>

      <div style="padding: 10px 12px; border-radius: 8px; background: #eff6ff; border: 1px solid #bfdbfe; font-size: 11px;">
        <span style="font-weight: 900; color: #0f2d59; text-transform: uppercase; display: block; font-size: 9px; margin-bottom: 2px;">Τραπεζικος Λογαριασμος Εξοφλησης</span>
        <div style="font-family: monospace; font-weight: bold; color: #1e293b;">
          Eurobank IBAN: <span style="color: #3b5bdb; font-weight: 900;">GR46 0260 1970 0008 3020 1330 337</span>
        </div>
        <div style="font-size: 9px; color: #64748b; margin-top: 2px;">Δικαιούχος: ΤΣΑΒΟΣ ΣΠΥΡΙΔΩΝ ΧΡΗΣΤΟΣ</div>
      </div>
    </div>
  `;

  // Invoice Page 2 (Technical Offer) HTML Builder
  const getInvoicePage2BodyHtml = (c: ContractData, calc: ReturnType<typeof getInvoiceCalculations>) => `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; font-size: 12px; line-height: 1.45;">
      <div style="border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <span style="font-size: 9px; font-weight: 900; color: #3b5bdb; text-transform: uppercase; letter-spacing: 1.5px; display: block;">SGK Digital Technical Scope</span>
          <h2 style="font-size: 18px; font-weight: 900; text-transform: uppercase; color: #0f172a; letter-spacing: -0.5px; margin: 0;">Αναλυτικη Τεχνικη Προσφορα</h2>
        </div>
        <div style="text-align: right; font-size: 11px; font-weight: bold; color: #64748b;">
          Σελίδα 2 / 2
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 14px;">
        ${calc.offerItems.map((item, idx) => `
          <div style="padding: 12px 16px; border-radius: 8px; border: 1px solid #e2e8f0; background: #f8fafc;">
            <h3 style="font-weight: 900; font-size: 13px; color: #0f2d59; margin: 0 0 6px 0;">
              ${idx + 1}. ${item.title}
            </h3>
            <p style="font-size: 11.5px; color: #334155; line-height: 1.5; margin: 0; text-align: justify;">
              ${item.description}
            </p>
          </div>
        `).join('')}
      </div>

      <div style="margin-top: 35px; padding-top: 14px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #64748b; font-weight: 600;">
        <p style="margin-bottom: 3px;">Όλα τα παραδοτέα συνοδεύονται από εγγύηση καλής λειτουργίας & υποστήριξη της <strong>SGK Digital</strong>.</p>
        <p style="font-size: 9.5px; color: #94a3b8; margin: 0;">SGK Software Development • info@sgk.gr • 211 114 0013</p>
      </div>
    </div>
  `;

  // General Clean Window Printer
  const openPrintWindow = (bodyHtml: string, title: string) => {
    const printWindow = window.open('', '_blank', 'width=850,height=1000');
    if (!printWindow) {
      window.print();
      return;
    }

    const fullHtml = `
      <!DOCTYPE html>
      <html lang="el">
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 12mm 15mm 12mm 15mm;
          }
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            background: #fff;
            color: #000;
            padding: 0;
          }
          .page-sheet {
            page-break-after: always;
            break-after: page;
            min-height: 255mm;
          }
          .page-sheet:last-child {
            page-break-after: avoid;
            break-after: avoid;
          }
        </style>
      </head>
      <body>
        ${bodyHtml}
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(fullHtml);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  // 1. Print Contract Only
  const handlePrintContract = () => {
    const html = `<div class="page-sheet">${getContractBodyHtml(currentContract)}</div>`;
    openPrintWindow(html, `Συμφωνητικό - ${currentContract.tradeName || currentContract.companyName || 'SGK'}`);
  };

  // 2. Print Invoice Only (Page 1 + Page 2)
  const handlePrintInvoice = () => {
    const calc = getInvoiceCalculations(currentContract);
    const html = `
      <div class="page-sheet page-break">${getInvoicePage1BodyHtml(currentContract, calc)}</div>
      <div class="page-sheet">${getInvoicePage2BodyHtml(currentContract, calc)}</div>
    `;
    openPrintWindow(html, `Προσφορά & Τιμολόγιο - ${currentContract.tradeName || currentContract.companyName || 'SGK'}`);
  };

  // 3. Print BOTH Documents in 1 PDF (Page 1: Contract, Page 2: Invoice, Page 3: Technical Offer)
  const handlePrintBoth = () => {
    const calc = getInvoiceCalculations(currentContract);
    const html = `
      <div class="page-sheet page-break">${getContractBodyHtml(currentContract)}</div>
      <div class="page-sheet page-break">${getInvoicePage1BodyHtml(currentContract, calc)}</div>
      <div class="page-sheet">${getInvoicePage2BodyHtml(currentContract, calc)}</div>
    `;
    openPrintWindow(html, `Συμφωνητικό & Τιμολόγιο - ${currentContract.tradeName || currentContract.companyName || 'SGK'}`);
  };

  // Alias for backward compatibility
  const handlePrint = handlePrintBoth;

  // Helper for auto-calculating amounts
  const handleTotalChange = (val: number) => {
    const total = val || 0;
    const advance = currentContract.advanceAmountNum || 0;
    const remaining = Math.max(0, total - advance);
    setCurrentContract(prev => ({
      ...prev,
      totalAmountNum: total,
      totalAmountText: `${total === 150 ? "εκατόν πενήντα" : total === 124 ? "εκατόν είκοσι τεσσάρων" : total} ευρώ (${total.toFixed(2).replace(".", ",")} €)`,
      advanceAmountNum: advance,
      advanceAmountText: advance === 0 ? "μηδέν ευρώ (0,00 €)" : `${advance === 50 ? "πενήντα" : advance} ευρώ (${advance.toFixed(2).replace(".", ",")} €)`,
      remainingAmountNum: remaining,
      remainingAmountText: remaining === 0 ? "μηδέν ευρώ (0,00 €)" : `${remaining === 74 ? "εβδομήντα τεσσάρων" : remaining} ευρώ (${remaining.toFixed(2).replace(".", ",")} €)`,
      renewalAmountNum: total,
      renewalAmountText: `${total === 150 ? "εκατόν πενήντα" : total === 124 ? "εκατόν είκοσι τεσσάρων" : total} ευρώ (${total.toFixed(2).replace(".", ",")} €)`
    }));
  };

  // Helper for 1-click GOV.gr submission
  const handleCopyToGov = () => {
    const text = `
ΙΔΙΩΤΙΚΟ ΣΥΜΦΩΝΗΤΙΚΟ ΠΑΡΟΧΗΣ ΥΠΗΡΕΣΙΩΝ
ΚΑΤΑΣΚΕΥΗΣ ΙΣΤΟΣΕΛΙΔΑΣ ΕΤΑΙΡΙΚΗΣ ΔΙΑΦΑΝΕΙΑΣ (ΣΤΟΙΧΕΙΑ ΓΕΜΗ)

Στην ${currentContract.city || "Αθήνα"}, σήμερα στις ${formatDateGreek(currentContract.contractDate)}, μεταξύ των κάτωθι συμβαλλόμενων:

1. Αφενός: ο κ. ${currentContract.contractorName}, με έδρα επιχείρησης στη ${currentContract.contractorAddress}, με επάγγελμα «${currentContract.contractorProfession}», με Α.Φ.Μ. ${currentContract.contractorAfm} / Δ.Ο.Υ. ${currentContract.contractorDoy}, εφεξής καλούμενος «ο Ανάδοχος»,

και

2. Αφετέρου: η εταιρεία με την επωνυμία «${currentContract.companyName || "................................................"}» (διακριτικός τίτλος «${currentContract.tradeName || "................................"}»), με Α.Φ.Μ. ${currentContract.clientAfm || "...................."} και αριθμό Γ.Ε.ΜΗ. ${currentContract.gemiNo || "...................."}, νομίμως εκπροσωπούμενη από ${currentContract.representativeTitle || "τον διαχειριστή αυτής"} κ. ${currentContract.representativeName || "................................"} του ${currentContract.representativeFatherName || "...................."}, με Α.Φ.Μ. ${currentContract.representativeAfm || "...................."}, εφεξής καλούμενη «ο Εργοδότης» ή «ο Πελάτης»,

συμφωνήθηκαν, συνομολογήθηκαν και έγιναν αμοιβαία αποδεκτά τα ακόλουθα:

Άρθρο 1 – Αντικείμενο της σύμβασης
Ο Ανάδοχος αναλαμβάνει έναντι του Εργοδότη τη σχεδίαση, ανάπτυξη και παράδοση μίας απλής ιστοσελίδας εταιρικής διαφάνειας με τα βασικά στοιχεία της επιχείρησης (Γ.Ε.ΜΗ., Α.Φ.Μ., έδρα, νόμιμη εκπροσώπηση, στοιχεία επικοινωνίας), σύμφωνα με το υπόδειγμα/παράδειγμα σχεδιασμού που έχει υποδείξει ο Εργοδότης.
Σκοπός της ιστοσελίδας είναι να παρέχει στον Εργοδότη έναν δημόσια προσβάσιμο σύνδεσμο (link) με τα στοιχεία διαφάνειας της επιχείρησής του, ώστε να καλύπτονται οι σχετικές του υποχρεώσεις έναντι του Γ.Ε.ΜΗ.
Στην αμοιβή του Άρθρου 4 περιλαμβάνονται η κατασκευή της ιστοσελίδας, η αγορά/ενεργοποίηση του domain name και η φιλοξενία (hosting) για τον πρώτο χρόνο.

Άρθρο 2 – Domain και φιλοξενία (hosting)
Το domain name και η φιλοξενία (hosting) της ιστοσελίδας περιλαμβάνονται στην αμοιβή του Άρθρου 4 για τον πρώτο χρόνο λειτουργίας.
Μετά την παρέλευση του πρώτου έτους, η ανανέωση του domain και του hosting θα χρεώνεται στον Εργοδότη με το ποσό των ${currentContract.renewalAmountText} ετησίως, συμπεριλαμβανομένου Φ.Π.Α.

Άρθρο 3 – Χρόνος παράδοσης
Ο Ανάδοχος υποχρεούται να παραδώσει την ολοκληρωμένη ιστοσελίδα εντός ${currentContract.deliveryDaysText} εργάσιμων ημερών από την ${currentContract.advanceAmountNum > 0 ? "καταβολή της προκαταβολής του Άρθρου 4" : "εξόφληση της αμοιβής του Άρθρου 4"}. Ο Εργοδότης υποχρεούται να παρέχει εγκαίρως στον Ανάδοχο τα απαραίτητα στοιχεία της επιχείρησης για την κατασκευή της ιστοσελίδας.

Άρθρο 4 – Αμοιβή και τρόπος πληρωμής
4.1 Η συνολική συμφωνηθείσα αμοιβή για την κατασκευή της ιστοσελίδας, συμπεριλαμβανομένων του domain name και του hosting για τον πρώτο χρόνο, ανέρχεται στο ποσό των ${currentContract.totalAmountText}, συμπεριλαμβανομένου Φ.Π.Α.
${currentContract.advanceAmountNum === 0 
  ? "4.2 Η εξόφληση της αμοιβής πραγματοποιείται εφάπαξ με την ανάθεση και πριν από την έναρξη των εργασιών. Ο Ανάδοχος δεν υπέχει καμία υποχρέωση έναρξης εργασιών πριν από την είσπραξη της αμοιβής."
  : `4.2 Ως προκαταβολή συμφωνείται το ποσό των ${currentContract.advanceAmountText}, το οποίο καταβάλλεται από τον Εργοδότη στον Ανάδοχο πριν από την έναρξη των εργασιών.\n4.3 Το υπόλοιπο ποσό των ${currentContract.remainingAmountText} εξοφλείται από τον Εργοδότη με την παράδοση της ιστοσελίδας.`
}
${currentContract.advanceAmountNum === 0 ? "4.3" : "4.4"} Το σχετικό φορολογικό παραστατικό (τιμολόγιο) θα εκδοθεί από τον Ανάδοχο κατά την είσπραξη της αμοιβής.
${currentContract.advanceAmountNum === 0 ? "4.4" : "4.5"} Οι πληρωμές πραγματοποιούνται με κατάθεση/έμβασμα στον τραπεζικό λογαριασμό IBAN ${currentContract.ibanDetails}, εκτός εάν άλλως συμφωνηθεί μεταξύ των μερών.

Άρθρο 5 – Λοιποί όροι
Με την ολοκλήρωση της πλήρους εξόφλησης της αμοιβής, τα δικαιώματα επί του παραδοτέου κώδικα και του σχεδιασμού της ιστοσελίδας περιέρχονται στον Εργοδότη. Τυχόν πρόσθετες απαιτήσεις ή αλλαγές πέραν του περιγραφόμενου αντικειμένου δύνανται να αποτελέσουν αντικείμενο νέας συμφωνίας.
Το παρόν συμφωνητικό διέπεται από το Ελληνικό Δίκαιο. Για την επίλυση κάθε διαφοράς που τυχόν ανακύψει από ή σε σχέση με το παρόν, αρμόδια ορίζονται τα Δικαστήρια Αθηνών.
Το παρόν συντάχθηκε σε δύο (2) όμοια πρωτότυπα, τα οποία αφού αναγνώσθηκαν και βεβαιώθηκαν από τους συμβαλλόμενους, υπεγράφησαν από αυτούς και έλαβε έκαστο εξ αυτών από ένα.

Οι Συμβαλλόμενοι:
Ο Ανάδοχος: ${currentContract.contractorName}
Ο Εργοδότης / Πελάτης: ${currentContract.representativeName || "................................"} (για λογαριασμό της ${currentContract.tradeName || currentContract.companyName || "...................."})
    `.trim();

    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
    }
    toast.success("📋 Το κείμενο αντιγράφηκε στο πρόχειρο! Ανοίγει το docs.gov.gr...");
    window.open("https://docs.gov.gr/", "_blank");
  };

  // Helper for sending contract directly to client via Email composer
  const handleSendContractByEmail = () => {
    const toSave = handleSaveContract();
    const docId = toSave.id;
    const b64 = safeEncodeBase64(toSave);
    const docUrl = `https://sgk.gr/doc/contract?id=${docId}&data=${b64}&download=1`;

    const companyLabel = toSave.tradeName || toSave.companyName || "";
    const amountLabel = `${(toSave.totalAmountNum || 150).toFixed(2).replace(".", ",")} €`;

    const draft = {
      subject: `Ιδιωτικό Συμφωνητικό Κατασκευής Ιστοσελίδας — ${companyLabel || "SGK Digital"}`,
      body: `<p>Καλημέρα σας,</p>
<p>Σας στέλνουμε αυτό το μήνυμα σε συνέχεια της επικοινωνίας μας σχετικά με το νέο σας <strong>Website ${companyLabel}</strong></p>
<p>Στο παρόν email <strong>επισυνάπτουμε το συμφωνητικό συνεργασίας μας</strong>. Το έχουμε ανεβάσει και στο gov και πρέπει να υπογραφεί</p>

<div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 25px 0;">
  <h3 style="margin-top: 0; color: #3b5bdb; font-size: 16px; font-weight: bold; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">💸 Στοιχεία Κατάθεσης Προκαταβολής</h3>
  <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px; line-height: 1.5;">
    <tbody>
      <tr>
        <td style="padding: 6px 0px; font-weight: bold; color: #475569; width: 35%;">Ποσό:</td>
        <td style="padding: 6px 0px; color: #0f172a; font-weight: bold; font-size: 16px; width: 65%;">${amountLabel}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0px; font-weight: bold; color: #475569; width: 35%;">Τράπεζα:</td>
        <td style="padding: 6px 0px; color: #0f172a; width: 65%;">Eurobank</td>
      </tr>
      <tr>
        <td style="padding: 6px 0px; font-weight: bold; color: #475569; width: 35%;">Δικαιούχος:</td>
        <td style="padding: 6px 0px; color: #0f172a; font-weight: bold; width: 65%;">ΤΣΑΒΟΣ ΣΠΥΡΙΔΩΝ</td>
      </tr>
      <tr>
        <td style="padding: 6px 0px; font-weight: bold; color: #475569; vertical-align: top; width: 35%;">IBAN:</td>
        <td style="padding: 6px 0px; color: #0f172a; font-family: monospace; font-size: 14px; font-weight: bold; letter-spacing: 0.5px; width: 65%;">GR4602601970000830201330337</td>
      </tr>
      <tr>
        <td style="padding: 6px 0px; font-weight: bold; color: #475569; width: 35%;">Αιτιολογία:</td>
        <td style="padding: 6px 0px; color: #475569; font-style: italic; width: 65%;">website ${companyLabel}</td>
      </tr>
    </tbody>
  </table>
</div>

<p>Παραμένουμε στη διάθεσή σας για οποιαδήποτε απορία ή διευκρίνιση.</p>
<p style="margin-top: 30px !important; border-top: 1px solid #f0f0f0; padding-top: 20px;">Με εκτίμηση,<br /><strong>Η ομάδα της SGK Software Development</strong></p>`,
      buttonText: "📄 Λήψη Συμφωνητικού (PDF)",
      buttonLink: docUrl,
      targetLead: {
        company: toSave.tradeName || toSave.companyName,
        first_name: toSave.representativeName,
        email: ""
      }
    };
    localStorage.setItem("sgk_email_draft", JSON.stringify(draft));
    if (onSendToEmail) {
      onSendToEmail();
    } else {
      toast.success("📋 Το συμφωνητικό προετοιμάστηκε με άμεση λήψη PDF!");
    }
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
            Δημιουργία, Προεπισκόπηση, Αποστολή Email & Εκτύπωση Συμφωνητικού
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
            {isEditing ? "Προεπισκόπηση" : "Επεξεργασία"}
          </button>

          {/* Dedicated Contract Print */}
          <button
            onClick={handlePrintContract}
            className="px-3.5 py-2.5 bg-blue-50 hover:bg-blue-100 text-[#3b5bdb] border border-blue-200 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Εκτύπωση ή λήψη μόνο του Συμφωνητικού (1 Σελίδα)"
          >
            <Printer size={14} />
            Συμφωνητικό
          </button>

          {/* Dedicated Invoice Print */}
          <button
            onClick={handlePrintInvoice}
            className="px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Εκτύπωση ή λήψη μόνο του Τιμολογίου & Τεχνικής Προσφοράς (2 Σελίδες)"
          >
            <Receipt size={14} />
            Τιμολόγιο
          </button>

          {/* Highlighted COMBINED DOWNLOAD BUTTON (Both Documents in 1 PDF) */}
          <button
            onClick={handlePrintBoth}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-[#3b5bdb] hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-400/30"
            title="Λήψη και των δύο εγγράφων (Συμφωνητικό + Τιμολόγιο + Προσφορά) σε 1 ενιαίο PDF αρχείο"
          >
            <Download size={14} />
            ⚡ Λήψη Και των 2 (1 PDF)
          </button>

          {/* Live Link Button */}
          <button
            onClick={() => {
              const toSave = handleSaveContract();
              const b64 = safeEncodeBase64(toSave);
              const targetUrl = previewDocType === "contract"
                ? `/doc/contract?id=${toSave.id}&data=${b64}`
                : `/doc/invoice?id=${toSave.id}&data=${b64}`;
              window.open(targetUrl, '_blank');
            }}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Άνοιγμα δημόσιου link του ενεργού εγγράφου"
          >
            <ExternalLink size={13} />
            Live Link
          </button>

          <button
            onClick={handleSendContractByEmail}
            className="px-3.5 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Αποστολή του συμφωνητικού με email στον πελάτη"
          >
            <Mail size={13} className="text-sky-600" />
            Email
          </button>

          <button
            onClick={handleCopyToGov}
            className="px-3.5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Αντιγραφή κειμένου & Άνοιγμα GOV.gr"
          >
            <Landmark size={13} className="text-indigo-600" />
            GOV.gr
          </button>

          <button
            onClick={handleSaveContract}
            className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/20"
          >
            <Download size={13} />
            Αποθήκευση
          </button>

          <button
            onClick={handleCreateNew}
            className="px-3.5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus size={13} />
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

              {/* GEMI API Auto-fill Box */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-blue-600 animate-pulse" />
                    Αυτόματη Συμπλήρωση από Γ.Ε.ΜΗ. (API)
                  </span>
                  <span className="text-[9px] font-bold text-blue-600 bg-blue-100/80 px-2 py-0.5 rounded-full">
                    Live σύνδεση με ΓΕΜΗ
                  </span>
                </div>
                <p className="text-[10px] text-blue-800/80 font-medium">
                  Εισάγετε <strong>Α.Φ.Μ. (9 ψηφία)</strong> ή <strong>Αριθμό Γ.Ε.ΜΗ. (12 ψηφία)</strong> για αυτόματη άντληση επωνυμίας, εκπροσώπου, πατρωνύμου κ.α.:
                </p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" size={14} />
                    <input
                      type="text"
                      value={gemiSearchQuery}
                      onChange={(e) => setGemiSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleGemiLookup();
                        }
                      }}
                      placeholder="π.χ. 803351366 ή 195135303000..."
                      className="w-full pl-8 pr-3 py-2 bg-white border border-blue-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#3b5bdb] focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleGemiLookup()}
                    disabled={isSearchingGemi}
                    className="px-4 py-2 bg-[#3b5bdb] hover:bg-[#2b4bba] text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSearchingGemi ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        Ανάκτηση...
                      </>
                    ) : (
                      <>
                        <Sparkles size={13} />
                        Ανάκτηση
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Client Info */}
              <div className="space-y-4 pt-2 border-t border-gray-100">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <User size={14} className="text-emerald-600" />
                  Στοιχεία Εργοδότη / Πελάτη
                </h4>

                {ymsDetectedInfo?.detected && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200/90 rounded-2xl flex items-center gap-2.5 text-emerald-900 text-[11px] font-semibold">
                    <Check size={14} className="text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold text-emerald-800">Ανακοίνωση Σύστασης ΥΜΣ: </span>
                      Αντλήθηκε αυτόματα (ΑΦΜ: <span className="font-mono font-bold text-emerald-900">{ymsDetectedInfo.afm || "-"}</span>, Πατρώνυμο: <span className="font-bold text-emerald-900">{ymsDetectedInfo.father || "-"}</span>)
                    </div>
                  </div>
                )}

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
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                        Αριθμός Γ.Ε.ΜΗ.
                      </label>
                      {currentContract.gemiNo && (
                        <button
                          type="button"
                          onClick={() => handleGemiLookup(currentContract.gemiNo)}
                          disabled={isSearchingGemi}
                          className="text-[9px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer"
                          title="Αναζήτηση στο ΓΕΜΗ με αυτόν τον αριθμό"
                        >
                          <RefreshCw size={10} />
                          Άντληση
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={currentContract.gemiNo}
                      onChange={(e) => setCurrentContract({ ...currentContract, gemiNo: e.target.value })}
                      placeholder="π.χ. 195135303000"
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
                      placeholder="π.χ. ΒΑΣΙΛΕΙΟΣ ΛΥΡΟΥΔΗΣ"
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
                      placeholder="π.χ. ΧΡΗΣΤΟΥ"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#3b5bdb]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                      Α.Φ.Μ. Διαχειριστή (ΥΜΣ)
                    </label>
                    <input
                      type="text"
                      value={currentContract.representativeAfm || ""}
                      onChange={(e) => setCurrentContract({ ...currentContract, representativeAfm: e.target.value })}
                      placeholder="π.χ. 050480299"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#3b5bdb]"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                        Α.Φ.Μ. Εταιρείας / Πελάτη
                      </label>
                      {currentContract.clientAfm && (
                        <button
                          type="button"
                          onClick={() => handleGemiLookup(currentContract.clientAfm)}
                          disabled={isSearchingGemi}
                          className="text-[9px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer"
                          title="Αναζήτηση στο ΓΕΜΗ με αυτό το ΑΦΜ"
                        >
                          <RefreshCw size={10} />
                          Άντληση
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={currentContract.clientAfm}
                      onChange={(e) => setCurrentContract({ ...currentContract, clientAfm: e.target.value })}
                      placeholder="π.χ. 803351366"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#3b5bdb]"
                    />
                  </div>
                </div>

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
              </div>

              {/* Service & Scope Selection */}
              <div className="space-y-4 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Receipt size={14} className="text-indigo-600" />
                    Υπηρεσία & Πακέτο Έργου
                  </h4>
                  <span className="text-[10px] text-slate-500 font-bold">
                    Αυτόματη προσαρμογή τιμολογίου & συμφωνητικού
                  </span>
                </div>

                {/* Preset Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => handleApplyPreset("ike_gemi")}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      currentContract.serviceType === "ike_gemi"
                        ? "bg-blue-50 border-[#3b5bdb] ring-2 ring-[#3b5bdb]/30 text-blue-950 font-bold"
                        : "bg-slate-50 border-gray-200 hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <span className="block text-xs font-black">🏢 Ι.Κ.Ε. ΓΕΜΗ</span>
                    <span className="text-[10px] font-bold text-blue-600">150,00 € (Εφάπαξ)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplyPreset("eshop")}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      currentContract.serviceType === "eshop"
                        ? "bg-blue-50 border-[#3b5bdb] ring-2 ring-[#3b5bdb]/30 text-blue-950 font-bold"
                        : "bg-slate-50 border-gray-200 hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <span className="block text-xs font-black">🛒 E-Shop</span>
                    <span className="text-[10px] font-bold text-emerald-600">1.240,00 €</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplyPreset("website")}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      currentContract.serviceType === "website"
                        ? "bg-blue-50 border-[#3b5bdb] ring-2 ring-[#3b5bdb]/30 text-blue-950 font-bold"
                        : "bg-slate-50 border-gray-200 hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <span className="block text-xs font-black">🌐 Εταιρικό Site</span>
                    <span className="text-[10px] font-bold text-indigo-600">620,00 €</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplyPreset("custom")}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      currentContract.serviceType === "custom"
                        ? "bg-blue-50 border-[#3b5bdb] ring-2 ring-[#3b5bdb]/30 text-blue-950 font-bold"
                        : "bg-slate-50 border-gray-200 hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <span className="block text-xs font-black">⚙️ Custom</span>
                    <span className="text-[10px] font-bold text-slate-500">Προσαρμοσμένο</span>
                  </button>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                    Τίτλος Υπηρεσίας (εμφανίζεται στο Συμφωνητικό & στο Τιμολόγιο)
                  </label>
                  <input
                    type="text"
                    value={currentContract.serviceTitle}
                    onChange={(e) => setCurrentContract({ ...currentContract, serviceTitle: e.target.value })}
                    placeholder="π.χ. Κατασκευή Ηλεκτρονικού Καταστήματος (E-Shop)"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#3b5bdb]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                    Περιγραφή Υπηρεσίας / Παραδοτέα (Άρθρο 1 & Προσφορά)
                  </label>
                  <textarea
                    rows={3}
                    value={currentContract.serviceDescription}
                    onChange={(e) => setCurrentContract({ ...currentContract, serviceDescription: e.target.value })}
                    placeholder="Συνοπτική περιγραφή των συμφωνηθέντων παραδοτέων..."
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-[#3b5bdb]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                    Διεύθυνση Έδρας Επιχείρησης (για το Τιμολόγιο)
                  </label>
                  <input
                    type="text"
                    value={currentContract.address || ""}
                    onChange={(e) => setCurrentContract({ ...currentContract, address: e.target.value })}
                    placeholder="π.χ. Λεωφόρος Κηφισίας 100, Αθήνα, Τ.Κ. 11526"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#3b5bdb]"
                  />
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

                {/* Live Invoice Breakdown Card */}
                {(() => {
                  const calc = getInvoiceCalculations(currentContract);
                  return (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                          <Receipt size={13} className="text-emerald-600" />
                          Αυτόματος Υπολογισμός Τιμολογίου
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                          ΦΠΑ 24%
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between text-slate-600">
                          <span>Καθαρή Αξία:</span>
                          <span className="font-mono font-bold text-slate-900">{calc.net.toFixed(2).replace(".", ",")} €</span>
                        </div>
                        <div className="flex justify-between text-blue-600">
                          <span>Φ.Π.Α. (24%):</span>
                          <span className="font-mono font-bold">+{calc.vat.toFixed(2).replace(".", ",")} €</span>
                        </div>
                        <div className="flex justify-between text-slate-900 font-bold border-t border-slate-200 pt-1.5">
                          <span>Συνολική Αξία:</span>
                          <span className="font-mono">{calc.gross.toFixed(2).replace(".", ",")} €</span>
                        </div>
                        <div className="flex justify-between text-emerald-700 font-black border-t border-slate-200 pt-1.5">
                          <span>Πληρωτέο:</span>
                          <span className="font-mono font-black">{calc.payable.toFixed(2).replace(".", ",")} €</span>
                        </div>
                      </div>
                      {calc.withholding > 0 && (
                        <div className="text-[10px] text-rose-600 font-bold flex justify-between pt-1 border-t border-dashed border-rose-200">
                          <span>Παρακράτηση 20% (άνω των 300€):</span>
                          <span className="font-mono">-{calc.withholding.toFixed(2).replace(".", ",")} €</span>
                        </div>
                      )}
                    </div>
                  );
                })()}

              </div>
            </div>
          )}
        </div>

        {/* Right Column: Dynamic Document Preview with Document Selector Tabs */}
        <div className={isEditing ? "lg:col-span-6" : "lg:col-span-8"}>
          <div className="sticky top-24 space-y-3">
            
            {/* Document Selector Tabs */}
            <div className="flex items-center justify-between bg-white/90 backdrop-blur-md border border-gray-200 p-2 rounded-2xl shadow-sm no-print">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPreviewDocType("contract")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                    previewDocType === "contract"
                      ? "bg-[#3b5bdb] text-white shadow-md shadow-blue-500/20"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <FileCheck size={14} />
                  📜 Συμφωνητικό
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDocType("invoice")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                    previewDocType === "invoice"
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Receipt size={14} />
                  🧾 Πρότυπο Τιμολογίου & Προσφορά
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block text-[10px] text-slate-400 font-bold">
                  {previewDocType === "contract" ? "1 Σελίδα" : "2 Σελίδες"}
                </span>
                <button
                  type="button"
                  onClick={previewDocType === "contract" ? handlePrintContract : handlePrintInvoice}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  title="Εκτύπωση ενεργού εγγράφου"
                >
                  <Printer size={12} />
                  Εκτύπωση
                </button>
              </div>
            </div>

            {/* PREVIEW CONTAINER */}
            {previewDocType === "contract" ? (
              <div className="bg-white text-black font-serif shadow-2xl rounded-sm p-10 md:p-14 border border-gray-200 text-sm leading-relaxed tracking-normal print-contract-area">
                {/* DOCUMENT TITLE */}
                <div className="text-center font-bold mb-8">
                  <h1 className="text-base uppercase tracking-tight text-black font-extrabold mb-1">
                    ΙΔΙΩΤΙΚΟ ΣΥΜΦΩΝΗΤΙΚΟ ΠΑΡΟΧΗΣ ΥΠΗΡΕΣΙΩΝ
                  </h1>
                  <h2 className="text-sm uppercase tracking-tight text-black font-extrabold">
                    {currentContract.serviceTitle ? currentContract.serviceTitle.toUpperCase() : "ΚΑΤΑΣΚΕΥΗΣ ΙΣΤΟΣΕΛΙΔΑΣ ΕΤΑΙΡΙΚΗΣ ΔΙΑΦΑΝΕΙΑΣ (ΣΤΟΙΧΕΙΑ ΓΕΜΗ)"}
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
                  <strong>2. Αφετέρου:</strong> η εταιρεία με την επωνυμία <strong>«{currentContract.companyName || "................................................"}»</strong> (διακριτικός τίτλος <strong>«{currentContract.tradeName || "................................"}»</strong>), με Α.Φ.Μ. <strong>{currentContract.clientAfm || "...................."}</strong> και αριθμό Γ.Ε.ΜΗ. <strong>{currentContract.gemiNo || "...................."}</strong>, νομίμως εκπροσωπούμενη από {currentContract.representativeTitle || "τον διαχειριστή αυτής"} κ. <strong>{currentContract.representativeName || "................................"}</strong> του <strong>{currentContract.representativeFatherName || "...................."}</strong>, με Α.Φ.Μ. <strong>{currentContract.representativeAfm || "...................."}</strong>, εφεξής καλούμενη «ο Εργοδότης» ή «ο Πελάτης»,
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
                      Ο Ανάδοχος αναλαμβάνει έναντι του Εργοδότη την υλοποίηση και παροχή της υπηρεσίας: <strong>{currentContract.serviceTitle || "Κατασκευή Ιστοσελίδας Εταιρικής Διαφάνειας (Στοιχεία ΓΕΜΗ)"}</strong>.
                    </p>
                    <p className="mb-2">
                      {currentContract.serviceDescription || "Σχεδίαση, ανάπτυξη και παράδοση απλής ιστοσελίδας εταιρικής διαφάνειας με τα βασικά στοιχεία της επιχείρησης έναντι του Γ.Ε.ΜΗ., καταχώριση domain name (.gr) και φιλοξενία (hosting) 1ου έτους."}
                    </p>
                    <p>
                      Στην αμοιβή του Άρθρου 4 περιλαμβάνονται η υλοποίηση του παραδοτέου έργου, η αγορά/ενεργοποίηση του domain name και η φιλοξενία (hosting) για τον πρώτο χρόνο.
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
                      Ο Ανάδοχος υποχρεούται να παραδώσει το έργο εντός <strong>{currentContract.deliveryDaysText}</strong> εργάσιμων ημερών από την {currentContract.advanceAmountNum > 0 ? "καταβολή της προκαταβολής του Άρθρου 4" : "εξόφληση της αμοιβής του Άρθρου 4"}. Ο Εργοδότης υποχρεούται να παρέχει εγκαίρως στον Ανάδοχο τα απαραίτητα στοιχεία για την υλοποίηση.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-black text-sm mb-1.5">
                      Άρθρο 4 – Αμοιβή και τρόπος πληρωμής
                    </h3>
                    <p className="mb-1.5">
                      <strong>4.1</strong> Η συνολική συμφωνηθείσα αμοιβή ανέρχεται στο ποσό των <strong>{currentContract.totalAmountText}</strong>, συμπεριλαμβανομένου Φ.Π.Α.
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
                      Με την ολοκλήρωση της πλήρους εξόφλησης της αμοιβής, τα δικαιώματα επί του παραδοτέου κώδικα και του σχεδιασμού περιέρχονται στον Εργοδότη. Τυχόν πρόσθετες απαιτήσεις ή αλλαγές πέραν του περιγραφόμενου αντικειμένου δύνανται να αποτελέσουν αντικείμενο νέας συμφωνίας.
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
                    <div className="h-16 border-b border-dashed border-gray-300 w-3/4 mx-auto mb-2" />
                    <p className="font-bold uppercase tracking-wider">{currentContract.contractorName}</p>
                  </div>

                  <div>
                    <p className="font-bold text-sm mb-4">&nbsp;</p>
                    <p className="font-bold text-gray-900 mb-6">Ο Εργοδότης / Πελάτης</p>
                    <div className="h-16 border-b border-dashed border-gray-300 w-3/4 mx-auto mb-2" />
                    <p className="font-bold uppercase tracking-wider">{currentContract.representativeName || "................................"}</p>
                    <p className="text-[10px] text-gray-600 italic">
                      (για λογαριασμό της {currentContract.tradeName || currentContract.companyName || "...................."})
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* INVOICE & TECHNICAL PROPOSAL 2-PAGE PREVIEW */
              <div className="space-y-6">
                {/* PAGE 1: INVOICE MOCKUP */}
                <div className="bg-white p-8 md:p-10 shadow-2xl rounded-2xl border border-slate-200 text-slate-800 font-sans">
                  <div className="text-[9px] text-rose-600 font-extrabold text-center bg-rose-50/50 border border-rose-200 py-2 px-3 rounded-xl mb-4 italic tracking-wide">
                    ⚠️ Το παρόν δεν αποτελεί φορολογικό στοιχείο (τιμολόγιο), αλλά απεικόνιση της προσφοράς και του συμφωνηθέντος ποσού.
                  </div>

                  {/* Seller Header */}
                  <div className="flex justify-between items-start gap-4 border-b-2 border-slate-200 pb-5">
                    <div className="space-y-1.5 text-[11px] text-slate-700 w-2/3">
                      <div className="flex gap-2">
                        <span className="bg-slate-100 border border-slate-300 text-slate-800 font-bold px-2 py-0.5 rounded text-[8.5px] uppercase min-w-[70px] text-center">Επωνυμια</span>
                        <span className="font-bold text-slate-900">{currentContract.contractorName}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="bg-slate-100 border border-slate-300 text-slate-800 font-bold px-2 py-0.5 rounded text-[8.5px] uppercase min-w-[70px] text-center">Α.Φ.Μ.</span>
                        <span className="font-bold text-slate-900">{currentContract.contractorAfm}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="bg-slate-100 border border-slate-300 text-slate-800 font-bold px-2 py-0.5 rounded text-[8.5px] uppercase min-w-[70px] text-center">Επαγγελμα</span>
                        <span className="font-bold text-slate-900">{currentContract.contractorProfession}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="bg-slate-100 border border-slate-300 text-slate-800 font-bold px-2 py-0.5 rounded text-[8.5px] uppercase min-w-[70px] text-center">Δ.Ο.Υ.</span>
                        <span className="font-bold text-slate-900">{currentContract.contractorDoy}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="bg-slate-100 border border-slate-300 text-slate-800 font-bold px-2 py-0.5 rounded text-[8.5px] uppercase min-w-[70px] text-center">Διευθυνση</span>
                        <span className="font-bold text-slate-900 text-[10px]">{currentContract.contractorAddress}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end w-1/3">
                      <span className="font-heading font-black text-2xl tracking-tighter text-[#0f2d59] leading-none">
                        sgk<span className="text-[#3b5bdb]">.</span>
                      </span>
                      <span className="text-[7.5px] font-black text-slate-500 uppercase tracking-widest mt-1">
                        Software Development
                      </span>
                    </div>
                  </div>

                  {/* Doc Title */}
                  <div className="bg-[#0f2d59] text-white text-center py-2 text-xs font-black uppercase tracking-widest rounded-lg mt-3 shadow-sm">
                    Τιμολογιο Παροχης Υπηρεσιων
                  </div>

                  {/* Meta Info */}
                  <div className="grid grid-cols-5 gap-1.5 mt-2 text-[10px] font-bold text-slate-800">
                    <div className="border border-slate-200 p-2 rounded-lg bg-slate-50/50">
                      <span className="text-[8px] text-slate-500 block uppercase">Σειρα</span>
                      <span>A</span>
                    </div>
                    <div className="border border-slate-200 p-2 rounded-lg bg-slate-50/50">
                      <span className="text-[8px] text-slate-500 block uppercase">Α.Α.</span>
                      <span>1</span>
                    </div>
                    <div className="border border-slate-200 p-2 rounded-lg bg-slate-50/50">
                      <span className="text-[8px] text-slate-500 block uppercase">Ημερομηνια</span>
                      <span>{formatDateGreek(currentContract.contractDate)}</span>
                    </div>
                    <div className="border border-slate-200 p-2 rounded-lg bg-slate-50/50">
                      <span className="text-[8px] text-slate-500 block uppercase">ΜΑΡΚ</span>
                      <span className="font-mono text-[9px] truncate block">4000135...</span>
                    </div>
                    <div className="border border-slate-200 p-2 rounded-lg bg-slate-50/50">
                      <span className="text-[8px] text-slate-500 block uppercase">Πληρωμη</span>
                      <span>Web Banking</span>
                    </div>
                  </div>

                  {/* Buyer Details */}
                  <div className="mt-3 border border-slate-200 p-3 rounded-xl bg-slate-50/50">
                    <h4 className="text-[9.5px] font-black text-slate-900 uppercase border-b border-slate-200 pb-1 mb-2">
                      Στοιχεια Ληπτη (Πελατη)
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <div className="text-[9px] text-slate-500 uppercase">Επωνυμια / Διακριτικος Τιτλος</div>
                        <div className="font-black text-slate-900">{currentContract.tradeName || currentContract.companyName || "-"}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-slate-500 uppercase">Α.Φ.Μ. / Γ.Ε.ΜΗ.</div>
                        <div className="font-black text-slate-900">{currentContract.clientAfm || "-"} {currentContract.gemiNo ? `| ${currentContract.gemiNo}` : ""}</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-[9px] text-slate-500 uppercase">Διευθυνση Εδρας / Εκπροσωπος</div>
                        <div className="font-semibold text-slate-800">{currentContract.address || currentContract.city || "Αθήνα"} • Εκπρόσωπος: {currentContract.representativeName || "-"}</div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Table */}
                  {(() => {
                    const calc = getInvoiceCalculations(currentContract);
                    return (
                      <>
                        <div className="mt-3 border border-slate-200 rounded-xl overflow-hidden">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-[#0f2d59] text-white text-[9.5px] uppercase tracking-wider font-bold">
                              <tr>
                                <th className="p-2.5">Περιγραφη Υπηρεσιων</th>
                                <th className="p-2.5 text-right">Ποσοτητα</th>
                                <th className="p-2.5 text-right">Καθαρη Αξια</th>
                                <th className="p-2.5 text-right">Φ.Π.Α. (24%)</th>
                                <th className="p-2.5 text-right">Συνολο</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 font-medium">
                              <tr>
                                <td className="p-2.5">
                                  <strong className="block text-slate-900">{currentContract.serviceTitle || "Κατασκευή & Ανάπτυξη Λογισμικού / Ιστοσελίδας"}</strong>
                                  <span className="text-[10px] text-slate-500">{currentContract.serviceDescription || "Σύμφωνα με την τεχνική προσφορά (Σελίδα 2)"}</span>
                                </td>
                                <td className="p-2.5 text-right font-mono">1</td>
                                <td className="p-2.5 text-right font-mono font-bold">{calc.net.toFixed(2).replace(".", ",")} €</td>
                                <td className="p-2.5 text-right font-mono font-bold text-blue-600">{calc.vat.toFixed(2).replace(".", ",")} €</td>
                                <td className="p-2.5 text-right font-mono font-black text-slate-900">{calc.gross.toFixed(2).replace(".", ",")} €</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {/* Financial Summary */}
                        <div className="mt-3 flex justify-end">
                          <div className="w-full sm:w-1/2 bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                            <div className="flex justify-between text-slate-600 font-bold">
                              <span>Καθαρή Αξία:</span>
                              <span className="font-mono text-slate-900">{calc.net.toFixed(2).replace(".", ",")} €</span>
                            </div>
                            <div className="flex justify-between text-blue-600 font-bold">
                              <span>Φ.Π.Α. 24%:</span>
                              <span className="font-mono">+{calc.vat.toFixed(2).replace(".", ",")} €</span>
                            </div>
                            <div className="flex justify-between text-slate-900 font-black text-sm pt-1.5 border-t border-slate-200">
                              <span>Συνολική Αξία:</span>
                              <span className="font-mono">{calc.gross.toFixed(2).replace(".", ",")} €</span>
                            </div>
                            {calc.withholding > 0 && (
                              <div className="flex justify-between text-rose-600 font-bold text-xs pt-0.5">
                                <span>Παρακράτηση Φόρου 20%:</span>
                                <span className="font-mono">-{calc.withholding.toFixed(2).replace(".", ",")} €</span>
                              </div>
                            )}
                            <div className="flex justify-between text-emerald-700 font-black text-sm pt-1.5 border-t-2 border-emerald-500">
                              <span>Πληρωτέο Ποσό:</span>
                              <span className="font-mono font-black">{calc.payable.toFixed(2).replace(".", ",")} €</span>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })()}

                  {/* Bank Details */}
                  <div className="mt-3 p-2.5 rounded-xl bg-blue-50/60 border border-blue-200 text-xs">
                    <span className="font-black text-[#0f2d59] uppercase block text-[9.5px] mb-0.5">Τραπεζικος Λογαριασμος Εξοφλησης</span>
                    <div className="font-mono font-bold text-slate-800">
                      Eurobank IBAN: <span className="text-[#3b5bdb]">GR46 0260 1970 0008 3020 1330 337</span>
                    </div>
                    <div className="text-[9.5px] text-slate-500 mt-0.5">Δικαιούχος: ΤΣΑΒΟΣ ΣΠΥΡΙΔΩΝ ΧΡΗΣΤΟΣ</div>
                  </div>
                </div>

                {/* PAGE 2: TECHNICAL PROPOSAL */}
                <div className="bg-white p-8 md:p-10 shadow-2xl rounded-2xl border border-slate-200 text-slate-800 font-sans">
                  <div className="border-b-2 border-slate-900 pb-3 mb-5 flex justify-between items-center">
                    <div>
                      <span className="text-[9px] font-black text-[#3b5bdb] uppercase tracking-widest block">SGK Digital Technical Scope</span>
                      <h2 className="text-lg font-black uppercase text-slate-900 tracking-tight">Αναλυτικη Τεχνικη Προσφορα</h2>
                    </div>
                    <div className="text-right text-xs font-bold text-slate-500">
                      Σελίδα 2 / 2
                    </div>
                  </div>

                  <div className="space-y-4">
                    {getInvoiceCalculations(currentContract).offerItems.map((item, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5">
                        <h3 className="font-black text-xs text-[#0f2d59]">
                          {idx + 1}. {item.title}
                        </h3>
                        <p className="text-xs text-slate-700 leading-relaxed text-justify">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Security & Guarantee Footer */}
                  <div className="mt-8 pt-5 border-t border-slate-200 text-center text-xs text-slate-500 font-semibold space-y-1">
                    <p>Όλα τα παραδοτέα συνοδεύονται από εγγύηση καλής λειτουργίας & υποστήριξη της <strong>SGK Digital</strong>.</p>
                    <p className="text-[10px] text-slate-400">SGK Software Development • info@sgk.gr • 211 114 0013</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* PRINT MEDIA STYLES FOR CLEAN PDF GENERATION */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          body * {
            visibility: hidden !important;
          }
          .print-contract-area, .print-contract-area * {
            visibility: visible !important;
          }
          .print-contract-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            font-size: 10.5pt !important;
            line-height: 1.45 !important;
            color: black !important;
            background: white !important;
          }
          @page {
            size: A4 portrait;
            margin: 12mm 18mm 12mm 18mm;
          }
        }
      `}</style>
    </div>
  );
}
