import type { Metadata } from "next";
import AlkinoiClient from "./AlkinoiClient";

export const metadata: Metadata = {
    title: "Alkinoi Consulting Case Study | Συμβουλευτική & Εταιρική Ιστοσελίδα — SGK Digital",
    description: "Case study: Σχεδιασμός και υλοποίηση εταιρικής ιστοσελίδας και ψηφιακής παρουσίας για την Alkinoi Consulting. Παρουσίαση υπηρεσιών επιχειρηματικής στρατηγικής, φοροτεχνικών και λογιστικών λύσεων.",
    alternates: {
        canonical: "https://www.sgk.gr/case-study/alkinoi",
    },
    openGraph: {
        title: "Alkinoi Consulting Case Study | SGK Digital",
        description: "Case study: Εταιρική ιστοσελίδα και ψηφιακή παρουσία για την Alkinoi Consulting από την SGK Digital.",
        url: "https://www.sgk.gr/case-study/alkinoi",
        type: "article",
        images: ["https://www.sgk.gr/social-preview.png"],
        siteName: "SGK Software Development",
    },
};

export default function AlkinoiPage() {
    return <AlkinoiClient />;
}
