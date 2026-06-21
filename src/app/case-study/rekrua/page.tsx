import { Metadata } from "next";
import RekruaClient from "./RekruaClient";

export const metadata: Metadata = {
    title: "Rekrua Case Study | AI HR Platform & Candidate Screening — SGK Digital",
    description: "Case study: AI HR πλατφόρμα με candidate rating, intelligent screening, auto follow-ups. React, Supabase, GPT-5.2 Mini.",
        keywords: "ai hr platform, candidate screening, recruitment automation",
alternates: {
        canonical: "https://sgk.gr/case-study/rekrua",
    },
    openGraph: {
        title: "Rekrua Case Study | AI HR Platform & Candidate Screening — SGK Digital",
        description: "Case study: AI HR πλατφόρμα με candidate rating, intelligent screening, auto follow-ups. React, Supabase, GPT-5.2 Mini.",
        url: "https://sgk.gr/case-study/rekrua",
        type: "article",
        images: ["https://sgk.gr/social-preview.png"],
        siteName: "SGK Software Development",
    },
    twitter: {
        card: "summary_large_image",
        title: "Rekrua Case Study | AI HR Platform & Candidate Screening — SGK Digital",
        description: "Case study: AI HR πλατφόρμα με candidate rating, intelligent screening, auto follow-ups. React, Supabase, GPT-5.2 Mini.",
        images: ["https://sgk.gr/social-preview.png"],
    },
};

export default function RekruaPage() {
    return <RekruaClient />;
}
