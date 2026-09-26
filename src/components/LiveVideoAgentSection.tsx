"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
    Video, 
    Sparkles, 
    Bot, 
    Stethoscope, 
    Dumbbell, 
    Building2, 
    ShoppingBag, 
    Hotel, 
    Scale, 
    Camera, 
    CheckCircle2, 
    ArrowRight, 
    PhoneCall,
    Database,
    Zap,
    Users
} from "lucide-react";

const industries = [
    {
        title: "Ιατρεία & Κλινικές",
        description: "24/7 λήψη ιστορικού, κλείσιμο ραντεβού, οδηγίες προετοιμασίας εξετάσεων και απάντηση σε βασικές ιατρικές ερωτήσεις χωρίς φόρτο στη γραμματεία.",
        icon: Stethoscope,
        color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        badge: "Healthcare"
    },
    {
        title: "Γυμναστήρια & Studios",
        description: "Ενημέρωση για συνδρομές, αυτόματες online εγγραφές, ανάλυση προγραμμάτων fitness και κράτηση δοκιμαστικής προπόνησης.",
        icon: Dumbbell,
        color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
        badge: "Fitness & Wellness"
    },
    {
        title: "Τράπεζες & Οργανισμοί",
        description: "Προσωποποιημένος ψηφιακός τραπεζικός σύμβουλος, καθοδήγηση για δάνεια & κάρτες, ταυτοποίηση πελάτη και άμεση καθοδήγηση onboarding.",
        icon: Building2,
        color: "bg-blue-500/10 text-[#3b5bdb] border-blue-500/20",
        badge: "Banking & Finance"
    },
    {
        title: "E-shops & Retail",
        description: "Ζωντανός AI πωλητής που καθοδηγεί τον επισκέπτη, προτείνει σχετικά προϊόντα, λύνει απορίες και εκτοξεύει τις πωλήσεις.",
        icon: ShoppingBag,
        color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
        badge: "E-Commerce"
    },
    {
        title: "Ξενοδοχεία & Τουρισμός",
        description: "24/7 Digital Concierge για check-in, προτάσεις εστιατορίων, τοπικές εκδρομές και άμεση υποστήριξη σε πολλαπλές γλώσσες.",
        icon: Hotel,
        color: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
        badge: "Hospitality"
    },
    {
        title: "Δικηγορικά & Συμβουλευτική",
        description: "Προκαταρκτική συλλογή στοιχείων πελάτη, έλεγχος ΑΦΜ και ΓΕΜΗ σε πραγματικό χρόνο και αυτόματος προγραμματισμός ραντεβού.",
        icon: Scale,
        color: "bg-rose-500/10 text-rose-600 border-rose-500/20",
        badge: "Legal & Consulting"
    }
];

const capabilities = [
    {
        title: "Ρεαλιστικό Video WebRTC",
        desc: "Φυσικές ανθρώπινες εκφράσεις, συγχρονισμός χειλιών και αστραπιαία απόκριση σε πραγματικό χρόνο.",
        icon: Video
    },
    {
        title: "Φυσικός Ελληνικός Διάλογος",
        desc: "Ακούνε, κατανοούν και μιλούν άπταιστα ελληνικά και αγγλικά με προηγμένα μοντέλα ομιλίας.",
        icon: Zap
    },
    {
        title: "Σύνδεση με Βάσεις & APIs",
        desc: "Διασύνδεση σε πραγματικό χρόνο με CRM, ERP, Google Calendar, ΓΕΜΗ και τραπεζικά συστήματα.",
        icon: Database
    },
    {
        title: "Vision AI & Κάμερα Χρήστη",
        desc: "Σχεδιασμένο για οπτική επικοινωνία: αναγνώριση προσώπου χρήστη, εγγράφων και αντικειμένων μέσω web κάμερας.",
        icon: Camera
    }
];

export default function LiveVideoAgentSection() {
    return (
        <section className="w-full bg-[#0d0e12] py-24 sm:py-32 text-white relative overflow-hidden">
            {/* Subtle Gradient Backdrops */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#3b5bdb]/15 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* Section Badge & Main Titles */}
                <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
                    <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3b5bdb]/20 border border-[#3b5bdb]/40 text-[#4ade80] text-xs sm:text-sm font-semibold mb-6 tracking-wide"
                    >
                        <Sparkles className="w-4 h-4 text-[#4ade80] animate-pulse" />
                        <span>ΝΕΑ ΥΠΗΡΕΣΙΑ • 24/7 INTERACTIVE AI VIDEO AGENTS</span>
                    </motion.div>

                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-[1.15] mb-6"
                    >
                        Ψηφιακοί Υπάλληλοι με <br />
                        <span className="font-semibold bg-gradient-to-r from-white via-slate-200 to-[#3b5bdb] bg-clip-text text-transparent">
                            Ζωντανό Video & Φωνή
                        </span>
                    </motion.h2>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-base sm:text-lg text-gray-300 leading-relaxed font-light"
                    >
                        Εξυπηρετήστε τους πελάτες σας μέσα από ένα <strong className="text-white font-medium">ρεαλιστικό ανθρώπινο video call</strong>. 
                        Οι AI Video Agents της SGK απαντούν με φυσική φωνή, εκτελούν πραγματικές εργασίες (κρατήσεις, ταυτοποίηση, πωλήσεις) 
                        και συνδέονται απευθείας με τα πληροφοριακά συστήματα της επιχείρησής σας.
                    </motion.p>
                </div>

                {/* Hero Feature Showcase Card (Interactive Demo Preview) */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="w-full bg-[#151720] rounded-3xl border border-white/10 p-6 sm:p-10 lg:p-12 mb-20 shadow-2xl relative overflow-hidden"
                >
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        
                        {/* Left Column: Visual Call Screen Preview */}
                        <div className="lg:col-span-6 relative">
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-black group">
                                <Image 
                                    src="https://files2.heygen.ai/avatar/v3/33c9ac4aead44dfc8bc0082a35062a70_45580/preview_talk_3.webp" 
                                    alt="Live AI Video Agent Demo - Bryan" 
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />

                                {/* Live Badge */}
                                <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                                    <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
                                    <span className="text-xs font-semibold text-white tracking-wide uppercase">Live WebRTC</span>
                                </div>

                                {/* Floating Dialogue Pill */}
                                <div className="absolute bottom-4 left-4 right-4 z-20 bg-black/75 backdrop-blur-md p-3.5 rounded-xl border border-white/20 shadow-xl">
                                    <div className="flex items-center gap-2.5 mb-1.5">
                                        <Bot className="w-4 h-4 text-[#4ade80]" />
                                        <span className="text-xs font-semibold text-white">Bryan • SGK AI Agent</span>
                                        <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">Online</span>
                                    </div>
                                    <p className="text-xs text-gray-200 italic">
                                        «Γεια σας! Είμαι ο Bryan. Πώς μπορώ να σας βοηθήσω σήμερα με την επιχείρησή σας;»
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Key Benefits & Action Call */}
                        <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
                            <div className="space-y-3">
                                <span className="text-xs uppercase font-bold tracking-widest text-[#4ade80]">
                                    Ζωντανή Εμπειρία Επόμενης Γενιάς
                                </span>
                                <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-white">
                                    Δεν είναι απλό chatbot. Είναι ένας <span className="font-semibold text-[#4ade80]">πραγματικός συνεργάτης</span>.
                                </h3>
                                <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
                                    Αντικαταστήστε τα ψυχρά κείμενα με ζωντανή ανθρώπινη επαφή. Οι Video Agents μας υποδέχονται τους πελάτες σας με χαμόγελο, 
                                    τους ακούν μέσω μικροφώνου, απαντούν άμεσα σε οποιαδήποτε γλώσσα και ολοκληρώνουν συναλλαγές.
                                </p>
                            </div>

                            {/* Feature list pills */}
                            <div className="grid sm:grid-cols-2 gap-3 pt-2">
                                {capabilities.map((cap, idx) => {
                                    const IconComponent = cap.icon;
                                    return (
                                        <div key={idx} className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                                            <div className="p-2 rounded-lg bg-[#3b5bdb]/20 text-[#4ade80] shrink-0">
                                                <IconComponent className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-white mb-0.5">{cap.title}</h4>
                                                <p className="text-[11px] text-gray-400 leading-snug">{cap.desc}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Action CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <Link 
                                    href="/liveavatar-demo"
                                    className="px-6 py-3.5 rounded-full bg-[#4ade80] hover:bg-[#22c55e] text-black font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                                >
                                    <Video className="w-4 h-4" />
                                    <span>Δοκιμάστε το Live Demo Τώρα</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>

                                <Link 
                                    href="/estimate"
                                    className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold text-sm flex items-center justify-center gap-2 border border-white/20 transition-all cursor-pointer"
                                >
                                    <PhoneCall className="w-4 h-4" />
                                    <span>Ζητήστε Custom Υλοποίηση</span>
                                </Link>
                            </div>
                        </div>

                    </div>
                </motion.div>

                {/* Vertical Market Use Cases (Ιατρεία, Γυμναστήρια, Τράπεζες κτλ) */}
                <div className="mb-16">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h3 className="text-2xl sm:text-4xl font-light text-white mb-3">
                            Πού εφαρμόζεται με <span className="font-semibold text-[#4ade80]">τεράστια επιτυχία</span>;
                        </h3>
                        <p className="text-sm sm:text-base text-gray-400 font-light">
                            Ιδανικό για κάθε επιχείρηση που θέλει να προσφέρει 24/7 προσωποποιημένη εξυπηρέτηση και να αυξήσει τις πωλήσεις της.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {industries.map((ind, i) => {
                            const IconC = ind.icon;
                            return (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.08 }}
                                    className="p-6 sm:p-7 rounded-2xl bg-[#151720] border border-white/10 hover:border-white/20 hover:bg-[#1a1d29] transition-all duration-300 flex flex-col justify-between group"
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-5">
                                            <div className={`p-3 rounded-xl border ${ind.color}`}>
                                                <IconC className="w-6 h-6" />
                                            </div>
                                            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                                                {ind.badge}
                                            </span>
                                        </div>

                                        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-[#4ade80] transition-colors">
                                            {ind.title}
                                        </h4>
                                        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
                                            {ind.description}
                                        </p>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-gray-400 group-hover:text-white transition-colors">
                                        <span>Εξατομικευμένη Εκπαίδευση</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom Callout Banner */}
                <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#3b5bdb]/20 via-[#151720] to-emerald-500/20 border border-white/15 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                        <h4 className="text-xl sm:text-2xl font-bold text-white">
                            Θέλετε να δείτε πώς θα λειτουργούσε στην επιχείρησή σας;
                        </h4>
                        <p className="text-sm text-gray-300 font-light max-w-xl">
                            Επικοινωνήστε μαζί μας σήμερα για να δημιουργήσουμε ένα demo προσαρμοσμένο αποκλειστικά στα δεδομένα, το λογότυπο και τις ανάγκες σας.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <Link 
                            href="/liveavatar-demo"
                            className="px-6 py-3 rounded-full bg-[#4ade80] hover:bg-[#22c55e] text-black font-bold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all"
                        >
                            Δοκιμάστε το Demo
                        </Link>
                        <a 
                            href="tel:2103009544"
                            className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-sm border border-white/20 transition-all"
                        >
                            210 300 9544
                        </a>
                    </div>
                </div>

            </div>
        </section>
    );
}
