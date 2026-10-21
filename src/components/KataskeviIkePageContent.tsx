"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Check, Phone, X, ArrowUp, CheckCircle2, ShieldCheck, Clock, AlertTriangle, FileText, HelpCircle, ArrowRight, Zap, Globe, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { sendContactEmail } from "@/lib/resend";
import confetti from "canvas-confetti";
import { useTracking } from "@/hooks/useTracking";

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
      setShowScrollTop(window.scrollY > 300);
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
      toast.error("Συμπληρώστε όλα τα υποχρεωτικά πεδία (συμπεριλαμβανομένου του ΑΦΜ).");
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
      q: "Είναι υποχρεωτική η κατασκευή σελίδας για κάθε νέα ΙΚΕ;",
      a: "Ναι, βάσει του Άρθρου 47 §2 του Νόμου 4072/2012 και της ΚΥΑ 46982/2025, κάθε ΙΚΕ οφείλει να διαθέτει εταιρική ιστοσελίδα και να τη δηλώσει στο Γ.Ε.ΜΗ. εντός 30 ημερών (1 μήνα) από τη σύστασή της. Η μη συμμόρφωση επισύρει πρόστιμα από 500€ έως 100.000€."
    },
    {
      q: "Πόσο κοστίζει η κατασκευή σελίδας για ΙΚΕ στην SGK Digital;",
      a: "Το πλήρες πακέτο κοστίζει 80€ ΤΕΛΙΚΗ ΤΙΜΗ ΜΕ ΦΠΑ (δεν είναι 80€ + ΦΠΑ, αλλά 80€ τελική). Περιλαμβάνει την κατασκευή της ιστοσελίδας, κατοχύρωση .gr domain name, φιλοξενία (hosting) 1 έτους σε ταχύτατους servers, πιστοποιητικό SSL και εταιρικό email. Από τον 2ο χρόνο, η ανανέωση hosting παραμένει 80€/έτος με ΦΠΑ, χωρίς καμία απολύτως δέσμευση."
    },
    {
      q: "Ποια είναι τα υποχρεωτικά στοιχεία που πρέπει να έχει η σελίδα της ΙΚΕ;",
      a: "Η ιστοσελίδα πρέπει να αναγράφει υποχρεωτικά: 1) Επωνυμία & Διακριτικό Τίτλο, 2) Αριθμό Γ.Ε.ΜΗ. & Μητρώο Επιμελητηρίου, 3) ΑΦΜ & αρμόδια ΔΟΥ, 4) Διεύθυνση Έδρας & Επικοινωνία, 5) Εταιρικό Κεφάλαιο & Εισφορές Εταίρων, 6) Ημερομηνία λήξης πρώτης διαχειριστικής περιόδου, 7) Στοιχεία Διαχειριστών, 8) Στοιχεία Εταίρων, 9) Κατάσταση Εκκαθάρισης (αν υπάρχει) και 10) Οικονομικές Καταστάσεις / Ισολογισμούς."
    },
    {
      q: "Πόσος χρόνος χρειάζεται για να είναι έτοιμη η ιστοσελίδα;",
      a: "Η παράδοση ολοκληρώνεται εντός 24 ωρών από την παραλαβή του ΑΦΜ της εταιρείας σας. Μέσω του επίσημου OpenData API του Γ.Ε.ΜΗ., αντλούμε αυτόματα τα στοιχεία της σύστασης, εκμηδενίζοντας τον χρόνο αναμονής και αποφεύγοντας τυπογραφικά λάθη."
    },
    {
      q: "Πώς δηλώνω την ιστοσελίδα στο Γ.Ε.ΜΗ. (businessportal.gr);",
      a: "Μόλις ολοκληρώσουμε την κατασκευή, σας στέλνουμε το επίσημο link (π.χ. https://mycompany.gr). Συνδέεστε στο businessportal.gr με τους κωδικούς Taxisnet της εταιρείας, επιλέγετε «Αίτηση Μεταβολής / Δήλωση Ιστοτόπου», επικολλάτε το link και η καταχώριση επικυρώνεται άμεσα."
    }
  ];

  return (
    <div className="min-h-screen bg-white font-body selection:bg-[#4ade80] selection:text-black">
      <style dangerouslySetInnerHTML={{__html: `.global-promo-bar { display: none !important; }`}} />
      
      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors">
              <X size={24} />
            </button>
            <div className="w-16 h-16 bg-[#4ade80]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-[#22c55e]" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-[#3b5bdb] text-center mb-2">Συγχαρητήρια! 🎉</h3>
            <p className="text-gray-600 text-center mb-4">
              Το αίτημά σας για την κατασκευή σελίδας Ι.Κ.Ε. (ΑΦΜ: <strong className="font-bold text-[#3b5bdb]">{submittedVat}</strong>) καταχωρήθηκε επιτυχώς!
            </p>
            <p className="text-xs text-gray-500 text-center mb-6">
              {submittedPreference === "email" ? (
                <>Θα επικοινωνήσουμε σύντομα μαζί σας μέσω email για να ξεκινήσουμε. <br/><span className="italic text-gray-400">(Είμαστε διακριτικοί! 🤫)</span></>
              ) : (
                <>Θα σας καλέσουμε άμεσα στο {submittedPhone} για τις λεπτομέρειες! <br/><span className="italic text-gray-400">(Είμαστε διακριτικοί! 🤫)</span></>
              )}
            </p>

            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-6 text-center shadow-sm">
              <p className="text-xs md:text-sm font-extrabold text-gray-800 mb-3 tracking-wider">
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

            <button onClick={() => setShowModal(false)} className="w-full bg-[#3b5bdb]/10 hover:bg-[#3b5bdb]/20 text-[#3b5bdb] font-bold py-2.5 rounded-xl transition-colors text-sm">
              Κλείσιμο
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 h-16 flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-8">
          <a href="https://www.sgk.gr" className="flex items-center gap-2">
            <span className="font-heading font-bold text-2xl tracking-tighter text-black">
              sgk<span className="text-[#3b5bdb]">.</span>
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
            <a href="https://www.sgk.gr" className="hover:text-black transition-colors">Αρχική</a>
            <a href="#kostos" className="hover:text-black transition-colors">Κόστος & Πακέτα</a>
            <a href="#stoixeia" className="hover:text-black transition-colors">Υποχρεωτικά Στοιχεία</a>
            <a href="#prostima" className="hover:text-black transition-colors">Πρόστιμα ΓΕΜΗ</a>
            <a href="#faq" className="hover:text-black transition-colors">Συχνές Ερωτήσεις</a>
          </nav>
        </div>
        <button 
          onClick={handleCtaClick}
          className="bg-[#4ade80] hover:bg-[#22c55e] text-black font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm"
        >
          Κατασκευή σε 24h
        </button>
      </header>

      {/* Hero Section */}
      <section className="relative w-full pt-28 pb-20 md:pt-20 md:pb-16 flex items-center bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Left Text */}
          <div className="flex-1 text-white">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#4ade80]/10 border border-[#4ade80]/30 text-[#4ade80] text-xs font-bold uppercase tracking-wider mb-6">
              <Zap size={14} /> Νόμος 4072/2012 & ΚΥΑ 46982/2025
            </div>
            <h1 className="text-4xl lg:text-6xl font-heading font-bold tracking-tight leading-tight mb-6">
              Κατασκευή Σελίδας <br/>
              για ΙΚΕ &amp; ΓΕΜΗ <br/>
              <span className="text-[#4ade80]">σε 24 Ώρες (80€)</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-xl">
              Επαγγελματική δημιουργία υποχρεωτικής ιστοσελίδας Ι.Κ.Ε. 100% συμβατής με το Γ.Ε.ΜΗ. 
              Μόνο <strong>80€ τελική τιμή με ΦΠΑ</strong> (περιλαμβάνει .gr Domain, 1 έτος Hosting, SSL, Εταιρικό Email &amp; ζωντανή άντληση από το OpenData API του ΓΕΜΗ).
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-3 rounded-xl">
                <CheckCircle2 className="text-[#4ade80] shrink-0" size={18} />
                <span>80€ Τελική με ΦΠΑ</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-3 rounded-xl">
                <Clock className="text-[#4ade80] shrink-0" size={18} />
                <span>Παράδοση σε 24h</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-3 rounded-xl">
                <ShieldCheck className="text-[#4ade80] shrink-0" size={18} />
                <span>100% Συμβατή ΓΕΜΗ</span>
              </div>
            </div>
          </div>

          {/* Right Form Box */}
          <div id="offer-form-box" className="w-full max-w-[480px] relative">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[92%] bg-[#facc15] text-black font-extrabold text-[11px] sm:text-xs py-2.5 px-4 rounded-t-2xl shadow-lg flex items-center justify-center z-20 border border-black/5">
              <span className="text-center leading-tight tracking-wider">
                ⚡ Κατασκευή σε 24 Ώρες με 80€ (Συμπεριλαμβανομένου ΦΠΑ)
              </span>
            </div>

            <div className="w-full bg-[#3b5bdb] text-white p-8 md:p-10 relative overflow-hidden rounded-3xl shadow-2xl z-10">
              <h2 className="text-2xl md:text-3xl font-heading font-bold mb-2 relative z-10">
                Άμεση Παραγγελία Σελίδας ΙΚΕ
              </h2>
              <p className="text-[13px] text-white/90 mb-6 font-light relative z-10 leading-relaxed">
                Συμπληρώστε το <strong>ΑΦΜ της εταιρείας σας</strong> για αυτόματη άντληση στοιχείων και παράδοση σε 24 ώρες.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                <div className="relative">
                  <input 
                    id="hero-vat-input"
                    type="text" 
                    required 
                    value={formData.vat}
                    onChange={(e) => setFormData({...formData, vat: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white focus:bg-white/15 transition-all text-sm font-mono" 
                    placeholder="ΑΦΜ Εταιρείας (π.χ. 802345678)" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <input 
                      type="text" 
                      required 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white focus:bg-white/15 transition-all text-sm" 
                      placeholder="Ονοματεπώνυμο" 
                    />
                  </div>
                  <div className="relative">
                    <input 
                      type="tel" 
                      required 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white focus:bg-white/15 transition-all text-sm" 
                      placeholder="Τηλέφωνο" 
                    />
                  </div>
                </div>

                <div className="relative">
                  <input 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white focus:bg-white/15 transition-all text-sm" 
                    placeholder="Email Επικοινωνίας" 
                  />
                </div>

                <div className="pt-1">
                  <p className="text-white/80 text-xs mb-2">Προτίμηση Επικοινωνίας:</p>
                  <div className="flex gap-3">
                    <label className={`flex-1 cursor-pointer border rounded-xl py-2 px-3 text-center text-xs transition-all ${formData.contactPreference === "phone" ? "bg-[#4ade80] border-[#4ade80] text-black font-bold" : "border-white/30 text-white hover:bg-white/10"}`}>
                      <input type="radio" name="contactPreference" value="phone" checked={formData.contactPreference === "phone"} onChange={() => setFormData({...formData, contactPreference: "phone"})} className="hidden" />
                      Τηλεφωνικά
                    </label>
                    <label className={`flex-1 cursor-pointer border rounded-xl py-2 px-3 text-center text-xs transition-all ${formData.contactPreference === "email" ? "bg-[#4ade80] border-[#4ade80] text-black font-bold" : "border-white/30 text-white hover:bg-white/10"}`}>
                      <input type="radio" name="contactPreference" value="email" checked={formData.contactPreference === "email"} onChange={() => setFormData({...formData, contactPreference: "email"})} className="hidden" />
                      Μέσω Email
                    </label>
                  </div>
                </div>

                <div className="text-[11px] text-white/90 bg-black/25 rounded-xl p-3 border border-white/15 leading-relaxed">
                  🔄 <strong>80€ Τελική Τιμή με ΦΠΑ:</strong> Καλύπτει κατασκευή, .gr domain, SSL &amp; hosting για τον 1ο χρόνο. Από τον 2ο χρόνο, η ετήσια ανανέωση hosting παραμένει 80€/έτος με ΦΠΑ — <strong>χωρίς καμία δέσμευση</strong>.
                </div>

                <div className="flex justify-end pt-2">
                  <button 
                    disabled={loading}
                    type="submit" 
                    className="w-full bg-[#4ade80] hover:bg-[#22c55e] text-black font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer text-sm uppercase tracking-wider"
                  >
                    {loading ? "Αποστολή..." : "Ξεκινήστε την Κατασκευή Τώρα ➔"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Options & Cost Comparison Table */}
      <section id="kostos" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#3b5bdb] text-xs font-bold uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Σύγκριση Αγοράς 2026
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-slate-900 mt-4 mb-4">
              Επιλογές &amp; Κόστος Κατασκευής Σελίδας για ΙΚΕ
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Γιατί η πρόταση της SGK Digital των <strong>80€ τελική τιμή με ΦΠΑ</strong> αποτελεί την πιο συμφέρουσα, διαφανή και ασφαλή λύση για κάθε ελληνική Ι.Κ.Ε.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Competitor Tier 1 */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Απλές Υπηρεσίες Αγοράς</span>
                <h3 className="text-xl font-heading font-bold text-slate-900 mt-2 mb-2">Βασική Φόρμα (IKE-Site κλπ)</h3>
                <div className="text-3xl font-heading font-extrabold text-slate-700 my-4">25€ – 56€ <span className="text-sm font-normal text-slate-400">/ έτος (+ΦΠΑ)</span></div>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">✗</span>
                    <span>Τιμές χωρίς ΦΠΑ (+24% κατά το checkout)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">✗</span>
                    <span>Συχνά δεν περιλαμβάνεται .gr domain (έξτρα χρέωση)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">✗</span>
                    <span>Χειροκίνητη εισαγωγή στοιχείων (κίνδυνος λαθών)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">!</span>
                    <span>Στατική σελίδα χωρίς υποστήριξη</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* SGK DIGITAL HERO CARD */}
            <div className="bg-gradient-to-b from-[#3b5bdb] to-[#2542be] text-white rounded-3xl p-8 shadow-2xl relative flex flex-col justify-between transform md:-translate-y-4 border-2 border-[#4ade80]">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#4ade80] text-black font-extrabold text-xs py-1 px-4 rounded-full uppercase tracking-wider">
                Η #1 Επιλογή
              </div>
              <div>
                <span className="text-blue-200 text-xs font-bold uppercase tracking-wider">SGK Digital</span>
                <h3 className="text-2xl font-heading font-bold text-white mt-2 mb-2">Πλήρες Πακέτο Γ.Ε.ΜΗ. 2026</h3>
                <div className="text-4xl font-heading font-extrabold text-[#4ade80] my-4">80€ <span className="text-sm font-normal text-white/80">ΤΕΛΙΚΗ ΜΕ ΦΠΑ</span></div>
                <p className="text-xs text-blue-100 mb-6 leading-relaxed">
                  Όλα όσα απαιτεί ο Νόμος 4072/2012 χωρίς καμία κρυφή χρέωση.
                </p>
                <ul className="space-y-3 text-sm text-white/95">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-[#4ade80] shrink-0" size={18} />
                    <span><strong>80€ Τελική Τιμή με ΦΠΑ</strong> (περιλαμβάνεται)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-[#4ade80] shrink-0" size={18} />
                    <span><strong>Δωρεάν .gr Domain Name</strong> για τον 1ο χρόνο</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-[#4ade80] shrink-0" size={18} />
                    <span><strong>1 Έτος Hosting</strong> σε ιδιωτικούς ταχύτατους servers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-[#4ade80] shrink-0" size={18} />
                    <span><strong>Πιστοποιητικό SSL (HTTPS)</strong> &amp; Εταιρικό Email</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-[#4ade80] shrink-0" size={18} />
                    <span><strong>Ζωντανή Σύνδεση OpenData API</strong> με το ΓΕΜΗ</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-[#4ade80] shrink-0" size={18} />
                    <span><strong>Παράδοση εντός 24 ωρών</strong> με βεβαίωση</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-[#4ade80] shrink-0" size={18} />
                    <span>Ανανέωση 80€/έτος με ΦΠΑ από το 2ο έτος (χωρίς δέσμευση)</span>
                  </li>
                </ul>
              </div>
              <button 
                onClick={handleCtaClick}
                className="mt-8 w-full bg-[#4ade80] hover:bg-[#22c55e] text-black font-extrabold py-3 rounded-xl transition-all text-sm uppercase tracking-wider"
              >
                Επιλογή Πακέτου 80€
              </button>
            </div>

            {/* Custom Dynamic Tier */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Custom Web Development</span>
                <h3 className="text-xl font-heading font-bold text-slate-900 mt-2 mb-2">Δυναμική Εμπορική Ιστοσελίδα</h3>
                <div className="text-3xl font-heading font-extrabold text-slate-700 my-4">220€ – 450€ <span className="text-sm font-normal text-slate-400">+ ΦΠΑ</span></div>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-blue-600 shrink-0" size={18} />
                    <span>Πλήρης εμπορική παρουσίαση υπηρεσιών/προϊόντων</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-blue-600 shrink-0" size={18} />
                    <span>Προσαρμοσμένο Custom UI &amp; Brand Design</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-blue-600 shrink-0" size={18} />
                    <span>Ενσωμάτωση καταλόγου ή e-shop</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">!</span>
                    <span>Απευθύνεται σε εταιρείες με εμπορικές ανάγκες πέραν της νομικής συμμόρφωσης</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: 10 Mandatory Elements */}
      <section id="stoixeia" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#3b5bdb] text-xs font-bold uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Νομική Συμμόρφωση
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-slate-900 mt-4 mb-4">
              Τα 10 Υποχρεωτικά Στοιχεία Ιστοσελίδας ΙΚΕ
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Βάσει του Άρθρου 47 §2 του Ν.4072/2012 και των σχετικών εφαρμοστικών αποφάσεων, κάθε εταιρική σελίδα ΙΚΕ οφείλει να δημοσιεύει τα ακόλουθα 10 πεδία:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { num: "01", title: "Εταιρική Επωνυμία & Διακριτικός Τίτλος", desc: "Πλήρης αναγραφή ακριβώς όπως έχει καταχωρηθεί στο καταστατικό σύστασης στο Γ.Ε.ΜΗ." },
              { num: "02", title: "Αριθμός Γ.Ε.ΜΗ. & Μητρώο Επιμελητηρίου", desc: "Ο μοναδικός αριθμός μητρώου της εταιρείας και το αρμόδιο επιμελητήριο εγγραφής." },
              { num: "03", title: "Α.Φ.Μ. & Αρμόδια Δ.Ο.Υ.", desc: "Ο Αριθμός Φορολογικού Μητρώου και η αρμόδια φορολογική αρχή (π.χ. ΚΕΦΟΔΕ ΑΤΤΙΚΗΣ)." },
              { num: "04", title: "Έδρα & Στοιχεία Επικοινωνίας", desc: "Πλήρης ταχυδρομική διεύθυνση της καταστατικής έδρας, τηλέφωνο και επίσημο email." },
              { num: "05", title: "Εταιρικό Κεφάλαιο & Εισφορές", desc: "Το συνολικό κεφάλαιο της ΙΚΕ και το ποσό των εγγυητικών εισφορών των εταίρων (άρθρο 47 §2)." },
              { num: "06", title: "Λήξη Πρώτης Διαχειριστικής Περιόδου", desc: "Η επίσημη ημερομηνία λήξης της πρώτης οικονομικής χρήσης της εταιρείας." },
              { num: "07", title: "Στοιχεία Διαχειριστών", desc: "Ονοματεπώνυμο, ΑΦΜ και διεύθυνση των νόμιμων εκπροσώπων / διαχειριστών της ΙΚΕ." },
              { num: "08", title: "Στοιχεία Εταίρων & Κατηγορίες Εισφορών", desc: "Πλήρη στοιχεία των εταίρων και κατηγοριοποίηση των εισφορών τους (κεφαλαιακές, εξωκεφαλαιακές, εγγυητικές)." },
              { num: "09", title: "Κατάσταση Εκκαθάρισης", desc: "Ρητή μνεία εάν η εταιρεία τελεί υπό εκκαθάριση ή αναδιάρθρωση (εφόσον συντρέχει)." },
              { num: "10", title: "Οικονομικές Καταστάσεις / Ισολογισμοί", desc: "Ανάρτηση ετήσιων οικονομικών καταστάσεων και ισολογισμών όταν προβλέπεται δημοσίευση από τον νόμο." }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 p-6 bg-slate-50 border border-slate-200 rounded-2xl hover:border-[#3b5bdb] transition-all">
                <span className="font-heading font-extrabold text-2xl text-[#3b5bdb] shrink-0">{item.num}</span>
                <div>
                  <h3 className="font-heading font-bold text-slate-900 text-lg mb-1">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Deadlines & Penalties */}
      <section id="prostima" className="py-20 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-gradient-to-r from-red-950/60 to-slate-900 border border-red-500/30 rounded-3xl p-8 md:p-12">
            <div className="flex items-center gap-3 text-red-400 font-bold text-xs uppercase tracking-widest mb-4">
              <AlertTriangle size={18} /> Νέο Ποινολόγιο ΓΕΜΗ 2026
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Προθεσμία 30 Ημερών &amp; Πρόστιμα Έως 100.000€
            </h2>
            <div className="space-y-4 text-slate-300 text-base leading-relaxed">
              <p>
                Σύμφωνα με την κείμενη νομοθεσία, κάθε νέα Ι.Κ.Ε. υποχρεούται να έχει ολοκληρώσει την κατασκευή της ιστοσελίδας της και να την έχει δηλώσει επίσημα στο Γ.Ε.ΜΗ. εντός <strong>ενός (1) μηνός (30 ημερών)</strong> από την καταχώριση της σύστασής της.
              </p>
              <p>
                Από τις αρχές του 2026, τέθηκε σε εφαρμογή το νέο ηλεκτρονικό ποινολόγιο του ΓΕΜΗ (ΚΥΑ 46982/2025 &amp; ΚΥΑ 104666/2025), το οποίο προβλέπει αυτόματες διασταυρώσεις και διοικητικά πρόστιμα:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="bg-black/40 border border-white/10 p-5 rounded-2xl">
                  <div className="text-2xl font-heading font-bold text-red-400 mb-1">500€ – 10.000€</div>
                  <p className="text-xs text-slate-400">Για εκπρόθεσμη δήλωση ιστοτόπου ή ελλιπή δημοσίευση υποχρεωτικών στοιχείων.</p>
                </div>
                <div className="bg-black/40 border border-white/10 p-5 rounded-2xl">
                  <div className="text-2xl font-heading font-bold text-red-400 mb-1">Έως 100.000€ &amp; Αναστολή</div>
                  <p className="text-xs text-slate-400">Για σοβαρές παραβάσεις μη δημοσιότητας και αναστολή έκδοσης πιστοποιητικών ΓΕΜΗ.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Step by Step Guide to businessportal.gr */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#3b5bdb] text-xs font-bold uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Οδηγός Βήμα-Βήμα
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-slate-900 mt-4 mb-4">
              Πώς Δηλώνεται η Ιστοσελίδα στο Γ.Ε.ΜΗ.
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Μόλις ολοκληρώσουμε τη σελίδα σας σε 24 ώρες, η δήλωση στο businessportal.gr γίνεται σε 3 λεπτά:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "Βήμα 1", title: "Παραλαβή Link", desc: "Λαμβάνετε από εμάς το έτοιμο URL (π.χ. https://mycompany.gr) και τη βεβαίωση λειτουργίας." },
              { step: "Βήμα 2", title: "Είσοδος στο ΓΕΜΗ", desc: "Επισκέπτεστε το businessportal.gr και συνδέεστε με τους κωδικούς Taxisnet της επιχείρησης." },
              { step: "Βήμα 3", title: "Δήλωση Ιστοτόπου", desc: "Επιλέγετε «Αίτηση Μεταβολής / Δήλωση Ιστοτόπου Εταιρείας» και επικολλάτε το URL." },
              { step: "Βήμα 4", title: "Ολοκλήρωση", desc: "Υποβάλλετε την αίτηση και λαμβάνετε άμεσα το αποδεικτικό καταχώρισης του ΓΕΜΗ. Είστε 100% νόμιμοι!" }
            ].map((st, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-extrabold text-[#3b5bdb] uppercase tracking-wider">{st.step}</span>
                <h3 className="font-heading font-bold text-slate-900 text-lg mt-2 mb-2">{st.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#3b5bdb] text-xs font-bold uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Συχνές Ερωτήσεις (FAQ)
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-slate-900 mt-4 mb-4">
              Όλα όσα πρέπει να γνωρίζετε για την Ιστοσελίδα ΙΚΕ
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#3b5bdb] transition-all cursor-pointer">
                <summary className="font-heading font-bold text-lg text-slate-900 list-none flex items-center justify-between gap-4">
                  <span>{faq.q}</span>
                  <span className="w-8 h-8 rounded-full bg-blue-100 text-[#3b5bdb] flex items-center justify-center font-bold text-lg transition-transform duration-300 group-open:rotate-45 shrink-0">+</span>
                </summary>
                <p className="mt-4 text-slate-600 text-sm md:text-base leading-relaxed border-t border-slate-200/60 pt-4">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-[#3b5bdb] text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Χρειάζεστε Σελίδα ΙΚΕ Εντός 24 Ωρών;
          </h2>
          <p className="text-blue-100 text-base max-w-xl mx-auto mb-8">
            Μόνο 80€ τελική τιμή με ΦΠΑ. Συμπληρώστε το ΑΦΜ σας και αναλαμβάνουμε άμεσα την κατασκευή και ανάρτηση των στοιχείων σας.
          </p>
          <button 
            onClick={handleCtaClick}
            className="bg-[#4ade80] hover:bg-[#22c55e] text-black font-extrabold px-10 py-4 rounded-full transition-all text-sm uppercase tracking-wider shadow-xl"
          >
            Παραγγελία σε 24h με 80€ ➔
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-[#111111] border-t border-white/10 py-12 px-6 md:px-16 text-center md:text-left text-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="text-3xl font-heading font-bold text-white tracking-tighter">sgk<span className="text-[#3b5bdb]">.</span></div>
            <p className="text-sm text-white/50 max-w-xs">SGK Software Development — Επίσημος Πάροχος Υποχρεωτικών Ιστοσελίδων ΙΚΕ για το Γ.Ε.ΜΗ.</p>
          </div>
          
          <div className="flex flex-col items-center md:items-start gap-2">
            <h3 className="text-white font-medium mb-2">Στοιχεία Εταιρείας</h3>
            <p className="text-xs text-white/50"><strong>SGK Software Development</strong></p>
            <p className="text-xs text-white/50">ΑΦΜ: 131398972 | ΔΟΥ: ΚΕΦΟΔΕ ΑΤΤΙΚΗΣ</p>
            <p className="text-xs text-white/50">Ερμού 1 & Λυκοβρύσεως 14, 14452 Μεταμόρφωση</p>
          </div>

          <div className="flex flex-col items-center md:items-start gap-2">
            <h3 className="text-white font-medium mb-2">Επικοινωνία</h3>
            <p className="text-xs text-white/50 flex items-center gap-2"><Phone size={14}/> 211 114 0013 | 6999 524 389</p>
            <p className="text-xs text-white/50 flex items-center gap-2">✉ info@sgk.gr</p>
            <div className="mt-4 flex gap-4">
              <a href="/privacy" className="text-xs text-[#facc15] hover:text-yellow-300">Πολιτική Απορρήτου</a>
              <a href="/terms" className="text-xs text-[#4ade80] hover:text-green-300">Όροι Χρήσης</a>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-white/10 text-center">
          <p className="text-[11px] text-white/40">© {new Date().getFullYear()} SGK Digital. Όλα τα δικαιώματα διατηρούνται.</p>
        </div>
      </footer>

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
