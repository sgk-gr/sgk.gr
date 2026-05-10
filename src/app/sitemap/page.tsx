import { Metadata } from "next";
import SitemapClient from "./SitemapClient";

export const metadata: Metadata = {
    title: "Sitemap | SGK Software Development",
    description: "Περιηγηθείτε σε όλες τις σελίδες και τα case studies της SGK Software Development.",
};

export default function SitemapPage() {
    return <SitemapClient />;
}
