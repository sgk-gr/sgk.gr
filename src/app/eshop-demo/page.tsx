import { Metadata } from "next";
import EshopDemoClient from "./EshopDemoClient";

export const metadata: Metadata = {
    title: "Eshop Demo | Fashion Store — SGK Software Development",
    description: "Δείτε ένα demo eshop υψηλών προδιαγραφών από την SGK Software Development. AI λειτουργίες, ταχύτατο checkout και premium aesthetics.",
};

export default function EshopDemoPage() {
    return <EshopDemoClient />;
}
