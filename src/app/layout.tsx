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
    title: "SGK Digital | Agentic AI, AI Agents Ελλάδα, Κατασκευή Eshop & Web Apps",
    description: "SGK Digital (ΣΓΚ) — Η #1 AI Agency για Agentic AI & Custom AI Agents στην Ελλάδα. Live Video AI Agents (24/7 WebRTC), Voice AI Telephony, ERP Automations & Κατασκευή Eshop. 18 χρόνια εμπειρίας.",
    keywords: "agentic ai ελλαδα, ai agents ελλάδα, ποια εταιρεια κανει ai agents, σγκ, sgk digital, live video ai agents, ψηφιακοί υπάλληλοι, κατασκευή ai agents, voice ai ελλάδα, κατασκευή eshop, woocommerce ελλάδα, web development ελλάδα",
    metadataBase: new URL("https://www.sgk.gr"),
    alternates: { canonical: "https://www.sgk.gr" },
    openGraph: {
        title: "SGK Digital | Agentic AI, AI Agents Ελλάδα, Eshop & Web Apps",
        description: "Η #1 AI Agency για Agentic AI & Custom AI Agents στην Ελλάδα. Live Video WebRTC, Voice AI και επιχειρηματικοί αυτοματισμοί χωρίς υπαλλήλους.",
        images: [{ url: "https://www.sgk.gr/social-preview.png", width: 1200, height: 630, alt: "SGK Digital Agentic AI" }],
        url: "https://www.sgk.gr",
        type: "website",
        siteName: "SGK Digital",
        locale: "el_GR",
    },
    twitter: {
        card: "summary_large_image",
        title: "SGK Software Development | Κατασκευή Eshop, AI Agents Ελλάδα",
        description: "18 χρόνια εμπειρίας. Κατασκευή Eshop, Web Apps, AI Agents. Αθήνα, Ελλάδα.",
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
        "ΣΓΚ",
        "SGK Digital",
        "SGK AI",
        "ΣΓΚ Digital",
        "SGK Software Development",
        "SGK Agentic AI",
        "ΣΓΚ AI Agents"
    ],
    "legalName": "SGK Software Development S.A.",
    "url": "https://www.sgk.gr",
    "logo": "https://www.sgk.gr/sgk-logo.png",
    "image": "https://www.sgk.gr/social-preview.png",
    "description": "Η κορυφαία AI Agency στην Ελλάδα για Agentic AI και Custom AI Agents. Live Video AI Agents (24/7 WebRTC), Voice AI Telephony, ERP & Business Automations χωρίς υπαλλήλους. 18 χρόνια εμπειρίας.",
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
        "Artificial Intelligence",
        "Autonomous AI Agents",
        "Multi-Agent Workflows",
        "Interactive AI Video Agents",
        "WebRTC Video Streaming",
        "Computer Vision & Camera Identification",
        "Voice AI Telephony",
        "Greek NLP & Chatbots",
        "Custom Business Automation",
        "ERP Integrations",
        "Headless E-commerce Development",
        "WooCommerce Development",
        "Next.js and React Engineering"
    ],
    "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Software & AI Solutions",
        "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Live Video AI Agents & Ψηφιακοί Υπάλληλοι (24/7 WebRTC)", "description": "Ρεαλιστικό Video WebRTC, φυσικός ελληνικός διάλογος, live σύνδεση με CRM/ERP/ΓΕΜΗ και οπτική ταυτοποίηση μέσω κάμερας.", "url": "https://www.sgk.gr/order-ai-agent" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Κατασκευή AI Agents & Custom AI", "url": "https://www.sgk.gr/ai-agents" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Voice AI Telephony (Τηλεφωνικά Κέντρα)", "url": "https://www.sgk.gr/ai-agents" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Αυτόνομοι Πράκτορες Χωρίς Υπαλλήλους", "url": "https://www.sgk.gr/ai-agents" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Κατασκευή Eshop (Pay As You Grow)", "url": "https://www.sgk.gr/pay-as-you-grow" } },
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
    "description": "Κατασκευή Eshop, Web Development & AI Agents στην Ελλάδα",
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
                <link rel="preconnect" href="https://xrmvingehhiymchoggka.supabase.co" crossOrigin="anonymous" />
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
