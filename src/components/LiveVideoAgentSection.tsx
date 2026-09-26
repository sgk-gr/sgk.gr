"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, PhoneCall, Video } from "lucide-react";

const industries = [
    {
        title: "Ιατρεία & Κλινικές",
        description: "24/7 λήψη ιστορικού, αυτόματο κλείσιμο ραντεβού, οδηγίες προετοιμασίας εξετάσεων και απάντηση σε βασικές ιατρικές ερωτήσεις χωρίς φόρτο στη γραμματεία.",
        tagColor: "border-l-[#4ade80]"
    },
    {
        title: "Γυμναστήρια & Fitness Studios",
        description: "Ενημέρωση για συνδρομές, online εγγραφές μελών, ανάλυση προγραμμάτων προπόνησης και κράτηση δοκιμαστικού.",
        tagColor: "border-l-[#3b5bdb]"
    },
    {
        title: "Τράπεζες & Οργανισμοί",
        description: "Προσωποποιημένος ψηφιακός τραπεζικός σύμβουλος, καθοδήγηση για δάνεια & κάρτες, ταυτοποίηση πελάτη και άμεσο onboarding.",
        tagColor: "border-l-[#facc15]"
    },
    {
        title: "E-shops & Retail",
        description: "Ζωντανός ψηφιακός πωλητής 24/7 που υποδέχεται τον επισκέπτη, προτείνει σχετικά προϊόντα, λύνει απορίες και αυξάνει τις πωλήσεις.",
        tagColor: "border-l-pink-500"
    },
    {
        title: "Ξενοδοχεία & Τουρισμός",
        description: "24/7 Virtual Concierge για check-in, προτάσεις εστιατορίων, τοπικές εκδρομές και άμεση υποστήριξη σε πολλαπλές γλώσσες.",
        tagColor: "border-l-[#4ade80]"
    },
    {
        title: "Δικηγορικά & Συμβουλευτικά Γραφεία",
        description: "Προκαταρκτική συλλογή στοιχείων, έλεγχος ΑΦΜ και ΓΕΜΗ σε πραγματικό χρόνο και αυτόματος προγραμματισμός ραντεβού.",
        tagColor: "border-l-[#3b5bdb]"
    }
];

export default function LiveVideoAgentSection() {
    return (
        <section className="w-full bg-white py-20 md:py-28 overflow-hidden text-black">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Clean Editorial Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
                    <h2 className="text-3xl sm:text-5xl font-light text-black tracking-tight leading-[1.15] mb-5">
                        Ψηφιακοί Υπάλληλοι με <br />
                        <span className="font-semibold text-[#3b5bdb]">Ζωντανό Video & Φωνή</span>
                    </h2>

                    <p className="text-black/75 text-base sm:text-lg leading-relaxed font-light">
                        Εξυπηρετήστε τους πελάτες σας μέσα από ένα <strong className="font-semibold text-black">ρεαλιστικό ανθρώπινο video call</strong>. 
                        Οι AI Video Agents της SGK απαντούν με φυσική φωνή σε πραγματικό χρόνο, συνδέονται με τα συστήματά σας και αναλαμβάνουν ραντεβού, ταυτοποίηση και πωλήσεις 24/7.
                    </p>
                </div>

                {/* Main Feature Showcase (Dual layout matching SGK brand) */}
                <div className="flex flex-col-reverse lg:flex-row relative items-center mb-24">
                    
                    {/* Left Box (Dark brand accent card overlapping the visual) */}
                    <div className="w-full lg:w-[48%] bg-[#111111] text-white p-8 sm:p-12 relative z-10 lg:-mr-[8%] mt-0 shadow-2xl">
                        <span className="inline-block text-xs uppercase font-bold tracking-widest text-[#4ade80] mb-4">
                            Εξυπηρέτηση Επόμενης Γενιάς
                        </span>

                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-6 leading-snug">
                            Δεν είναι απλό chatbot. Είναι ένας <span className="font-bold text-[#4ade80]">πραγματικός συνεργάτης</span>.
                        </h3>

                        <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-8 font-light">
                            Αντικαταστήστε τα ψυχρά γραπτά μηνύματα με ζωντανή ανθρώπινη επαφή. Οι Video Agents υποδέχονται τον επισκέπτη με χαμόγελο, 
                            ακούνε μέσω μικροφώνου, απαντούν άμεσα σε φυσικά ελληνικά και ολοκληρώνουν συναλλαγές.
                        </p>

                        <ul className="space-y-4 mb-10 text-sm sm:text-[15px] text-white/90">
                            <li className="flex items-start">
                                <span className="w-2.5 h-2.5 bg-[#4ade80] mr-3.5 shrink-0 mt-1.5" />
                                <span>Ρεαλιστικό Video WebRTC με φυσική κίνηση και άμεση απόκριση</span>
                            </li>
                            <li className="flex items-start">
                                <span className="w-2.5 h-2.5 bg-[#4ade80] mr-3.5 shrink-0 mt-1.5" />
                                <span>Άπταιστος ελληνικός διάλογος χωρίς ρομποτικές καθυστερήσεις</span>
                            </li>
                            <li className="flex items-start">
                                <span className="w-2.5 h-2.5 bg-[#4ade80] mr-3.5 shrink-0 mt-1.5" />
                                <span>Live σύνδεση με CRM, ERP, Google Calendar, ΓΕΜΗ & τραπεζικά APIs</span>
                            </li>
                            <li className="flex items-start">
                                <span className="w-2.5 h-2.5 bg-[#4ade80] mr-3.5 shrink-0 mt-1.5" />
                                <span>Σχεδιασμένο για οπτική αναγνώριση εγγράφων και ταυτοποίηση μέσω κάμερας</span>
                            </li>
                        </ul>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link 
                                href="/liveavatar-demo"
                                className="inline-flex items-center justify-center gap-2 bg-[#4ade80] text-black hover:bg-[#22c55e] transition-all font-bold py-3.5 px-8 rounded-sm shadow-lg text-center text-sm"
                            >
                                <Video className="w-4 h-4" />
                                <span>Δοκιμάστε το Live Demo</span>
                            </Link>

                            <Link 
                                href="/estimate"
                                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white hover:bg-white/20 transition-all font-medium py-3.5 px-6 rounded-sm text-center text-sm border border-white/20"
                            >
                                <span>Ζητήστε Προσφορά</span>
                            </Link>
                        </div>
                    </div>

                    {/* Right Visual Frame */}
                    <div className="w-full lg:w-[60%] relative h-[360px] sm:h-[480px] lg:h-[600px] z-0">
                        <Image 
                            src="https://files2.heygen.ai/avatar/v3/33c9ac4aead44dfc8bc0082a35062a70_45580/preview_talk_3.webp" 
                            alt="SGK Live Video AI Agent Demo" 
                            fill
                            className="object-cover shadow-2xl"
                        />
                        {/* Elegant live pill */}
                        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white text-xs font-medium">
                            <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
                            <span>Live Video Agent • 24/7 Online</span>
                        </div>
                    </div>

                </div>

                {/* Industries Section (Clean, non-AI-generated typography cards) */}
                <div className="mb-20">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h3 className="text-2xl sm:text-4xl font-light text-black mb-3 tracking-tight">
                            Πού εφαρμόζεται στην επιχείρησή σας;
                        </h3>
                        <p className="text-black/70 text-sm sm:text-base font-light">
                            Προσαρμόζεται πλήρως στις ανάγκες και τα δεδομένα του κάθε κλάδου:
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {industries.map((ind, i) => (
                            <div 
                                key={i}
                                className={`bg-[#f4f2ea] p-7 border-l-4 ${ind.tagColor} flex flex-col justify-between hover:shadow-md transition-shadow`}
                            >
                                <div>
                                    <h4 className="text-lg font-bold text-black mb-3">
                                        {ind.title}
                                    </h4>
                                    <p className="text-sm text-black/75 leading-relaxed font-light">
                                        {ind.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Clean Bottom Contact Card */}
                <div className="bg-[#f4f2ea] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                        <h4 className="text-xl sm:text-2xl font-bold text-black">
                            Θέλετε έναν AI Video Agent για τη δική σας επιχείρηση;
                        </h4>
                        <p className="text-sm text-black/70 font-light max-w-xl">
                            Επικοινωνήστε μαζί μας για να σχεδιάσουμε τον δικό σας ψηφιακό υπάλληλο, εκπαιδευμένο αποκλειστικά στα προϊόντα και τις υπηρεσίες σας.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <Link 
                            href="/liveavatar-demo"
                            className="px-7 py-3.5 bg-[#3b5bdb] hover:bg-[#2f49b0] text-white font-bold text-sm shadow-md transition-colors"
                        >
                            Δοκιμάστε το Demo
                        </Link>
                        <a 
                            href="tel:2111140013"
                            className="px-6 py-3.5 bg-black text-white hover:bg-black/85 font-medium text-sm transition-colors"
                        >
                            211 114 0013
                        </a>
                    </div>
                </div>

            </div>
        </section>
    );
}
