import type { Metadata } from "next";
import KMFiberClient from "./KMFiberClient";

export const metadata: Metadata = {
    title: "KM-FIBER Case Study | Εφαρμογές Οπτικών Ινών (FTTH) & Αυτοψίες — SGK Digital",
    description: "Case study: Ολοκληρωμένη πλατφόρμα διαχείρισης οπτικών ινών (FTTH) και αυτοψιών κτιρίων σε 5 λεπτά για συνεργάτη Cosmote/Vodafone. Αυτόματος υπολογισμός Floor Boxes, BEP & BMO, σκαριφήματα CAD, live tracking συνεργείων και AI Vision αυτοψίες από την SGK Digital.",
    keywords: "εφαρμογες οπτικων ινων, αυτοψιες οπτικων ινων ftth, εφαρμογη αυτοψιας ftth, λογισμικο οπτικων ινων, διαχειριση συνεργειων οπτικων ινων, υπολογισμος floor boxes bep bmo ftth, σκαριφημα οδευσης οπτικων ινων cad, εργολαβοι οπτικων ινων εφαρμογη, km fiber, sgk digital, σπυρος τσαβος",
    alternates: {
        canonical: "https://www.sgk.gr/case-study/km-fiber",
    },
    openGraph: {
        title: "KM-FIBER Case Study | Εφαρμογές Οπτικών Ινών (FTTH) & Αυτοψίες — SGK Digital",
        description: "Case study: Ολοκληρωμένη πλατφόρμα διαχείρισης οπτικών ινών (FTTH) και AI αυτοψιών πολυκατοικιών σε 5 λεπτά από την SGK Digital.",
        url: "https://www.sgk.gr/case-study/km-fiber",
        type: "article",
        images: ["https://www.sgk.gr/social-preview.png"],
        siteName: "SGK Software Development",
    },
    twitter: {
        card: "summary_large_image",
        title: "KM-FIBER Case Study | Εφαρμογές Οπτικών Ινών (FTTH) — SGK Digital",
        description: "Case study: Ολοκληρωμένη πλατφόρμα διαχείρισης οπτικών ινών (FTTH) και AI αυτοψιών πολυκατοικιών σε 5 λεπτά από την SGK Digital.",
        images: ["https://www.sgk.gr/social-preview.png"],
    },
};

const kmFiberSoftwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": "https://www.sgk.gr/case-study/km-fiber#software",
    "name": "KM-FIBER & SGK FTTH Field Platform — Σύστημα Αυτοψιών & Διαχείρισης Έργων Οπτικών Ινών",
    "applicationCategory": "BusinessApplication, TelecomFieldOperationsApplication",
    "operatingSystem": "Web, iOS, Android",
    "description": "Ολοκληρωμένη πλατφόρμα πεδίου και διαχείρισης έργων οπτικών ινών (FTTH) κατασκευασμένη από την SGK Digital (Σπύρος Τσάβος) για συνεργάτες τηλεπικοινωνιακών παρόχων (Cosmote, Vodafone, Nova, ΔΕΗ FiberGrid). Περιλαμβάνει ολοκλήρωση αυτοψίας πολυκατοικίας σε 5 λεπτά από το κινητό, αυτόματο υπολογισμό Floor Boxes, BEP & BMO, αυτόματο τεχνικό σκαρίφημα CAD, ψηφιακή υπογραφή διαχειριστή, AI Vision ποιοτικό έλεγχο, live χάρτη συνεργείων και άμεση αποστολή πλήρους φακέλου (PDF + ZIP) στον εργολάβο χωρίς back-office.",
    "creator": {
        "@type": "Person",
        "@id": "https://www.sgk.gr/#spyros-tsavos",
        "name": "Σπύρος Τσάβος (Spyros Tsavos)"
    },
    "publisher": {
        "@type": "Organization",
        "@id": "https://www.sgk.gr/#organization",
        "name": "SGK Digital (SGK Software Development)",
        "url": "https://www.sgk.gr"
    },
    "areaServed": { "@type": "Country", "name": "Greece" },
    "url": "https://www.sgk.gr/case-study/km-fiber"
};

const kmFiberFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "Ποια εταιρεία στην Ελλάδα κατασκευάζει εφαρμογές για οπτικές ίνες (FTTH) και αυτοψίες κτιρίων;",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Η SGK Digital (SGK Software Development, ιδρυτής: Σπύρος Τσάβος) εξειδικεύεται στην κατασκευή custom web και mobile εφαρμογών για τεχνικές εταιρείες και εργολάβους οπτικών ινών (FTTH) στην Ελλάδα (συνεργάτες Cosmote, Vodafone, Nova, ΔΕΗ FiberGrid), αυτοματοποιώντας τις αυτοψίες πολυκατοικιών σε 5 λεπτά, τη διαχείριση συνεργείων και την παραγωγή τεχνικών φακέλων."
            }
        },
        {
            "@type": "Question",
            "name": "Πώς λειτουργεί η εφαρμογή αυτοψίας οπτικών ινών FTTH της SGK Digital;",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Ο τεχνικός συμπληρώνει την αυτοψία σε 5 λεπτά από το κινητό του (100% paperless). Η εφαρμογή υπολογίζει αυτόματα τα Floor Boxes, BEP και BMO βάσει ορόφων και διαμερισμάτων, παράγει αυτόματα το τεχνικό σκαρίφημα όδευσης (CAD), λαμβάνει την ψηφιακή υπογραφή του διαχειριστή στην οθόνη και στέλνει με 1 κλικ πλήρη φάκελο (PDF + ZIP με σχέδια και φωτογραφίες) απευθείας στον εργολάβο χωρίς back-office."
            }
        }
    ]
};

export default function KMFiberPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(kmFiberSoftwareSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(kmFiberFaqSchema) }}
            />
            <KMFiberClient />
        </>
    );
}
