import type { Metadata } from "next";
import ThinkLocalizationClient from "./ThinkLocalizationClient";

export const metadata: Metadata = {
    title: "Think Localization IKE Case Study | Μετάφραση & ΓΕΜΗ — SGK Digital",
    description: "Case study: Κατασκευή εταιρικής ιστοσελίδας και πλατφόρμας δημοσιότητας ΓΕΜΗ για την Think Localization Ι.Κ.Ε. Εξειδικευμένες υπηρεσίες μετάφρασης και τοπικοποίησης για διεθνή brands.",
    alternates: {
        canonical: "https://www.sgk.gr/case-study/think-localization",
    },
    openGraph: {
        title: "Think Localization IKE Case Study | SGK Digital",
        description: "Case study: Εταιρική ιστοσελίδα και πλατφόρμα ΓΕΜΗ για την Think Localization Ι.Κ.Ε. από την SGK Digital.",
        url: "https://www.sgk.gr/case-study/think-localization",
        type: "article",
        images: ["https://www.sgk.gr/social-preview.png"],
        siteName: "SGK Software Development",
    },
};

export default function ThinkLocalizationPage() {
    return <ThinkLocalizationClient />;
}
