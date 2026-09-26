import type { Metadata } from "next";
import HighTravelClient from "./HighTravelClient";

export const metadata: Metadata = {
    title: "High Travel Case Study | Next.js Frontend & Custom React Διαχειριστικό — SGK Digital",
    description: "Case study: Σύγχρονη ταξιδιωτική πλατφόρμα για την High Travel ΙΚΕ. Υπερταχύτητα με Next.js, φίλτρα προορισμών & custom React διαχειριστικό πάνελ για πακέτα, προσφορές και posters.",
    alternates: {
        canonical: "https://www.sgk.gr/case-study/high-travel",
    },
    openGraph: {
        title: "High Travel Case Study | Next.js Frontend & Custom React Διαχειριστικό — SGK Digital",
        description: "Case study: Σύγχρονη ταξιδιωτική πλατφόρμα για την High Travel ΙΚΕ. Υπερταχύτητα με Next.js, φίλτρα προορισμών & custom React διαχειριστικό πάνελ για πακέτα, προσφορές και posters.",
        url: "https://www.sgk.gr/case-study/high-travel",
        type: "article",
        images: ["https://www.sgk.gr/social-preview.png"],
        siteName: "SGK Software Development",
    },
    twitter: {
        card: "summary_large_image",
        title: "High Travel Case Study | Next.js Frontend & Custom React Διαχειριστικό — SGK Digital",
        description: "Case study: Σύγχρονη ταξιδιωτική πλατφόρμα για την High Travel ΙΚΕ. Υπερταχύτητα με Next.js, φίλτρα προορισμών & custom React διαχειριστικό πάνελ για πακέτα, προσφορές και posters.",
        images: ["https://www.sgk.gr/social-preview.png"],
    },
};

export default function HighTravelPage() {
    return <HighTravelClient />;
}
