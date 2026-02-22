import { motion } from "framer-motion";
import { Bot, MessageSquare, FileText, Package, BrainCircuit, Workflow, ArrowRight, Sparkles } from "lucide-react";

const agents = [
  {
    icon: MessageSquare,
    title: "Customer Support Agent",
    description: "Απαντά σε ερωτήσεις πελατών 24/7, διαχειρίζεται tickets και κλιμακώνει μόνο όταν χρειάζεται.",
  },
  {
    icon: Package,
    title: "eShop Operations Agent",
    description: "Διαχείριση παραγγελιών, stock updates, επιστροφές και ενημέρωση πελατών — αυτόματα.",
  },
  {
    icon: FileText,
    title: "Invoicing & Finance Agent",
    description: "Αυτόματη τιμολόγηση, payment reminders, αναφορές εσόδων και συμφιλίωση πληρωμών.",
  },
  {
    icon: BrainCircuit,
    title: "Data Analysis Agent",
    description: "Αναλύει δεδομένα, δημιουργεί reports και προτείνει αποφάσεις βασισμένες σε insights.",
  },
  {
    icon: Workflow,
    title: "Workflow Automation Agent",
    description: "Αυτοματοποιεί επαναλαμβανόμενα tasks, onboarding, follow-ups και εσωτερικές διαδικασίες.",
  },
  {
    icon: Bot,
    title: "Custom AI Agent",
    description: "Εκπαιδεύουμε agents προσαρμοσμένους 100% στις ανάγκες και τα δεδομένα της εταιρείας σας.",
  },
];

const AIAgentsShowcase = () => {
  return (
    <section className="py-16 sm:py-28 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-primary/4 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-heading font-semibold tracking-wider uppercase mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            AI Agentic Systems
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-[1.05] mb-6">
            AI Agents που
            <br />
            <span className="text-gradient">δουλεύουν για εσάς</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Εκπαιδεύουμε και δημιουργούμε AI agents που αναλαμβάνουν πραγματικές
            εργασίες στην επιχείρησή σας. Μέσα από ένα απλό chat, ο agent
            διαχειρίζεται πελάτες, τιμολόγια, παραγγελίες — τα πάντα.
          </p>
        </motion.div>

        {/* Agent cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {agents.map((agent, i) => (
            <motion.div
              key={agent.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="p-7 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-500 group"
            >
              <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <agent.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-heading font-semibold mb-2">
                {agent.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {agent.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Chat-style demo banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-xl bg-card border border-border p-8 md:p-10 flex flex-col md:flex-row items-center gap-8"
        >
          {/* Mini chat simulation */}
          <div className="flex-1 w-full max-w-md space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="px-4 py-2.5 rounded-lg bg-secondary text-sm text-secondary-foreground">
                Γεια σας! Πώς μπορώ να σας βοηθήσω σήμερα;
              </div>
            </div>
            <div className="flex items-start gap-3 justify-end">
              <div className="px-4 py-2.5 rounded-lg bg-primary/15 text-sm text-foreground">
                Θέλω να δω τις παραγγελίες της εβδομάδας
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="px-4 py-2.5 rounded-lg bg-secondary text-sm text-secondary-foreground">
                Αυτή την εβδομάδα έχετε <span className="text-primary font-semibold">47 παραγγελίες</span>, αξίας €12.340. Θέλετε αναλυτικό report;
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-heading font-bold mb-3">
              Ένας agent, άπειρες δυνατότητες
            </h3>
            <p className="text-sm text-muted-foreground mb-5 max-w-xs">
              Δείτε πώς ένας AI agent μπορεί να αλλάξει τον τρόπο που λειτουργεί η επιχείρησή σας.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground font-heading font-semibold rounded-md hover:opacity-90 transition-opacity glow-border"
            >
              Δωρεάν Consultation
              <ArrowRight size={18} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AIAgentsShowcase;
