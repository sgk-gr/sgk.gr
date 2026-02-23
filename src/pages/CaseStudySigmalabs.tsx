import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowLeft, Bot, ShoppingCart, BarChart3, Mail, Sparkles, MessageSquare, Package, Receipt, Users, TrendingUp, Image, Share2, FileText, Eye, Zap, Globe, Search, Brain, Mic, Upload, MousePointer, Lightbulb, ListChecks, Gauge } from "lucide-react";
import { Link } from "react-router-dom";

const techStack = [
  "React", "Node.js", "Supabase", "PostgreSQL", "DigitalOcean Server",
  "Resend API", "OpenAI GPT-5.2 Fine-tuned", "Google Gemini",
  "Anthropic Claude", "ACP for ChatGPT", "Edge Functions", "Stripe",
  "Webhooks", "Checkout & Subscriptions", "Email Notifications",
];

const chatCommands = [
  {
    icon: Package,
    title: "Εντολές Παραγγελιών",
    description: "Διαχείριση παραγγελιών με απλές εντολές",
    commands: [
      "\"Δείξε τελευταίες παραγγελίες\"",
      "\"Λεπτομέρειες παραγγελίας #1234\"",
      "\"Βρες παραγγελίες πελάτη με email\"",
      "\"Άλλαξε status παραγγελίας\"",
      "\"Διέγραψε παραγγελία\"",
    ],
  },
  {
    icon: ShoppingCart,
    title: "Εντολές Προϊόντων",
    description: "AI-powered διαχείριση προϊόντων",
    commands: [
      "\"Προϊόντα με χαμηλό stock (κάτω από 5)\"",
      "\"Αύξησε/Μείωσε τιμές κατά X%\"",
      "\"Φτιάξε AI περιγραφή για [προϊόν]\"",
      "\"SEO ανάλυση για [προϊόν]\"",
      "\"Ενημέρωσε stock για [προϊόν]\"",
    ],
  },
  {
    icon: Receipt,
    title: "Εντολές Κουπονιών",
    description: "Δημιουργία και διαχείριση εκπτώσεων",
    commands: [
      "\"Φτιάξε κουπόνι X% έκπτωση\"",
      "\"Κουπόνι με ελάχιστη παραγγελία X€\"",
      "\"Λίστα κουπονιών\"",
      "\"Διέγραψε κουπόνι [code]\"",
    ],
  },
  {
    icon: Users,
    title: "Εντολές Πελατών",
    description: "CRM λειτουργίες με AI",
    commands: [
      "\"Βρες πελάτη με email\"",
      "\"Ιστορικό αγορών πελάτη\"",
      "\"Στείλε email στον πελάτη\"",
      "\"Bulk email σε πολλούς πελάτες\"",
    ],
  },
  {
    icon: BarChart3,
    title: "Εντολές Analytics",
    description: "Insights για το e-shop σου",
    commands: [
      "\"Πώς πάει το eShop μου;\"",
      "\"Ανάλυση πωλήσεων\"",
      "\"Top customers\"",
      "\"Customer retention risk\"",
    ],
  },
];

const chatFeatures = [
  { icon: Mic, title: "Φωνητική Εισαγωγή", desc: "Speech-to-text με Whisper API" },
  { icon: Upload, title: "Upload Εικόνων", desc: "Ανάλυση εικόνων με GPT-4 Vision" },
  { icon: Zap, title: "Streaming Responses", desc: "Real-time απαντήσεις" },
  { icon: Lightbulb, title: "Dynamic Suggestions", desc: "AI-generated follow-up ερωτήσεις" },
  { icon: ListChecks, title: "Multi-Action Tasks", desc: "Πολλαπλές ενέργειες σε ένα prompt" },
  { icon: Brain, title: "Deep Thinking Mode", desc: "Ενισχυμένη ανάλυση για Business users" },
];

const dashboardWidgets = [
  { icon: Brain, title: "AI Training Progress", desc: "Πρόοδος εκπαίδευσης AI (60 ημέρες)" },
  { icon: TrendingUp, title: "Top Products", desc: "Τα 5 best-selling προϊόντα" },
  { icon: Lightbulb, title: "Quick Tips", desc: "AI-generated marketing tips" },
  { icon: Mail, title: "Email Campaign Stats", desc: "Στατιστικά email campaigns" },
  { icon: Gauge, title: "Marketing Progress", desc: "Πρόοδος marketing goals" },
  { icon: Search, title: "Google Trends", desc: "Real-time δεδομένα αναζητήσεων" },
  { icon: Eye, title: "Website Preview", desc: "Live preview του e-shop" },
];

const analyticsFeatures = [
  "Revenue Analysis — Έσοδα, μέσος όρος παραγγελίας, growth",
  "Customer Insights — Top customers, repeat purchase rate",
  "Product Performance — Best/worst sellers, dead stock",
  "Seasonal Trends — Μηνιαία patterns πωλήσεων",
  "Predictive Analytics — AI-powered προβλέψεις",
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const CaseStudySigmalabs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Sigmalabs AI Case Study | Agentic AI για E-commerce — SGK Digital</title>
        <meta name="description" content="Case study: Το πρώτο παγκοσμίως Agentic AI για e-commerce. Διαχείριση WooCommerce & Shopify με AI, αυτόματα analytics, email campaigns, AI product descriptions και social media posts." />
        <meta name="keywords" content="agentic ai, ai e-commerce, woocommerce ai, shopify ai, ai agent, ai για eshop, διαχείριση eshop ai, openai, chatgpt, αυτοματισμός e-commerce" />
        <link rel="canonical" href="https://sgk.gr/case-study/sigmalabs-ai" />
        <meta property="og:title" content="Sigmalabs AI — Agentic AI for E-commerce | SGK Digital" />
        <meta property="og:description" content="AI agent που διαχειρίζεται WooCommerce & Shopify: παραγγελίες, προϊόντα, analytics, email campaigns." />
        <meta property="og:url" content="https://sgk.gr/case-study/sigmalabs-ai" />
      </Helmet>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center">
          <Link
            to="/#portfolio"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Πίσω στο Portfolio
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <motion.div {...fadeUp} className="max-w-4xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-heading font-semibold tracking-wider uppercase mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Case Study
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-[1.05] mb-6">
              Sigmalabs AI
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mb-8">
              Το πρώτο παγκοσμίως <span className="text-foreground font-medium">Agentic AI για e-commerce</span> που ελέγχει και εκτελεί εργασίες σε WooCommerce και Shopify.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Agentic AI", "WooCommerce", "Shopify", "React", "Node.js", "Supabase", "OpenAI", "Stripe"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 text-xs font-medium bg-secondary text-secondary-foreground rounded-full"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl">
            <motion.div {...fadeUp}>
              <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                Το Ζητούμενο
              </p>
              <h2 className="text-3xl font-heading font-bold mb-4">
                Πρόβλημα
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                E-commerce επιχειρήσεις χρειάζονταν αυτοματοποιημένη διαχείριση καταστημάτων και actionable insights χωρίς χειροκίνητη ανάλυση.
              </p>
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }}>
              <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                Τι Υλοποιήσαμε
              </p>
              <h2 className="text-3xl font-heading font-bold mb-4">
                Λύση
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Φτιάξαμε το Sigmalabs AI, το πρώτο παγκοσμίως Agentic AI για e-commerce. Ελέγχει και εκτελεί εργασίες σε WooCommerce και Shopify shops, στέλνει email δύο φορές την εβδομάδα με actionable recommendations και analytics.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div {...fadeUp} className="mb-10">
            <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
              Τεχνολογίες & Εργαλεία
            </p>
            <h2 className="text-3xl font-heading font-bold">
              Tech Stack
            </h2>
          </motion.div>
          <motion.div {...fadeUp} className="flex flex-wrap gap-3 max-w-4xl">
            {techStack.map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className="px-4 py-2.5 rounded-lg bg-card border border-border text-sm font-heading font-medium hover:border-primary/30 transition-colors"
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* AI Chat Assistant */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-16 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-heading font-semibold tracking-wider uppercase mb-6">
              <Bot className="w-3.5 h-3.5" />
              Κύρια Λειτουργία
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              AI Chat Assistant
            </h2>
            <p className="text-muted-foreground text-lg">
              Ο AI assistant σου επιτρέπει να διαχειρίζεσαι το e-shop σου με φυσική γλώσσα.
            </p>
          </motion.div>

          {/* Chat Features Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16 max-w-4xl mx-auto">
            {chatFeatures.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <f.icon className="w-4 h-4 text-primary" />
                </div>
                <h4 className="font-heading font-semibold text-sm mb-1">{f.title}</h4>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Command Groups */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {chatCommands.map((group, i) => (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="p-7 rounded-xl bg-card border border-border"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <group.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading font-semibold mb-1">{group.title}</h3>
                <p className="text-xs text-muted-foreground mb-4">{group.description}</p>
                <ul className="space-y-2">
                  {group.commands.map((cmd) => (
                    <li
                      key={cmd}
                      className="text-xs text-muted-foreground bg-secondary/60 px-3 py-2 rounded-md font-mono"
                    >
                      {cmd}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Product Description Generator */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start max-w-5xl">
            <motion.div {...fadeUp}>
              <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
                Feature
              </p>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                AI Product Description Generator
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Αυτόματη δημιουργία περιγραφών προϊόντων με AI Vision.
              </p>
              <ul className="space-y-3">
                {[
                  { icon: Eye, text: "Vision-based Generation — Το AI αναλύει την εικόνα του προϊόντος" },
                  { icon: Search, text: "SEO-Optimized — Περιγραφές βελτιστοποιημένες για μηχανές αναζήτησης" },
                  { icon: MousePointer, text: "One-Click Update — Άμεση ενημέρωση στο WooCommerce/Shopify" },
                  { icon: Globe, text: "Multi-language — Υποστήριξη Ελληνικών και Αγγλικών" },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <item.icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    {item.text}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="p-6 rounded-xl bg-card border border-border"
            >
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-heading mb-4">
                Ροή Λειτουργίας
              </p>
              <div className="space-y-4">
                {[
                  "Χρήστης: \"Φτιάξε νέα περιγραφή για το Nike Air Max\"",
                  "AI τραβάει screenshot της εικόνας προϊόντος",
                  "GPT-4 Vision αναλύει και γράφει περιγραφή",
                  "Χρήστης εγκρίνει → ενημερώνεται αυτόματα στο store",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-muted-foreground">{step}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Profile Dashboard */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <motion.div {...fadeUp} className="mb-12">
            <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
              Profile Dashboard
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Όλα τα δεδομένα σε μια οθόνη
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {dashboardWidgets.map((w, i) => (
              <motion.div
                key={w.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <w.icon className="w-4 h-4 text-primary" />
                </div>
                <h4 className="font-heading font-semibold text-sm mb-1">{w.title}</h4>
                <p className="text-xs text-muted-foreground">{w.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Integrations callout */}
          <motion.div
            {...fadeUp}
            className="mt-8 p-6 rounded-xl bg-card border border-border flex flex-col sm:flex-row items-start sm:items-center gap-4 max-w-2xl"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Share2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-heading font-semibold text-sm mb-1">Integrations</h4>
              <p className="text-xs text-muted-foreground">
                Google Analytics 4, Klaviyo email marketing (Premium/Business)
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Advanced Analytics */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div {...fadeUp} className="mb-10">
            <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
              Business Plan
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Advanced Analytics
            </h2>
            <p className="text-muted-foreground">
              Βαθιά ανάλυση για το e-commerce σου.
            </p>
          </motion.div>

          <motion.div {...fadeUp} className="space-y-3">
            {analyticsFeatures.map((f, i) => (
              <motion.div
                key={f}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border"
              >
                <BarChart3 className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">{f}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Extra Report */}
          <motion.div
            {...fadeUp}
            className="mt-8 p-6 rounded-xl bg-card border border-primary/20 glow-border"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-heading font-semibold mb-1">Extra Report Feature</h4>
                <p className="text-sm text-muted-foreground">
                  On-demand αναλυτική αναφορά με progress bar κατά τη δημιουργία. Ημερήσιο limit για αποφυγή spam.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI Social Media Post Generator */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
              Feature
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              AI Social Media Post Generator
            </h2>
            <p className="text-muted-foreground">
              Δημιουργία social media posts με AI.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { icon: Share2, title: "Platform-Specific", desc: "Διαφορετικό style για Instagram vs Facebook" },
              { icon: ShoppingCart, title: "Product-Based", desc: "Posts για συγκεκριμένα προϊόντα" },
              { icon: TrendingUp, title: "Engagement-Optimized", desc: "Με emojis και CTAs" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="p-6 rounded-xl bg-card border border-border text-center"
              >
                <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-heading font-semibold text-sm mb-2">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Result */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <motion.div {...fadeUp}>
            <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
              Το Αποτέλεσμα
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Αυτοματοποιημένη διαχείριση e-commerce
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              AI-driven recommendations και αναλύσεις που εξοικονομούν χρόνο και αυξάνουν τα έσοδα.
            </p>
            <Link
              to="/estimate"
              className="flex-1 px-4 py-2 border border-primary/20 bg-primary/10 text-primary text-[10px] font-bold rounded-lg hover:bg-primary/20 transition-all text-center flex items-center justify-center gap-2"
            >
              Ζητήστε Προσφορά
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer spacer */}
      <div className="h-16 bg-background" />
    </div>
  );
};

export default CaseStudySigmalabs;
