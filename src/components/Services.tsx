import { motion } from "framer-motion";
import { ShoppingCart, Code2, Bot, Globe } from "lucide-react";
import { useRef, useState } from "react";

const services = [
  {
    icon: ShoppingCart,
    title: "eShop Development",
    description:
      "Ολοκληρωμένα ηλεκτρονικά καταστήματα με WordPress/WooCommerce ή custom React solutions. Γρήγορα, ασφαλή, βελτιστοποιημένα.",
  },
  {
    icon: Code2,
    title: "Web Applications",
    description:
      "Custom web apps με React frontend και robust backend. Από dashboards μέχρι full SaaS platforms.",
  },
  {
    icon: Bot,
    title: "AI Agentic Systems",
    description:
      "Αυτοματισμοί με AI agents που αναλαμβάνουν tasks, αποφάσεις και workflows — η επιχείρησή σας στον αυτόματο πιλότο.",
  },
  {
    icon: Globe,
    title: "Ιστοσελίδες",
    description:
      "Μοντέρνες, responsive ιστοσελίδες που κάνουν εντύπωση. WordPress ή custom development, πάντα με στόχο το αποτέλεσμα.",
  },
];

const ServiceCard = ({ service, index }: { service: any; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative p-8 rounded-lg bg-card border border-border hover:border-primary/30 transition-all duration-500 overflow-hidden"
    >
      {/* Spotlight Effect */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-300"
        style={{
          background: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, hsl(var(--primary) / 0.1), transparent 80%)`,
        }}
      />

      <div className="relative z-10 text-primary mb-5 group-hover:scale-110 transition-transform duration-500">
        <service.icon className="w-12 h-12" />
      </div>
      <h3 className="text-2xl font-heading font-semibold mb-4 relative z-10 group-hover:text-primary transition-colors">
        {service.title}
      </h3>
      <p className="text-muted-foreground leading-relaxed relative z-10 group-hover:text-foreground transition-colors">
        {service.description}
      </p>

      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
        <div className="absolute top-[-32px] right-[-32px] w-16 h-16 bg-primary/20 rotate-45 group-hover:bg-primary/40 transition-colors" />
      </div>
    </motion.div>
  );
};

const Services = () => {
  return (
    <section id="services" className="py-16 sm:py-28 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute left-[-10%] top-[20%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3 px-1 border-l-2 border-primary">
            Τι κάνουμε
          </p>
          <h2 className="text-4xl md:text-5xl font-heading font-bold">
            Υπηρεσίες
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
