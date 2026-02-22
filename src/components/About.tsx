import { motion } from "framer-motion";

const About = () => {
  return (
    <section id="about" className="py-16 sm:py-28 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
              Ποιοι είμαστε
            </p>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Τεχνολογία με <span className="text-gradient">Στρατηγική</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Με περισσότερα από <span className="text-foreground font-semibold">18 χρόνια εμπειρίας</span> στον χώρο της πληροφορικής, η SGK είναι ένα digital agency που συνδυάζει βαθιά τεχνική γνώση με
              στρατηγική σκέψη. Εξειδικευόμαστε σε eCommerce, web development και
              AI automation.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Από WordPress eshops μέχρι custom React applications και AI agentic
              systems — κάθε project αντιμετωπίζεται με τον ίδιο ζήλο για ποιότητα
              και performance, έχοντας ως βάση την πολυετή μας διαδρομή στην αγορά.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="grid grid-cols-2 gap-6"
          >
            {[
              { number: "18", label: "Χρόνια Εμπειρίας" },
              { number: "50+", label: "Projects" },
              { number: "100%", label: "Αφοσίωση" },
              { number: "AI", label: "Powered" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-6 rounded-lg bg-card border border-border text-center hover:border-primary/30 transition-colors"
              >
                <p className="text-3xl font-heading font-bold text-gradient mb-1">
                  {stat.number}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
