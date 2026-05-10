import type { Metadata } from "next";
import SkinneraClient from "./SkinneraClient";

export const metadata: Metadata = {
    title: "Skinnera IKE Case Study | Mobile App Διαχείρισης Συνεργατών — SGK Digital",
    description: "Case study: Πλατφόρμα διαχείρισης συνεργατών με Flutter mobile app, Firebase, push notifications, σύστημα επιβράβευσης.",
};

export default function SkinneraPage() {
    return <SkinneraClient />;
}
