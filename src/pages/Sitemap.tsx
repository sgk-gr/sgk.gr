import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const Sitemap = () => {
    const links = [
        {
            title: "Κύριες Σελίδες",
            items: [
                { name: "Αρχική", path: "/" },
                { name: "Υπηρεσίες", path: "/#services" },
                { name: "Λύσεις", path: "/#solutions" },
                { name: "Πελάτες", path: "/#portfolio" },
                { name: "Σχετικά", path: "/#about" },
                { name: "Insights", path: "/#insights" },
                { name: "Επικοινωνία", path: "/#contact" },
            ]
        },
        {
            title: "Case Studies",
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
            ]
        },
        {
            title: "Προσφορές & Demo",
            items: [
                { name: "Eshop Demo", path: "/eshop-demo" },
                { name: "Προσφορά Eshop", path: "/#eshop-offer" },
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

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
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
                                                {link.path.startsWith("/#") ? (
                                                    <a
                                                        href={link.path}
                                                        className="text-muted-foreground hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                                                    >
                                                        <span className="w-1 h-1 bg-white/20 rounded-full group-hover:bg-primary transition-colors"></span>
                                                        {link.name}
                                                    </a>
                                                ) : (
                                                    <Link
                                                        to={link.path}
                                                        className="text-muted-foreground hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                                                    >
                                                        <span className="w-1 h-1 bg-white/20 rounded-full group-hover:bg-primary transition-colors"></span>
                                                        {link.name}
                                                    </Link>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Sitemap;
