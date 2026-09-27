"use client";

import { useState } from "react";
import Link from "next/link";

export default function OrderAIAgentPage() {
    const [formData, setFormData] = useState({
        name: "",
        company: "",
        email: "",
        phone: "",
        details: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg("");

        try {
            const res = await fetch("/api/order-ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                throw new Error("Failed to submit");
            }

            setIsSuccess(true);
        } catch (err) {
            setErrorMsg("Παρουσιάστηκε σφάλμα. Παρακαλούμε δοκιμάστε ξανά.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const scrollToForm = () => {
        document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="min-h-screen bg-[#0a0b0e] text-slate-200 font-sans selection:bg-[#5b36f5] selection:text-white">
            {/* Minimal Header */}
            <header className="fixed top-0 left-0 w-full z-50 bg-[#0a0b0e]/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-black tracking-tighter text-white">
                        SGK<span className="text-[#5b36f5]">.</span>
                    </Link>
                    <button 
                        onClick={scrollToForm}
                        className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors border border-white/10"
                    >
                        Επικοινωνία
                    </button>
                </div>
            </header>

            <main>
                {/* HERO SECTION */}
                <section className="relative pt-40 pb-20 px-6 sm:pt-48 sm:pb-32 overflow-hidden flex flex-col items-center text-center">
                    {/* Background glow effects */}
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#5b36f5]/20 rounded-full blur-[120px] pointer-events-none" />
                    
                    <div className="max-w-4xl mx-auto relative z-10">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#5b36f5] font-medium text-sm mb-8">
                            <span className="w-2 h-2 rounded-full bg-[#5b36f5] animate-pulse" />
                            Η Νέα Εποχή στην Εξυπηρέτηση Πελατών
                        </div>
                        
                        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white mb-8 leading-tight">
                            Ο Επόμενος Υπάλληλός σας <br className="hidden sm:block"/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5b36f5] to-cyan-400">Δεν Κοιμάται Ποτέ.</span>
                        </h1>
                        
                        <p className="text-lg sm:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                            Αυξήστε τις πωλήσεις σας και εξυπηρετήστε τους πελάτες σας 24/7 με έναν φωτορεαλιστικό 
                            AI Υπάλληλο, εκπαιδευμένο αποκλειστικά για τη δική σας επιχείρηση.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button 
                                onClick={scrollToForm}
                                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#5b36f5] hover:bg-[#4927d6] text-white font-semibold text-lg transition-all hover:scale-105 shadow-2xl shadow-[#5b36f5]/40"
                            >
                                Ζητήστε Προσφορά
                            </button>
                            <Link 
                                href="/liveavatar-demo" 
                                target="_blank"
                                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 text-white font-semibold text-lg transition-colors border border-white/10"
                            >
                                Δείτε το Live Demo
                            </Link>
                        </div>
                    </div>
                </section>

                {/* AGITATION / PROBLEM SECTION */}
                <section className="py-24 px-6 bg-[#14151b] border-y border-white/5 relative">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                                Χάνετε πελάτες μετά τις 17:00;
                            </h2>
                            <p className="text-lg text-slate-400 leading-relaxed mb-6">
                                Η παραδοσιακή εξυπηρέτηση πελατών κοστίζει, απαιτεί συνεχή εκπαίδευση και 
                                δεν μπορεί να διαχειριστεί δεκάδες πελάτες ταυτόχρονα. Το αποτέλεσμα; 
                            </p>
                            <ul className="space-y-4 text-slate-300">
                                <li className="flex items-start gap-3">
                                    <span className="text-red-400 font-bold mt-1">✕</span>
                                    Μεγάλη αναμονή στο τηλέφωνο.
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-400 font-bold mt-1">✕</span>
                                    Αναπάντητα emails το Σαββατοκύριακο.
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-400 font-bold mt-1">✕</span>
                                    Χαμένες πωλήσεις από πελάτες που ήθελαν άμεση απάντηση.
                                </li>
                            </ul>
                        </div>
                        
                        <div className="relative">
                            {/* Abstract visual representation of missing leads */}
                            <div className="aspect-square sm:aspect-video md:aspect-square bg-gradient-to-br from-[#1e1f2b] to-[#14151b] rounded-3xl border border-white/10 p-8 flex flex-col justify-center relative overflow-hidden shadow-2xl">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-red-500/10 via-transparent to-transparent" />
                                <div className="space-y-4 relative z-10 opacity-70">
                                    <div className="w-3/4 h-4 bg-white/5 rounded-full" />
                                    <div className="w-1/2 h-4 bg-white/5 rounded-full" />
                                    <div className="w-5/6 h-4 bg-white/5 rounded-full" />
                                    <div className="w-full h-12 bg-red-500/10 border border-red-500/20 rounded-xl mt-8 flex items-center justify-center">
                                        <span className="text-red-400/80 text-sm font-mono tracking-widest uppercase">Missed Opportunity</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SOLUTION / FEATURES SECTION */}
                <section className="py-24 px-6 relative">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">Η Λύση: Ο Τέλειος Ψηφιακός Υπάλληλος</h2>
                            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                                Αξιοποιούμε τεχνολογία αιχμής (WebRTC & LLMs) για να δημιουργήσουμε έναν 
                                φωτορεαλιστικό εκπρόσωπο για την επιχείρησή σας.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Feature 1 */}
                            <div className="bg-[#14151b] border border-white/5 p-10 rounded-3xl hover:border-white/10 transition-colors">
                                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-6 opacity-80">01</div>
                                <h3 className="text-xl font-bold text-white mb-4">Άμεση Απόκριση, Μηδενική Αναμονή</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    Μπορεί να εξυπηρετήσει ταυτόχρονα 1 ή 1.000 πελάτες σε πραγματικό χρόνο. Χωρίς "παρακαλώ περιμένετε στη γραμμή", χωρίς εκνευρισμό.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="bg-[#14151b] border border-white/5 p-10 rounded-3xl hover:border-white/10 transition-colors">
                                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#5b36f5] mb-6 opacity-80">02</div>
                                <h3 className="text-xl font-bold text-white mb-4">Μιλάει Άπταιστα 50+ Γλώσσες</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    Εξυπηρετήστε πελάτες από όλο τον κόσμο στη μητρική τους γλώσσα. Το AI αναγνωρίζει αυτόματα τη γλώσσα και προσαρμόζεται άμεσα.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="bg-[#14151b] border border-white/5 p-10 rounded-3xl hover:border-white/10 transition-colors">
                                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 mb-6 opacity-80">03</div>
                                <h3 className="text-xl font-bold text-white mb-4">Γνωρίζει Τέλεια την Επιχείρησή σας</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    Δεν δίνει γενικές απαντήσεις. Τροφοδοτούμε το AI με τα δικά σας δεδομένα, τα προϊόντα σας, τις τιμές σας και τις πολιτικές σας.
                                </p>
                            </div>

                            {/* Feature 4 */}
                            <div className="bg-[#14151b] border border-white/5 p-10 rounded-3xl hover:border-white/10 transition-colors">
                                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500 mb-6 opacity-80">04</div>
                                <h3 className="text-xl font-bold text-white mb-4">Δραστική Μείωση Κόστους</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    Αντικαταστήστε τα τεράστια λειτουργικά κόστη με μια μικρή μηνιαία επένδυση, πολλαπλασιάζοντας την απόδοση και τις πωλήσεις σας.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CONTACT FORM SECTION */}
                <section id="contact-form" className="py-24 px-6 bg-[#14151b] border-t border-white/5 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[#5b36f5]/10 blur-[150px] pointer-events-none" />
                    
                    <div className="max-w-3xl mx-auto relative z-10">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Κάντε το Επόμενο Βήμα</h2>
                            <p className="text-slate-400 text-lg">
                                Συμπληρώστε τη φόρμα για να συζητήσουμε πώς ένας AI Agent μπορεί να μεταμορφώσει 
                                τη δική σας επιχείρηση.
                            </p>
                        </div>

                        <div className="bg-[#0a0b0e] p-8 sm:p-12 rounded-[2rem] border border-white/10 shadow-2xl">
                            {isSuccess ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <div className="text-emerald-400 text-3xl font-bold">✓</div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-4">Η Αίτησή σας Εστάλη!</h3>
                                    <p className="text-slate-400">
                                        Ευχαριστούμε για το ενδιαφέρον σας. Ένας εκπρόσωπος της SGK Digital θα 
                                        επικοινωνήσει μαζί σας πολύ σύντομα.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300 ml-1">Ονοματεπώνυμο *</label>
                                            <input 
                                                type="text" 
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full bg-[#14151b] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#5b36f5] focus:ring-1 focus:ring-[#5b36f5] transition-all"
                                                placeholder="π.χ. Γιάννης Παπαδόπουλος"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300 ml-1">Εταιρεία</label>
                                            <input 
                                                type="text" 
                                                name="company"
                                                value={formData.company}
                                                onChange={handleChange}
                                                className="w-full bg-[#14151b] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#5b36f5] focus:ring-1 focus:ring-[#5b36f5] transition-all"
                                                placeholder="Η επιχείρησή σας"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300 ml-1">Email *</label>
                                            <input 
                                                type="email" 
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full bg-[#14151b] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#5b36f5] focus:ring-1 focus:ring-[#5b36f5] transition-all"
                                                placeholder="info@company.gr"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300 ml-1">Τηλέφωνο</label>
                                            <input 
                                                type="tel" 
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full bg-[#14151b] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#5b36f5] focus:ring-1 focus:ring-[#5b36f5] transition-all"
                                                placeholder="π.χ. 210..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300 ml-1">Λίγα λόγια για τις ανάγκες σας</label>
                                        <textarea 
                                            name="details"
                                            value={formData.details}
                                            onChange={handleChange}
                                            rows={4}
                                            className="w-full bg-[#14151b] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#5b36f5] focus:ring-1 focus:ring-[#5b36f5] transition-all resize-y"
                                            placeholder="Πώς πιστεύετε ότι θα μπορούσε το AI να βοηθήσει την επιχείρησή σας;"
                                        />
                                    </div>

                                    {errorMsg && (
                                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                                            {errorMsg}
                                        </div>
                                    )}

                                    <button 
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-4 rounded-xl bg-[#5b36f5] hover:bg-[#4927d6] text-white font-bold text-lg transition-all disabled:opacity-70 flex items-center justify-center"
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center gap-2">
                                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Αποστολή...
                                            </span>
                                        ) : "Εκδήλωση Ενδιαφέροντος"}
                                    </button>
                                    
                                    <p className="text-center text-xs text-slate-500 mt-4">
                                        Τα δεδομένα σας είναι ασφαλή. Δεν θα χρησιμοποιηθούν για spam.
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                </section>
            </main>
            
            <footer className="py-8 text-center text-slate-500 text-sm border-t border-white/5 bg-[#0a0b0e]">
                &copy; {new Date().getFullYear()} SGK Digital. Με επιφύλαξη παντός δικαιώματος.
            </footer>
        </div>
    );
}
