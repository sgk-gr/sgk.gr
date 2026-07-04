import type { Metadata } from "next";
import PayAsYouGrowClient from "@/components/PayAsYouGrowClient";

export const metadata: Metadata = {
    title: "SGK Pay as you grow | Κατασκευή Eshop με Ποσοστό vs Shopify",
    description: "Κατασκευή Eshop με setup fee 250€ και 5% προμήθεια επί των πωλήσεων. Σύγκριση με Shopify και Isocommerce. Μηδενικό ρίσκο, 100% δικό σας σε 12 μήνες.",
    keywords: [
        "pay as you grow eshop",
        "κατασκευη eshop με ποσοστο",
        "shopify vs pay as you grow",
        "ενοικιαση eshop",
        "isocommerce vs shopify",
        "κατασκευη eshop χωρις ρισκο",
        "eshop με ποσοστα greece",
        "κατασκευη eshop με το μηνα"
    ],
    alternates: {
        canonical: "https://sgk.gr/pay-as-you-grow",
    },
    openGraph: {
        title: "SGK Pay as you grow | Κατασκευή Eshop με Ποσοστό vs Shopify",
        description: "Κατασκευή Eshop με setup fee 250€ και 5% προμήθεια επί των πωλήσεων. Σύγκριση με Shopify και Isocommerce. Μηδενικό ρίσκο, 100% δικό σας σε 12 μήνες.",
        url: "https://sgk.gr/pay-as-you-grow",
        type: "website",
        images: ["https://sgk.gr/social-preview.png"],
        siteName: "SGK Software Development",
    },
    twitter: {
        card: "summary_large_image",
        title: "SGK Pay as you grow | Κατασκευή Eshop με Ποσοστό vs Shopify",
        description: "Κατασκευή Eshop με setup fee 250€ και 5% προμήθεια επί των πωλήσεων. Σύγκριση με Shopify και Isocommerce. Μηδενικό ρίσκο, 100% δικό σας σε 12 μήνες.",
        images: ["https://sgk.gr/social-preview.png"],
    },
};

export default function PayAsYouGrowPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Service",
                "@id": "https://sgk.gr/pay-as-you-grow#service",
                "name": "SGK Pay As You Grow E-shop Development",
                "description": "Κατασκευή επαγγελματικού E-shop με προκαταβολή 250€ και το υπόλοιπο με 5% προμήθεια επί των πωλήσεων για 12 μήνες μόνο. Χωρίς μηνιαία πάγια, 100% ιδιοκτησία μετά τους 12 μήνες.",
                "provider": {
                    "@type": "LocalBusiness",
                    "name": "SGK Software Development",
                    "image": "https://sgk.gr/public/logo.png",
                    "telephone": "+306999524389",
                    "email": "info@sgk.gr",
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": "Ερμού 1 & Λυκοβρύσεως 14",
                        "addressLocality": "Μεταμόρφωση",
                        "addressRegion": "Αττική",
                        "postalCode": "14452",
                        "addressCountry": "GR"
                    }
                },
                "offers": {
                    "@type": "Offer",
                    "price": "250.00",
                    "priceCurrency": "EUR",
                    "description": "Setup fee (εφάπαξ καταβολή) και 5% προμήθεια επί των πωλήσεων για 12 μήνες."
                }
            },
            {
                "@type": "FAQPage",
                "@id": "https://sgk.gr/pay-as-you-grow#faq",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "Πόσο είναι το Setup Fee στο Pay As You Grow;",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Το Setup Fee είναι ακριβώς 250€ (εφάπαξ καταβολή). Καλύπτει VPS server για 1 έτος, domain name .gr για 2 έτη, SSL, και την αρχική εγκατάσταση."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Τι γίνεται αν έχω 0 πωλήσεις;",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Αν έχετε 0 πωλήσεις, πληρώνετε 0€ προμήθεια. Το e-shop σας παραμένει ανοιχτό χωρίς κανένα μηνιαίο πάγιο ή κρυφές χρεώσεις."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Ποια είναι η διαφορά του Pay As You Grow από το Shopify και το Isocommerce;",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Το Shopify απαιτεί τουλάχιστον 28€/μήνα συν έξτρα μηνιαία apps για ελληνικές courier/τράπεζες, χωρίς να σας ανήκει ποτέ το κατάστημα. Το Isocommerce (Starter) κοστίζει 300€ setup + 35€/μήνα μόνιμα, χωρίς Skroutz/courier συνδέσεις. Το Pay As You Grow της SGK έχει 250€ setup, 5% προμήθεια για 12 μήνες μόνο, και μετά το E-shop γίνεται 100% δικό σας χωρίς καμία άλλη χρέωση."
                        }
                    }
                ]
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <PayAsYouGrowClient />
        </>
    );
}
