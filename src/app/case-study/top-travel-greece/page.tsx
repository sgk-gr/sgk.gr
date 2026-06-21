import type { Metadata } from "next";
import TopTravelClient from "./TopTravelClient";

export const metadata: Metadata = {
    title: "Top Travel Greece Case Study | Premium Tours & Booking — SGK Digital",
    description: "Case study: Κατασκευή σύγχρονης πλατφόρμας κρατήσεων για το ταξιδιωτικό γραφείο Top Travel Greece στα Χανιά της Κρήτης. Private tours, shared excursions, car rentals.",
    alternates: {
        canonical: "https://sgk.gr/case-study/top-travel-greece",
    },
    openGraph: {
        title: "Top Travel Greece Case Study | Premium Tours & Booking — SGK Digital",
        description: "Case study: Κατασκευή σύγχρονης πλατφόρμας κρατήσεων για το ταξιδιωτικό γραφείο Top Travel Greece στα Χανιά της Κρήτης. Private tours, shared excursions, car rentals.",
        url: "https://sgk.gr/case-study/top-travel-greece",
        type: "article",
        images: ["https://sgk.gr/social-preview.png"],
        siteName: "SGK Software Development",
    },
    twitter: {
        card: "summary_large_image",
        title: "Top Travel Greece Case Study | Premium Tours & Booking — SGK Digital",
        description: "Case study: Κατασκευή σύγχρονης πλατφόρμας κρατήσεων για το ταξιδιωτικό γραφείο Top Travel Greece στα Χανιά της Κρήτης. Private tours, shared excursions, car rentals.",
        images: ["https://sgk.gr/social-preview.png"],
    },
};

export default function TopTravelPage() {
    return <TopTravelClient />;
}
