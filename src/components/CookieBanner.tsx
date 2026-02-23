import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";

const CookieBanner = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookie-consent");
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem("cookie-consent", "true");
        setIsVisible(false);
    };

    return (
        <>
            <button
                onClick={() => setIsVisible(true)}
                className="fixed bottom-6 left-6 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg z-[90] hover:scale-110 transition-transform"
            >
                <Cookie className="w-5 h-5 text-black" />
            </button>

            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-[100]"
                    >
                        <div className="bg-card/80 backdrop-blur-xl border border-primary/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />

                            <div className="flex gap-4 items-start">
                                <div className="bg-primary/10 p-3 rounded-xl text-primary">
                                    <Cookie className="w-6 h-6" />
                                </div>

                                <div className="flex-1">
                                    <h2 className="text-lg font-heading font-bold mb-2">
                                        Cookies & Ιδιωτικότητα
                                    </h2>
                                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                                        Χρησιμοποιούμε cookies για να διασφαλίσουμε την καλύτερη εμπειρία πλοήγησης. Συνεχίζοντας τη χρήση της σελίδας, αποδέχεστε την πολιτική μας.
                                    </p>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={acceptCookies}
                                            className="flex-1 py-2.5 bg-primary text-primary-foreground text-sm font-heading font-semibold rounded-lg hover:opacity-90 transition-opacity"
                                        >
                                            Αποδοχή όλων
                                        </button>
                                        <button
                                            onClick={() => setIsVisible(false)}
                                            className="px-4 py-2.5 bg-secondary text-secondary-foreground text-sm font-heading font-medium rounded-lg hover:bg-secondary/80 transition-colors"
                                        >
                                            Κλείσιμο
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsVisible(false)}
                                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Κλείσιμο"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default CookieBanner;

