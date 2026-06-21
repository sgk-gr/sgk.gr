import { Metadata } from "next";
import LemonTreeClient from "./LemonTreeClient";

export const metadata: Metadata = {
    title: "Lemon tree 1 Paros Case Study | Booking System — SGK Digital",
    description: "Case study: Κατασκευή custom ιστοσελίδας και συστήματος κρατήσεων για ενοικιαζόμενα studios & apartments στην Πάρο (Κυκλάδες).",
        keywords: "booking system, σύστημα κρατήσεων, airbnb, paros, lemon tree 1",
alternates: {
        canonical: "https://sgk.gr/case-study/lemon-tree-paros",
    },
    openGraph: {
        title: "Lemon tree 1 Paros Case Study | Booking System — SGK Digital",
        description: "Case study: Κατασκευή custom ιστοσελίδας και συστήματος κρατήσεων για ενοικιαζόμενα studios & apartments στην Πάρο (Κυκλάδες).",
        url: "https://sgk.gr/case-study/lemon-tree-paros",
        type: "article",
        images: ["https://sgk.gr/social-preview.png"],
        siteName: "SGK Software Development",
    },
    twitter: {
        card: "summary_large_image",
        title: "Lemon tree 1 Paros Case Study | Booking System — SGK Digital",
        description: "Case study: Κατασκευή custom ιστοσελίδας και συστήματος κρατήσεων για ενοικιαζόμενα studios & apartments στην Πάρο (Κυκλάδες).",
        images: ["https://sgk.gr/social-preview.png"],
    },
};

export default function LemonTreePage() {
    return <LemonTreeClient />;
}
