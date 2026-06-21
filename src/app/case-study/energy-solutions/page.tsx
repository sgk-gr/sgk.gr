import { Metadata } from "next";
import EnergyClient from "./EnergyClient";

export const metadata: Metadata = {
    title: "Glavinas Energy Case Study | SEO & Landing Page — SGK Digital",
    description: "Case study: Landing page με SEO optimization, Google Business Profile και lead generation για εταιρεία ενεργειακών λύσεων.",
        keywords: "seo optimization, landing page, google business profile, lead generation",
alternates: {
        canonical: "https://sgk.gr/case-study/energy-solutions",
    },
    openGraph: {
        title: "Glavinas Energy Case Study | SEO & Landing Page — SGK Digital",
        description: "Case study: Landing page με SEO optimization, Google Business Profile και lead generation για εταιρεία ενεργειακών λύσεων.",
        url: "https://sgk.gr/case-study/energy-solutions",
        type: "article",
        images: ["https://sgk.gr/social-preview.png"],
        siteName: "SGK Software Development",
    },
    twitter: {
        card: "summary_large_image",
        title: "Glavinas Energy Case Study | SEO & Landing Page — SGK Digital",
        description: "Case study: Landing page με SEO optimization, Google Business Profile και lead generation για εταιρεία ενεργειακών λύσεων.",
        images: ["https://sgk.gr/social-preview.png"],
    },
};

export default function EnergyPage() {
    return <EnergyClient />;
}
