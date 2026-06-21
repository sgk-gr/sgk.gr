"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

const EshopOffer = () => {
    return (
        <section id="eshop-offer" className="py-24 relative overflow-hidden bg-white">
            <div className="container mx-auto px-6 relative z-10 max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >

                        <p className="font-heading font-bold text-xs tracking-[0.2em] uppercase mb-4 text-[#3b5bdb]">
                            E-commerce Solutions
                        </p>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 leading-[1.1] text-black">
                            Eshop <span className="text-[#facc15]">Νέας Γενιάς</span> <br />
                            από 1.500€
                        </h2>

                        <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl">
                            Αποκτήστε ένα υπερσύγχρονο, ταχύτατο και πλήρως custom ηλεκτρονικό κατάστημα. Σχεδιασμένο να πουλάει από το πρώτο δευτερόλεπτο, με έμφαση στην εμπειρία του χρήστη.
                        </p>

                        <div className="space-y-4 mb-10">
                            {[
                                "Πληρωμή σε 2 δόσεις για μεγαλύτερη ευελιξία",
                                "Mobile First / Fully Responsive Design",
                                "SEO Optimized & Hyper-Fast Loading",
                                "Κορυφαία Ποιότητα & Αξιοπιστία",
                                "Βελτιστοποίηση SEO"
                            ].map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <CheckCircle2 size={20} className="text-[#4ade80] shrink-0" />
                                    <span className="text-base font-medium text-gray-800">{feature}</span>
                                </div>
                            ))}

                            {/* Google PageSpeed Scores */}
                            <div className="flex flex-wrap items-center gap-4 mt-6 ml-1 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                {[
                                    { label: "Απόδοση", score: 98, color: "#4ade80" },
                                    { label: "Προσβασιμότητα", score: 93, color: "#4ade80" },
                                    { label: "Best Practices", score: 96, color: "#4ade80" },
                                    { label: "SEO", score: 100, color: "#4ade80" },
                                ].map((item) => (
                                    <div key={item.label} className="flex items-center gap-2">
                                        <div className="relative w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm border border-gray-100">
                                            <span className="text-[11px] font-bold" style={{ color: item.color }}>{item.score}</span>
                                        </div>
                                        <span className="text-xs text-gray-500 font-bold">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 items-center mb-10">
                            <Link
                                href="/estimate"
                                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-[#facc15] text-black font-bold rounded-xl hover:bg-yellow-500 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                            >
                                Θέλω προσφορά Eshop
                            </Link>
                            <Link
                                href="/eshop-demo"
                                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-gray-100 text-black font-bold rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all"
                            >
                                Δείτε Demo
                            </Link>
                        </div>

                        {/* Recent Work Banner */}
                        <div className="p-5 rounded-3xl border border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-center gap-5">
                            <div className="w-full sm:w-28 h-28 flex-shrink-0 rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
                                <img src="/V.png" alt="Vaia Charms Eshop" className="w-full h-full object-cover" loading="lazy" />
                            </div>
                            <div className="flex-1 text-sm text-left">
                                <span className="font-bold text-[#3b5bdb] block mb-2 text-base">Δες το eshop της Βάιας!</span>
                                <span className="text-gray-500 text-sm leading-relaxed block mb-3">Κατασκευασμένο με έμφαση στην ταχύτητα, το SEO και τα χρώματα που ονειρεύτηκε η πελάτισσά μας.</span>
                                <a 
                                    href="https://www.vaiacharms.gr/" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="inline-flex items-center justify-center px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-50 text-black shadow-sm transition-all"
                                >
                                    Δείτε το Project
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative hidden lg:block"
                    >
                        {/* Main Mockup (Desktop) - Stable E-commerce Interface */}
                        <div className="relative rounded-[2rem] border-8 border-gray-100 bg-white shadow-2xl overflow-hidden group">
                            <img
                                src="/desk.png"
                                alt="Modern E-commerce Interface"
                                className="w-full h-auto rounded-xl"
                                width="1200"
                                height="800"
                                loading="lazy"
                            />
                        </div>

                        {/* Secondary Mockup (Mobile) - Stable Mobile View */}
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -bottom-10 -left-12 w-48 rounded-[2.5rem] border-[10px] border-[#111111] bg-black shadow-2xl overflow-hidden z-20"
                        >
                            <img
                                src="/mob.png"
                                alt="Mobile Shopping App"
                                className="w-full h-auto"
                                width="400"
                                height="600"
                                loading="lazy"
                            />
                        </motion.div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default EshopOffer;
