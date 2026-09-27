import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Live Video Avatar Demo | SGK Digital",
    description: "Interactive Live Video AI Avatar Demo for businesses.",
    robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
        },
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
