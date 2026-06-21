import { Metadata } from "next";
import KastanidisClient from "./KastanidisClient";

export const metadata: Metadata = {
    title: "ΚΑΒΕ Α.Ε. Καστανίδης Case Study | SGK Digital",
    description: "Κατασκευή καθαρού WordPress & WooCommerce e-shop για την κορυφαία εταιρεία εμπορίας ειδών υγιεινής, πλακιδίων και κουζίνας.",
    alternates: {
        canonical: "https://sgk.gr/case-study/kastanidis",
    },
    openGraph: {
        title: "ΚΑΒΕ Α.Ε. Καστανίδης Case Study | SGK Digital",
        description: "Κατασκευή καθαρού WordPress & WooCommerce e-shop για την κορυφαία εταιρεία εμπορίας ειδών υγιεινής, πλακιδίων και κουζίνας.",
        url: "https://sgk.gr/case-study/kastanidis",
        type: "article",
        images: ["https://sgk.gr/social-preview.png"],
        siteName: "SGK Software Development",
    },
    twitter: {
        card: "summary_large_image",
        title: "ΚΑΒΕ Α.Ε. Καστανίδης Case Study | SGK Digital",
        description: "Κατασκευή καθαρού WordPress & WooCommerce e-shop για την κορυφαία εταιρεία εμπορίας ειδών υγιεινής, πλακιδίων και κουζίνας.",
        images: ["https://sgk.gr/social-preview.png"],
    },
};

export default function KastanidisPage() {
    return <KastanidisClient />;
}
