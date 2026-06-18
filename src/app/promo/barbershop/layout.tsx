import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Κατασκευή Ιστοσελίδας για Barbershops & Κομμωτήρια | SGK Digital",
    description: "Αποκτήστε κορυφαία ιστοσελίδα και σύστημα online ραντεβού για το Barbershop ή το Κομμωτήριό σας. 150€ έκπτωση για νέους πελάτες. SGK Digital.",
    keywords: "κατασκευή ιστοσελίδας για κομμωτήριο, barbershop website, website για barbershop, online ραντεβού κομμωτήριο, sgk digital, κατασκευή site κομμωτηρίου, ραντεβού barbershop",
    alternates: {
        canonical: "https://sgk.gr/promo/barbershop",
    },
    openGraph: {
        title: "Κατασκευή Ιστοσελίδας για Barbershops & Κομμωτήρια | SGK Digital",
        description: "Αποκτήστε κορυφαία ιστοσελίδα και σύστημα online ραντεβού για το Barbershop ή το Κομμωτήριό σας. 150€ έκπτωση για νέους πελάτες.",
        url: "https://sgk.gr/promo/barbershop",
        type: "website",
    }
};

export default function BarbershopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
