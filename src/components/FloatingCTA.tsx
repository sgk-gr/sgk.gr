"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Phone, MessageSquare } from "lucide-react";

const FloatingCTA = () => {
    const [isVisible, setIsVisible] = useState(false);
    const pathname = usePathname();
    const isExcluded = pathname?.includes("/eshop-demo") || pathname?.includes("/eshop-offer");

    useEffect(() => {
        let ticking = false;
        const toggleVisibility = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (window.scrollY > 300) {
                        setIsVisible(true);
                    } else {
                        setIsVisible(false);
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", toggleVisibility, { passive: true });
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    // Hide on excluded pages
    if (isExcluded) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: 20 }}
                    className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-[90] flex flex-col gap-3 items-end"
                >
                    {/* Call Button */}
                    <a
                        href="tel:6999524389"
                        className="group flex items-center justify-center p-3.5 bg-[#1a1a1a] text-white border border-white/10 rounded-full shadow-xl hover:scale-110 transition-all duration-300"
                        title="Καλέστε μας"
                        aria-label="Καλέστε μας"
                    >
                        <Phone className="w-5 h-5" />
                    </a>

                    {/* Estimate Button */}
                    <Link
                        href="/estimate"
                        className="group relative flex items-center gap-3 px-6 py-3.5 bg-primary text-primary-foreground rounded-full shadow-[0_0_20px_rgba(180,255,68,0.3)] hover:scale-105 transition-all duration-300 overflow-hidden"
                    >
                        {/* Glossy Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />

                        <MessageSquare className="w-4 h-4" />
                        <span className="font-heading font-bold text-sm whitespace-nowrap">
                            Πάρε προσφορά σε 24 ώρες
                        </span>
                    </Link>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FloatingCTA;
