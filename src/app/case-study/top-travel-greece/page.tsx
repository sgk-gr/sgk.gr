import type { Metadata } from "next";
import TopTravelClient from "./TopTravelClient";

export const metadata: Metadata = {
    title: "Top Travel Greece Case Study | Premium Tours & Booking — SGK Digital",
    description: "Case study: Κατασκευή σύγχρονης πλατφόρμας κρατήσεων για το ταξιδιωτικό γραφείο Top Travel Greece στα Χανιά της Κρήτης. Private tours, shared excursions, car rentals.",
};

export default function TopTravelPage() {
    return <TopTravelClient />;
}
