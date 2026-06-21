import type { Metadata } from "next";
import SigmalabsClient from "./SigmalabsClient";

export const metadata: Metadata = {
    title: "Sigmalabs AI Case Study | Agentic AI για E-commerce — SGK Digital",
    description: "Case study: Το πρώτο παγκοσμίως Agentic AI για e-commerce. Διαχείριση WooCommerce & Shopify με AI, αυτόματα analytics, email campaigns.",
    alternates: {
        canonical: "https://sgk.gr/case-study/sigmalabs-ai",
    },
    openGraph: {
        title: "Sigmalabs AI Case Study | Agentic AI για E-commerce — SGK Digital",
        description: "Case study: Το πρώτο παγκοσμίως Agentic AI για e-commerce. Διαχείριση WooCommerce & Shopify με AI, αυτόματα analytics, email campaigns.",
        url: "https://sgk.gr/case-study/sigmalabs-ai",
        type: "article",
        images: ["https://sgk.gr/social-preview.png"],
        siteName: "SGK Software Development",
    },
    twitter: {
        card: "summary_large_image",
        title: "Sigmalabs AI Case Study | Agentic AI για E-commerce — SGK Digital",
        description: "Case study: Το πρώτο παγκοσμίως Agentic AI για e-commerce. Διαχείριση WooCommerce & Shopify με AI, αυτόματα analytics, email campaigns.",
        images: ["https://sgk.gr/social-preview.png"],
    },
};

export default function SigmalabsPage() {
    return <SigmalabsClient />;
}
