"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
    ArrowLeft, Sparkles, Smartphone, CreditCard, Bell, Navigation, Map, Users, 
    Play, Pause, RotateCcw, CheckCircle2, ChevronRight, Landmark, Compass, 
    Award, ShieldCheck, Milestone, DollarSign, Clock, HelpCircle, ArrowRight
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const techStack = [
    { name: "Flutter", category: "Frontend", desc: "Native iOS & Android compilation" },
    { name: "Firebase", category: "Backend", desc: "Authentication & cloud storage" },
    { name: "Realtime Database", category: "Live Data", desc: "Millisecond driver tracking" },
    { name: "Stripe SDK", category: "Payments", desc: "Secure in-app credit card processing" },
    { name: "Push Notifications", category: "Engage", desc: "FCM triggers & passenger geofences" },
    { name: "Google Maps API", category: "Maps", desc: "Custom style tiles & route calculation" },
    { name: "Android Native", category: "OS Support", desc: "Background location services" },
    { name: "Live Telemetry", category: "Data", desc: "Driver speed & orientation monitoring" }
];

const appCapabilities = [
    {
        icon: Navigation,
        title: "Real-time Tracking & Map",
        description: "Συνεχής παρακολούθηση της τοποθεσίας του οδηγού σε χάρτη Google Maps με live ενημέρωση της ώρας άφιξης (ETA) και αυτόματη επαναδρομολόγηση.",
        features: ["Telemetry sync < 100ms", "Custom map styling", "Traffic-aware ETA"]
    },
    {
        icon: CreditCard,
        title: "One-Click Stripe Payments",
        description: "Πλήρης εναρμόνιση με το Stripe API για άμεση εξόφληση, pre-authorization ποσών, υποστήριξη Apple Pay/Google Pay και αυτόματη έκδοση αποδείξεων.",
        features: ["SCA Compliant", "Apple & Google Pay", "Instant payouts support"]
    },
    {
        icon: Bell,
        title: "Smart Geofence Notifications",
        description: "Αυτόματη αποστολή push notifications μέσω Firebase Cloud Messaging όταν ο οδηγός εισέρχεται σε ακτίνα 500μ από το σημείο παραλαβής του πελάτη.",
        features: ["Low battery footprint", "Background notifications", "Dynamic arrival warning"]
    },
    {
        icon: Smartphone,
        title: "Driver Administration Console",
        description: "Ξεχωριστό interface για τους οδηγούς με δυνατότητα αποδοχής/απόρριψης διαδρομών, πλοήγηση στροφή-προς-στροφή και αναλυτικά ημερήσια στατιστικά κερδών.",
        features: ["Offline sync fallback", "Turn-by-turn routing UI", "Driver earnings summary"]
    }
];

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
};

// Simulated route points for the live demo (Athens Airport to Acropolis)
const simulationSteps = [
    { label: "Επιβίβαση & Έναρξη", info: "Ο οδηγός Γιώργος ξεκίνησε τη διαδρομή από το Αεροδρόμιο Αθηνών (Ελ. Βενιζέλος).", progress: 0, x: 20, y: 80, time: "09:00" },
    { label: "Αττική Οδός (Live)", info: "Κίνηση με 110 km/h. Live GPS στίγμα συγχρονίζεται μέσω Firebase Realtime DB.", progress: 25, x: 40, y: 70, time: "09:12" },
    { label: "Διέλευση Καλλιμάρμαρο", info: "Στάση 2 λεπτών για τις πρώτες φωτογραφίες. Live ETA ενημερώνεται στον χρήστη.", progress: 50, x: 60, y: 55, time: "09:35" },
    { label: "Πύλη Αδριανού", info: "Είσοδος στο ιστορικό κέντρο. Αυτόματο push notification: «Πλησιάζετε στον προορισμό σας».", progress: 75, x: 75, y: 45, time: "09:48" },
    { label: "Άφιξη στην Ακρόπολη!", info: "Η περιήγηση ολοκληρώθηκε επιτυχώς. Stripe payment pre-authorization εκτελείται αυτόματα.", progress: 100, x: 88, y: 25, time: "09:55" }
];

export default function LTGClient() {
    // Simulator states
    const [isSimulating, setIsSimulating] = useState(false);
    const [simIndex, setSimIndex] = useState(0);
    const [simProgress, setSimProgress] = useState(0);
    const [showReceipt, setShowReceipt] = useState(false);
    const simInterval = useRef<NodeJS.Timeout | null>(null);

    // Pricing Calculator states
    const [hasTracking, setHasTracking] = useState(true);
    const [hasStripe, setHasStripe] = useState(true);
    const [hasPush, setHasPush] = useState(true);
    const [hasConsole, setHasConsole] = useState(false);
    const [hasWebPortal, setHasWebPortal] = useState(false);
    const [developmentSpeed, setDevelopmentSpeed] = useState(8); // weeks

    // Calculate simulated budget
    const getEstimatedPrice = () => {
        let base = 3500;
        if (hasTracking) base += 1500;
        if (hasStripe) base += 1000;
        if (hasPush) base += 600;
        if (hasConsole) base += 1800;
        if (hasWebPortal) base += 1200;
        
        // Fast development penalty/premium
        if (developmentSpeed <= 4) base *= 1.25;
        else if (developmentSpeed <= 6) base *= 1.1;
        
        return Math.round(base);
    };

    // Live Simulator Controls
    const startSimulation = () => {
        setIsSimulating(true);
        setShowReceipt(false);
        setSimIndex(0);
        setSimProgress(0);
    };

    const pauseSimulation = () => {
        setIsSimulating(false);
    };

    const resetSimulation = () => {
        setIsSimulating(false);
        setSimIndex(0);
        setSimProgress(0);
        setShowReceipt(false);
        if (simInterval.current) clearInterval(simInterval.current);
    };

    useEffect(() => {
        if (isSimulating) {
            simInterval.current = setInterval(() => {
                setSimProgress(prev => {
                    if (prev >= 100) {
                        setIsSimulating(false);
                        setShowReceipt(true);
                        if (simInterval.current) clearInterval(simInterval.current);
                        return 100;
                    }
                    const nextProgress = prev + 1;
                    
                    // Update step based on progress
                    const newIndex = Math.min(
                        Math.floor(nextProgress / 20),
                        simulationSteps.length - 1
                    );
                    setSimIndex(newIndex);
                    
                    return nextProgress;
                });
            }, 100);
        } else {
            if (simInterval.current) clearInterval(simInterval.current);
        }

        return () => {
            if (simInterval.current) clearInterval(simInterval.current);
        };
    }, [isSimulating]);

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border transition-all">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <Link
                        href="/#portfolio"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Πίσω στο Portfolio
                    </Link>
                    <span className="text-xs font-heading font-semibold text-primary/80 uppercase tracking-widest bg-primary/5 border border-primary/10 px-3 py-1 rounded-full">
                        Live Case Study
                    </span>
                </div>
            </nav>

            {/* Premium Dual-Column Hero */}
            <section className="pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden relative">
                {/* Glowing background effects */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[160px] pointer-events-none" />
                <div className="absolute right-0 top-1/3 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-12 gap-12 items-center">
                        {/* Hero Text */}
                        <div className="lg:col-span-7">
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >

                                <p className="text-primary font-heading text-xs md:text-sm tracking-[0.3em] uppercase mb-3 font-semibold">
                                    Flutter & Firebase Ecosystem
                                </p>
                                <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold leading-[1.08] mb-6 tracking-tight">
                                    Live Tour Guide <br />
                                    <span className="text-gradient font-extrabold">(LTG)</span>
                                </h1>
                                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-8">
                                    Μια ολοκληρωμένη premium mobile εφαρμογή για <span className="text-foreground font-medium">VIP Taxi Tours</span> στην Αθήνα. Υλοποιήσαμε real-time tracking, Stripe checkout και έξυπνα push notifications σε ένα native-feel Flutter περιβάλλον.
                                </p>
                                
                                <div className="flex flex-wrap gap-2.5 mb-10">
                                    {["Flutter", "Firebase DB", "Stripe SDK", "Android Dev", "iOS Companion", "Google Maps API"].map(
                                        (tag) => (
                                            <span
                                                key={tag}
                                                className="px-3.5 py-1.5 text-xs font-semibold bg-secondary/80 text-secondary-foreground border border-border/60 rounded-full hover:border-primary/20 transition-all cursor-default"
                                            >
                                                {tag}
                                            </span>
                                        )
                                    )}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                    <a
                                        href="#simulator"
                                        className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground font-heading font-semibold rounded-md hover:opacity-95 transition-all glow-border"
                                    >
                                        Δοκιμάστε το Live Demo
                                        <ArrowRight className="w-4 h-4" />
                                    </a>
                                    <a
                                        href="#calculator"
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-card hover:bg-secondary/40 text-foreground font-heading font-medium rounded-md border border-border transition-colors"
                                    >
                                        Υπολογισμός Κόστους App
                                    </a>
                                </div>
                            </motion.div>
                        </div>

                        {/* Interactive App Mockup Frame */}
                        <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: 40 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.2 }}
                                className="relative w-[320px] sm:w-[350px] aspect-[9/18.5] bg-[#0c0c0e] rounded-[50px] p-3 border-4 border-[#2b2b32] shadow-[0_0_80px_rgba(34,197,94,0.12)] group overflow-hidden"
                            >
                                {/* Phone Notch */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-[#0c0c0e] rounded-b-2xl z-30 flex items-center justify-center">
                                    <div className="w-12 h-1 bg-[#1a1a22] rounded-full mb-1" />
                                </div>

                                {/* Phone Screen Content - Pure CSS Live Mockup */}
                                <div className="relative w-full h-full rounded-[40px] overflow-hidden border border-border/30 bg-[#09090b] text-white p-4 pt-10 flex flex-col justify-between z-20 select-none">
                                    {/* Phone Status Bar */}
                                    <div className="absolute top-2.5 left-8 right-8 flex justify-between items-center text-[9px] text-muted-foreground font-mono">
                                        <span>09:41</span>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-1.5 bg-muted-foreground/40 rounded-full" />
                                            <span className="w-3.5 h-2.5 border border-muted-foreground/40 rounded-sm relative flex items-center p-[1px]"><span className="w-full h-full bg-muted-foreground rounded-xs" /></span>
                                        </div>
                                    </div>

                                    {/* App Header */}
                                    <div className="flex justify-between items-center mt-1 mb-3">
                                        <div>
                                            <p className="text-[9px] text-primary uppercase font-bold tracking-wider">VIP Tour Active</p>
                                            <h3 className="text-xs font-heading font-bold">Athens VIP Sightseeing</h3>
                                        </div>
                                        <span className="px-2 py-0.5 text-[8px] bg-primary/10 text-primary border border-primary/20 rounded-full font-semibold">
                                            Live
                                        </span>
                                    </div>

                                    {/* Simulated Live Map */}
                                    <div className="relative flex-1 bg-[#121214] rounded-2xl border border-border/40 overflow-hidden flex flex-col justify-between p-3">
                                        {/* Dot Pattern Grid */}
                                        <div className="absolute inset-0 bg-[radial-gradient(#ffffff06_1.5px,transparent_1.5px)] [background-size:14px_14px] pointer-events-none" />

                                        {/* Animated Route Path */}
                                        <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 100 100" preserveAspectRatio="none">
                                            <path 
                                                d="M 20,80 C 40,75 50,55 80,30" 
                                                fill="none" 
                                                stroke="#27272a" 
                                                strokeWidth="2.5" 
                                                strokeLinecap="round" 
                                            />
                                            <path 
                                                d="M 20,80 C 40,75 50,55 80,30" 
                                                fill="none" 
                                                stroke="hsl(var(--primary))" 
                                                strokeWidth="2.5" 
                                                strokeLinecap="round" 
                                                strokeDasharray="8 6"
                                                className="animate-pulse" 
                                            />
                                            {/* Start and End nodes */}
                                            <circle cx="20" cy="80" r="2.5" fill="#ef4444" />
                                            <circle cx="80" cy="30" r="2.5" fill="hsl(var(--primary))" />
                                        </svg>

                                        {/* Floating Live Indicator */}
                                        <div className="absolute top-2.5 left-2.5 bg-background/80 backdrop-blur-md border border-border/30 px-2 py-0.5 rounded text-[8px] font-semibold text-emerald-400 flex items-center gap-1 shadow-md">
                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                                            <span>LIVE SYNC</span>
                                        </div>

                                        {/* Dynamic Route Guidance Overlay */}
                                        <div className="mt-auto relative z-10 space-y-1.5">
                                            <div className="bg-[#18181b]/95 backdrop-blur-sm border border-border/40 p-2 rounded-xl text-[9px] shadow-lg">
                                                <div className="flex justify-between items-center text-muted-foreground mb-1 font-mono">
                                                    <span>ETA: 14 mins</span>
                                                    <span>2.8 km remaining</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                                        <Navigation className="w-3 h-3" />
                                                    </div>
                                                    <p className="font-semibold truncate text-[9px] text-foreground">Turn right on Dionysiou Areopagitou</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Premium Driver Profile card */}
                                    <div className="mt-3 bg-[#18181b] border border-border/40 p-2.5 rounded-2xl flex items-center justify-between shadow-xl">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                                                G
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] font-heading font-bold text-foreground">Γιώργος (VIP)</h4>
                                                <p className="text-[8px] text-muted-foreground leading-none">Mercedes E-Class • 4.9★</p>
                                            </div>
                                        </div>
                                        <div className="text-right leading-tight">
                                            <p className="text-[10px] font-heading font-bold text-primary">€120.00</p>
                                            <p className="text-[7px] text-muted-foreground uppercase font-semibold tracking-wider">Stripe Ok</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Frame Highlight Glows */}
                                <div className="absolute inset-0 border border-primary/20 rounded-[50px] pointer-events-none z-40 group-hover:border-primary/40 transition-colors" />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Performance Metrics Dashboard */}
            <section className="py-16 bg-secondary/20 border-y border-border/80">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                        {[
                            { value: "+45%", desc: "Completion Rate", label: "Αύξηση ολοκληρωμένων tours" },
                            { value: "+30%", desc: "Recurrent Bookings", label: "Πελάτες που ξανακλείνουν" },
                            { value: "4.9★", desc: "User Rating", label: "Αξιολόγηση στα stores" },
                            { value: "< 100ms", desc: "GPS Latency", label: "Συγχρονισμός τοποθεσίας" }
                        ].map((stat, i) => (
                            <motion.div 
                                key={stat.desc}
                                {...fadeUp}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-4xl md:text-5xl font-heading font-extrabold text-primary mb-2 tracking-tight">
                                    {stat.value}
                                </div>
                                <div className="font-heading font-semibold text-sm text-foreground mb-1">
                                    {stat.desc}
                                </div>
                                <div className="text-xs text-muted-foreground max-w-[150px] mx-auto leading-normal">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section: Problem & Solution */}
            <section className="py-24">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto items-stretch">
                        {/* Problem Card */}
                        <motion.div 
                            {...fadeUp}
                            className="p-8 rounded-2xl bg-card border border-border flex flex-col justify-between"
                        >
                            <div>
                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-heading font-semibold tracking-wider uppercase mb-5">
                                    Το Ζητούμενο
                                </span>
                                <h3 className="text-2xl font-heading font-bold mb-4 text-foreground flex items-center gap-2">
                                    Πρόβλημα &amp; Προκλήσεις
                                </h3>
                                <p className="text-muted-foreground leading-relaxed text-sm space-y-4">
                                    Η εταιρεία VIP Taxi Tours χρειαζόταν μια native εφαρμογή για να ψηφιοποιήσει την εμπειρία των πελατών της. Οι κύριες προκλήσεις περιλάμβαναν:
                                </p>
                                <ul className="mt-4 space-y-3">
                                    {[
                                        "Αδυναμία παρακολούθησης του οδηγού live με αποτέλεσμα άγχος στην παραλαβή.",
                                        "Πολύπλοκη διαδικασία πληρωμών μέσω μετρητών ή τερματικών POS με χαμηλή ασφάλεια.",
                                        "Χειροκίνητος συντονισμός κρατήσεων, χωρίς αυτοματοποιημένο σύστημα ειδοποιήσεων."
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex gap-2.5 text-xs text-muted-foreground">
                                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0 mt-1.5" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>

                        {/* Solution Card */}
                        <motion.div 
                            {...fadeUp}
                            transition={{ duration: 0.5, delay: 0.15 }}
                            className="p-8 rounded-2xl bg-card border border-primary/20 flex flex-col justify-between shadow-[0_0_30px_rgba(34,197,94,0.02)]"
                        >
                            <div>
                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-heading font-semibold tracking-wider uppercase mb-5">
                                    Τι Υλοποιήσαμε
                                </span>
                                <h3 className="text-2xl font-heading font-bold mb-4 text-foreground flex items-center gap-2">
                                    Η High-End Λύση μας
                                </h3>
                                <p className="text-muted-foreground leading-relaxed text-sm">
                                    Σχεδιάσαμε και αναπτύξαμε μια native-feel mobile εφαρμογή σε Flutter με backend σε Firebase, παρέχοντας μια premium λύση:
                                </p>
                                <ul className="mt-4 space-y-3">
                                    {[
                                        "Σύστημα Live Tracking με Firebase Realtime DB, συγχρονίζοντας το στίγμα του οδηγού <100ms.",
                                        "Ασφαλείς, one-click in-app πληρωμές μέσω Stripe SDK με Apple Pay & Google Pay.",
                                        "Αυτόματα Push Notifications μέσω Firebase Cloud Messaging για την άφιξη του οδηγού."
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex gap-2.5 text-xs text-muted-foreground">
                                            <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0 mt-1.5" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* SHOWSTOPPER INTERACTIVE COMPONENT: Live GPS Ride Simulator & Stripe Payments */}
            <section id="simulator" className="py-20 bg-secondary/30 border-y border-border">
                <div className="container mx-auto px-6">
                    <motion.div {...fadeUp} className="text-center mb-12 max-w-2xl mx-auto">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-heading font-semibold tracking-wider uppercase mb-4">
                            <Navigation className="w-3.5 h-3.5 animate-spin-slow" />
                            Live Telemetry Showcase
                        </span>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-foreground">
                            Διαδραστικός Προσομοιωτής GPS
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Δοκιμάστε τη βασική λειτουργία της εφαρμογής μας. Ξεκινήστε την εικονική περιήγηση από το Αεροδρόμιο Αθηνών προς την Ακρόπολη και δείτε πώς συγχρονίζεται το live στίγμα και το Stripe checkout!
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-stretch">
                        {/* Map / Visualization Column */}
                        <div className="lg:col-span-7 bg-card rounded-2xl border border-border p-5 flex flex-col justify-between relative min-h-[350px] overflow-hidden">
                            {/* SVG Athens Simulation Map */}
                            <div className="absolute inset-0 opacity-15 pointer-events-none">
                                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                    <defs>
                                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                                        </pattern>
                                    </defs>
                                    <rect width="100%" height="100%" fill="url(#grid)" />
                                </svg>
                            </div>

                            {/* Simulated Route Path SVG */}
                            <div className="relative w-full h-[220px] rounded-lg bg-background/50 border border-border/40 overflow-hidden flex items-center justify-center">
                                <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    {/* Static Route Path */}
                                    <path 
                                        d="M 20,80 C 35,75 40,70 50,60 C 60,50 65,45 80,25" 
                                        fill="none" 
                                        stroke="hsl(var(--border))" 
                                        strokeWidth="3" 
                                        strokeLinecap="round"
                                    />
                                    {/* Active Progress Path */}
                                    <path 
                                        d="M 20,80 C 35,75 40,70 50,60 C 60,50 65,45 80,25" 
                                        fill="none" 
                                        stroke="hsl(var(--primary))" 
                                        strokeWidth="3" 
                                        strokeLinecap="round"
                                        strokeDasharray="100"
                                        strokeDashoffset={100 - simProgress}
                                    />

                                    {/* Route Points */}
                                    {simulationSteps.map((step, idx) => (
                                        <g key={idx}>
                                            <circle 
                                                cx={step.x} 
                                                cy={step.y} 
                                                r={simIndex === idx ? "4" : "3"} 
                                                className={`transition-all duration-300 ${simIndex === idx ? "fill-primary" : "fill-muted-foreground/40"}`}
                                            />
                                        </g>
                                    ))}

                                    {/* Moving Car / Driver Icon */}
                                    <g style={{ 
                                        transform: `translate(${simulationSteps[simIndex].x}px, ${simulationSteps[simIndex].y}px)`,
                                        transition: 'transform 0.4s ease-out'
                                    }}>
                                        <circle r="7" className="fill-primary/20 stroke-primary stroke-2 animate-ping" />
                                        <circle r="4" className="fill-primary" />
                                    </g>
                                </svg>

                                {/* Labels on the map */}
                                <div className="absolute bottom-4 left-6 flex items-center gap-1.5 bg-card/90 px-2 py-1 rounded border border-border text-[9px] font-heading font-medium">
                                    <Landmark className="w-3 h-3 text-primary" />
                                    Αεροδρόμιο
                                </div>
                                <div className="absolute top-4 right-6 flex items-center gap-1.5 bg-card/90 px-2 py-1 rounded border border-border text-[9px] font-heading font-medium">
                                    <Compass className="w-3 h-3 text-primary" />
                                    Ακρόπολη
                                </div>
                            </div>

                            {/* Control Dashboard */}
                            <div className="z-10 mt-4">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-xs text-muted-foreground font-mono">Progress: {simProgress}%</span>
                                    <span className="text-xs font-semibold text-primary uppercase tracking-widest font-heading flex items-center gap-1">
                                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                        {simulationSteps[simIndex].label}
                                    </span>
                                </div>
                                <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden mb-4">
                                    <div 
                                        className="bg-primary h-full transition-all duration-100" 
                                        style={{ width: `${simProgress}%` }}
                                    />
                                </div>

                                <div className="flex gap-2">
                                    {!isSimulating && simProgress < 100 && (
                                        <button 
                                            onClick={startSimulation}
                                            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground font-heading font-semibold text-xs rounded-md hover:opacity-90 transition-opacity"
                                        >
                                            <Play className="w-3.5 h-3.5" />
                                            Ξεκίνα Περιήγηση
                                        </button>
                                    )}
                                    {isSimulating && (
                                        <button 
                                            onClick={pauseSimulation}
                                            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-card border border-border text-foreground font-heading font-semibold text-xs rounded-md hover:bg-secondary/40 transition-colors"
                                        >
                                            <Pause className="w-3.5 h-3.5" />
                                            Παύση
                                        </button>
                                    )}
                                    <button 
                                        onClick={resetSimulation}
                                        className="px-3.5 py-2.5 bg-card border border-border text-muted-foreground hover:text-foreground rounded-md transition-colors"
                                        title="Επαναφορά"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Status / Stripe Logs Column */}
                        <div className="lg:col-span-5 flex flex-col justify-between bg-card rounded-2xl border border-border p-6 min-h-[350px]">
                            <div className="space-y-4">
                                <h4 className="font-heading font-bold text-sm text-foreground uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-border/60">
                                    <Milestone className="w-4 h-4 text-primary" />
                                    Live Logs (Firebase DB)
                                </h4>

                                <div className="space-y-3 min-h-[170px] flex flex-col justify-start">
                                    {/* Simulation Details Log */}
                                    <div className="p-3.5 rounded-lg bg-secondary/40 border border-border/50 text-xs">
                                        <div className="flex justify-between items-center mb-1 text-primary/80 font-mono">
                                            <span>Telemetry Tick: #{simIndex + 1}</span>
                                            <span>{simulationSteps[simIndex].time}</span>
                                        </div>
                                        <p className="text-foreground leading-relaxed">
                                            {simulationSteps[simIndex].info}
                                        </p>
                                    </div>

                                    {/* Simulated Stripe Checkout completed widget */}
                                    <AnimatePresence>
                                        {showReceipt && (
                                            <motion.div 
                                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30"
                                            >
                                                <div className="flex items-center gap-2 text-emerald-500 font-heading font-bold text-xs mb-2">
                                                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                                                    <span>Stripe Payment Succeeded</span>
                                                </div>
                                                <div className="text-[11px] text-muted-foreground space-y-1">
                                                    <div className="flex justify-between">
                                                        <span>Προορισμός:</span>
                                                        <span className="font-medium text-foreground">Αεροδρόμιο ➡️ Ακρόπολη</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Χρέωση Κάρτας:</span>
                                                        <span className="font-medium text-foreground">•••• 4242 (Stripe Test)</span>
                                                    </div>
                                                    <div className="flex justify-between pt-1 border-t border-emerald-500/20 text-xs font-semibold text-foreground">
                                                        <span>Σύνολο:</span>
                                                        <span className="text-emerald-500">€120.00 EUR</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border/60">
                                <p className="text-[11px] text-muted-foreground leading-normal flex items-start gap-1.5">
                                    <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                                    Η προσομοίωση καταδεικνύει την πραγματική ανταπόκριση της Flutter εφαρμογής κατά τη διάρκεια της διαδρομής και την αυτόματη χρέωση.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Capabilities Showcase */}
            <section className="py-24">
                <div className="container mx-auto px-6">
                    <motion.div {...fadeUp} className="text-center mb-16 max-w-2xl mx-auto">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-heading font-semibold tracking-wider uppercase mb-4">
                            <Award className="w-3.5 h-3.5" />
                            Premium Architecture
                        </span>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-foreground">
                            Λειτουργίες Υψηλού Επιπέδου
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Κάθε λεπτομέρεια στην εφαρμογή LTG έχει σχεδιαστεί για να προσφέρει κορυφαία εμπειρία χρήσης, ασφάλεια και ταχύτητα.
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {appCapabilities.map((cap, i) => (
                            <motion.div 
                                key={cap.title}
                                {...fadeUp}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                    <cap.icon className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="font-heading font-bold text-lg mb-2 text-foreground">{cap.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{cap.description}</p>
                                <div className="flex flex-wrap gap-2 pt-2 border-t border-border/40">
                                    {cap.features.map(f => (
                                        <span key={f} className="text-[10px] font-mono text-primary bg-primary/5 px-2 py-0.5 rounded">
                                            {f}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* INTERACTIVE COMPONENT: Dynamic Quote & App Cost Estimator */}
            <section id="calculator" className="py-20 bg-secondary/20 border-t border-border">
                <div className="container mx-auto px-6">
                    <motion.div {...fadeUp} className="text-center mb-16 max-w-2xl mx-auto">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-heading font-semibold tracking-wider uppercase mb-4">
                            <DollarSign className="w-3.5 h-3.5" />
                            Cost &amp; Estimation Tool
                        </span>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-foreground">
                            Υπολογίστε το δικό σας Flutter App
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Θέλετε μια αντίστοιχη power εφαρμογή; Επιλέξτε τις λειτουργίες που χρειάζεστε και δείτε άμεσα μια εκτίμηση κόστους και χρόνου παράδοσης από την ομάδα μας.
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-12 gap-8 max-w-4xl mx-auto items-stretch">
                        {/* Features Selection List */}
                        <div className="lg:col-span-7 bg-card rounded-2xl border border-border p-6 flex flex-col justify-between">
                            <div className="space-y-5">
                                <h4 className="font-heading font-bold text-sm text-foreground uppercase tracking-wider pb-2 border-b border-border/60">
                                    Επιλέξτε Λειτουργίες
                                </h4>

                                <div className="space-y-3">
                                    {/* Toggle GPS Tracking */}
                                    <label className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50 cursor-pointer hover:border-primary/20 transition-all select-none">
                                        <div className="flex gap-3 items-center">
                                            <input 
                                                type="checkbox" 
                                                checked={hasTracking} 
                                                onChange={() => setHasTracking(!hasTracking)}
                                                className="accent-primary w-4 h-4 shrink-0 rounded"
                                            />
                                            <div>
                                                <div className="text-xs font-semibold text-foreground">Live GPS Tracking</div>
                                                <div className="text-[10px] text-muted-foreground">Συγχρονισμός τοποθεσίας οδηγού-πελάτη</div>
                                            </div>
                                        </div>
                                        <span className="text-xs font-mono text-primary font-semibold">+€1.500</span>
                                    </label>

                                    {/* Toggle Stripe */}
                                    <label className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50 cursor-pointer hover:border-primary/20 transition-all select-none">
                                        <div className="flex gap-3 items-center">
                                            <input 
                                                type="checkbox" 
                                                checked={hasStripe} 
                                                onChange={() => setHasStripe(!hasStripe)}
                                                className="accent-primary w-4 h-4 shrink-0 rounded"
                                            />
                                            <div>
                                                <div className="text-xs font-semibold text-foreground">Stripe Payments SDK</div>
                                                <div className="text-[10px] text-muted-foreground">Πληρωμές με Apple Pay/Google Pay &amp; κάρτες</div>
                                            </div>
                                        </div>
                                        <span className="text-xs font-mono text-primary font-semibold">+€1.000</span>
                                    </label>

                                    {/* Toggle Push */}
                                    <label className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50 cursor-pointer hover:border-primary/20 transition-all select-none">
                                        <div className="flex gap-3 items-center">
                                            <input 
                                                type="checkbox" 
                                                checked={hasPush} 
                                                onChange={() => setHasPush(!hasPush)}
                                                className="accent-primary w-4 h-4 shrink-0 rounded"
                                            />
                                            <div>
                                                <div className="text-xs font-semibold text-foreground">Smart Push Notifications</div>
                                                <div className="text-[10px] text-muted-foreground">Firebase Cloud Messaging ειδοποιήσεις άφιξης</div>
                                            </div>
                                        </div>
                                        <span className="text-xs font-mono text-primary font-semibold">+€600</span>
                                    </label>

                                    {/* Toggle Console */}
                                    <label className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50 cursor-pointer hover:border-primary/20 transition-all select-none">
                                        <div className="flex gap-3 items-center">
                                            <input 
                                                type="checkbox" 
                                                checked={hasConsole} 
                                                onChange={() => setHasConsole(!hasConsole)}
                                                className="accent-primary w-4 h-4 shrink-0 rounded"
                                            />
                                            <div>
                                                <div className="text-xs font-semibold text-foreground">Driver Administration App</div>
                                                <div className="text-[10px] text-muted-foreground">Ξεχωριστό dashboard &amp; κονσόλα οδηγού</div>
                                            </div>
                                        </div>
                                        <span className="text-xs font-mono text-primary font-semibold">+€1.800</span>
                                    </label>

                                    {/* Toggle Web Portal */}
                                    <label className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50 cursor-pointer hover:border-primary/20 transition-all select-none">
                                        <div className="flex gap-3 items-center">
                                            <input 
                                                type="checkbox" 
                                                checked={hasWebPortal} 
                                                onChange={() => setHasWebPortal(!hasWebPortal)}
                                                className="accent-primary w-4 h-4 shrink-0 rounded"
                                            />
                                            <div>
                                                <div className="text-xs font-semibold text-foreground">Booking Web Portal</div>
                                                <div className="text-[10px] text-muted-foreground">Web site διαχείρισης και online κρατήσεων</div>
                                            </div>
                                        </div>
                                        <span className="text-xs font-mono text-primary font-semibold">+€1.200</span>
                                    </label>
                                </div>
                            </div>

                            {/* Develop timeline range */}
                            <div className="mt-6 pt-5 border-t border-border/60">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-semibold text-foreground">Χρόνος Ανάπτυξης:</span>
                                    <span className="text-xs font-mono text-primary font-bold">{developmentSpeed} Εβδομάδες</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="4" 
                                    max="12" 
                                    step="2"
                                    value={developmentSpeed}
                                    onChange={(e) => setDevelopmentSpeed(parseInt(e.target.value))}
                                    className="w-full accent-primary bg-secondary/60 h-1.5 rounded-lg cursor-pointer"
                                />
                                <div className="flex justify-between text-[9px] text-muted-foreground mt-1 font-mono">
                                    <span>Fast-track (4 εβδ. premium)</span>
                                    <span>Standard (8 εβδ.)</span>
                                    <span>Flexible (12 εβδ.)</span>
                                </div>
                            </div>
                        </div>

                        {/* Cost & Timeline estimation results */}
                        <div className="lg:col-span-5 bg-card rounded-2xl border border-primary/20 p-6 flex flex-col justify-between shadow-[0_0_30px_rgba(34,197,94,0.02)]">
                            <div>
                                <h4 className="font-heading font-bold text-sm text-foreground uppercase tracking-wider pb-2 border-b border-border/60 mb-5">
                                    Εκτίμηση Έργου
                                </h4>

                                <div className="space-y-5">
                                    <div>
                                        <div className="text-xs text-muted-foreground mb-1">Προϋπολογισμός (Budget)</div>
                                        <div className="text-4xl font-heading font-extrabold text-primary tracking-tight font-mono">
                                            €{getEstimatedPrice().toLocaleString("el-GR")}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground mt-1 leading-normal">
                                            *Τελική τιμή προ ΦΠΑ. Περιλαμβάνει 1 χρόνο δωρεάν maintenance.
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/60">
                                        <div>
                                            <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                Χρονοδιάγραμμα
                                            </div>
                                            <div className="text-xs font-heading font-bold text-foreground mt-0.5">
                                                {developmentSpeed} εβδομάδες
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                <HelpCircle className="w-3.5 h-3.5" />
                                                Υποστήριξη
                                            </div>
                                            <div className="text-xs font-heading font-bold text-foreground mt-0.5">
                                                24/7 Premium SLA
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 mt-6 border-t border-border/60">
                                <Link
                                    href="/#contact"
                                    className="w-full inline-flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground font-heading font-bold text-xs rounded-md hover:opacity-90 transition-opacity glow-border"
                                >
                                    Ζητήστε Προσφορά για το App σας
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Technical Deep Dive section */}
            <section className="py-20">
                <div className="container mx-auto px-6 max-w-4xl">
                    <motion.div {...fadeUp} className="mb-12 text-center">
                        <p className="text-primary font-heading text-xs tracking-[0.3em] uppercase mb-3 font-semibold">
                            Technical Architecture
                        </p>
                        <h2 className="text-3xl font-heading font-bold text-foreground">
                            Πίσω από την κουρτίνα
                        </h2>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        {techStack.map((tech, i) => (
                            <motion.div
                                key={tech.name}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                className="p-4 rounded-xl bg-card border border-border flex items-start gap-4 hover:border-primary/20 transition-all"
                            >
                                <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                    {i + 1}
                                </span>
                                <div>
                                    <h4 className="font-heading font-semibold text-sm text-foreground flex items-center gap-1.5">
                                        {tech.name}
                                        <span className="text-[9px] bg-secondary/80 text-muted-foreground px-1.5 py-0.5 rounded font-normal font-sans">
                                            {tech.category}
                                        </span>
                                    </h4>
                                    <p className="text-[11px] text-muted-foreground mt-1 leading-normal">{tech.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom CTA section */}
            <section className="py-24 bg-secondary/15 border-t border-border">
                <div className="container mx-auto px-6 max-w-3xl text-center">
                    <motion.div {...fadeUp}>
                        <p className="text-primary font-heading text-xs tracking-[0.3em] uppercase mb-3 font-semibold">
                            Ξεκινήστε Σήμερα
                        </p>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-foreground leading-tight">
                            Θέλετε να αναπτύξουμε τη δική σας mobile εφαρμογή;
                        </h2>
                        <p className="text-base text-muted-foreground leading-relaxed mb-8 max-w-xl mx-auto">
                            Είτε πρόκειται για tracking, delivery, booking, ή custom λύσεις logistics, η ομάδα της **SGK Digital** έχει την τεχνογνωσία να το υλοποιήσει.
                        </p>
                        <Link
                            href="/#contact"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-heading font-semibold rounded-md hover:opacity-95 transition-opacity glow-border"
                        >
                            Συζητήστε το Project σας μαζί μας
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            <div className="h-16 bg-background" />
        </div>
    );
}
