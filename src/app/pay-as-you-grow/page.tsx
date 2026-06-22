import type { Metadata } from "next";
import PayAsYouGrowClient from "@/components/PayAsYouGrowClient";

export const metadata: Metadata = {
    title: "SGK Pay as you grow | Κατασκευή Eshop με Ποσοστό",
    description: "Ξεκινήστε το Eshop σας με προκαταβολή 600€ και το υπόλοιπο με 5% προμήθεια επί των πωλήσεων για 1 έτος. Μάθετε περισσότερα.",
    alternates: {
        canonical: "https://sgk.gr/pay-as-you-grow",
    },
    openGraph: {
        title: "SGK Pay as you grow | Κατασκευή Eshop με Ποσοστό",
        description: "Ξεκινήστε το Eshop σας με προκαταβολή 600€ και το υπόλοιπο με 5% προμήθεια επί των πωλήσεων για 1 έτος.",
        url: "https://sgk.gr/pay-as-you-grow",
        type: "website",
        images: ["https://sgk.gr/social-preview.png"],
        siteName: "SGK Software Development",
    },
    twitter: {
        card: "summary_large_image",
        title: "SGK Pay as you grow | Κατασκευή Eshop με Ποσοστό",
        description: "Ξεκινήστε το Eshop σας με προκαταβολή 600€ και το υπόλοιπο με 5% προμήθεια επί των πωλήσεων για 1 έτος.",
        images: ["https://sgk.gr/social-preview.png"],
    },
};

export default function PayAsYouGrowPage() {
    return <PayAsYouGrowClient />;
}
