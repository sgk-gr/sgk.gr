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
    <section id="process" className="py-24 bg-[#facc15] relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-heading font-bold text-xs tracking-[0.2em] uppercase mb-4 text-black/60">
            Η Διαδικασία
          </p>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-black">
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
              <div className="p-8 rounded-3xl bg-white border border-black/5 h-full shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <span className="text-5xl font-heading font-black text-[#facc15] absolute top-6 right-6 opacity-30">
                  {item.step}
                </span>

                <h3 className="text-xl font-heading font-bold mb-3 text-black">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">
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
