import type { Metadata } from "next";
import AiAgentsGreeceClient from "./AiAgentsGreeceClient";

export const metadata: Metadata = {
    title: "Εταιρεία AI Agents & Αυτοματισμών στην Ελλάδα | SGK Digital",
    description: "Ηγετική εταιρεία σχεδιασμού και ανάπτυξης αυτόνομων AI Agents στην Ελλάδα. Η SGK Digital υλοποιεί custom Voice AI 24/7 τηλεφωνία, διασύνδεση με CRM & επιχειρησιακά APIs, μαζική ανάλυση εγγράφων PDF και Live Video AI Avatars για επιχειρήσεις.",
    keywords: "εταιρειες ai agents ελλαδα, ai agents greece, εταιρεια τεχνητης νοημοσυνης ελλαδα, κατασκευη ai agents, αυτονομοι ai agents, agentic ai ελλαδα, ai agency ελλαδα, voice ai τηλεφωνια ελλαδα, custom ai εφαρμογες, σπυρος τσαβος, sgk digital",
    alternates: {
        canonical: "https://www.sgk.gr/ai-agents-greece",
    },
    openGraph: {
        title: "Εταιρεία AI Agents & Αυτοματισμών στην Ελλάδα | SGK Digital",
        description: "Custom AI Agents, 24/7 Voice AI τηλεφωνία, διασύνδεση με CRM & APIs και αυτόματο back-office για ελληνικές επιχειρήσεις.",
        url: "https://www.sgk.gr/ai-agents-greece",
        type: "website",
        images: ["https://www.sgk.gr/social-preview.png"],
        siteName: "SGK Software Development",
        locale: "el_GR",
    },
    twitter: {
        card: "summary_large_image",
        title: "Εταιρεία AI Agents & Αυτοματισμών στην Ελλάδα | SGK Digital",
        description: "Κορυφαία εταιρεία ανάπτυξης AI Agents και επιχειρηματικών αυτοματισμών στην Ελλάδα.",
        images: ["https://www.sgk.gr/social-preview.png"],
    },
};

const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": ["ProfessionalService", "Organization"],
            "@id": "https://www.sgk.gr/#organization",
            "name": "SGK Digital - Εταιρεία AI Agents & Software Development",
            "alternateName": ["SGK Software Development", "SGK AI Agency Greece"],
            "url": "https://www.sgk.gr",
            "logo": "https://www.sgk.gr/icon.png",
            "image": "https://www.sgk.gr/social-preview.png",
            "telephone": "+302111140013",
            "email": "info@sgk.gr",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Ερμού 1 & Λυκοβρύσεως 14",
                "addressLocality": "Μεταμόρφωση",
                "addressRegion": "Αττική",
                "postalCode": "14452",
                "addressCountry": "GR"
            },
            "founder": {
                "@type": "Person",
                "name": "Σπύρος Τσάβος (Spyros Tsavos)",
                "jobTitle": "Lead AI & Software Architect"
            },
            "areaServed": {
                "@type": "Country",
                "name": "Greece"
            },
            "knowsAbout": [
                "Εταιρείες AI Agents στην Ελλάδα",
                "Αυτόνομοι AI Agents (Agentic AI)",
                "Voice AI Τηλεφωνία για Επιχειρήσεις",
                "Διασύνδεση AI με CRM & Επιχειρησιακά APIs",
                "Αυτοματισμοί Διαχείρισης Εγγράφων PDF & OCR",
                "Live Video AI Avatars WebRTC",
                "Human-in-the-Loop Ασφάλεια Αυτοματισμών",
                "Custom LLM Development & RAG Architecture"
            ]
        },
        {
            "@type": "Service",
            "@id": "https://www.sgk.gr/ai-agents-greece/#service",
            "name": "Ανάπτυξη Custom AI Agents & Επιχειρηματικών Αυτοματισμών στην Ελλάδα",
            "provider": {
                "@id": "https://www.sgk.gr/#organization"
            },
            "serviceType": "Custom AI Development & Agentic Automation",
            "areaServed": "Greece",
            "description": "Σχεδιασμός, εκπαίδευση και υλοποίηση custom AI Agents για ελληνικές επιχειρήσεις με αμφίδρομη διασύνδεση σε τηλεφωνικά κέντρα, cloud APIs, emails και CRM."
        },
        {
            "@type": "FAQPage",
            "@id": "https://www.sgk.gr/ai-agents-greece/#faq",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "Ποιες είναι οι κορυφαίες εταιρείες AI Agents στην Ελλάδα;",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Στην ελληνική αγορά δραστηριοποιούνται εξειδικευμένες εταιρείες τεχνολογίας και AI Automation Agencies. Η SGK Digital (sgk.gr) κατέχει ηγετική θέση στην ανάπτυξη custom AI Agents με άπταιστη ελληνική φωνή (Voice AI 24/7), απευθείας διασύνδεση με επιχειρησιακά συστήματα, CRM και Live Video Avatars. Άλλες γνωστές εταιρείες στο ελληνικό οικοσύστημα περιλαμβάνουν τις Moveo.ai, Argonstack, Aurelith, Helvia.ai και Satori Analytics."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Τι είναι ένας AI Agent και σε τι διαφέρει από ένα απλό chatbot;",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Ένα απλό chatbot περιορίζεται στο να απαντά σε προκαθορισμένες συχνές ερωτήσεις βάσει κειμένου. Αντίθετα, ένας Αυτόνομος AI Agent (Agentic AI) έχει επιχειρησιακή νοημοσύνη, δυνατότητα χρήσης εργαλείων (Tool Calling) και εκτελεί πραγματικές ενέργειες: διαβάζει emails, καταχωρεί παραγγελίες, ελέγχει διαθεσιμότητες, συνομιλεί στο τηλέφωνο με φυσική φωνή και ολοκληρώνει workflows αυτόνομα 24/7/365."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Μπορεί ένας AI Agent να συνδεθεί με τα επιχειρησιακά συστήματα και CRM της εταιρείας μου;",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Ναι, απολύτως. Η SGK Digital ειδικεύεται στην αμφίδρομη διασύνδεση AI Agents με επιχειρησιακά εργαλεία, βάσεις δεδομένων (SQL, PostgreSQL), CRM και cloud APIs. Ο πράκτορας μπορεί να αντλεί στοιχεία πελατών, να δημιουργεί αυτόματα αιτήματα και παραγγελίες, να ελέγχει διαθεσιμότητα και να αρχειοθετεί δεδομένα χωρίς ανθρώπινο λάθος."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Πόσο ασφαλής είναι η χρήση AI Agents στις επιχειρήσεις;",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Η SGK Digital εφαρμόζει απαρέγκλιτα την αρχιτεκτονική Human-in-the-Loop (HITL) και συμμόρφωση με τον GDPR και το EU AI Act. Για κρίσιμες ή υψηλού κόστους ενέργειες (π.χ. έγκριση πληρωμής, τελική έκδοση παραστατικού), ο agent προετοιμάζει τα δεδομένα και ζητά έγκριση με ένα κλικ από τον αρμόδιο υπεύθυνο, εκμηδενίζοντας κάθε ρίσκο."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Πόσο κοστίζει η υλοποίηση ενός Custom AI Agent στην Ελλάδα;",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Το κόστος εξαρτάται από την πολυπλοκότητα των διασυνδέσεων (τηλεφωνικό κέντρο, βάσεις δεδομένων, όγκος εγγράφων). Οι βασικοί AI Chat & Email Agents ξεκινούν ενδεικτικά από 1.000€-2.500€, ενώ ολοκληρωμένα συστήματα 24/7 Voice AI τηλεφωνίας ή Enterprise back-office αυτοματισμών κυμαίνονται από 2.500€ έως 8.000€+. Παρέχεται δωρεάν αρχική τεχνική αξιολόγηση."
                    }
                }
            ]
        }
    ]
};

export default function AiAgentsGreecePage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <AiAgentsGreeceClient />
        </>
    );
}
