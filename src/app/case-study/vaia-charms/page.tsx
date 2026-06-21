import type { Metadata } from "next";
import VaiaCharmsClient from "./VaiaCharmsClient";

export const metadata: Metadata = {
    title: "Vaia Charms Case Study | Headless Eshop — SGK Digital",
    description: "Case study: Κατασκευή Headless e-shop νέας γενιάς για exclusive κοσμήματα. Υλοποίηση με custom React frontend και WooCommerce backend.",
    alternates: {
        canonical: "https://sgk.gr/case-study/vaia-charms",
    },
    openGraph: {
        title: "Vaia Charms Case Study | Headless Eshop — SGK Digital",
        description: "Case study: Κατασκευή Headless e-shop νέας γενιάς για exclusive κοσμήματα. Υλοποίηση με custom React frontend και WooCommerce backend.",
        url: "https://sgk.gr/case-study/vaia-charms",
        type: "article",
        images: ["https://sgk.gr/social-preview.png"],
        siteName: "SGK Software Development",
    },
    twitter: {
        card: "summary_large_image",
        title: "Vaia Charms Case Study | Headless Eshop — SGK Digital",
        description: "Case study: Κατασκευή Headless e-shop νέας γενιάς για exclusive κοσμήματα. Υλοποίηση με custom React frontend και WooCommerce backend.",
        images: ["https://sgk.gr/social-preview.png"],
    },
};

export default function VaiaCharmsPage() {
    return <VaiaCharmsClient />;
}
