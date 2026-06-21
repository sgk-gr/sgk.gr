"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BLOG_POSTS } from "@/data/blog-posts";

const links = [
    {
        title: "Κύριες Σελίδες & Landing Pages",
        items: [
            { name: "Αρχική", path: "/" },
            { name: "Υπηρεσίες", path: "/services" },
            { name: "Λύσεις", path: "/solutions" },
            { name: "Πελάτες", path: "/portfolio" },
            { name: "Σχετικά", path: "/about" },
            { name: "Insights", path: "/blog" },
            { name: "Επικοινωνία", path: "/estimate" },
            { name: "Κατασκευή Eshop", path: "/kataskevi-eshop" },
            { name: "Κατασκευή Eshop WooCommerce", path: "/kataskevi-eshop-woocommerce" },
            { name: "AI Agents", path: "/ai-agents" },
            { name: "Web Development", path: "/web-development" },
            { name: "Κατασκευή Ιστοσελίδων", path: "/kataskevi-istoselidon" },
            { name: "Φόρμα Εκτίμησης", path: "/estimate" },
        ]
    },
    {
        title: "Case Studies (Έργα)",
        items: [
            { name: "Sigmalabs AI", path: "/case-study/sigmalabs-ai" },
            { name: "Skinnera", path: "/case-study/skinnera" },
            { name: "Harmony Apartments", path: "/case-study/harmony-apartments" },
            { name: "Yolo8 Car Rental", path: "/case-study/yolo8" },
            { name: "Glavinas Energy", path: "/case-study/energy-solutions" },
            { name: "Rekrua", path: "/case-study/rekrua" },
            { name: "Live Tour Guide", path: "/case-study/live-tour-guide" },
            { name: "Evolis AI", path: "/case-study/evolis-ai" },
            { name: "Super App", path: "/case-study/super-app" },
            { name: "KM-Fiber", path: "/case-study/km-fiber" },
            { name: "Lemon Tree Paros", path: "/case-study/lemon-tree-paros" },
            { name: "Vaia Charms", path: "/case-study/vaia-charms" },
            { name: "Diador.eu", path: "/case-study/diador" },
            { name: "Top Travel Greece", path: "/case-study/top-travel-greece" },
            { name: "ΚΑΒΕ Α.Ε. Καστανίδης", path: "/case-study/kastanidis" },
        ]
    },
    {
        title: "Προσφορές & Demo",
        items: [
            { name: "Eshop Demo", path: "/eshop-demo" },
            { name: "Προσφορά Eshop", path: "/eshop-offer" },
            { name: "Προσφορά Barbershop & Κομμωτήρια", path: "/promo/barbershop" },
        ]
    },
    {
        title: "Blog & Insights (Άρθρα)",
        items: [
            { name: "Όλα τα άρθρα", path: "/blog" },
            ...BLOG_POSTS.map(post => ({
                name: post.title,
                path: `/blog/${post.slug}`
            }))
        ]
    },
    {
        title: "Νομικά",
        items: [
            { name: "Πολιτική Απορρήτου", path: "/privacy" },
            { name: "Όροι Χρήσης", path: "/terms" },
        ]
    }
];

export default function SitemapClient() {
    return (
        <main className="pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-12">
                        Sitemap
                    </h1>

                    <div className="grid md:grid-cols-2 gap-12">
                        {links.map((section) => (
                            <div key={section.title} className="space-y-6">
                                <h2 className="text-xl font-heading font-bold text-primary flex items-center gap-3">
                                    <span className="w-8 h-[2px] bg-primary"></span>
                                    {section.title}
                                </h2>
                                <ul className="space-y-4">
                                    {section.items.map((link) => (
                                        <li key={link.path}>
                                            <Link
                                                href={link.path}
                                                className="text-muted-foreground hover:text-white transition-colors duration-300 flex items-center gap-2 group text-sm"
                                            >
                                                <span className="w-1.5 h-1.5 bg-white/20 rounded-full group-hover:bg-primary transition-colors flex-shrink-0"></span>
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
