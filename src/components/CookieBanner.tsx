"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { usePathname } from "next/navigation";

const CookieBanner = () => {
    const [isVisible, setIsVisible] = useState(false);
    const pathname = usePathname();
    const isEshopDemo = pathname?.includes("/eshop-demo") || pathname?.includes("/promo");

    useEffect(() => {
        const consent = localStorage.getItem("cookie-consent");
        
        if (consent !== null) {
            if (consent === "true") {
                if (typeof window !== 'undefined' && (window as any).gtag) {
                    (window as any).gtag('consent', 'update', {
                        'ad_storage': 'granted',
                        'ad_user_data': 'granted',
                        'ad_personalization': 'granted',
                        'analytics_storage': 'granted'
                    });
                }
            }
        } else {
            const timer = setTimeout(() => setIsVisible(true), 2500);
            return () => clearTimeout(timer);
        }
    }, [pathname]);

    const acceptCookies = () => {
        localStorage.setItem("cookie-consent", "true");
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('consent', 'update', {
                'ad_storage': 'granted',
                'ad_user_data': 'granted',
                'ad_personalization': 'granted',
                'analytics_storage': 'granted'
            });
            console.log("🍪 [Consent Mode] Consent updated to GRANTED");
        }
        setIsVisible(false);
    };

    const declineCookies = () => {
        localStorage.setItem("cookie-consent", "false");
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('consent', 'update', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'denied'
            });
            console.log("🍪 [Consent Mode] Consent updated to DENIED");
        }
        setIsVisible(false);
    };

    if (isEshopDemo) return null;

    return (
        <>


            <AnimatePresence>
                {isVisible && (
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 50, opacity: 0 }}
                      className="fixed bottom-14 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-[100] no-print"
                    >
                        <div className="bg-[#f4f2ea] border-2 border-black rounded-xl p-5 shadow-2xl relative overflow-hidden text-black">
                            <div className="flex gap-4 items-start">
                                <div className="bg-[#3b5bdb]/10 p-2.5 rounded-lg text-[#3b5bdb] border border-[#3b5bdb]/20 shrink-0">
                                    <Cookie className="w-5 h-5" />
                                </div>

                                <div className="flex-1">
                                    <h2 className="text-base font-bold text-black mb-1 font-sans">
                                        Cookies & Ιδιωτικότητα
                                    </h2>
                                    <p className="text-xs text-gray-700 leading-relaxed mb-4">
                                        Χρησιμοποιούμε cookies για να διασφαλίσουμε την καλύτερη εμπειρία πλοήγησης και ανάλυσης.
                                    </p>

                                    <div className="flex items-center gap-2.5">
                                        <button
                                            onClick={acceptCookies}
                                            className="flex-1 py-2 bg-[#4ade80] hover:bg-[#22c55e] text-black text-xs font-bold rounded-lg border border-black transition-all shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] hover:shadow-none translate-x-[1.5px] translate-y-[1.5px] hover:translate-x-0 hover:translate-y-0"
                                        >
                                            Αποδοχή
                                        </button>
                                        <button
                                            onClick={declineCookies}
                                            className="flex-1 py-2 bg-[#facc15] hover:bg-[#eab308] text-black text-xs font-bold rounded-lg border border-black transition-all shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] hover:shadow-none translate-x-[1.5px] translate-y-[1.5px] hover:translate-x-0 hover:translate-y-0"
                                        >
                                            Απόρριψη
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsVisible(false)}
                                className="absolute top-3 right-3 text-black/60 hover:text-black transition-colors"
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

