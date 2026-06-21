"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MessageSquare, ShoppingBag, Receipt, LineChart, Workflow, BrainCircuit } from "lucide-react";

const agents = [
  {
    title: "Customer Support Agent",
    description: "Απαντά σε ερωτήσεις πελατών 24/7, διαχειρίζεται tickets και κλιμακώνει μόνο όταν χρειάζεται.",
    icon: <MessageSquare size={24} className="text-white" />,
    color: "bg-[#3b5bdb]"
  },
  {
    title: "eShop Operations Agent",
    description: "Διαχείριση παραγγελιών, stock updates, επιστροφές και ενημέρωση πελατών — αυτόματα.",
    icon: <ShoppingBag size={24} className="text-black" />,
    color: "bg-[#4ade80]"
  },
  {
    title: "Invoicing & Finance Agent",
    description: "Αυτόματη τιμολόγηση, payment reminders, αναφορές εσόδων και συμφιλίωση πληρωμών.",
    icon: <Receipt size={24} className="text-black" />,
    color: "bg-[#facc15]"
  },
  {
    title: "Data Analysis Agent",
    description: "Αναλύει δεδομένα, δημιουργεί reports και προτείνει αποφάσεις βασισμένες σε insights.",
    icon: <LineChart size={24} className="text-white" />,
    color: "bg-[#ff9a9e]"
  },
  {
    title: "Workflow Automation Agent",
    description: "Αυτοματοποιεί επαναλαμβανόμενα tasks, onboarding, follow-ups και εσωτερικές διαδικασίες.",
    icon: <Workflow size={24} className="text-white" />,
    color: "bg-[#3b5bdb]"
  },
  {
    title: "Custom AI Agent",
    description: "Εκπαιδεύουμε agents προσαρμοσμένους 100% στις ανάγκες και τα δεδομένα της εταιρείας σας.",
    icon: <BrainCircuit size={24} className="text-black" />,
    color: "bg-[#4ade80]"
  },
];

const AIAgentsShowcase = () => {
  return (
    <section className="py-24 bg-[#111111] text-white relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <p className="font-heading font-bold text-xs tracking-[0.2em] uppercase mb-4 text-[#4ade80]">
            AI Agentic Systems
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-[1.1] mb-6">
            AI Agents που
            <br />
            <span className="text-[#3b5bdb]">δουλεύουν για εσάς</span>
          </h2>
          <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Εκπαιδεύουμε και δημιουργούμε AI agents που αναλαμβάνουν πραγματικές
            εργασίες στην επιχείρησή σας. Μέσα από ένα απλό chat, ο agent
            διαχειρίζεται πελάτες, τιμολόγια, παραγγελίες — τα πάντα.
          </p>
        </motion.div>

        {/* Agent cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {agents.map((agent, i) => (
            <motion.div
              key={agent.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${agent.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {agent.icon}
              </div>
              <h3 className="font-heading font-bold text-xl mb-3">
                {agent.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
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
          className="rounded-3xl bg-white text-black p-8 md:p-12 flex flex-col md:flex-row items-center gap-12 shadow-2xl"
        >
          {/* Mini chat simulation */}
          <div className="flex-1 w-full max-w-md space-y-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#3b5bdb] flex items-center justify-center shrink-0">
                <BrainCircuit size={14} className="text-white" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white border border-gray-100 text-sm font-medium shadow-sm">
                Γεια σας! Πώς μπορώ να σας βοηθήσω σήμερα;
              </div>
            </div>
            <div className="flex items-start gap-3 justify-end">
              <div className="px-4 py-3 rounded-2xl rounded-tr-sm bg-[#4ade80] text-black text-sm font-bold shadow-sm">
                Θέλω να δω τις παραγγελίες της εβδομάδας
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#3b5bdb] flex items-center justify-center shrink-0">
                <BrainCircuit size={14} className="text-white" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white border border-gray-100 text-sm shadow-sm leading-relaxed font-medium">
                Αυτή την εβδομάδα έχετε <span className="text-[#3b5bdb] font-bold">47 παραγγελίες</span>, αξίας €12.340. Θέλετε αναλυτικό report;
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center md:text-left flex-1">
            <h3 className="text-3xl font-heading font-bold mb-4">
              Ένας agent, άπειρες δυνατότητες
            </h3>
            <p className="text-base text-gray-600 mb-8 max-w-sm mx-auto md:mx-0">
              Δείτε πώς ένας AI agent μπορεί να αλλάσει τον τρόπο που λειτουργεί η επιχείρησή σας.
            </p>
            <Link
              href="/estimate"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#3b5bdb] text-white font-bold rounded-xl hover:bg-[#2b4bba] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 w-full sm:w-auto"
            >
              Δωρεάν Consultation
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AIAgentsShowcase;
