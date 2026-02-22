import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        // Αν δεν έχουμε hash (δηλαδή δεν είναι anchor link), κάνουμε scroll στην κορυφή
        if (!hash) {
            window.scrollTo(0, 0);
        } else {
            // Αν έχουμε hash, περιμένουμε λίγο να φορτώσει το DOM και κάνουμε scroll στο στοιχείο
            setTimeout(() => {
                const id = hash.replace("#", "");
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                }
            }, 100);
        }
    }, [pathname, hash]);

    return null;
};

export default ScrollToTop;
