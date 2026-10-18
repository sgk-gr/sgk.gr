"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  RefreshCcw, Server, Globe, AlertTriangle, CheckCircle2, Clock, 
  Send, Search, Filter, ShieldAlert, Edit2, Check, X, ExternalLink,
  Mail, Calendar, ArrowUpRight, Play, Eye, Sparkles, Building2,
  FileCheck, AlertCircle, Phone, Info, Wallet, Coins, CreditCard, Copy
} from "lucide-react";
import { toast } from "sonner";
import { HostingReminderStage } from "@/lib/hostingRenewalsTemplates";

function parsePrice(str: string): number {
  if (!str) return 80;
  const match = str.replace(/\s+/g, "").match(/(\d+[\.,]?\d*)/);
  if (!match) return 80;
  return parseFloat(match[1].replace(",", "."));
}

interface ClientHostingItem {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  afm: string;
  gemiNumber: string;
  domainName: string;
  registrationDate: string;
  renewalDate: string;
  customExpiresAt: string | null;
  daysRemaining: number;
  isPaid: boolean;
  statusCategory: "paid" | "expired" | "critical" | "urgent" | "warning" | "active";
  renewalPrice: string;
  notes: string;
  lastStageSent: string | null;
  lastStageSentAt: string | null;
}

interface HostingStats {
  total: number;
  paid: number;
  expiringSoon: number;
  expired: number;
  active: number;
}

interface CronStatus {
  lastRunAt: string | null;
  success: boolean;
  clientsChecked: number;
  emailsSent: number;
  details: any[];
  error?: string;
}

export function HostingRenewalsTab() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<ClientHostingItem[]>([]);
  const [stats, setStats] = useState<HostingStats>({ total: 0, paid: 0, expiringSoon: 0, expired: 0, active: 0 });
  const [cronStatus, setCronStatus] = useState<CronStatus>({
    lastRunAt: null,
    success: true,
    clientsChecked: 0,
    emailsSent: 0,
    details: [],
  });

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "expiring" | "expired" | "paid" | "unpaid">("all");

  // Editing Modal / Inline
  const [editingClient, setEditingClient] = useState<ClientHostingItem | null>(null);
  const [editDomain, setEditDomain] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editNotes, setEditNotes] = useState("");

  // Cron / Action loading states
  const [runningCron, setRunningCron] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [testStage, setTestStage] = useState<HostingReminderStage>("20_days");
  const [testEmail, setTestEmail] = useState("info@sgk.gr");
  const [selectedTestClientId, setSelectedTestClientId] = useState<string>("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [adminMode, setAdminMode] = useState<"demo" | "live">("live");

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/hosting-renewals");
      const data = await res.json();
      if (data.success) {
        setClients(data.clients || []);
        setStats(data.stats || { total: 0, paid: 0, expiringSoon: 0, expired: 0, active: 0 });
        if (data.cronStatus) setCronStatus(data.cronStatus);
      } else {
        toast.error("Σφάλμα φόρτωσης: " + (data.error || "Άγνωστο"));
      }
    } catch (err: any) {
      toast.error("Αποτυχία σύνδεσης με το σύστημα: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    const savedMode = localStorage.getItem("sgk_hosting_admin_mode");
    if (savedMode === "demo" || savedMode === "live") {
      setAdminMode(savedMode);
    }
    fetchData();
  }, []);

  const toggleAdminMode = (newMode: "demo" | "live") => {
    setAdminMode(newMode);
    localStorage.setItem("sgk_hosting_admin_mode", newMode);
    toast.success(newMode === "demo"
      ? "🧪 Ενεργοποιήθηκε η Δοκιμαστική Λειτουργία (DEMO MODE)! Μπορείτε να κάνετε δοκιμαστικές πληρωμές με άμεση ενημέρωση της βάσης δεδομένων (Supabase)."
      : "🟢 Ενεργοποιήθηκε η Πραγματική Λειτουργία (LIVE MODE)! Συνδεδεμένο με Live Stripe (SGK DIGITAL) & Live Database."
    );
  };

  // Demo: Simulate Successful Payment (Updates Supabase DB +1 year and notifies)
  const handleSimulatePayment = async (client: ClientHostingItem) => {
    try {
      setActionLoadingId(client.id);
      const res = await fetch("/api/admin/hosting-renewals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "simulate_payment",
          clientId: client.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`🧪 [DEMO TEST] Η πληρωμή για ${client.companyName} καταγράφηκε επιτυχώς στη βάση δεδομένων! Νέα λήξη: ${data.newExpFormatted} (+1 έτος).`);
        fetchData();
      } else {
        toast.error("Σφάλμα δοκιμής: " + data.error);
      }
    } catch (err: any) {
      toast.error("Σφάλμα: " + err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Demo: Reset Client Back to Unpaid (3 days left) for re-testing
  const handleResetClientDemo = async (client: ClientHostingItem) => {
    try {
      setActionLoadingId(client.id);
      const res = await fetch("/api/admin/hosting-renewals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset_client_demo",
          clientId: client.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`↩️ [DEMO] Ο πελάτης ${client.companyName} επανήλθε σε εκκρεμότητα (λήξη: ${data.resetTo}) για νέες δοκιμές!`);
        fetchData();
      } else {
        toast.error("Σφάλμα: " + data.error);
      }
    } catch (err: any) {
      toast.error("Σφάλμα: " + err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Toggle Paid Status
  const handleTogglePaid = async (client: ClientHostingItem) => {
    try {
      setActionLoadingId(client.id);
      const res = await fetch("/api/admin/hosting-renewals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle_paid",
          clientId: client.id,
          paid: !client.isPaid,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(
          data.isPaid 
            ? `Ο πελάτης ${client.companyName} σημειώθηκε ως ΠΛΗΡΩΜΕΝΟΣ! Οι υπενθυμίσεις σταμάτησαν και η ανανέωση μεταφέρθηκε στο επόμενο έτος.` 
            : `Ο πελάτης ${client.companyName} σημειώθηκε ως ΣΕ ΕΚΚΡΕΜΟΤΗΤΑ.`
        );
        fetchData();
      } else {
        toast.error("Σφάλμα ενημέρωσης: " + data.error);
      }
    } catch (err: any) {
      toast.error("Σφάλμα: " + err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Quick Inline Update Price
  const handleQuickUpdatePrice = async (client: ClientHostingItem, newPrice: string) => {
    const trimmed = newPrice.trim();
    if (!trimmed || trimmed === client.renewalPrice) return;
    const formatted = trimmed.includes("ΦΠΑ") ? trimmed : `${trimmed} (συμπ. ΦΠΑ)`;
    try {
      setActionLoadingId(client.id);
      const res = await fetch("/api/admin/hosting-renewals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_client",
          clientId: client.id,
          renewalPrice: formatted,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Η τιμή ανανέωσης για ${client.companyName} ενημερώθηκε σε ${formatted}!`);
        fetchData();
      } else {
        toast.error("Σφάλμα: " + data.error);
      }
    } catch (err: any) {
      toast.error("Σφάλμα: " + err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Quick Inline Update Domain
  const handleQuickUpdateDomain = async (client: ClientHostingItem, newDomain: string) => {
    const trimmed = newDomain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");
    if (!trimmed || trimmed === client.domainName) return;
    try {
      setActionLoadingId(client.id);
      const res = await fetch("/api/admin/hosting-renewals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_client",
          clientId: client.id,
          domainName: trimmed,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Το domain για ${client.companyName} ενημερώθηκε σε ${trimmed}!`);
        fetchData();
      } else {
        toast.error("Σφάλμα: " + data.error);
      }
    } catch (err: any) {
      toast.error("Σφάλμα: " + err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCopyPaymentLink = (client: ClientHostingItem) => {
    const link = `https://www.sgk.gr/api/hosting/checkout?client=${client.id}${adminMode === "demo" ? "&mode=test" : ""}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(link);
      toast.success(`${adminMode === "demo" ? "🧪 Sandbox" : "🟢 Live"} Stripe Link αντιγράφηκε: ${link}`);
    } else {
      prompt("Αντιγράψτε το Stripe Link:", link);
    }
  };

  const handleRunCron = async () => {
    try {
      setRunningCron(true);
      const res = await fetch("/api/admin/cron-hosting-renewals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Ο έλεγχος Cron ολοκληρώθηκε! Ελέγχθηκαν ${data.clientsChecked} πελάτες, στάλθηκαν ${data.emailsSent} υπενθυμίσεις.`);
        fetchData();
      } else {
        toast.error("Σφάλμα Cron: " + (data.error || "Άγνωστο"));
      }
    } catch (err: any) {
      toast.error("Σφάλμα: " + err.message);
    } finally {
      setRunningCron(false);
    }
  };

  // Send Test Email to info@sgk.gr (Uses selected client data or default)
  const handleSendTestEmail = async () => {
    try {
      setSendingTest(true);
      const res = await fetch("/api/admin/hosting-renewals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_test_email",
          clientId: selectedTestClientId || undefined,
          to: testEmail,
          stage: testStage,
          mode: adminMode === "demo" ? "test" : "live",
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Το δοκιμαστικό email (${testStage}) για "${data.clientUsed || "πελάτη"}" με ποσό ${data.priceUsed || "80€"} στάλθηκε επιτυχώς στο ${testEmail}!`);
      } else {
        toast.error("Σφάλμα αποστολής δοκιμαστικού: " + (data.error || "Άγνωστο"));
      }
    } catch (err: any) {
      toast.error("Σφάλμα: " + err.message);
    } finally {
      setSendingTest(false);
    }
  };

  // Send Direct Test for this specific Client to info@sgk.gr
  const handleSendClientTestToAdmin = async (client: ClientHostingItem, stage: HostingReminderStage = "20_days") => {
    try {
      setActionLoadingId(client.id);
      const res = await fetch("/api/admin/hosting-renewals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_test_email",
          clientId: client.id,
          stage,
          to: "info@sgk.gr",
          mode: adminMode === "demo" ? "test" : "live",
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Δοκιμαστικό για "${client.companyName}" με ποσό ${data.priceUsed || client.renewalPrice} στάλθηκε στο info@sgk.gr!`);
      } else {
        toast.error("Σφάλμα: " + (data.error || "Άγνωστο"));
      }
    } catch (err: any) {
      toast.error("Σφάλμα: " + err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Send Single Reminder to specific client
  const handleSendSingleReminder = async (client: ClientHostingItem, stage: HostingReminderStage) => {
    if (!confirm(`Είστε σίγουρος ότι θέλετε να στείλετε άμεσα την υπενθύμιση (${stage}) στον πελάτη "${client.companyName}" (${client.email});`)) {
      return;
    }

    try {
      setActionLoadingId(client.id);
      const res = await fetch("/api/admin/hosting-renewals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_stage_reminder",
          clientId: client.id,
          stage,
          mode: adminMode === "demo" ? "test" : "live",
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Το email (${stage}) στάλθηκε επιτυχώς μέσω ${data.provider?.toUpperCase()} στο ${client.email}!`);
        fetchData();
      } else {
        toast.error("Σφάλμα αποστολής: " + data.error);
      }
    } catch (err: any) {
      toast.error("Σφάλμα: " + err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Open Edit Modal
  const openEdit = (client: ClientHostingItem) => {
    setEditingClient(client);
    setEditDomain(client.domainName);
    setEditDate(client.customExpiresAt || client.renewalDate);
    setEditPrice(client.renewalPrice);
    setEditNotes(client.notes || "");
  };

  // Save Edit
  const handleSaveEdit = async () => {
    if (!editingClient) return;
    try {
      setActionLoadingId(editingClient.id);
      const res = await fetch("/api/admin/hosting-renewals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_client",
          clientId: editingClient.id,
          domainName: editDomain,
          customExpiresAt: editDate,
          renewalPrice: editPrice,
          notes: editNotes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Τα στοιχεία για τον πελάτη "${editingClient.companyName}" ενημερώθηκαν!`);
        setEditingClient(null);
        fetchData();
      } else {
        toast.error("Σφάλμα αποθήκευσης: " + data.error);
      }
    } catch (err: any) {
      toast.error("Σφάλμα: " + err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter clients
  const filteredClients = clients.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      c.companyName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.domainName.toLowerCase().includes(q) ||
      c.afm.includes(q);

    if (!matchesSearch) return false;

    if (statusFilter === "paid") return c.isPaid;
    if (statusFilter === "unpaid") return !c.isPaid;
    if (statusFilter === "expiring") return !c.isPaid && c.daysRemaining > 0 && c.daysRemaining <= 20;
    if (statusFilter === "expired") return !c.isPaid && c.daysRemaining <= 0;

    return true;
  });

  const totalProjectedRevenue = clients.reduce((acc, c) => acc + parsePrice(c.renewalPrice), 0);
  const collectedRevenue = clients.filter((c) => c.isPaid).reduce((acc, c) => acc + parsePrice(c.renewalPrice), 0);
  const pendingRevenue = clients.filter((c) => !c.isPaid).reduce((acc, c) => acc + parsePrice(c.renewalPrice), 0);

  return (
    <div className="space-y-6 pb-12">
      {/* --- TOP HEADER & OVERVIEW CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Total Clients Card */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Σύνολο Πελατών</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Server className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats.total}</span>
            <span className="text-xs font-semibold text-slate-500">ενεργά sites</span>
          </div>
        </div>

        {/* Projected Hosting Revenue Card */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">
              Έσοδα Ανανεώσεων
            </span>
            <div className="w-8 h-8 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black tracking-tight text-white">
              {totalProjectedRevenue.toLocaleString("el-GR", { minimumFractionDigits: 0 })} €
            </div>
            <div className="mt-1 flex items-center justify-between text-[11px] font-semibold text-emerald-100/90 pt-1 border-t border-white/20">
              <span>Εισπράχθηκαν: <strong className="text-white">{collectedRevenue.toFixed(0)}€</strong></span>
              <span>Εκκρεμούν: <strong className="text-white">{pendingRevenue.toFixed(0)}€</strong></span>
            </div>
          </div>
        </div>

        {/* Paid / Renewed */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Ανανεωμένα</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-700">{stats.paid}</span>
            <span className="text-xs font-semibold text-emerald-600/80">τακτοποιημένα</span>
          </div>
        </div>

        {/* Expiring Soon (<20 Days) */}
        <div className="bg-white border border-amber-200/80 bg-amber-50/20 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Λήγουν Σύντομα</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-700">{stats.expiringSoon}</span>
            <span className="text-xs font-semibold text-amber-600">reminders</span>
          </div>
        </div>

        {/* Expired / Critical */}
        <div className="bg-white border border-rose-200/80 bg-rose-50/20 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Έληξαν</span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-700">{stats.expired}</span>
            <span className="text-xs font-semibold text-rose-600">σε κίνδυνο</span>
          </div>
        </div>

        {/* Cron Engine Status Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Cron Engine
              </span>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-slate-300 font-medium">Daily 11:00</span>
            </div>
            <div className="mt-2 text-xs font-semibold text-slate-200 line-clamp-1">
              {cronStatus.lastRunAt 
                ? `${new Date(cronStatus.lastRunAt).toLocaleDateString('el-GR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}`
                : "Αναμονή"}
            </div>
          </div>

          <button
            onClick={handleRunCron}
            disabled={runningCron}
            className="mt-3 w-full flex items-center justify-center gap-2 bg-[#3b5bdb] hover:bg-blue-600 text-white text-xs font-bold py-1.5 px-3 rounded-lg transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            <Play className={`w-3 h-3 ${runningCron ? "animate-spin" : ""}`} />
            <span>{runningCron ? "Έλεγχος..." : "Έλεγχος Τώρα"}</span>
          </button>
        </div>
      </div>

      {/* --- MODE SWITCHER: DEMO vs LIVE --- */}
      <div className={`p-4 rounded-2xl border transition-all ${
        adminMode === "demo" 
          ? "bg-amber-500/10 border-amber-500/30 text-amber-950" 
          : "bg-emerald-500/10 border-emerald-500/30 text-emerald-950"
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
              adminMode === "demo" ? "bg-amber-500 text-white shadow-md shadow-amber-500/30" : "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
            }`}>
              {adminMode === "demo" ? "🧪" : "🟢"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-wide">
                  {adminMode === "demo" ? "ΔΟΚΙΜΑΣΤΙΚΗ ΛΕΙΤΟΥΡΓΙΑ (DEMO MODE)" : "ΠΡΑΓΜΑΤΙΚΗ ΛΕΙΤΟΥΡΓΙΑ (LIVE PRODUCTION)"}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  adminMode === "demo" ? "bg-amber-200 text-amber-800" : "bg-emerald-200 text-emerald-800"
                }`}>
                  {adminMode === "demo" ? "Database Test Mode" : "Stripe Live Active"}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {adminMode === "demo" 
                  ? "Στο DEMO mode μπορείτε να δοκιμάσετε τη ροή πληρωμής: πατώντας «Test Πληρωμή (Demo)» η βάση δεδομένων (Supabase) ενημερώνεται κανονικά (+1 έτος) για να κάνετε τεστ χωρίς χρέωση πραγματικής κάρτας!"
                  : "Στο LIVE mode το σύστημα είναι συνδεδεμένο με το Live Stripe API (SGK DIGITAL). Κάθε πραγματική πληρωμή πελάτη ενημερώνει αυτόματα τη βάση και στέλνει τα επίσημα emails."
                }
              </p>
            </div>
          </div>

          {/* Mode Switch Buttons */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-gray-200 shadow-sm self-end sm:self-auto">
            <button
              onClick={() => toggleAdminMode("demo")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                adminMode === "demo" 
                  ? "bg-amber-500 text-white shadow-sm" 
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>🧪 DEMO</span>
            </button>
            <button
              onClick={() => toggleAdminMode("live")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                adminMode === "live" 
                  ? "bg-emerald-600 text-white shadow-sm" 
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>🟢 LIVE</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- SEARCH, FILTERS & CONTROLS --- */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Αναζήτηση εταιρείας, domain, email, ΑΦΜ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === "all" ? "bg-slate-900 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Όλοι ({clients.length})
          </button>
          <button
            onClick={() => setStatusFilter("expiring")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === "expiring" ? "bg-amber-600 text-white shadow-sm" : "bg-amber-50 text-amber-700 hover:bg-amber-100"
            }`}
          >
            Λήγουν Σύντομα ({stats.expiringSoon})
          </button>
          <button
            onClick={() => setStatusFilter("expired")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === "expired" ? "bg-rose-600 text-white shadow-sm" : "bg-rose-50 text-rose-700 hover:bg-rose-100"
            }`}
          >
            Έληξαν ({stats.expired})
          </button>
          <button
            onClick={() => setStatusFilter("paid")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === "paid" ? "bg-emerald-600 text-white shadow-sm" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            Πληρωμένοι ({stats.paid})
          </button>
          <button
            onClick={() => setStatusFilter("unpaid")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === "unpaid" ? "bg-blue-600 text-white shadow-sm" : "bg-blue-50 text-blue-700 hover:bg-blue-100"
            }`}
          >
            Εκκρεμείς ({clients.length - stats.paid})
          </button>
        </div>
      </div>

      {/* --- CLIENTS HOSTING TABLE --- */}
      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <RefreshCcw className="w-8 h-8 mx-auto animate-spin mb-3 text-[#3b5bdb]" />
            <p className="text-sm font-semibold text-slate-600">Φόρτωση πελατών και ημερομηνιών ανανέωσης...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Globe className="w-10 h-10 mx-auto text-slate-300 mb-3" />
            <p className="text-sm font-semibold text-slate-600">Δεν βρέθηκαν πελάτες με αυτά τα κριτήρια.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-gray-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">Πελάτης / Επωνυμία</th>
                  <th className="py-3.5 px-4">Domain &amp; Στοιχεία</th>
                  <th className="py-3.5 px-4">Ημ. Εγγραφής</th>
                  <th className="py-3.5 px-4">Ημ. Λήξης Hosting</th>
                  <th className="py-3.5 px-4">Χρόνος που Απομένει</th>
                  <th className="py-3.5 px-4">Κατάσταση &amp; Reminders</th>
                  <th className="py-3.5 px-4 text-right">Ενέργειες</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredClients.map((client) => {
                  const isExpiringSoon = !client.isPaid && client.daysRemaining > 0 && client.daysRemaining <= 20;
                  const isExpired = !client.isPaid && client.daysRemaining <= 0;

                  return (
                    <tr 
                      key={client.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isExpired 
                          ? "bg-rose-50/20" 
                          : isExpiringSoon 
                          ? "bg-amber-50/20" 
                          : client.isPaid 
                          ? "bg-emerald-50/10" 
                          : ""
                      }`}
                    >
                      {/* Company Name & AFM */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 leading-tight">
                          {client.companyName}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          {client.afm && <span>ΑΦΜ: {client.afm}</span>}
                          {client.phone && <span>· Τηλ: {client.phone}</span>}
                        </div>
                      </td>

                      {/* Domain & Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <input
                            type="text"
                            defaultValue={client.domainName}
                            key={client.domainName}
                            onBlur={(e) => handleQuickUpdateDomain(client, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                            }}
                            className="w-32 px-1.5 py-0.5 border border-slate-200 rounded text-xs font-bold text-blue-600 bg-white hover:border-blue-400 focus:border-blue-600 outline-none transition-colors"
                            title="Επεξεργασία Domain πελάτη (Enter ή κλικ έξω για αποθήκευση)"
                          />
                          <a 
                            href={`https://${client.domainName}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                            title="Άνοιγμα ιστοσελίδας σε νέα καρτέλα"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {client.email}
                        </div>
                      </td>

                      {/* Registration Date */}
                      <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                        {client.registrationDate}
                      </td>

                      {/* Renewal Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{client.renewalDate}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-slate-400">Ποσό:</span>
                          <input
                            type="text"
                            defaultValue={client.renewalPrice}
                            key={client.renewalPrice}
                            onBlur={(e) => handleQuickUpdatePrice(client, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                            }}
                            className="w-36 px-2 py-0.5 border border-slate-200 rounded text-xs font-bold text-blue-700 bg-white hover:border-blue-400 focus:border-blue-600 outline-none transition-colors"
                            title="Επεξεργασία ποσού ανανέωσης hosting για αυτόν τον πελάτη (Enter ή κλικ έξω για αποθήκευση)"
                          />
                        </div>
                      </td>

                      {/* Days Remaining Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {client.isPaid ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            Ανανεωμένο
                          </span>
                        ) : client.daysRemaining <= 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-rose-600 text-white animate-pulse">
                            <ShieldAlert className="w-3 h-3" />
                            Έληξε ({Math.abs(client.daysRemaining)}ημ. πριν)
                          </span>
                        ) : client.daysRemaining <= 3 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
                            🚨 Σε {client.daysRemaining} ημέρες!
                          </span>
                        ) : client.daysRemaining <= 5 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                            ⚠️ Σε {client.daysRemaining} ημέρες
                          </span>
                        ) : client.daysRemaining <= 20 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            ⏳ Σε {client.daysRemaining} ημέρες
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
                            Ενεργό (σε {client.daysRemaining}ημ.)
                          </span>
                        )}
                      </td>

                      {/* Status & Last Reminder Sent */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {adminMode === "demo" ? (
                            <>
                              <button
                                onClick={() => handleSimulatePayment(client)}
                                disabled={actionLoadingId === client.id}
                                title="Δοκιμή Πληρωμής: Ενημερώνει άμεσα τη βάση δεδομένων (+1 έτος) για δοκιμή"
                                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-sm ${
                                  client.isPaid 
                                    ? "bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200"
                                    : "bg-amber-500 hover:bg-amber-600 text-white"
                                }`}
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>{client.isPaid ? "Test OK (+1 έτος)" : "⚡ Test Πληρωμή"}</span>
                              </button>

                              {client.isPaid && (
                                <button
                                  onClick={() => handleResetClientDemo(client)}
                                  disabled={actionLoadingId === client.id}
                                  title="Επαναφορά σε εκκρεμότητα για νέο τεστ"
                                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition-all"
                                >
                                  <RefreshCcw className="w-3 h-3" />
                                </button>
                              )}
                            </>
                          ) : (
                            <button
                              onClick={() => handleTogglePaid(client)}
                              disabled={actionLoadingId === client.id}
                              title={client.isPaid ? "Κλικ για επιστροφή σε εκκρεμότητα" : "Κλικ για δήλωση πληρωμής"}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all active:scale-95 ${
                                client.isPaid 
                                  ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm" 
                                  : "bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200"
                              }`}
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>{client.isPaid ? "Πληρώθηκε" : "Δήλωση Πληρωμής"}</span>
                            </button>
                          )}
                        </div>
                        {client.lastStageSent && (
                          <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                            <Send className="w-2.5 h-2.5 text-blue-500" />
                            <span>Εστάλη: {client.lastStageSent}</span>
                          </div>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Send specific stage reminder */}
                          <div className="relative group">
                            <button
                              title="Αποστολή Email Υπενθύμισης Τώρα"
                              className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </button>
                            <div className="hidden group-hover:block absolute right-0 top-full mt-1 z-30 bg-white border border-gray-200 rounded-xl shadow-xl p-2 w-48 text-left space-y-1">
                              <div className="text-[10px] font-bold uppercase text-slate-400 px-2 py-0.5">Άμεση Αποστολή:</div>
                              <button
                                onClick={() => handleSendSingleReminder(client, "20_days")}
                                className="w-full text-left text-xs px-2 py-1.5 rounded-lg hover:bg-blue-50 text-slate-700 font-medium"
                              >
                                ⏳ 20 Ημέρες πριν
                              </button>
                              <button
                                onClick={() => handleSendSingleReminder(client, "15_days")}
                                className="w-full text-left text-xs px-2 py-1.5 rounded-lg hover:bg-blue-50 text-slate-700 font-medium"
                              >
                                ⚠️ 15 Ημέρες πριν
                              </button>
                              <button
                                onClick={() => handleSendSingleReminder(client, "5_days")}
                                className="w-full text-left text-xs px-2 py-1.5 rounded-lg hover:bg-amber-50 text-amber-700 font-medium"
                              >
                                🚨 5 Ημέρες πριν
                              </button>
                              <button
                                onClick={() => handleSendSingleReminder(client, "3_days")}
                                className="w-full text-left text-xs px-2 py-1.5 rounded-lg hover:bg-orange-50 text-orange-700 font-medium"
                              >
                                ⏰ 3 Ημέρες πριν
                              </button>
                              <button
                                onClick={() => handleSendSingleReminder(client, "0_days")}
                                className="w-full text-left text-xs px-2 py-1.5 rounded-lg hover:bg-rose-50 text-rose-700 font-bold"
                              >
                                ⛔ Ημέρα Λήξης (0d)
                              </button>

                              <div className="pt-1.5 mt-1 border-t border-slate-100">
                                <button
                                  onClick={() => handleSendClientTestToAdmin(client, "20_days")}
                                  className="w-full text-left text-xs px-2 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold flex items-center gap-1.5"
                                  title="Αποστολή δοκιμαστικού με το πραγματικό δηλωμένο ποσό αυτού του πελάτη στο info@sgk.gr"
                                >
                                  <span>🧪 Δοκιμή στο info@sgk.gr</span>
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Copy Stripe Payment Link */}
                          <button
                            onClick={() => handleCopyPaymentLink(client)}
                            title="Αντιγραφή Stripe Payment Link (Κάρτα / Apple Pay / Google Pay)"
                            className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors cursor-pointer"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Details */}
                          <button
                            onClick={() => openEdit(client)}
                            title="Επεξεργασία Domain &amp; Ημερομηνίας"
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- EDIT CLIENT MODAL --- */}
      {mounted && typeof document !== "undefined" && editingClient && createPortal(
        <div className="fixed inset-0 z-[99999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-slate-900 text-sm">
                Επεξεργασία Φιλοξενίας: {editingClient.companyName}
              </h3>
              <button 
                onClick={() => setEditingClient(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Domain Name:</label>
                <input
                  type="text"
                  value={editDomain}
                  onChange={(e) => setEditDomain(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none font-semibold text-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ημερομηνία Λήξης (YYYY-MM-DD):</label>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Τιμή Ανανέωσης:</label>
                <input
                  type="text"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  placeholder="80,00 € (με ΦΠΑ)"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Σημειώσεις / Notes:</label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={2}
                  placeholder="π.χ. Πληρώνει μέσω Eurobank κάθε Φεβρουάριο..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none font-medium text-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-6 pt-3 border-t border-gray-100">
              <button
                onClick={() => setEditingClient(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Ακύρωση
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={actionLoadingId === editingClient.id}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#3b5bdb] hover:bg-blue-600 text-white transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
              >
                Αποθήκευση
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
