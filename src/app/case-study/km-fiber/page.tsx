import type { Metadata } from "next";
import KMFiberClient from "./KMFiberClient";

export const metadata: Metadata = {
    title: "KM-FIBER Case Study | Σύστημα Διαχείρισης Οπτικών Ινών — SGK Digital",
    description: "Case study: Ολοκληρωμένη πλατφόρμα διαχείρισης οπτικών ινών για partner Cosmote/Vodafone. Καταχώρηση πελατών, live tracking συνεργείων, AI αυτοψίες.",
    alternates: {
        canonical: "https://sgk.gr/case-study/km-fiber",
    },
    openGraph: {
        title: "KM-FIBER Case Study | Σύστημα Διαχείρισης Οπτικών Ινών — SGK Digital",
        description: "Case study: Ολοκληρωμένη πλατφόρμα διαχείρισης οπτικών ινών για partner Cosmote/Vodafone. Καταχώρηση πελατών, live tracking συνεργείων, AI αυτοψίες.",
        url: "https://sgk.gr/case-study/km-fiber",
        type: "article",
        images: ["https://sgk.gr/social-preview.png"],
        siteName: "SGK Software Development",
    },
    twitter: {
        card: "summary_large_image",
        title: "KM-FIBER Case Study | Σύστημα Διαχείρισης Οπτικών Ινών — SGK Digital",
        description: "Case study: Ολοκληρωμένη πλατφόρμα διαχείρισης οπτικών ινών για partner Cosmote/Vodafone. Καταχώρηση πελατών, live tracking συνεργείων, AI αυτοψίες.",
        images: ["https://sgk.gr/social-preview.png"],
    },
};

export default function KMFiberPage() {
    return <KMFiberClient />;
}
