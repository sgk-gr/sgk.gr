import type { Metadata } from "next";
import "./admin-theme.css";

export const metadata: Metadata = {
    title: "Admin Panel | SGK",
    robots: {
        index: false,
        follow: false,
    },
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
