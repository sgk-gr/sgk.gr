import type { Metadata } from "next";
import Script from "next/script";
import IndexClient from "./IndexClient";

export const metadata: Metadata = {
    title: "SGK Software Development | Live Video AI Agents, Κατασκευή Eshop, Web Apps Ελλάδα",
    description: "Αντικαταστήστε τα ψυχρά γραπτά μηνύματα με ζωντανή ανθρώπινη επαφή. Live Video AI Agents 24/7 με WebRTC, φυσικό ελληνικό διάλογο, σύνδεση με CRM/ERP/ΓΕΜΗ και οπτική ταυτοποίηση μέσω κάμερας. Αθήνα, Ελλάδα.",
    keywords: "live video ai agents, ψηφιακοί υπάλληλοι βίντεο, webrtc ai agents ελλάδα, live video call ai agent, ai video customer service, ταυτοποίηση μέσω κάμερας ai, διασύνδεση crm erp ai agents, voice ai ελλάδα, κατασκευή eshop, woocommerce ελλάδα, web development ελλάδα, κατασκευή ιστοσελίδων, software development αθήνα",
    alternates: { canonical: "https://www.sgk.gr/" },
    openGraph: {
        title: "SGK Software Development | Live Video AI Agents, Eshop & Web Apps",
        description: "Αντικαταστήστε τα ψυχρά γραπτά μηνύματα με ζωντανή ανθρώπινη επαφή. Ρεαλιστικό Video WebRTC, άπταιστος ελληνικός διάλογος, live σύνδεση με CRM/ERP/ΓΕΜΗ και οπτική ταυτοποίηση μέσω κάμερας.",
        url: "https://www.sgk.gr",
        siteName: "SGK Software Development",
        locale: "el_GR",
        type: "website",
        images: [{ url: "https://www.sgk.gr/hero_slide_2.png", width: 1200, height: 630, alt: "Live Video AI Agents - SGK Digital" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "SGK Software Development | Live Video AI Agents & Web Development",
        description: "Αντικαταστήστε τα ψυχρά γραπτά μηνύματα με ζωντανή ανθρώπινη επαφή. Ρεαλιστικό Video WebRTC, άπταιστος ελληνικός διάλογος και live διασυνδέσεις.",
        images: ["https://www.sgk.gr/hero_slide_2.png"],
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
    "url": "https://www.sgk.gr/liveavatar-demo"
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
