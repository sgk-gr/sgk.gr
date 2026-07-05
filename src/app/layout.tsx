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
    title: "SGK Software Development | Κατασκευή Eshop, Web Apps, AI Agents Ελλάδα",
    description: "SGK Software Development — 18 χρόνια εμπειρίας. Κατασκευή Eshop (WooCommerce), custom web εφαρμογές, AI agents. Αθήνα, Ελλάδα.",
    keywords: "κατασκευή eshop, woocommerce ελλάδα, web development ελλάδα, ai agents ελλάδα, κατασκευή ιστοσελίδων, software development αθήνα",
    metadataBase: new URL("https://sgk.gr"),
    alternates: { canonical: "https://sgk.gr" },
    openGraph: {
        title: "SGK Software Development | Eshop, Web Apps, AI Agents Ελλάδα",
        description: "18 χρόνια εμπειρίας. Κατασκευή Eshop, custom web εφαρμογές, AI agents. Αθήνα, Ελλάδα.",
        images: [{ url: "https://sgk.gr/social-preview.png", width: 1200, height: 630, alt: "SGK Software Development" }],
        url: "https://sgk.gr",
        type: "website",
        siteName: "SGK Software Development",
        locale: "el_GR",
    },
    twitter: {
        card: "summary_large_image",
        title: "SGK Software Development | Κατασκευή Eshop, AI Agents Ελλάδα",
        description: "18 χρόνια εμπειρίας. Κατασκευή Eshop, Web Apps, AI Agents. Αθήνα, Ελλάδα.",
        images: ["https://sgk.gr/social-preview.png"],
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
    "@type": "LocalBusiness",
    "@id": "https://sgk.gr/#organization",
    "name": "SGK Software Development",
    "legalName": "SGK Software Development S.A.",
    "url": "https://sgk.gr",
    "logo": "https://sgk.gr/sgk-logo.png",
    "image": "https://sgk.gr/social-preview.png",
    "description": "Κατασκευή Eshop, Web Development, AI Agents για επιχειρήσεις στην Ελλάδα. 18 χρόνια εμπειρίας.",
    "telephone": "+306999524389",
    "email": "info@sgk.gr",
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
    "sameAs": ["https://github.com/sgk-developers/"],
    "priceRange": "€€",
    "areaServed": { "@type": "Country", "name": "Greece" },
    "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Web Development Services",
        "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Κατασκευή Eshop" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Web Development" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "AI Agents" } }
        ]
    }
};

const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://sgk.gr/#website",
    "url": "https://sgk.gr",
    "name": "SGK Software Development",
    "description": "Κατασκευή Eshop, Web Development & AI Agents στην Ελλάδα",
    "publisher": { "@id": "https://sgk.gr/#organization" },
    "potentialAction": {
        "@type": "SearchAction",
        "target": { "@type": "EntryPoint", "urlTemplate": "https://sgk.gr/blog?q={search_term_string}" },
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
                {process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID && (
                    <Script
                        id="microsoft-clarity"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: `
                                (function(c,l,a,r,i,t,y){
                                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                                })(window,document,"clarity","script","${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");
                            `
                        }}
                    />
                )}
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
