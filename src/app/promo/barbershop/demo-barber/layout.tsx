import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Demo Barbershop - Online Σύστημα Ραντεβού | SGK Digital",
    description: "Δείτε ένα ζωντανό demo ιστοσελίδας κομμωτηρίου με ενσωματωμένο σύστημα online κρατήσεων από την SGK Digital.",
    robots: {
        index: false,
        follow: true,
    },
};

export default function DemoBarberLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
