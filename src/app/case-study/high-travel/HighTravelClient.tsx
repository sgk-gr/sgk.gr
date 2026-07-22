"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Plane, Bus, Ship, MapPin, Search, Sliders, CheckCircle, Compass, Sparkles, ShieldCheck, Heart, LayoutDashboard, Image as ImageIcon, Tag, Globe2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const techStack = [
    "Next.js 15", "React 19", "Custom React Admin", "TailwindCSS", "Framer Motion",
    "PostgreSQL", "Supabase API", "Resend Mail API", "Conversational SEO"
];

const travelCategories = [
    { icon: Bus, title: "Ταξίδι με Λεωφορείο", count: "40+ Προορισμοί" },
    { icon: Plane, title: "Ταξίδι με Αεροπλάνο", count: "100+ Προορισμοί" },
    { icon: Ship, title: "Ταξίδι με Πλοίο", count: "Κρουαζιέρες & Νησιά" },
    { icon: MapPin, title: "Ελλάδα", count: "Εγχώριες Αποδράσεις" },
    { icon: Globe2, title: "Εξωτερικό", count: "Ευρώπη & Ασία" },
    { icon: Sparkles, title: "Προσκύνημα", count: "Θρησκευτικός Τουρισμός" },
];

const exclusiveOffers = [
    {
        title: "Ρομαντική Απόδραση στις Μαλδίβες – Sunset Dinner στην Παραλία",
        badge: "VALENTINE'S DAY -15%",
        discount: "Έως 30% έκπτωση",
        image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1200",
        type: "Αεροπορικώς"
    },
    {
        title: "Κρουαζιέρα στα Ελληνικά Νησιά – Ταξίδι στα Πιο Γαλαζοπράσινα Νερά του Αιγαίου",
        badge: "Καλοκαιρινές Εκπτώσεις",
        discount: "Αποκλειστικό Πακέτο",
        image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200",
        type: "Με Πλοίο"
    },
    {
        title: "Solo στο Παρίσι – Μια Φθινοπωρινή Απόδραση μόνο για Σένα",
        badge: "-5% για κρατήσεις έως 25/7",
        discount: "Φθινοπωρινή Προσφορά",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200",
        type: "Αεροπορικώς"
    }
];

const adminFeatures = [
    {
        icon: LayoutDashboard,
        title: "Πλήρες Διαχειριστικό Πάνελ (React Admin)",
        description: "Custom admin dashboard για άμεση διαχείριση πακέτων, προορισμών, τιμών, διαθεσιμότητας και κρατήσεων χωρίς τεχνικές γνώσεις."
    },
    {
        icon: ImageIcon,
        title: "Διαχείριση Posters & Διαφημιστικού Υλικού",
        description: "Ειδικό module για ανέβασμα και αυτόματη προσαρμογή posters, banners και προσφορών για social media & ιστοσελίδα."
    },
    {
        icon: Tag,
        title: "Μηχανή Αποκλειστικών Προσφορών",
        description: "Δυναμική δημιουργία εκπτωτικών πακέτων (π.χ. Valentine's Day -15%, Early Bird -5%) με αυτόματη λήξη ισχύος."
    },
    {
        icon: ShieldCheck,
        title: "Πλήρης Νομική Συμμόρφωση (ΓΕΜΗ / ΜΗΤΕ)",
        description: "Ενσωμάτωση υποχρεωτικών στοιχείων ΓΕΜΗ & ΜΗΤΕ (Άρθρο 50 Ν.4072/2012) με πλήρη διαφάνεια για την High Travel ΙΚΕ."
    }
];

export default function HighTravelClient() {
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [maxPrice, setMaxPrice] = useState(2500);
    const [selectedCategory, setSelectedCategory] = useState("Όλα");

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#3b5bdb] selection:text-white">
            
            {/* Navigation Bar */}
            <nav className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/portfolio" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors gap-2">
                        <ArrowLeft size={16} /> Πίσω στο Portfolio
                    </Link>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-mono bg-[#3b5bdb]/20 text-[#3b5bdb] px-3 py-1 rounded-full border border-[#3b5bdb]/30">
                            Live Project
                        </span>
                        <a href="https://www.hightravel.gr/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition-colors">
                            hightravel.gr <ArrowUpRight size={14} />
                        </a>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-16 pb-20 px-6 overflow-hidden">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#3b5bdb]/15 rounded-full blur-[140px] pointer-events-none" />

                <div className="max-w-7xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#4ade80] mb-6">
                            <Sparkles size={14} /> Case Study: Τουριστικός Τομέας & Ταξιδιωτική Πλατφόρμα
                        </div>

                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                            High Travel <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3b5bdb] via-[#4ade80] to-[#facc15]">IKΕ</span>
                        </h1>

                        <p className="text-xl text-gray-300 max-w-3xl leading-relaxed mb-8">
                            Σχεδιασμός και υλοποίηση υπερσύγχρονης ταξιδιωτικής πλατφόρμας με <strong>Next.js 15 Frontend</strong> για αστραπιαίες ταχύτητες και <strong>Custom React Διαχειριστικό Πάνελ</strong> για πλήρη αυτονομία στη διαχείριση πακέτων, προσφορών, posters και κρατήσεων.
                        </p>

                        {/* Tech Tags */}
                        <div className="flex flex-wrap gap-2 mb-12">
                            {techStack.map((tech) => (
                                <span key={tech} className="text-xs font-mono bg-white/5 border border-white/10 text-gray-300 px-3 py-1.5 rounded-lg">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
                        <div>
                            <p className="text-xs font-mono text-gray-400 mb-1">Frontend</p>
                            <p className="text-lg font-bold text-white">Next.js 15 (React 19)</p>
                        </div>
                        <div>
                            <p className="text-xs font-mono text-gray-400 mb-1">Backend Admin</p>
                            <p className="text-lg font-bold text-[#4ade80]">Custom React Panel</p>
                        </div>
                        <div>
                            <p className="text-xs font-mono text-gray-400 mb-1">Speed Score</p>
                            <p className="text-lg font-bold text-[#facc15]">99/100 Core Web Vitals</p>
                        </div>
                        <div>
                            <p className="text-xs font-mono text-gray-400 mb-1">Έδρα</p>
                            <p className="text-lg font-bold text-white">Αγρίνιο, Ελλάδα</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Interactive Search Engine Preview */}
            <section className="py-16 px-6 bg-white/[0.02] border-y border-white/10">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-10 text-center md:text-left">
                        <span className="text-xs font-mono text-[#3b5bdb] uppercase tracking-wider">Interactive Live Preview</span>
                        <h2 className="text-2xl md:text-4xl font-bold mt-2">Η Μηχανή Αναζήτησης Προορισμών του HighTravel.gr</h2>
                        <p className="text-gray-400 text-sm mt-2 max-w-2xl">
                            Δοκιμάστε τη διαδραστική εμπειρία φιλτραρίσματος που κατασκευάσαμε για τους επισκέπτες της High Travel.
                        </p>
                    </div>

                    <div className="bg-[#121212] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                            {/* Adults */}
                            <div>
                                <label className="block text-xs font-mono text-gray-400 mb-2">Ενήλικες</label>
                                <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-3">
                                    <button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-xl text-white font-bold">-</button>
                                    <span className="font-bold text-lg">{adults}</span>
                                    <button onClick={() => setAdults(adults + 1)} className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-xl text-white font-bold">+</button>
                                </div>
                            </div>

                            {/* Children */}
                            <div>
                                <label className="block text-xs font-mono text-gray-400 mb-2">Παιδιά</label>
                                <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-3">
                                    <button onClick={() => setChildren(Math.max(0, children - 1))} className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-xl text-white font-bold">-</button>
                                    <span className="font-bold text-lg">{children}</span>
                                    <button onClick={() => setChildren(children + 1)} className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-xl text-white font-bold">+</button>
                                </div>
                            </div>

                            {/* Price Slider */}
                            <div>
                                <div className="flex justify-between text-xs font-mono text-gray-400 mb-2">
                                    <span>Τιμή</span>
                                    <span className="text-[#4ade80] font-bold">Έως {maxPrice.toLocaleString('el-GR')}€</span>
                                </div>
                                <input
                                    type="range"
                                    min="300"
                                    max="5000"
                                    step="100"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#3b5bdb]"
                                />
                            </div>

                            {/* Search Button */}
                            <div>
                                <a
                                    href="https://www.hightravel.gr/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#3b5bdb] to-[#4ade80] text-black font-bold py-3.5 px-6 rounded-2xl hover:opacity-90 transition-opacity"
                                >
                                    <Search size={18} /> Αναζήτηση Ταξιδιού
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Travel Categories */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Κατηγορίες Ταξιδίων & Μεταφορών</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Πλήρης κάλυψη όλων των τρόπων μεταφοράς και τύπων τουρισμού με έξυπνες κατηγοριοποιήσεις.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {travelCategories.map((cat, i) => {
                            const IconComponent = cat.icon;
                            return (
                                <motion.div
                                    key={cat.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.05 }}
                                    className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#3b5bdb]/50 hover:bg-white/10 transition-all text-center group cursor-pointer"
                                >
                                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[#3b5bdb]/10 border border-[#3b5bdb]/20 flex items-center justify-center text-[#3b5bdb] group-hover:scale-110 transition-transform">
                                        <IconComponent size={22} />
                                    </div>
                                    <h3 className="text-sm font-bold text-white mb-1 leading-snug">{cat.title}</h3>
                                    <p className="text-[11px] text-gray-400">{cat.count}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Exclusive Offers Showcase */}
            <section className="py-20 px-6 bg-white/[0.01] border-t border-white/10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                        <div>
                            <span className="text-xs font-mono text-[#facc15]">— ΑΠΟΚΛΕΙΣΤΙΚΕΣ ΠΡΟΣΦΟΡΕΣ</span>
                            <h2 className="text-3xl font-bold mt-2">Προσφορές Που Δεν Χάνονται</h2>
                        </div>
                        <a href="https://www.hightravel.gr/" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#3b5bdb] hover:underline inline-flex items-center gap-1">
                            Δείτε όλες τις προσφορές στο HighTravel.gr <ArrowUpRight size={16} />
                        </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {exclusiveOffers.map((offer, i) => (
                            <motion.div
                                key={offer.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group rounded-3xl bg-[#141414] border border-white/10 overflow-hidden hover:border-white/20 transition-all flex flex-col"
                            >
                                <div className="h-48 relative overflow-hidden">
                                    <img src={offer.image} alt={offer.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                                        {offer.badge}
                                    </span>
                                </div>
                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        <span className="text-xs font-mono text-gray-400 block mb-2">{offer.type}</span>
                                        <h3 className="font-bold text-lg leading-snug mb-4 text-white group-hover:text-[#4ade80] transition-colors">{offer.title}</h3>
                                    </div>
                                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                                        <span className="text-xs text-[#facc15] font-bold">{offer.discount}</span>
                                        <span className="text-xs text-white/80 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                                            Κράτηση <ArrowRight size={12} />
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Custom React Admin Dashboard Showcase */}
            <section className="py-20 px-6 border-t border-white/10 bg-gradient-to-b from-transparent to-[#0e121e]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-xs font-mono text-[#4ade80] uppercase tracking-wider">Custom Admin System</span>
                        <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Το Custom React Διαχειριστικό της High Travel</h2>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Πέρα από το ταχύτατο δημόσιο site, κατασκευάσαμε ένα <strong>εξειδικευμένο διαχειριστικό πάνελ σε React</strong> που επιτρέπει στην ομάδα της High Travel να διαχειρίζεται τα πάντα αυτόνομα.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {adminFeatures.map((feat, i) => {
                            const IconComponent = feat.icon;
                            return (
                                <motion.div
                                    key={feat.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex gap-5 items-start"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-[#3b5bdb]/20 border border-[#3b5bdb]/40 text-[#3b5bdb] flex items-center justify-center shrink-0 mt-1">
                                        <IconComponent size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">{feat.title}</h3>
                                        <p className="text-sm text-gray-400 leading-relaxed">{feat.description}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Company Metadata & GEMI Compliance */}
            <section className="py-16 px-6 bg-[#070707] border-t border-white/10">
                <div className="max-w-7xl mx-auto">
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4ade80]/10 text-[#4ade80] text-xs font-mono mb-3">
                                <CheckCircle size={14} /> Πλήρης Συμμόρφωση ΓΕΜΗ / Ν.4072/2012
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">High Travel ΙΔΙΩΤΙΚΗ ΚΕΦΑΛΑΙΟΥΧΙΚΗ ΕΤΑΙΡΕΙΑ (Ι.Κ.Ε.)</h3>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                📍 Δημητρίου Βότση 8, Αγρίνιο, ΤΚ: 30131 | 📞 2641307453 - 6940273079 | ✉️ info@hightravel.gr<br />
                                🏛️ ΜΗ.Τ.Ε.: 0413E60000029500 | 🏢 ΓΕΜΗ: 194563312000
                            </p>
                        </div>
                        <a
                            href="https://www.hightravel.gr/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 bg-white text-black font-bold px-6 py-3.5 rounded-2xl hover:bg-gray-200 transition-colors text-sm inline-flex items-center gap-2"
                        >
                            Επίσκεψη στο HighTravel.gr <ArrowUpRight size={16} />
                        </a>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 text-center border-t border-white/10 bg-gradient-to-t from-[#3b5bdb]/20 to-transparent">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Θέλετε παρόμοια ταξιδιωτική πλατφόρμα;</h2>
                    <p className="text-gray-300 mb-8 leading-relaxed">
                        Αναλαμβάνουμε την κατασκευή της δικής σας ιστοσελίδας ή eShop με Next.js, custom διαχειριστικό πάνελ και 100% συμμόρφωση με τη νομοθεσία.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/estimate" className="bg-[#4ade80] text-black font-bold px-8 py-4 rounded-2xl hover:bg-[#3ec473] transition-colors">
                            Υπολογισμός Κόστους
                        </Link>
                        <Link href="/kataskevi-istoselidon" className="bg-white/10 text-white font-bold px-8 py-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-colors">
                            Υπηρεσίες Web Development
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}
