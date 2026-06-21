import { Metadata } from "next";
import LTGClient from "./LTGClient";

export const metadata: Metadata = {
    title: "Live Tour Guide Case Study | Taxi Tours Mobile App — SGK Digital",
    description: "Case study: Flutter mobile app για private taxi tours στην Αθήνα. Real-time tracking, Stripe πληρωμές, push notifications, Firebase.",
        keywords: "taxi tour app, flutter mobile app, live tracking, σύστημα κρατήσεων",
alternates: {
        canonical: "https://sgk.gr/case-study/live-tour-guide",
    },
    openGraph: {
        title: "Live Tour Guide Case Study | Taxi Tours Mobile App — SGK Digital",
        description: "Case study: Flutter mobile app για private taxi tours στην Αθήνα. Real-time tracking, Stripe πληρωμές, push notifications, Firebase.",
        url: "https://sgk.gr/case-study/live-tour-guide",
        type: "article",
        images: ["https://sgk.gr/social-preview.png"],
        siteName: "SGK Software Development",
    },
    twitter: {
        card: "summary_large_image",
        title: "Live Tour Guide Case Study | Taxi Tours Mobile App — SGK Digital",
        description: "Case study: Flutter mobile app για private taxi tours στην Αθήνα. Real-time tracking, Stripe πληρωμές, push notifications, Firebase.",
        images: ["https://sgk.gr/social-preview.png"],
    },
};

export default function LTGPage() {
    return <LTGClient />;
}
