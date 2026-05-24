import { Metadata } from "next";
import KastanidisClient from "./KastanidisClient";

export const metadata: Metadata = {
    title: "ΚΑΒΕ Α.Ε. Καστανίδης Case Study | SGK Digital",
    description: "Κατασκευή καθαρού WordPress & WooCommerce e-shop για την κορυφαία εταιρεία εμπορίας ειδών υγιεινής, πλακιδίων και κουζίνας.",
};

export default function KastanidisPage() {
    return <KastanidisClient />;
}
