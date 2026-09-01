"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, CreditCard, Landmark, AlertCircle, 
  Zap, CheckCircle2, Sliders, Calendar, 
  Sparkles, Check, Home, Target
} from "lucide-react";

export function SpyrosTab() {
  // Simulator State
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

  // Base Data from Tiresias Report (27/08/2026)
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
    lastUpdate: "31/07/2026",
    status: "overdue",
    maxOverdue12M: 2,
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
    maxOverdue12M: 1,
  };

  // Credit Cards
  const nbgCard = {
    title: "Mastercard (Εθνική Τράπεζα)",
    accountNo: "0000050905152477",
    limit: 900.0,
    currentBalance: 905.17,
    overdueBalance: 0.0,
    utilization: (905.17 / 900.0) * 100,
    lastUpdate: "31/07/2026",
    maxOverdue12M: 10,
  };

  const eurobankCard = {
    title: "Mastercard (Eurobank)",
    accountNo: "5458650880293400",
    limit: 2000.0,
    currentBalance: 1987.44,
    overdueBalance: 0.0,
    utilization: (1987.44 / 2000.0) * 100,
    lastUpdate: "27/07/2026",
    maxOverdue12M: 1,
  };

  // Aggregates
  const totalLoanBalance = eurobankLoan.currentBalance + tbiLoan.currentBalance;
  const totalCardBalance = nbgCard.currentBalance + eurobankCard.currentBalance;
  const totalDebt = totalLoanBalance + totalCardBalance;
  const totalCreditLimit = nbgCard.limit + eurobankCard.limit;
  const overallCardUtilization = (totalCardBalance / totalCreditLimit) * 100;
  const totalOverdue = eurobankLoan.overdueBalance;

  // Simulated Score Calculation based on extra payment
  const simulatedStats = (() => {
    let remainingExtra = extraPayment;
    let euroOverduePaid = Math.min(remainingExtra, 95.17);
    remainingExtra -= euroOverduePaid;

    let nbgCardPaid = Math.min(remainingExtra, nbgCard.currentBalance - 270);
    remainingExtra -= nbgCardPaid;

    let euroCardPaid = Math.min(remainingExtra, eurobankCard.currentBalance - 600);
    remainingExtra -= euroCardPaid;

    let scoreBoost = 0;
    if (euroOverduePaid >= 95.17) scoreBoost += 55;
    if (nbgCardPaid > 50) scoreBoost += 35;
    if (nbgCardPaid > 450) scoreBoost += 30;
    if (euroCardPaid > 500) scoreBoost += 40;
    if (euroCardPaid > 980) scoreBoost += 35;

    const projectedScore = Math.min(maxScore, currentScore + scoreBoost);
    const projectedRisk = Math.max(8, defaultProb - (scoreBoost * 0.45));

    return {
      euroOverduePaid,
      nbgCardPaid,
      euroCardPaid,
      projectedScore,
      projectedRisk: projectedRisk.toFixed(1),
    };
  })();

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
              Αναλυτική απεικόνιση πιστοληπτικού προφίλ βάσει της επίσημης έκθεσης <strong>Τειρεσία (27/08/2026)</strong>. 
              Οδηγός βήμα-προς-βήμα για την αύξηση της βαθμολογίας (Behavior Score) από <strong>326</strong> σε <strong>520+</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-900/90 border border-slate-800 px-4 py-3 rounded-2xl flex items-center gap-3 shadow-inner">
              <Calendar size={18} className="text-indigo-400" />
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Ημ/νια Εκθεσης</p>
                <p className="text-xs font-bold text-white font-mono">27/08/2026</p>
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
              <span className="text-rose-500 font-mono">326 (Τρέχον)</span>
              <span className="text-slate-400 font-mono">380 (Fair)</span>
              <span className="text-emerald-600 font-mono">520+ (Στόχος)</span>
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

          <div className="bg-amber-50 rounded-2xl p-3.5 border border-amber-200/60 text-xs text-amber-900 space-y-1">
            <div className="flex items-center justify-between font-bold">
              <span>Πιθανότητα Αθέτησης (Default Risk):</span>
              <span className="font-mono text-rose-600 font-black text-sm">{defaultProb}%</span>
            </div>
            <p className="text-[11px] text-amber-800/90 leading-tight">
              💡 Μετά τον μηδενισμό της καθυστέρησης των 95€ και την ελάφρυνση των καρτών, το σκορ μετακινείται αυτόματα στην πράσινη ζώνη (520+).
            </p>
          </div>
        </div>

        {/* CARD 2: TOTAL OBLIGATIONS BREAKDOWN */}
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Συνολικες Οφειλες</p>
              <h3 className="text-lg font-black text-gray-900 tracking-tight mt-0.5">Υπολοιπο Χρεων</h3>
            </div>
            <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-blue-500/10 text-blue-600 border border-blue-500/20">
              4 Προϊόντα
            </span>
          </div>

          <div className="my-3">
            <p className="text-3xl font-black text-gray-900 tracking-tight">
              {totalDebt.toLocaleString("el-GR", { minimumFractionDigits: 2 })} €
            </p>
            <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-gray-100">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Δανεια (2)</span>
                <span className="font-black text-gray-800 text-sm font-mono">
                  {totalLoanBalance.toLocaleString("el-GR", { minimumFractionDigits: 2 })} €
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-gray-100">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Καρτες (2)</span>
                <span className="font-black text-gray-800 text-sm font-mono">
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

        {/* CARD 3: CREDIT UTILIZATION & OVERDUE */}
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Χρηση Πιστωτικων Οριων</p>
              <h3 className="text-lg font-black text-gray-900 tracking-tight mt-0.5">Card Utilization</h3>
            </div>
            <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-rose-500/10 text-rose-600 border border-rose-500/20">
              {overallCardUtilization.toFixed(1)}% (Κορεσμός)
            </span>
          </div>

          <div className="my-3 space-y-2">
            <div className="flex justify-between text-xs font-bold text-gray-700">
              <span>Χρησιμοποίηση: {totalCardBalance.toFixed(0)}€</span>
              <span className="text-slate-400">Όριο: {totalCreditLimit}€</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-200">
              <div 
                className="h-full rounded-full bg-rose-500"
                style={{ width: `${Math.min(100, overallCardUtilization)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500">
              🎯 <strong>Ιδανικός Στόχος Τειρεσία:</strong> Χρήση κάτω από <strong>30%</strong> (δηλαδή σύνολο καρτών κάτω από 870€).
            </p>
          </div>

          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-rose-600 shrink-0" />
              <span className="font-bold text-rose-900">Τρέχουσα Καθυστέρηση:</span>
            </div>
            <span className="font-mono font-black text-rose-700">{totalOverdue.toFixed(2)} € (1 δόση)</span>
          </div>
        </div>

      </div>

      {/* DETAILED ACTIVE OBLIGATIONS CARDS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-gray-900 tracking-tight uppercase flex items-center gap-2">
            <Landmark className="text-[#3b5bdb]" size={20} />
            Αναλυτικη Κατασταση Ενεργων Χορηγησεων (Τειρεσιας)
          </h2>
          <span className="text-xs font-bold text-slate-500">4 Ενεργά Προϊόντα</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* 1. EUROBANK LOAN */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-md hover:shadow-lg transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-rose-500" />
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                  ⚠️ Καθυστερηση 1 Δοσης
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
                <span className="text-[9px] text-rose-500 font-bold uppercase block">Σε Καθυστέρηση</span>
                <span className="font-black text-rose-600 font-mono">{eurobankLoan.overdueBalance} €</span>
              </div>
            </div>

            <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-3 text-xs text-rose-950 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <Zap size={14} className="text-rose-600" />
                ΑΜΕΣΗ ΕΝΕΡΓΕΙΑ #1 (Κορυφαία Προτεραιότητα):
              </p>
              <p className="text-[11px] text-rose-900/90 leading-relaxed">
                Πληρώστε τα <strong>95,17 €</strong> άμεσα. Με αυτό το ποσό, ο δείκτης καθυστέρησης μηδενίζει αμέσως στην επόμενη ανανέωση του Τειρεσία και δίνει άμεσα +50 πόντους στο Behavior Score!
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

          {/* 3. NBG MASTERCARD */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-md hover:shadow-lg transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-amber-500" />
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                  💳 Εξαντλημενο Οριο (100.5%)
                </span>
                <h3 className="font-black text-base text-gray-900 mt-1.5">{nbgCard.title}</h3>
                <p className="text-xs text-slate-400 font-mono">Κωδ. {nbgCard.accountNo}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Υπόλοιπο</span>
                <span className="text-xl font-black text-gray-900 font-mono">
                  {nbgCard.currentBalance.toLocaleString("el-GR", { minimumFractionDigits: 2 })} €
                </span>
              </div>
            </div>

            <div className="my-3 space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span>Υπόλοιπο: {nbgCard.currentBalance}€</span>
                <span className="text-slate-400">Όριο: {nbgCard.limit}€</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-200">
                <div className="h-full rounded-full bg-amber-500" style={{ width: "100%" }} />
              </div>
            </div>

            <div className="bg-slate-50 border border-gray-150 rounded-2xl p-3 text-xs space-y-1.5">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-600">Στόχος 1 (Κάτω από όριο):</span>
                <span className="font-bold text-gray-900 font-mono">850 € (Καταβολή ~60€)</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-600">Στόχος 2 (50% Όριο - Sweet Spot):</span>
                <span className="font-bold text-emerald-600 font-mono">450 € (Καταβολή ~455€)</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-600">Στόχος 3 (30% Όριο - Optimal):</span>
                <span className="font-bold text-emerald-700 font-mono">270 € (Καταβολή ~635€)</span>
              </div>
            </div>
          </div>

          {/* 4. EUROBANK MASTERCARD */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-md hover:shadow-lg transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-amber-500" />
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                  💳 Εξαντλημενο Οριο (99.4%)
                </span>
                <h3 className="font-black text-base text-gray-900 mt-1.5">{eurobankCard.title}</h3>
                <p className="text-xs text-slate-400 font-mono">Κωδ. {eurobankCard.accountNo}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Υπόλοιπο</span>
                <span className="text-xl font-black text-gray-900 font-mono">
                  {eurobankCard.currentBalance.toLocaleString("el-GR", { minimumFractionDigits: 2 })} €
                </span>
              </div>
            </div>

            <div className="my-3 space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span>Υπόλοιπο: {eurobankCard.currentBalance}€</span>
                <span className="text-slate-400">Όριο: {eurobankCard.limit}€</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-200">
                <div className="h-full rounded-full bg-amber-500" style={{ width: "99.4%" }} />
              </div>
            </div>

            <div className="bg-slate-50 border border-gray-150 rounded-2xl p-3 text-xs space-y-1.5">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-600">Στόχος 1 (70% Όριο):</span>
                <span className="font-bold text-gray-900 font-mono">1.400 € (Καταβολή ~587€)</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-600">Στόχος 2 (50% Όριο - Sweet Spot):</span>
                <span className="font-bold text-emerald-600 font-mono">1.000 € (Καταβολή ~987€)</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-600">Στόχος 3 (30% Όριο - Optimal):</span>
                <span className="font-bold text-emerald-700 font-mono">600 € (Καταβολή ~1.387€)</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* INTERACTIVE PAYOFF & CREDIT SCORE SIMULATOR */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-black uppercase tracking-widest mb-1.5">
              <Sliders size={12} className="text-indigo-400" />
              Live Interactive Simulator
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Προσομοιωτής Αποπληρωμής & Εκτίμηση Score Τειρεσία
            </h2>
          </div>

          <div className="bg-slate-850 px-4 py-2 rounded-2xl border border-slate-750 text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Επιπλέον Διαθέσιμο Ποσό</span>
            <span className="text-xl font-black text-emerald-400 font-mono">{extraPayment} €</span>
          </div>
        </div>

        {/* Slider Input */}
        <div className="space-y-3">
          <div className="flex justify-between text-xs font-bold text-slate-300">
            <span>Σύρετε για να επιλέξετε έκτακτο ποσό αποπληρωμής:</span>
            <span className="text-indigo-400 font-mono">{extraPayment} € / μήνα</span>
          </div>
          <input 
            type="range" 
            min={50} 
            max={2000} 
            step={50}
            value={extraPayment}
            onChange={(e) => setExtraPayment(Number(e.target.value))}
            className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>50 €</span>
            <span>500 €</span>
            <span>1.000 €</span>
            <span>1.500 €</span>
            <span>2.000 €</span>
          </div>
        </div>

        {/* Results of Simulation */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Προτεραιοτητα 1 (Καθυστερηση)</span>
            <p className="text-sm font-bold text-emerald-400 font-mono">
              {simulatedStats.euroOverduePaid >= 95.17 ? "✓ Εξοφλείται πλήρως (95,17€)" : `Καταβολή ${simulatedStats.euroOverduePaid.toFixed(2)}€`}
            </p>
            <p className="text-[11px] text-slate-400">Μηδενίζει τον Δείκτη Καθυστέρησης στο δάνειο Eurobank.</p>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Προτεραιοτητα 2 (Καρτα Εθνικης)</span>
            <p className="text-sm font-bold text-indigo-400 font-mono">
              -{simulatedStats.nbgCardPaid.toFixed(0)}€ (Υπόλοιπο: {(nbgCard.currentBalance - simulatedStats.nbgCardPaid).toFixed(0)}€)
            </p>
            <p className="text-[11px] text-slate-400">
              Utilization: {(((nbgCard.currentBalance - simulatedStats.nbgCardPaid) / nbgCard.limit) * 100).toFixed(0)}%
            </p>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Προβλεπομενο Behavior Score</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-emerald-300 font-mono">{simulatedStats.projectedScore}</span>
              <span className="text-xs text-emerald-400 font-bold font-mono">+{simulatedStats.projectedScore - currentScore} pts</span>
            </div>
            <p className="text-[11px] text-slate-400">Εκτιμώμενο Default Risk: {simulatedStats.projectedRisk}%</p>
          </div>

        </div>
      </div>

      {/* ROADMAP & TIMELINE MILESTONES */}
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#3b5bdb] flex items-center justify-center font-bold">
            <Target size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black text-gray-900 tracking-tight uppercase">
              Χρονοδιαγραμμα Εξυγιανσης & Σταθμοι (Roadmap)
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Βήμα-προς-βήμα πρόγραμμα για να φτάσετε στο μέγιστο πιστωτικό σκορ
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Milestone 1 */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200/80 space-y-2 relative">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#3b5bdb] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
              ΦΑΣΗ 1 • ΣΕΠ 2026
            </span>
            <h4 className="font-black text-sm text-gray-900 pt-1">Μηδενισμός Καθυστέρησης</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              • Καταβολή <strong>95,17 €</strong> στο δάνειο Eurobank.<br/>
              • Καταβολή <strong>60 €</strong> στην κάρτα Εθνικής για να πέσει κάτω από το όριο (845€).
            </p>
            <div className="text-[11px] font-bold text-emerald-700 font-mono pt-1">
              📈 Αναμενόμενο Score: 380 - 410
            </div>
          </div>

          {/* Milestone 2 */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200/80 space-y-2 relative">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#3b5bdb] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
              ΦΑΣΗ 2 • ΟΚΤ - ΔΕΚ 2026
            </span>
            <h4 className="font-black text-sm text-gray-900 pt-1">Ελάφρυνση Καρτών (50%)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              • Ρίξιμο κάρτας Εθνικής κάτω από <strong>450 €</strong>.<br/>
              • Ρίξιμο κάρτας Eurobank κάτω από <strong>1.400 €</strong>.<br/>
              • Σταθερή πληρωμή δόσεων δανείων στην ώρα τους.
            </p>
            <div className="text-[11px] font-bold text-emerald-700 font-mono pt-1">
              📈 Αναμενόμενο Score: 440 - 470
            </div>
          </div>

          {/* Milestone 3 */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200/80 space-y-2 relative">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              ΦΑΣΗ 3 • ΙΑΝ - ΜΑΡ 2027
            </span>
            <h4 className="font-black text-sm text-gray-900 pt-1">Καθαρισμός 12μηνου Ιστορικού</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              • Συμπληρώνονται 12 μήνες από την παλιά καθυστέρηση του 01/2026 στην Εθνική!<br/>
              • Το ιστορικό «σβήνει» από το στατιστικό παράθυρο.
            </p>
            <div className="text-[11px] font-bold text-emerald-700 font-mono pt-1">
              📈 Αναμενόμενο Score: 490 - 520+
            </div>
          </div>

          {/* Milestone 4 */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200/80 space-y-2 relative">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              ΦΑΣΗ 4 • ΚΑΛΟΚΑΙΡΙ 2027
            </span>
            <h4 className="font-black text-sm text-gray-900 pt-1">Άριστο Πιστωτικό Προφίλ</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              • Κάρτες σε επίπεδα &lt;30% χρήσης.<br/>
              • Τα δάνεια έχουν μειωθεί σημαντικά.<br/>
              • Πλήρης πρόσβαση σε τραπεζικό δανεισμό / στεγαστικό ΑΠΦ.
            </p>
            <div className="text-[11px] font-bold text-emerald-700 font-mono pt-1">
              🏆 Score: 540+ (A-Tier Rating)
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
                  <p className="text-xs font-bold">Δόση Προσωπικού Δανείου Eurobank + Καθυστέρηση</p>
                  <p className="text-[10px] text-slate-500">Ποσό: 94,95€ + 95,17€ καθυστέρηση = 190,12€</p>
                </div>
              </div>
              <span className="font-mono font-black text-xs">190,12 €</span>
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
                  <p className="text-xs font-bold">Καταβολή Mastercard Εθνικής (Στόχος &lt; 850€)</p>
                  <p className="text-[10px] text-slate-500">Ελάχιστη + επιπλέον για μείωση κάτω από το όριο</p>
                </div>
              </div>
              <span className="font-mono font-black text-xs">~80,00 €</span>
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
                  <p className="text-xs font-bold">Καταβολή Mastercard Eurobank</p>
                  <p className="text-[10px] text-slate-500">Ελάχιστη καταβολή ή στοχευμένη πληρωμή</p>
                </div>
              </div>
              <span className="font-mono font-black text-xs">~100,00 €</span>
            </div>

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
            💡 <strong>Συμβουλή:</strong> Μόλις το Behavior Score σταθεροποιηθεί πάνω από 500 τους επόμενους μήνες, η πόρτα για οποιοδήποτε στεγαστικό ή επιχειρηματικό πρόγραμμα είναι ορθάνοιχτη με τους καλύτερους όρους της αγοράς.
          </div>
        </div>

      </div>

    </div>
  );
}
