import { Metadata } from "next";
import SuperAppClient from "./SuperAppClient";

export const metadata: Metadata = {
    title: "Super App Case Study | Προσφορές Σούπερ Μάρκετ Mobile App — SGK Digital",
    description: "Case study: Flutter mobile app που συγκεντρώνει προσφορές από Μασούτη, Σκλαβενίτη, Χαλκιαδάκη, ΑΒ Βασιλόπουλο.",
        keywords: "προσφορές σούπερ μάρκετ, εφαρμογή προσφορών, flutter app, mobile app ελλάδα",
alternates: {
        canonical: "https://sgk.gr/case-study/super-app",
    },
    openGraph: {
        title: "Super App Case Study | Προσφορές Σούπερ Μάρκετ Mobile App — SGK Digital",
        description: "Case study: Flutter mobile app που συγκεντρώνει προσφορές από Μασούτη, Σκλαβενίτη, Χαλκιαδάκη, ΑΒ Βασιλόπουλο.",
        url: "https://sgk.gr/case-study/super-app",
        type: "article",
        images: ["https://sgk.gr/social-preview.png"],
        siteName: "SGK Software Development",
    },
    twitter: {
        card: "summary_large_image",
        title: "Super App Case Study | Προσφορές Σούπερ Μάρκετ Mobile App — SGK Digital",
        description: "Case study: Flutter mobile app που συγκεντρώνει προσφορές από Μασούτη, Σκλαβενίτη, Χαλκιαδάκη, ΑΒ Βασιλόπουλο.",
        images: ["https://sgk.gr/social-preview.png"],
    },
};

export default function SuperAppPage() {
    return <SuperAppClient />;
}
