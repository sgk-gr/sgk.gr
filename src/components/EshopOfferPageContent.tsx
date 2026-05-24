"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { sendContactEmail } from "@/lib/resend";
import { 
  CheckCircle2, 
  Layout, 
  Lock, 
  BarChart3, 
  Store, 
  ArrowRight,
  Phone,
  Mail,
  Zap,
  Search,
  Palette,
  Headphones
} from "lucide-react";

const features = [
  {
    icon: Layout,
    title: "Σύγχρονη Εμπειρία Χρήστη",
    description: "Custom σχεδιασμός με Next.js για αστραπιαία πλοήγηση και αισθητική που κερδίζει τον πελάτη."
  },
  {
    icon: Store,
    title: "Εύκολη Διαχείριση",
    description: "Πλήρης έλεγχος των προϊόντων και παραγγελιών σας μέσα από το γνώριμο περιβάλλον του WooCommerce."
  },
  {
    icon: BarChart3,
    title: "Στρατηγικό SEO",
    description: "Καθαρός κώδικας και βελτιστοποιημένη δομή για την υψηλότερη δυνατή κατάταξη στη Google."
  },
  {
    icon: Zap,
    title: "Παράδοση σε 14 ημέρες",
    description: "Εγγυημένος χρόνος παράδοσης 14 ημερών για να ξεκινήσετε τις πωλήσεις σας το συντομότερο δυνατό."
  },
  {
    icon: Lock,
    title: "Μέγιστη Ασφάλεια",
    description: "Θωρακισμένη αρχιτεκτονική που εκμηδενίζει τα κενά ασφαλείας, προστατεύοντας τα δεδομένα σας."
  }
];

const testimonials = [
  {
    quote: "Εξαιρετική δουλειά στην κατασκευή του eshop μας. Η ταχύτητα και η υποστήριξη της SGK Digital είναι σε άλλο επίπεδο. Το προτείνω ανεπιφύλακτα.",
    author: "Δημήτρης Καστανίδης",
    role: "Επιχειρηματίας",
    date: "Πριν από 2 μήνες"
  },
  {
    quote: "Επαγγελματίες με βαθιά γνώση του αντικειμένου. Το headless eshop που μας παρέδωσαν είναι αστραπιαίο και οι πωλήσεις μας αυξήθηκαν κατακόρυφα.",
    author: "Κώστας Ραυτόπουλος",
    role: "Retail Owner",
    date: "Πριν από 1 μήνα"
  },
  {
    quote: "Άψογη συνεργασία και άμεση επίλυση κάθε απορίας. Η καλύτερη επιλογή για όποιον θέλει ένα σύγχρονο και αξιόπιστο ηλεκτρονικό κατάστημα.",
    author: "Κώστας Παπαϊωάννου",
    role: "Marketing Manager",
    date: "Πριν από 3 εβδομάδες"
  }
];


const EshopOfferPageContent = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("");


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phone) {
      toast.error("Παρακαλούμε συμπληρώστε τα υποχρεωτικά πεδία (Όνομα, Email, Τηλέφωνο)");
      return;
    }

    setIsSubmitting(true);

    try {
      await sendContactEmail({ 
        name, 
        email, 
        phone, 
        message: `Ενδιαφέρον για eshop: ${category}`,
        offerPrice: 1999 
      });


      // 1. Google Ads Conversion tracking (BEFORE redirect)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        console.log("🔔 [Analytics] Triggering Google Ads Conversion...");
        
        // Old account
        (window as any).gtag('event', 'conversion', {
          'send_to': 'AW-18065062632/nJVvCNXa-5UcEOj1i6ZD',
          'value': 1999.0,
          'currency': 'EUR'
        });
        console.log("✅ [Analytics] Conversion sent to AW-18065062632");

        // New account
        (window as any).gtag('event', 'conversion', {
          'send_to': 'AW-18166808794/SJ5hCNjI-K0cENqBztZD',
          'value': 1999.0,
          'currency': 'EUR'
        });
        console.log("✅ [Analytics] Conversion sent to AW-18166808794");
      }

      // 2. Redirect
      router.push("/eshop-offer/thank-you");
      setName("");
      setEmail("");
      setPhone("");
      setCategory("");
      setStep(1);
    } catch (error) {
      toast.error("Κάτι πήγε στραβά. Δοκιμάστε ξανά αργότερα.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-16" key="offer-page-root">
      {/* Hero Section */}
      <section id="hero" className="relative overflow-hidden py-10 lg:py-20">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-10"
            poster="/hero-bg.jpg"
          >
            <source src="/sgkvideo.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left">


              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-7xl font-heading font-black tracking-tighter leading-[1.1] mb-8"
              >
                Κατασκευή Eshop
              </motion.h1>

                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Η επαγγελματική κατασκευή eshop είναι το κλειδί για περισσότερες πωλήσεις. 
                  Εμείς αναλαμβάνουμε την κατασκευή eshop σας με αστραπιαία ταχύτητα — παράδοση σε 14 μέρες.
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mb-10">
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground uppercase font-bold tracking-widest mb-1">Προσφορά Μαΐου</p>
                    <p className="text-3xl sm:text-4xl font-heading font-black">1.999€ <span className="text-lg font-normal text-muted-foreground line-through ml-2">3.500€</span></p>
                  </div>
                  <div className="h-12 w-px bg-border hidden sm:block"></div>
                </div>
                
                <div className="flex justify-center lg:justify-start mb-10">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link 
                      href="/eshop-demo" 
                      className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-primary/10 border border-white/10 hover:border-primary/30 rounded-2xl transition-all group backdrop-blur-sm"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Layout className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest leading-none mb-1">Preview</p>
                        <p className="font-heading font-bold text-lg leading-none">Δείτε το Live Demo</p>
                      </div>
                      <ArrowRight className="w-5 h-5 ml-4 group-hover:translate-x-2 transition-transform text-primary" />
                    </Link>
                  </motion.div>
                </div>

              </div>



            <div className="flex-1 w-full max-w-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-card/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                  <motion.div 
                    className="h-full bg-primary"
                    initial={{ width: "0%" }}
                    animate={{ width: step === 1 ? "50%" : "100%" }}
                  />
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Βήμα {step} από 2</span>
                  {step === 2 && (
                    <button 
                      onClick={() => setStep(1)}
                      className="text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
                    >
                      ← Πίσω
                    </button>
                  )}
                </div>
                
                <h3 className="text-2xl font-heading font-bold mb-6 text-center">
                  {step === 1 ? "Τι είδους κατασκευή eshop χρειάζεστε;" : "Εκδήλωση Ενδιαφέροντος"}
                </h3>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (step === 1) {
                    if (!category) {
                      toast.error("Παρακαλούμε επιλέξτε μια κατηγορία");
                      return;
                    }
                    setStep(2);
                  } else {
                    handleSubmit(e);
                  }
                }} className="space-y-4">
                  
                  {step === 1 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: "clothing", label: "Ρούχα / Μόδα" },
                        { id: "food", label: "Τρόφιμα" },
                        { id: "electronics", label: "Ηλεκτρονικά" },
                        { id: "other", label: "Άλλο" }
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.label)}
                          className={`p-4 rounded-xl border transition-all text-sm font-bold text-center ${
                            category === cat.label 
                              ? "bg-primary/20 border-primary text-primary" 
                              : "bg-background/50 border-border hover:border-primary/50"
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div>
                        <label htmlFor="name" className="block text-sm font-bold mb-2 text-slate-400 uppercase">ΟΝΟΜΑΤΕΠΩΝΥΜΟ *</label>
                        <input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="π.χ. Γιάννης Παπαδόπουλος"
                          required
                          className="w-full px-5 py-3.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-bold mb-2 text-slate-400 uppercase">EMAIL *</label>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="info@yourshop.gr"
                          required
                          className="w-full px-5 py-3.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-bold mb-2 text-slate-400 uppercase">ΤΗΛΕΦΩΝΟ *</label>
                        <input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="6900000000"
                          required
                          className="w-full px-5 py-3.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-primary text-primary-foreground font-heading font-bold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 group"
                  >
                    {step === 1 ? "ΕΠΟΜΕΝΟ ΒΗΜΑ" : (isSubmitting ? "Αποστολή..." : "ΟΛΟΚΛΗΡΩΣΗ ΕΝΔΙΑΦΕΡΟΝΤΟΣ")}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <p className="text-[10px] text-center text-muted-foreground mt-4">
                    {step === 2 && "* Υποχρεωτικά πεδία. Με την υποβολή συμφωνείτε στην επεξεργασία των δεδομένων σας."}
                  </p>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Stack Section */}
      <section id="technical-stack" className="py-20 bg-slate-950/50 border-y border-border">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">Τεχνική Ανάλυση & Πλεονεκτήματα</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Η κατασκευή eshop με εμάς συνδυάζει την ταχύτητα των στατικών σελίδων με τη δυναμική διαχείριση του ηλεκτρονικού εμπορίου.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-8 bg-card border border-border rounded-2xl group hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-heading font-bold mb-3">{feature.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section id="advantages" className="py-20 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-heading font-black mb-6"
            >
              Τα <span className="text-primary">Πλεονεκτήματα</span> μας
            </motion.h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Γιατί η κατασκευή eshop με την SGK είναι η καλύτερη επένδυση για την επιχείρησή σας.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Zap,
                title: "Ασύλληπτη Ταχύτητα",
                description: "Χρησιμοποιούμε Next.js για ακαριαίο φόρτωμα. 100/100 στο PageSpeed σημαίνει περισσότερες πωλήσεις."
              },
              {
                icon: Search,
                title: "Στρατηγικό SEO",
                description: "Δομή βελτιστοποιημένη για την Google. Εμφανιστείτε εκεί που σας ψάχνουν οι πελάτες σας."
              },
              {
                icon: Palette,
                title: "Custom Design",
                description: "Σχεδίαση υψηλής αισθητικής που αναδεικνύει την ταυτότητα του brand σας και εμπνέει εμπιστοσύνη."
              },
              {
                icon: Headphones,
                title: "24/7 Υποστήριξη",
                description: "Είμαστε δίπλα σας για ό,τι χρειαστείτε. Η επιτυχία σας είναι και δική μας προτεραιότητα."
              }
            ].map((adv, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative group p-8 rounded-3xl border border-border bg-card/30 hover:bg-card/50 transition-all duration-300"
              >
                <div className="mb-6 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                  <adv.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-3">{adv.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {adv.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Work Section */}
      <section id="recent-work" className="py-20 bg-slate-950/20 border-y border-border">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">Πρόσφατα Έργα Μας</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Δείτε το τελευταίο eshop που παραδώσαμε, κατασκευασμένο ακριβώς όπως το ονειρεύτηκε η πελάτισσά μας.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto text-center bg-card/50 backdrop-blur-sm border border-border rounded-3xl p-8 lg:p-12 shadow-xl relative overflow-hidden group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
            <div className="relative">
              <h3 className="text-3xl font-heading font-bold mb-6">Vaia Charms</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed text-lg">
                Το <strong>Vaia Charms</strong> είναι μια πρόσφατη κατασκευή eshop από την ομάδα μας. Σχεδιάστηκε με γνώμονα τη λεπτομέρεια, τα χρώματα και το συνολικό design ακριβώς όπως το ονειρευόταν η Βάια. 
              </p>
              <p className="text-muted-foreground mb-10 leading-relaxed text-lg">
                Δώσαμε τεράστια βάση στην αστραπιαία ταχύτητα φόρτωσης και τη βελτιστοποίηση SEO, ώστε το κατάστημα όχι μόνο να είναι εντυπωσιακό αισθητικά, αλλά και να φέρνει άμεσα αποτελέσματα.
              </p>
              <a 
                href="https://www.vaiacharms.gr/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-primary/25"
              >
                Επισκεφθείτε το eshop <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section id="whats-included" className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 rounded-3xl p-8 lg:p-12">
            <h2 className="text-3xl font-heading font-bold mb-8 text-center">Τι περιλαμβάνει το πακέτο:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                "Πλήρως Responsive Design (Mobile First)",
                "Διασύνδεση με Τράπεζες (Viva, Piraeus, κλπ)",
                "Σύνδεση με Courier (Webhooks & Tracking)",
                "Σύνδεση με Skroutz",
                "Διασύνδεση με ERP",
                "Σύστημα Analytics & Facebook Pixel",
                "Εκπαίδευση στη Διαχείριση Προϊόντων",
                "1 Έτος Τεχνική Υποστήριξη",
                "Δωρεάν SSL & Setup Hosting",
                "GDPR Compliance & Πολιτική Απορρήτου",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-slate-950/20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-8">
            <p className="text-primary font-heading text-xs tracking-[0.2em] uppercase mb-4">
              ✓ 3 ηλεκτρονικά καταστήματα παραδόθηκαν τον τελευταίο μήνα
            </p>
          </div>

          <div className="flex flex-col items-center text-center mb-16">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-8 h-8" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-xl font-bold">Google Reviews</span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-4xl font-bold">4.9</span>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-2xl">★</span>
                ))}
              </div>
              <span className="text-muted-foreground ml-2">(128 αξιολογήσεις)</span>
            </div>
            <h2 className="text-3xl font-heading font-bold mb-4">Τι λένε οι πελάτες μας στη Google</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 bg-card border border-border rounded-xl shadow-lg hover:shadow-primary/5 transition-all group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-lg">
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-[15px]">{t.author}</p>
                    <div className="flex items-center gap-1">
                      <div className="flex text-yellow-400 text-xs">
                        {[...Array(5)].map((_, star) => (
                          <span key={star}>★</span>
                        ))}
                      </div>
                      <span className="text-[11px] text-muted-foreground ml-1">{t.date}</span>
                    </div>
                  </div>
                  <div className="ml-auto">
                    <svg className="w-5 h-5 opacity-20" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    </svg>
                  </div>
                </div>
                <p className="text-[14px] text-foreground/80 leading-relaxed mb-4 italic">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <CheckCircle2 className="w-3 h-3 text-blue-400" />
                  <span>Επαληθευμένη αξιολόγηση</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* Dialog removed */}
    </div>
  );
};

export default EshopOfferPageContent;
