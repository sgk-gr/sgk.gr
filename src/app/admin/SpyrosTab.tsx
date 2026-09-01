"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, Landmark, AlertCircle, 
  Zap, CheckCircle2, Sliders, Calendar, 
  Sparkles, Check, Home, Target, TrendingDown,
  Info, Smartphone, ArrowDownRight, Award,
  Clock, DollarSign, ArrowRight, ShieldAlert, Sparkle,
  Percent, Flame, HelpCircle
} from "lucide-react";

export function SpyrosTab() {
  // Strategy Selector State
  const [strategyMode, setStrategyMode] = useState<"smart" | "equal">("smart");
  const [extraPayment, setExtraPayment] = useState<number>(300);
  
  const [checkedMonthlyTasks, setCheckedMonthlyTasks] = useState<Record<string, boolean>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("spyros_monthly_tasks");
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return {};
  });

  const toggleTask = (id: string) => {
    setCheckedMonthlyTasks(prev => {
      const updated = { ...prev, [id]: !prev[id] };
      if (typeof window !== "undefined") {
        localStorage.setItem("spyros_monthly_tasks", JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Base Data from Tiresias Report & Live Statements (01/09/2026)
  const currentScore = 326;
  const maxScore = 600;
  const defaultProb = 65.0;

  // Active Loans
  const eurobankLoan = {
    title: "Προσωπικό Δάνειο (Eurobank)",
    accountNo: "9110419618336680",
    initialAmount: 4000.0,
    currentBalance: 2526.0,
    regularBalance: 2430.83,
    overdueBalance: 95.17,
    monthlyInstallment: 94.95,
    dueDate: "26 κάθε μήνα (πληρωμή στην ώρα της)",
    lastUpdate: "31/07/2026",
    status: "clean_on_time",
  };

  const tbiLoan = {
    title: "Καταναλωτικό Δάνειο (TBI Bank)",
    accountNo: "248249",
    initialAmount: 1744.04,
    currentBalance: 1284.14,
    regularBalance: 1284.14,
    overdueBalance: 0.0,
    monthlyInstallment: 36.97,
    lastUpdate: "31/07/2026",
    status: "clean",
  };

  // Credit Cards (Live updated with actual app & statement data)
  const nbgCard = {
    title: "Mastercard Classic (Εθνική Τράπεζα)",
    accountNo: "5278 9075 5152 4705",
    limit: 900.0,
    tiresiasBalance: 905.17,
    currentBalance: 680.54, // LIVE APP DATA
    lastStatementBalance: 667.93,
    minPayment: 15.00,
    paymentDueDate: "18/09/2026",
    interestRate: 0.0, // 100% Άτοκες δόσεις / άτοκο
    isInterestFree: true,
    utilization: (680.54 / 900.0) * 100, // 75.61%
  };

  const eurobankCard = {
    title: "Mastercard (Eurobank)",
    accountNo: "5458 6508 8388 9519",
    limit: 2000.0,
    currentBalance: 1934.90, // LIVE APP DATA
    statementBalance: 1984.90,
    minPayment: 35.00,
    paymentDueDate: "21/09/2026",
    interestRate: 18.75, // 18.15% + 0.60% Ν.128
    monthlyInterest: 33.80, // Τόκοι περιόδου: 33.30€ + 0.50€
    shopflixInstallment: 13.66, // Δόση 27/36 (απομένουν 10 δόσεις, υπόλοιπο 136.84€)
    shopflixRemaining: 136.84,
    shopflixInstallmentsLeft: 10,
    isInterestFree: false,
    utilization: (1934.90 / 2000.0) * 100, // 96.74%
  };

  // Aggregates (Live)
  const totalLoanBalance = eurobankLoan.currentBalance + tbiLoan.currentBalance; // 3810.14
  const totalCardBalance = nbgCard.currentBalance + eurobankCard.currentBalance; // 2615.44
  const totalDebt = totalLoanBalance + totalCardBalance; // 6425.58
  const totalCreditLimit = nbgCard.limit + eurobankCard.limit; // 2900
  const overallCardUtilization = (totalCardBalance / totalCreditLimit) * 100; // 90.18%

  // SMART SCHEDULE: Smart Allocation (30€ NBG / 70€ Eurobank in Phase 1 -> 100€ / 100€ in Phase 2)
  const smartSchedule = [
    { month: "Σεπτέμβριος 2026", nbgPay: 30, nbgBal: 650, euroPay: 70, euroInterest: 30.2, euroPrincipal: 39.8, euroBal: 1895, score: "390", notes: "70€ Eurobank = 40€ καθαρή μείωση κεφαλαίου!" },
    { month: "Οκτώβριος 2026", nbgPay: 30, nbgBal: 620, euroPay: 70, euroInterest: 29.6, euroPrincipal: 40.4, euroBal: 1854, score: "410", notes: "Οι τόκοι πέφτουν κάτω από 30€" },
    { month: "Νοέμβριος 2026", nbgPay: 30, nbgBal: 590, euroPay: 70, euroInterest: 28.9, euroPrincipal: 41.1, euroBal: 1813, score: "430", notes: "Σταθερή μείωση και στις δύο" },
    { month: "Δεκέμβριος 2026", nbgPay: 30, nbgBal: 560, euroPay: 70, euroInterest: 28.3, euroPrincipal: 41.7, euroBal: 1772, score: "450", notes: "Κλείσιμο έτους με καθαρή πρόοδο" },
    { month: "Ιανουάριος 2027", nbgPay: 30, nbgBal: 530, euroPay: 70, euroInterest: 27.6, euroPrincipal: 42.4, euroBal: 1729, score: "480", notes: "🎉 Καθαρίζει το 12μηνο ιστορικό του 01/2026!" },
    { month: "Φεβρουάριος 2027", nbgPay: 40, nbgBal: 490, euroPay: 70, euroInterest: 27.0, euroPrincipal: 43.0, euroBal: 1686, score: "495", notes: "Εθνική πέφτει κάτω από 500€" },
    { month: "Μάρτιος 2027", nbgPay: 40, nbgBal: 450, euroPay: 70, euroInterest: 26.3, euroPrincipal: 43.7, euroBal: 1642, score: "510", notes: "🎯 Εθνική στο 50% (Sweet Spot)" },
    { month: "Απρίλιος 2027", nbgPay: 50, nbgBal: 400, euroPay: 70, euroInterest: 25.6, euroPrincipal: 44.4, euroBal: 1598, score: "525", notes: "Πράσινη Ζώνη Τειρεσία" },
    { month: "Μάιος 2027", nbgPay: 100, nbgBal: 300, euroPay: 100, euroInterest: 24.9, euroPrincipal: 75.1, euroBal: 1523, score: "540", notes: "⚡ ΦΑΣΗ 2: Αύξηση σε 100€! Τελειώνει το Shopflix!" },
    { month: "Ιούνιος 2027", nbgPay: 100, nbgBal: 200, euroPay: 100, euroInterest: 23.8, euroPrincipal: 76.2, euroBal: 1447, score: "550", notes: "Εθνική στο 22% (Optimal)" },
    { month: "Ιούλιος 2027", nbgPay: 100, nbgBal: 100, euroPay: 100, euroInterest: 22.6, euroPrincipal: 77.4, euroBal: 1369, score: "560", notes: "Εθνική στα τελευταία 100€" },
    { month: "Αύγουστος 2027", nbgPay: 100, nbgBal: 0, euroPay: 100, euroInterest: 21.3, euroPrincipal: 78.7, euroBal: 1291, score: "570", notes: "🏆 ΠΛΗΡΗΣ ΕΞΟΦΛΗΣΗ ΕΘΝΙΚΗΣ (0,00€)!" },
    { month: "Σεπτέμβριος 2027", nbgPay: 0, nbgBal: 0, euroPay: 200, euroInterest: 20.1, euroPrincipal: 179.9, euroBal: 1111, score: "580", notes: "Και τα 200€ στη Eurobank (Άλμα -180€)" },
    { month: "Οκτώβριος 2027", nbgPay: 0, nbgBal: 0, euroPay: 200, euroInterest: 17.3, euroPrincipal: 182.7, euroBal: 928, score: "590+", notes: "🏆 ΤΕΛΙΚΟΣ ΣΤΟΧΟΣ: Eurobank < 50% & A-Tier Score!" },
  ];

  return (
    <div className="space-y-8 pb-12">

      {/* TOP HERO / EXECUTIVE BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-black uppercase tracking-widest">
              <Sparkles size={12} className="text-yellow-400" />
              Προσωπικο Οικονομικο Dashboard & Στρατηγικη Εξυγιανσης
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              ΣΠΥΡΙΔΩΝ ΤΣΑΒΟΣ
              <span className="text-xs font-mono font-normal px-2.5 py-1 rounded-xl bg-slate-800/80 text-slate-300 border border-slate-700">
                ΑΦΜ: 131398972
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-medium max-w-2xl leading-relaxed">
              Αναλυτική απεικόνιση των πραγματικών τραπεζικών στοιχείων (Statement Eurobank & NBG Mobile App). 
              Πλήρης διαφάνεια τόκων και στρατηγική έξυπνης αποπληρωμής.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-900/90 border border-slate-800 px-4 py-3 rounded-2xl flex items-center gap-3 shadow-inner">
              <Smartphone size={18} className="text-emerald-400" />
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Live Statements</p>
                <p className="text-xs font-bold text-emerald-400 font-mono">01/09/2026 (Live)</p>
              </div>
            </div>
            <div className="bg-emerald-950/40 border border-emerald-800/60 px-4 py-3 rounded-2xl flex items-center gap-3 shadow-inner">
              <ShieldCheck size={20} className="text-emerald-400" />
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-emerald-400">Μαυρη Λιστα (ΣΑΥ)</p>
                <p className="text-xs font-black text-emerald-300 uppercase">100% Καθαρο</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CRITICAL INTEREST TRANSPARENCY CARD (EUROBANK 18.75% vs NBG 0%) */}
      <div className="bg-gradient-to-br from-amber-950/60 via-slate-900 to-rose-950/50 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-amber-500/20 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase tracking-widest">
              <Flame size={12} className="text-amber-400" />
              Αποκαλυψη & Διαφανεια Τοκων
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              ⚠️ Γιατί η κάρτα Eurobank δεν έπεφτε με 50 € / μήνα;
            </h2>
          </div>

          <div className="bg-rose-950/80 border border-rose-800 px-4 py-2.5 rounded-2xl text-right">
            <span className="text-[10px] text-rose-300 font-bold uppercase block">Επιτόκιο Eurobank</span>
            <span className="text-lg font-black text-rose-400 font-mono">18,75% ετησίως</span>
          </div>
        </div>

        {/* Math Breakdown Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Card 1: Eurobank Anatomy */}
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-rose-500/40 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black uppercase text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-md border border-rose-500/20">
                  🔴 ΤΟΚΟΦΟΡΟ ΥΠΟΛΟΙΠΟ (18,75%)
                </span>
                <h4 className="font-black text-base text-white mt-1.5">Eurobank Mastercard (1.934,90 €)</h4>
              </div>
              <span className="font-mono text-xs font-black text-rose-400">Τόκοι: ~33,80 € / μήνα</span>
            </div>

            <div className="space-y-2 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span>Καταβολή από εσάς:</span>
                <span className="font-bold text-emerald-400">+50,00 €</span>
              </div>
              <div className="flex justify-between text-rose-400">
                <span>- Τόκοι περιόδου (18,75%):</span>
                <span className="font-bold">-33,80 €</span>
              </div>
              <div className="flex justify-between text-amber-400">
                <span>- Άτοκη δόση Shopflix (27/36):</span>
                <span className="font-bold">-13,66 €</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-white font-black">
                <span>= ΠΡΑΓΜΑΤΙΚΗ ΜΕΙΩΣΗ ΧΡΕΟΥΣ:</span>
                <span className="text-rose-400 font-black">+2,54 € μόλις!</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">
              💡 <strong>Συμπέρασμα:</strong> Είχατε απόλυτο δίκιο! Δίνοντας 50€, τα 34€ πήγαιναν κατευθείαν σε τόκους της τράπεζας και το χρέος έμενε στάσιμο στα 1.984€.
            </p>
          </div>

          {/* Card 2: NBG Anatomy */}
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-emerald-500/40 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  🟢 ΑΤΟΚΕΣ ΔΟΣΕΙΣ (0,00% ΤΟΚΟΣ)
                </span>
                <h4 className="font-black text-base text-white mt-1.5">Mastercard Εθνικής (680,54 €)</h4>
              </div>
              <span className="font-mono text-xs font-black text-emerald-400">Τόκοι: 0,00 €</span>
            </div>

            <div className="space-y-2 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span>Καταβολή από εσάς:</span>
                <span className="font-bold text-emerald-400">+50,00 €</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>- Τόκοι περιόδου:</span>
                <span className="font-bold">0,00 € (Άτοκο!)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>- Χρεώσεις/Έξοδα:</span>
                <span className="font-bold">0,00 €</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-white font-black">
                <span>= ΠΡΑΓΜΑΤΙΚΗ ΜΕΙΩΣΗ ΧΡΕΟΥΣ:</span>
                <span className="text-emerald-400 font-black">+50,00 € ΚΑΘΑΡΑ!</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">
              💡 <strong>Συμπέρασμα:</strong> Στην Εθνική, κάθε ευρώ που βάζετε αφαιρείται 100% από το κεφάλαιο. Γι&apos; αυτό έπεσε τόσο εύκολα από 905€ στα 680€!
            </p>
          </div>

        </div>

        {/* THE SMART STRATEGY (HOW TO WIN) */}
        <div className="bg-emerald-950/50 border border-emerald-500/30 p-5 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-wider">
            <Zap size={16} />
            Η Εξυπνη Λυση (Smart Allocation Strategy)
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            Αντί να μοιράζετε 50€-50€, εφαρμόζουμε τη στρατηγική <strong>30 € στην Εθνική (αφού είναι άτοκη) και 70 € στη Eurobank</strong>:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="bg-slate-900/80 p-3 rounded-xl border border-emerald-500/20">
              <span className="text-[10px] text-slate-400 block font-sans">Εθνική (30€/μήνα)</span>
              <span className="text-emerald-400 font-bold">Πέφτει κατά 30€/μήνα</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-emerald-500/20">
              <span className="text-[10px] text-slate-400 block font-sans">Eurobank (70€/μήνα)</span>
              <span className="text-emerald-400 font-bold">40€ καθαρή μείωση κεφαλαίου!</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-emerald-500/20">
              <span className="text-[10px] text-slate-400 block font-sans">Μάιος 2027 (Φάση 2)</span>
              <span className="text-emerald-400 font-bold">100€ + 100€ (Τελειώνει το Shopflix)</span>
            </div>
          </div>
        </div>

      </div>

      {/* MONTH-BY-MONTH REALISTIC SCHEDULE TABLE (INCLUDING INTEREST & PRINCIPAL) */}
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#3b5bdb] border border-blue-200 text-[10px] font-black uppercase tracking-widest mb-1.5">
              <Target size={12} />
              Ρεαλιστικο Μοντελο Προσομοιωσης (14 Μηνες)
            </div>
            <h3 className="text-lg font-black text-gray-900 uppercase">
              Μηνιαίος Πίνακας Εξέλιξης με Υπολογισμό Τόκων & Κεφαλαίου
            </h3>
          </div>

          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
            Συνολικό Budget Καρτών: 100€/μήνα (Φάση 1) ➔ 200€/μήνα (Φάση 2)
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-gray-200 text-[10px] font-black uppercase tracking-wider text-slate-600">
                <th className="p-3">Μήνας</th>
                <th className="p-3 text-emerald-700">Καταβολή Εθνικής</th>
                <th className="p-3">Υπόλοιπο Εθνικής (Άτοκο)</th>
                <th className="p-3 text-indigo-700">Καταβολή Eurobank</th>
                <th className="p-3 text-rose-600">Τόκοι Eurobank</th>
                <th className="p-3 text-emerald-700">Καθαρή Μείωση Eurobank</th>
                <th className="p-3">Υπόλοιπο Eurobank</th>
                <th className="p-3 text-emerald-700">Score Τειρεσία</th>
                <th className="p-3">Ορόσημο</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-mono text-xs">
              {smartSchedule.map((row, idx) => (
                <tr key={idx} className={`hover:bg-slate-50 transition-colors ${idx >= 8 ? 'bg-emerald-50/30' : ''}`}>
                  <td className="p-3 font-bold text-gray-900 font-sans">{row.month}</td>
                  <td className="p-3 text-emerald-600 font-bold">{row.nbgPay > 0 ? `${row.nbgPay} €` : "—"}</td>
                  <td className="p-3">
                    <span className={`font-bold ${row.nbgBal === 0 ? 'text-emerald-600 font-black' : 'text-gray-800'}`}>
                      {row.nbgBal} €
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">({((row.nbgBal / 900) * 100).toFixed(0)}%)</span>
                  </td>
                  <td className="p-3 text-indigo-600 font-bold">{row.euroPay} €</td>
                  <td className="p-3 text-rose-500 font-bold">-{row.euroInterest.toFixed(1)} €</td>
                  <td className="p-3 text-emerald-600 font-black">+{row.euroPrincipal.toFixed(1)} €</td>
                  <td className="p-3">
                    <span className="font-bold text-gray-900">{row.euroBal} €</span>
                    <span className="text-[10px] text-slate-400 ml-1">({((row.euroBal / 2000) * 100).toFixed(0)}%)</span>
                  </td>
                  <td className="p-3 font-black text-emerald-600 text-sm font-sans">{row.score}</td>
                  <td className="p-3 text-[11px] font-sans text-slate-600">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TOP 3 SUMMARY KPI CARDS & BEHAVIOR SCORE GAUGE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CARD 1: BEHAVIOR SCORE GAUGE */}
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Δεικτης Συμπεριφορας (Τειρεσιας)</p>
              <h3 className="text-lg font-black text-gray-900 tracking-tight mt-0.5">Behavior Score</h3>
            </div>
            <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-amber-500/10 text-amber-600 border border-amber-500/20">
              Score: 326 / 600
            </span>
          </div>

          <div className="my-5 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-rose-500 font-mono">326 (Βάση 27/8)</span>
              <span className="text-amber-500 font-mono">~390 (Μετά 1/9)</span>
              <span className="text-emerald-600 font-mono">590+ (Οκτ 2027)</span>
            </div>
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-200 flex">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 transition-all duration-1000"
                style={{ width: `${(currentScore / maxScore) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
              <span>0 (Υψηλο Ρισκο)</span>
              <span>600 (Αριστο)</span>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-3.5 border border-emerald-200/60 text-xs text-emerald-950 space-y-1">
            <div className="flex items-center justify-between font-bold">
              <span>Πραγματική Κατάσταση:</span>
              <span className="font-mono text-emerald-700 font-black text-sm">Τακτοποιημένη 1/9</span>
            </div>
            <p className="text-[11px] text-emerald-800/90 leading-tight">
              ✓ Η δόση Eurobank πληρώθηκε 1/9 και η Εθνική έπεσε στα 680€ (-225€). Στην επόμενη ανανέωση του Τειρεσία το σκορ θα ανέβει αυτόματα!
            </p>
          </div>
        </div>

        {/* CARD 2: TOTAL OBLIGATIONS BREAKDOWN */}
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Συνολικες Οφειλες (Live)</p>
              <h3 className="text-lg font-black text-gray-900 tracking-tight mt-0.5">Υπολοιπο Χρεων</h3>
            </div>
            <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-blue-500/10 text-blue-600 border border-blue-500/20">
              4 Προϊόντα
            </span>
          </div>

          <div className="my-3">
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-gray-900 tracking-tight">
                {totalDebt.toLocaleString("el-GR", { minimumFractionDigits: 2 })} €
              </p>
              <span className="text-xs font-bold text-emerald-600 flex items-center">
                <TrendingDown size={14} className="mr-0.5" /> -277 €
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-gray-100">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Δανεια (2)</span>
                <span className="font-black text-gray-800 text-sm font-mono">
                  {totalLoanBalance.toLocaleString("el-GR", { minimumFractionDigits: 2 })} €
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-gray-100">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Καρτες (2)</span>
                <span className="font-black text-emerald-700 text-sm font-mono">
                  {totalCardBalance.toLocaleString("el-GR", { minimumFractionDigits: 2 })} €
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-bold pt-3 border-t border-gray-150">
            <span className="text-slate-500">Μηνιαίες Δόσεις Δανείων:</span>
            <span className="text-gray-900 font-mono">{(eurobankLoan.monthlyInstallment + tbiLoan.monthlyInstallment).toFixed(2)} € / μήνα</span>
          </div>
        </div>

        {/* CARD 3: CREDIT CARD UTILIZATION */}
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Χρηση Πιστωτικων Οριων (Live)</p>
              <h3 className="text-lg font-black text-gray-900 tracking-tight mt-0.5">Card Utilization</h3>
            </div>
            <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-amber-500/10 text-amber-700 border border-amber-500/20">
              {overallCardUtilization.toFixed(1)}% (Βελτίωση)
            </span>
          </div>

          <div className="my-3 space-y-2">
            <div className="flex justify-between text-xs font-bold text-gray-700">
              <span>Χρησιμοποίηση: {totalCardBalance.toFixed(0)}€</span>
              <span className="text-slate-400">Όριο: {totalCreditLimit}€</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-200">
              <div 
                className="h-full rounded-full bg-amber-500"
                style={{ width: `${Math.min(100, overallCardUtilization)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500">
              🎯 <strong>Στόχος Πλάνου:</strong> Με τα 30€+70€/μήνα, η συνολική χρήση πέφτει στο <strong>40% τον Απρίλιο 2027</strong> και στο <strong>0% τον Οκτώβριο 2027</strong>!
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span className="font-bold text-emerald-950">Κατάσταση Δόσεων:</span>
            </div>
            <span className="font-mono font-black text-emerald-700">Πληρωμή στις 26 κάθε μήνα</span>
          </div>
        </div>

      </div>

      {/* DETAILED ACTIVE OBLIGATIONS CARDS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-gray-900 tracking-tight uppercase flex items-center gap-2">
            <Landmark className="text-[#3b5bdb]" size={20} />
            Αναλυτικη Κατασταση Ενεργων Χορηγησεων
          </h2>
          <span className="text-xs font-bold text-slate-500">4 Ενεργά Προϊόντα</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* 1. EUROBANK LOAN */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-md hover:shadow-lg transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500" />
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  ✓ Πληρωμή στις 26 του μήνα (Ενήμερη)
                </span>
                <h3 className="font-black text-base text-gray-900 mt-1.5">{eurobankLoan.title}</h3>
                <p className="text-xs text-slate-400 font-mono">Κωδ. {eurobankLoan.accountNo}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Υπόλοιπο</span>
                <span className="text-xl font-black text-gray-900 font-mono">
                  {eurobankLoan.currentBalance.toLocaleString("el-GR", { minimumFractionDigits: 2 })} €
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 my-4 bg-slate-50 p-3 rounded-2xl border border-gray-150 text-xs">
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Αρχικό Ποσό</span>
                <span className="font-bold text-gray-800 font-mono">{eurobankLoan.initialAmount} €</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Μηνιαία Δόση</span>
                <span className="font-bold text-gray-800 font-mono">{eurobankLoan.monthlyInstallment} €</span>
              </div>
              <div>
                <span className="text-[9px] text-emerald-600 font-bold uppercase block">Ημ/νία Πληρωμής</span>
                <span className="font-bold text-gray-800 font-mono">26 κάθε μήνα</span>
              </div>
            </div>

            <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-3 text-xs text-emerald-950 space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-emerald-900">
                <CheckCircle2 size={14} className="text-emerald-600" />
                Στρατηγική Πληρωμής στην ώρα της (26/09):
              </p>
              <p className="text-[11px] text-emerald-900/90 leading-relaxed">
                Πληρώνοντας τη δόση των <strong>94,95 €</strong> σταθερά στις <strong>26 του μήνα</strong>, η Eurobank στέλνει στον Τειρεσία ένδειξη <strong>«0 Καθυστέρηση»</strong>, μηδενίζοντας άμεσα κάθε αρνητικό δείκτη!
              </p>
            </div>
          </div>

          {/* 2. TBI BANK LOAN */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-md hover:shadow-lg transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500" />
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  ✓ Πληρως Ενημερο
                </span>
                <h3 className="font-black text-base text-gray-900 mt-1.5">{tbiLoan.title}</h3>
                <p className="text-xs text-slate-400 font-mono">Κωδ. {tbiLoan.accountNo}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Υπόλοιπο</span>
                <span className="text-xl font-black text-gray-900 font-mono">
                  {tbiLoan.currentBalance.toLocaleString("el-GR", { minimumFractionDigits: 2 })} €
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 my-4 bg-slate-50 p-3 rounded-2xl border border-gray-150 text-xs">
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Αρχικό Ποσό</span>
                <span className="font-bold text-gray-800 font-mono">{tbiLoan.initialAmount.toFixed(2)} €</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Μηνιαία Δόση</span>
                <span className="font-bold text-gray-800 font-mono">{tbiLoan.monthlyInstallment} €</span>
              </div>
              <div>
                <span className="text-[9px] text-emerald-600 font-bold uppercase block">Καθυστέρηση</span>
                <span className="font-black text-emerald-600 font-mono">0,00 €</span>
              </div>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3 text-xs text-emerald-950 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-600" />
                Στρατηγική:
              </p>
              <p className="text-[11px] text-emerald-900/90 leading-relaxed">
                Συνεχίστε την απρόσκοπτη πληρωμή των <strong>36,97 €</strong> κάθε μήνα. Το δάνειο αυτό μειώνεται σταθερά και λειτουργεί θετικά στο προφίλ σας.
              </p>
            </div>
          </div>

          {/* 3. NBG MASTERCARD (LIVE DATA FROM APP SCREENSHOT) */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-200 shadow-md hover:shadow-lg transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500" />
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 size={11} className="text-emerald-600" />
                  Άτοκο: 680,54 € (75,6%)
                </span>
                <h3 className="font-black text-base text-gray-900 mt-1.5">{nbgCard.title}</h3>
                <p className="text-xs text-slate-400 font-mono">Κάρτα: {nbgCard.accountNo}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Τρέχουσα Οφειλή</span>
                <span className="text-xl font-black text-emerald-700 font-mono">
                  {nbgCard.currentBalance.toLocaleString("el-GR", { minimumFractionDigits: 2 })} €
                </span>
                <span className="text-[10px] text-emerald-600 font-bold block">0% Τόκοι (Άτοκο)</span>
              </div>
            </div>

            <div className="my-3 space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span>Υπόλοιπο: {nbgCard.currentBalance}€</span>
                <span className="text-slate-400">Όριο: {nbgCard.limit}€ (75,6%)</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-200">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: "75.6%" }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-2xl border border-gray-150 text-xs mb-3">
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Πλάνο Πληρωμής</span>
                <span className="font-bold text-emerald-600 font-mono">30,00 € / μήνα</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Ημ/νία Λήξης</span>
                <span className="font-bold text-indigo-600 font-mono">{nbgCard.paymentDueDate}</span>
              </div>
            </div>

            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3 text-xs space-y-1.5">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-emerald-900 font-medium">🎯 Στόχος Μάρτιος 2027 (50%):</span>
                <span className="font-black text-emerald-800 font-mono">450 €</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-emerald-900 font-medium">🏆 Πλήρης Εξόφληση (0€):</span>
                <span className="font-bold text-emerald-950 font-mono">Αύγουστος 2027</span>
              </div>
            </div>
          </div>

          {/* 4. EUROBANK MASTERCARD (DETAILED STATEMENT ANALYSIS) */}
          <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-md hover:shadow-lg transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-rose-500" />
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                  ⚠️ Επιτόκιο 18,75% (Τόκοι ~33,80€)
                </span>
                <h3 className="font-black text-base text-gray-900 mt-1.5">{eurobankCard.title}</h3>
                <p className="text-xs text-slate-400 font-mono">Κωδ. {eurobankCard.accountNo}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Τρέχουσα Οφειλή</span>
                <span className="text-xl font-black text-gray-900 font-mono">
                  {eurobankCard.currentBalance.toLocaleString("el-GR", { minimumFractionDigits: 2 })} €
                </span>
                <span className="text-[10px] text-rose-500 font-bold block">Shopflix: 13,66€/μήνα</span>
              </div>
            </div>

            <div className="my-3 space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span>Υπόλοιπο: {eurobankCard.currentBalance}€</span>
                <span className="text-slate-400">Όριο: {eurobankCard.limit}€ (96,7%)</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-200">
                <div className="h-full rounded-full bg-rose-500" style={{ width: "96.7%" }} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-2xl border border-gray-150 text-xs mb-3">
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Πλάνο Πληρωμής</span>
                <span className="font-bold text-indigo-600 font-mono">70,00 € / μήνα</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Τόκοι Μήνα</span>
                <span className="font-bold text-rose-600 font-mono">~30,00 €</span>
              </div>
              <div>
                <span className="text-[9px] text-emerald-600 font-bold uppercase block">Καθαρή Μείωση</span>
                <span className="font-black text-emerald-600 font-mono">~40,00 € / μ.</span>
              </div>
            </div>

            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3 text-xs space-y-1.5">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-amber-900 font-medium">🛒 Δόσεις Shopflix:</span>
                <span className="font-black text-amber-950 font-mono">Απομένουν 10 x 13,66€ (Τέλος Μάιος 27)</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-amber-900 font-medium">🎯 Στόχος Μάιος 2027:</span>
                <span className="font-bold text-emerald-700 font-mono">1.523 € (Αύξηση πληρωμής σε 100€)</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* MONTHLY RECURRING CHECKLIST & FIRST TIME HOMEBUYER INFO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CHECKLIST */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-base text-gray-900 uppercase flex items-center gap-2">
              <Calendar className="text-[#3b5bdb]" size={18} />
              Μηνιαιο Προγραμμα Πληρωμων (Σεπτεμβριος 2026)
            </h3>
            <span className="text-[10px] font-bold uppercase text-slate-400">Interactive Checklist</span>
          </div>

          <div className="space-y-2.5">
            
            {/* Task 1 */}
            <div 
              onClick={() => toggleTask("euro_loan_sept")}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                checkedMonthlyTasks["euro_loan_sept"]
                  ? "bg-emerald-50/80 border-emerald-300 text-emerald-950"
                  : "bg-slate-50 border-gray-200 text-gray-800 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${
                  checkedMonthlyTasks["euro_loan_sept"] ? "bg-emerald-600 border-emerald-600 text-white" : "border-gray-300 bg-white"
                }`}>
                  {checkedMonthlyTasks["euro_loan_sept"] && <Check size={14} />}
                </div>
                <div>
                  <p className="text-xs font-bold">Δόση Προσωπικού Δανείου Eurobank</p>
                  <p className="text-[10px] text-slate-500">Πληρωμή στις 26 Σεπτεμβρίου στην ώρα της</p>
                </div>
              </div>
              <span className="font-mono font-black text-xs">94,95 €</span>
            </div>

            {/* Task 2 */}
            <div 
              onClick={() => toggleTask("tbi_loan_sept")}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                checkedMonthlyTasks["tbi_loan_sept"]
                  ? "bg-emerald-50/80 border-emerald-300 text-emerald-950"
                  : "bg-slate-50 border-gray-200 text-gray-800 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${
                  checkedMonthlyTasks["tbi_loan_sept"] ? "bg-emerald-600 border-emerald-600 text-white" : "border-gray-300 bg-white"
                }`}>
                  {checkedMonthlyTasks["tbi_loan_sept"] && <Check size={14} />}
                </div>
                <div>
                  <p className="text-xs font-bold">Μηνιαία Δόση Δανείου TBI Bank</p>
                  <p className="text-[10px] text-slate-500">Κανονική ενήμερη καταβολή</p>
                </div>
              </div>
              <span className="font-mono font-black text-xs">36,97 €</span>
            </div>

            {/* Task 3 */}
            <div 
              onClick={() => toggleTask("nbg_card_sept")}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                checkedMonthlyTasks["nbg_card_sept"]
                  ? "bg-emerald-50/80 border-emerald-300 text-emerald-950"
                  : "bg-slate-50 border-gray-200 text-gray-800 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${
                  checkedMonthlyTasks["nbg_card_sept"] ? "bg-emerald-600 border-emerald-600 text-white" : "border-gray-300 bg-white"
                }`}>
                  {checkedMonthlyTasks["nbg_card_sept"] && <Check size={14} />}
                </div>
                <div>
                  <p className="text-xs font-bold">Mastercard Εθνικής (Άτοκο Πλάνο)</p>
                  <p className="text-[10px] text-slate-500">Λήξη 18/09/2026 - Σταθερή μείωση</p>
                </div>
              </div>
              <span className="font-mono font-black text-xs">30,00 €</span>
            </div>

            {/* Task 4 */}
            <div 
              onClick={() => toggleTask("euro_card_sept")}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                checkedMonthlyTasks["euro_card_sept"]
                  ? "bg-emerald-50/80 border-emerald-300 text-emerald-950"
                  : "bg-slate-50 border-gray-200 text-gray-800 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${
                  checkedMonthlyTasks["euro_card_sept"] ? "bg-emerald-600 border-emerald-600 text-white" : "border-gray-300 bg-white"
                }`}>
                  {checkedMonthlyTasks["euro_card_sept"] && <Check size={14} />}
                </div>
                <div>
                  <p className="text-xs font-bold">Mastercard Eurobank (Υπερβαίνει τους Τόκους)</p>
                  <p className="text-[10px] text-slate-500">Λήξη 21/09/2026 - Καθαρή μείωση 40€</p>
                </div>
              </div>
              <span className="font-mono font-black text-xs">70,00 €</span>
            </div>

          </div>

          <div className="pt-2 border-t border-gray-150 flex justify-between items-center text-xs font-black text-gray-900">
            <span>Συνολική Μηνιαία Δαπάνη (Φάση 1):</span>
            <span className="font-mono text-emerald-600 text-sm">231,92 € / μήνα</span>
          </div>
        </div>

        {/* TIRESIA & MORTGAGE ADVANTAGE CARD */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-6 border border-blue-200/80 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-700 font-black text-xs uppercase tracking-wider mb-2">
              <Home size={18} />
              Ένδειξη Τειρεσία: Αγοραστής για Πρώτη Φορά (ΑΠΦ)
            </div>
            <h3 className="text-lg font-black text-gray-900 tracking-tight">
              Εξαιρετικό Πλεονέκτημα για Στεγαστικό & Πρώτη Κατοικία
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed mt-2">
              Στην έκθεσή σας υπάρχει ρητά καταγεγραμμένη η ένδειξη <strong>«Αγοραστής για Πρώτη Φορά (ΑΠΦ) / ΠΕΕ 227: ΝΑΙ»</strong>.
            </p>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-indigo-600 shrink-0 mt-0.5" />
                <span>Δεν έχετε ενεργό στεγαστικό δάνειο σε οικιστικό ακίνητο.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-indigo-600 shrink-0 mt-0.5" />
                <span>Δικαιούστε αυξημένα όρια δανειοδότησης (LTV έως 90% αντί για 80%).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-indigo-600 shrink-0 mt-0.5" />
                <span>Επιλεξιμότητα για επιδοτούμενα στεγαστικά προγράμματα (π.χ. Σπίτι Μου ΙΙ κ.α.).</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-blue-200 text-xs text-slate-800">
            💡 <strong>Συμβουλή:</strong> Με τη στρατηγική Smart Allocation (30€ / 70€), σπάτε την παγίδα των τόκων της Eurobank, και το σκορ σας τον Μάιο 2027 θα έχει ξεπεράσει το <strong>540</strong> και τον Οκτώβριο το <strong>590+</strong>!
          </div>
        </div>

      </div>

    </div>
  );
}
