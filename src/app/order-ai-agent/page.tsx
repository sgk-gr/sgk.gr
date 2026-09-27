"use client";

import { useState } from "react";
import Link from "next/link";

export default function OrderAIAgentPage() {
    const [formData, setFormData] = useState({
        name: "",
        company: "",
        email: "",
        phone: "",
        details: "",
        packageType: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [isWidgetOpen, setIsWidgetOpen] = useState(true);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const selectPackageAndScroll = (pkg: string) => {
        setFormData({ ...formData, packageType: pkg });
        scrollToForm();
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
        <div className="min-h-screen bg-[#0a0b0e] text-slate-200 font-sans selection:bg-[#5b36f5] selection:text-white pb-24 lg:pb-0">
            {/* Minimal Dark Header */}
            <header className="fixed top-0 left-0 w-full z-50 bg-[#0a0b0e]/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-black tracking-tight text-white">
                        SGK<span className="text-[#5b36f5]">.</span>
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link href="/liveavatar-demo" target="_blank" className="hidden md:block text-sm font-medium text-slate-400 hover:text-white transition-colors">
                            Live Demo
                        </Link>
                        <button 
                            onClick={scrollToForm}
                            className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 text-sm font-semibold transition-colors"
                        >
                            Επικοινωνία &rarr;
                        </button>
                    </div>
                </div>
            </header>

            <main>
                {/* HERO SECTION - Dark Glow Style */}
                <section className="relative pt-40 pb-20 px-6 sm:pt-48 sm:pb-24 flex flex-col items-center text-center max-w-5xl mx-auto overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#5b36f5]/20 rounded-full blur-[120px] pointer-events-none" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 font-semibold text-xs tracking-wide mb-8">
                            <span className="w-2 h-2 rounded-full bg-[#5b36f5] animate-pulse"></span> Η ΝΕΑ ΕΠΟΧΗ ΤΗΣ SGK DIGITAL
                        </div>
                        
                        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white mb-8 leading-[1.1]">
                            Ο Επόμενος Υπάλληλός σας <br className="hidden sm:block"/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5b36f5] to-cyan-400">Δεν Κοιμάται Ποτέ.</span>
                        </h1>
                        
                        <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Αυξήστε τις πωλήσεις σας και εξυπηρετήστε τους πελάτες σας 24/7 με έναν φωτορεαλιστικό AI Υπάλληλο, εκπαιδευμένο αποκλειστικά για εσάς.
                        </p>

                        <div className="flex flex-col items-center gap-4">
                            <button 
                                onClick={scrollToForm}
                                className="px-8 py-4 rounded-full bg-[#5b36f5] hover:bg-[#4927d6] shadow-lg shadow-[#5b36f5]/30 text-white font-semibold text-lg transition-all hover:scale-105"
                            >
                                Ζητήστε Προσφορά &rarr;
                            </button>
                        </div>
                    </div>
                </section>

                {/* TRUST LOGOS */}
                <section className="py-12 border-t border-b border-white/5 bg-[#0a0b0e] relative z-10">
                    <p className="text-center text-sm font-medium text-slate-500 mb-8">Η τεχνολογία που εμπιστεύονται χιλιάδες επιχειρήσεις</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale px-6">
                        <span className="text-xl font-bold font-serif tracking-tighter">REUTERS</span>
                        <span className="text-xl font-bold tracking-tighter">zoom</span>
                        <span className="text-xl font-bold">SAP</span>
                        <span className="text-xl font-bold">MERCK</span>
                        <span className="text-xl font-bold">Heineken</span>
                    </div>
                </section>

                {/* FEATURE BLOCKS - Dark 2 Column Style */}
                <section className="py-32 px-6 max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6">
                            Μία πλατφόρμα, άπειρες <br className="hidden md:block"/>
                            δυνατότητες για την επιχείρησή σας
                        </h2>
                        <p className="text-slate-400">Εκπαίδευση με τα δικά σας δεδομένα, έτοιμο να πουλήσει σε 160 γλώσσες.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Box 1 */}
                        <div className="bg-[#14151b] border border-white/5 rounded-3xl p-10 flex flex-col hover:border-white/10 transition-colors">
                            <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">• ΑΜΕΣΗ ΑΠΟΚΡΙΣΗ</span>
                            <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Εξυπηρέτηση χωρίς αναμονή</h3>
                            <p className="text-slate-400 mb-10 text-lg">Μπορεί να εξυπηρετήσει ταυτόχρονα 1.000 πελάτες σε πραγματικό χρόνο. Χωρίς "παρακαλώ περιμένετε στη γραμμή".</p>
                            <div className="mt-auto h-64 bg-gradient-to-br from-[#1e1f2b] to-[#14151b] rounded-2xl border border-white/10 flex flex-col items-center justify-center text-slate-600 font-bold overflow-hidden relative">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent" />
                                <span className="text-4xl mb-2 text-cyan-500/20">0 Μηδέν</span>
                                <span className="text-lg">Χρόνος Αναμονής</span>
                            </div>
                        </div>

                        {/* Box 2 */}
                        <div className="bg-[#14151b] border border-white/5 rounded-3xl p-10 flex flex-col hover:border-white/10 transition-colors">
                            <span className="text-[#5b36f5] text-xs font-bold uppercase tracking-wider mb-4">• 160+ ΓΛΩΣΣΕΣ</span>
                            <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Μιλήστε στον κόσμο</h3>
                            <p className="text-slate-400 mb-10 text-lg">Εξυπηρετήστε πελάτες από όλο τον κόσμο στη μητρική τους γλώσσα. Το AI αναγνωρίζει αυτόματα και προσαρμόζεται.</p>
                            <div className="mt-auto h-64 bg-gradient-to-br from-[#1e1f2b] to-[#14151b] rounded-2xl border border-white/10 flex flex-col items-center justify-center text-slate-600 font-bold overflow-hidden relative">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-[#5b36f5]/20 via-transparent to-transparent" />
                                <span className="text-4xl mb-2 text-[#5b36f5]/30">Global</span>
                                <span className="text-lg">Επικοινωνία</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PRICING SECTION - Dark Mode */}
                <section id="pricing" className="py-24 px-6 relative bg-[#0a0b0e] border-t border-white/5">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6">Επιλέξτε το Πλάνο σας</h2>
                            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                                Διαφανής τιμολόγηση, χωρίς κρυφές χρεώσεις. <br/>
                                Εφάπαξ κόστος σχεδιασμού, εκπαίδευσης και εγκατάστασης AI: <span className="text-white font-bold">3.000€</span>.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {/* Basic Plan */}
                            <div className="bg-[#14151b] border border-white/10 rounded-3xl p-8 flex flex-col hover:border-white/20 transition-all">
                                <h3 className="text-2xl font-bold text-white mb-2">Basic</h3>
                                <p className="text-slate-400 text-sm mb-6">Ιδανικό για μικρές επιχειρήσεις.</p>
                                <div className="mb-6">
                                    <span className="text-4xl font-black text-white">150€</span>
                                    <span className="text-slate-400"> / μήνα</span>
                                </div>
                                <ul className="space-y-4 mb-8 flex-1 text-slate-300 text-sm">
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#5b36f5] font-bold">✓</span> Έως 300 λεπτά
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#5b36f5] font-bold">✓</span> ~0.50€ / λεπτό
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#5b36f5] font-bold">✓</span> 50+ Γλώσσες
                                    </li>
                                </ul>
                                <button onClick={() => selectPackageAndScroll("Basic")} className="w-full py-3 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/5 transition-colors">
                                    Επιλογή Basic
                                </button>
                            </div>

                            {/* Pro Plan */}
                            <div className="bg-gradient-to-b from-[#1c1d29] to-[#14151b] border border-[#5b36f5] rounded-3xl p-8 flex flex-col shadow-2xl shadow-[#5b36f5]/20 relative transform md:-translate-y-4">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#5b36f5] text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                                    Προτεινομενο
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                                <p className="text-slate-400 text-sm mb-6">Για αναπτυσσόμενες επιχειρήσεις.</p>
                                <div className="mb-6">
                                    <span className="text-4xl font-black text-white">250€</span>
                                    <span className="text-slate-400"> / μήνα</span>
                                </div>
                                <ul className="space-y-4 mb-8 flex-1 text-slate-300 text-sm">
                                    <li className="flex items-center gap-3">
                                        <span className="text-cyan-400 font-bold">✓</span> Έως 600 λεπτά
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-cyan-400 font-bold">✓</span> ~0.41€ / λεπτό
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-cyan-400 font-bold">✓</span> Priority Support
                                    </li>
                                </ul>
                                <button onClick={() => selectPackageAndScroll("Pro")} className="w-full py-3 rounded-xl bg-[#5b36f5] hover:bg-[#4927d6] text-white font-semibold transition-colors">
                                    Επιλογή Pro
                                </button>
                            </div>

                            {/* Enterprise Plan */}
                            <div className="bg-[#14151b] border border-white/10 rounded-3xl p-8 flex flex-col hover:border-white/20 transition-all">
                                <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                                <p className="text-slate-400 text-sm mb-6">Για μέγιστη κάλυψη.</p>
                                <div className="mb-6">
                                    <span className="text-4xl font-black text-white">450€</span>
                                    <span className="text-slate-400"> / μήνα</span>
                                </div>
                                <ul className="space-y-4 mb-8 flex-1 text-slate-300 text-sm">
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#5b36f5] font-bold">✓</span> Έως 1.200 λεπτά
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#5b36f5] font-bold">✓</span> ~0.37€ / λεπτό
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#5b36f5] font-bold">✓</span> 24/7 Priority
                                    </li>
                                </ul>
                                <button onClick={() => selectPackageAndScroll("Enterprise")} className="w-full py-3 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/5 transition-colors">
                                    Επιλογή Enterprise
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ SECTION - Dark Mode */}
                <section className="py-24 px-6 max-w-5xl mx-auto border-t border-white/5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="md:col-span-1">
                            <h2 className="text-3xl font-bold tracking-tight text-white sticky top-32">
                                Συχνές Ερωτήσεις
                            </h2>
                        </div>
                        <div className="md:col-span-2 space-y-6">
                            {[
                                "Είναι το κόστος σχεδιασμού (3.000€) εφάπαξ;",
                                "Μπορώ να έχω το δικό μου πρόσωπο (κλώνο) για Avatar;",
                                "Το AI συνδέεται με το δικό μου e-shop ή CRM;",
                                "Τι γίνεται αν υπερβώ τα λεπτά του πακέτου μου;"
                            ].map((question, i) => (
                                <div key={i} className="border-b border-white/10 pb-6">
                                    <h3 className="text-lg font-semibold text-white flex justify-between items-center cursor-pointer hover:text-[#5b36f5] transition-colors">
                                        {question}
                                        <span className="text-slate-500 text-2xl font-light">+</span>
                                    </h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CONTACT FORM SECTION (Dark mode styling) */}
                <section id="contact-form" className="py-32 px-6 bg-[#14151b] border-t border-white/5 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[#5b36f5]/5 blur-[150px] pointer-events-none" />

                    <div className="max-w-3xl mx-auto relative z-10">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">Έτοιμοι να ξεκινήσουμε;</h2>
                            <p className="text-slate-400 text-lg">
                                Συμπληρώστε τη φόρμα και θα επικοινωνήσουμε άμεσα μαζί σας για μια δωρεάν παρουσίαση.
                            </p>
                        </div>

                        <div className="bg-[#0a0b0e] p-8 sm:p-12 rounded-3xl border border-white/10 shadow-2xl">
                            {isSuccess ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <div className="text-emerald-400 text-3xl font-bold">✓</div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-4">Το Αίτημα Εστάλη!</h3>
                                    <p className="text-slate-400">
                                        Ευχαριστούμε για το ενδιαφέρον. Ένας εκπρόσωπος της SGK Digital θα επικοινωνήσει μαζί σας σύντομα.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-300 ml-1">Ονοματεπώνυμο *</label>
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
                                            <label className="text-sm font-semibold text-slate-300 ml-1">Εταιρεία</label>
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
                                            <label className="text-sm font-semibold text-slate-300 ml-1">Email *</label>
                                            <input 
                                                type="email" 
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full bg-[#14151b] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#5b36f5] focus:ring-1 focus:ring-[#5b36f5] transition-all"
                                                placeholder="info@company.com"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-300 ml-1">Τηλέφωνο</label>
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
                                        <label className="text-sm font-semibold text-slate-300 ml-1">Επιλεγμένο Πλάνο</label>
                                        <select 
                                            name="packageType"
                                            value={formData.packageType}
                                            onChange={handleChange}
                                            className="w-full bg-[#14151b] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#5b36f5] focus:ring-1 focus:ring-[#5b36f5] transition-all appearance-none"
                                        >
                                            <option value="">Επιλέξτε πλάνο (Προαιρετικό)</option>
                                            <option value="Basic">Basic - 150€ / μήνα (300 λεπτά)</option>
                                            <option value="Pro">Pro - 250€ / μήνα (600 λεπτά)</option>
                                            <option value="Enterprise">Enterprise - 450€ / μήνα (1.200 λεπτά)</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-300 ml-1">Περιγραφή Ανάγκης</label>
                                        <textarea 
                                            name="details"
                                            value={formData.details}
                                            onChange={handleChange}
                                            rows={4}
                                            className="w-full bg-[#14151b] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#5b36f5] focus:ring-1 focus:ring-[#5b36f5] transition-all resize-y"
                                            placeholder="Πώς πιστεύετε ότι θα μπορούσε το AI να βοηθήσει την επιχείρησή σας;"
                                        />
                                    </div>

                                    <button 
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-4 rounded-xl bg-[#5b36f5] hover:bg-[#4927d6] text-white font-bold text-lg transition-all disabled:opacity-70 flex items-center justify-center shadow-lg shadow-[#5b36f5]/20"
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center gap-2">
                                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Αποστολή...
                                            </span>
                                        ) : "Εκδήλωση Ενδιαφέροντος"}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </section>
            </main>
            
            {/* LARGE GRADIENT CTA FOOTER */}
            <section className="py-32 px-6 bg-gradient-to-br from-[#2a1772] via-[#5b36f5] to-cyan-600 text-center">
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">Δοκιμάστε το AI Avatar ζωντανά!</h2>
                <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto">
                    Μιλήστε τώρα με τον ψηφιακό εκπρόσωπο της SGK Digital.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button 
                        onClick={scrollToForm}
                        className="px-8 py-4 rounded-full bg-white hover:bg-slate-100 text-[#5b36f5] font-bold text-lg transition-all"
                    >
                        Ζητήστε Προσφορά &rarr;
                    </button>
                    <Link 
                        href="/liveavatar-demo" 
                        target="_blank"
                        className="px-8 py-4 rounded-full bg-transparent hover:bg-white/10 text-white font-bold text-lg transition-colors border border-white/30"
                    >
                        Live Demo
                    </Link>
                </div>
            </section>

            <footer className="py-12 text-center text-slate-500 text-sm bg-[#050508] border-t border-white/5">
                <div className="pt-8">
                    &copy; {new Date().getFullYear()} SGK Digital. Με επιφύλαξη παντός δικαιώματος.
                </div>
            </footer>

            {/* FLOATING INTERACTIVE AVATAR WIDGET (Synthesia Exact Clone) */}
            {isWidgetOpen && (
                <div className="fixed bottom-6 right-6 w-[280px] h-[360px] rounded-2xl shadow-2xl z-[100] border border-white/20 overflow-hidden hidden sm:block shadow-black/60 group">
                    
                    {/* Background Image */}
                    <img 
                        src="/avatar-preview-man.png" 
                        alt="AI Avatar Preview" 
                        className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Bottom Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101015]/95 via-[#101015]/40 to-transparent pointer-events-none" />

                    {/* Header Controls */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                        {/* Unmute Button */}
                        <button className="w-[38px] h-[38px] rounded-full bg-white/30 backdrop-blur-md border border-white/50 flex items-center justify-center hover:bg-white/40 transition-colors">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="black" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                            </svg>
                        </button>
                        
                        {/* Close Button */}
                        <button onClick={() => setIsWidgetOpen(false)} className="w-[38px] h-[38px] rounded-full bg-white/30 backdrop-blur-md border border-white/50 flex items-center justify-center hover:bg-white/40 transition-colors">
                            <div className="w-5 h-5 bg-[#0a0b10] rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold leading-none mb-0.5">×</span>
                            </div>
                        </button>
                    </div>
                    
                    {/* Bottom CTA */}
                    <div className="absolute bottom-5 left-5 right-5 z-10">
                        <Link 
                            href="/liveavatar-demo" 
                            target="_blank"
                            className="block w-full bg-white text-center text-[#002b5c] font-bold text-lg py-3.5 rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.2)] hover:bg-slate-50 transition-colors"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
