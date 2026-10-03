import type { Metadata } from "next";
import AgiosStefanosClient from "./AgiosStefanosClient";

export const metadata: Metadata = {
    title: "Agios Stefanos Properties IKE Case Study | Real Estate & ΓΕΜΗ — SGK Digital",
    description: "Case study: Κατασκευή εταιρικής ιστοσελίδας και πλατφόρμας δημοσιότητας ΓΕΜΗ για την Agios Stefanos Properties Ι.Κ.Ε. Ανάπτυξη, διαχείριση, εκμίσθωση και αξιοποίηση ακινήτων.",
    alternates: {
        canonical: "https://www.sgk.gr/case-study/agios-stefanos-properties",
    },
    openGraph: {
        title: "Agios Stefanos Properties IKE Case Study | SGK Digital",
        description: "Case study: Εταιρική ιστοσελίδα Real Estate & ΓΕΜΗ για την Agios Stefanos Properties Ι.Κ.Ε. από την SGK Digital.",
        url: "https://www.sgk.gr/case-study/agios-stefanos-properties",
        type: "article",
        images: ["https://www.sgk.gr/social-preview.png"],
        siteName: "SGK Software Development",
    },
};

export default function AgiosStefanosPage() {
    return <AgiosStefanosClient />;
}
