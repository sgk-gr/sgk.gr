import { Metadata } from "next";
import RekruaClient from "./RekruaClient";

export const metadata: Metadata = {
    title: "Rekrua Case Study | AI HR Platform & Candidate Screening — SGK Digital",
    description: "Case study: AI HR πλατφόρμα με candidate rating, intelligent screening, auto follow-ups. React, Supabase, GPT-5.2 Mini.",
    keywords: "ai hr platform, candidate screening, recruitment automation",
};

export default function RekruaPage() {
    return <RekruaClient />;
}
