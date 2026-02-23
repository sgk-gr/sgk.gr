import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Διαχειριστής Harmony",
    role: "Owner, Harmony Apartments",
    text: "Το σύστημα κρατήσεων και ο channel manager που μας υλοποίησαν άλλαξε τον τρόπο που δουλεύουμε. Τέρμα πια τα double bookings και η χειροκίνητη ενημέρωση σε Booking και Airbnb. Εξοικονόμηση χρόνου πάνω από 80%!",
    rating: 5,
  },
  {
    name: "Νίκος Σ.",
    role: "Founder, yolo8 Car Rental",
    text: "Με το έξυπνο σύστημα κρατήσεων και το AI support agent, είδαμε 3πλασιασμό των online κρατήσεών μας. Οι πελάτες παίρνουν απαντήσεις 24/7 και εμείς επικεντρωνόμαστε μόνο στην παράδοση των αυτοκινήτων.",
    rating: 5,
  },
  {
    name: "Μαρία Γ.",
    role: "HR Director, Tech Recruiting Platform",
    text: "Η AI HR πλατφόρμα Rekrua με το candidate rating system μας γλίτωσε από αμέτρητες ώρες manual screening. Η διαδικασία πρόσληψης έγινε 2 φορές ταχύτερη και πολύ πιο αξιόπιστη.",
    rating: 5,
  },
  {
    name: "Κώστας Γ.",
    role: "CEO, Glavinas Energy Solutions",
    text: "Από την πρώτη κιόλας εβδομάδα βρεθήκαμε στο Top 5 της Google για τα keywords που μας ενδιέφεραν. Τα 40+ leads που παίρνουμε κάθε μήνα έχουν δώσει τεράστια ώθηση στην επιχείρησή μας.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 sm:py-28 bg-secondary/20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
            Testimonials
          </p>
          <h2 className="text-4xl md:text-5xl font-heading font-bold">
            Τι λένε για εμάς
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-7 rounded-lg bg-card border border-border flex flex-col hover:border-primary/30 transition-colors group"
            >

              <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-5">
                "{t.text}"
              </p>

              <div>
                <p className="font-heading font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
