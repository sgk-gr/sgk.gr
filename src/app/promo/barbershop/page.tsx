"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check, Link as LinkIcon, Download, CheckCircle2, Navigation2, ChevronRight, Phone, Smartphone, Monitor, X } from "lucide-react";
import { toast } from "sonner";
import { sendContactEmail } from "@/lib/resend";
import confetti from "canvas-confetti";

export default function BarbershopLanding() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    salon: "",
    contactPreference: "phone",
    acceptTerms: true,
    acceptPromo: true
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [submittedPreference, setSubmittedPreference] = useState("phone");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      toast.error("Συμπληρώστε τα υποχρεωτικά πεδία.");
      return;
    }

    setLoading(true);
    try {
      await sendContactEmail({
        type: "promo_barbershop",
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: "Barbershop Promo",
        contactPreference: formData.contactPreference,
        marketingConsent: formData.acceptPromo,
      });

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4ade80', '#3b5bdb', '#facc15', '#ffffff']
      });
      setSubmittedPreference(formData.contactPreference);
      setShowModal(true);
      setFormData({ name: "", phone: "", email: "", salon: "", contactPreference: "phone", acceptTerms: true, acceptPromo: true });
    } catch (err: any) {
      console.error(err);
      toast.error("Κάτι πήγε στραβά, προσπαθήστε ξανά.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-body selection:bg-[#4ade80] selection:text-black">
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
            <p className="text-gray-600 text-center mb-6">
              Το αίτημά σου καταχωρήθηκε επιτυχώς! Μόλις έκανες το πρώτο βήμα για τη ψηφιακή αναβάθμιση της επιχείρησής σου.
            </p>
            <p className="text-sm text-gray-500 text-center mb-8">
              {submittedPreference === 'email' ? (
                <>Θα επικοινωνήσουμε σύντομα μαζί σου μέσω email. <br/><span className="italic text-gray-400">(Είμαστε διακριτικοί! 🤫)</span></>
              ) : (
                <>Θα σε καλέσουμε σύντομα! <br/><span className="italic text-gray-400">(Δεν θα σε ζαλίσουμε στα τηλέφωνα, είμαστε διακριτικοί! 🤫)</span></>
              )}
            </p>
            <button onClick={() => setShowModal(false)} className="w-full bg-[#3b5bdb] text-white font-bold py-3 rounded-xl hover:bg-[#2e4aae] transition-colors">
              Τέλεια!
            </button>
          </div>
        </div>
      )}

      {/* 1. Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 h-16 flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-8">
          <a href="https://sgk.gr" className="flex items-center gap-2">
            <span className="font-heading font-bold text-2xl tracking-tighter text-black">
              sgk<span className="text-[#3b5bdb]">.</span>
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
            <a href="#how-it-works" className="hover:text-black transition-colors">Πώς λειτουργεί</a>
            <a href="#features" className="hover:text-black transition-colors">Υπηρεσίες Κομμωτηρίων</a>
            <a href="https://sgk.gr" className="hover:text-black transition-colors">Η Εταιρεία</a>
          </nav>
        </div>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          className={`bg-[#4ade80] hover:bg-[#22c55e] text-black font-bold text-sm px-5 py-2.5 rounded transition-all duration-300 ${scrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
        >
          Λήψη Προσφοράς
        </button>
      </header>

      {/* 2. Hero Section (Blue Box Layout) */}
      <section className="relative w-full h-[90vh] md:h-screen min-h-[700px] flex items-center pt-16">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-black/30 z-10" />
          <Image
            src="/promo/barbershop_hero.png"
            alt="Barber Shop Interior"
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
              Με ένα κλικ <br/> γεμίζεις <br/> <span className="text-[#4ade80] font-bold">ραντεβού!</span>
            </h1>
            <div className="flex items-center gap-4 bg-black/40 p-4 rounded-xl backdrop-blur-md inline-block">
              <div className="flex items-center gap-2 text-sm text-gray-200">
                <CheckCircle2 className="w-5 h-5 text-[#4ade80]" />
                <span>Αποκλειστικά για Hair Salons / Barbershops. Κερδίστε 150€ έκπτωση στην κατασκευή.</span>
              </div>
            </div>
          </div>

          {/* Right Form Box (Snappi Blue) */}
          <div className="w-full max-w-[480px] bg-[#3b5bdb] text-white p-8 md:p-10 shadow-2xl relative overflow-hidden">
            {/* Soft decorative glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            
            <h2 className="text-3xl font-heading font-medium mb-2">Σε ενδιαφέρει;</h2>
            <p className="text-[13px] text-white/80 mb-8 font-light">Θα επικοινωνήσουμε μαζί σου αν θέλεις για ΔΩΡΕΑΝ συμβουλευτική χωρίς δεσμεύσεις</p>
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-2 gap-6">
                <div className="relative">
                  <input 
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

              <div className="grid grid-cols-1 gap-6">
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
              </div>

              <div className="pt-2">
                <p className="text-white/90 text-[13px] mb-3">Πώς θέλεις να τα πούμε;</p>
                <div className="flex gap-4">
                  <label className={`flex-1 cursor-pointer border rounded-xl py-2.5 px-3 text-center text-sm transition-all ${formData.contactPreference === 'email' ? 'bg-[#4ade80] border-[#4ade80] text-black font-semibold' : 'border-white/30 text-white hover:bg-white/10'}`}>
                    <input type="radio" name="contactPreference" value="email" checked={formData.contactPreference === 'email'} onChange={(e) => setFormData({...formData, contactPreference: 'email'})} className="hidden" />
                    Με email
                  </label>
                  <label className={`flex-1 cursor-pointer border rounded-xl py-2.5 px-3 text-center text-sm transition-all ${formData.contactPreference === 'phone' ? 'bg-[#4ade80] border-[#4ade80] text-black font-semibold' : 'border-white/30 text-white hover:bg-white/10'}`}>
                    <input type="radio" name="contactPreference" value="phone" checked={formData.contactPreference === 'phone'} onChange={(e) => setFormData({...formData, contactPreference: 'phone'})} className="hidden" />
                    Στο τηλέφωνο
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-[10px] text-white/60 mb-4 italic">
                  *Βάλτε το email στο οποίο επιθυμείτε να λάβετε τον κωδικό έκπτωσης.
                </p>
                <label className="flex items-start gap-2 text-xs text-white/80 cursor-pointer group">
                  <div className="mt-0.5">
                    <input type="checkbox" checked={formData.acceptTerms} onChange={(e) => setFormData({...formData, acceptTerms: e.target.checked})} className="accent-[#4ade80] w-3.5 h-3.5" />
                  </div>
                  <span>Αποδέχομαι τους <a href="/terms" rel="noopener noreferrer" className="underline hover:text-white">όρους χρήσης</a>.</span>
                </label>
                <label className="flex items-start gap-2 text-xs text-white/80 cursor-pointer mt-2 group">
                  <div className="mt-0.5">
                    <input type="checkbox" checked={formData.acceptPromo} onChange={(e) => setFormData({...formData, acceptPromo: e.target.checked})} className="accent-[#4ade80] w-3.5 h-3.5" />
                  </div>
                  <span>Επιθυμώ να λαμβάνω ενημερώσεις της SGK Digital μέσω email.</span>
                </label>
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  disabled={loading}
                  type="submit" 
                  className="bg-white text-[#3b5bdb] hover:bg-gray-100 font-medium px-8 py-3 rounded-full transition-all disabled:opacity-70 flex items-center gap-2"
                >
                  {loading ? "Αποστολή..." : "Διεκδίκησε τα 150€ Σου!"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-[#3b5bdb] text-white text-xs md:text-sm text-center py-2 z-40 border-t border-white/20">
        Νέος πελάτης; Κάντε εγγραφή για <strong>150€ έκπτωση</strong> στην κατασκευή του digital barber shop σας!
      </div>

      {/* 3. Split Info Section ("Πώς λειτουργεί") */}
      <section id="how-it-works" className="bg-[#facc15] py-24 flex items-center justify-center relative overflow-hidden">
        <div className="max-w-7xl w-full mx-auto px-6 md:px-12 relative z-10 flex flex-col md:flex-row items-center">
          
          {/* Blue Box Copy */}
          <div className="w-full md:w-5/12 bg-[#3b5bdb] text-white p-10 md:p-16 h-full flex flex-col justify-center">
            <h3 className="text-4xl font-heading font-medium mb-8">Πώς λειτουργεί:</h3>
            <ul className="space-y-6 text-sm md:text-base text-white/90 leading-relaxed list-disc pl-5">
              <li>
                Συμπληρώνεις τη φόρμα με όνομα, κινητό, email και επιλέγεις πώς προτιμάς να επικοινωνήσουμε μαζί σου.
              </li>
              <li>
                Επικοινωνούμε μαζί σου (όπως ακριβώς μας ζήτησες) για να καταγράψουμε τις ανάγκες του κομμωτηρίου σου (ημερολόγια κρατήσεων, eshop για προϊόντα κτλ).
              </li>
              <li>
                Σχεδιάζουμε ένα υπερσύγχρονο app/website προσαρμοσμένο στα χρώματά σας.
              </li>
              <li>
                Εμείς σου δίνουμε <strong>150€ (σε εκπτωτικό κουπόνι)</strong> για την πρώτη κατασκευή, αρκεί να είσαι νέος πελάτης της SGK Digital.
              </li>
            </ul>
            <div className="mt-8 pt-6 border-t border-white/20 text-sm">
              Απλά. Ψηφιακά. Με ένα snap.
            </div>
          </div>

          {/* Image */}
          <div className="w-full md:w-7/12 relative aspect-[4/3] md:aspect-auto md:h-[600px] -mt-10 md:mt-0 md:-ml-10 z-0">
             <Image 
                src="/promo/barbershop_app_mockup.png" 
                alt="Barbershop App Mockup"
                fill
                className="object-contain md:object-cover object-left shadow-2xl hover:scale-105 transition-transform duration-700"
             />
          </div>
        </div>
      </section>

      {/* 4. White Big Text Section ("Μια νέα εμπειρία") */}
      <section className="bg-white py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-heading font-medium text-black leading-tight tracking-tight mb-8">
            Μια νέα, εύκολη και άνετη ψηφιακή εμπειρία από το κινητό σου – από την SGK Digital.
          </h2>
          <p className="text-gray-500 text-lg">
            Αυτοματοποίησε τα ραντεβού, πούλησε τα προϊόντα σου, και κράτα τους πελάτες σου ενημερωμένους όλα αυτόματα χωρίς να κάνεις απολύτως τίποτα.
          </p>
        </div>
      </section>

      {/* 5. Features Carousel / Cards */}
      <section id="features" className="bg-[#111111] py-24 pb-32 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-medium mb-4">Όλα για τις κρατήσεις σου</h2>
            <p className="text-gray-400">Δες πώς η SGK Digital κάνει την καθημερινότητα στο κομμωτήριο παιχνιδάκι.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="group cursor-pointer">
              <div className="bg-[#ff9a9e] aspect-square rounded-sm overflow-hidden relative flex items-center justify-center mb-6 p-8">
                <div className="relative w-full h-full max-w-[200px] max-h-[200px] transform group-hover:scale-105 transition-transform duration-500">
                  <Image src="/promo/icon_calendar.png" alt="Online Booking" fill className="object-contain drop-shadow-xl" />
                </div>
                {/* Play Button Icon */}
                <div className="absolute bottom-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <ChevronRight className="w-6 h-6 text-black ml-0.5" />
                </div>
              </div>
              <h4 className="text-xl font-bold mb-2">Κάνε την καθημερινότητά σου πιο εύκολη</h4>
              <p className="text-sm text-gray-400">Μάθε πώς να δέχεσαι ραντεβού online 24/7, χωρίς να χτυπάει το τηλέφωνο όλη μέρα.</p>
            </div>

            {/* Card 2 */}
            <div className="group cursor-pointer">
              <div className="bg-[#4ade80] aspect-square rounded-sm overflow-hidden relative flex items-center justify-center mb-6 p-8">
                <div className="relative w-full h-full max-w-[200px] max-h-[200px] transform group-hover:scale-105 transition-transform duration-500">
                  <Image src="/promo/icon_shop.png" alt="Products Eshop" fill className="object-contain drop-shadow-xl" />
                </div>
                <div className="absolute bottom-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <ChevronRight className="w-6 h-6 text-black ml-0.5" />
                </div>
              </div>
              <h4 className="text-xl font-bold mb-2">Πούλησε τα δικά σου προϊόντα</h4>
              <p className="text-sm text-gray-400">Για την ομαλή ενίσχυση των εσόδων σου, φτιάχνουμε ένα mini ενσωματωμένο eshop για τα προϊόντα σου για έξτρα ροή εσόδων.</p>
            </div>

            {/* Card 3 */}
            <div className="group cursor-pointer">
              <div className="bg-[#3b5bdb] aspect-square rounded-sm overflow-hidden relative flex items-center justify-center mb-6 p-8">
                <div className="relative w-full h-full max-w-[200px] max-h-[200px] transform group-hover:scale-105 transition-transform duration-500">
                  <Image src="/promo/icon_megaphone.png" alt="Marketing" fill className="object-contain drop-shadow-xl" />
                </div>
                <div className="absolute bottom-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <ChevronRight className="w-6 h-6 text-black ml-0.5" />
                </div>
              </div>
              <h4 className="text-xl font-bold mb-2">Μια νέα εμπειρία στα χέρια σου</h4>
              <p className="text-sm text-gray-400">Δες τα στατιστικά σου, στείλε SMS προσφορές στους πελάτες σου και κράτα τους κοντά σου.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer / Transparency Section */}
      <footer className="w-full bg-[#111111] border-t border-white/10 py-12 px-6 md:px-16 relative z-10 text-center md:text-left">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center md:items-start gap-4">
            <h1 className="text-3xl font-heading font-bold text-white tracking-tighter">sgk<span className="text-[#3b5bdb]">.</span></h1>
            <p className="text-sm text-white/50 max-w-xs">Σύγχρονα ψηφιακά καταστήματα και εφαρμογές που μεταμορφώνουν την επιχείρησή σας.</p>
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
            <p className="text-xs text-white/50 flex items-center gap-2"><span className="material-symbols-outlined text-[14px]">mail</span> info@sgk.gr</p>
            <div className="mt-4 flex gap-4">
              <a href="/privacy" rel="noopener noreferrer" className="text-xs text-[#facc15] hover:text-yellow-300 transition-colors">Πολιτική Απορρήτου</a>
              <a href="/terms" rel="noopener noreferrer" className="text-xs text-[#4ade80] hover:text-green-300 transition-colors">Όροι Χρήσης</a>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-white/10 text-center pb-24 md:pb-0">
          <p className="text-[11px] text-white/40">© {new Date().getFullYear()} SGK Digital. Όλα τα δικαιώματα διατηρούνται.</p>
        </div>
      </footer>
    </div>
  );
}
