import { Metadata } from "next";
import EvolisClient from "./EvolisClient";

export const metadata: Metadata = {
    title: "EvolisAI Case Study | AI Agents για Tourism & Real Estate — SGK Digital",
    description: "Case study: Πλατφόρμα δημιουργίας AI agents για customer support σε τουρισμό και real estate. Flutter Web, Firebase.",
        keywords: "ai customer support, ai chatbot, tourism ai, real estate ai, ai agents",
alternates: {
        canonical: "https://sgk.gr/case-study/evolis-ai",
    },
    openGraph: {
        title: "EvolisAI Case Study | AI Agents για Tourism & Real Estate — SGK Digital",
        description: "Case study: Πλατφόρμα δημιουργίας AI agents για customer support σε τουρισμό και real estate. Flutter Web, Firebase.",
        url: "https://sgk.gr/case-study/evolis-ai",
        type: "article",
        images: ["https://sgk.gr/social-preview.png"],
        siteName: "SGK Software Development",
    },
    twitter: {
        card: "summary_large_image",
        title: "EvolisAI Case Study | AI Agents για Tourism & Real Estate — SGK Digital",
        description: "Case study: Πλατφόρμα δημιουργίας AI agents για customer support σε τουρισμό και real estate. Flutter Web, Firebase.",
        images: ["https://sgk.gr/social-preview.png"],
    },
};

export default function EvolisPage() {
    return <EvolisClient />;
}
