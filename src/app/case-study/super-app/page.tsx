import { Metadata } from "next";
import SuperAppClient from "./SuperAppClient";

export const metadata: Metadata = {
    title: "Super App Case Study | Προσφορές Σούπερ Μάρκετ Mobile App — SGK Digital",
    description: "Case study: Flutter mobile app που συγκεντρώνει προσφορές από Μασούτη, Σκλαβενίτη, Χαλκιαδάκη, ΑΒ Βασιλόπουλο.",
    keywords: "προσφορές σούπερ μάρκετ, εφαρμογή προσφορών, flutter app, mobile app ελλάδα",
};

export default function SuperAppPage() {
    return <SuperAppClient />;
}
