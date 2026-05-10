"use client";

import { motion } from "framer-motion";

const technologies = [
  { name: "React", category: "Frontend" },
  { name: "TypeScript", category: "Frontend" },
  { name: "Next.js", category: "Frontend" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "WordPress", category: "CMS" },
  { name: "WooCommerce", category: "eCommerce" },
  { name: "Node.js", category: "Backend" },
  { name: "Python", category: "Backend" },
  { name: "PostgreSQL", category: "Database" },
  { name: "MongoDB", category: "Database" },
  { name: "OpenAI", category: "AI" },
  { name: "LangChain", category: "AI" },
  { name: "Docker", category: "DevOps" },
  { name: "AWS", category: "Cloud" },
  { name: "Stripe", category: "Payments" },
  { name: "Git", category: "DevOps" },
];

const TechStack = () => {
  return (
    <section className="py-16 sm:py-28 bg-secondary/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
            Tech Stack
          </p>
          <h2 className="text-4xl md:text-5xl font-heading font-bold">
            Τεχνολογίες
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Χρησιμοποιούμε τα πιο σύγχρονα εργαλεία για να εξασφαλίσουμε ταχύτητα, ασφάλεια και scalability.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto"
        >
          {technologies.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              className="px-5 py-3 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors duration-300 group cursor-default"
            >
              <span className="font-heading font-medium text-sm group-hover:text-primary transition-colors">
                {tech.name}
              </span>
              <span className="text-xs text-muted-foreground ml-2">
                {tech.category}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TechStack;
