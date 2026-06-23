"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight, ShieldCheck, ChevronDown } from "lucide-react";

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors duration-200"
            >
                <span className="font-semibold text-base text-black pr-4">{question}</span>
                <ChevronDown
                    className={`w-5 h-5 text-[#3b5bdb] shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                />
            </button>
            {open && (
                <div className="px-6 pb-5 text-black/70 font-light leading-relaxed text-sm border-t border-gray-100">
                    <p className="pt-4">{answer}</p>
                </div>
            )}
        </div>
    );
}

export default function PayAsYouGrowClient() {
    const [mounted, setMounted] = useState(false);

    // Calculator State
    const [monthlySales, setMonthlySales] = useState(500);
    const commissionRate = 0.05; // 5%

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const calculatedCommission = Math.round(monthlySales * commissionRate);

    return (
        <div className="min-h-screen bg-[#f4f2ea] flex flex-col font-sans text-black">
            <Navbar />

            <main className="flex-grow pt-24 pb-0">
                {/* Hero */}
                <section className="container mx-auto px-4 py-8 md:py-12 max-w-[1200px]">
                    <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl flex flex-col md:flex-row items-stretch min-h-[320px] md:min-h-[380px]">
                        {/* Left: Text */}
                        <div className="flex-1 flex flex-col justify-center px-8 md:px-12 py-8 md:py-8 z-10">
                            <p className="text-sm text-black/40 font-light tracking-widest uppercase mb-3">Μοναδικό Μοντέλο. Μόνο από την SGK</p>
                            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 text-black flex flex-wrap items-center gap-x-3 gap-y-1">
                                <span>Ξεκίνα χωρίς ρίσκο.</span>
                                <span className="inline-flex flex-col shrink-0 mt-1">
                                    <span className="bg-[#80ff9f] text-black text-[18px] font-bold px-2 py-[5px] leading-none tracking-tight self-start">Pay as</span>
                                    <span className="bg-[#3b5bdb] text-white text-[18px] font-bold px-3 py-[5px] leading-none tracking-tight">you grow</span>
                                </span>
                            </h1>
                            <p className="text-base text-black/60 font-light mt-1 max-w-xl leading-relaxed">
                                Απόκτησε επαγγελματικό Eshop <strong className="text-black">με setup fee μόνο 600€</strong> και μας ξεπληρώνεις το υπόλοιπο από τις πωλήσεις σου, όσες και αν είναι. Δεν έχεις; Δεν πληρώνεις.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full max-w-md">
                                <a href="#calculator" className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#3b5bdb] hover:bg-[#2b4bba] text-white font-bold rounded-lg transition-all duration-300 text-sm shadow-md whitespace-nowrap">
                                    Δες το Πλάνο σου <ArrowRight className="w-4 h-4" />
                                </a>
                                <Link href="/eshop-offer?plan=pay-as-you-grow" className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-lg transition-all duration-300 text-sm whitespace-nowrap">
                                    Κάνε Αίτηση Τώρα
                                </Link>
                            </div>
                        </div>

                        {/* Center: Person image (Full block cover) */}
                        <div className="relative flex-shrink-0 w-full md:w-[420px] h-[300px] md:h-auto overflow-hidden">
                            <img
                                src="/payg-hero-person.png"
                                alt="Ζευγάρι κατασκευάζει κοσμήματα και πακετάρει παραγγελίες"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>

                        {/* Right: Offer highlight */}
                        <div className="flex flex-col items-center justify-center bg-[#f0f4ff] px-8 md:px-10 py-8 md:py-8 md:w-[260px] border-t md:border-t-0 md:border-l border-gray-100 z-10">
                            <p className="text-sm text-black/50 font-light mb-2 text-center">Εξοφλείς με μόλις</p>
                            <div className="text-center">
                                <span className="text-5xl font-black text-[#3b5bdb] leading-none">5%</span>
                                <span className="block text-sm font-semibold text-[#3b5bdb] mt-1">επί των πωλήσεών σου</span>
                            </div>
                            <div className="mt-4 bg-[#3b5bdb] text-white text-xs font-bold px-4 py-2 rounded-full text-center">
                                Χωρίς Δεσμεύσεις
                            </div>
                            <p className="text-xs text-black/40 mt-4 text-center leading-relaxed">
                                Αν δεν πουλάς,<br />δεν πληρώνεις τίποτα άλλο.
                            </p>
                            <div className="flex items-center gap-1.5 mt-3">
                                <ShieldCheck className="w-4 h-4 text-[#4ade80]" />
                                <span className="text-xs text-black/50">Εγγυημένα ασφαλές</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Info Blocks */}
                <section className="container mx-auto px-6 max-w-[1400px] mb-24 mt-8">
                    <div className="flex flex-col md:flex-row gap-8 items-stretch">
                        {/* Block 1: How it works */}
                        <div className="w-full md:w-1/2 bg-[#4ade80] text-black p-8 md:p-12 shadow-2xl flex flex-col justify-between">
                            <div>
                                <h3 className="text-3xl font-bold mb-2 text-black">Πώς λειτουργεί;</h3>
                                <p className="text-black/60 text-sm mb-8 font-light">Απλά, διαφανή, δίκαια.</p>
                                <ul className="space-y-6">
                                    <li className="flex items-start text-black/90">
                                        <span className="w-3 h-3 bg-black mr-4 shrink-0 mt-1.5 rounded-sm"></span>
                                        <div>
                                            <strong className="text-black block mb-1 font-bold">1. Πληρώνεις ένα μικρό Setup Fee</strong>
                                            <span className="text-black/80">Καλύπτει μόνο τα πραγματικά κόστη υποδομής: VPS Server (δωρεάν 1ο έτος), Domain .gr (2 έτη), SSL & αρχική εγκατάσταση. <strong className="text-black font-extrabold underline underline-offset-2">Κανένα κέρδος για εμάς σε αυτό το στάδιο.</strong></span>
                                        </div>
                                    </li>
                                    <li className="flex items-start text-black/90">
                                        <span className="w-3 h-3 bg-black mr-4 shrink-0 mt-1.5 rounded-sm"></span>
                                        <div>
                                            <strong className="text-black block mb-1 font-bold">2. Κατασκευή & Παράδοση σε 15 μέρες</strong>
                                            <span className="text-black/80">Σχεδιάζουμε ένα Eshop Next.js / WooCommerce, mobile-first, με PageSpeed 95+ και έτοιμο SEO. <strong className="text-black font-extrabold underline underline-offset-2">Έτοιμο να δεχτεί παραγγελίες από την 1η μέρα.</strong></span>
                                        </div>
                                    </li>
                                    <li className="flex items-start text-black/90">
                                        <span className="w-3 h-3 bg-black mr-4 shrink-0 mt-1.5 rounded-sm"></span>
                                        <div>
                                            <strong className="text-black block mb-1 font-bold">3. Μόνο 5% επί πωλήσεων για 12 μήνες</strong>
                                            <span className="text-black/80">Κρατάμε 5% μόνο από ό,τι πουλάς. Δεν πούλησες; Δεν πληρώνεις. <strong className="text-black font-extrabold underline underline-offset-2">Μηδέν ρίσκο, μηδέν άγχος.</strong></span>
                                        </div>
                                    </li>
                                    <li className="flex items-start text-black/90">
                                        <span className="w-3 h-3 bg-black mr-4 shrink-0 mt-1.5 rounded-sm"></span>
                                        <div>
                                            <strong className="text-black block mb-1 font-bold">4. Μετά τους 12 μήνες: 100% δικό σου, για πάντα</strong>
                                            <span className="text-black/80">Η συνεργασία ολοκληρώνεται. Κρατάς το eshop, τα προϊόντα, τους πελάτες, το brand. <strong className="text-black font-extrabold underline underline-offset-2">Κανείς δεν μπορεί να σου το πάρει.</strong></span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Block 2: Value proposition */}
                        <div className="w-full md:w-1/2 bg-white text-black p-8 md:p-12 shadow-2xl flex flex-col justify-between border border-gray-200">
                            <div>
                                <h3 className="text-3xl font-light mb-2 text-[#3b5bdb]">Γιατί δεν έχεις τίποτα να χάσεις;</h3>
                                <p className="text-black/40 text-sm mb-8 font-light">Σκέψου το απλά.</p>
                                <ul className="space-y-6">
                                    <li className="flex items-start text-black/80">
                                        <span className="w-3 h-3 bg-[#3b5bdb] mr-4 shrink-0 mt-1.5 rounded-sm"></span>
                                        <div>
                                            <strong className="text-black block mb-1">Πληρώνεις μόνο αν έχεις έσοδα</strong>
                                            <span>Η προμήθειά μας υπολογίζεται αποκλειστικά επί των πραγματικών σου πωλήσεων. Αν κάποιον μήνα δεν κάνεις καμία πώληση, δεν πληρώνεις απολύτως τίποτα. Χωρίς κρυφά πάγια ή ελάχιστες χρεώσεις.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start text-black/80">
                                        <span className="w-3 h-3 bg-[#3b5bdb] mr-4 shrink-0 mt-1.5 rounded-sm"></span>
                                        <div>
                                            <strong className="text-black block mb-1">Κοινός στόχος μας είναι η επιτυχία σου</strong>
                                            <span>Επειδή η αμοιβή μας συνδέεται με τις πωλήσεις σου, έχουμε κάθε λόγο να σχεδιάσουμε ένα Eshop που να είναι εξαιρετικά γρήγορο, εύχρηστο και να φέρνει παραγγελίες. Δουλεύουμε μαζί σου για να αναπτυχθείς.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start text-black/80">
                                        <span className="w-3 h-3 bg-[#3b5bdb] mr-4 shrink-0 mt-1.5 rounded-sm"></span>
                                        <div>
                                            <strong className="text-black block mb-1">Κρατάς το eshop δικό σου για πάντα</strong>
                                            <span>Δεν σε δεσμεύουμε με αιώνιες προμήθειες. Μετά τους 12 μήνες, η συνεργασία μας ολοκληρώνεται και το eshop σού ανήκει 100%, χωρίς καμία άλλη υποχρέωση προς εμάς.</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Calculator Section */}
                <section id="calculator" className="py-20 bg-white border-t border-gray-200 scroll-mt-20">
                    <div className="container mx-auto px-6 max-w-4xl">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-light mb-4">Διαμόρφωσε το Πλάνο σου</h2>
                            <p className="text-gray-500 font-light max-w-xl mx-auto">
                                Κούνα τον slider και δες <strong className="text-black">ακριβώς</strong> τι πληρώνεις κάθε μήνα. Χωρίς εκπλήξεις, χωρίς κρυφά έξοδα.
                            </p>
                        </div>

                        <div className="bg-[#f4f2ea] p-8 md:p-12 rounded-2xl border border-gray-300 shadow-md">
                            <div className="mb-10 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-semibold uppercase tracking-wider text-gray-500">Εκτιμώμενος Μηνιαίος Τζίρος:</span>
                                    <span className="text-3xl font-extrabold text-[#3b5bdb]">{monthlySales.toLocaleString("el-GR")} €</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="20000"
                                    step="500"
                                    value={monthlySales}
                                    onChange={(e) => setMonthlySales(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3b5bdb]"
                                />
                                <div className="flex justify-between text-xs text-gray-400 font-medium">
                                    <span>0 €</span>
                                    <span>10.000 €</span>
                                    <span>20.000 €</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-300 text-center">
                                <div className="p-4 bg-white rounded-lg border border-gray-200">
                                    <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Αρχικό Κόστος</span>
                                    <span className="text-lg font-extrabold text-black">600 €</span>
                                    <span className="block text-[10px] text-gray-400 mt-1">Εφάπαξ πληρωμή</span>
                                </div>
                                <div className="p-4 bg-white rounded-lg border border-gray-200">
                                    <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Προμήθεια</span>
                                    <span className="text-2xl font-extrabold text-[#4ade80]">5.0 %</span>
                                    <span className="block text-[10px] text-gray-400 mt-1">Επί των πωλήσεων</span>
                                </div>
                                <div className="p-4 bg-[#3b5bdb]/10 rounded-lg border border-[#3b5bdb]/20">
                                    <span className="block text-xs font-bold uppercase tracking-wider text-[#3b5bdb] mb-1">Κόστος / Μήνα</span>
                                    <span className="text-2xl font-extrabold text-[#3b5bdb]">{calculatedCommission} €</span>
                                    <span className="block text-[10px] text-[#3b5bdb]/70 mt-1">Για 12 μήνες</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-20 bg-[#f4f2ea] border-t border-gray-200">
                    <div className="container mx-auto px-6 max-w-3xl">
                        <div className="text-center mb-14">
                            <h2 className="text-3xl md:text-4xl font-light mb-3">Έχεις Απορίες; Απαντάμε Όλα</h2>
                            <p className="text-black/50 font-light">Διαφάνεια σε κάθε λεπτομέρεια</p>
                        </div>
                        <div className="space-y-3">
                            {[
                                {
                                    q: "Πόσο είναι το Setup Fee; Υπάρχουν κρυφές χρεώσεις;",
                                    a: "Το Setup Fee είναι ακριβώς 600€. Αυτό το ποσό καλύπτει τα πραγματικά κόστη υποδομής για να ξεκινήσετε (server, domain, ssl κλπ). Δεν υπάρχουν κρυφές χρεώσεις, ούτε τώρα, ούτε ποτέ."
                                },
                                {
                                    q: "Υπογράφεται κάποιο συμβόλαιο ή ιδιωτικό συμφωνητικό;",
                                    a: "Ναι, απολύτως. Για την πλήρη διασφάλιση και των δύο πλευρών, συντάσσουμε και υπογράφουμε επίσημο ιδιωτικό συμφωνητικό ψηφιακά μέσω του gov.gr. Εκεί ορίζονται με κάθε λεπτομέρεια οι όροι της 12μηνης συνεργασίας και η τελική μεταβίβαση του Eshop σε εσάς."
                                },
                                {
                                    q: "Τι γίνεται αν δεν πουλήσω τίποτα τον 1ο μήνα;",
                                    a: "Πληρώνετε 0€ προμήθεια. Μηδέν. Δεν υπάρχει minimum χρέωση, δεν υπάρχει πρόστιμο, δεν υπάρχει τίποτα. Το μόνο που έχετε πληρώσει είναι το setup fee, και η κατασκευή του eshop σας έχει ήδη γίνει. Αρχίζετε τον επόμενο μήνα με μηδέν άγχος."
                                },
                                {
                                    q: "Πώς ξέρω ότι η αναφορά πωλήσεων είναι σωστή;",
                                    a: "Έχετε πλήρη πρόσβαση στο admin panel του eshop σας και σε Google Analytics. Τα νούμερα είναι ορατά σε εσάς σε real-time, οποιαδήποτε στιγμή, 24/7. Κάθε μήνα λαμβάνετε και αναλυτική email αναφορά από εμάς. Δεν υπάρχει καμία δυνατότητα χειραγώγησης."
                                },
                                {
                                    q: "Τι γίνεται μετά τους 12 μήνες;",
                                    a: "Το eshop ανήκει 100% σε εσάς, χωρίς καμία προμήθεια. Μπορείτε να το διαχειρίζεστε μόνοι σας ή να συνεργαστείτε μαζί μας με συμβόλαιο συντήρησης (προαιρετικό). Δεν θα σας ζητήσουμε τίποτα παραπάνω. Κρατάτε τα πάντα: τον κώδικα, τα προϊόντα, τους πελάτες, το brand."
                                },
                                {
                                    q: "Μπορώ να σταματήσω τη συνεργασία νωρίτερα;",
                                    a: "Ναι. Αν θέλετε να σταματήσετε πριν τους 12 μήνες, εξοφλείτε απλώς το υπόλοιπο ποσό της κατασκευής (συμφωνημένη τιμή μείον τις ήδη καταβληθείσες προμήθειες) και το eshop είναι 100% δικό σας. Δεν υπάρχουν ποινές, δεν υπάρχουν εκπλήξεις."
                                },
                                {
                                    q: "Σε ποιες πλατφόρμες κατασκευάζετε;",
                                    a: "Κατασκευάζουμε κυρίως σε Next.js (custom, υπερταχύ) και WooCommerce (WordPress, εύκολο management). Επιλέγουμε μαζί σας ανάλογα με τις ανάγκες σας. Και στις δύο περιπτώσεις έχετε πλήρη ιδιοκτησία του κώδικα."
                                },
                                {
                                    q: "Τι περιλαμβάνει το eshop που θα φτιάξετε;",
                                    a: "Πλήρες επαγγελματικό eshop: custom design, mobile-first, PageSpeed 95+, SEO-ready, ασφαλείς πληρωμές (Stripe / Viva / ελληνικές τράπεζες), διαχείριση αποθέματος, αυτόματα emails παραγγελίας, cookie policy, GDPR-compliant. Έτοιμο να πουλάει από την 1η μέρα."
                                },
                                {
                                    q: "Πόσος χρόνος χρειάζεται για την κατασκευή;",
                                    a: "Ανάλογα με το project, παραδίδουμε σε 10–20 εργάσιμες μέρες. Δεν κάνουμε 'εκτιμήσεις', ορίζουμε μαζί ρεαλιστική ημερομηνία παράδοσης και την τηρούμε. Αν αργήσουμε εμείς, σας αποζημιώνουμε."
                                },
                                {
                                    q: "Τι γίνεται αν δεν μου αρέσει το αποτέλεσμα;",
                                    a: "Πριν από την τελική παράδοση κάνουμε 2 γύρους αναθεωρήσεων μαζί σας. Εγκρίνετε κάθε σελίδα πριν 'ανέβει' online. Αν παρόλα αυτά δεν είστε ικανοποιημένοι, επιστρέφουμε το setup fee πλήρως. Δεν παίζουμε με την εμπιστοσύνη σας."
                                },
                                {
                                    q: "Είμαι αρχάριος. Θα μπορέσω να διαχειριστώ το eshop;",
                                    a: "Απολύτως. Παραδίδουμε με βίντεο εκπαίδευσης και γραπτό εγχειρίδιο. Θα μπορείτε να ανεβάζετε προϊόντα, να διαχειρίζεστε παραγγελίες και να βλέπετε στατιστικά μόνοι σας. Αν έχετε οποιαδήποτε απορία, είμαστε διαθέσιμοι κατά τη διάρκεια των 12 μηνών."
                                },
                                {
                                    q: "Γιατί να επιλέξω εσάς αντί για ένα έτοιμο Shopify / Skroutz;",
                                    a: "Shopify: 29€+/μήνα ΓΙΑ ΠΑΝΤΑ, ακόμα κι αν δεν πουλάτε τίποτα. Skroutz: 5–15% ΓΙΑ ΠΑΝΤΑ + 400€/έτος. Εμείς: μικρό setup fee + 5% για 12 μήνες και μετά το eshop είναι 100% δικό σας, δεν πληρώνετε τίποτα άλλο. Ποιο μοντέλο είναι προφανώς καλύτερο;"
                                },
                                {
                                    q: "Υπάρχει κάποια δέσμευση ή ελάχιστη διάρκεια που πρέπει να μείνω;",
                                    a: "Δεν υπάρχει καμία παγίδα. Το πρόγραμμα διαρκεί 12 μήνες, αλλά μπορείτε να το διακόψετε οποιαδήποτε στιγμή εξοφλώντας το υπόλοιπο (αν υπάρχει). Δεν πληρώνετε 'ποινή διακοπής'. Απλό, δίκαιο, ανθρώπινο."
                                }
                            ].map((item, i) => (
                                <FAQItem key={i} question={item.q} answer={item.a} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA section */}
                <section className="py-20 bg-gradient-to-br from-[#3b5bdb] to-[#2b4bba] text-white text-center">
                    <div className="container mx-auto px-6 max-w-3xl">
                        <p className="text-[#4ade80] font-bold tracking-widest text-sm mb-4">Χωρίς ρίσκο. Χωρίς δεσμεύσεις.</p>
                        <h2 className="text-4xl font-bold mb-4">Τι περιμένεις ακόμα;</h2>
                        <p className="text-lg text-white/80 font-light mb-4 max-w-2xl mx-auto">
                            Κάθε μέρα που δεν έχεις online παρουσία, <strong className="text-white">χάνεις πωλήσεις που πάνε στον ανταγωνισμό.</strong>
                        </p>
                        <p className="text-white/60 text-sm mb-10 max-w-xl mx-auto">
                            Συμπλήρωσε την αίτηση σε 2 λεπτά. Θα επικοινωνήσουμε μαζί σου εντός 24 ωρών για δωρεάν συμβουλευτική, <em>χωρίς καμία δέσμευση.</em>
                        </p>
                        <Link href="/eshop-offer?plan=pay-as-you-grow" className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-[#4ade80] hover:bg-[#22c55e] text-black font-extrabold rounded-lg transition-all duration-300 text-lg shadow-lg">
                            Κάνε Αίτηση Δωρεάν <ArrowRight className="w-5 h-5" />
                        </Link>
                        <p className="text-white/30 text-xs mt-6">Δεν χρειάζεται πιστωτική κάρτα. Δεν υπάρχει δέσμευση από την αίτηση.</p>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
