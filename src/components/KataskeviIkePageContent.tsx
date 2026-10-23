"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Check, 
  Phone, 
  X, 
  ArrowUp, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  Zap, 
  Globe, 
  Mail, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  Building2, 
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { sendContactEmail } from "@/lib/resend";
import confetti from "canvas-confetti";
import { useTracking } from "@/hooks/useTracking";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionDivider from "@/components/SectionDivider";

function KataskeviIkeContent() {
  useTracking("Kataskevi Ike Page");

  const searchParams = useSearchParams();
  const queryName = searchParams.get("name") || "";
  const queryPhone = searchParams.get("phone") || "";
  const queryVat = searchParams.get("vat") || "";

  const [formData, setFormData] = useState({
    name: queryName,
    phone: queryPhone,
    email: "",
    vat: queryVat,
    contactPreference: "phone",
    acceptTerms: true,
    acceptPromo: true
  });

  const [submittedVat, setSubmittedVat] = useState("");
  const [submittedPhone, setSubmittedPhone] = useState("");
  const [submittedPreference, setSubmittedPreference] = useState("phone");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCtaClick = () => {
    const element = document.getElementById("offer-form-box");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      const input = document.getElementById("hero-vat-input");
      if (input) {
        input.focus();
      }
    } else {
      scrollToTop();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email || !formData.vat) {
      toast.error("Συμπληρώστε όλα τα απαραίτητα πεδία (συμπεριλαμβανομένου του ΑΦΜ).");
      return;
    }

    setLoading(true);
    try {
      await sendContactEmail({
        type: "ike_offer",
        offerPrice: "80",
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: `ΑΦΜ: ${formData.vat}`,
        message: `Αίτημα κατασκευής σελίδας για Ι.Κ.Ε. (Κατασκευή Ιστοσελίδας ΓΕΜΗ)\nΑΦΜ Εταιρείας: ${formData.vat}`,
        contactPreference: formData.contactPreference,
        marketingConsent: formData.acceptPromo,
      });

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#3b5bdb", "#4ade80", "#facc15", "#ffffff"]
      });

      setSubmittedVat(formData.vat);
      setSubmittedPhone(formData.phone);
      setSubmittedPreference(formData.contactPreference);
      setShowModal(true);

      setFormData({
        name: "",
        phone: "",
        email: "",
        vat: "",
        contactPreference: "phone",
        acceptTerms: true,
        acceptPromo: true
      });
    } catch (err: any) {
      console.error(err);
      toast.error("Κάτι πήγε στραβά, προσπαθήστε ξανά.");
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      q: "Είναι υποχρεωτική η κατασκευή ιστοσελίδας για κάθε νέα ΙΚΕ;",
      a: "Ναι, βάσει του Άρθρου 47 §2 του Νόμου 4072/2012 και των υπουργικών αποφάσεων του Γ.Ε.ΜΗ., κάθε ΙΚΕ οφείλει να διαθέτει εταιρική ιστοσελίδα και να τη δηλώσει στο Γ.Ε.ΜΗ. εντός ενός (1) μηνός (30 ημερών) από τη σύστασή της. Η μη συμμόρφωση επισύρει αυτόματα πρόστιμα από 500€ έως 100.000€ και αναστολή έκδοσης πιστοποιητικών."
    },
    {
      q: "Πόσο κοστίζει η ιστοσελίδα ΙΚΕ στην SGK Digital;",
      a: "Το πλήρες πακέτο κοστίζει 80€ ΤΕΛΙΚΗ ΤΙΜΗ ΜΕ ΦΠΑ (δεν είναι 80€ + ΦΠΑ, αλλά 80€ τελική τιμή συμπεριλαμβανομένου ΦΠΑ!). Περιλαμβάνει την κατασκευή της ιστοσελίδας, κατοχύρωση .gr domain name για 1 έτος, ταχύτατο hosting σε ιδιωτικούς servers, πιστοποιητικό SSL και εταιρικό email. Από τον 2ο χρόνο, η ετήσια ανανέωση hosting παραμένει σταθερά 80€/έτος με ΦΠΑ, χωρίς καμία απολύτως δέσμευση."
    },
    {
      q: "Ποια είναι τα 10 υποχρεωτικά στοιχεία που πρέπει να περιέχει;",
      a: "Η ιστοσελίδα πρέπει να αναγράφει υποχρεωτικά: 1) Εταιρική Επωνυμία & Διακριτικό Τίτλο, 2) Αριθμό Γ.Ε.ΜΗ. & Μητρώο Επιμελητηρίου, 3) Α.Φ.Μ. & αρμόδια Δ.Ο.Υ., 4) Διεύθυνση Έδρας & Στοιχεία Επικοινωνίας, 5) Εταιρικό Κεφάλαιο & Εισφορές Εταίρων, 6) Ημερομηνία λήξης πρώτης διαχειριστικής περιόδου, 7) Στοιχεία Διαχειριστών, 8) Στοιχεία Εταίρων, 9) Κατάσταση Εκκαθάρισης (εφόσον συντρέχει) και 10) Ετήσιες Οικονομικές Καταστάσεις / Ισολογισμούς."
    },
    {
      q: "Πόσος χρόνος χρειάζεται για να είναι έτοιμη η ιστοσελίδα;",
      a: "Η παράδοση ολοκληρώνεται εντός 24 ωρών από την παραλαβή του ΑΦΜ της εταιρείας σας. Μέσω του επίσημου OpenData API του Γ.Ε.ΜΗ., αντλούμε αυτόματα τα επίσημα στοιχεία της σύστασης, εκμηδενίζοντας τα λάθη και τις καθυστερήσεις."
    },
    {
      q: "Πώς δηλώνω την ιστοσελίδα στο Γ.Ε.ΜΗ. (businessportal.gr);",
      a: "Μόλις ολοκληρώσουμε την κατασκευή, σας στέλνουμε το επίσημο link (π.χ. https://mycompany.gr) και γραπτή βεβαίωση. Συνδέεστε στο businessportal.gr με τους κωδικούς Taxisnet της εταιρείας, επιλέγετε «Αίτηση Μεταβολής / Δήλωση Ιστοτόπου», επικολλάτε το link και η καταχώριση επικυρώνεται άμεσα σε 3 λεπτά."
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#4ade80] selection:text-black">
      <style dangerouslySetInnerHTML={{__html: `.global-promo-bar { display: none !important; }`}} />
      
      {/* Official SGK Navbar */}
      <Navbar />

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-300 border-2 border-[#3b5bdb]">
            <button 
              onClick={() => setShowModal(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
            >
              <X size={24} />
            </button>
            <div className="w-16 h-16 bg-[#4ade80]/20 rounded-full flex items-center justify-center mx-auto mb-5">
              <Check className="w-8 h-8 text-[#22c55e]" />
            </div>
            <h3 className="text-2xl font-heading font-black text-[#3b5bdb] text-center mb-2">Συγχαρητήρια! 🎉</h3>
            <p className="text-gray-700 text-center mb-4 text-sm leading-relaxed">
              Το αίτημά σας για την κατασκευή σελίδας Ι.Κ.Ε. (ΑΦΜ: <strong className="font-bold text-[#3b5bdb]">{submittedVat}</strong>) καταχωρήθηκε επιτυχώς!
            </p>
            <p className="text-xs text-gray-500 text-center mb-6 bg-slate-50 p-3 rounded-xl border border-gray-100">
              {submittedPreference === "email" ? (
                <>Θα επικοινωνήσουμε άμεσα μέσω email για τα πρώτα βήματα. <br/><span className="italic text-gray-400">(Χωρίς ανεπιθύμητες ενοχλήσεις 🤫)</span></>
              ) : (
                <>Θα σας καλέσουμε άμεσα στο <strong>{submittedPhone}</strong> για να ξεκινήσουμε! <br/><span className="italic text-gray-400">(Χωρίς ανεπιθύμητες ενοχλήσεις 🤫)</span></>
              )}
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-6 text-center">
              <p className="text-xs font-black text-gray-800 mb-2 uppercase tracking-wider">
                Ζωντανά δείγματα ιστοσελίδων Ι.Κ.Ε.:
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <a 
                  href="https://meltech-ike.gr/"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center flex-1 bg-[#3b5bdb] hover:bg-[#2b4bba] text-white font-bold py-2.5 px-3 rounded-xl transition-all duration-300 gap-1.5 text-xs shadow-sm"
                >
                  ⚡ MELTECH Ι.Κ.Ε. ↗
                </a>
                <a 
                  href="https://www.sellascountryhouses.gr/"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center flex-1 bg-white hover:bg-gray-100 text-gray-800 border border-gray-200 font-bold py-2.5 px-3 rounded-xl transition-all duration-300 gap-1.5 text-xs shadow-sm"
                >
                  🏡 Sellas Houses ↗
                </a>
              </div>
            </div>

            <button 
              onClick={() => setShowModal(false)} 
              className="w-full bg-[#3b5bdb] hover:bg-[#2b4bba] text-white font-bold py-3 rounded-xl transition-colors text-sm"
            >
              Κλείσιμο
            </button>
          </div>
        </div>
      )}

      {/* Main Hero Section: Bold, Snappy, High Energy */}
      <section className="relative w-full pt-32 pb-16 md:pt-36 md:pb-24 bg-white overflow-hidden">
        {/* Subtle decorative geometric accents */}
        <div className="absolute top-20 right-[5%] w-72 h-72 bg-[#3b5bdb]/5 rounded-full blur-3xl pointer-events-none -z-0"></div>
        <div className="absolute bottom-10 left-[5%] w-60 h-60 bg-[#4ade80]/10 rounded-full blur-2xl pointer-events-none -z-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
            
            {/* Left Content Column */}
            <div className="w-full lg:w-[55%] flex flex-col items-start">
              
              {/* Neo-brutalist Badge Stack */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <div className="bg-[#facc15] text-black font-black text-xs uppercase tracking-widest px-3.5 py-1.5 shadow-sm border border-black/5">
                  ΝΟΜΟΣ 4072/2012
                </div>
                <div className="bg-[#111111] text-white font-black text-xs uppercase tracking-wider px-3.5 py-1.5 shadow-sm">
                  100% ΣΥΜΜΟΡΦΩΣΗ Γ.Ε.ΜΗ.
                </div>
                <div className="bg-[#4ade80] text-black font-extrabold text-xs uppercase tracking-wider px-3 py-1.5 shadow-sm flex items-center gap-1.5">
                  <Zap size={13} className="text-black" /> ΠΑΡΑΔΟΣΗ ΣΕ 24h
                </div>
              </div>

              {/* Punchy Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-heading font-black tracking-tight leading-[1.08] text-black mb-6">
                Κατασκευή Σελίδας <br className="hidden sm:inline" />
                για ΙΚΕ &amp; ΓΕΜΗ <br />
                <span className="text-[#3b5bdb]">Μόνο 80€ Τελική Τιμή</span>
              </h1>

              {/* Clear Subtitle */}
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-8 max-w-xl font-normal">
                Ολοκληρωμένη εταιρική ιστοσελίδα για τη νέα σας Ι.Κ.Ε. έτοιμη σε 24 ώρες. Περιλαμβάνει <strong className="text-black font-bold">κατοχύρωση .gr domain</strong>, <strong className="text-black font-bold">1 έτος ταχύτατο hosting</strong>, SSL, εταιρικό email και <strong className="text-black font-bold">αυτόματη ανάρτηση όλων των υποχρεωτικών στοιχείων</strong> για το Γ.Ε.ΜΗ.
              </p>

              {/* Snappy Bullet Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-xl mb-8">
                <div className="flex items-center text-sm font-bold text-gray-900 bg-[#f4f2ea] border border-black/5 px-4 py-3 rounded-lg shadow-sm">
                  <span className="w-3 h-3 bg-[#4ade80] mr-3 shrink-0"></span>
                  <span>80€ Τελική με ΦΠΑ (όχι +ΦΠΑ)</span>
                </div>
                <div className="flex items-center text-sm font-bold text-gray-900 bg-[#f4f2ea] border border-black/5 px-4 py-3 rounded-lg shadow-sm">
                  <span className="w-3 h-3 bg-[#4ade80] mr-3 shrink-0"></span>
                  <span>Παράδοση εντός 24 Ωρών</span>
                </div>
                <div className="flex items-center text-sm font-bold text-gray-900 bg-[#f4f2ea] border border-black/5 px-4 py-3 rounded-lg shadow-sm">
                  <span className="w-3 h-3 bg-[#4ade80] mr-3 shrink-0"></span>
                  <span>100% Συμβατή με Γ.Ε.ΜΗ.</span>
                </div>
                <div className="flex items-center text-sm font-bold text-gray-900 bg-[#f4f2ea] border border-black/5 px-4 py-3 rounded-lg shadow-sm">
                  <span className="w-3 h-3 bg-[#4ade80] mr-3 shrink-0"></span>
                  <span>Ανανέωση 80€/έτος (Χωρίς Δέσμευση)</span>
                </div>
              </div>

              {/* Live Samples Strip */}
              <div className="w-full max-w-xl pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <span className="text-xs font-black uppercase tracking-wider text-gray-500 shrink-0">
                  Ζωντανά δείγματα:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <a 
                    href="https://meltech-ike.gr/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3b5bdb] bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-md transition-colors"
                  >
                    ⚡ MELTECH Ι.Κ.Ε. ↗
                  </a>
                  <a 
                    href="https://www.sellascountryhouses.gr/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-800 bg-gray-100 hover:bg-gray-200 border border-gray-200 px-3 py-1.5 rounded-md transition-colors"
                  >
                    🏡 Sellas Houses ↗
                  </a>
                </div>
              </div>

            </div>

            {/* Right Interactive Order Form Box */}
            <div id="offer-form-box" className="w-full lg:w-[45%] max-w-[480px]">
              
              {/* Neo-brutalist Top Ribbon */}
              <div className="bg-[#facc15] text-black font-black text-xs uppercase tracking-wider py-2.5 px-4 rounded-t-xl text-center border-t-2 border-x-2 border-black/10 shadow-md flex items-center justify-center gap-1.5">
                <Sparkles size={14} className="text-black" />
                <span>ΚΑΤΑΣΚΕΥΗ ΣΕ 24h • 80€ ΤΕΛΙΚΗ ΜΕ ΦΠΑ</span>
              </div>

              {/* Form Container */}
              <div className="w-full bg-[#3b5bdb] text-white p-6 sm:p-8 rounded-b-xl shadow-2xl border-x-2 border-b-2 border-[#3b5bdb] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none"></div>

                <h2 className="text-2xl font-heading font-black mb-1 text-white">
                  Άμεση Παραγγελία Σελίδας ΙΚΕ
                </h2>
                <p className="text-xs text-blue-100 mb-6 font-normal leading-relaxed">
                  Συμπληρώστε το <strong>ΑΦΜ της εταιρείας σας</strong> για αυτόματη άντληση στοιχείων και παράδοση σε 24 ώρες.
                </p>

                <form onSubmit={handleSubmit} className="space-y-3.5 relative z-10">
                  {/* VAT Input */}
                  <div>
                    <label className="block text-xs font-bold text-blue-100 uppercase tracking-wider mb-1">
                      ΑΦΜ Εταιρείας *
                    </label>
                    <input 
                      id="hero-vat-input"
                      type="text" 
                      required 
                      value={formData.vat}
                      onChange={(e) => setFormData({...formData, vat: e.target.value})}
                      className="w-full bg-white text-black font-mono font-bold rounded-lg px-4 py-3 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4ade80] transition-all text-sm border border-white" 
                      placeholder="π.χ. 802345678" 
                    />
                  </div>

                  {/* Name & Phone Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-blue-100 uppercase tracking-wider mb-1">
                        Ονοματεπώνυμο *
                      </label>
                      <input 
                        type="text" 
                        required 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-white text-black font-medium rounded-lg px-3.5 py-2.5 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4ade80] transition-all text-sm" 
                        placeholder="π.χ. Νίκος Παπαδόπουλος" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-blue-100 uppercase tracking-wider mb-1">
                        Τηλέφωνο *
                      </label>
                      <input 
                        type="tel" 
                        required 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-white text-black font-medium rounded-lg px-3.5 py-2.5 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4ade80] transition-all text-sm" 
                        placeholder="π.χ. 6900000000" 
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-bold text-blue-100 uppercase tracking-wider mb-1">
                      Email Επικοινωνίας *
                    </label>
                    <input 
                      type="email" 
                      required 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-white text-black font-medium rounded-lg px-3.5 py-2.5 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4ade80] transition-all text-sm" 
                      placeholder="π.χ. info@company.gr" 
                    />
                  </div>

                  {/* Contact Preference Selector */}
                  <div className="pt-1">
                    <span className="block text-xs font-bold text-blue-100 uppercase tracking-wider mb-1.5">
                      Προτίμηση Επικοινωνίας:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, contactPreference: "phone"})}
                        className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                          formData.contactPreference === "phone"
                            ? "bg-[#4ade80] border-[#4ade80] text-black shadow-sm"
                            : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                        }`}
                      >
                        <Phone size={13} /> Τηλεφωνικά
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, contactPreference: "email"})}
                        className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                          formData.contactPreference === "email"
                            ? "bg-[#4ade80] border-[#4ade80] text-black shadow-sm"
                            : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                        }`}
                      >
                        <Mail size={13} /> Μέσω Email
                      </button>
                    </div>
                  </div>


                  {/* Opt-in GDPR Consent Checkbox */}
                  <div className="flex items-start gap-2 pt-1 text-[11px] text-white/90 leading-tight">
                    <input 
                      type="checkbox" 
                      id="acceptTerms" 
                      required
                      checked={formData.acceptTerms}
                      onChange={(e) => setFormData({...formData, acceptTerms: e.target.checked})}
                      className="mt-0.5 rounded text-[#4ade80] focus:ring-[#4ade80] w-3.5 h-3.5 shrink-0" 
                    />
                    <label htmlFor="acceptTerms" className="cursor-pointer">
                      Συναινώ να επικοινωνήσετε μαζί μου για την κατασκευή της ιστοσελίδας της Ι.Κ.Ε. μου σύμφωνα με την <a href="/privacy" target="_blank" className="underline hover:text-[#4ade80]">Πολιτική Απορρήτου</a>.
                    </label>
                  </div>

                  {/* Submit Button: Big, Bold, Neon Lime */}
                  <div className="pt-2">
                    <button 
                      disabled={loading}
                      type="submit" 
                      className="w-full bg-[#4ade80] hover:bg-[#22c55e] text-black font-black py-4 px-6 rounded-lg uppercase tracking-wider text-sm transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                    >
                      {loading ? "Αποστολή..." : "ΞΕΚΙΝΗΣΤΕ ΤΗΝ ΚΑΤΑΣΚΕΥΗ ΤΩΡΑ ➔"}
                    </button>
                  </div>
                </form>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Signature SectionDivider: Blue to Lime */}
      <SectionDivider leftColor="bg-[#3b5bdb]" rightColor="bg-[#4ade80]" />

      {/* Welcome Assurance Banner (Snappy Neo-Brutalist Layout) */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-14 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#111111] w-full flex flex-col lg:flex-row items-stretch relative shadow-2xl overflow-hidden border border-black">
            
            {/* Left section: Badges */}
            <div className="flex flex-col justify-center shrink-0 pl-6 lg:pl-10 py-8 relative">
              <div className="bg-[#facc15] self-start px-3 py-1 mb-1">
                <span className="text-black font-black text-xs md:text-sm tracking-widest uppercase">ALL-IN-ONE</span>
              </div>
              <div className="bg-[#3b5bdb] self-start px-5 py-2 -ml-3 relative z-10 shadow-md">
                <h2 className="text-white font-black text-2xl md:text-4xl uppercase tracking-wide">ΕΓΓΥΗΣΗ ΓΕΜΗ</h2>
              </div>
            </div>

            {/* Middle section: Text */}
            <div className="flex-1 flex flex-col justify-center px-6 lg:px-10 py-6 lg:py-8 border-y lg:border-y-0 lg:border-l lg:border-r border-white/10 lg:mx-4">
              <h3 className="text-white font-bold text-lg md:text-xl leading-tight mb-2">
                Απαλλαγείτε οριστικά από το άγχος του ΓΕΜΗ &amp; τα πρόστιμα
              </h3>
              <p className="text-white/70 text-sm md:text-base leading-relaxed">
                Η SGK Digital αναλαμβάνει αυτόματα όλη τη διαδικασία με το ΑΦΜ σας και σας παραδίδει έτοιμο το επίσημο link για το businessportal.gr εντός 24 ωρών.
              </p>
            </div>

            {/* Right section: Metric Badges */}
            <div className="shrink-0 flex items-center justify-center px-6 lg:px-10 py-6 lg:py-8 bg-black/40">
              <div className="grid grid-cols-3 gap-3 md:gap-4 text-center">
                <div className="bg-white/5 border border-white/10 p-3 rounded-lg min-w-[85px]">
                  <div className="text-xl md:text-2xl font-black text-[#4ade80]">24h</div>
                  <div className="text-[10px] uppercase font-bold text-white/60 tracking-wider">Παράδοση</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-3 rounded-lg min-w-[85px]">
                  <div className="text-xl md:text-2xl font-black text-[#facc15]">80€</div>
                  <div className="text-[10px] uppercase font-bold text-white/60 tracking-wider">Τελική με ΦΠΑ</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-3 rounded-lg min-w-[85px]">
                  <div className="text-xl md:text-2xl font-black text-[#3b5bdb]">100%</div>
                  <div className="text-[10px] uppercase font-bold text-white/60 tracking-wider">Αποδοχή</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Signature SectionDivider: Lime to Yellow */}
      <SectionDivider leftColor="bg-[#4ade80]" rightColor="bg-[#facc15]" />

      {/* Pricing Comparison: Snappy Cards on warm off-white background */}
      <section id="kostos" className="py-20 bg-[#f4f2ea]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="bg-[#3b5bdb] text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 shadow-sm inline-block mb-3">
              ΚΑΘΑΡΕΣ ΤΙΜΕΣ • ΧΩΡΙΣ ΚΡΥΦΕΣ ΧΡΕΩΣΕΙΣ
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-black tracking-tight mb-4">
              Επιλογές &amp; Κόστος Κατασκευής Σελίδας ΙΚΕ
            </h2>
            <p className="text-gray-600 text-base leading-relaxed">
              Γιατί η πρόταση της SGK Digital των <strong>80€ τελική τιμή με ΦΠΑ</strong> αποτελεί την πιο συμφέρουσα, διαφανή και ασφαλή λύση για κάθε ελληνική επιχείρηση.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            
            {/* Card 1: Generic Forms */}
            <div className="bg-white border border-gray-250 p-8 shadow-sm flex flex-col justify-between rounded-xl">
              <div>
                <span className="text-gray-400 text-xs font-black uppercase tracking-wider">Βασική Φόρμα</span>
                <h3 className="text-xl font-heading font-bold text-black mt-2 mb-2">Υπηρεσίες Τύπου IKE-Site</h3>
                <div className="text-3xl font-heading font-black text-gray-800 my-4">
                  25€ – 56€ <span className="text-sm font-normal text-gray-400">/ έτος (+ΦΠΑ)</span>
                </div>
                <ul className="space-y-3.5 text-sm text-gray-600">
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 font-black">✗</span>
                    <span>Τιμές χωρίς ΦΠΑ (+24% κατά το checkout)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 font-black">✗</span>
                    <span>Συχνά δεν περιλαμβάνεται .gr domain (έξτρα χρέωση)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 font-black">✗</span>
                    <span>Χειροκίνητη εισαγωγή στοιχείων (κίνδυνος λαθών ΓΕΜΗ)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-amber-500 font-black">!</span>
                    <span>Στατική σελίδα χωρίς υποστήριξη</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 2: SGK DIGITAL HERO CARD */}
            <div className="bg-[#111111] text-white p-8 md:p-10 shadow-2xl relative flex flex-col justify-between rounded-xl border-3 border-[#4ade80] transform md:-translate-y-4">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#4ade80] text-black font-black text-xs py-1 px-4 uppercase tracking-wider shadow-md">
                ⭐ Η #1 ΕΠΙΛΟΓΗ ΣΤΗΝ ΕΛΛΑΔΑ
              </div>
              
              <div>
                <span className="text-[#4ade80] text-xs font-black uppercase tracking-wider">SGK DIGITAL ALL-IN-ONE</span>
                <h3 className="text-2xl font-heading font-black text-white mt-2 mb-1">Ολοκληρωμένο Πακέτο ΓΕΜΗ</h3>
                
                <div className="text-4xl sm:text-5xl font-heading font-black text-[#4ade80] my-4">
                  80€ <span className="text-sm font-bold text-white/80 block sm:inline">ΤΕΛΙΚΗ ΜΕ ΦΠΑ</span>
                </div>
                
                <p className="text-xs text-white/70 mb-6 leading-relaxed">
                  Πλήρης νομική κάλυψη του Νόμου 4072/2012 χωρίς καμία απολύτως κρυφή χρέωση.
                </p>

                <ul className="space-y-3 text-sm text-white/95">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="text-[#4ade80] shrink-0" size={18} />
                    <span><strong>80€ Τελική Τιμή με ΦΠΑ</strong> (περιλαμβάνεται)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="text-[#4ade80] shrink-0" size={18} />
                    <span><strong>Δωρεάν .gr Domain Name</strong> για 1 έτος</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="text-[#4ade80] shrink-0" size={18} />
                    <span><strong>1 Έτος Hosting</strong> σε ταχύτατους servers</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="text-[#4ade80] shrink-0" size={18} />
                    <span><strong>Πιστοποιητικό SSL (HTTPS)</strong> &amp; Εταιρικό Email</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="text-[#4ade80] shrink-0" size={18} />
                    <span><strong>Σύνδεση με OpenData API</strong> του ΓΕΜΗ</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="text-[#4ade80] shrink-0" size={18} />
                    <span><strong>Παράδοση εντός 24 ωρών</strong> &amp; βεβαίωση</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="text-[#4ade80] shrink-0" size={18} />
                    <span>Ανανέωση 80€/έτος με ΦΠΑ από το 2ο έτος (χωρίς δέσμευση)</span>
                  </li>
                </ul>
              </div>

              <button 
                onClick={handleCtaClick}
                className="mt-8 w-full bg-[#4ade80] hover:bg-[#22c55e] text-black font-black py-4 rounded-lg transition-all text-sm uppercase tracking-wider shadow-lg active:scale-[0.98]"
              >
                ΕΠΙΛΟΓΗ ΜΕ 80€ ➔
              </button>
            </div>

            {/* Card 3: Custom Web Development */}
            <div className="bg-white border border-gray-250 p-8 shadow-sm flex flex-col justify-between rounded-xl">
              <div>
                <span className="text-gray-400 text-xs font-black uppercase tracking-wider">Custom Web Development</span>
                <h3 className="text-xl font-heading font-bold text-black mt-2 mb-2">Δυναμική Εμπορική Ιστοσελίδα</h3>
                <div className="text-3xl font-heading font-black text-gray-800 my-4">
                  220€ – 450€ <span className="text-sm font-normal text-gray-400">+ ΦΠΑ</span>
                </div>
                <ul className="space-y-3.5 text-sm text-gray-600">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="text-[#3b5bdb] shrink-0" size={18} />
                    <span>Πλήρης εμπορική παρουσίαση υπηρεσιών/προϊόντων</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="text-[#3b5bdb] shrink-0" size={18} />
                    <span>Προσαρμοσμένο Custom UI &amp; Brand Design</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="text-[#3b5bdb] shrink-0" size={18} />
                    <span>Ενσωμάτωση καταλόγου ή e-shop</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="text-[#3b5bdb] shrink-0" size={18} />
                    <span>Μοντέλο Milestones: 50% προκαταβολή, 25% Design, 25% Live</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Signature SectionDivider: Yellow to Blue */}
      <SectionDivider leftColor="bg-[#facc15]" rightColor="bg-[#3b5bdb]" />

      {/* The 10 Mandatory Elements of Law 4072/2012 */}
      <section id="stoixeia" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="bg-[#111111] text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 shadow-sm inline-block mb-3">
              ΝΟΜΙΚΗ ΣΥΜΜΟΡΦΩΣΗ
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-black tracking-tight mb-4">
              Τα 10 Υποχρεωτικά Στοιχεία Ιστοσελίδας ΙΚΕ
            </h2>
            <p className="text-gray-600 text-base leading-relaxed">
              Βάσει του Άρθρου 47 §2 του Ν.4072/2012 και των αποφάσεων του Γ.Ε.ΜΗ., κάθε εταιρική σελίδα ΙΚΕ οφείλει να δημοσιεύει τα ακόλουθα 10 πεδία:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { num: "01", title: "Εταιρική Επωνυμία & Διακριτικός Τίτλος", desc: "Πλήρης αναγραφή ακριβώς όπως έχει καταχωρηθεί στο καταστατικό σύστασης στο Γ.Ε.ΜΗ." },
              { num: "02", title: "Αριθμός Γ.Ε.ΜΗ. & Μητρώο Επιμελητηρίου", desc: "Ο μοναδικός αριθμός μητρώου της εταιρείας και το αρμόδιο επιμελητήριο εγγραφής." },
              { num: "03", title: "Α.Φ.Μ. & Αρμόδια Δ.Ο.Υ.", desc: "Ο Αριθμός Φορολογικού Μητρώου και η αρμόδια φορολογική αρχή (π.χ. ΚΕΦΟΔΕ ΑΤΤΙΚΗΣ)." },
              { num: "04", title: "Έδρα & Στοιχεία Επικοινωνίας", desc: "Πλήρης ταχυδρομική διεύθυνση της καταστατικής έδρας, τηλέφωνο και επίσημο email." },
              { num: "05", title: "Εταιρικό Κεφάλαιο & Εγγυητικές Εισφορές", desc: "Το συνολικό κεφάλαιο της ΙΚΕ και το ποσό των εγγυητικών εισφορών των εταίρων (άρθρο 47 §2)." },
              { num: "06", title: "Λήξη Πρώτης Διαχειριστικής Περιόδου", desc: "Η επίσημη ημερομηνία λήξης της πρώτης οικονομικής χρήσης της εταιρείας." },
              { num: "07", title: "Στοιχεία Διαχειριστών", desc: "Ονοματεπώνυμο, ΑΦΜ και διεύθυνση των νόμιμων εκπροσώπων / διαχειριστών της ΙΚΕ." },
              { num: "08", title: "Στοιχεία Εταίρων & Κατηγορίες Εισφορών", desc: "Πλήρη στοιχεία των εταίρων και κατηγοριοποίηση των εισφορών τους (κεφαλαιακές, εξωκεφαλαιακές, εγγυητικές)." },
              { num: "09", title: "Κατάσταση Εκκαθάρισης", desc: "Ρητή μνεία εάν η εταιρεία τελεί υπό εκκαθάριση ή αναδιάρθρωση (εφόσον συντρέχει τέτοιος λόγος)." },
              { num: "10", title: "Οικονομικές Καταστάσεις / Ισολογισμοί", desc: "Ανάρτηση ετήσιων οικονομικών καταστάσεων και ισολογισμών όταν προβλέπεται δημοσίευση από τον νόμο." }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="flex items-start gap-4 p-5 bg-[#f4f2ea] border border-black/5 rounded-xl hover:border-[#3b5bdb] transition-all"
              >
                <div className="w-10 h-10 bg-[#3b5bdb] text-white font-heading font-black text-lg flex items-center justify-center shrink-0 rounded-lg shadow-sm">
                  {item.num}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-black text-base mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Signature SectionDivider: Blue to Pink */}
      <SectionDivider leftColor="bg-[#3b5bdb]" rightColor="bg-pink-500" />

      {/* GEMI Penalties & Deadlines: Snappy Dark Box */}
      <section id="prostima" className="py-20 bg-[#111111] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-black/60 border-2 border-white/10 p-8 sm:p-12 rounded-2xl relative overflow-hidden">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="bg-[#facc15] text-black font-black text-xs uppercase tracking-wider px-3 py-1 flex items-center gap-1.5">
                <AlertTriangle size={14} className="text-black" /> ΝΕΟ ΠΟΙΝΟΛΟΓΙΟ ΓΕΜΗ 2026
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl font-heading font-black mb-6 text-white">
              Προθεσμία 30 Ημερών από τη Σύσταση &amp; Πρόστιμα Έως 100.000€
            </h2>

            <div className="space-y-4 text-gray-300 text-base leading-relaxed max-w-4xl">
              <p>
                Σύμφωνα με την κείμενη νομοθεσία (Άρθρο 47 §2 Ν.4072/2012), κάθε νέα Ι.Κ.Ε. υποχρεούται να έχει ολοκληρώσει την κατασκευή της ιστοσελίδας της και να την έχει δηλώσει επίσημα στο Γ.Ε.ΜΗ. εντός <strong>ενός (1) μηνός (30 ημερών)</strong> από την καταχώριση της σύστασής της.
              </p>
              <p>
                Από τις αρχές του 2026, τέθηκε σε εφαρμογή το νέο ηλεκτρονικό ποινολόγιο του ΓΕΜΗ (ΚΥΑ 46982/2025 &amp; ΚΥΑ 104666/2025), το οποίο προβλέπει αυτόματες διασταυρώσεις και αυστηρές διοικητικές κυρώσεις:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="bg-white/5 border border-red-500/30 p-6 rounded-xl">
                  <div className="text-2xl sm:text-3xl font-heading font-black text-red-400 mb-1">
                    500€ – 10.000€
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Αυτόματο πρόστιμο για εκπρόθεσμη δήλωση ιστοτόπου στο businessportal.gr ή ελλιπή ανάρτηση υποχρεωτικών στοιχείων.
                  </p>
                </div>
                <div className="bg-white/5 border border-red-500/30 p-6 rounded-xl">
                  <div className="text-2xl sm:text-3xl font-heading font-black text-red-400 mb-1">
                    Έως 100.000€ &amp; Αναστολή
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Για σοβαρές παραβάσεις μη δημοσιότητας, αναστολή έκδοσης πιστοποιητικών ΓΕΜΗ και μπλοκάρισμα φορολογικής ενημερότητας.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Signature SectionDivider: Pink to Lime */}
      <SectionDivider leftColor="bg-pink-500" rightColor="bg-[#4ade80]" />

      {/* Step by Step Guide: 4 Snappy Pipeline Cards */}
      <section className="py-20 bg-[#f4f2ea]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="bg-[#4ade80] text-black text-xs font-black uppercase tracking-widest px-3 py-1.5 shadow-sm inline-block mb-3">
              ΟΔΗΓΟΣ 4 ΒΗΜΑΤΩΝ
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-black tracking-tight mb-4">
              Πώς Δηλώνεται η Ιστοσελίδα στο Γ.Ε.ΜΗ.
            </h2>
            <p className="text-gray-600 text-base leading-relaxed">
              Μόλις ολοκληρώσουμε τη σελίδα σας σε 24 ώρες, η διαδικασία στο businessportal.gr διαρκεί μόλις 3 λεπτά:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "ΒΗΜΑ 01", title: "Παραλαβή Link", desc: "Λαμβάνετε από εμάς το έτοιμο URL (π.χ. https://mycompany.gr) και επίσημη βεβαίωση λειτουργίας." },
              { step: "ΒΗΜΑ 02", title: "Είσοδος στο ΓΕΜΗ", desc: "Επισκέπτεστε το businessportal.gr και συνδέεστε με τους κωδικούς Taxisnet της εταιρείας σας." },
              { step: "ΒΗΜΑ 03", title: "Δήλωση Ιστοτόπου", desc: "Επιλέγετε «Αίτηση Μεταβολής / Δήλωση Ιστοτόπου Εταιρείας» και επικολλάτε το επίσημο URL." },
              { step: "ΒΗΜΑ 04", title: "Ολοκλήρωση", desc: "Υποβάλλετε την αίτηση και λαμβάνετε άμεσα το αποδεικτικό καταχώρισης. Είστε 100% νόμιμοι!" }
            ].map((st, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-250 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs font-black text-[#3b5bdb] tracking-widest bg-blue-50 px-2.5 py-1 rounded inline-block mb-3">
                    {st.step}
                  </span>
                  <h3 className="font-heading font-black text-black text-lg mb-2">{st.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Signature SectionDivider: Lime to Yellow */}
      <SectionDivider leftColor="bg-[#4ade80]" rightColor="bg-[#facc15]" />

      {/* FAQs Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <span className="bg-[#111111] text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 shadow-sm inline-block mb-3">
              ΣΥΧΝΕΣ ΕΡΩΤΗΣΕΙΣ
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-black tracking-tight mb-4">
              Όλα όσα πρέπει να γνωρίζετε για την Ιστοσελίδα ΙΚΕ
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details 
                key={i} 
                className="group p-6 rounded-xl bg-[#f4f2ea] border border-black/5 hover:border-[#3b5bdb] transition-all cursor-pointer"
              >
                <summary className="font-heading font-bold text-lg text-black list-none flex items-center justify-between gap-4">
                  <span>{faq.q}</span>
                  <span className="w-8 h-8 rounded-full bg-white text-[#3b5bdb] flex items-center justify-center font-bold text-lg transition-transform duration-300 group-open:rotate-45 shrink-0 shadow-sm">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-gray-700 text-sm sm:text-base leading-relaxed border-t border-black/10 pt-4">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>

        </div>
      </section>

      {/* Signature SectionDivider: Yellow to Dark */}
      <SectionDivider leftColor="bg-[#facc15]" rightColor="bg-[#101010]" />

      {/* Bottom CTA Banner: High Energy */}
      <section className="py-16 bg-[#3b5bdb] text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block bg-[#facc15] text-black font-black text-xs uppercase tracking-widest px-3 py-1 mb-4 shadow-sm">
            ΑΜΕΣΗ ΕΞΥΠΗΡΕΤΗΣΗ
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black mb-4">
            Χρειάζεστε Σελίδα ΙΚΕ Εντός 24 Ωρών;
          </h2>
          <p className="text-blue-100 text-base max-w-xl mx-auto mb-8 font-normal">
            Μόνο 80€ τελική τιμή με ΦΠΑ. Συμπληρώστε το ΑΦΜ σας και αναλαμβάνουμε άμεσα την κατασκευή και ανάρτηση όλων των νόμιμων στοιχείων.
          </p>
          <button 
            onClick={handleCtaClick}
            className="bg-[#4ade80] hover:bg-[#22c55e] text-black font-black px-10 py-4 rounded-lg transition-all text-sm uppercase tracking-wider shadow-2xl active:scale-[0.98]"
          >
            ΠΑΡΑΓΓΕΛΙΑ ΣΕ 24h ΜΕ 80€ ➔
          </button>
        </div>
      </section>

      {/* Official SGK Footer */}
      <Footer />

      {/* Scroll to Top */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-6 z-50 p-3 rounded-full bg-[#3b5bdb] text-white shadow-lg transition-all duration-300 flex items-center justify-center hover:bg-[#2b4bba] active:scale-95 ${
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} />
      </button>
    </div>
  );
}

export default function KataskeviIkePageContent() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b5bdb]"></div>
      </div>
    }>
      <KataskeviIkeContent />
    </Suspense>
  );
}
