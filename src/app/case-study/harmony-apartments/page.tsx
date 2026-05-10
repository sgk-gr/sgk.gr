import { Metadata } from "next";
import HarmonyClient from "./HarmonyClient";

export const metadata: Metadata = {
    title: "Harmony Apartments Case Study | Booking System & Channel Manager — SGK Digital",
    description: "Case study: Ιστοσελίδα και custom booking system με channel manager. Αυτόματος συγχρονισμός Booking.com, Airbnb, VRBO, TripAdvisor.",
    keywords: "booking system, channel manager, σύστημα κρατήσεων, airbnb, booking.com",
};

export default function HarmonyPage() {
    return <HarmonyClient />;
}
