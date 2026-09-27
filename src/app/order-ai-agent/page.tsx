"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";

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
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
    const [isWidgetMuted, setIsWidgetMuted] = useState(true);
    const widgetVideoRef = useRef<HTMLVideoElement>(null);

    const toggleWidgetMute = () => {
        if (widgetVideoRef.current) {
            const nextMuted = !isWidgetMuted;
            widgetVideoRef.current.muted = nextMuted;
            setIsWidgetMuted(nextMuted);
            if (widgetVideoRef.current.paused) {
                widgetVideoRef.current.play().catch(console.error);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const selectPackageAndScroll = (pkg: string) => {
        setFormData({ ...formData, packageType: pkg });
        scrollToForm();
    };

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
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

    const faqs = [
        {
            question: "Είναι εφάπαξ το κόστος εγκατάστασης (Setup Fee);",
            answer: "Ναι. Το αρχικό κόστος των 500€ καταβάλλεται μία φορά και αφορά την παραμετροποίηση, το στήσιμο και την ενσωμάτωση του AI συστήματος στην επιχείρησή σας."
        },
        {
            question: "Μπορώ να φτιάξω AI Avatar με το δικό μου πρόσωπο;",
            answer: "Φυσικά! Μπορούμε να δημιουργήσουμε έναν απόλυτα ρεαλιστικό ψηφιακό κλώνο βασισμένο σε εσάς ή σε οποιοδήποτε μέλος της ομάδας σας, αρκεί ένα μικρό βίντεο καλής ποιότητας."
        },
        {
            question: "Το AI ενσωματώνεται με το δικό μου E-shop ή CRM;",
            answer: "Ναι. Ο AI Agent μπορεί να εκπαιδευτεί πάνω στα δικά σας δεδομένα (κατάλογος προϊόντων, οδηγίες, FAQ) και να αντλεί δεδομένα για να απαντά στους πελάτες σας."
        },
        {
            question: "Πώς λειτουργεί με πολλαπλές γλώσσες;",
            answer: "Το AI μπορεί να κατανοήσει και να μιλήσει σε περισσότερες από 160 γλώσσες σε πραγματικό χρόνο. Ανιχνεύει αυτόματα τη γλώσσα του πελάτη σας και προσαρμόζεται άμεσα."
        }
    ];

    useEffect(() => {
        if (widgetVideoRef.current && isWidgetOpen) {
            widgetVideoRef.current.defaultMuted = true;
            widgetVideoRef.current.muted = true;
            const playPromise = widgetVideoRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch((err) => {
                    console.log("Auto-play prevented by browser:", err);
                });
            }
        }
    }, [isWidgetOpen]);

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#0a0b10] selection:text-white pb-24 lg:pb-0">
            {/* Minimal Light Header */}
            <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-black tracking-tight text-[#0a0b10]">
                        SGK<span className="text-[#5b36f5]">.</span>
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link href="/liveavatar-demo" target="_blank" className="hidden md:block text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                            Live Demo
                        </Link>
                        <button 
                            onClick={scrollToForm}
                            className="px-5 py-2.5 rounded-full bg-[#0a0b10] hover:bg-slate-800 text-white text-sm font-semibold transition-colors"
                        >
                            Ξεκινήστε &rarr;
                        </button>
                    </div>
                </div>
            </header>

            <main>
                {/* HERO SECTION - Synthesia Style */}
                <section className="pt-40 pb-20 px-6 sm:pt-48 sm:pb-24 flex flex-col items-center text-center max-w-5xl mx-auto">
                    <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-[#0a0b10] mb-8 leading-[1.1]">
                        Η κορυφαία AI Video <br className="hidden sm:block"/>
                        πλατφόρμα για την επιχείρησή σας
                    </h1>
                    
                    <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Δημιουργήστε διαδραστικά avatars ποιότητας studio σε 160+ γλώσσες. 
                        Εξοικονομήστε έως και 90% σε χρόνο και κόστος εξυπηρέτησης πελατών και πωλήσεων.
                    </p>

                    <div className="flex flex-col items-center gap-4">
                        <button 
                            onClick={scrollToForm}
                            className="px-8 py-4 rounded-full bg-[#0a0b10] hover:bg-slate-800 text-white font-semibold text-lg transition-all"
                        >
                            Ζητήστε Προσφορά &rarr;
                        </button>
                    </div>
                </section>

                {/* TRUST LOGOS */}
                <section className="py-12 border-t border-b border-slate-100 bg-white">
                    <p className="text-center text-sm font-medium text-slate-500 mb-8">Μας εμπιστεύονται πάνω από 50.000 εταιρείες κάθε μεγέθους</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale px-6">
                        <span className="text-xl font-bold font-serif tracking-tighter">REUTERS</span>
                        <span className="text-xl font-bold tracking-tighter">zoom</span>
                        <span className="text-xl font-bold">SAP</span>
                        <span className="text-xl font-bold">MERCK</span>
                        <span className="text-xl font-bold">Heineken</span>
                    </div>
                </section>

                {/* FEATURE BLOCKS - 2 Column Style */}
                {/* FEATURE BLOCKS - 2 Column Style */}
                <section className="py-32 px-6 max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#0a0b10] mb-6">
                            Περισσότερο από ένα Avatar. <br className="hidden md:block"/>
                            Ένας ψηφιακός υπάλληλος.
                        </h2>
                        <p className="text-slate-600">Δεν εξυπηρετεί απλά τους πελάτες σας. Αναλαμβάνει σύνθετες εργασίες, εκτελεί διορθώσεις και διαχειρίζεται λειτουργίες της επιχείρησής σας.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Box 1 - Automations & Tasks */}
                        <div className="bg-[#f7f7f9] rounded-3xl p-8 sm:p-10 flex flex-col justify-between hover:shadow-lg transition-shadow">
                            <div>
                                <span className="text-[#5b36f5] text-xs font-bold uppercase tracking-wider mb-4 block">• ΣΥΝΔΕΣΗ ΜΕ E-SHOPS & ERP</span>
                                <h3 className="text-2xl sm:text-3xl font-bold text-[#0a0b10] mb-4 tracking-tight">Εκτέλεση εργασιών και διασύνδεση API</h3>
                                <p className="text-slate-600 mb-8 text-base sm:text-lg leading-relaxed">Ο AI Agent δεν μιλάει απλά. Στέλνει emails, διαβάζει αρχεία, κάνει αλλαγές και συνδέεται με ERP συστήματα, APIs και E-shops για να αντλεί δεδομένα ή να καταχωρεί παραγγελίες ζωντανά.</p>
                            </div>
                            <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-md aspect-video relative group bg-slate-100">
                                <img 
                                    src="/ai-erp-integration.jpg" 
                                    alt="AI ERP και E-shop Αυτοματισμοί" 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        </div>

                        {/* Box 2 - Languages */}
                        <div className="bg-[#f7f7f9] rounded-3xl p-8 sm:p-10 flex flex-col justify-between hover:shadow-lg transition-shadow">
                            <div>
                                <span className="text-[#5b36f5] text-xs font-bold uppercase tracking-wider mb-4 block">• ΕΚΦΡΑΣΤΙΚΑ AVATARS</span>
                                <h3 className="text-2xl sm:text-3xl font-bold text-[#0a0b10] mb-4 tracking-tight">Άψογη εξυπηρέτηση σε 160+ Γλώσσες</h3>
                                <p className="text-slate-600 mb-8 text-base sm:text-lg leading-relaxed">Το AI Avatar σας κατανοεί και μιλάει σε πάνω από 160 γλώσσες με φυσικότητα και απίστευτη εκφραστικότητα. Αναγνωρίζει αυτόματα τη γλώσσα και προσαρμόζεται, ενώ εσείς διατηρείτε τον πλήρη έλεγχο.</p>
                            </div>
                            <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-md aspect-video relative group bg-slate-900">
                                <img 
                                    src="/ai-avatars-languages.jpg" 
                                    alt="Εκφραστικά AI Avatars σε 160+ Γλώσσες" 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* PRICING SECTION - Light Mode */}
                <section id="pricing" className="py-24 px-6 relative bg-white border-t border-slate-100">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#0a0b10] mb-6">Επιλέξτε το πλάνο σας</h2>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                                Διαφανής τιμολόγηση. Καμία κρυφή χρέωση. <br/>
                                Εφάπαξ κόστος σχεδιασμού, setup και εκπαίδευσης: <span className="text-[#0a0b10] font-bold">500€</span>.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {/* Basic Plan */}
                            <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col hover:border-slate-300 transition-all shadow-sm">
                                <h3 className="text-2xl font-bold text-[#0a0b10] mb-2">Basic</h3>
                                <p className="text-slate-500 text-sm mb-6">Ιδανικό για μικρές επιχειρήσεις.</p>
                                <div className="mb-6">
                                    <span className="text-4xl font-black text-[#0a0b10]">150€</span>
                                    <span className="text-slate-500"> / μήνα</span>
                                </div>
                                <ul className="space-y-4 mb-8 flex-1 text-slate-600 text-sm">
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
                                <button onClick={() => selectPackageAndScroll("Basic")} className="w-full py-3 rounded-xl border border-slate-200 text-[#0a0b10] font-semibold hover:bg-slate-50 transition-colors">
                                    Επιλογή Basic
                                </button>
                            </div>

                            {/* Pro Plan */}
                            <div className="bg-[#0a0b10] border border-[#0a0b10] rounded-3xl p-8 flex flex-col shadow-2xl relative transform md:-translate-y-4 text-white">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#5b36f5] text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                                    Δημοφιλέστερο
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                                <p className="text-slate-400 text-sm mb-6">Για αναπτυσσόμενες εταιρείες.</p>
                                <div className="mb-6">
                                    <span className="text-4xl font-black text-white">250€</span>
                                    <span className="text-slate-400"> / μήνα</span>
                                </div>
                                <ul className="space-y-4 mb-8 flex-1 text-slate-300 text-sm">
                                    <li className="flex items-center gap-3">
                                        <span className="text-white font-bold">✓</span> Έως 600 λεπτά
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-white font-bold">✓</span> ~0.41€ / λεπτό
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-white font-bold">✓</span> Προτεραιότητα Υποστήριξης
                                    </li>
                                </ul>
                                <button onClick={() => selectPackageAndScroll("Pro")} className="w-full py-3 rounded-xl bg-white text-[#0a0b10] font-semibold hover:bg-slate-100 transition-colors">
                                    Επιλογή Pro
                                </button>
                            </div>

                            {/* Enterprise Plan */}
                            <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col hover:border-slate-300 transition-all shadow-sm">
                                <h3 className="text-2xl font-bold text-[#0a0b10] mb-2">Enterprise</h3>
                                <p className="text-slate-500 text-sm mb-6">Για μέγιστη κάλυψη.</p>
                                <div className="mb-6">
                                    <span className="text-4xl font-black text-[#0a0b10]">450€</span>
                                    <span className="text-slate-500"> / μήνα</span>
                                </div>
                                <ul className="space-y-4 mb-8 flex-1 text-slate-600 text-sm">
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#5b36f5] font-bold">✓</span> Έως 1.200 λεπτά
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#5b36f5] font-bold">✓</span> ~0.37€ / λεπτό (Καλύτερη αξία)
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#5b36f5] font-bold">✓</span> 24/7 Αποκλειστική Υποστήριξη
                                    </li>
                                </ul>
                                <button onClick={() => selectPackageAndScroll("Enterprise")} className="w-full py-3 rounded-xl border border-slate-200 text-[#0a0b10] font-semibold hover:bg-slate-50 transition-colors">
                                    Επιλογή Enterprise
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ SECTION */}
                <section className="py-24 px-6 max-w-5xl mx-auto border-t border-slate-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="md:col-span-1">
                            <h2 className="text-4xl font-bold tracking-tight text-[#0a0b10] sticky top-32 leading-[1.1]">
                                Σίγουρα έχετε κάποιες ερωτήσεις
                            </h2>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            {faqs.map((faq, i) => (
                                <div key={i} className="border-b border-slate-200">
                                    <button 
                                        onClick={() => toggleFaq(i)}
                                        className="w-full py-6 flex justify-between items-center text-left hover:text-slate-600 transition-colors group"
                                    >
                                        <h3 className="text-lg font-bold text-[#0a0b10] group-hover:text-slate-700 pr-8">
                                            {faq.question}
                                        </h3>
                                        <span className="text-slate-400 text-3xl font-light transform transition-transform duration-200 flex-shrink-0" style={{ transform: openFaqIndex === i ? 'rotate(45deg)' : 'none' }}>
                                            +
                                        </span>
                                    </button>
                                    
                                    <div 
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === i ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}
                                    >
                                        <p className="text-slate-600 text-lg leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CONTACT FORM SECTION */}
                <section id="contact-form" className="py-32 px-6 bg-[#f7f7f9] border-t border-slate-200">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold tracking-tight text-[#0a0b10] mb-4">Είστε έτοιμοι;</h2>
                            <p className="text-slate-600 text-lg">
                                Συμπληρώστε τη φόρμα και η ομάδα μας θα επικοινωνήσει μαζί σας για να συζητήσουμε τον δικό σας προσαρμοσμένο AI Agent.
                            </p>
                        </div>

                        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
                            {isSuccess ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <div className="text-emerald-600 text-3xl font-bold">✓</div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#0a0b10] mb-4">Το αίτημά σας εστάλη με επιτυχία!</h3>
                                    <p className="text-slate-600">
                                        Ευχαριστούμε για το ενδιαφέρον σας. Ένας εκπρόσωπος της SGK Digital θα επικοινωνήσει μαζί σας σύντομα.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-[#0a0b10] ml-1">Ονοματεπώνυμο *</label>
                                            <input 
                                                type="text" 
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0a0b10] focus:ring-1 focus:ring-[#0a0b10] transition-all"
                                                placeholder="π.χ. Ιωάννης Παπαδόπουλος"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-[#0a0b10] ml-1">Εταιρεία</label>
                                            <input 
                                                type="text" 
                                                name="company"
                                                value={formData.company}
                                                onChange={handleChange}
                                                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0a0b10] focus:ring-1 focus:ring-[#0a0b10] transition-all"
                                                placeholder="Η εταιρεία σας"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-[#0a0b10] ml-1">Email *</label>
                                            <input 
                                                type="email" 
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0a0b10] focus:ring-1 focus:ring-[#0a0b10] transition-all"
                                                placeholder="info@company.com"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-[#0a0b10] ml-1">Τηλέφωνο</label>
                                            <input 
                                                type="tel" 
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0a0b10] focus:ring-1 focus:ring-[#0a0b10] transition-all"
                                                placeholder="π.χ. +30 210..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-[#0a0b10] ml-1">Επιλεγμένο Πλάνο</label>
                                        <select 
                                            name="packageType"
                                            value={formData.packageType}
                                            onChange={handleChange}
                                            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-[#0a0b10] focus:ring-1 focus:ring-[#0a0b10] transition-all"
                                        >
                                            <option value="">Επιλέξτε πλάνο (Προαιρετικό)</option>
                                            <option value="Basic">Basic - 150€ / μήνα (300 λεπτά)</option>
                                            <option value="Pro">Pro - 250€ / μήνα (600 λεπτά)</option>
                                            <option value="Enterprise">Enterprise - 450€ / μήνα (1.200 λεπτά)</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-[#0a0b10] ml-1">Λεπτομέρειες Έργου</label>
                                        <textarea 
                                            name="details"
                                            value={formData.details}
                                            onChange={handleChange}
                                            rows={4}
                                            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0a0b10] focus:ring-1 focus:ring-[#0a0b10] transition-all resize-y"
                                            placeholder="Πώς σχεδιάζετε να χρησιμοποιήσετε το AI avatar;"
                                        />
                                    </div>

                                    <button 
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-4 rounded-xl bg-[#0a0b10] hover:bg-slate-800 text-white font-bold text-lg transition-all disabled:opacity-70 flex items-center justify-center"
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center gap-2">
                                                <span className="w-5 h-5 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                                                Αποστολή...
                                            </span>
                                        ) : "Ζητήστε Προσφορά"}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </section>
            </main>
            
            {/* LARGE GRADIENT CTA FOOTER */}
            <section className="py-32 px-6 bg-gradient-to-br from-indigo-400 via-purple-500 to-indigo-600 text-center">
                <h2 className="text-5xl font-bold tracking-tight text-white mb-4">Έτοιμοι να δοκιμάσετε το Live Avatar;</h2>
                <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                    Γίνετε μέλος των καινοτόμων επιχειρήσεων σήμερα και ξεκινήστε να δημιουργείτε AI βίντεο σε 160+ γλώσσες.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button 
                        onClick={scrollToForm}
                        className="px-8 py-4 rounded-full bg-white hover:bg-slate-50 text-[#0a0b10] font-bold text-lg transition-all"
                    >
                        Ζητήστε Προσφορά &rarr;
                    </button>
                </div>
            </section>

            <Footer />

            {/* FLOATING INTERACTIVE AVATAR WIDGET (Video Background) */}
            {isWidgetOpen && (
                <div className="fixed bottom-6 right-6 w-[280px] h-[360px] rounded-2xl shadow-2xl z-[100] border border-white/20 overflow-hidden hidden sm:block shadow-black/60 group">
                    
                    {/* Background Video */}
                    <video 
                        ref={widgetVideoRef}
                        autoPlay
                        loop
                        muted
                        playsInline
                        poster="/avatar-preview-man.png"
                        preload="auto"
                        className="absolute inset-0 w-full h-full object-cover"
                    >
                        <source src="/gemini_generated_video_5c95b80d.mp4" type="video/mp4" />
                    </video>

                    {/* Bottom Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101015]/95 via-[#101015]/40 to-transparent pointer-events-none" />

                    {/* Header Controls */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                        {/* Unmute/Mute Toggle Button */}
                        <button 
                            onClick={toggleWidgetMute} 
                            className="w-[38px] h-[38px] rounded-full bg-white/30 backdrop-blur-md border border-white/50 flex items-center justify-center hover:bg-white/40 transition-colors"
                        >
                            {isWidgetMuted ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="black" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                    <line x1="23" y1="9" x2="17" y2="15"></line>
                                    <line x1="17" y1="9" x2="23" y2="15"></line>
                                </svg>
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="black" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                                </svg>
                            )}
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
                            className="flex items-center justify-center w-full bg-white text-center text-[#002b5c] font-bold text-[13px] leading-tight py-3 px-2 rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.2)] hover:bg-slate-50 transition-colors"
                        >
                            Μιλήστε μαζί μου να σας <br/> εξηγήσω περισσότερα
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
