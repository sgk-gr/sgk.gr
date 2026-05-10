import type { Metadata } from "next";
import BlogClient from "./BlogClient";

export const metadata: Metadata = {
    title: "Blog & Insights | SGK Software Development Software Development",
    description: "Διαβάστε τα τελευταία νέα για AI αυτοματισμούς, κατασκευή eshop νέας γενιάς και ψηφιακό μετασχηματισμό από την ομάδα της SGK Software Development.",
};

export default function BlogPage() {
    return <BlogClient />;
}
