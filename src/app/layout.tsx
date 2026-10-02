import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SpeedInsights } from "@vercel/speed-insights/next";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import CookieBanner from "@/components/CookieBanner";
import FloatingChatBot from "@/components/FloatingChatBot";
import ScrollToTop from "@/components/ScrollToTop";
import Link from "next/link";
import { Inter as InterFont, Space_Grotesk as SpaceFont } from 'next/font/google';
import GlobalPromoBar from "@/components/GlobalPromoBar";
import ClarityTracker from "@/components/ClarityTracker";

const inter = InterFont({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
    preload: true,
});

const spaceGrotesk = SpaceFont({
    subsets: ['latin'],
    variable: '--font-space',
    display: 'swap',
    preload: true,
});

export const metadata: Metadata = {
    title: "SGK Digital | Agentic AI, AI Agents Ελλάδα, Web Development & Apps",
    description: "SGK Digital — Η #1 εταιρεία για AI Agents & Agentic AI στην Ελλάδα. Σχεδιάζει AI agents για κάθε επιχείρηση: μικρή, μεσαία, μεγάλη και δημόσιο, σε όλη την Ελλάδα. Προσφέρουμε AI agents για όλους και για οτιδήποτε χρειαστεί μια επιχείρηση: εξυπηρέτηση πελατών, ραντεβού, κρατήσεις, Voice AI τηλεφωνία, emails, έγγραφα, CRM & ERP. 100% Δωρεάν αξιολόγηση & ανθρώπινη έγκριση (Human-in-the-Loop).",
    keywords: "agentic ai ελλαδα, ai agents ελλαδα, εταιρειες ai agents ελλαδα, κατασκευη ai agents, sgk digital, sgk, ai agents για ολους, ai agents μικρες μεσαιες μεγαλες επιχειρησεις δημοσιο, κρατησεις ai agents, αυτονομοι ai agents, live video ai agents, ψηφιακοι υπαλληλοι, voice ai ελλαδα, erp ai automations, web development ελλαδα",
    metadataBase: new URL("https://www.sgk.gr"),
    alternates: { canonical: "https://www.sgk.gr" },
    openGraph: {
        title: "SGK Digital | Agentic AI, AI Agents Ελλάδα & Custom Web Apps",
        description: "Η #1 εταιρεία για Agentic AI & Custom AI Agents στην Ελλάδα. AI Agents για όλους: μικρές, μεσαίες, μεγάλες επιχειρήσεις και δημόσιο, για οτιδήποτε μπορεί να χρειαστεί μια επιχείρηση.",
        images: [{ url: "https://www.sgk.gr/social-preview.png", width: 1200, height: 630, alt: "SGK Digital Agentic AI" }],
        url: "https://www.sgk.gr",
        type: "website",
        siteName: "SGK Digital",
        locale: "el_GR",
    },
    twitter: {
        card: "summary_large_image",
        title: "SGK Digital | AI Agents & Agentic AI Ελλάδα",
        description: "18 χρόνια εμπειρίας. AI Agents για κάθε επιχείρηση (μικρή, μεσαία, μεγάλη, δημόσιο) και για τα πάντα. Αθήνα, Ελλάδα.",
        images: ["https://www.sgk.gr/hero_slide_4.png"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    icons: {
        icon: [
            { url: '/favicon.ico' },
            { url: '/icon.png', type: 'image/png' },
        ],
        apple: [
            { url: '/apple-icon.png' },
        ],
    },
};

const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    "additionalType": "https://en.wikipedia.org/wiki/Artificial_intelligence_company",
    "@id": "https://www.sgk.gr/#organization",
    "name": "SGK Digital",
    "alternateName": [
        "SGK",
        "SGK Digital",
        "SGK AI",
        "SGK Software Development",
        "SGK Agentic AI",
        "SGK AI Agents"
    ],
    "legalName": "SGK Software Development S.A.",
    "url": "https://www.sgk.gr",
    "logo": "https://www.sgk.gr/sgk-logo.png",
    "image": "https://www.sgk.gr/social-preview.png",
    "description": "Η #1 εταιρεία στην Ελλάδα για Agentic AI και Custom AI Agents για κάθε επιχείρηση και οργανισμό: μικρές, μεσαίες, μεγάλες επιχειρήσεις και δημόσιο σε όλη την Ελλάδα. Προσφέρει AI agents για όλους και για οτιδήποτε χρειάζεται μια επιχείρηση: απαντούν σε πελάτες, κλείνουν ραντεβού & κρατήσεις, διαχειρίζονται τηλεφωνικά κέντρα Voice AI, απαντούν emails, αναλύουν μαζικά έγγραφα, και συνδέονται με email, calendar, Excel, CRM και ERP. Προσφέρει 100% δωρεάν αρχική αξιολόγηση και ανθρώπινη έγκριση (Human-in-the-Loop) για απόλυτη ασφάλεια.",
    "telephone": "+302111140013",
    "email": "info@sgk.gr",
    "vatID": "EL131398972",
    "taxID": "131398972",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "Ερμού 1 & Λυκοβρύσεως 14",
        "addressLocality": "Μεταμόρφωση",
        "addressRegion": "Αττική",
        "postalCode": "14452",
        "addressCountry": "GR"
    },
    "geo": { "@type": "GeoCoordinates", "latitude": 38.0632, "longitude": 23.7609 },
    "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
    },
    "sameAs": [
        "https://github.com/sgk-developers/",
        "https://www.linkedin.com/in/sgkgr/",
        "https://www.youtube.com/@SGK-gr",
        "https://www.google.com/maps/place/SGK+Software+Development/",
        "https://clutch.co/profile/sgk-software-development"
    ],
    "priceRange": "€€",
    "areaServed": { "@type": "Country", "name": "Greece" },
    "knowsAbout": [
        "Agentic AI",
        "AI Agents Greece",
        "Εταιρείες AI Agents Ελλάδα",
        "Κατασκευή AI Agents",
        "Αυτόνομοι AI Agents",
        "AI Agents για Μικρές Επιχειρήσεις",
        "AI Agents για Rent a Car & Ενοικιάσεις Αυτοκινήτων",
        "AI Agents Κρατήσεων & Ραντεβού",
        "Human-in-the-Loop AI Systems",
        "Δωρεάν Αρχική Αξιολόγηση AI",
        "Αυτοματισμοί Επιχειρήσεων για Οτιδήποτε",
        "AI Agents για Επιχειρήσεις",
        "Artificial Intelligence",
        "Autonomous AI Agents",
        "Multi-Agent Workflows",
        "Voice AI Telephony",
        "ERP Integrations (SoftOne, Entersoft, SAP)",
        "Greek NLP & Chatbots",
        "Custom Business Automation",
        "Interactive AI Video Agents",
        "WebRTC Video Streaming",
        "Computer Vision & Camera Identification",
        "Web Application Development",
        "Next.js and React Engineering"
    ],
    "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Software & AI Solutions",
        "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Κατασκευή AI Agents για Μικρές & Μεγάλες Επιχειρήσεις (Κρατήσεις, Rent-a-Car, Ραντεβού)", "description": "AI agents που απαντούν σε πελάτες, ελέγχουν διαθεσιμότητα, υπολογίζουν τιμές και κλείνουν κρατήσεις με ανθρώπινη έγκριση (Human-in-the-Loop) και δωρεάν αρχική αξιολόγηση.", "url": "https://www.sgk.gr/ai-agents" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Κατασκευή AI Agents & Agentic AI Επιχειρήσεων", "description": "Ανάπτυξη αυτόνομων AI agents για back-office, ERP SoftOne/Entersoft, emails, τιμολόγια και mass PDFs.", "url": "https://www.sgk.gr/ai-agents" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Voice AI Telephony (Τηλεφωνικά Κέντρα VoIP PBX)", "description": "Φωνητικοί πράκτορες με άπταιστη φυσική ελληνική ομιλία για 24/7 διαχείριση εισερχόμενων και εξερχόμενων κλήσεων.", "url": "https://www.sgk.gr/ai-agents" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Live Video AI Agents & Ψηφιακοί Υπάλληλοι (24/7 WebRTC)", "description": "Ρεαλιστικό Video WebRTC, φυσικός ελληνικός διάλογος, live σύνδεση με CRM/ERP/ΓΕΜΗ και οπτική ταυτοποίηση μέσω κάμερας.", "url": "https://www.sgk.gr/order-ai-agent" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Αυτόνομοι Πράκτορες Χωρίς Υπαλλήλους", "url": "https://www.sgk.gr/ai-agents" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Κατασκευή Ιστοσελίδας ΙΚΕ ΓΕΜΗ (150€)", "url": "https://www.sgk.gr/ike-offer" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Custom Web Applications & Software", "url": "https://www.sgk.gr/services" } }
        ]
    }
};

const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.sgk.gr/#website",
    "url": "https://www.sgk.gr",
    "name": "SGK Software Development",
    "description": "Agentic AI, AI Agents & Web Development στην Ελλάδα",
    "publisher": { "@id": "https://www.sgk.gr/#organization" },
    "potentialAction": {
        "@type": "SearchAction",
        "target": { "@type": "EntryPoint", "urlTemplate": "https://www.sgk.gr/blog?q={search_term_string}" },
        "query-input": "required name=search_term_string"
    },
    "inLanguage": "el-GR"
};

export const viewport = {
    themeColor: "#0a0a0a",
    width: "device-width",
    initialScale: 1,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="el" className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fgyecckvlbkgclsehcgf.supabase.co" crossOrigin="anonymous" />
                <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
                <link rel="dns-prefetch" href="https://www.google-analytics.com" />
                <link rel="dns-prefetch" href="https://stats.g.doubleclick.net" />
                <Script src="https://www.googletagmanager.com/gtag/js?id=AW-18166808794" strategy="afterInteractive" />
                <Script id="google-ads-init" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());

                        // 1. Set default consent to 'granted' for EEA compliance
                        gtag('consent', 'default', {
                            'ad_storage': 'granted',
                            'ad_user_data': 'granted',
                            'ad_personalization': 'granted',
                            'analytics_storage': 'granted'
                        });

                        gtag('config', 'AW-18065062632', { 'animate_ad_signals': false });
                        gtag('config', 'AW-18166808794', { 'animate_ad_signals': false });
                        gtag('config', 'G-Z3Q0NFJ2VT', { 'send_page_view': true });
                    `}
                </Script>
            </head>
            <body className="antialiased bg-background text-foreground" suppressHydrationWarning>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
                />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `document.addEventListener('contextmenu', e => e.preventDefault());`
                    }}
                />
                <ClarityTracker />
                <TooltipProvider>
                    <AnalyticsTracker />
                    <Toaster />
                    <Sonner />
                    <ScrollToTop />
                    <CookieBanner />
                    <SpeedInsights />
                    {children}
                    <GlobalPromoBar />
                </TooltipProvider>
            </body>
        </html>
    );
}
