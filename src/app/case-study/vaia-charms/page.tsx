import type { Metadata } from "next";
import VaiaCharmsClient from "./VaiaCharmsClient";

export const metadata: Metadata = {
    title: "Vaia Charms Case Study | Headless Eshop — SGK Digital",
    description: "Case study: Κατασκευή Headless e-shop νέας γενιάς για exclusive κοσμήματα. Υλοποίηση με custom React frontend και WooCommerce backend.",
};

export default function VaiaCharmsPage() {
    return <VaiaCharmsClient />;
}
