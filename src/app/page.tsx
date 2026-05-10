import type { Metadata } from "next";
import IndexClient from "./IndexClient";

export const metadata: Metadata = {
    title: "SGK Software Development | Κατασκευή Eshop, Web Development, AI Agents Ελλάδα",
    description: "SGK Software Development — 18 χρόνια εμπειρίας. Κατασκευή Eshop WooCommerce, custom web εφαρμογές, AI agents για επιχειρήσεις. Αθήνα, Ελλάδα.",
    alternates: { canonical: "https://sgk.gr/" },
};

export default function Home() {
    return <IndexClient />;
}
