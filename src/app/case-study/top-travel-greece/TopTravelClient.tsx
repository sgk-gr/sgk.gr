"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, Users, MapPin, Clock, Compass, Star, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const techStack = [
    "React", "Next.js", "TailwindCSS", "Framer Motion", "Stripe API",
    "PostgreSQL", "Google Maps Platform", "GraphQL", "Resend Mail API"
];

const featuredTours = [
    {
        title: "Cretan Brewery Tour with Beer Tasting and Meal",
        type: "shared",
        region: "Chania",
        duration: "5 hours",
        rating: 5.0,
        price: "105",
        hot: true
    },
    {
        title: "Preveli Palm Beach & Kourtaliotiko Gorge Tour",
        type: "shared",
        region: "Rethymno",
        duration: "8 hours",
        rating: 5.0,
        price: "40",
        hot: true
    },
    {
        title: "Private Tour to Elafonissi Beach from Chania",
        type: "private",
        region: "Chania",
        duration: "8 hours",
        rating: 5.0,
        price: "130",
        hot: true
    },
    {
        title: "Balos Lagoon & Gramvousa Island Shared Tour",
        type: "shared",
        region: "Chania",
        duration: "8 hours",
        rating: 5.0,
        price: "30",
        hot: true
    },
    {
        title: "Knossos Palace & Heraklion City Tour from Chania",
        type: "shared",
        region: "Heraklion",
        duration: "9 hours",
        rating: 5.0,
        price: "45",
        hot: true
    },
    {
        title: "Wine Tasting & Winery Visit – Semi-Private Experience",
        type: "private",
        region: "Chania",
        duration: "5 hours",
        rating: 5.0,
        price: "60",
        hot: true
    },
    {
        title: "Samaria Gorge Hiking Tour - Group Tour",
        type: "shared",
        region: "Chania",
        duration: "12 hours",
        rating: 5.0,
        price: "35",
        hot: true
    },
    {
        title: "Falasarna Beach & Sunset Experience",
        type: "private",
        region: "Chania",
        duration: "6 hours",
        rating: 5.0,
        price: "90",
        hot: true
    }
];

const carFleet = [
    { name: "PEUGEOT 108", type: "Manual", seats: 4, bags: 2, ac: true },
    { name: "FIAT PANDA", type: "Manual", seats: 4, bags: 2, ac: true },
    { name: "PEUGEOT 208", type: "Manual", seats: 5, bags: 2, ac: true },
    { name: "SUZUKI SWIFT", type: "Manual", seats: 5, bags: 2, ac: true },
    { name: "TOYOTA AURIS", type: "Manual", seats: 5, bags: 2, ac: true },
    { name: "PEUGEOT 301", type: "Manual", seats: 5, bags: 3, ac: true }
];

const quizQuestions = [
    {
        id: 1,
        question: "Ποια είναι η ιδανική σας μέρα στην Κρήτη;",
        options: [
            { text: "Χαλάρωση σε παραλία με ροζ άμμο (Ελαφονήσι/Μπάλος)", val: "beach" },
            { text: "Πεζοπορία σε καταπράσινα φαράγγια (Σαμαριά/Κουρταλιώτικο)", val: "hike" },
            { text: "Γευσιγνωσία κρασιού & τοπικής μπίρας σε παραδοσιακά χωριά", val: "wine" },
            { text: "Επίσκεψη σε αρχαιολογικούς χώρους και ιστορικά μνημεία", val: "history" }
        ]
    },
    {
        id: 2,
        question: "Με ποιον ταξιδεύετε;",
        options: [
            { text: "Ως ζευγάρι / ρομαντική απόδραση", val: "couple" },
            { text: "Με την οικογένεια / παιδιά", val: "family" },
            { text: "Μόνος / περιπετειώδης τύπος", val: "solo" },
            { text: "Με παρέα / μικρό γκρουπ φίλων", val: "friends" }
        ]
    },
    {
        id: 3,
        question: "Πώς προτιμάτε να μετακινείστε;",
        options: [
            { text: "Ιδιωτική εκδρομή (Private Tour) με δικό μας οδηγό", val: "private" },
            { text: "Οικονομική ομαδική εκδρομή (Shared Tour) με λεωφορείο", val: "shared" },
            { text: "Ελευθερία κινήσεων με δικό μας ενοικιαζόμενο αυτοκίνητο", val: "car" }
        ]
    }
];

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
};

export default function TopTravelClient() {
    const [activeTab, setActiveTab] = useState<"tours" | "cars">("tours");
    const [tourTypeFilter, setTourTypeFilter] = useState<"all" | "private" | "shared">("all");

    // Quiz State
    const [quizStarted, setQuizStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [quizResult, setQuizResult] = useState<string | null>(null);

    const handleQuizAnswer = (val: string) => {
        const newAnswers = { ...answers, [currentQuestion]: val };
        setAnswers(newAnswers);

        if (currentQuestion < quizQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            // Calculate recommendation
            let recommendation = "";
            const activity = newAnswers[0];
            const transport = newAnswers[2];

            if (transport === "car") {
                recommendation = "Σας προτείνουμε να νοικιάσετε ένα Peugeot 208 ή Suzuki Swift για να εξερευνήσετε την Κρήτη με την άνεσή σας! Συμπεριλαμβάνεται πλήρης ασφάλεια 100% και 24/7 υποστήριξη.";
            } else if (activity === "beach") {
                recommendation = transport === "private" 
                    ? "Private Tour to Elafonissi Beach from Chania"
                    : "Balos Lagoon & Gramvousa Island Shared Tour (Bus & Ferry)";
            } else if (activity === "hike") {
                recommendation = "Samaria Gorge Hiking Tour - Group Tour (12 ώρες αυθεντικής εμπειρίας)";
            } else if (activity === "wine") {
                recommendation = "Wine Tasting & Winery Visit – Semi-Private Experience με ξενάγηση σε τοπικούς αμπελώνες";
            } else {
                recommendation = "Knossos Palace & Heraklion City Tour from Chania (Group Tour)";
            }

            setQuizResult(recommendation);
        }
    };

    const resetQuiz = () => {
        setAnswers({});
        setCurrentQuestion(0);
        setQuizResult(null);
        setQuizStarted(false);
    };

    const filteredTours = featuredTours.filter(tour => {
        if (tourTypeFilter === "all") return true;
        return tour.type === tourTypeFilter;
    });

    return (
        <div className="min-h-screen bg-background font-sans text-foreground">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/85 backdrop-blur-lg border-b border-border transition-all">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <Link
                        href="/#portfolio"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Πίσω στο Portfolio
                    </Link>
                    <span className="text-xs font-heading font-semibold text-primary/80 uppercase tracking-widest bg-primary/5 border border-primary/10 px-3 py-1 rounded-full">
                        Travel & Booking Agency Case Study
                    </span>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-32 pb-20 overflow-hidden relative">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
                <div className="container mx-auto px-6 relative z-10">
                    <motion.div {...fadeUp} className="max-w-4xl">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold leading-[1.08] mb-6 tracking-tight">
                            Top Travel Greece <br />
                            <span className="text-primary font-extrabold">Personal Travel Agency</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mb-8">
                            Σχεδιασμός και ανάπτυξη μιας ολοκληρωμένης, ταχύτατης πλατφόρμας κρατήσεων για το κορυφαίο ταξιδιωτικό γραφείο **Top Travel Greece** στο Δαράτσο Χανίων. Υλοποιήσαμε custom booking engine για private/shared εκδρομές, σύστημα αιτήσεων ενοικίασης αυτοκινήτων και διαδραστικό vibe quiz για την ιδανική επιλογή εκδρομής.
                        </p>
                        <div className="flex flex-wrap gap-2.5 mb-10">
                            {techStack.map(tag => (
                                <span
                                    key={tag}
                                    className="px-3.5 py-1.5 text-xs font-semibold bg-secondary/80 text-secondary-foreground border border-border rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="#quiz"
                                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground font-heading font-semibold rounded-md hover:opacity-95 transition-all glow-border"
                            >
                                Δοκιμάστε το Vibe Quiz
                                <ArrowRight className="w-4 h-4" />
                            </a>
                            <a
                                href="#catalog"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-card hover:bg-secondary/40 text-foreground font-heading font-medium rounded-md border border-border transition-colors"
                            >
                                Δείτε τις Εκδρομές & Στόλο
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Platform Scope Section */}
            <section className="py-16 bg-secondary/20 border-y border-border">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto items-stretch">
                        <motion.div {...fadeUp} className="p-8 rounded-2xl bg-card border border-border flex flex-col justify-between">
                            <div>
                                <p className="text-primary font-heading text-xs tracking-[0.3em] uppercase mb-3 font-semibold">
                                    Το Ζητούμενο
                                </p>
                                <h3 className="text-2xl font-heading font-bold mb-4 text-foreground">
                                    Προκλήσεις & Ανάγκες
                                </h3>
                                <p className="text-muted-foreground leading-relaxed text-sm">
                                    Το γραφείο χρειαζόταν μια premium online παρουσία που να ενοποιεί τις κρατήσεις ιδιωτικών (private) και ομαδικών (shared) εκδρομών σε όλη την Κρήτη (Χανιά, Ρέθυμνο, Ηράκλειο), προσφέροντας ταυτόχρονα σύστημα ενοικίασης αυτοκινήτων (car rental) και άμεση B2B/B2C επικοινωνία, χωρίς να χάνεται η προσωπική εξυπηρέτηση.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.15 }} className="p-8 rounded-2xl bg-card border border-primary/20 flex flex-col justify-between">
                            <div>
                                <p className="text-primary font-heading text-xs tracking-[0.3em] uppercase mb-3 font-semibold">
                                    Η Λύση μας
                                </p>
                                <h3 className="text-2xl font-heading font-bold mb-4 text-foreground">
                                    Τι Υλοποιήσαμε
                                </h3>
                                <p className="text-muted-foreground leading-relaxed text-sm">
                                    Σχεδιάσαμε ένα ταχύτατο custom Headless Booking σύστημα. Ενσωματώσαμε φίλτρα αναζήτησης ανά περιοχή/τύπο εκδρομής, φόρμες άμεσης ζήτησης (Request) για ενοικίαση αυτοκινήτων και έναν έξυπνο διαδραστικό αλγόριθμο (vibe quiz) που βοηθάει τους τουρίστες να ανακαλύψουν την ιδανική εμπειρία στην Κρήτη βάσει των προτιμήσεών τους.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* INTERACTIVE SHOWN COMPONENT: Vibe Quiz */}
            <section id="quiz" className="py-20 bg-secondary/35">
                <div className="container mx-auto px-6">
                    <motion.div {...fadeUp} className="text-center mb-12 max-w-2xl mx-auto">
                        <p className="text-primary font-heading text-xs tracking-[0.3em] uppercase mb-3 font-semibold">
                            Interactive Quiz
                        </p>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                            Cretan Adventure Vibe Quiz
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Απαντήστε σε 3 γρήγορες ερωτήσεις και βρείτε την ιδανική εκδρομή ή υπηρεσία για τις διακοπές σας στα Χανιά και την Κρήτη!
                        </p>
                    </motion.div>

                    <div className="max-w-xl mx-auto bg-card border border-border p-8 rounded-2xl shadow-xl min-h-[300px] flex flex-col justify-between">
                        <AnimatePresence mode="wait">
                            {!quizStarted ? (
                                <motion.div
                                    key="start"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center space-y-6"
                                >
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
                                        <Compass className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-bold">Έτοιμοι να ξεκινήσετε;</h3>
                                    <p className="text-xs text-muted-foreground leading-normal">
                                        Ο αλγόριθμός μας θα αναλύσει τις προτιμήσεις σας και θα σας προτείνει την καταλληλότερη εκδρομή ή όχημα.
                                    </p>
                                    <button
                                        onClick={() => setQuizStarted(true)}
                                        className="w-full py-3 bg-primary text-primary-foreground font-heading font-semibold text-xs rounded-md hover:opacity-90 transition-opacity"
                                    >
                                        Ξεκινήστε το Quiz
                                    </button>
                                </motion.div>
                            ) : quizResult ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-6 text-center"
                                >
                                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-400">
                                        <CheckCircle className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-bold">Η Πρότασή μας:</h3>
                                    <div className="p-4 rounded-xl bg-secondary/50 border border-border font-heading font-semibold text-sm text-foreground">
                                        {quizResult}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Μπορείτε να επικοινωνήσετε άμεσα με το Top Travel Greece για να οργανώσετε τις λεπτομέρειες!
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={resetQuiz}
                                            className="flex-1 py-2.5 bg-secondary text-secondary-foreground font-heading text-xs rounded-md hover:bg-secondary/80 transition-colors"
                                        >
                                            Επανάληψη
                                        </button>
                                        <a
                                            href="#contact-info"
                                            className="flex-1 inline-flex items-center justify-center py-2.5 bg-primary text-primary-foreground font-heading text-xs rounded-md hover:opacity-90 transition-opacity"
                                        >
                                            Κάντε Κράτηση
                                        </a>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key={currentQuestion}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="flex justify-between items-center text-[10px] text-muted-foreground font-mono">
                                        <span>Ερώτηση {currentQuestion + 1} από {quizQuestions.length}</span>
                                        <span>{Math.round(((currentQuestion) / quizQuestions.length) * 100)}% Complete</span>
                                    </div>
                                    <h3 className="text-base font-bold text-foreground leading-normal">
                                        {quizQuestions[currentQuestion].question}
                                    </h3>
                                    <div className="space-y-2">
                                        {quizQuestions[currentQuestion].options.map((opt, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleQuizAnswer(opt.val)}
                                                className="w-full text-left p-3.5 rounded-lg bg-secondary/50 border border-border hover:border-primary/40 hover:bg-secondary/90 transition-all text-xs font-medium"
                                            >
                                                {opt.text}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            {/* Excursions & Car Fleet Catalog */}
            <section id="catalog" className="py-24">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-heading font-bold mb-4">Εκδρομές & Στόλος Αυτοκινήτων</h2>
                        <div className="inline-flex rounded-lg border border-border p-1 bg-secondary/40">
                            <button
                                onClick={() => setActiveTab("tours")}
                                className={`px-5 py-2 text-xs font-semibold rounded-md transition-all ${activeTab === "tours" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                Δημοφιλείς Εκδρομές (Tours)
                            </button>
                            <button
                                onClick={() => setActiveTab("cars")}
                                className={`px-5 py-2 text-xs font-semibold rounded-md transition-all ${activeTab === "cars" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                Ενοικίαση Αυτοκινήτων (Fleet)
                            </button>
                        </div>
                    </div>

                    {activeTab === "tours" ? (
                        <div className="space-y-8">
                            {/* Tour Filters */}
                            <div className="flex justify-center gap-2">
                                {["all", "private", "shared"].map(filter => (
                                    <button
                                        key={filter}
                                        onClick={() => setTourTypeFilter(filter as any)}
                                        className={`px-3 py-1.5 text-xs rounded-full border transition-all ${tourTypeFilter === filter ? "bg-primary/10 border-primary text-primary font-semibold" : "border-border text-muted-foreground hover:text-foreground"}`}
                                    >
                                        {filter === "all" ? "Όλες" : filter === "private" ? "Private Tours" : "Shared Adventures"}
                                    </button>
                                ))}
                            </div>

                            {/* Tour Grid */}
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-6xl mx-auto">
                                {filteredTours.map((tour, idx) => (
                                    <div key={idx} className="bg-card border border-border rounded-xl p-5 hover:border-primary/20 transition-all flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="px-2 py-0.5 text-[8px] bg-secondary text-secondary-foreground border border-border rounded font-bold uppercase">
                                                    {tour.type}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                    <MapPin className="w-3 h-3 text-primary" /> {tour.region}
                                                </span>
                                            </div>
                                            <h4 className="text-xs font-bold text-foreground mb-3 leading-snug h-10 overflow-hidden line-clamp-2">
                                                {tour.title}
                                            </h4>
                                        </div>
                                        <div className="pt-3 border-t border-border/40 mt-3 flex justify-between items-center text-[10px]">
                                            <span className="text-muted-foreground flex items-center gap-1">
                                                <Clock className="w-3 h-3 text-primary" /> {tour.duration || "Custom"}
                                            </span>
                                            <span className="font-bold text-primary">
                                                Από €{tour.price}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* Car Fleet Grid */
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            {carFleet.map((car, idx) => (
                                <div key={idx} className="bg-card border border-border rounded-xl p-5 hover:border-primary/20 transition-all flex justify-between items-center">
                                    <div>
                                        <h4 className="font-heading font-bold text-sm text-foreground mb-1">{car.name}</h4>
                                        <p className="text-[10px] text-muted-foreground flex items-center gap-2">
                                            <span>{car.type}</span> • <span>{car.seats} Θέσεις</span> • <span>{car.ac ? "A/C" : ""}</span>
                                        </p>
                                    </div>
                                    <button className="px-3 py-1.5 bg-secondary hover:bg-secondary/80 border border-border text-[10px] font-semibold rounded-md transition-colors">
                                        Request
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Detailed Contact Info */}
            <section id="contact-info" className="py-20 bg-secondary/20 border-t border-border">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h3 className="text-2xl font-heading font-bold mb-4">Top Travel Greece</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                                Αξιόπιστος συνεργάτης για αξέχαστες εκδρομές και VIP υπηρεσίες μετακίνησης στην Κρήτη από το 2010. Με έδρα το Δαράτσο Χανίων, προσφέρει άριστα προσαρμοσμένα πακέτα.
                            </p>
                            <div className="space-y-3.5 text-xs text-muted-foreground">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                                    <span>24/7 VIP Υποστήριξη & Εξυπηρέτηση</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                                    <span>Πιστοποιημένοι Τοπικοί Συνοδοί & Οδηγοί</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                                    <span>Πλήρως Ασφαλισμένος & Σύγχρονος Στόλος</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 rounded-2xl bg-card border border-border space-y-4 text-center">
                            <h4 className="text-sm font-bold text-foreground">Θέλετε ένα αντίστοιχο σύστημα;</h4>
                            <p className="text-xs text-muted-foreground leading-normal">
                                Αναβαθμίστε την ταξιδιωτική ή τουριστική σας επιχείρηση με μια custom πλατφόρμα εκδρομών και Vibe Quiz.
                            </p>
                            <Link
                                href="/estimate"
                                className="w-full inline-flex items-center justify-center py-3 bg-primary text-primary-foreground font-heading font-bold text-xs rounded-md hover:opacity-90 transition-opacity"
                            >
                                Ζητήστε Προσφορά
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <div className="h-16 bg-background" />
        </div>
    );
}
