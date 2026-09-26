import { Metadata } from "next";
import HarmonyClient from "./HarmonyClient";

export const metadata: Metadata = {
    title: "Harmony Apartments Case Study | Booking System & Channel Manager — SGK Digital",
    description: "Case study: Ιστοσελίδα και custom booking system με channel manager. Αυτόματος συγχρονισμός Booking.com, Airbnb, VRBO, TripAdvisor.",
        keywords: "booking system, channel manager, σύστημα κρατήσεων, airbnb, booking.com",
alternates: {
        canonical: "https://www.sgk.gr/case-study/harmony-apartments",
    },
    openGraph: {
        title: "Harmony Apartments Case Study | Booking System & Channel Manager — SGK Digital",
        description: "Case study: Ιστοσελίδα και custom booking system με channel manager. Αυτόματος συγχρονισμός Booking.com, Airbnb, VRBO, TripAdvisor.",
        url: "https://www.sgk.gr/case-study/harmony-apartments",
        type: "article",
        images: ["https://www.sgk.gr/social-preview.png"],
        siteName: "SGK Software Development",
    },
    twitter: {
        card: "summary_large_image",
        title: "Harmony Apartments Case Study | Booking System & Channel Manager — SGK Digital",
        description: "Case study: Ιστοσελίδα και custom booking system με channel manager. Αυτόματος συγχρονισμός Booking.com, Airbnb, VRBO, TripAdvisor.",
        images: ["https://www.sgk.gr/social-preview.png"],
    },
};

export default function HarmonyPage() {
    return <HarmonyClient />;
}
