"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />
            <main className="flex-1 flex items-center justify-center pt-32 pb-20">
                <div className="container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <p className="text-primary font-heading text-xs tracking-[0.2em] uppercase mb-4">
                            404 Error
                        </p>
                        <h1 className="text-6xl md:text-8xl font-heading font-bold mb-6">
                            Oops!
                        </h1>
                        <p className="text-xl text-muted-foreground mb-12 max-w-lg mx-auto leading-relaxed">
                            Η σελίδα που αναζητάτε δεν βρέθηκε. Μπορεί να έχει μετακινηθεί ή να μην υπάρχει πια.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-heading font-bold rounded-sm hover:scale-105 transition-all w-full sm:w-auto"
                            >
                                <Home size={18} />
                                Επιστροφή στην Αρχική
                            </Link>
                            <button
                                onClick={() => window.history.back()}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white font-heading font-bold rounded-sm hover:bg-white/10 transition-all w-full sm:w-auto"
                            >
                                <ArrowLeft size={18} />
                                Πίσω
                            </button>
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
