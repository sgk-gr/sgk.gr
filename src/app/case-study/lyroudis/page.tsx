import type { Metadata } from "next";
import LyroudisClient from "./LyroudisClient";

export const metadata: Metadata = {
    title: "Lyroudis Consulting Services | ΓΕΜΗ & Εταιρική Ιστοσελίδα ΙΚΕ — SGK Digital",
    description: "Case study: Κατασκευή εταιρικής ιστοσελίδας και ψηφιακής πλατφόρμας δημοσιότητας ΓΕΜΗ / Ισολογισμών για τη LYROUDIS CONSULTING SERVICES ΜΟΝΟΠΡΟΣΩΠΗ Ι.Κ.Ε. Πλήρης συμμόρφωση με Άρθρο 47 §2 Ν. 4072/2012 (ΚΥΑ 46982/2025) & Ν. 4919/2022.",
    alternates: {
        canonical: "https://sgk.gr/case-study/lyroudis",
    },
    openGraph: {
        title: "Lyroudis Consulting Services | ΓΕΜΗ & Εταιρική Ιστοσελίδα ΙΚΕ — SGK Digital",
        description: "Case study: Κατασκευή εταιρικής ιστοσελίδας και ψηφιακής πλατφόρμας δημοσιότητας ΓΕΜΗ / Ισολογισμών για τη LYROUDIS CONSULTING SERVICES ΜΟΝΟΠΡΟΣΩΠΗ Ι.Κ.Ε.",
        url: "https://sgk.gr/case-study/lyroudis",
        type: "article",
        images: ["https://sgk.gr/social-preview.png"],
        siteName: "SGK Software Development",
    },
    twitter: {
        card: "summary_large_image",
        title: "Lyroudis Consulting Services | ΓΕΜΗ & Εταιρική Ιστοσελίδα ΙΚΕ — SGK Digital",
        description: "Case study: Κατασκευή εταιρικής ιστοσελίδας και ψηφιακής πλατφόρμας δημοσιότητας ΓΕΜΗ / Ισολογισμών για τη LYROUDIS CONSULTING SERVICES ΜΟΝΟΠΡΟΣΩΠΗ Ι.Κ.Ε.",
        images: ["https://sgk.gr/social-preview.png"],
    },
};

export default function LyroudisPage() {
    return <LyroudisClient />;
}
