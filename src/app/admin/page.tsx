"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calculator, Plus, Trash2, Calendar, FileText, Download, Upload,
  TrendingUp, TrendingDown, RefreshCcw, Info, CheckCircle2, AlertTriangle,
  LayoutDashboard, Search, FileSpreadsheet, Percent, Coins, ArrowRightLeft,
  ChevronRight, Sparkles, Filter, HelpCircle, QrCode, Printer, Check, Copy,
  Briefcase, Edit3, Mail, Activity
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { EmailsTab } from "./EmailsTab";
import { ScraperTab } from "./ScraperTab";
import { TrackingTab } from "./TrackingTab";

// --- Types ---
interface Transaction {
  id: string;
  type: "income" | "expense";
  grossAmount: number; // με ΦΠΑ
  netAmount: number;   // προ ΦΠΑ
  vatAmount: number;   // ΦΠΑ 24%
  date: string;        // YYYY-MM-DD
  description: string;
  category: string;
}

interface OfferItem {
  id: string;
  title: string;
  description: string;
  duration: string;
}

// --- Predefined Categories ---
const CATEGORIES = {
  income: [
    "Παροχή Υπηρεσιών (Software)",
    "Κατασκευή Eshop / Ιστοσελίδας",
    "Συμβουλευτική (Consulting)",
    "Συνδρομές / SaaS",
    "Άλλα Έσοδα"
  ],
  expense: [
    "Ενοίκιο Έδρας / Γραφείου",
    "Λογιστικές Υπηρεσίες",
    "Διαφήμιση (Google Ads / Facebook)",
    "Συνδρομές Λογισμικού (SaaS, Hosting)",
    "Αγορά Εξοπλισμού (PC, Servers)",
    "Τηλεπικοινωνίες & Internet",
    "Ρεύμα / Κοινόχρηστα",
    "Γραφική Ύλη / Αναλώσιμα",
    "Άλλα Έξοδα"
  ]
};

// --- Timezone-Safe Quarter Helper ---
const MONTHS = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"] as const;
type MonthType = typeof MONTHS[number];

const getMonthFromDate = (dateStr: string): MonthType => {
  const parts = dateStr.split("-");
  if (parts.length < 2) return "01";
  const m = parts[1];
  return MONTHS.includes(m as MonthType) ? (m as MonthType) : "01";
};

const getMonthName = (m: MonthType) => {
  const names: Record<MonthType, string> = {
    "01": "Ιανουάριος", "02": "Φεβρουάριος", "03": "Μάρτιος", "04": "Απρίλιος",
    "05": "Μάιος", "06": "Ιούνιος", "07": "Ιούλιος", "08": "Αύγουστος",
    "09": "Σεπτέμβριος", "10": "Οκτώβριος", "11": "Νοέμβριος", "12": "Δεκέμβριος"
  };
  return names[m];
};

export default function AdminVatDashboard() {
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activePortalTab, setActivePortalTab] = useState<"ledger" | "aade" | "tax" | "emails" | "scraper" | "tracking">("ledger");
  
  // Year & Ledger State
  const [filterYear, setFilterYear] = useState<string>(() => String(new Date().getFullYear()));
  const [filterMonth, setFilterMonth] = useState<"all" | MonthType>("all");
  const [paidMonths, setPaidMonths] = useState<Record<string, number>>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("vat_paid_status");
      if (saved) {
        const parsed = JSON.parse(saved);
        const migrated: Record<string, number> = {};
        for (const [k, v] of Object.entries(parsed)) {
           if (typeof v === 'boolean') {
              migrated[k] = v ? 1 : 0;
           } else {
              migrated[k] = Number(v);
           }
        }
        setPaidMonths(migrated);
      }
    }
  }, []);

  const updateMonthPaid = (year: string, month: MonthType, amount: number) => {
    const key = `${year}_${month}`;
    const next = { ...paidMonths, [key]: amount };
    setPaidMonths(next);
    localStorage.setItem("vat_paid_status", JSON.stringify(next));
  };
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Ledger Add Transaction Form State
  const [txType, setTxType] = useState<"income" | "expense">("income");
  const [grossAmount, setGrossAmount] = useState<string>("");
  const [date, setDate] = useState<string>(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>(CATEGORIES.income[0]);
  const [isZeroVat, setIsZeroVat] = useState<boolean>(false);

  // Live Quick Calculator State
  const [calcInput, setCalcInput] = useState<string>("");
  const [calcMode, setCalcMode] = useState<"gross" | "net">("gross");

  // --- AADE Invoicing & Withholding Calculator State ---
  const [aadeInputVal, setAadeInputVal] = useState<string>("1500");
  const [aadeInputMode, setAadeInputMode] = useState<"payable" | "net">("payable");
  const [aadeClientName, setAadeClientName] = useState<string>("ΓΙΑΚΟΥΜΑΚΗ ΒΑΣΙΛΙΚΗ ΑΝΤΩΝΙΟΣ");
  const [aadeClientAfm, setAadeClientAfm] = useState<string>("161578030");
  const [aadeClientAddress, setAadeClientAddress] = useState<string>("ΔΑΡΑΤΣΟ Ι ΜΥΓΙΑΚΗ 0 - ΧΑΝΙΑ 73100");
  const [aadeDocNo, setAadeDocNo] = useState<string>("4");
  const [aadeDate, setAadeDate] = useState<string>(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });

  // --- Technical Offer Page 2 Items State ---
  const [offerItems, setOfferItems] = useState<OfferItem[]>([
    {
      id: "item_1",
      title: "Κατασκευή Eshop (WooCommerce)",
      description: "Σχεδιασμός & ανάπτυξη custom ηλεκτρονικού καταστήματος WooCommerce. Πλήρης responsive σχεδίαση για κινητά, διασύνδεση με τράπεζες, αυτόματος υπολογισμός μεταφορικών, ταχύτητα Google PageSpeed 95+ και 12 μήνες τεχνική υποστήριξη.",
      duration: "20 εργάσιμες ημέρες"
    },
    {
      id: "item_2",
      title: "AI Agents & Automation Integration",
      description: "Ανάπτυξη έξυπνου AI Agent για αυτόματη εξυπηρέτηση πελατών, διασύνδεση με Supabase, chat widgets και Resend API για αυτοματοποιημένη αποστολή emails.",
      duration: "10 εργάσιμες ημέρες"
    }
  ]);

  // Form State for Adding Offer Items
  const [newItemTitle, setNewItemTitle] = useState<string>("");
  const [newItemDesc, setNewItemDesc] = useState<string>("");
  const [newItemDuration, setNewItemDuration] = useState<string>("");

  // --- Tax Estimator State ---
  const [taxNetSalary, setTaxNetSalary] = useState<string>("1050");
  const [taxMonths, setTaxMonths] = useState<string>("10");
  const [taxChildren, setTaxChildren] = useState<string>("0");
  const [isNewBusiness, setIsNewBusiness] = useState<boolean>(true);
  const [taxWithheldB2B, setTaxWithheldB2B] = useState<string>("");

  // Load persistent transactions
  useEffect(() => {
    setMounted(true);
    const savedAuth = sessionStorage.getItem("admin_auth");
    if (savedAuth === "true") setIsAuthenticated(true);

    const fetchTransactions = async () => {
      const { data, error } = await supabase.from('ledger_transactions').select('*').order('created_at', { ascending: false });
      if (error) {
        console.error("Error loading vat ledger", error);
      } else if (data) {
        const mapped = data.map((t: any) => ({
          id: t.id,
          type: t.type,
          grossAmount: Number(t.gross_amount),
          netAmount: Number(t.net_amount),
          vatAmount: Number(t.vat_amount),
          date: t.date,
          description: t.description,
          category: t.category
        }));
        setTransactions(mapped);
      }
    };
    fetchTransactions();
  }, []);

  // Save persistent transactions
  const saveTransactions = (newTxList: Transaction[]) => {
    setTransactions(newTxList);
  };

  // Reset category selection when type changes
  useEffect(() => {
    setCategory(CATEGORIES[txType][0]);
  }, [txType]);

  // --- AADE Withholding Calculation Math ---
  const aadeMath = useMemo(() => {
    const input = parseFloat(aadeInputVal);
    if (isNaN(input) || input <= 0) {
      return { net: 0, vat: 0, gross: 0, withholding: 0, payable: 0, isWithheld: false };
    }

    let net = 0;
    let isWithheld = false;

    if (aadeInputMode === "net") {
      net = input;
      isWithheld = net > 300;
    } else {
      if (input <= 372) {
        net = input / 1.24;
        isWithheld = net > 300;
      } else {
        net = input / 1.04;
        isWithheld = true;
      }
    }

    const vat = net * 0.24;
    const gross = net + vat;
    const withholding = isWithheld ? net * 0.20 : 0;
    const payable = gross - withholding;

    return {
      net: parseFloat(net.toFixed(2)),
      vat: parseFloat(vat.toFixed(2)),
      gross: parseFloat(gross.toFixed(2)),
      withholding: parseFloat(withholding.toFixed(2)),
      payable: parseFloat(payable.toFixed(2)),
      isWithheld
    };
  }, [aadeInputVal, aadeInputMode]);


  // Ledger Add Transaction Form Submission
  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(grossAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Σφάλμα Καταχώρησης", {
        description: "Παρακαλώ εισάγετε ένα έγκυρο θετικό ποσό τιμολογίου."
      });
      return;
    }

    if (!description.trim()) {
      toast.error("Σφάλμα Καταχώρησης", {
        description: "Παρακαλώ εισάγετε μια περιγραφή ή όνομα πελάτη/προμηθευτή."
      });
      return;
    }

    const calculatedNet = isZeroVat ? parsedAmount : parsedAmount / 1.24;
    const calculatedVat = isZeroVat ? 0 : parsedAmount - calculatedNet;

    const { data, error } = await supabase.from('ledger_transactions').insert({
      type: txType,
      gross_amount: parsedAmount,
      net_amount: parseFloat(calculatedNet.toFixed(2)),
      vat_amount: parseFloat(calculatedVat.toFixed(2)),
      date,
      description: description.trim(),
      category
    }).select().single();

    if (error) {
      toast.error("Σφάλμα Βάσης", { description: error.message });
      return;
    }

    const newTx: Transaction = {
      id: data.id,
      type: data.type,
      grossAmount: Number(data.gross_amount),
      netAmount: Number(data.net_amount),
      vatAmount: Number(data.vat_amount),
      date: data.date,
      description: data.description,
      category: data.category
    };

    setTransactions(prev => [newTx, ...prev]);
    
    // Reset Form
    setGrossAmount("");
    setDescription("");
    setIsZeroVat(false);
    toast.success("Επιτυχής Καταχώρηση", {
      description: `${txType === "income" ? "Το έσοδο" : "Το έξοδο"} προστέθηκε με επιτυχία στη βάση.`
    });
  };

  // Add AADE generated invoice to Ledger
  const handleAddAadeInvoiceToLedger = async () => {
    if (aadeMath.payable <= 0) return;

    const { data, error } = await supabase.from('ledger_transactions').insert({
      type: "income",
      gross_amount: aadeMath.gross,
      net_amount: aadeMath.net,
      vat_amount: aadeMath.vat,
      date: aadeDate,
      description: `Τιμολόγιο #${aadeDocNo} - ${aadeClientName}`,
      category: "Παροχή Υπηρεσιών (Software)"
    }).select().single();

    if (error) {
      toast.error("Σφάλμα Βάσης", { description: error.message });
      return;
    }

    const newTx: Transaction = {
      id: data.id,
      type: data.type,
      grossAmount: Number(data.gross_amount),
      netAmount: Number(data.net_amount),
      vatAmount: Number(data.vat_amount),
      date: data.date,
      description: data.description,
      category: data.category
    };

    setTransactions(prev => [newTx, ...prev]);
    toast.success("Αυτόματη Καταχώρηση", {
      description: "Το τιμολόγιο προστέθηκε επιτυχώς στη βάση σας!"
    });
  };
  // Preset Loading Helper
  const handleLoadPreset = (presetType: "eshop" | "webapp" | "hosting" | "ai" | "consulting") => {
    switch (presetType) {
      case "eshop":
        setNewItemTitle("Κατασκευή Eshop (WooCommerce & Custom Design)");
        setNewItemDesc("Σχεδιασμός & ανάπτυξη custom ηλεκτρονικού καταστήματος. Περιλαμβάνει responsive σχεδίαση για κινητά/tablets, διασύνδεση με τράπεζες & Viva Wallet, αυτόματο υπολογισμό μεταφορικών (ACS, BoxNow), εισαγωγή προϊόντων, εκπαίδευση διαχειριστή, Google PageSpeed 95+ και βασικό SEO.");
        setNewItemDuration("25 εργάσιμες ημέρες");
        break;
      case "webapp":
        setNewItemTitle("Ανάπτυξη Web Application (Next.js & Supabase Cloud)");
        setNewItemDesc("Custom web εφαρμογή με React/Next.js και cloud βάση δεδομένων Supabase (PostgreSQL). Περιλαμβάνει σύστημα χρηστών (Auth), real-time dashboards με γραφήματα, διασύνδεση με APIs, αυτόματες ειδοποιήσεις email/SMS και cloud hosting.");
        setNewItemDuration("40 εργάσιμες ημέρες");
        break;
      case "hosting":
        setNewItemTitle("Premium Hosting & Τεχνική Υποστήριξη (VPS & Cloudflare)");
        setNewItemDesc("Φιλοξενία σε ταχύτατο VPS. Περιλαμβάνει Cloudflare CDN integration, SSL ασφαλείας, εβδομαδιαία backups σε απομακρυσμένο server, real-time monitoring 24/7, updates plugins/θεμάτων και 3 ώρες τεχνική υποστήριξη/μήνα.");
        setNewItemDuration("Μηνιαία Συνδρομή (12 Μήνες)");
        break;
      case "ai":
        setNewItemTitle("AI Agent & Automations (LLM Integration)");
        setNewItemDesc("Ανάπτυξη custom AI Agent βασισμένου σε GPT-4 / Claude με Vector DB (Supabase vector) για RAG (γνώση της επιχείρησής σας). Περιλαμβάνει site chat widget, lead generation flows, auto email responses και integration με WhatsApp/Slack.");
        setNewItemDuration("15 εργάσιμες ημέρες");
        break;
      case "consulting":
        setNewItemTitle("Παροχή Υπηρεσιών Πληροφορικής & Συμβουλευτική");
        setNewItemDesc("Ψηφιακός έλεγχος αναγκών, σχεδιασμός αρχιτεκτονικής συστημάτων, security audit και roadmap ψηφιακού μετασχηματισμού της επιχείρησης. Περιλαμβάνει αναλυτική γραπτή έκθεση.");
        setNewItemDuration("5 εργάσιμες ημέρες");
        break;
    }
    toast.success("Φόρτωση Προτύπου", {
      description: "Τα στοιχεία του προτύπου συμπληρώθηκαν στη φόρμα."
    });
  };

  // Add Item to Offer
  const handleAddOfferItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim()) {
      toast.error("Σφάλμα Στοιείου", { description: "Παρακαλώ εισάγετε τίτλο υπηρεσίας." });
      return;
    }

    const newItem: OfferItem = {
      id: "offer_" + Math.random().toString(36).substring(2, 9),
      title: newItemTitle.trim(),
      description: newItemDesc.trim(),
      duration: newItemDuration.trim() || "Κατόπιν Συμφωνίας"
    };

    setOfferItems([...offerItems, newItem]);
    setNewItemTitle("");
    setNewItemDesc("");
    setNewItemDuration("");
    toast.success("Υπηρεσία Προστέθηκε", { description: "Η υπηρεσία προστέθηκε με επιτυχία στην προσφορά." });
  };
  // Delete Offer Item
  const handleDeleteOfferItem = (id: string) => {
    if (offerItems.length <= 1) {
      toast.error("Περιορισμός", { description: "Πρέπει να υπάρχει τουλάχιστον μία υπηρεσία στην προσφορά." });
      return;
    }
    const updated = offerItems.filter(item => item.id !== id);
    setOfferItems(updated);
    toast.info("Υπηρεσία Αφαιρέθηκε", { description: "Η υπηρεσία αφαιρέθηκε από την προσφορά." });
  };

  // Delete Transaction
  const handleDeleteTransaction = async (id: string) => {
    const { error } = await supabase.from('ledger_transactions').delete().eq('id', id);
    if (error) {
      toast.error("Σφάλμα Βάσης", { description: error.message });
      return;
    }
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast.info("Διαγραφή Τιμολογίου", {
      description: "Το τιμολόγιο αφαιρέθηκε από τη βάση."
    });
  };

  // Clear All Transactions
  const handleClearAll = async () => {
    if (window.confirm("ΠΡΟΣΟΧΗ! Είστε σίγουροι ότι θέλετε να διαγράψετε ΟΛΑ τα καταχωρημένα τιμολόγια; Αυτή η ενέργεια δεν αναιρείται.")) {
      const { error } = await supabase.from('ledger_transactions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (error) {
        toast.error("Σφάλμα Βάσης", { description: error.message });
        return;
      }
      setTransactions([]);
      toast.error("Καθαρισμός Βάσης", {
        description: "Όλα τα δεδομένα διαγράφηκαν οριστικά."
      });
    }
  };

  // Export to JSON
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(transactions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `sgk_vat_ledger_${filterYear}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success("Εξαγωγή Δεδομένων", {
      description: "Το αρχείο JSON λήφθηκε με επιτυχία."
    });
  };

  // Import JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const file = e.target.files?.[0];
    if (!file) return;

    fileReader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          const isValid = parsed.every(item => 
            (item.type === "income" || item.type === "expense") &&
            typeof item.grossAmount === "number" &&
            typeof item.date === "string"
          );
          if (isValid) {
            const toInsert = parsed.map(item => ({
              type: item.type,
              gross_amount: item.grossAmount,
              net_amount: item.netAmount,
              vat_amount: item.vatAmount,
              date: item.date,
              description: item.description || "Εισαγωγή",
              category: item.category || "Άλλα Έσοδα"
            }));
            
            const { data, error } = await supabase.from('ledger_transactions').insert(toInsert).select();
            if (error) {
               toast.error("Σφάλμα Βάσης", { description: error.message });
               return;
            }
            
            if (data) {
              const mapped = data.map((t: any) => ({
                id: t.id,
                type: t.type,
                grossAmount: Number(t.gross_amount),
                netAmount: Number(t.net_amount),
                vatAmount: Number(t.vat_amount),
                date: t.date,
                description: t.description,
                category: t.category
              }));
              setTransactions(prev => [...mapped, ...prev]);
            }

            toast.success("Εισαγωγή Δεδομένων", {
              description: `Εισήχθησαν επιτυχώς ${parsed.length} τιμολόγια στη βάση!`
            });
          } else {
            toast.error("Σφάλμα Αρχείου", {
              description: "Η δομή του αρχείου JSON δεν είναι συμβατή με το σύστημα."
            });
          }
        }
      } catch (err) {
        toast.error("Σφάλμα Φόρτωσης", {
          description: "Αδυναμία ανάγνωσης του αρχείου JSON."
        });
      }
    };
    fileReader.readAsText(file);
  };

  // --- Real-time Calculations per Quarter ---
  const monthlyStats = useMemo(() => {
    const stats: Record<MonthType, { incomeGross: number, incomeNet: number, incomeVat: number, expenseGross: number, expenseNet: number, expenseVat: number }> = {
      "01": { incomeGross: 0, incomeNet: 0, incomeVat: 0, expenseGross: 0, expenseNet: 0, expenseVat: 0 },
      "02": { incomeGross: 0, incomeNet: 0, incomeVat: 0, expenseGross: 0, expenseNet: 0, expenseVat: 0 },
      "03": { incomeGross: 0, incomeNet: 0, incomeVat: 0, expenseGross: 0, expenseNet: 0, expenseVat: 0 },
      "04": { incomeGross: 0, incomeNet: 0, incomeVat: 0, expenseGross: 0, expenseNet: 0, expenseVat: 0 },
      "05": { incomeGross: 0, incomeNet: 0, incomeVat: 0, expenseGross: 0, expenseNet: 0, expenseVat: 0 },
      "06": { incomeGross: 0, incomeNet: 0, incomeVat: 0, expenseGross: 0, expenseNet: 0, expenseVat: 0 },
      "07": { incomeGross: 0, incomeNet: 0, incomeVat: 0, expenseGross: 0, expenseNet: 0, expenseVat: 0 },
      "08": { incomeGross: 0, incomeNet: 0, incomeVat: 0, expenseGross: 0, expenseNet: 0, expenseVat: 0 },
      "09": { incomeGross: 0, incomeNet: 0, incomeVat: 0, expenseGross: 0, expenseNet: 0, expenseVat: 0 },
      "10": { incomeGross: 0, incomeNet: 0, incomeVat: 0, expenseGross: 0, expenseNet: 0, expenseVat: 0 },
      "11": { incomeGross: 0, incomeNet: 0, incomeVat: 0, expenseGross: 0, expenseNet: 0, expenseVat: 0 },
      "12": { incomeGross: 0, incomeNet: 0, incomeVat: 0, expenseGross: 0, expenseNet: 0, expenseVat: 0 }
    };

    transactions.forEach(t => {
      const year = t.date.split("-")[0];
      if (year !== filterYear) return;

      const m = getMonthFromDate(t.date);
      if (t.type === "income") {
        stats[m].incomeGross += t.grossAmount;
        stats[m].incomeNet += t.netAmount;
        stats[m].incomeVat += t.vatAmount;
      } else {
        stats[m].expenseGross += t.grossAmount;
        stats[m].expenseNet += t.netAmount;
        stats[m].expenseVat += t.vatAmount;
      }
    });

    return stats;
  }, [transactions, filterYear]);

  // Total Year Summary
  const yearlySummary = useMemo(() => {
    let incomeGross = 0;
    let incomeNet = 0;
    let incomeVat = 0;
    let expenseGross = 0;
    let expenseNet = 0;
    let expenseVat = 0;

    Object.values(monthlyStats).forEach(m => {
      incomeGross += m.incomeGross;
      incomeNet += m.incomeNet;
      incomeVat += m.incomeVat;
      expenseGross += m.expenseGross;
      expenseNet += m.expenseNet;
      expenseVat += m.expenseVat;
    });

    const netVatPayable = incomeVat - expenseVat;

    return {
      incomeGross, incomeNet, incomeVat,
      expenseGross, expenseNet, expenseVat,
      netVatPayable
    };
  }, [monthlyStats]);

  // Upcoming VAT deadline countdown (Greek tax rules)
  const nextDeadline = useMemo(() => {
    const now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1; // getMonth() returns 0-11. We want next month's last day.
    
    // Deadline for current month is the last day of the *next* month
    let targetMonth = month + 1;
    if (targetMonth > 12) {
      targetMonth = 1;
      year += 1;
    }
    
    const deadlineDate = new Date(year, targetMonth, 0, 23, 59, 59);
    
    const diffTime = deadlineDate.getTime() - now.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const formattedDate = deadlineDate.toLocaleDateString("el-GR", { day: "numeric", month: "long", year: "numeric" });
    const currentMonthStr = MONTHS[month - 1];

    return {
      name: `Μηνός ${getMonthName(currentMonthStr)}`,
      daysLeft,
      formattedDate
    };
  }, []);

  // Estimate 20% withholding from Ledger automatically
  const estimatedWithheld20 = useMemo(() => {
    let total = 0;
    transactions.forEach(t => {
      const tYear = t.date.split("-")[0];
      if (tYear === filterYear && t.type === "income" && t.netAmount > 300) {
        total += t.netAmount * 0.20;
      }
    });
    return total;
  }, [transactions, filterYear]);

  // --- Tax Estimator Math ---
  const taxMath = useMemo(() => {
    const netMonthly = parseFloat(taxNetSalary) || 0;
    const months = parseFloat(taxMonths) || 10;
    const annualNetSalary = netMonthly * (months * (14 / 12));
    const annualGrossSalary = annualNetSalary / 0.78;

    const businessNetProfit = yearlySummary.incomeNet - yearlySummary.expenseNet;
    const taxableBusinessIncome = Math.max(0, businessNetProfit);
    const totalTaxableIncome = annualGrossSalary + taxableBusinessIncome;

    let tax = 0;
    let remaining = totalTaxableIncome;

    let businessTaxDiscount = 0;
    if (isNewBusiness && yearlySummary.incomeGross <= 10000 && taxableBusinessIncome > 0) {
      const eligibleAmount = Math.min(10000, taxableBusinessIncome);
      businessTaxDiscount = eligibleAmount * 0.045;
    }

    if (remaining > 40000) { tax += (remaining - 40000) * 0.44; remaining = 40000; }
    if (remaining > 30000) { tax += (remaining - 30000) * 0.36; remaining = 30000; }
    if (remaining > 20000) { tax += (remaining - 20000) * 0.28; remaining = 20000; }
    if (remaining > 10000) { tax += (remaining - 10000) * 0.22; remaining = 10000; }
    if (remaining > 0) { tax += remaining * 0.09; }

    tax -= businessTaxDiscount;

    let taxDiscount = 777;
    const children = parseInt(taxChildren) || 0;
    if (children === 1) taxDiscount = 810;
    if (children === 2) taxDiscount = 900;
    if (children === 3) taxDiscount = 1120;
    if (children >= 4) taxDiscount = 1340;

    if (totalTaxableIncome > 12000) {
      const reduction = Math.floor((totalTaxableIncome - 12000) / 1000) * 20;
      taxDiscount = Math.max(0, taxDiscount - reduction);
    }

    tax = Math.max(0, tax - taxDiscount);

    let salaryTax = 0;
    let sRem = annualGrossSalary;
    if (sRem > 40000) { salaryTax += (sRem - 40000) * 0.44; sRem = 40000; }
    if (sRem > 30000) { salaryTax += (sRem - 30000) * 0.36; sRem = 30000; }
    if (sRem > 20000) { salaryTax += (sRem - 20000) * 0.28; sRem = 20000; }
    if (sRem > 10000) { salaryTax += (sRem - 10000) * 0.22; sRem = 10000; }
    if (sRem > 0) { salaryTax += sRem * 0.09; }
    
    let salaryDiscount = 777;
    if (children === 1) salaryDiscount = 810;
    if (children === 2) salaryDiscount = 900;
    if (children === 3) salaryDiscount = 1120;
    if (children >= 4) salaryDiscount = 1340;
    if (annualGrossSalary > 12000) {
      const sReduction = Math.floor((annualGrossSalary - 12000) / 1000) * 20;
      salaryDiscount = Math.max(0, salaryDiscount - sReduction);
    }
    const withheldTax = Math.max(0, salaryTax - salaryDiscount);

    const proportionOfBusiness = totalTaxableIncome > 0 ? (taxableBusinessIncome / totalTaxableIncome) : 0;
    const baseBusinessTax = tax * proportionOfBusiness;
    const advanceTaxRate = isNewBusiness ? 0.275 : 0.55;
    const advanceTax = baseBusinessTax * advanceTaxRate;

    const userWithheldB2B = taxWithheldB2B === "" ? estimatedWithheld20 : (parseFloat(taxWithheldB2B) || 0);

    const totalTaxLiabilities = tax + advanceTax;
    const totalTaxPaid = withheldTax + userWithheldB2B;
    const balance = totalTaxLiabilities - totalTaxPaid;
    
    const isRefund = balance < 0;
    const finalAmount = Math.abs(balance);

    return {
      annualGrossSalary,
      businessNetProfit: taxableBusinessIncome,
      totalTaxableIncome,
      totalCalculatedTax: tax + withheldTax,
      withheldTax,
      advanceTax,
      userWithheldB2B,
      isRefund,
      finalAmount,
      taxDiscount
    };
  }, [taxNetSalary, taxMonths, taxChildren, isNewBusiness, yearlySummary, taxWithheldB2B, estimatedWithheld20]);

  // Live Dissection Quick Calculator (sidebar widget)
  const quickCalcResults = useMemo(() => {
    const input = parseFloat(calcInput);
    if (isNaN(input) || input <= 0) return null;

    if (calcMode === "gross") {
      const net = input / 1.24;
      const vat = input - net;
      return { gross: input, net, vat };
    } else {
      const vat = input * 0.24;
      const gross = input + vat;
      return { gross, net: input, vat };
    }
  }, [calcInput, calcMode]);

  // Filtered List of Transactions (bottom ledger)
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const tYear = t.date.split("-")[0];
      if (tYear !== filterYear) return false;

      if (filterMonth !== "all") {
        const m = getMonthFromDate(t.date);
        if (m !== filterMonth) return false;
      }

      if (filterType !== "all" && t.type !== filterType) return false;

      if (searchQuery.trim()) {
        const qLower = searchQuery.toLowerCase();
        const matchesDesc = t.description.toLowerCase().includes(qLower);
        const matchesCat = t.category.toLowerCase().includes(qLower);
        const matchesAmt = t.grossAmount.toString().includes(qLower);
        if (!matchesDesc && !matchesCat && !matchesAmt) return false;
      }

      return true;
    });
  }, [transactions, filterYear, filterMonth, filterType, searchQuery]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === "TsavosGeo1987@") {
      setIsAuthenticated(true);
      setPinError(false);
      sessionStorage.setItem("admin_auth", "true");
      toast.success("Επιτυχής Είσοδος", { description: "Καλωσήρθες στο SGK Admin Portal." });
    } else {
      setPinError(true);
      toast.error("Σφάλμα Πρόσβασης", { description: "Ο κωδικός που εισάγατε είναι λανθασμένος." });
    }
  };

  if (!mounted) return null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f4f2ea] text-gray-800 font-sans antialiased flex flex-col items-center justify-center relative overflow-hidden selection:bg-[#3b5bdb]/25">
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-[#3b5bdb]/5 to-transparent pointer-events-none z-0" />
        <div className="absolute top-1/4 right-10 w-[300px] h-[300px] bg-[#3b5bdb]/3 rounded-full blur-[120px] pointer-events-none z-0" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="relative z-10 w-full max-w-sm"
        >
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200/80 p-8 rounded-3xl shadow-2xl text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center p-2.5 shadow-md mb-6">
              <img src="/sgk-logo.png" alt="SGK Logo" className="w-full h-full object-contain" />
            </div>
            
            <h1 className="text-xl font-black text-gray-900 tracking-tight flex items-center justify-center gap-2 mb-2">
              SGK <span className="text-[#3b5bdb]">ADMIN</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider italic mb-8">
              Απαιτείται Εξουσιοδότηση Πρόσβασης
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">
                  Master Password
                </label>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  className={`w-full bg-white border ${pinError ? 'border-rose-500/50' : 'border-gray-200'} rounded-xl px-4 py-3 text-gray-900 font-mono text-sm focus:border-[#3b5bdb]/50 outline-none transition-colors text-center tracking-widest`}
                  placeholder="••••••••"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-2 rounded-xl font-black text-xs italic tracking-wider transition-all bg-[#3b5bdb] hover:bg-[#2b4bba] text-slate-950 shadow-lg shadow-blue-500/10"
              >
                ΕΙΣΟΔΟΣ
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f2ea] text-gray-800 font-sans antialiased pb-20 selection:bg-[#3b5bdb]/25">
      
      {/* BACKGROUND GLOW EFFECTS */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-[#3b5bdb]/5 to-transparent pointer-events-none z-0" />
      <div className="absolute top-1/4 right-10 w-[300px] h-[300px] bg-[#3b5bdb]/3 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-2/3 left-10 w-[350px] h-[350px] bg-[#f43f5e]/3 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* HEADER SECTION */}
      <header className="relative z-10 border-b border-gray-200/80 bg-gray-50/70 backdrop-blur-md sticky top-0 shadow-lg no-print">
        <div className="max-w-7xl mx-auto px-6 h-[85px] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center p-1.5 shadow-md">
              <img src="/sgk-logo.png" alt="SGK Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                SGK SYSTEM PORTAL <span className="text-[10px] bg-blue-500/10 border border-blue-500/20 text-[#3b5bdb] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">TAX & VAT</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider italic">Διαχείριση ΦΠΑ & Παρακράτησης 20%</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Year Selector */}
            <div className="flex items-center bg-gray-100/90 border border-gray-200 rounded-xl px-3 py-1.5 shadow-sm">
              <Calendar className="w-4 h-4 text-slate-500 mr-2" />
              <select 
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="bg-transparent text-sm font-bold text-gray-900 outline-none cursor-pointer"
              >
                <option value="2026" className="bg-white">Έτος 2026</option>
                <option value="2025" className="bg-white">Έτος 2025</option>
                <option value="2027" className="bg-white">Έτος 2027</option>
              </select>
            </div>

            {/* Export JSON */}
            <button 
              onClick={handleExportJSON}
              className="p-2.5 bg-gray-100 border border-gray-200 hover:border-slate-700 hover:text-gray-900 rounded-xl transition-all flex items-center gap-2 text-xs font-bold shadow-sm"
              title="Εξαγωγή Ledger σε αρχείο JSON"
            >
              <Download className="w-4 h-4 text-gray-600" />
              <span className="hidden md:inline">Εξαγωγή</span>
            </button>

            {/* Import JSON */}
            <label className="p-2.5 bg-gray-100 border border-gray-200 hover:border-slate-700 hover:text-gray-900 rounded-xl transition-all flex items-center gap-2 text-xs font-bold cursor-pointer shadow-sm">
              <Upload className="w-4 h-4 text-gray-600" />
              <span className="hidden md:inline">Εισαγωγή</span>
              <input 
                type="file" 
                accept=".json" 
                onChange={handleImportJSON} 
                className="hidden" 
              />
            </label>
          </div>
        </div>
      </header>

      {/* PORTAL NAVIGATION TABS */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 mt-8">
        <div className="flex bg-white/70 border border-gray-200 p-1.5 rounded-2xl gap-2 w-full md:w-fit backdrop-blur-md">
          <button
            onClick={() => setActivePortalTab("ledger")}
            className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-xs font-black uppercase italic tracking-wider transition-all flex items-center justify-center gap-2 ${
              activePortalTab === "ledger"
                ? "bg-[#3b5bdb] text-[#030712] shadow-lg shadow-blue-500/10"
                : "text-gray-600 hover:text-slate-200"
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Φορολογικό Ledger & ΦΠΑ
          </button>
          <button
            onClick={() => setActivePortalTab("aade")}
            className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-xs font-black uppercase italic tracking-wider transition-all flex items-center justify-center gap-2 ${
              activePortalTab === "aade"
                ? "bg-[#3b5bdb] text-[#030712] shadow-lg shadow-blue-500/10"
                : "text-gray-600 hover:text-slate-200"
            }`}
          >
            <Calculator className="w-4 h-4" />
            Πρότυπο Τιμολογίου
          </button>
          <button
            onClick={() => setActivePortalTab("tax")}
            className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-xs font-black uppercase italic tracking-wider transition-all flex items-center justify-center gap-2 ${
              activePortalTab === "tax"
                ? "bg-[#3b5bdb] text-[#030712] shadow-lg shadow-blue-500/10"
                : "text-gray-600 hover:text-slate-200"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Εκτίμηση Φόρου (Παράλληλη)
          </button>
          <button
            onClick={() => setActivePortalTab("emails")}
            className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-xs font-black uppercase italic tracking-wider transition-all flex items-center justify-center gap-2 ${
              activePortalTab === "emails"
                ? "bg-[#3b5bdb] text-[#030712] shadow-lg shadow-blue-500/10"
                : "text-gray-600 hover:text-slate-200"
            }`}
          >
            <Mail className="w-4 h-4" />
            Email Leads
          </button>
          <button
            onClick={() => setActivePortalTab("scraper")}
            className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-xs font-black uppercase italic tracking-wider transition-all flex items-center justify-center gap-2 ${
              activePortalTab === "scraper"
                ? "bg-[#3b5bdb] text-[#030712] shadow-lg shadow-blue-500/10"
                : "text-gray-600 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Prospect Scraper
          </button>
          <button
            onClick={() => setActivePortalTab("tracking")}
            className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-xs font-black uppercase italic tracking-wider transition-all flex items-center justify-center gap-2 ${
              activePortalTab === "tracking"
                ? "bg-[#3b5bdb] text-[#030712] shadow-lg shadow-blue-500/10"
                : "text-gray-600 hover:text-slate-200"
            }`}
          >
            <Activity className="w-4 h-4" />
            Traffic & AI
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* --- TAB 1: LEDGER PORTAL --- */}
        {activePortalTab === "ledger" && (
          <motion.div
            key="ledger-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            <main className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* LEFT COLUMN: STATS AND QUARTERS */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* YEAR SUMMARY STATS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Total Income */}
                  <div className="bg-white/60 backdrop-blur-xl border border-gray-200 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-12 h-12 text-emerald-500" />
                    </div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Συνολικά Έσοδα ({filterYear})</p>
                    <h3 className="text-3xl font-black text-[#2b4bba] mt-2 italic">
                      {yearlySummary.incomeGross.toLocaleString("el-GR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€
                    </h3>
                    <div className="flex justify-between items-center mt-4 text-xs font-semibold text-gray-600 border-t border-gray-200 pt-3">
                      <span>Καθαρά: {yearlySummary.incomeNet.toLocaleString("el-GR", { maximumFractionDigits: 2 })}€</span>
                      <span className="text-emerald-500/80">ΦΠΑ (+): {yearlySummary.incomeVat.toLocaleString("el-GR", { maximumFractionDigits: 2 })}€</span>
                    </div>
                  </div>

                  {/* Total Expenses */}
                  <div className="bg-white/60 backdrop-blur-xl border border-gray-200 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                      <TrendingDown className="w-12 h-12 text-rose-500" />
                    </div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Συνολικά Έξοδα ({filterYear})</p>
                    <h3 className="text-3xl font-black text-rose-400 mt-2 italic">
                      {yearlySummary.expenseGross.toLocaleString("el-GR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€
                    </h3>
                    <div className="flex justify-between items-center mt-4 text-xs font-semibold text-gray-600 border-t border-gray-200 pt-3">
                      <span>Καθαρά: {yearlySummary.expenseNet.toLocaleString("el-GR", { maximumFractionDigits: 2 })}€</span>
                      <span className="text-rose-500/80">ΦΠΑ (-): {yearlySummary.expenseVat.toLocaleString("el-GR", { maximumFractionDigits: 2 })}€</span>
                    </div>
                  </div>

                  {/* VAT Balance */}
                  <div className="bg-white/60 backdrop-blur-xl border border-gray-200 p-6 rounded-2xl relative overflow-hidden group border-b-4 border-b-emerald-500/30">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Coins className="w-12 h-12 text-amber-500" />
                    </div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Υπόλοιπο ΦΠΑ {filterYear}</p>
                    <h3 className={`text-3xl font-black mt-2 italic ${
                      yearlySummary.netVatPayable >= 0 ? "text-amber-400" : "text-[#2b4bba]"
                    }`}>
                      {Math.abs(yearlySummary.netVatPayable).toLocaleString("el-GR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€
                    </h3>
                    <div className="flex justify-between items-center mt-4 text-xs font-bold border-t border-gray-200/60 pt-3">
                      <span className="text-gray-600">Κατάσταση Έτους:</span>
                      {yearlySummary.netVatPayable >= 0 ? (
                        <span className="text-amber-500 flex items-center gap-1 font-black">Προς Πληρωμή <AlertTriangle className="w-3.5 h-3.5" /></span>
                      ) : (
                        <span className="text-[#2b4bba] flex items-center gap-1 font-black">Πιστωτικό Υπόλοιπο <CheckCircle2 className="w-3.5 h-3.5" /></span>
                      )}
                    </div>

                    {/* Dynamic VAT deadline countdown */}
                    {yearlySummary.netVatPayable >= 0 && nextDeadline && (
                      <div className="mt-4 pt-3 border-t border-gray-200/60 text-[10px] font-bold text-gray-600 flex flex-col gap-1.5 animate-in slide-in-from-bottom-2 duration-300">
                        <div className="flex justify-between items-center">
                          <span>Επόμενη Πληρωμή ΦΠΑ:</span>
                          <span className="text-amber-400 font-extrabold uppercase tracking-wider">{nextDeadline.name}</span>
                        </div>
                        <div className="flex justify-between items-center bg-amber-500/5 border border-amber-500/10 p-2 rounded-xl text-amber-500">
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-amber-500" /> Προθεσμία:</span>
                          <span className="font-mono text-[10px]">{nextDeadline.formattedDate}</span>
                        </div>
                        <div className="flex justify-between items-center bg-[#3b5bdb]/5 border border-[#3b5bdb]/10 p-2 rounded-xl text-[#3b5bdb]">
                          <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-[#3b5bdb]" /> Υπολείπονται:</span>
                          <span className="font-extrabold text-[10px]">{nextDeadline.daysLeft} ημέρες</span>
                        </div>
                      </div>
                    )}
                    {yearlySummary.netVatPayable < 0 && (
                      <div className="mt-4 pt-3 border-t border-gray-200/60 text-[10px] font-bold text-[#2b4bba] flex items-center gap-1.5 animate-in slide-in-from-bottom-2 duration-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Δεν εκκρεμεί πληρωμή ΦΠΑ για το έτος.</span>
                      </div>
                    )}
                  </div>

                </div>

                {/* QUARTERLY DETAILS CARD DECK */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-black text-gray-900 tracking-wide uppercase italic flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4 text-emerald-500" />
                      Μηνιαια Αναλυση ΦΠΑ & Συμψηφισμος
                    </h2>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase italic">Αυτόματος Συμψηφισμός Εσόδων - Εξόδων</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {MONTHS.map((m) => {
                      const stat = monthlyStats[m];
                      const netPayable = stat.incomeVat - stat.expenseVat;
                      const isCredit = netPayable < 0;
                      const paidAmt = paidMonths[`${filterYear}_${m}`] || 0;
                      const isFullyPaid = paidAmt >= netPayable && netPayable > 0;
                      const isPartiallyPaid = paidAmt > 0 && paidAmt < netPayable;
                      // Support legacy boolean logic temporarily by checking if paidAmt === 1 when netPayable > 1
                      const isLegacyPaid = paidAmt === 1 && netPayable > 1;
                      const isPaid = isFullyPaid || isLegacyPaid;

                      return (
                        <div 
                          key={m}
                          className={`${isPaid ? "bg-emerald-50/50 border-emerald-200/80" : isPartiallyPaid ? "bg-amber-50/50 border-amber-200/80" : "bg-white/80 border-gray-200/80"} backdrop-blur-md border p-6 rounded-2xl hover:border-gray-300 transition-all flex flex-col justify-between relative overflow-hidden`}
                        >
                          {isPaid && (
                            <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
                              <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                            </div>
                          )}
                          <div className="relative z-10">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                              <span className="text-sm font-black text-gray-900 italic flex items-center gap-2">
                                {getMonthName(m)}
                                {isPaid && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                              </span>
                              <div className="flex items-center gap-2">
                                {netPayable > 0 && (
                                  <div className="flex items-center gap-1.5 bg-white border border-gray-200 px-2 py-1 rounded shadow-sm hover:bg-gray-50 transition-colors">
                                    <span className="text-[9px] font-black uppercase text-gray-600">ΠΛΗΡΩΜΗ:</span>
                                    <input 
                                      type="number" 
                                      value={paidAmt || ""}
                                      placeholder="0"
                                      onChange={(e) => updateMonthPaid(filterYear, m, parseFloat(e.target.value) || 0)}
                                      className="w-16 bg-transparent border-b border-gray-300 focus:border-[#3b5bdb] text-[10px] font-bold text-gray-800 outline-none text-right"
                                    />
                                    <span className="text-[10px] font-bold text-gray-500">€</span>
                                  </div>
                                )}
                                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                  isPaid ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                                  isPartiallyPaid ? "bg-amber-100 text-amber-700 border-amber-200" :
                                  isCredit ? "bg-blue-500/10 text-[#2b4bba] border border-blue-500/20" : 
                                  netPayable === 0 ? "bg-gray-100 text-gray-600" :
                                  "bg-rose-50 text-rose-500 border border-rose-200"
                                }`}>
                                  {isPaid ? "ΕΞΟΦΛΗΜΕΝΟ" : isPartiallyPaid ? "ΕΝΑΝΤΙ" : isCredit ? "Πιστωτικό" : netPayable === 0 ? "Μηδενικό" : "Προς Πληρωμή"}
                                </span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              {/* Income row */}
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-600 flex items-center gap-1 font-semibold"><TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Έσοδα με ΦΠΑ</span>
                                <span className="font-bold text-slate-800">{stat.incomeGross.toLocaleString("el-GR", { maximumFractionDigits: 2 })}€</span>
                              </div>
                              <div className="flex justify-between items-center text-[10px] pl-4 text-slate-500">
                                <span>ΦΠΑ Εκροών (24%)</span>
                                <span>+{stat.incomeVat.toLocaleString("el-GR", { maximumFractionDigits: 2 })}€</span>
                              </div>

                              {/* Expense row */}
                              <div className="flex justify-between items-center text-xs mt-3">
                                <span className="text-gray-600 flex items-center gap-1 font-semibold"><TrendingDown className="w-3.5 h-3.5 text-rose-500" /> Έξοδα με ΦΠΑ</span>
                                <span className="font-bold text-slate-800">{stat.expenseGross.toLocaleString("el-GR", { maximumFractionDigits: 2 })}€</span>
                              </div>
                              <div className="flex justify-between items-center text-[10px] pl-4 text-slate-500">
                                <span>ΦΠΑ Εισροών (24%)</span>
                                <span>-{stat.expenseVat.toLocaleString("el-GR", { maximumFractionDigits: 2 })}€</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Καθαρος ΦΠΑ Μηνα</span>
                              <span className={`text-lg font-black italic ${
                                isCredit ? "text-[#2b4bba]" : netPayable === 0 ? "text-gray-600" : "text-slate-800"
                              }`}>
                                {isCredit ? "-" : ""}{Math.abs(netPayable).toLocaleString("el-GR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€
                              </span>
                            </div>
                            
                            {paidAmt > 0 && !isCredit && (
                              <>
                                <div className="flex items-center justify-between text-emerald-600">
                                  <span className="text-[10px] font-black uppercase tracking-widest italic">ΕΝΑΝΤΙ / ΠΛΗΡΩΘΗΚΕ</span>
                                  <span className="text-sm font-black italic">-{paidAmt.toLocaleString("el-GR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€</span>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">ΥΠΟΛΟΙΠΟ</span>
                                  <span className={`text-lg font-black italic ${
                                    (netPayable - paidAmt) > 0 ? "text-amber-500" : "text-emerald-500"
                                  }`}>
                                    {Math.max(0, netPayable - paidAmt).toLocaleString("el-GR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: FORM & SIDE CALCULATOR */}
              <div className="lg:col-span-4 space-y-8">
                
                {/* QUICK TRANSACTION ENTRY FORM */}
                <div className="bg-white/80 backdrop-blur-xl border border-gray-200/80 p-6 rounded-2xl shadow-xl">
                  <h3 className="text-sm font-black text-gray-900 italic tracking-wide uppercase mb-4 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-emerald-500" />
                    Καταχωρηση Τιμολογιου
                  </h3>

                  <form onSubmit={handleAddTransaction} className="space-y-4">
                    {/* Type Switch */}
                    <div className="grid grid-cols-2 gap-2 bg-white p-1.5 rounded-xl border border-gray-200/50">
                      <button
                        type="button"
                        onClick={() => setTxType("income")}
                        className={`py-2 rounded-lg font-bold text-xs italic tracking-tight transition-all flex items-center justify-center gap-1.5 ${
                          txType === "income" 
                            ? "bg-blue-500/10 text-[#2b4bba] border border-blue-500/20" 
                            : "text-slate-500 hover:text-gray-800"
                        }`}
                      >
                        <TrendingUp className="w-3.5 h-3.5" />
                        Έσοδο
                      </button>
                      <button
                        type="button"
                        onClick={() => setTxType("expense")}
                        className={`py-2 rounded-lg font-bold text-xs italic tracking-tight transition-all flex items-center justify-center gap-1.5 ${
                          txType === "expense" 
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" 
                            : "text-slate-500 hover:text-gray-800"
                        }`}
                      >
                        <TrendingDown className="w-3.5 h-3.5" />
                        Έξοδο
                      </button>
                    </div>

                    {/* Zero VAT Toggle */}
                    <label className="flex items-center gap-2 cursor-pointer bg-white p-3 rounded-xl border border-gray-200/50 hover:bg-gray-100 transition-colors group">
                      <input 
                        type="checkbox" 
                        checked={isZeroVat}
                        onChange={(e) => setIsZeroVat(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-700 bg-gray-100 text-[#3b5bdb] focus:ring-[#3b5bdb] focus:ring-offset-slate-950 cursor-pointer accent-[#3b5bdb]"
                      />
                      <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider group-hover:text-gray-800 transition-colors">Τιμολογιο Χωρις ΦΠΑ (π.χ. Ενδοκοινοτικη 0%)</span>
                    </label>

                    {/* Amount field (Gross) */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ποσο Τιμολογιου με ΦΠΑ (24%)</label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="π.χ. 1240"
                          value={grossAmount}
                          onChange={(e) => setGrossAmount(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-mono text-sm focus:border-[#3b5bdb]/50 outline-none pr-10 transition-colors"
                          required
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 font-mono">€</span>
                      </div>
                      {grossAmount && parseFloat(grossAmount) > 0 && (
                        <div className="bg-white p-3 rounded-lg border border-gray-200 text-[10px] font-bold space-y-1 mt-2 text-slate-500 animate-in fade-in">
                          <div className="flex justify-between">
                            <span>Καθαρή Αξία:</span>
                            <span className="text-gray-800 font-mono">{isZeroVat ? parseFloat(grossAmount).toFixed(2) : (parseFloat(grossAmount) / 1.24).toFixed(2)}€</span>
                          </div>
                          <div className="flex justify-between">
                            <span>ΦΠΑ {isZeroVat ? '0%' : '24%'}:</span>
                            <span className="text-emerald-500/80 font-mono">{isZeroVat ? '0.00' : (parseFloat(grossAmount) - (parseFloat(grossAmount) / 1.24)).toFixed(2)}€</span>
                          </div>
                          {txType === "expense" && (
                            <div className="flex justify-between border-t border-gray-200/80 pt-1.5 mt-1.5">
                              <span className="text-[#2b4bba]">Μείωση Φόρου Εισοδήματος (22%):</span>
                              <span className="text-[#2b4bba] font-mono">
                                {(isZeroVat ? parseFloat(grossAmount) * 0.22 : (parseFloat(grossAmount) / 1.24) * 0.22).toFixed(2)}€
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Date field */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ημερομηνια Τιμολογιου</label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-mono text-sm focus:border-[#3b5bdb]/50 outline-none transition-colors"
                        required
                      />
                    </div>

                    {/* Category */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Κατηγορια</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-3 text-gray-900 text-xs font-semibold focus:border-[#3b5bdb]/50 outline-none cursor-pointer transition-colors"
                      >
                        {CATEGORIES[txType].map((cat) => (
                          <option key={cat} value={cat} className="bg-white">
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Περιγραφη / Πελατης</label>
                      <input
                        type="text"
                        placeholder="π.χ. Υπηρεσίες Μαΐου - SGK"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-xs font-semibold focus:border-[#3b5bdb]/50 outline-none transition-colors"
                        required
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className={`w-full py-3 rounded-xl font-black text-xs italic tracking-wider transition-all flex items-center justify-center gap-2 ${
                        txType === "income" 
                          ? "bg-[#3b5bdb] hover:bg-[#2b4bba] text-slate-950 shadow-lg shadow-blue-500/10" 
                          : "bg-rose-500 hover:bg-rose-400 text-gray-900 shadow-lg shadow-rose-500/10"
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                      ΚΑΤΑΧΩΡΗΣΗ ΤΙΜΟΛΟΓΙΟΥ
                    </button>
                  </form>
                </div>

                {/* SIDE LIVE QUICK CONVERTER WIDGET */}
                <div className="bg-white/80 backdrop-blur-xl border border-gray-200/80 p-6 rounded-2xl shadow-xl animate-fade-in">
                  <h3 className="text-sm font-black text-gray-900 italic tracking-wide uppercase mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Γρηγορο Κομπιουτερακι ΦΠΑ
                  </h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-4">Μετατροπή με ΦΠΑ 24% σε κλάσματα δευτερολέπτου</p>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 bg-white p-1 rounded-lg border border-gray-200 text-[10px] font-bold">
                      <button
                        onClick={() => setCalcMode("gross")}
                        className={`py-1.5 rounded transition-all ${
                          calcMode === "gross" ? "bg-slate-850 text-gray-900 border border-slate-700/50" : "text-slate-500 hover:text-gray-800"
                        }`}
                      >
                        Από Με ΦΠΑ (Gross)
                      </button>
                      <button
                        onClick={() => setCalcMode("net")}
                        className={`py-1.5 rounded transition-all ${
                          calcMode === "net" ? "bg-slate-850 text-gray-900 border border-slate-700/50" : "text-slate-500 hover:text-gray-800"
                        }`}
                      >
                        Από Προ ΦΠΑ (Net)
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        type="number"
                        placeholder="Εισαγωγή Ποσού..."
                        value={calcInput}
                        onChange={(e) => setCalcInput(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 font-mono text-xs focus:border-[#3b5bdb]/50 outline-none pr-8 transition-colors"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-600 font-mono">€</span>
                    </div>

                    <AnimatePresence>
                      {quickCalcResults && (
                        <motion.div 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="bg-white/80 p-3 rounded-xl border border-gray-200 text-[11px] font-bold space-y-2 mt-2"
                        >
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-semibold">Ποσό προ ΦΠΑ (Καθαρό):</span>
                            <span className="text-gray-900 font-mono">{quickCalcResults.net.toFixed(2)}€</span>
                          </div>
                          <div className="flex justify-between border-t border-gray-200 pt-2">
                            <span className="text-slate-500 font-semibold">Καθαρός ΦΠΑ 24%:</span>
                            <span className="text-[#3b5bdb] font-mono">+{quickCalcResults.vat.toFixed(2)}€</span>
                          </div>
                          <div className="flex justify-between border-t border-gray-200 pt-2">
                            <span className="text-slate-500 font-semibold">Συνολικό Ποσό με ΦΠΑ:</span>
                            <span className="text-amber-400 font-mono">{quickCalcResults.gross.toFixed(2)}€</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

              </div>

            </main>

            {/* LOWER SECTION: LEDGER AND TRANSACTIONS HISTORY */}
            <section className="max-w-7xl mx-auto px-6 mt-12">
              <div className="bg-white/70 backdrop-blur-xl border border-gray-200/80 rounded-2xl overflow-hidden shadow-2xl">
                
                {/* LEDGER HEADER & FILTER CONTROLS */}
                <div className="p-6 md:p-8 border-b border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-gray-50/60">
                  <div>
                    <h2 className="text-md font-black text-gray-900 tracking-wide uppercase italic flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                      Ιστορικο Τιμολογιων
                    </h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Καταγραφές ΦΠΑ και Συμψηφισμοί</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    
                    {/* Search */}
                    <div className="relative w-full md:w-[200px]">
                      <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Αναζήτηση..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-gray-900 focus:border-[#3b5bdb]/50 outline-none transition-colors"
                      />
                    </div>

                    {/* Type Filter */}
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value as any)}
                      className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 outline-none cursor-pointer"
                    >
                      <option value="all">Όλοι οι Τύποι</option>
                      <option value="income">Μόνο Έσοδα</option>
                      <option value="expense">Μόνο Έξοδα</option>
                    </select>

                    {/* Quarter Filter */}
                    <select
                      value={filterMonth}
                      onChange={(e) => setFilterMonth(e.target.value as any)}
                      className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 outline-none cursor-pointer"
                    >
                      <option value="all">Όλοι οι Μήνες</option>
                      {MONTHS.map(m => (
                        <option key={m} value={m}>{getMonthName(m)}</option>
                      ))}
                    </select>

                    {/* Reset/Clear All */}
                    {transactions.length > 0 && (
                      <button
                        onClick={handleClearAll}
                        className="p-2 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500 hover:text-gray-900 rounded-xl text-rose-400 transition-all text-xs font-bold flex items-center gap-1.5 shadow-sm"
                        title="Διαγραφή όλων των τιμολογίων"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden lg:inline">Καθαρισμός</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* TRANSACTIONS TABLE */}
                <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/80 border-b border-gray-200 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                        <th className="px-6 py-4">Ημερομηνια</th>
                        <th className="px-6 py-4">Μηνας</th>
                        <th className="px-6 py-4">Τυπος</th>
                        <th className="px-6 py-4">Περιγραφη / Πελατης</th>
                        <th className="px-6 py-4">Κατηγορια</th>
                        <th className="px-6 py-4 text-right">Καθαρη Αξια (Net)</th>
                        <th className="px-6 py-4 text-right">ΦΠΑ 24% (VAT)</th>
                        <th className="px-6 py-4 text-right">Συνολο με ΦΠΑ</th>
                        <th className="px-6 py-4 text-center">Ενέργειες</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850/50">
                      {filteredTransactions.map((t) => {
                        const m = getMonthFromDate(t.date);
                        return (
                          <tr 
                            key={t.id}
                            className="hover:bg-gray-100/40 transition-colors font-bold text-xs text-gray-800 italic"
                          >
                            <td className="px-6 py-4 font-mono text-[11px] text-gray-600">
                              {new Date(t.date).toLocaleDateString('el-GR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                            </td>
                            <td className="px-6 py-4 text-gray-600">{getMonthName(m)}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                t.type === "income" 
                                  ? "bg-blue-500/10 text-[#2b4bba] border border-blue-500/20" 
                                  : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              }`}>
                                {t.type === "income" ? "Έσοδο" : "Έξοδο"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-900 not-italic">{t.description}</td>
                            <td className="px-6 py-4 text-gray-600">{t.category}</td>
                            <td className="px-6 py-4 text-right font-mono text-[11px] text-gray-600">{t.netAmount.toLocaleString("el-GR", { minimumFractionDigits: 2 })}€</td>
                            <td className={`px-6 py-4 text-right font-mono text-[11px] ${t.type === "income" ? "text-[#2b4bba]/80" : "text-rose-400/80"}`}>
                              {t.type === "income" ? "+" : "-"}{t.vatAmount.toLocaleString("el-GR", { minimumFractionDigits: 2 })}€
                            </td>
                            <td className="px-6 py-4 text-right font-mono text-gray-900">{t.grossAmount.toLocaleString("el-GR", { minimumFractionDigits: 2 })}€</td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => handleDeleteTransaction(t.id)}
                                className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all animate-in fade-in"
                                title="Διαγραφή καταγραφής"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}

                      {filteredTransactions.length === 0 && (
                        <tr>
                          <td colSpan={9} className="h-32 text-center text-slate-600 font-black italic uppercase text-xs">
                            Δεν βρέθηκαν καταχωρημένα τιμολόγια
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            </section>
          </motion.div>
        )}

        {/* --- TAB 2: AADE TEMPLATE & TECHNICAL OFFER PORTAL (2 Pages) --- */}
        {activePortalTab === "aade" && (
          <motion.div
            key="aade-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 max-w-7xl mx-auto px-6 mt-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN: EDITORS AND CONTROL PANEL (5 cols) */}
              <div className="lg:col-span-5 space-y-6 no-print">
                
                {/* FINANCIAL FORM WIDGET */}
                <div className="bg-white/80 backdrop-blur-xl border border-gray-200/80 p-6 rounded-2xl shadow-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Calculator className="w-5 h-5 text-[#3b5bdb]" />
                    <h3 className="text-md font-black text-gray-900 italic tracking-wide uppercase">
                      Υπολογιστής & Στοιχεία
                    </h3>
                  </div>
                  <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider mb-6">
                    Ορίστε το επιθυμητό πληρωτέο ή την καθαρή αξία και συμπληρώστε τα στοιχεία του πελάτη.
                  </p>

                  <div className="space-y-4">
                    {/* Mode selector */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Τυπος Εισαγωγης Ποσου</label>
                      <div className="grid grid-cols-2 gap-2 bg-white p-1.5 rounded-xl border border-gray-200">
                        <button
                          onClick={() => setAadeInputMode("payable")}
                          className={`py-2 rounded-lg font-bold text-xs italic tracking-tight transition-all ${
                            aadeInputMode === "payable" 
                              ? "bg-blue-500/10 text-[#2b4bba] border border-blue-500/20" 
                              : "text-slate-500 hover:text-gray-800"
                          }`}
                        >
                          Επιθυμητό Πληρωτέο (Bank)
                        </button>
                        <button
                          onClick={() => setAadeInputMode("net")}
                          className={`py-2 rounded-lg font-bold text-xs italic tracking-tight transition-all ${
                            aadeInputMode === "net" 
                              ? "bg-[#3b5bdb]/10 text-[#2b4bba] border border-[#3b5bdb]/20" 
                              : "text-slate-500 hover:text-gray-800"
                          }`}
                        >
                          Καθαρή Αξία (Net)
                        </button>
                      </div>
                    </div>

                    {/* Desired Amount input */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        {aadeInputMode === "payable" 
                          ? "Ποσό που θέλω να μπει στην τράπεζα (Πληρωτέο)" 
                          : "Καθαρό Ποσό Τιμολογίου (προ ΦΠΑ)"}
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={aadeInputVal}
                          onChange={(e) => setAadeInputVal(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-mono text-sm focus:border-[#3b5bdb]/50 outline-none transition-colors"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 font-mono">€</span>
                      </div>
                    </div>


                    {/* Document details */}
                    <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Αριθμος Τιμολογιου (Α.Α.)</label>
                        <input
                          type="text"
                          value={aadeDocNo}
                          onChange={(e) => setAadeDocNo(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 font-mono text-xs focus:border-[#3b5bdb]/50 outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ημερομηνια</label>
                        <input
                          type="date"
                          value={aadeDate}
                          onChange={(e) => setAadeDate(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 font-mono text-xs focus:border-[#3b5bdb]/50 outline-none"
                        />
                      </div>
                    </div>

                    {/* Client Info form */}
                    <div className="space-y-3 border-t border-gray-200 pt-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Επωνυμια Πελατη</label>
                        <input
                          type="text"
                          value={aadeClientName}
                          onChange={(e) => setAadeClientName(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 text-xs font-semibold focus:border-[#3b5bdb]/50 outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Α.Φ.Μ. Πελατη</label>
                        <input
                          type="text"
                          value={aadeClientAfm}
                          onChange={(e) => setAadeClientAfm(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 font-mono text-xs focus:border-[#3b5bdb]/50 outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Διευθυνση Πελατη</label>
                        <input
                          type="text"
                          value={aadeClientAddress}
                          onChange={(e) => setAadeClientAddress(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 text-xs font-semibold focus:border-[#3b5bdb]/50 outline-none"
                        />
                      </div>
                    </div>

                    {/* Auto Addition to Ledger Button */}
                    <div className="pt-3 border-t border-gray-200">
                      <button
                        onClick={handleAddAadeInvoiceToLedger}
                        className="w-full py-3 bg-[#3b5bdb] hover:bg-[#2b4bba] text-slate-950 rounded-xl font-black text-xs italic tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10"
                      >
                        <Plus className="w-4.5 h-4.5" />
                        ΚΑΤΑΧΩΡΗΣΗ ΣΤΟ LEDGER ΕΣΟΔΩΝ
                      </button>
                    </div>

                  </div>
                </div>

                {/* TECHNICAL SCOPE / SERVICES EDITOR FOR PAGE 2 */}
                <div className="bg-white/80 backdrop-blur-xl border border-gray-200/80 p-6 rounded-2xl shadow-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Briefcase className="w-5 h-5 text-[#3b5bdb]" />
                    <h3 className="text-md font-black text-gray-900 italic tracking-wide uppercase">
                      Ανάλυση Υπηρεσιών Προσφοράς
                    </h3>
                  </div>
                  <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider mb-6">
                    Προσθέστε ή τροποποιήστε τις αναλυτικές υπηρεσίες που θα εμφανίζονται στη Σελίδα 2 της προσφοράς σας.
                  </p>

                  {/* Presets Quick Selection */}
                  <div className="bg-white/60 p-4 rounded-xl border border-gray-200 mb-4 text-left">
                    <span className="text-[9px] font-black text-[#3b5bdb] uppercase tracking-wider block mb-2.5">Γρήγορα Πρότυπα Υπηρεσιών (Presets)</span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleLoadPreset("eshop")}
                        className="px-2 py-1 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded text-[9px] font-black text-[#3b5bdb] transition-all flex items-center gap-1 cursor-pointer"
                      >
                        🛍️ Eshop
                      </button>
                      <button
                        type="button"
                        onClick={() => handleLoadPreset("webapp")}
                        className="px-2 py-1 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded text-[9px] font-black text-blue-400 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        💻 Web App
                      </button>
                      <button
                        type="button"
                        onClick={() => handleLoadPreset("hosting")}
                        className="px-2 py-1 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded text-[9px] font-black text-purple-400 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        ☁️ Hosting
                      </button>
                      <button
                        type="button"
                        onClick={() => handleLoadPreset("ai")}
                        className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded text-[9px] font-black text-amber-400 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        🤖 AI Agent
                      </button>
                      <button
                        type="button"
                        onClick={() => handleLoadPreset("consulting")}
                        className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded text-[9px] font-black text-rose-400 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        💼 Consulting
                      </button>
                    </div>
                  </div>

                  {/* Add New Item Form */}
                  <form onSubmit={handleAddOfferItem} className="space-y-3.5 bg-white/60 p-4 rounded-xl border border-gray-200 mb-6">
                    <span className="text-[9px] font-black text-[#3b5bdb] uppercase tracking-wider block">Προσθηκη Νεας Υπηρεσιας</span>
                    
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Τιτλος Υπηρεσιας</label>
                      <input
                        type="text"
                        placeholder="π.χ. Ανάπτυξη AI Agent"
                        value={newItemTitle}
                        onChange={(e) => setNewItemTitle(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 text-xs font-semibold focus:border-[#3b5bdb]/50 outline-none"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Τεχνικη Περιγραφη / Προδιαγραφες</label>
                      <textarea
                        rows={3}
                        placeholder="Περιγράψτε τι περιλαμβάνει η υπηρεσία..."
                        value={newItemDesc}
                        onChange={(e) => setNewItemDesc(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-800 text-[11px] font-medium focus:border-[#3b5bdb]/50 outline-none resize-none custom-scrollbar"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Χρόνος / Διάρκεια</label>
                      <input
                        type="text"
                        placeholder="π.χ. 15 εργάσιμες"
                        value={newItemDuration}
                        onChange={(e) => setNewItemDuration(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 text-xs font-semibold focus:border-[#3b5bdb]/50 outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-blue-500/10 hover:bg-[#3b5bdb] text-[#3b5bdb] hover:text-slate-950 border border-blue-500/20 rounded-lg font-black text-[10px] italic tracking-wider transition-all cursor-pointer"
                    >
                      + ΠΡΟΣΘΗΚΗ ΥΠΗΡΕΣΙΑΣ ΣΤΗΝ ΠΡΟΣΦΟΡΑ
                    </button>
                  </form>

                  {/* List of Current Items */}
                  <div className="space-y-2.5">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Τρεχουσες Υπηρεσιες ({offerItems.length})</span>
                    <div className="space-y-2 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                      {offerItems.map((item) => (
                        <div key={item.id} className="bg-white/40 border border-gray-200 rounded-lg p-2.5 flex justify-between items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <span className="block text-xs font-black text-gray-900 truncate">{item.title}</span>
                            <div className="flex items-center gap-2 mt-1">
                              {item.duration && (
                                <span className="text-[9px] text-slate-500 font-mono">⏱️ {item.duration}</span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteOfferItem(item.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Αφαίρεση"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* PIXEL-PERFECT TWO-PAGE proposal PREVIEW Mockup (7 cols) */}
              <div className="lg:col-span-7 min-w-0">
                
                {/* Print trigger on screen */}
                <div className="flex justify-end no-print">
                  <button 
                    onClick={() => window.print()}
                    className="px-6 py-3 bg-[#3b5bdb] hover:bg-[#2b4bba] text-slate-950 font-black text-xs uppercase italic tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-500/10 hover:scale-[1.02]"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Εκτυπωση & Αποθηκευση ως PDF (2 Σελιδες)</span>
                  </button>
                </div>

                {/* --- PAGE 1: AADE MOCKUP COVER SHEET --- */}
                <div className="aade-invoice-page bg-white text-[#0a1128] p-8 md:p-10 rounded-2xl shadow-2xl relative overflow-hidden font-sans border border-slate-200 select-text">
                  
                  {/* Tax Disclaimer Notice */}
                  <div className="text-[9px] text-rose-600 font-extrabold text-center bg-rose-50/50 border border-rose-200 py-2.5 px-4 rounded-xl mb-3 italic tracking-wide leading-relaxed shadow-sm">
                    ⚠️ Το παρόν δεν αποτελεί φορολογικό στοιχείο (τιμολόγιο), αλλά απεικόνιση της προσφοράς και του συμφωνηθέντος ποσού.
                  </div>

                  {/* Print trigger inside card */}
                  <div className="absolute top-12 right-10 no-print">
                    <button 
                      onClick={() => window.print()}
                      className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-lg transition-all flex items-center gap-1.5 text-[10px] font-bold"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Εκτύπωση</span>
                    </button>
                  </div>

                  {/* Seller & Logo Header */}
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

                    {/* SGK Branded Logo (Enlarged!) */}
                    <div className="flex flex-col items-end w-1/3">
                      <div className="h-16 w-auto">
                        <img src="/sgk-logo.png" alt="SGK Software Development" className="h-full w-auto object-contain" />
                      </div>
                    </div>
                  </div>

                  {/* Document Type Title banner */}
                  <div className="bg-[#0f2d59] text-gray-900 text-center py-2.5 text-xs font-black uppercase tracking-widest rounded-lg mt-3 shadow-sm">
                    Τιμολογιο Παροχης Υπηρεσιων
                  </div>

                  {/* Doc Details (Date, AA, MARK) */}
                  <div className="grid grid-cols-5 gap-2 mt-2 text-[10px] font-bold text-slate-800">
                    <div className="border border-slate-200 p-2 rounded-lg bg-slate-50/50">
                      <span className="text-[8px] text-slate-500 block uppercase mb-1">Σειρα</span>
                      <span className="text-slate-950 font-black">Α</span>
                    </div>
                    <div className="border border-slate-200 p-2 rounded-lg bg-slate-50/50">
                      <span className="text-[8px] text-slate-500 block uppercase mb-1">Α.Α.</span>
                      <span className="text-slate-950 font-black">{aadeDocNo || "1"}</span>
                    </div>
                    <div className="border border-slate-200 p-2 rounded-lg bg-slate-50/50">
                      <span className="text-[8px] text-slate-500 block uppercase mb-1">Ημερομηνια</span>
                      <span className="text-slate-950 font-black">
                        {aadeDate ? new Date(aadeDate).toLocaleDateString('el-GR') : "-"}
                      </span>
                    </div>
                    <div className="border border-slate-200 p-2 rounded-lg bg-slate-50/50 col-span-1">
                      <span className="text-[8px] text-slate-500 block uppercase mb-1">ΜΑΡΚ</span>
                      <span className="text-slate-950 font-black font-mono">4000135...</span>
                    </div>
                    <div className="border border-slate-200 p-2 rounded-lg bg-slate-50/50 col-span-1">
                      <span className="text-[8px] text-slate-500 block uppercase mb-1">Τροπος Πληρωμης</span>
                      <span className="text-slate-950 font-black truncate block font-sans">Web Banking</span>
                    </div>
                  </div>

                  {/* Customer Details Box */}
                  <div className="bg-[#f0f4f8] border border-slate-200/80 p-3 rounded-xl mt-3 space-y-1 text-[10px] text-slate-700 shadow-inner">
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">Στοιχεία Πελάτη</span>
                    <div className="flex gap-2">
                      <span className="font-black text-slate-900 w-[60px] uppercase">Α.Φ.Μ.:</span>
                      <span className="font-bold text-slate-800">{aadeClientAfm || "161578030"}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-black text-slate-900 w-[60px] uppercase">Επωνυμία:</span>
                      <span className="font-bold text-slate-800">{aadeClientName || "ΓΙΑΚΟΥΜΑΚΗ ΒΑΣΙΛΙΚΗ ΑΝΤΩΝΙΟΣ"}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-black text-slate-900 w-[60px] uppercase">Διεύθυνση:</span>
                      <span className="font-bold text-slate-800">{aadeClientAddress || "ΔΑΡΑΤΣΟ Ι ΜΥΓΙΑΚΗ 0 - ΧΑΝΙΑ 73100"}</span>
                    </div>
                  </div>

                  {/* ITEMIZED TECHNICAL SCOPE SECTION (NO PRICES) */}
                  <div className="border border-slate-200 rounded-xl p-3 mt-3 bg-slate-50/50 text-[10px] shadow-sm">
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">📋 Αναλυτική Τεχνική Προσφορά (Προδιαγραφές & Χρονοδιάγραμμα)</span>
                    <div className="space-y-2">
                      {offerItems.map((item, idx) => (
                        <div key={item.id} className="border-l-2 border-[#0f2d59] pl-3 py-0.5 space-y-0.5">
                          <div className="flex justify-between items-center">
                            <span className="font-extrabold text-[#0f2d59] text-[9.5px]">{idx + 1}. {item.title}</span>
                            {item.duration && (
                              <span className="text-[7.5px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full inline-flex items-center gap-0.5">
                                ⏱️ {item.duration}
                              </span>
                            )}
                          </div>
                          <p className="text-[8px] text-slate-500 font-medium leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Itemized Table */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden mt-3 shadow-sm">
                    <table className="w-full text-left border-collapse text-[10px]">
                      <thead>
                        <tr className="bg-[#0f2d59] text-gray-900 font-black uppercase text-[8px] tracking-wider border-b border-slate-200">
                          <th className="px-3 py-2 text-center">Α/Α</th>
                          <th className="px-3 py-2 text-center">Κωδ.</th>
                          <th className="px-4 py-2">Περιγραφή</th>
                          <th className="px-3 py-2 text-center">Ποσ.</th>
                          <th className="px-3 py-2 text-right">Τιμή (€)</th>
                          <th className="px-3 py-2 text-right">Αξία (€)</th>
                          <th className="px-3 py-2 text-center">ΦΠΑ %</th>
                          <th className="px-3 py-2 text-right">ΦΠΑ (€)</th>
                          <th className="px-4 py-2 text-right">Τελ. Αξία (€)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-900 font-bold">
                        <tr className="bg-slate-50/50">
                          <td className="px-3 py-3 text-center">1</td>
                          <td className="px-3 py-3 text-center">1</td>
                          <td className="px-4 py-3 font-extrabold leading-tight text-[#0f2d59]">
                            ΠΑΡΟΧΗ ΥΠΗΡΕΣΙΩΝ ΠΛΗΡΟΦΟΡΙΚΗΣ & ΑΝΑΠΤΥΞΗΣ ΛΟΓΙΣΜΙΚΟΥ
                          </td>
                          <td className="px-3 py-3 text-center">1</td>
                          <td className="px-3 py-3 text-right font-mono">{aadeMath.net.toLocaleString("el-GR", { minimumFractionDigits: 2 })}</td>
                          <td className="px-3 py-3 text-right font-mono">{aadeMath.net.toLocaleString("el-GR", { minimumFractionDigits: 2 })}</td>
                          <td className="px-3 py-3 text-center">24%</td>
                          <td className="px-3 py-3 text-right font-mono text-slate-600">{aadeMath.vat.toLocaleString("el-GR", { minimumFractionDigits: 2 })}</td>
                          <td className="px-4 py-3 text-right font-mono text-slate-950">{aadeMath.gross.toLocaleString("el-GR", { minimumFractionDigits: 2 })}</td>
                        </tr>
                        <tr className="bg-slate-100/70 border-t border-slate-200">
                          <td colSpan={4} className="px-4 py-2 font-black text-right uppercase text-[8px] tracking-wider text-slate-500">Σύνολα</td>
                          <td className="px-3 py-2 text-right font-mono text-gray-600">0,00</td>
                          <td className="px-3 py-2 text-right font-mono">{aadeMath.net.toLocaleString("el-GR", { minimumFractionDigits: 2 })}</td>
                          <td className="px-3 py-2"></td>
                          <td className="px-3 py-2 text-right font-mono text-slate-600">{aadeMath.vat.toLocaleString("el-GR", { minimumFractionDigits: 2 })}</td>
                          <td className="px-4 py-2 text-right font-mono text-slate-950">{aadeMath.gross.toLocaleString("el-GR", { minimumFractionDigits: 2 })}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Taxes & Withholding Totals Banner Box */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden mt-6 text-[9px] font-bold text-slate-800 shadow-sm">
                    <div className="grid grid-cols-8 bg-[#0f2d59] text-gray-900 text-[7px] tracking-widest uppercase font-black py-2.5 px-3 border-b border-slate-200 text-center">
                      <span className="col-span-1">Συνολ. Αξία</span>
                      <span className="col-span-2">(-) Παρακρατούμενοι</span>
                      <span className="col-span-1">Παρακρ. (πλφ)</span>
                      <span className="col-span-1">(-) Κρατήσεις</span>
                      <span className="col-span-1">Κρατήσεις (πλφ)</span>
                      <span className="col-span-1">(+) Ψηφιακό Τέλος</span>
                      <span className="col-span-1">(+) Λοιποί Φόροι</span>
                    </div>
                    <div className="grid grid-cols-8 py-3 px-3 text-center font-mono text-slate-900 border-b border-slate-100">
                      <span className="col-span-1">{aadeMath.gross.toLocaleString("el-GR", { minimumFractionDigits: 2 })}</span>
                      <span className={`col-span-2 font-black ${aadeMath.isWithheld ? "text-amber-600" : "text-gray-600"}`}>
                        {aadeMath.withholding.toLocaleString("el-GR", { minimumFractionDigits: 2 })}
                      </span>
                      <span className="col-span-1">0,00</span>
                      <span className="col-span-1">0,00</span>
                      <span className="col-span-1">0,00</span>
                      <span className="col-span-1">0,00</span>
                      <span className="col-span-1">0,00</span>
                    </div>

                    <div className="bg-[#e6f0fa] py-3.5 px-6 flex justify-between items-center border-t border-slate-200 shadow-inner">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#0f2d59] italic">Πληρωτεο (€):</span>
                      <span className="text-xl font-black text-[#0f2d59] font-mono tracking-tight">
                        {aadeMath.payable.toLocaleString("el-GR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* TAX WITHHOLDING DESCRIPTION (If applied) */}
                  {aadeMath.isWithheld && (
                    <div className="border border-slate-200 rounded-xl overflow-hidden mt-3 text-[10px] font-bold text-slate-800 shadow-sm">
                      <div className="grid grid-cols-3 py-2 px-4 bg-slate-50">
                        <span className="col-span-2 text-slate-500 font-black uppercase text-[8px] tracking-wider">Ανάλυση Φόρων/ Τελών / Ψηφιακών Τελών Συναλλαγής</span>
                        <span className="text-right text-slate-500 font-black uppercase text-[8px] tracking-wider pr-4">Αξία Φόρου (€)</span>
                      </div>
                      <div className="grid grid-cols-3 py-3 px-4 border-t border-slate-100 text-slate-900 font-black bg-white">
                        <span className="col-span-2 text-slate-700 text-[9px]">Παρακρατούμενοι: Περ. δ'- Αμοιβές Συμβουλών Διοίκησης - 20%</span>
                        <span className="text-right font-mono text-[#0f2d59] pr-4">{aadeMath.withholding.toLocaleString("el-GR", { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  )}

                  {/* General Terms and Agreement Box inside Page 1 */}
                  <div className="mt-3 border-t border-slate-200 pt-3 text-[8px] text-slate-500 space-y-1 font-bold">
                    <span className="block text-[7px] text-gray-600 uppercase tracking-wider font-black mb-1">Όροι Συνεργασίας & Συμφωνία</span>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                      <p>• <span className="text-slate-700">1. Χρονοδιάγραμμα:</span> Ολοκλήρωση σύμφωνα με τις προδιαγραφές.</p>
                      <p>• <span className="text-slate-700">2. Υποστήριξη:</span> Παροχή δωρεάν τεχνικής υποστήριξης 12 μηνών.</p>
                      <p>• <span className="text-slate-700">3. Ισχύς Προσφοράς:</span> 30 ημέρες από την ημερομηνία έκδοσης.</p>
                      <p>• <span className="text-slate-700">4. Νομική Ισχύς:</span> Το παρόν απεικονίζει τη συμφωνηθείσα προσφορά έργου.</p>
                    </div>
                  </div>

                  {/* QR Code footer */}
                  <div className="flex justify-between items-end mt-4 border-t-2 border-slate-100 pt-3">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 border-2 border-slate-200 rounded-lg bg-slate-50">
                        <QrCode className="w-12 h-12 text-slate-800" />
                      </div>
                    </div>
                  </div>

                </div>



              </div>

            </div>
          </motion.div>
        )}

        {/* --- TAB 3: TAX ESTIMATOR PORTAL --- */}
        {activePortalTab === "tax" && (
          <motion.div
            key="tax-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            <main className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* LEFT COLUMN: INPUTS */}
              <div className="lg:col-span-4 space-y-8">
                <div className="bg-white/80 backdrop-blur-xl border border-gray-200/80 p-6 rounded-2xl shadow-xl">
                  <h3 className="text-sm font-black text-gray-900 italic tracking-wide uppercase mb-4 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#3b5bdb]" />
                    Στοιχεια Μισθωτου
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Καθαρός Μηνιαίος Μισθός</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={taxNetSalary}
                          onChange={(e) => setTaxNetSalary(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-mono text-sm focus:border-[#3b5bdb]/50 outline-none pr-10"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">€</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Μήνες Εργασίας (έως 12)</label>
                      <input
                        type="number"
                        value={taxMonths}
                        onChange={(e) => setTaxMonths(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-mono text-sm focus:border-[#3b5bdb]/50 outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Αριθμός Τέκνων</label>
                      <select
                        value={taxChildren}
                        onChange={(e) => setTaxChildren(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-3 text-gray-900 text-xs font-semibold focus:border-[#3b5bdb]/50 outline-none"
                      >
                        <option value="0">Χωρίς Τέκνα</option>
                        <option value="1">1 Τέκνο</option>
                        <option value="2">2 Τέκνα</option>
                        <option value="3">3 Τέκνα</option>
                        <option value="4">4+ Τέκνα</option>
                      </select>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer bg-white p-3 rounded-xl border border-gray-200/50 hover:bg-gray-100 transition-colors group">
                      <input 
                        type="checkbox" 
                        checked={isNewBusiness}
                        onChange={(e) => setIsNewBusiness(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-700 bg-gray-100 text-[#3b5bdb] focus:ring-[#3b5bdb] focus:ring-offset-slate-950 cursor-pointer accent-[#3b5bdb]"
                      />
                      <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider group-hover:text-gray-800 transition-colors">Νέα Επιχείρηση (&lt; 3 ετών)</span>
                    </label>
                    {isNewBusiness && (
                      <p className="text-[10px] text-slate-500 italic px-2">Μειωμένος συντελεστής 4.5% (για εισόδημα έως 10.000€) και προκαταβολή φόρου 27.5%.</p>
                    )}

                    {/* Withholding Input */}
                    <div className="space-y-1.5 pt-4 border-t border-gray-200/80">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Φόρος 20% που Παρακρατήθηκε
                      </label>
                      <p className="text-[10px] text-slate-500 italic leading-tight pb-2">
                        Υπολογίζεται αυτόματα από τα έσοδα του Ledger (άνω των 300€). Μπορείς να το διορθώσεις αν κάποια ήταν προς ιδιώτες.
                      </p>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder={estimatedWithheld20.toFixed(2)}
                          value={taxWithheldB2B}
                          onChange={(e) => setTaxWithheldB2B(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-mono text-sm focus:border-[#3b5bdb]/50 outline-none pr-10"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">€</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: RESULTS */}
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white/80 backdrop-blur-xl border border-gray-200/80 p-6 rounded-2xl shadow-xl">
                  <h3 className="text-sm font-black text-gray-900 italic tracking-wide uppercase mb-6 flex items-center gap-2 border-b border-gray-200 pb-4">
                    <Calculator className="w-4 h-4 text-[#3b5bdb]" />
                    Αποτελεσματα Εκκαθαρισης Φορου
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Breakdown */}
                    <div className="space-y-4">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider italic mb-2">Φορολογητέο Εισόδημα</p>
                      
                      <div className="flex justify-between items-center text-xs border-b border-gray-200 pb-2">
                        <span className="text-gray-600">Μικτό Μισθωτών (Εκτίμηση):</span>
                        <span className="font-mono text-gray-800">{taxMath.annualGrossSalary.toLocaleString("el-GR", { maximumFractionDigits: 2 })}€</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs border-b border-gray-200 pb-2">
                        <span className="text-gray-600">Καθαρό Κέρδος Επιχείρησης:</span>
                        <span className="font-mono text-gray-800">{taxMath.businessNetProfit.toLocaleString("el-GR", { maximumFractionDigits: 2 })}€</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs font-bold border-b border-gray-200 pb-2">
                        <span className="text-[#2b4bba]">Σύνολο Φορολογητέου Εισοδήματος:</span>
                        <span className="font-mono text-[#2b4bba]">{taxMath.totalTaxableIncome.toLocaleString("el-GR", { maximumFractionDigits: 2 })}€</span>
                      </div>

                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider italic mt-6 mb-2">Υπολογισμός Φόρου</p>

                      <div className="flex justify-between items-center text-xs border-b border-gray-200 pb-2">
                        <span className="text-gray-600">Αρχικός Φόρος Κλίμακας:</span>
                        <span className="font-mono text-gray-800">{taxMath.totalCalculatedTax.toLocaleString("el-GR", { maximumFractionDigits: 2 })}€</span>
                      </div>

                      <div className="flex justify-between items-center text-xs border-b border-gray-200 pb-2">
                        <span className="text-gray-600">Μείον Έκπτωση Φόρου (Αφορολόγητο):</span>
                        <span className="font-mono text-[#2b4bba]">-{taxMath.taxDiscount.toLocaleString("el-GR", { maximumFractionDigits: 2 })}€</span>
                      </div>

                      <div className="flex justify-between items-center text-xs border-b border-gray-200 pb-2">
                        <span className="text-gray-600">Μείον Φόρος που Παρακρατήθηκε (Μισθός):</span>
                        <span className="font-mono text-[#2b4bba]">-{taxMath.withheldTax.toLocaleString("el-GR", { maximumFractionDigits: 2 })}€</span>
                      </div>

                      <div className="flex justify-between items-center text-xs border-b border-gray-200 pb-2">
                        <span className="text-gray-600">Συν Προκαταβολή Επόμενου Έτους ({isNewBusiness ? '27.5%' : '55%'}):</span>
                        <span className="font-mono text-rose-400">+{taxMath.advanceTax.toLocaleString("el-GR", { maximumFractionDigits: 2 })}€</span>
                      </div>

                      <div className="flex justify-between items-center text-xs border-b border-gray-200 pb-2">
                        <span className="text-gray-600">Μείον Παρακρατούμενος Φόρος 20% (από τιμολόγια):</span>
                        <span className="font-mono text-[#2b4bba]">-{taxMath.userWithheldB2B.toLocaleString("el-GR", { maximumFractionDigits: 2 })}€</span>
                      </div>

                    </div>

                    {/* Final Pay */}
                    <div className={`p-6 rounded-2xl border flex flex-col justify-center items-center text-center relative overflow-hidden group transition-colors ${taxMath.isRefund ? 'bg-[#3b5bdb]/10 border-[#3b5bdb]/30' : 'bg-white border-gray-200'}`}>
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Coins className={`w-24 h-24 ${taxMath.isRefund ? 'text-emerald-500' : 'text-rose-500'}`} />
                      </div>
                      
                      <p className={`text-[10px] font-bold uppercase tracking-wider italic ${taxMath.isRefund ? 'text-emerald-500' : 'text-slate-500'}`}>
                        {taxMath.isRefund ? 'Εκτιμωμενο Ποσο Επιστροφης Φορου' : 'Εκτιμωμενο Ποσο Πληρωμης Εφοριας'}
                      </p>
                      
                      <h3 className={`text-4xl font-black mt-4 mb-2 ${taxMath.isRefund ? 'text-[#2b4bba]' : 'text-rose-400'}`}>
                        {taxMath.finalAmount.toLocaleString("el-GR", { maximumFractionDigits: 2 })}€
                      </h3>
                      
                      <p className="text-[10px] text-gray-600">
                        Περιλαμβάνει τον φόρο εκκαθάρισης<br/>και την προκαταβολή φόρου επιχειρηματικής δραστηριότητας.
                      </p>
                      
                      <div className="mt-6 pt-4 border-t border-gray-200 w-full text-left flex items-center gap-2 text-[10px] text-emerald-500 font-bold bg-blue-500/5 p-3 rounded-xl border border-blue-500/20">
                        <CheckCircle2 className="w-6 h-6 shrink-0" />
                        Ως μισθωτός υπερκαλύπτεις την 2η ασφαλιστική κατηγορία του ΕΦΚΑ (περίπου 240€/μήνα). Επομένως, απαλλάσσεσαι πλήρως από ΕΦΚΑ για την ατομική επιχείρηση.
                      </div>
                    </div>

                  </div>
                </div>
              </div>

            </main>
          </motion.div>
        )}

        {/* --- TAB 4: EMAILS PORTAL --- */}
        {activePortalTab === "emails" && (
          <motion.div
            key="emails-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            <main className="max-w-7xl mx-auto px-6 mt-8">
              <EmailsTab />
            </main>
          </motion.div>
        )}

        {/* --- TAB 5: SCRAPER PORTAL --- */}
        {activePortalTab === "scraper" && (
          <motion.div
            key="scraper-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            <main className="max-w-7xl mx-auto px-6 mt-8">
              <ScraperTab />
            </main>
          </motion.div>
        )}

        {/* --- TAB 6: TRACKING PORTAL --- */}
        {activePortalTab === "tracking" && (
          <motion.div
            key="tracking-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            <main className="max-w-7xl mx-auto px-6 mt-8">
              <TrackingTab />
            </main>
          </motion.div>
        )}

      </AnimatePresence>

      {/* FOOTER */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-gray-200/80 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-500 font-black tracking-widest uppercase italic gap-4">
        <div className="flex gap-6 items-center">
          <span className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-[#3b5bdb] rounded-full animate-pulse" /> 
            SGK PORTAL SYSTEM: ONLINE
          </span>
          <span>PERSISTED IN LOCAL STORAGE</span>
        </div>
        <div>
          DEVELOPED BY SGK SOFTWARE DEVELOPMENT
        </div>
      </footer>

      {/* CUSTOM INTERNAL SCROLLBAR */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #030712; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #10b981; }
      `}</style>

    </div>
  );
}
