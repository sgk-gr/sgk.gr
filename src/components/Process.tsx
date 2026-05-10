"use client";

import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Συζήτηση",
    description: "Κατανοούμε τις ανάγκες σας, τους στόχους και το κοινό σας. Κάθε project ξεκινα με μια ειλικρινή συζήτηση.",
  },
  {
    step: "02",
    title: "Στρατηγική & Design",
    description: "Σχεδιάζουμε τη δομή, το UX/UI και την τεχνική αρχιτεκτονική. Τίποτα δεν αφήνεται στην τύχη.",
  },
  {
    step: "03",
    title: "Development",
    description: "Γράφουμε καθαρό, scalable κώδικα. Σας κρατάμε ενήμερους σε κάθε βήμα με demos και updates.",
  },
  {
    step: "04",
    title: "Launch & Support",
    description: "Deployment, testing, optimization. Και μετά; Συνεχής υποστήριξη για να τρέχει όλα ομαλά.",
  },
];

const Process = () => {
  return (
    <section id="process" className="py-16 sm:py-28 bg-secondary/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
            Η Διαδικασία
          </p>
          <h2 className="text-4xl md:text-5xl font-heading font-bold">
            Πώς δουλεύουμε
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative"
            >
              <div className="p-8 rounded-lg bg-card border border-border h-full">
                <span className="text-5xl font-heading font-bold text-primary/15 absolute top-4 right-6">
                  {item.step}
                </span>

                <h3 className="text-lg font-heading font-semibold mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
