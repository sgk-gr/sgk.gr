import type { Metadata } from "next";
import KMFiberClient from "./KMFiberClient";

export const metadata: Metadata = {
    title: "KM-FIBER Case Study | Σύστημα Διαχείρισης Οπτικών Ινών — SGK Digital",
    description: "Case study: Ολοκληρωμένη πλατφόρμα διαχείρισης οπτικών ινών για partner Cosmote/Vodafone. Καταχώρηση πελατών, live tracking συνεργείων, AI αυτοψίες.",
};

export default function KMFiberPage() {
    return <KMFiberClient />;
}
