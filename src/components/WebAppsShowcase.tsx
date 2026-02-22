import { motion } from "framer-motion";
import { LayoutDashboard, CalendarCheck, BarChart3, Users, ArrowRight, Monitor } from "lucide-react";

const useCases = [
  {
    icon: LayoutDashboard,
    title: "Custom CRM",
    description: "Διαχείριση πελατών, leads και πωλήσεων σε ένα dashboard φτιαγμένο στα μέτρα σας.",
  },
  {
    icon: CalendarCheck,
    title: "Σύστημα Κρατήσεων",
    description: "Online booking για Airbnb, ξενοδοχεία, τουριστικά γραφεία — real-time availability.",
  },
  {
    icon: BarChart3,
    title: "Admin Dashboards",
    description: "Διαχειριστικά panels με analytics, reports και πλήρη εικόνα της επιχείρησής σας.",
  },
  {
    icon: Users,
    title: "Αυτοματισμοί Εταιρειών",
    description: "Workflows, task management, invoicing — αυτοματοποιούμε τις καθημερινές λειτουργίες σας.",
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
    <section className="py-16 sm:py-28 bg-card/50 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Feature grid */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {useCases.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
                  className="p-6 rounded-xl bg-background border border-border hover:border-primary/30 transition-all duration-500 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-sm mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
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
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-heading font-semibold tracking-wider uppercase mb-6">
              <Monitor className="w-3.5 h-3.5" />
              Web Applications
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-[1.05] mb-6">
              Dashboards &
              <br />
              <span className="text-gradient">Διαχειριστικά</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
              Φτιάχνουμε custom web εφαρμογές που απλοποιούν τη λειτουργία
              της επιχείρησής σας. CRM, συστήματα κρατήσεων, admin panels
              και αυτοματισμοί — ό,τι χρειάζεστε, το χτίζουμε από το μηδέν.
            </p>

            {/* Industries */}
            <p className="text-xs font-heading font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Κλάδοι που εξυπηρετούμε
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {industries.map((ind) => (
                <span
                  key={ind}
                  className="px-3 py-1.5 text-xs font-medium bg-secondary text-secondary-foreground rounded-full border border-border"
                >
                  {ind}
                </span>
              ))}
            </div>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground font-heading font-semibold rounded-md hover:opacity-90 transition-opacity glow-border"
            >
              Ζητήστε Demo
              <ArrowRight size={18} />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WebAppsShowcase;
