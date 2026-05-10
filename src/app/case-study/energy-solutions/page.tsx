import { Metadata } from "next";
import EnergyClient from "./EnergyClient";

export const metadata: Metadata = {
    title: "Glavinas Energy Case Study | SEO & Landing Page — SGK Digital",
    description: "Case study: Landing page με SEO optimization, Google Business Profile και lead generation για εταιρεία ενεργειακών λύσεων.",
    keywords: "seo optimization, landing page, google business profile, lead generation",
};

export default function EnergyPage() {
    return <EnergyClient />;
}
