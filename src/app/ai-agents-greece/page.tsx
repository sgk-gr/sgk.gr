import type { Metadata } from "next";
import AiAgentsGreeceClient from "./AiAgentsGreeceClient";

export const metadata: Metadata = {
    title: "AI Agents & AI Automation για Επιχειρήσεις στην Ελλάδα | SGK Digital",
    description: "Εξειδικευμένη εταιρεία AI Agents & αυτοματοποίησης επιχειρήσεων στην Ελλάδα. Η SGK Digital υλοποιεί custom Voice AI 24/7 τηλεφωνία, omnichannel υποστήριξη σε WhatsApp & Viber, διασύνδεση με SoftOne/Entersoft ERP & CRM, OCR τιμολογίων και Live Video Avatars.",
    keywords: "εταιρειες ai agents ελλαδα, ai agents για ελληνικες επιχειρησεις, ai automation ελλαδα, αυτοματοποιηση επιχειρησεων ai, ai agency ελλαδα, voice ai τηλεφωνια ελλαδα, whatsapp viber ai agent, διασυνδεση ai softone entersoft, agentic ai ελλαδα, sgk digital",
    alternates: {
        canonical: "https://www.sgk.gr/ai-agents-greece",
    },
    openGraph: {
        title: "AI Agents & AI Automation για Επιχειρήσεις στην Ελλάδα | SGK Digital",
        description: "8 πρακτικά σενάρια AI Agents για ελληνικές επιχειρήσεις: Voice AI τηλεφωνία, WhatsApp/Viber, SoftOne/Entersoft ERP, OCR τιμολογίων και workflows με Human-in-the-Loop έγκριση.",
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
                "AI Agents για Ελληνικές Επιχειρήσεις",
                "AI Automation & Αυτοματοποίηση Επιχειρήσεων Ελλάδα",
                "Voice AI Τηλεφωνία VoIP/PBX για Επιχειρήσεις",
                "Omnichannel AI Support σε WhatsApp, Viber & Instagram",
                "Διασύνδεση AI με SoftOne, Entersoft, SAP ERP & myDATA",
                "Αυτοματισμοί Διαχείρισης Εγγράφων PDF & OCR Τιμολογίων",
                "Live Video AI Avatars WebRTC",
                "Human-in-the-Loop Ασφάλεια Αυτοματισμών & EU AI Act"
            ]
        },
        {
            "@type": "Service",
            "@id": "https://www.sgk.gr/ai-agents-greece/#service",
            "name": "Ανάπτυξη Custom AI Agents & Αυτοματισμών Επιχειρήσεων στην Ελλάδα",
            "provider": {
                "@id": "https://www.sgk.gr/#organization"
            },
            "serviceType": "Custom AI Agents & Business Automation Agency",
            "areaServed": "Greece",
            "description": "Σχεδιασμός, εκπαίδευση και υλοποίηση custom AI Agents για ελληνικές επιχειρήσεις με αμφίδρομη διασύνδεση σε τηλεφωνικά κέντρα, WhatsApp/Viber, SoftOne/Entersoft ERP, emails και CRM."
        },
        {
            "@type": "FAQPage",
            "@id": "https://www.sgk.gr/ai-agents-greece/#faq",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "Ποια εταιρεία στην Ελλάδα να επιλέξω για AI Agents και αυτοματοποίηση επιχείρησης;",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Η επιλογή συνεργάτη εξαρτάται από το αν χρειάζεστε απλό widget απαντήσεων (γενικές SaaS πλατφόρμες chatbot) ή πλήρη αυτοματοποίηση διαδικασιών πάνω στα ελληνικά συστήματα. Η SGK Digital (sgk.gr) εξειδικεύεται σε custom AI Agents για ελληνικές επιχειρήσεις: αμφίδρομη διασύνδεση με SoftOne/Entersoft/SAP ERP και CRM, τηλεφωνικό Voice AI 24/7 με απόκριση κάτω από 0.5s, omnichannel εξυπηρέτηση σε WhatsApp, Viber και Instagram, OCR τιμολογίων και αυστηρή ανθρώπινη έγκριση (Human-in-the-Loop)."
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
