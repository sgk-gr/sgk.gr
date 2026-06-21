import { Metadata } from "next";
import Yolo8Client from "./Yolo8Client";

export const metadata: Metadata = {
    title: "yolo8 Case Study | Car Rental Booking System & AI Support — SGK Digital",
    description: "Case study: Smart booking system με AI customer support για ενοικιάσεις αυτοκινήτων. React, Stripe πληρωμές, AI agent 24/7.",
        keywords: "car rental booking system, σύστημα κρατήσεων, ενοικίαση αυτοκινήτων, ai customer support",
alternates: {
        canonical: "https://sgk.gr/case-study/yolo8",
    },
    openGraph: {
        title: "yolo8 Case Study | Car Rental Booking System & AI Support — SGK Digital",
        description: "Case study: Smart booking system με AI customer support για ενοικιάσεις αυτοκινήτων. React, Stripe πληρωμές, AI agent 24/7.",
        url: "https://sgk.gr/case-study/yolo8",
        type: "article",
        images: ["https://sgk.gr/social-preview.png"],
        siteName: "SGK Software Development",
    },
    twitter: {
        card: "summary_large_image",
        title: "yolo8 Case Study | Car Rental Booking System & AI Support — SGK Digital",
        description: "Case study: Smart booking system με AI customer support για ενοικιάσεις αυτοκινήτων. React, Stripe πληρωμές, AI agent 24/7.",
        images: ["https://sgk.gr/social-preview.png"],
    },
};

export default function Yolo8Page() {
    return <Yolo8Client />;
}
