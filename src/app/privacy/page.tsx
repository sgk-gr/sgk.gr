import { Metadata } from "next";
import PrivacyClient from "./PrivacyClient";

export const metadata: Metadata = {
    title: "Πολιτική Απορρήτου | SGK Software Development",
    description: "Η πολιτική απορρήτου της SGK Software Development σχετικά με τη συλλογή και χρήση των δεδομένων σας.",
    alternates: {
        canonical: "https://sgk.gr/privacy",
    },
};

export default function PrivacyPage() {
    return <PrivacyClient />;
}
