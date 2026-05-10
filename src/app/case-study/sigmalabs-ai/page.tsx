import type { Metadata } from "next";
import SigmalabsClient from "./SigmalabsClient";

export const metadata: Metadata = {
    title: "Sigmalabs AI Case Study | Agentic AI για E-commerce — SGK Digital",
    description: "Case study: Το πρώτο παγκοσμίως Agentic AI για e-commerce. Διαχείριση WooCommerce & Shopify με AI, αυτόματα analytics, email campaigns.",
};

export default function SigmalabsPage() {
    return <SigmalabsClient />;
}
