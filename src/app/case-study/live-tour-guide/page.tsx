import { Metadata } from "next";
import LTGClient from "./LTGClient";

export const metadata: Metadata = {
    title: "Live Tour Guide Case Study | Taxi Tours Mobile App — SGK Digital",
    description: "Case study: Flutter mobile app για private taxi tours στην Αθήνα. Real-time tracking, Stripe πληρωμές, push notifications, Firebase.",
    keywords: "taxi tour app, flutter mobile app, live tracking, σύστημα κρατήσεων",
};

export default function LTGPage() {
    return <LTGClient />;
}
