import type { Metadata } from "next";
import EstimateClient from "./EstimateClient";

export const metadata: Metadata = {
    title: "Εκτίμηση Έργου | SGK Software Development",
    description: "Πάρτε μια δωρεάν εκτίμηση για το project σας. Υπολογίστε το κόστος για AI agents, ιστοσελίδα ή custom εφαρμογή.",
    alternates: {
        canonical: "https://www.sgk.gr/estimate",
    },
    openGraph: {
        title: "Εκτίμηση Έργου | SGK Software Development",
        description: "Πάρτε μια δωρεάν εκτίμηση για το project σας. Υπολογίστε το κόστος για AI agents, ιστοσελίδα ή custom εφαρμογή.",
        url: "https://www.sgk.gr/estimate",
        type: "website",
        images: ["https://www.sgk.gr/social-preview.png"],
        siteName: "SGK Software Development",
    },
    twitter: {
        card: "summary_large_image",
        title: "Εκτίμηση Έργου | SGK Software Development",
        description: "Υπολογίστε δωρεάν το κόστος του project σας για AI agents, ιστοσελίδα ή custom software.",
        images: ["https://www.sgk.gr/social-preview.png"],
    },
};

export default function EstimatePage() {
    return <EstimateClient />;
}
