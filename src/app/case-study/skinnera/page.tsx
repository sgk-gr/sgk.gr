import type { Metadata } from "next";
import SkinneraClient from "./SkinneraClient";

export const metadata: Metadata = {
    title: "Skinnera IKE Case Study | Mobile App Διαχείρισης Συνεργατών — SGK Digital",
    description: "Case study: Πλατφόρμα διαχείρισης συνεργατών με Flutter mobile app, Firebase, push notifications, σύστημα επιβράβευσης.",
    alternates: {
        canonical: "https://sgk.gr/case-study/skinnera",
    },
    openGraph: {
        title: "Skinnera IKE Case Study | Mobile App Διαχείρισης Συνεργατών — SGK Digital",
        description: "Case study: Πλατφόρμα διαχείρισης συνεργατών με Flutter mobile app, Firebase, push notifications, σύστημα επιβράβευσης.",
        url: "https://sgk.gr/case-study/skinnera",
        type: "article",
        images: ["https://sgk.gr/social-preview.png"],
        siteName: "SGK Software Development",
    },
    twitter: {
        card: "summary_large_image",
        title: "Skinnera IKE Case Study | Mobile App Διαχείρισης Συνεργατών — SGK Digital",
        description: "Case study: Πλατφόρμα διαχείρισης συνεργατών με Flutter mobile app, Firebase, push notifications, σύστημα επιβράβευσης.",
        images: ["https://sgk.gr/social-preview.png"],
    },
};

export default function SkinneraPage() {
    return <SkinneraClient />;
}
