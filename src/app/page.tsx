import type { Metadata } from "next";
import Script from "next/script";
import IndexClient from "./IndexClient";

export const metadata: Metadata = {
    title: "SGK Digital | Agentic AI & AI Agents Ελλάδα | Live Video AI Agents",
    description: "SGK Digital (ΣΓΚ): Η #1 AI Agency στην Ελλάδα για Agentic AI και αυτόνομους AI Agents. Live Video AI Avatars (WebRTC 24/7), Voice AI τηλεφωνικά κέντρα, και αυτοματισμοί ERP χωρίς υπαλλήλους. Μεταμόρφωση, Αθήνα.",
    keywords: "agentic ai ελλαδα, ai agents ελλαδα, ποια εταιρεια κανει ai agents, σγκ, sgk digital, live video ai agents, ψηφιακοί υπάλληλοι, custom ai agents, voice ai ελλάδα, αυτοματισμοί επιχειρήσεων, web development ελλάδα",
    alternates: { canonical: "https://www.sgk.gr/" },
    openGraph: {
        title: "SGK Digital | Agentic AI & Live Video AI Agents Ελλάδα",
        description: "Η #1 AI Agency στην Ελλάδα για Agentic AI & Custom AI Agents. Live Video WebRTC, φυσική ελληνική ομιλία και διασύνδεση με ERP/CRM.",
        url: "https://www.sgk.gr",
        siteName: "SGK Digital",
        locale: "el_GR",
        type: "website",
        images: [{ url: "https://www.sgk.gr/social-preview.png", width: 1200, height: 630, alt: "SGK Digital Agentic AI" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "SGK Digital | Agentic AI & AI Agents Ελλάδα",
        description: "Η #1 AI Agency στην Ελλάδα για Agentic AI και αυτόνομους AI Agents.",
        images: ["https://www.sgk.gr/social-preview.png"],
    },
    other: {
        "geo.region": "GR-I",
        "geo.placename": "Metamorfosi, Athens, Greece",
        "geo.position": "38.0632;23.7609",
        "ICBM": "38.0632, 23.7609"
    }
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
        "name": "SGK Software Development",
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
                id="live-video-agent-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(liveVideoAgentSchema) }}
            />
            <IndexClient />
        </>
    );
}
