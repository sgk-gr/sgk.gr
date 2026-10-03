import type { Metadata } from "next";
import GikAccountingClient from "./GikAccountingClient";

export const metadata: Metadata = {
    title: "GIK Accounting IKE Case Study | Λογιστικό Γραφείο & ΓΕΜΗ — SGK Digital",
    description: "Case study: Κατασκευή εταιρικής ιστοσελίδας και πλατφόρμας δημοσιότητας ΓΕΜΗ για την GIK ΦΟΡΟΤΕΧΝΙΚΕΣ ΛΟΓΙΣΤΙΚΕΣ ΥΠΗΡΕΣΙΕΣ Ι.Κ.Ε. στη Λαμία.",
    alternates: {
        canonical: "https://www.sgk.gr/case-study/gikaccounting",
    },
    openGraph: {
        title: "GIK Accounting IKE Case Study | SGK Digital",
        description: "Case study: Εταιρική ιστοσελίδα και πλατφόρμα ΓΕΜΗ για την GIK Accounting από την SGK Digital.",
        url: "https://www.sgk.gr/case-study/gikaccounting",
        type: "article",
        images: ["https://www.sgk.gr/social-preview.png"],
        siteName: "SGK Software Development",
    },
};

export default function GikAccountingPage() {
    return <GikAccountingClient />;
}
