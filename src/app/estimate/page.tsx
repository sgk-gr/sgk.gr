import type { Metadata } from "next";
import EstimateClient from "./EstimateClient";

export const metadata: Metadata = {
    title: "Εκτίμηση Έργου | SGK Software Development",
    description: "Πάρτε μια δωρεάν εκτίμηση για το project σας. Εξειδικευμένες λύσεις software και AI.",
};

export default function EstimatePage() {
    return <EstimateClient />;
}
