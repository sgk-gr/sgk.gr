import type { Metadata } from "next";
import FarmaTsakalosClient from "./FarmaTsakalosClient";

export const metadata: Metadata = {
    title: "Φάρμα Ευβοίας Τσάκαλος Case Study | Αγροτική Παραγωγή & Web — SGK Digital",
    description: "Case study: Ψηφιακή παρουσία και ιστοσελίδα για την πρότυπη αγροτική μονάδα ΦΑΡΜΑ ΤΣΑΚΑΛΟΣ στην Τριάδα Ψαχνών Ευβοίας. Σύγχρονη καλλιέργεια και χονδρική διάθεση εκλεκτών λαχανικών.",
    alternates: {
        canonical: "https://www.sgk.gr/case-study/farma-tsakalos",
    },
    openGraph: {
        title: "Φάρμα Ευβοίας Τσάκαλος Case Study | SGK Digital",
        description: "Case study: Ψηφιακή παρουσία και ιστοσελίδα για τη Φάρμα Τσάκαλος στην Εύβοια από την SGK Digital.",
        url: "https://www.sgk.gr/case-study/farma-tsakalos",
        type: "article",
        images: ["https://www.sgk.gr/social-preview.png"],
        siteName: "SGK Software Development",
    },
};

export default function FarmaTsakalosPage() {
    return <FarmaTsakalosClient />;
}
