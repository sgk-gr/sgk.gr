import { Metadata } from "next";
import EvolisClient from "./EvolisClient";

export const metadata: Metadata = {
    title: "EvolisAI Case Study | AI Agents για Tourism & Real Estate — SGK Digital",
    description: "Case study: Πλατφόρμα δημιουργίας AI agents για customer support σε τουρισμό και real estate. Flutter Web, Firebase.",
    keywords: "ai customer support, ai chatbot, tourism ai, real estate ai, ai agents",
};

export default function EvolisPage() {
    return <EvolisClient />;
}
