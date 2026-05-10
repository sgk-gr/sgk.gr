import { Metadata } from "next";
import TermsClient from "./TermsClient";

export const metadata: Metadata = {
    title: "Όροι Χρήσης | SGK Software Development",
    description: "Οι όροι χρήσης των υπηρεσιών και της ιστοσελίδας της SGK Software Development.",
};

export default function TermsPage() {
    return <TermsClient />;
}
