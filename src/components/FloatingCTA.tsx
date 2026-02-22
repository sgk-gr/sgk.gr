import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import { useLocation } from "react-router-dom";

const FloatingCTA = () => {
    const [isVisible, setIsVisible] = useState(false);
    const location = useLocation();
    const isEshopDemo = location.pathname === "/eshop-demo";

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToContact = (e: React.MouseEvent) => {
        e.preventDefault();
        const contactSection = document.getElementById("contact");
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    // Hide on eshop-demo page (it has its own CTA)
    if (isEshopDemo) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: 20 }}
                    className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-[90]"
                >
                    <a
                        href="#contact"
                        onClick={scrollToContact}
                        className="group relative flex items-center gap-3 px-6 py-3.5 bg-primary text-primary-foreground rounded-full shadow-[0_0_20px_rgba(180,255,68,0.3)] hover:scale-105 transition-all duration-300 overflow-hidden"
                    >
                        {/* Glossy Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />

                        <MessageSquare className="w-5 h-5" />
                        <span className="font-heading font-bold text-sm whitespace-nowrap">
                            Πάρε προσφορά σε 24 ώρες
                        </span>
                    </a>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FloatingCTA;
