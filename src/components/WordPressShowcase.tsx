import { motion } from "framer-motion";
import { Zap, Gauge, ShieldCheck, TrendingUp, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "< 1s Load Time",
    description: "Optimized κώδικας, caching και CDN για instant page loads.",
  },
  {
    icon: Gauge,
    title: "100/100 PageSpeed",
    description: "Core Web Vitals στο πράσινο — κάθε φορά, χωρίς συμβιβασμούς.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Security",
    description: "SSL, firewall, anti-malware και automated backups by default.",
  },
  {
    icon: TrendingUp,
    title: "SEO-Ready",
    description: "Schema markup, sitemap, meta optimization — built-in από την αρχή.",
  },
];

const WordPressShowcase = () => {
  return (
    <section className="py-16 sm:py-28 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-heading font-semibold tracking-wider uppercase mb-6">
              WordPress eShops
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-[1.05] mb-6">
              eShops νέας γενιάς
              <br />
              <span className="text-gradient">με απίστευτη ταχύτητα</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
              Χτίζουμε WordPress & WooCommerce καταστήματα που φορτώνουν σε
              χιλιοστά του δευτερολέπτου. Custom θέμα, zero bloat, maximum
              performance — το eshop σας γίνεται η ταχύτερη εμπειρία αγορών
              για τους πελάτες σας.
            </p>
            <a
              href="#eshop-offer"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground font-heading font-semibold rounded-md hover:opacity-90 transition-opacity glow-border"
            >
              Ζητήστε Προσφορά
              <ArrowRight size={18} />
            </a>
          </motion.div>

          {/* Right — Feature cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-500 group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-sm mb-2">
                  {f.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {f.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Speed bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 p-6 rounded-xl bg-card border border-border flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <Gauge className="w-8 h-8 text-primary" />
            <div>
              <p className="font-heading font-semibold text-sm">Average Load Time</p>
              <p className="text-xs text-muted-foreground">Τα eshops μας vs industry average</p>
            </div>
          </div>
          <div className="flex-1 max-w-md w-full">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>SGK eShops</span>
              <span className="text-primary font-semibold">0.8s</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden mb-3">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "20%" }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full rounded-full bg-primary"
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Industry Average</span>
              <span>3.7s</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "80%" }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.7 }}
                className="h-full rounded-full bg-muted-foreground/30"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WordPressShowcase;
