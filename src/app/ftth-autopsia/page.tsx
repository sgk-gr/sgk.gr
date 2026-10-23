"use client";

import React, { Suspense, useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { Loader2, Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle } from "lucide-react";

const AutopsiaView = dynamic(() => import("@/components/autopsia/AutopsiaView"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-900">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
      <p className="text-sm font-bold tracking-wider uppercase text-slate-600">
        Φόρτωση Συστήματος Αυτοψιών FTTH...
      </p>
    </div>
  ),
});

export default function FtthAutopsiaPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "SGK FIBER | Σύστημα Αυτοψιών FTTH";
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("ftth-theme");
    document.body.classList.add("ftth-theme");
    try {
      localStorage.setItem("km_theme_mode", "light");
      const auth = localStorage.getItem("sgk_fiber_auth");
      if (auth === "true") {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }

    return () => {
      document.documentElement.classList.remove("ftth-theme");
      document.body.classList.remove("ftth-theme");
    };
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (cleanEmail === "info@t-contaktor.com" && cleanPassword === "987554") {
      try {
        localStorage.setItem("sgk_fiber_auth", "true");
        localStorage.setItem("sgk_fiber_user_email", cleanEmail);
      } catch {}
      setIsAuthenticated(true);
    } else {
      setError("Λανθασμένο email ή κωδικός πρόσβασης. Η πρόσβαση επιτρέπεται μόνο σε εξουσιοδοτημένους συνεργάτες.");
    }
    setSubmitting(false);
  };

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 30,
          },
        },
      })
  );

  // Initial authentication check loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-4" />
        <p className="text-xs font-bold tracking-widest uppercase text-slate-400">
          Έλεγχος Πρόσβασης SGK FIBER...
        </p>
      </div>
    );
  }

  // Not authenticated: render branded login gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-4 sm:p-6 text-slate-900">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/80 p-6 sm:p-8 space-y-6">
          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-2.5 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm mb-1">
              <img src="/icon.png" alt="SGK FIBER" className="h-12 w-12 object-contain" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 font-sans">
              SGK FIBER
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Σύστημα Αυτοψιών & Τεχνικού Ελέγχου FTTH
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[11px] font-bold border border-blue-100">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Πύλη Εξουσιοδοτημένων Συνεργατών</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-start gap-2 animate-in fade-in duration-200">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-blue-600" />
                Email Χρήστη
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="π.χ. info@t-contaktor.com"
                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-blue-600" />
                Κωδικός Πρόσβασης
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full h-11 px-3.5 pr-10 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
            >
              <span>Είσοδος στην Εφαρμογή</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Footer note */}
          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-[11px] text-slate-400">
              © {new Date().getFullYear()} SGK Digital • Ασφαλής Πλατφόρμα FTTH
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated: render the main application
  return (
    <QueryClientProvider client={queryClient}>
      <main className="ftth-autopsia-scope min-h-screen bg-slate-50 text-slate-900">
        <Suspense
          fallback={
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-900">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
              <p className="text-sm font-bold tracking-wider uppercase text-slate-600">
                Εκκίνηση Περιβάλλοντος...
              </p>
            </div>
          }
        >
          <AutopsiaView />
        </Suspense>
      </main>
    </QueryClientProvider>
  );
}
