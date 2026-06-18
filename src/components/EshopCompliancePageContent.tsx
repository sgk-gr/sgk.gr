"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { AlertTriangle, ShieldCheck, Scale, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { sendContactEmail } from "@/lib/resend";
import confetti from "canvas-confetti";

export default function EshopCompliancePageContent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    marketingConsent: true,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.website) {
      setError("Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία.");
      return;
    }
    
    setIsSubmitting(true);
    setError("");

    try {
      await sendContactEmail({
        type: "compliance_audit",
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        website: formData.website,
        marketingConsent: formData.marketingConsent,
      });

      setIsSuccess(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FF6B00", "#FFFFFF", "#000000"],
      });
    } catch (err: any) {
      setError(err.message || "Κάτι πήγε στραβά. Προσπαθήστε ξανά.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-black text-white py-20 lg:py-32">
          <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/90 to-black"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-red-600/20 text-red-500 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-red-600/30"
              >
                <AlertTriangle size={16} />
                <span>Οδηγία Ε.Ε. 2023/2673</span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              >
                Το E-shop σας <span className="text-primary">κινδυνεύει</span> από τον νέο Ευρωπαϊκό Νόμο;
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
              >
                Έως τις 19 Ιουνίου 2026, όλα τα ηλεκτρονικά καταστήματα υποχρεούνται να ενσωματώσουν το <strong>Ειδικό Κουμπί Υπαναχώρησης</strong>. Αν αγνοήσετε τον νόμο, τα πρόστιμα είναι εξοντωτικά.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <a href="#audit-form" className="btn btn-primary text-lg px-8 py-4 rounded-full shadow-[0_0_20px_rgba(255,107,0,0.4)] hover:shadow-[0_0_30px_rgba(255,107,0,0.6)] transition-all flex items-center gap-2 mx-auto w-fit font-bold">
                  ΔΩΡΕΑΝ ΤΕΧΝΙΚΟΣ ΕΛΕΓΧΟΣ
                  <ArrowRight size={20} />
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Τι Αλλάζει &amp; Ποιες Είναι οι Συνέπειες;</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Η Ευρωπαϊκή Ένωση γίνεται αυστηρότερη με την προστασία των καταναλωτών. Η ενσωμάτωση δεν είναι απλά η προσθήκη ενός κειμένου, αλλά απαιτεί αλλαγές στον κώδικα και τη ροή του E-shop σας.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-card border border-border p-8 rounded-2xl text-center hover:border-primary/50 transition-colors">
                <div className="bg-red-500/10 text-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Scale size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">Πρόστιμο 4% του Τζίρου</h3>
                <p className="text-muted-foreground">
                  Σε περίπτωση μη συμμόρφωσης, οι ελεγκτικές αρχές επιβάλλουν διοικητικά πρόστιμα που φτάνουν έως και το 4% του ετήσιου κύκλου εργασιών της επιχείρησής σας.
                </p>
              </div>

              <div className="bg-card border border-border p-8 rounded-2xl text-center hover:border-primary/50 transition-colors">
                <div className="bg-primary/10 text-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">12 Μήνες Υπαναχώρηση</h3>
                <p className="text-muted-foreground">
                  Αν δεν έχετε εφαρμόσει σωστά τη διαδικασία υπαναχώρησης, η προθεσμία για τον πελάτη επεκτείνεται νομίμως από τις 14 ημέρες σε 1 χρόνο και 14 ημέρες.
                </p>
              </div>

              <div className="bg-card border border-border p-8 rounded-2xl text-center hover:border-primary/50 transition-colors">
                <div className="bg-green-500/10 text-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">Πλήρης Συμμόρφωση</h3>
                <p className="text-muted-foreground">
                  Η ομάδα της SGK Digital αναλαμβάνει τον πλήρη τεχνικό έλεγχο και τις αναβαθμίσεις, εξασφαλίζοντας ότι το E-shop σας είναι 100% νόμιμο.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Lead Capture Section */}
        <section id="audit-form" className="py-20 bg-muted border-t border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-card rounded-3xl overflow-hidden shadow-2xl border border-border flex flex-col md:flex-row">
              {/* Left Side: Info */}
              <div className="w-full md:w-5/12 bg-black text-white p-10 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Ζητήστε Δωρεάν Έλεγχο!</h3>
                  <p className="text-gray-400 mb-8">
                    Συμπληρώστε τη φόρμα και οι ειδικοί μας θα ελέγξουν το e-shop σας για να δουν αν είστε συμβατοί με τη νέα Οδηγία της Ε.Ε.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="text-primary" size={20} />
                      <span>Εντοπισμός τεχνικών κενών</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="text-primary" size={20} />
                      <span>Ανάλυση ροής αγοράς</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="text-primary" size={20} />
                      <span>Οικονομική προσφορά αναβάθμισης</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 text-sm text-gray-500">
                  <p>100% Εμπιστευτικότητα. Δεν θα μοιραστούμε τα στοιχεία σας.</p>
                </div>
              </div>

              {/* Right Side: Form */}
              <div className="w-full md:w-7/12 p-10">
                {isSuccess ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                    <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-2xl font-bold">Το αίτημά σας ελήφθη!</h3>
                    <p className="text-muted-foreground">
                      Ένας εξειδικευμένος τεχνικός μας θα ελέγξει το e-shop σας και θα επικοινωνήσει μαζί σας σύντομα.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">
                        {error}
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Ονοματεπώνυμο *</label>
                      <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                        className="w-full p-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" 
                        placeholder="Π.χ. Γιάννης Παπαδόπουλος" 
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Τηλέφωνο *</label>
                        <input 
                          type="tel" 
                          name="phone" 
                          value={formData.phone} 
                          onChange={handleChange} 
                          required 
                          className="w-full p-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" 
                          placeholder="69XXXXXXXX" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email *</label>
                        <input 
                          type="email" 
                          name="email" 
                          value={formData.email} 
                          onChange={handleChange} 
                          required 
                          className="w-full p-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" 
                          placeholder="info@yourshop.gr" 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">URL του E-shop σας *</label>
                      <input 
                        type="url" 
                        name="website" 
                        value={formData.website} 
                        onChange={handleChange} 
                        required 
                        className="w-full p-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" 
                        placeholder="https://www.yourshop.gr" 
                      />
                    </div>

                    <div className="flex items-start gap-3 pt-2">
                      <input 
                        type="checkbox" 
                        id="marketing" 
                        name="marketingConsent" 
                        checked={formData.marketingConsent} 
                        onChange={handleChange} 
                        className="mt-1 accent-primary" 
                      />
                      <label htmlFor="marketing" className="text-sm text-muted-foreground">
                        Συμφωνώ να λαμβάνω ενημερώσεις και προσφορές από την SGK Digital. Μπορώ να διαγραφώ ανά πάσα στιγμή.
                      </label>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting} 
                      className={`w-full p-4 rounded-lg font-bold text-white transition-all flex justify-center items-center gap-2 ${isSubmitting ? 'bg-primary/70 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'}`}
                    >
                      {isSubmitting ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        "ΑΙΤΗΜΑ ΔΩΡΕΑΝ ΕΛΕΓΧΟΥ"
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
