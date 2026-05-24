import type { Metadata } from "next";
import DiadorClient from "./DiadorClient";

export const metadata: Metadata = {
    title: "Diador.eu Case Study | Headless Eshop — SGK Digital",
    description: "Case study: Κατασκευή Headless e-shop νέας γενιάς για ρούχα εργασίας και διαφημιστικά είδη. Υλοποίηση με custom React frontend και WooCommerce backend.",
};

export default function DiadorPage() {
    return <DiadorClient />;
}
