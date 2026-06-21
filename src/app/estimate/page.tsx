import type { Metadata } from "next";
import EstimateClient from "./EstimateClient";

export const metadata: Metadata = {
    title: "Εκτίμηση Έργου | SGK Software Development",
    description: "Πάρτε μια δωρεάν εκτίμηση για το project σας. Υπολογίστε το κόστος για κατασκευή eshop, ιστοσελίδας ή custom εφαρμογής.",
    alternates: {
        canonical: "https://sgk.gr/estimate",
    },
    openGraph: {
        title: "Εκτίμηση Έργου | SGK Software Development",
        description: "Πάρτε μια δωρεάν εκτίμηση για το project σας. Υπολογίστε το κόστος για κατασκευή eshop, ιστοσελίδας ή custom εφαρμογής.",
        url: "https://sgk.gr/estimate",
        type: "website",
        images: ["https://sgk.gr/social-preview.png"],
        siteName: "SGK Software Development",
    },
    twitter: {
        card: "summary_large_image",
        title: "Εκτίμηση Έργου | SGK Software Development",
        description: "Υπολογίστε δωρεάν το κόστος του project σας για eshop, ιστοσελίδα ή custom software.",
        images: ["https://sgk.gr/social-preview.png"],
    },
};

export default function EstimatePage() {
    return <EstimateClient />;
}
