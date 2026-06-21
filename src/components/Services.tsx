"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingCart, Layout, Bot, Code2, ArrowRight } from "lucide-react";

const services = [
  {
    title: "Κατασκευή Eshop",
    description: "Ολοκληρωμένα ηλεκτρονικά καταστήματα με WooCommerce ή custom React solutions. Γρήγορα, ασφαλή, βελτιστοποιημένα για πωλήσεις.",
    href: "/kataskevi-eshop",
    icon: <ShoppingCart size={28} className="text-white" />,
    color: "bg-[#3b5bdb]"
  },
  {
    title: "Web Development",
    description: "Custom web apps με React frontend και robust backend. Από dashboards μέχρι full SaaS platforms.",
    href: "/web-development",
    icon: <Layout size={28} className="text-black" />,
    color: "bg-[#4ade80]"
  },
  {
    title: "AI Agents",
    description: "Αυτοματισμοί με AI agents που αναλαμβάνουν tasks, αποφάσεις και workflows — η επιχείρησή σας στον αυτόματο πιλότο.",
    href: "/ai-agents",
    icon: <Bot size={28} className="text-black" />,
    color: "bg-[#facc15]"
  },
  {
    title: "Κατασκευή Ιστοσελίδων",
    description: "Μοντέρνες, responsive ιστοσελίδες που κάνουν εντύπωση. Custom development, πάντα με στόχο το αποτέλεσμα.",
    href: "/kataskevi-istoselidon",
    icon: <Code2 size={28} className="text-white" />,
    color: "bg-[#111111]"
  },
];

const Services = () => {
  return (
    <section id="services" className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <p className="text-[#3b5bdb] font-heading font-bold text-xs tracking-[0.2em] uppercase mb-4">
              Τι κάνουμε
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-black">
              Υπηρεσίες
            </h2>
          </div>
          <p className="text-gray-500 max-w-md text-sm md:text-base">
            Εστιάζουμε σε τεχνολογίες αιχμής που προσφέρουν μετρήσιμα αποτελέσματα και οδηγούν την επιχείρησή σας στην ψηφιακή εποχή.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative p-8 md:p-10 rounded-3xl bg-white border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${service.color} group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                {service.icon}
              </div>

              <h3 className="text-2xl font-heading font-bold mb-4 text-black group-hover:text-[#3b5bdb] transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-8 flex-1">
                {service.description}
              </p>
              
              {service.href && (
                <Link
                  href={service.href}
                  className="inline-flex items-center gap-2 text-sm font-bold text-black group-hover:text-[#3b5bdb] transition-colors"
                  aria-label={`Μάθετε περισσότερα για ${service.title}`}
                >
                  Μάθετε Περισσότερα 
                  <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#3b5bdb] group-hover:text-white transition-colors">
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
