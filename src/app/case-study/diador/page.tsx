import type { Metadata } from "next";
import DiadorClient from "./DiadorClient";

export const metadata: Metadata = {
    title: "Diador.eu Case Study | Headless Eshop — SGK Digital",
    description: "Case study: Κατασκευή Headless e-shop νέας γενιάς για ρούχα εργασίας και διαφημιστικά είδη. Υλοποίηση με custom React frontend και WooCommerce backend.",
    alternates: {
        canonical: "https://sgk.gr/case-study/diador",
    },
    openGraph: {
        title: "Diador.eu Case Study | Headless Eshop — SGK Digital",
        description: "Case study: Κατασκευή Headless e-shop νέας γενιάς για ρούχα εργασίας και διαφημιστικά είδη. Υλοποίηση με custom React frontend και WooCommerce backend.",
        url: "https://sgk.gr/case-study/diador",
        type: "article",
        images: ["https://sgk.gr/social-preview.png"],
        siteName: "SGK Software Development",
    },
    twitter: {
        card: "summary_large_image",
        title: "Diador.eu Case Study | Headless Eshop — SGK Digital",
        description: "Case study: Κατασκευή Headless e-shop νέας γενιάς για ρούχα εργασίας και διαφημιστικά είδη. Υλοποίηση με custom React frontend και WooCommerce backend.",
        images: ["https://sgk.gr/social-preview.png"],
    },
};

export default function DiadorPage() {
    return <DiadorClient />;
}
