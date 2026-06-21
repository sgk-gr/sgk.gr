"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { LayoutDashboard, Calendar, BarChart3, Settings } from "lucide-react";

const useCases = [
  {
    title: "Custom CRM",
    description: "Διαχείριση πελατών, leads και πωλήσεων σε ένα dashboard φτιαγμένο στα μέτρα σας.",
    icon: <LayoutDashboard size={20} className="text-[#3b5bdb]" />
  },
  {
    title: "Σύστημα Κρατήσεων",
    description: "Online booking για Airbnb, ξενοδοχεία, τουριστικά γραφεία — real-time availability.",
    icon: <Calendar size={20} className="text-[#facc15]" />
  },
  {
    title: "Admin Dashboards",
    description: "Διαχειριστικά panels με analytics, reports και πλήρη εικόνα της επιχείρησής σας.",
    icon: <BarChart3 size={20} className="text-[#4ade80]" />
  },
  {
    title: "Αυτοματισμοί Εταιρειών",
    description: "Workflows, task management, invoicing — αυτοματοποιούμε τις καθημερινές λειτουργίες σας.",
    icon: <Settings size={20} className="text-[#3b5bdb]" />
  },
];

const industries = [
  "Τουριστικά Γραφεία",
  "Airbnb Management",
  "Ξενοδοχεία",
  "eCommerce",
  "Logistics",
  "Real Estate",
  "Εστίαση",
  "Υγεία",
];

const WebAppsShowcase = () => {
  return (
    <section className="py-24 bg-[#facc15] relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Feature grid */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {useCases.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
                  className="p-8 rounded-3xl bg-white border border-black/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-3 text-black">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — Copy */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <p className="font-heading font-bold text-xs tracking-[0.2em] uppercase mb-4 text-black/60">
              Web Applications
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-[1.1] mb-6 text-black">
              Dashboards &
              <br />
              <span className="text-[#3b5bdb]">Διαχειριστικά</span>
            </h2>
            <p className="text-lg text-black/80 leading-relaxed mb-10 max-w-lg font-medium">
              Φτιάχνουμε custom web εφαρμογές που απλοποιούν τη λειτουργία
              της επιχείρησής σας. CRM, συστήματα κρατήσεων, admin panels
              και αυτοματισμοί — ό,τι χρειάζεστε, το χτίζουμε από το μηδέν.
            </p>

            {/* Industries */}
            <p className="text-xs font-heading font-bold text-black/60 uppercase tracking-wider mb-4">
              Κλάδοι που εξυπηρετούμε
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              {industries.map((ind) => (
                <span
                  key={ind}
                  className="px-4 py-2 text-xs font-bold bg-white text-black rounded-xl border border-black/5 shadow-sm"
                >
                  {ind}
                </span>
              ))}
            </div>

            <Link
              href="/estimate"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Ζητήστε Demo
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WebAppsShowcase;
