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
            question: "Χρειάζεται να έχω τεχνικές γνώσεις ή να κάνω ρυθμίσεις μόνος μου;",
            answer: "Απολύτως τίποτα! Η υπηρεσία μας είναι 100% «με το κλειδί στο χέρι» (Turnkey). Η ομάδα της SGK Digital αναλαμβάνει τα πάντα: από τον σχεδιασμό του avatar και την εκπαίδευση με τα προϊόντα και τα δεδομένα της επιχείρησής σας, μέχρι τη διασύνδεση με το E-shop και το ERP σας."
        },
        {
            question: "Γιατί να επιλέξω Video AI Agent αντί για ένα απλό chatbot κειμένου;",
            answer: "Η ανθρώπινη οπτική επαφή, οι εκφράσεις και η ζωντανή ομιλία δημιουργούν άμεση εμπιστοσύνη που τα απρόσωπα chatbots δεν μπορούν να προσφέρουν. Οι πελάτες αισθάνονται ότι μιλούν με πραγματικό σύμβουλο, ενώ ο Agent εκτελεί πραγματικές εργασίες (παραγγελίες, emails, έλεγχο αποθεμάτων) ζωντανά."
        },
        {
            question: "Είναι τα εταιρικά και πελατειακά δεδομένα μου ασφαλή;",
            answer: "Απόλυτα. Σε αντίθεση με κοινόχρηστα δημόσια εργαλεία (όπως το δημόσιο ChatGPT ή Claude), τα μοντέλα που αναπτύσσουμε εκπαιδεύονται αποκλειστικά για τη δική σας επιχείρηση και τρέχουν σε αυτόνομους, ιδιωτικούς servers. Τα δεδομένα σας είναι 100% δικά σας, δεν διαμοιράζονται ποτέ με κανέναν τρίτο και δεν χρησιμοποιούνται για την εκπαίδευση άλλων συστημάτων."
        },
        {
            question: "Τι ακριβώς περιλαμβάνει το εφάπαξ κόστος εγκατάστασης των 500€;",
            answer: "Το αρχικό Setup Fee καταβάλλεται μία φορά και καλύπτει: πλήρη μελέτη των αναγκών σας, σχεδιασμό και παραμετροποίηση του avatar, εκπαίδευση του AI με τα εταιρικά σας έγγραφα και δεδομένα, σύνδεση μέσω API με τα συστήματά σας (ERP, E-shop) και τεστ λειτουργίας."
        },
        {
            question: "Μπορεί το Avatar να έχει το δικό μου πρόσωπο και φωνή;",
            answer: "Φυσικά! Μπορούμε να δημιουργήσουμε έναν απόλυτα ρεαλιστικό ψηφιακό κλώνο βασισμένο σε εσάς ή σε οποιοδήποτε στέλεχος της ομάδας σας, ή εναλλακτικά να επιλέξετε από τη συλλογή έτοιμων επαγγελματιών παρουσιαστών μας."
        },
        {
            question: "Πώς λειτουργεί η εξυπηρέτηση σε 160+ γλώσσες;",
            answer: "Ο ψηφιακός σας υπάλληλος αναγνωρίζει αυτόματα τη γλώσσα στην οποία μιλάει ή γράφει ο πελάτης σας και αποκρίνεται άμεσα στην ίδια γλώσσα με φυσική προφορά, επιτρέποντάς σας να εξυπηρετείτε παγκόσμιο κοινό 24/7."
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
                        <Link href="/liveavatar-demo2" target="_blank" className="hidden md:block text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
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
                {/* HERO SECTION - Outcome & Turnkey Focused */}
                <section className="pt-40 pb-20 px-6 sm:pt-48 sm:pb-24 flex flex-col items-center text-center max-w-5xl mx-auto">
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#0a0b10] mb-8 leading-[1.15]">
                        Δημιουργούμε για εσάς έναν <br />
                        πραγματικό Ψηφιακό Υπάλληλο.
                    </h1>
                    
                    <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                        Ξεχάστε τα ψυχρά chatbots και τα απρόσωπα τηλεφωνικά μενού. 
                        Υλοποιούμε έναν ορατό AI Agent που μιλάει <strong>πρόσωπο με πρόσωπο</strong> με τους πελάτες σας μέσω βίντεο, 
                        εμπνέει απόλυτη ανθρώπινη εμπιστοσύνη και <strong>εκτελεί πραγματικές εργασίες</strong> — συνδεδεμένος ζωντανά με την επιχείρησή σας.
                    </p>

                    <div className="flex flex-col items-center gap-4">
                        <button 
                            onClick={scrollToForm}
                            className="px-8 py-4 rounded-full bg-[#0a0b10] hover:bg-slate-800 text-white font-semibold text-lg transition-all shadow-md hover:shadow-lg"
                        >
                            Ζητήστε Προσφορά &rarr;
                        </button>
                    </div>
                </section>

                {/* PSYCHOLOGY & VALUE SECTION: WHY VIDEO MATTERS IN 2026 */}
                <section className="py-24 px-6 bg-slate-50 border-b border-slate-100">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0a0b10] mb-6 leading-tight">
                                Γιατί το ζωντανό Βίντεο κερδίζει κάθε Chatbot και Τηλεφωνικό Κέντρο;
                            </h2>
                            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                                Οι πελάτες δεν αγοράζουν από κουτάκια κειμένου, ούτε έχουν υπομονή για ρομποτικές φωνές στο τηλέφωνο. Αγοράζουν όταν βλέπουν κάποιον να τους κοιτάζει στα μάτια.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                                <div>
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-[#5b36f5] font-black text-xl flex items-center justify-center mb-6">
                                        01
                                    </div>
                                    <h3 className="text-xl font-bold text-[#0a0b10] mb-3">Ανθρώπινη Παρουσία & Εμπιστοσύνη</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        Η οπτική επαφή, οι εκφράσεις και η φυσική κίνηση δημιουργούν άμεση οικειότητα. Ο επισκέπτης νιώθει ότι μιλάει με έναν αληθινό επαγγελματία, μετατρέποντας τον δισταγμό σε ολοκληρωμένη παραγγελία.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                                <div>
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-[#5b36f5] font-black text-xl flex items-center justify-center mb-6">
                                        02
                                    </div>
                                    <h3 className="text-xl font-bold text-[#0a0b10] mb-3">Εκτέλεση Πραγματικών Εργασιών</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        Δεν είναι ένα απλό βίντεο που διαβάζει κείμενο. Είναι ένας εκπαιδευμένος υπάλληλος που στέλνει emails, αναζητά αρχεία, ελέγχει διαθεσιμότητα και καταχωρεί απευθείας εντολές στο ERP ή το E-shop σας.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                                <div>
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-[#5b36f5] font-black text-xl flex items-center justify-center mb-6">
                                        03
                                    </div>
                                    <h3 className="text-xl font-bold text-[#0a0b10] mb-3">100% Έτοιμο «Με το Κλειδί στο Χέρι»</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        Δεν χρειάζεται να μάθετε τεχνολογία ούτε να χάσετε χρόνο. Η SGK Digital αναλαμβάνει τα πάντα: από τον σχεδιασμό του avatar και την εκπαίδευση με τα προϊόντα σας, μέχρι την πλήρη εγκατάσταση.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FEATURE BLOCKS - 2 Column Style */}
                <section className="py-32 px-6 max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#0a0b10] mb-6">
                            Δεν αγοράζετε εργαλείο. <br className="hidden md:block"/>
                            Παραδίδουμε έναν ακούραστο συνεργάτη.
                        </h2>
                        <p className="text-slate-600">Αναλαμβάνει την πρώτη γραμμή επικοινωνίας και εκτελεί εργασίες, απελευθερώνοντας την ομάδα σας από χρονοβόρες επαναλαμβανόμενες διαδικασίες.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Box 1 - Automations & Tasks */}
                        <div className="bg-[#f7f7f9] rounded-3xl p-8 sm:p-10 flex flex-col justify-between hover:shadow-lg transition-shadow">
                            <div>
                                <h3 className="text-2xl sm:text-3xl font-bold text-[#0a0b10] mb-4 tracking-tight">Αυτόματη Εκτέλεση Εργασιών & Σύνδεση API</h3>
                                <p className="text-slate-600 mb-8 text-base sm:text-lg leading-relaxed">Ο ψηφιακός σας υπάλληλος δεν μένει στα λόγια. Στέλνει emails στους πελάτες, διαβάζει καταλόγους και αρχεία, ελέγχει τιμές και συνδέεται με ERP συστήματα, APIs και E-shops για να καταχωρεί παραγγελίες ζωντανά.</p>
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
                                <h3 className="text-2xl sm:text-3xl font-bold text-[#0a0b10] mb-4 tracking-tight">Εξυπηρέτηση σε 160+ Γλώσσες με το Δικό σας Πρόσωπο</h3>
                                <p className="text-slate-600 mb-8 text-base sm:text-lg leading-relaxed">Δημιουργούμε ψηφιακό κλώνο βασισμένο σε εσάς ή επιλέγουμε εξειδικευμένο παρουσιαστή. Μιλάει 160+ γλώσσες με φυσικότητα και ανθρώπινη εκφραστικότητα, αναγνωρίζει αυτόματα τη γλώσσα και δίνει παγκόσμια εμβέλεια στην εταιρεία σας.</p>
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

                {/* COMPANY USAGE SECTION - WE PRACTICE WHAT WE PREACH */}
                <section className="py-20 px-6 bg-[#f7f7f9] border-t border-b border-slate-200/80">
                    <div className="max-w-6xl mx-auto">
                        <div className="bg-white rounded-3xl p-8 sm:p-14 border border-slate-200/90 shadow-sm flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
                            <div className="flex-1 space-y-6">
                                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0a0b10] leading-tight">
                                    Το χρησιμοποιούμε πρώτοι εμείς σε ολόκληρη την εταιρεία μας.
                                </h2>
                                <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                                    Στην SGK Digital δεν προσφέρουμε απλώς μία τεχνολογία — τη λειτουργούμε ζωντανά στις δικές μας καθημερινές ροές. Οι διαδραστικοί μας AI Agents αναλαμβάνουν την πρώτη γραμμή εξυπηρέτησης των πελατών μας 24/7, απαντούν σε ερωτήσεις, συνδέονται με τα συστήματά μας και εκτελούν εργασίες σε πραγματικό χρόνο.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                                    <div className="border-l-2 border-[#5b36f5] pl-4">
                                        <div className="text-2xl font-black text-[#0a0b10]">24/7</div>
                                        <div className="text-xs text-slate-500 font-medium mt-1">Ζωντανή εξυπηρέτηση πελατών</div>
                                    </div>
                                    <div className="border-l-2 border-[#5b36f5] pl-4">
                                        <div className="text-2xl font-black text-[#0a0b10]">&lt; 1 sec</div>
                                        <div className="text-xs text-slate-500 font-medium mt-1">Άμεση απόκριση σε κάθε ερώτημα</div>
                                    </div>
                                    <div className="border-l-2 border-[#5b36f5] pl-4">
                                        <div className="text-2xl font-black text-[#0a0b10]">100%</div>
                                        <div className="text-xs text-slate-500 font-medium mt-1">Δοκιμασμένο σε πραγματικές συνθήκες</div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full lg:w-[420px] flex-shrink-0">
                                <div className="bg-gradient-to-br from-slate-900 to-[#101018] rounded-2xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#5b36f5]/20 rounded-full blur-2xl pointer-events-none" />
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                                            <span className="text-emerald-400 font-bold text-lg">●</span>
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm text-white">SGK Operations AI</div>
                                            <div className="text-[11px] text-slate-400">Εσωτερική χρήση & Εξυπηρέτηση</div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-300 leading-relaxed italic mb-6">
                                        «Από τη στιγμή που ενσωματώσαμε τον AI Agent στην υποδοχή και την εξυπηρέτηση πελατών της SGK Digital, μηδενίσαμε τους χρόνους αναμονής και αυτοματοποιήσαμε πάνω από το 70% των επαναλαμβανόμενων διαδικασιών.»
                                    </p>
                                    <Link 
                                        href="/liveavatar-demo2"
                                        target="_blank"
                                        className="w-full py-3 px-4 rounded-xl bg-white text-[#0a0b10] font-bold text-xs text-center block hover:bg-slate-100 transition-colors shadow-sm"
                                    >
                                        Δείτε τον Agent μας σε Δράση &rarr;
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PRICING SECTION - Light Mode */}
                <section id="pricing" className="py-24 px-6 relative bg-white border-t border-slate-100">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#0a0b10] mb-6">Επιλέξτε το πλάνο σας</h2>
                            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                                Διαφανής τιμολόγηση χωρίς εκπλήξεις. 
                                Αναλαμβάνουμε <strong>εξ ολοκλήρου</strong> τον σχεδιασμό του avatar, την εκπαίδευση του AI με τα δεδομένα σας και τη σύνδεση με το E-shop ή ERP σας. <br className="hidden sm:block"/>
                                Εφάπαξ Setup Fee «με το κλειδί στο χέρι»: <span className="text-[#0a0b10] font-bold">500€</span>.
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
                            <h2 className="text-4xl font-bold tracking-tight text-[#0a0b10] mb-4">Αποκτήστε τον δικό σας Ψηφιακό Υπάλληλο</h2>
                            <p className="text-slate-600 text-lg max-w-xl mx-auto">
                                Συμπληρώστε τα στοιχεία σας και η ομάδα της SGK Digital θα επικοινωνήσει μαζί σας εντός 24 ωρών για να σχεδιάσουμε τη λύση που ταιριάζει ακριβώς στην επιχείρησή σας.
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

            <Footer />

            {/* FLOATING INTERACTIVE AVATAR WIDGET (Video Background) */}
            {isWidgetOpen && (
                <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[170px] h-[230px] sm:w-[280px] sm:h-[360px] rounded-2xl shadow-2xl z-[100] border border-white/20 overflow-hidden shadow-black/60 group transition-all">
                    
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
                    <div className="absolute top-2.5 left-2.5 right-2.5 sm:top-4 sm:left-4 sm:right-4 flex justify-between items-center z-10">
                        {/* Unmute/Mute Toggle Button */}
                        <button 
                            onClick={toggleWidgetMute} 
                            className="w-7 h-7 sm:w-[38px] sm:h-[38px] rounded-full bg-white/30 backdrop-blur-md border border-white/50 flex items-center justify-center hover:bg-white/40 transition-colors"
                            aria-label={isWidgetMuted ? "Ενεργοποίηση ήχου" : "Σίγαση"}
                        >
                            {isWidgetMuted ? (
                                <svg className="w-3.5 h-3.5 sm:w-[18px] sm:h-[18px]" viewBox="0 0 24 24" fill="black" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                    <line x1="23" y1="9" x2="17" y2="15"></line>
                                    <line x1="17" y1="9" x2="23" y2="15"></line>
                                </svg>
                            ) : (
                                <svg className="w-3.5 h-3.5 sm:w-[18px] sm:h-[18px]" viewBox="0 0 24 24" fill="black" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                                </svg>
                            )}
                        </button>
                        
                        {/* Close Button */}
                        <button 
                            onClick={() => setIsWidgetOpen(false)} 
                            className="w-7 h-7 sm:w-[38px] sm:h-[38px] rounded-full bg-white/30 backdrop-blur-md border border-white/50 flex items-center justify-center hover:bg-white/40 transition-colors"
                            aria-label="Κλείσιμο"
                        >
                            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-[#0a0b10] rounded-full flex items-center justify-center">
                                <span className="text-white text-xs sm:text-sm font-bold leading-none mb-0.5">×</span>
                            </div>
                        </button>
                    </div>
                    
                    {/* Bottom CTA */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-5 sm:left-5 sm:right-5 z-10">
                        <Link 
                            href="/liveavatar-demo2" 
                            target="_blank"
                            className="flex items-center justify-center w-full bg-white text-center text-[#002b5c] font-bold text-xs sm:text-base leading-tight py-2.5 sm:py-3.5 px-3 rounded-lg sm:rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.2)] hover:bg-slate-50 transition-colors"
                        >
                            Μιλήστε μαζί μου
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
