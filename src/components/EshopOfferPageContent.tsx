"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Phone, X, ArrowUp } from "lucide-react";
import { toast } from "sonner";
import { sendContactEmail } from "@/lib/resend";
import confetti from "canvas-confetti";

function EshopOfferContent() {
  const searchParams = useSearchParams();
  const queryName = searchParams.get("name") || "";
  const queryPhone = searchParams.get("phone") || "";
  const queryCity = searchParams.get("city") || "";
  const queryPlan = searchParams.get("plan") || "pay-as-you-grow";

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    contactPreference: "phone",
    plan: "pay-as-you-grow",
    acceptTerms: true,
    acceptPromo: true
  });

  const [submittedCompany, setSubmittedCompany] = useState("");
  const [submittedPhone, setSubmittedPhone] = useState("");
  const [submittedPreference, setSubmittedPreference] = useState("phone");
  const [submittedPlan, setSubmittedPlan] = useState("pay-as-you-grow");
  const [showModal, setShowModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      company: queryName || prev.company,
      phone: queryPhone || prev.phone,
      plan: queryPlan === "standard" ? "standard" : "pay-as-you-grow"
    }));
  }, [queryName, queryPhone, queryPlan]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 400);
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
      const input = document.getElementById("hero-name-input");
      if (input) {
        input.focus();
      }
    } else {
      scrollToTop();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      toast.error("Συμπληρώστε όλα τα υποχρεωτικά πεδία.");
      return;
    }

    setLoading(true);
    try {
      await sendContactEmail({
        type: "eshop_offer",
        offerPrice: formData.plan === "pay-as-you-grow" ? "Pay as you grow (5% commission)" : "1500",
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company || "Δεν δηλώθηκε",
        contactPreference: formData.contactPreference,
        marketingConsent: formData.acceptPromo,
      });

      // Google Ads Conversion tracking
      if (typeof window !== "undefined" && (window as any).gtag) {
        console.log("🔔 [Analytics] Triggering Google Ads Conversion (Eshop Offer)...");
        (window as any).gtag("event", "conversion", {
          "send_to": "AW-18166808794/sHuvCLrHgq4cENqBztZD",
          "value": 1.0,
          "currency": "EUR"
        });
      }

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#3b5bdb", "#4ade80", "#facc15", "#ffffff"]
      });

      setSubmittedCompany(formData.company);
      setSubmittedPhone(formData.phone);
      setSubmittedPreference(formData.contactPreference);
      setSubmittedPlan(formData.plan);
      setShowModal(true);

      // Reset form fields
      setFormData({
        name: "",
        phone: queryPhone || "",
        email: "",
        company: queryName || "",
        contactPreference: "phone",
        plan: queryPlan === "standard" ? "standard" : "pay-as-you-grow",
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
              {submittedPlan === "pay-as-you-grow" ? (
                <>Το αίτημά σου για το πρόγραμμα <strong className="font-bold text-[#3b5bdb]">Pay as you grow</strong> καταχωρήθηκε επιτυχώς! Θα επικοινωνήσουμε μαζί σου άμεσα για τις λεπτομέρειες.</>
              ) : (
                <>Το αίτημά σου καταχωρήθηκε επιτυχώς! Μόλις κέρδισες <strong className="font-bold text-[#3b5bdb]">150€ έκπτωση</strong> για την κατασκευή του E-shop σου.</>
              )}
            </p>
            
            <p className="text-xs text-gray-500 text-center mb-6">
              {submittedPreference === "email" ? (
                <>Θα επικοινωνήσουμε σύντομα μαζί σου μέσω email. <br/><span className="italic text-gray-400">(Είμαστε διακριτικοί! 🤫)</span></>
              ) : (
                <>Θα σε καλέσουμε σύντομα στο {submittedPhone}! <br/><span className="italic text-gray-400">(Δεν θα σε ζαλίσουμε στα τηλέφωνα, είμαστε διακριτικοί! 🤫)</span></>
              )}
            </p>

            {/* Showcase Case Study CTA Button */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-6 text-center shadow-sm">
              <p className="text-xs md:text-sm font-extrabold text-gray-800 mb-3 tracking-wider">
                Θέλεις να δεις ένα ζωντανό δείγμα;
              </p>
              <a 
                href="https://www.vaiacharms.gr/"
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full bg-[#3b5bdb] hover:bg-[#2b4bba] text-white font-bold py-2.5 px-4 rounded-xl transition-all duration-300 gap-1.5 text-xs shadow-sm"
              >
                Δες το E-shop της Vaia Charms ↗
              </a>
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
          <a href="https://sgk.gr" className="flex items-center gap-2">
            <span className="font-heading font-bold text-2xl tracking-tighter text-black">
              sgk<span className="text-[#3b5bdb]">.</span>
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
            <a href="https://sgk.gr" className="hover:text-black transition-colors">Η Εταιρεία</a>
          </nav>
        </div>
        <button 
          onClick={handleCtaClick} 
          className={`bg-[#4ade80] hover:bg-[#22c55e] text-black font-bold text-sm px-5 py-2.5 rounded transition-all duration-300 ${scrolled ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}
        >
          Λήψη Προσφοράς
        </button>
      </header>

      {/* Hero Section */}
      <section className="relative w-full pt-28 pb-20 md:pt-16 md:pb-0 md:h-screen md:min-h-[700px] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-black/50 z-10" />
          <Image
            src="/promo/eshop_hero_boxes.png"
            alt="E-shop Development Setup"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Content Container */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col md:flex-row items-center justify-between gap-10">
          
          {/* Left Text */}
          <div className="flex-1 text-white drop-shadow-lg hidden md:block">
            <h1 className="text-4xl lg:text-6xl font-heading font-medium tracking-tight leading-tight mb-4">
              {formData.plan === "pay-as-you-grow" ? (
                <>
                  Pay as you grow <br/> 
                  Δίνεις όσα έχεις <br/> 
                  <span className="text-[#4ade80] font-bold">Τα υπόλοιπα όποτε έχεις!</span>
                </>
              ) : (
                <>Με ένα κλικ <br/> αποκτάς <br/> <span className="text-[#4ade80] font-bold">E-shop!</span></>
              )}
            </h1>
            <div className="flex items-center gap-4 bg-black/40 p-4 rounded-xl backdrop-blur-md inline-block">
              <div className="flex items-center gap-2 text-sm text-gray-200">
                <span>
                  {formData.plan === "pay-as-you-grow"
                    ? "Ξεκίνα το Eshop σου με ελάχιστο Setup Fee και 5% προμήθεια. Χωρίς δεσμεύσεις!"
                    : "Αποκλειστικά για επαγγελματίες & εμπόρους. Κέρδισε 150€ έκπτωση στην κατασκευή."}
                </span>
              </div>
            </div>
          </div>

          {/* Right Form Box */}
          <div id="offer-form-box" className="w-full max-w-[480px] relative mt-8 md:mt-0">
            {/* Yellow Card Behind */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-[90%] bg-[#facc15] text-black font-semibold text-xs md:text-sm py-2 px-4 rounded-t-2xl shadow-lg flex items-center justify-center z-0 border border-black/5">
              <span className="text-center leading-tight">
                {formData.plan === "pay-as-you-grow" ? (
                  <strong>Αίτηση για το πρόγραμμα Pay as you grow!</strong>
                ) : (
                  "Με την υποβολή θα λάβεις κωδικό έκπτωσης στο email σου!"
                )}
              </span>
            </div>

            {/* Blue Card itself */}
            <div className="w-full bg-[#3b5bdb] text-white p-8 md:p-10 relative overflow-hidden rounded-3xl shadow-2xl z-10">
              {/* Soft decorative glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
              
              <h2 className="text-3xl font-heading font-medium mb-2 relative z-10">
                {formData.plan === "pay-as-you-grow" ? "Pay as you grow" : "Σε ενδιαφέρει;"}
              </h2>
              <p className="text-[13px] text-white/80 mb-6 font-light relative z-10">
                {formData.plan === "pay-as-you-grow" 
                  ? "Ξεκινήστε το δικό σας Eshop πληρώνοντας μόνο ένα μικρό setup fee. Χωρίς δεσμεύσεις!" 
                  : "Θα επικοινωνήσουμε μαζί σου για δωρεάν συμβουλευτική χωρίς δεσμεύσεις."}
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                <div className="grid grid-cols-2 gap-6">
                  <div className="relative">
                    <input 
                      id="hero-name-input"
                      type="text" 
                      required 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-transparent border-b border-white/30 px-0 py-2 text-white placeholder-transparent focus:outline-none focus:border-white peer" 
                      placeholder="Ονοματεπώνυμο" 
                    />
                    <label className="absolute left-0 -top-3.5 text-white/70 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-white/50 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-white/70 peer-focus:text-xs pointer-events-none">Ονοματεπώνυμο</label>
                  </div>
                  <div className="relative">
                    <input 
                      type="tel" 
                      required 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-transparent border-b border-white/30 px-0 py-2 text-white placeholder-transparent focus:outline-none focus:border-white peer" 
                      placeholder="Κινητό" 
                    />
                    <label className="absolute left-0 -top-3.5 text-white/70 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-white/50 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-white/70 peer-focus:text-xs pointer-events-none">Κινητό</label>
                  </div>
                </div>

                <div className="relative">
                  <input 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-transparent border-b border-white/30 px-0 py-2 text-white placeholder-transparent focus:outline-none focus:border-white peer" 
                    placeholder="Email" 
                  />
                  <label className="absolute left-0 -top-3.5 text-white/70 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-white/50 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-white/70 peer-focus:text-xs pointer-events-none">Email</label>
                </div>

                <div className="pt-1">
                  <p className="text-white/90 text-xs mb-2">Πώς θέλεις να τα πούμε;</p>
                  <div className="flex gap-4">
                    <label className={`flex-1 cursor-pointer border rounded-xl py-2 px-3 text-center text-xs transition-all ${formData.contactPreference === "email" ? "bg-[#4ade80] border-[#4ade80] text-black font-semibold" : "border-white/30 text-white hover:bg-white/10"}`}>
                      <input type="radio" name="contactPreference" value="email" checked={formData.contactPreference === "email"} onChange={() => setFormData({...formData, contactPreference: "email"})} className="hidden" />
                      Με email
                    </label>
                    <label className={`flex-1 cursor-pointer border rounded-xl py-2 px-3 text-center text-xs transition-all ${formData.contactPreference === "phone" ? "bg-[#4ade80] border-[#4ade80] text-black font-semibold" : "border-white/30 text-white hover:bg-white/10"}`}>
                      <input type="radio" name="contactPreference" value="phone" checked={formData.contactPreference === "phone"} onChange={() => setFormData({...formData, contactPreference: "phone"})} className="hidden" />
                      Στο τηλέφωνο
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-[10px] text-white/60 mb-1 italic">
                    {formData.plan === "pay-as-you-grow" 
                      ? "*Θα επικοινωνήσουμε άμεσα για να οριστικοποιήσουμε το Setup Fee."
                      : "*Βάλτε το email στο οποίο επιθυμείτε να λάβετε τον κωδικό έκπτωσης."}
                  </p>
                </div>

                <div className="pt-1">
                  <label className="flex items-start gap-2 text-[11px] text-white/80 cursor-pointer group">
                    <input type="checkbox" checked={formData.acceptTerms} onChange={(e) => setFormData({...formData, acceptTerms: e.target.checked})} className="accent-[#4ade80] w-3.5 h-3.5 mt-0.5" />
                    <span>Αποδέχομαι τους <a href="/eshop-offer/terms-of-use" className="underline hover:text-white">όρους χρήσης</a>.</span>
                  </label>
                  <label className="flex items-start gap-2 text-[11px] text-white/80 cursor-pointer mt-1 group">
                    <input type="checkbox" checked={formData.acceptPromo} onChange={(e) => setFormData({...formData, acceptPromo: e.target.checked})} className="accent-[#4ade80] w-3.5 h-3.5 mt-0.5" />
                    <span>Επιθυμώ να λαμβάνω ενημερώσεις της SGK Digital.</span>
                  </label>
                </div>

                <div className="flex justify-end pt-4">
                  <button 
                    disabled={loading}
                    type="submit" 
                    className="bg-white text-[#3b5bdb] hover:bg-gray-100 font-medium px-8 py-3 rounded-full transition-all disabled:opacity-70 flex items-center gap-2"
                  >
                    {loading ? "Αποστολή..." : (formData.plan === "pay-as-you-grow" ? "Ξεκίνα τώρα!" : "Διεκδίκησε την έκπτωση!")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-[#111111] border-t border-white/10 py-12 px-6 md:px-16 relative z-10 text-center md:text-left pb-24 md:pb-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="text-3xl font-heading font-bold text-white tracking-tighter">sgk<span className="text-[#3b5bdb]">.</span></div>
            <p className="text-sm text-white/50 max-w-xs">Σύγχρονα ψηφιακά καταστήματα και εφαρμογές που μεταμορφώνουν την επιχείρησή σου.</p>
          </div>
          
          <div className="flex flex-col items-center md:items-start gap-2">
            <h3 className="text-white font-medium mb-2">Στοιχεία Εταιρείας</h3>
            <p className="text-xs text-white/50"><strong>SGK Software Development</strong></p>
            <p className="text-xs text-white/50">ΑΦΜ: 131398972 | ΔΟΥ: ΚΕΦΟΔΕ ΑΤΤΙΚΗΣ</p>
            <p className="text-xs text-white/50">Ερμού 1 & Λυκοβρύσεως 14</p>
            <p className="text-xs text-white/50">14452 Μεταμόρφωση, Αττικής</p>
          </div>

          <div className="flex flex-col items-center md:items-start gap-2">
            <h3 className="text-white font-medium mb-2">Επικοινωνία</h3>
            <p className="text-xs text-white/50 flex items-center gap-2"><Phone size={14}/> 6999 524 389</p>
            <p className="text-xs text-white/50 flex items-center gap-2">
              <span className="inline-block translate-y-[2px] mr-1">✉</span> info@sgk.gr
            </p>
            <div className="mt-4 flex gap-4">
              <a href="/eshop-offer/privacy-policy" className="text-xs text-[#facc15] hover:text-yellow-300 transition-colors">Πολιτική Απορρήτου</a>
              <a href="/eshop-offer/terms-of-use" className="text-xs text-[#4ade80] hover:text-green-300 transition-colors">Όροι Χρήσης</a>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-white/10 text-center">
          <p className="text-[11px] text-white/40">© {new Date().getFullYear()} SGK Digital. Όλα τα δικαιώματα διατηρούνται.</p>
        </div>
      </footer>

      {/* Mobile Sticky CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-100 p-3 shadow-lg flex items-center justify-between gap-3 md:hidden">
        <a 
          href="tel:6999524389" 
          className="flex-1 bg-white border border-gray-200 text-black rounded-full py-3 px-4 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-95 transition-all"
        >
          📞 Κάλεσέ μας
        </a>
        <button 
          onClick={handleCtaClick}
          className="flex-1 bg-[#4ade80] text-black font-semibold rounded-full py-3 px-4 text-sm flex items-center justify-center gap-2 hover:bg-[#22c55e] active:scale-95 transition-all"
        >
          ✉️ Θέλω Προσφορά
        </button>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-20 md:bottom-8 right-6 z-50 p-3 rounded-full bg-[#3b5bdb] text-white shadow-lg transition-all duration-300 flex items-center justify-center hover:bg-[#2b4bba] active:scale-95 ${
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} />
      </button>

    </div>
  );
}

export default function EshopOfferPageContent() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b5bdb]"></div>
      </div>
    }>
      <EshopOfferContent />
    </Suspense>
  );
}
