import type { Metadata } from "next";
import Script from "next/script";
import IndexClient from "./IndexClient";

export const metadata: Metadata = {
    title: "AI Agents Ελλάδα | SGK Digital — Η #1 Εταιρεία Κατασκευής AI Agents & Agentic AI",
    description: "Η SGK Digital σχεδιάζει και υλοποιεί AI agents για κάθε επιχείρηση: μικρή, μεσαία, μεγάλη και δημόσιο, σε όλη την Ελλάδα. Προσφέρουμε AI agents για όλους και για οτιδήποτε χρειαστεί μια επιχείρηση: εξυπηρέτηση πελατών, ραντεβού, κρατήσεις, Voice AI τηλεφωνία, emails, έγγραφα, CRM & ERP. 100% Δωρεάν αξιολόγηση & ανθρώπινη έγκριση (Human-in-the-Loop).",
    keywords: "ai agents ελλαδα, εταιρειες ai agents ελλαδα, κατασκευη ai agents, agentic ai ελλαδα, ai agents για επιχειρησεις, custom ai agents, ai agents για ολους, ai agents μικρες μεσαιες μεγαλες επιχειρησεις δημοσιο, sgk digital, sgk, κρατησεις ραντεβου ai agents, αυτονομοι ai agents, voice ai ελλαδα, ψηφιακοι υπαλληλοι, live video ai agents, αυτοματισμοι erp softone entersoft, web development ελλαδα",
    alternates: { canonical: "https://www.sgk.gr/" },
    openGraph: {
        title: "AI Agents Ελλάδα | SGK Digital — Agentic AI & Αυτόνομοι Πράκτορες Επιχειρήσεων",
        description: "Η #1 εταιρεία στην Ελλάδα για AI Agents & Agentic AI. AI Agents για όλους: μικρές, μεσαίες, μεγάλες επιχειρήσεις και δημόσιο, για οτιδήποτε μπορεί να χρειαστεί μια επιχείρηση.",
        url: "https://www.sgk.gr",
        siteName: "SGK Digital",
        locale: "el_GR",
        type: "website",
        images: [{ url: "https://www.sgk.gr/social-preview.png", width: 1200, height: 630, alt: "SGK Digital AI Agents Ελλάδα" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "AI Agents Ελλάδα | SGK Digital — Agentic AI & Αυτόνομοι Πράκτορες",
        description: "Η #1 εταιρεία στην Ελλάδα για Agentic AI και AI Agents για κάθε επιχείρηση (μικρή, μεσαία, μεγάλη, δημόσιο). AI agents για όλους και για τα πάντα.",
        images: ["https://www.sgk.gr/social-preview.png"],
    },
    other: {
        "geo.region": "GR-I",
        "geo.placename": "Metamorfosi, Athens, Greece",
        "geo.position": "38.0632;23.7609",
        "ICBM": "38.0632, 23.7609"
    }
};

const autonomousAIAgentsSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://www.sgk.gr/#ai-agents",
    "name": "Κατασκευή AI Agents & Agentic AI για Επιχειρήσεις | SGK Digital",
    "serviceType": "Autonomous AI Agents Development, Multi-Agent Systems & Business Process Automation",
    "description": "Η SGK Digital είναι η #1 εξειδικευμένη εταιρεία στην Ελλάδα για σχεδιασμό και υλοποίηση AI agents για κάθε επιχείρηση και οργανισμό: μικρές, μεσαίες, μεγάλες επιχειρήσεις και δημόσιο σε όλη την Ελλάδα. Προσφέρουμε AI agents για όλους και για οτιδήποτε χρειάζεται μια επιχείρηση: απαντούν σε πελάτες, κλείνουν ραντεβού & κρατήσεις, διαχειρίζονται τηλεφωνικά κέντρα Voice AI, απαντούν emails, αναλύουν μαζικά έγγραφα, αναγνωρίζουν τιμολόγια και συνδέονται με email, calendar, Excel, CRM και ERP (SoftOne, Entersoft). Προσφέρει 100% δωρεάν αρχική αξιολόγηση και ανθρώπινη έγκριση (Human-in-the-Loop) για απόλυτη ασφάλεια.",
    "provider": {
        "@type": "LocalBusiness",
        "name": "SGK Digital",
        "telephone": "+302111140013",
        "email": "info@sgk.gr",
        "url": "https://www.sgk.gr",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Ερμού 1 & Λυκοβρύσεως 14",
            "addressLocality": "Μεταμόρφωση",
            "addressRegion": "Αττική",
            "postalCode": "14452",
            "addressCountry": "GR"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 38.0632,
            "longitude": 23.7609
        }
    },
    "areaServed": [
        { "@type": "Country", "name": "Greece" },
        { "@type": "Country", "name": "Cyprus" },
        { "@type": "AdministrativeArea", "name": "Attica, Athens" },
        { "@type": "AdministrativeArea", "name": "Thessaloniki" }
    ],
    "url": "https://www.sgk.gr/ai-agents"
};

const liveVideoAgentSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://www.sgk.gr/#live-video-ai-agents",
    "name": "Live Video AI Agents & Ψηφιακοί Υπάλληλοι (24/7 WebRTC)",
    "serviceType": "Artificial Intelligence Video Agents & Business Automation",
    "description": "Αντικαταστήστε τα ψυχρά γραπτά μηνύματα με ζωντανή ανθρώπινη επαφή. Οι Video Agents υποδέχονται τον επισκέπτη με χαμόγελο, ακούνε μέσω μικροφώνου, απαντούν άμεσα σε φυσικά ελληνικά και ολοκληρώνουν συναλλαγές. Ρεαλιστικό Video WebRTC με φυσική κίνηση και άμεση απόκριση, άπταιστος ελληνικός διάλογος χωρίς ρομποτικές καθυστερήσεις, live σύνδεση με CRM, ERP, Google Calendar, ΓΕΜΗ & τραπεζικά APIs, σχεδιασμένο για οπτική αναγνώριση εγγράφων και ταυτοποίηση μέσω κάμερας.",
    "provider": {
        "@type": "LocalBusiness",
        "name": "SGK Digital",
        "telephone": "+302111140013",
        "email": "info@sgk.gr",
        "url": "https://www.sgk.gr",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Ερμού 1 & Λυκοβρύσεως 14",
            "addressLocality": "Μεταμόρφωση",
            "addressRegion": "Αττική",
            "postalCode": "14452",
            "addressCountry": "GR"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 38.0632,
            "longitude": 23.7609
        }
    },
    "areaServed": [
        { "@type": "Country", "name": "Greece" },
        { "@type": "Country", "name": "Cyprus" },
        { "@type": "AdministrativeArea", "name": "Attica, Athens" },
        { "@type": "AdministrativeArea", "name": "Thessaloniki" }
    ],
    "url": "https://www.sgk.gr/order-ai-agent"
};

export default function Home() {
    return (
        <>
            <Script
                id="ai-agents-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(autonomousAIAgentsSchema) }}
            />
            <Script
                id="live-video-agent-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(liveVideoAgentSchema) }}
            />
            <IndexClient />
        </>
    );
}
