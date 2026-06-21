import { Metadata } from "next";
import EshopDemoClient from "./EshopDemoClient";

export const metadata: Metadata = {
    title: "Eshop Demo | Fashion Store — SGK Software Development",
    description: "Δείτε ένα demo eshop υψηλών προδιαγραφών από την SGK Software Development. AI λειτουργίες, ταχύτατο checkout και premium aesthetics.",
    alternates: {
        canonical: "https://sgk.gr/eshop-demo",
    },
    openGraph: {
        title: "Eshop Demo | Fashion Store — SGK Software Development",
        description: "Δείτε ένα demo eshop υψηλών προδιαγραφών από την SGK Software Development. AI λειτουργίες, ταχύτατο checkout και premium aesthetics.",
        url: "https://sgk.gr/eshop-demo",
        type: "website",
        images: ["https://sgk.gr/social-preview.png"],
        siteName: "SGK Software Development",
    },
    twitter: {
        card: "summary_large_image",
        title: "Eshop Demo | Fashion Store — SGK Software Development",
        description: "Δείτε ένα demo eshop υψηλών προδιαγραφών από την SGK Software Development. AI λειτουργίες, ταχύτατο checkout.",
        images: ["https://sgk.gr/social-preview.png"],
    },
};

export default function EshopDemoPage() {
    return <EshopDemoClient />;
}
