"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { CheckCircle2, Sparkles, MessageSquare, TrendingUp, Search, ShoppingCart, Zap, Box, BarChart3, Users, Mail, Globe } from "lucide-react";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

export default function InnovationClient() {
  const skills = [
    { icon: <MessageSquare size={24} />, name: "Product Copywriter & SEO", desc: "Γράφει ακαταμάχητες περιγραφές προϊόντων με δομή, bullet points, meta titles & descriptions." },
    { icon: <TrendingUp size={24} />, name: "Facebook & Google Ads Specialist", desc: "Έλεγχος διαφημίσεων απευθείας από το chat. Αναλύει το ROAS/CPC." },
    { icon: <BarChart3 size={24} />, name: "Pricing & Growth Strategist", desc: "Live έρευνα ανταγωνισμού στο internet και αυτόματη βελτιστοποίηση τιμών." },
    { icon: <Mail size={24} />, name: "Email Marketing Architect", desc: "Δημιουργεί κατηγορίες, στέλνει κουπόνια και τρέχει email marketing αυτόματα." },
    { icon: <ShoppingCart size={24} />, name: "Skroutz Marketplace Manager", desc: "Προβολή, αποδοχή ή απόρριψη παραγγελιών Skroutz μέσα από το chat." },
    { icon: <Users size={24} />, name: "E-commerce Support Guru", desc: "Live AI Customer Support Widget ενσωματωμένο στο eShop." }
  ];

  return (
    <div className="bg-white min-h-screen text-black font-sans selection:bg-[#3b5bdb] selection:text-white flex flex-col pt-[48px] lg:pt-[48px]">
      <Navbar />

      <main className="flex-grow flex flex-col items-center w-full">
        
        {/* SECTION 1: Blue Block (Η Καινοτομία στην SGK - SigmaLabs) */}
        <section className="relative w-full bg-[#f4f2ea] overflow-hidden min-h-[600px] md:min-h-[700px] flex items-center">
          {/* Right side image */}
          <div className="absolute inset-0 md:left-1/2 w-full md:w-1/2 h-1/2 md:h-full top-0 md:top-0">
            <div className="relative w-full h-full">
              <Image 
                src="/sig.png" 
                alt="SigmaLabs AI Innovation" 
                fill 
                className="object-contain object-center"
                priority
              />
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
          </div>

          {/* Left side blue block */}
          <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row mt-[50vh] md:mt-0">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full md:w-[55%] lg:w-[45%] bg-[#3b5bdb] p-8 md:p-12 lg:p-16 text-white shadow-2xl md:my-16 relative"
            >
              <div className="text-xl font-bold mb-4 opacity-90">
                Παγκόσμια πρωτοπορία
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Ο Πρώτος Agentic <br/>Copilot για eShops
              </h1>
              <p className="text-xl md:text-2xl font-light text-white/90 mb-6 leading-relaxed">
                Πριν από 3 χρόνια, η ομάδα της SGK οραματίστηκε και δημιούργησε το SigmaLabs AI. Μια τεχνολογία που άλλαξε τα δεδομένα στο ηλεκτρονικό εμπόριο.
              </p>
              <p className="text-lg leading-relaxed font-light">
                Αντί για ένα απλό chatbot, αναπτύξαμε έναν ολοκληρωμένο Agentic Copilot. Το όραμά μας ήταν απλό αλλά επαναστατικό: Να μιλάς στο eShop σου σαν σε συνεργάτη. Να ρωτάς, να διατάζεις, να αποφασίζεις — και το AI να αναλύει, να εκτελεί και να ειδοποιεί. Εμείς το φτιάξαμε πρώτοι.
              </p>
            </motion.div>
          </div>
        </section>

        {/* SECTION 2: Pink Block (Vibe Commerce) */}
        <section className="relative w-full bg-white overflow-hidden min-h-[600px] md:min-h-[700px] flex items-center">
          {/* Left side image */}
          <div className="absolute inset-0 md:right-1/2 w-full md:w-1/2 h-1/2 md:h-full top-0 md:top-0">
            <div className="relative w-full h-full bg-gray-50 p-8 md:p-16 flex items-center justify-center">
               <div className="bg-[#1a1a1a] rounded-2xl border border-gray-200 overflow-hidden shadow-2xl w-full max-w-lg">
                  <div className="bg-black/50 p-4 border-b border-white/10 flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                      <Sparkles size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-white">Mr. Sigma</div>
                      <div className="text-xs text-green-400">Online • SGK Engine</div>
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="flex justify-end">
                      <div className="bg-pink-600 text-white p-3 rounded-2xl rounded-tr-none max-w-[90%] text-sm">
                        Ψάξε στο internet τις τιμές Nike Air Max 90 από τους ανταγωνιστές και κάνε price match.
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-[#2a2a2a] text-white p-4 rounded-2xl rounded-tl-none max-w-[90%] shadow-lg text-sm">
                        <p className="mb-3">Βρήκα τις τιμές σε 4 ανταγωνιστές. Η χαμηλότερη είναι €124.90.</p>
                        <div className="bg-black/40 p-3 rounded-lg border border-white/5 mb-3">
                          <div className="text-xs text-gray-400">Προτεινόμενη Ενέργεια</div>
                          <div className="font-bold">Αλλαγή τιμής σε €124.00</div>
                        </div>
                        <button 
                          onClick={() => toast.success("Η τιμή ενημερώθηκε επιτυχώς σε €124.00!")}
                          className="bg-white text-black text-xs font-bold py-2 px-4 rounded-lg w-full"
                        >
                          Επιβεβαίωση Αλλαγής
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </div>

          {/* Right side pink block */}
          <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row justify-end mt-[50vh] md:mt-0">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full md:w-[55%] lg:w-[45%] bg-pink-500 p-8 md:p-12 lg:p-16 text-white shadow-2xl md:my-16"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Vibe Commerce:<br/>Το eShop σου ακούει
              </h2>
              <p className="text-lg leading-relaxed mb-6 font-light text-pink-50">
                Δημιουργήσαμε ένα σύστημα όπου ο επιχειρηματίας απλά γράφει τι θέλει στο chat. Το AI (που ονομάσαμε Mr. Sigma) δημιουργεί κατηγορίες, κάνει bulk edits, τρέχει email marketing και διαχειρίζεται διαφημίσεις σε Google/Facebook εντελώς αυτόνομα.
              </p>
              <p className="text-lg leading-relaxed font-bold text-white">
                Αυτή η τεχνολογία βοηθά εκατοντάδες eShops (από solopreneurs μέχρι enterprises) να αυξάνουν τις πωλήσεις τους κατά 35% και να εξοικονομούν πάνω από 20 ώρες την εβδομάδα.
              </p>
            </motion.div>
          </div>
        </section>

        {/* SECTION 3: Yellow Block (Skills & Agents) */}
        <section className="relative w-full bg-[#f4f2ea] overflow-hidden min-h-[600px] flex items-center">
          {/* Right side image (Grid of Skills) */}
          <div className="absolute inset-0 md:left-1/2 w-full md:w-1/2 h-1/2 md:h-full top-0 md:top-0 bg-white p-8 md:p-12 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full place-content-center">
              {skills.map((skill, index) => (
                <div key={index} className="bg-gray-50 border border-gray-100 p-6 rounded-2xl hover:shadow-lg transition-all group">
                  <div className="text-[#facc15] mb-4 group-hover:scale-110 transition-transform origin-left">{skill.icon}</div>
                  <h3 className="text-lg font-bold mb-2 text-black">{skill.name}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{skill.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Left side yellow block */}
          <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row mt-[50vh] md:mt-0 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full md:w-[55%] lg:w-[45%] bg-[#facc15] p-8 md:p-12 lg:p-16 text-black shadow-2xl md:my-16 pointer-events-auto"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Εξειδικευμένοι<br/>AI Agents
              </h2>
              <p className="text-lg leading-relaxed font-light text-black/80 mb-6">
                Δεν φτιάξαμε απλά ένα γενικό AI. Σχεδιάσαμε και εκπαιδεύσαμε εξειδικευμένους Agentic ρόλους. Κάθε Skill έχει τη δική του εκπαίδευση και system prompt για κορυφαία αποτελέσματα.
              </p>
              <p className="text-lg leading-relaxed font-light text-black/80">
                Από Product Copywriters και Pricing Strategists μέχρι Facebook Ads Specialists και E-commerce Support Gurus. Ο ιδιοκτήτης του eShop απλά ενεργοποιεί το skill που χρειάζεται, και η μηχανή της SGK αναλαμβάνει τη δουλειά.
              </p>
            </motion.div>
          </div>
        </section>

        {/* SECTION 4: Green Block (Conversational SEO) */}
        <section className="relative w-full bg-white overflow-hidden min-h-[600px] flex items-center">
          {/* Left side image */}
          <div className="absolute inset-0 md:right-1/2 w-full md:w-1/2 h-1/2 md:h-full top-0 md:top-0 bg-[#f4f2ea] flex items-center justify-center p-8">
            <div className="bg-[#1a1a1a] rounded-2xl border border-gray-200 p-6 font-mono text-sm shadow-2xl w-full max-w-lg text-white">
              <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
                <Globe className="text-gray-400" size={16} />
                <span className="text-gray-400">eshop.gr/llms.txt</span>
              </div>
              <div className="text-[#4ade80] mb-2"># Κατάλογος Προϊόντων για AI Agents</div>
              <div className="text-blue-300 mb-4">&gt; Αυτόματα δημιουργημένο από SGK Engine</div>
              <div className="space-y-2 text-gray-300">
                <p>- Αντιθαμβωτικός Καθρέφτης LED [€189.00] (Σε απόθεμα)</p>
                <p>- Έξυπνη Λάμπα WiFi [€24.90] (Σε απόθεμα)</p>
                <p>- Σετ Μπάνιου Premium [€340.00] (Εξαντλήθηκε)</p>
              </div>
            </div>
          </div>

          {/* Right side green block */}
          <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row justify-end mt-[50vh] md:mt-0 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full md:w-[55%] lg:w-[45%] bg-[#4ade80] p-8 md:p-12 lg:p-16 text-black shadow-2xl md:my-16 pointer-events-auto"
            >
              <div className="text-xl font-bold mb-4 opacity-90">
                LLM SEO
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Εμφανίσου στο ChatGPT
              </h2>
              <p className="text-lg leading-relaxed font-light text-black/80 mb-6">
                Η SGK ήταν από τις πρώτες ομάδες που ενσωμάτωσε το Conversational SEO. Με το SigmaLabs AI, κάθε eShop αποκτά αυτόματα AI-ready αρχεία <code>llms.txt</code> & <code>llms-full.txt</code>.
              </p>
              <p className="text-lg leading-relaxed font-light text-black/80">
                Αυτό σημαίνει ότι τα προϊόντα γίνονται πλήρως ανιχνεύσιμα από τις AI μηχανές αναζήτησης όπως το ChatGPT και το Claude. Τα προϊόντα προτείνονται οργανικά όταν ταιριάζουν στο prompt του χρήστη, ανοίγοντας ένα εντελώς νέο κανάλι πωλήσεων που ο ανταγωνισμός αγνοεί.
              </p>
            </motion.div>
          </div>
        </section>

        {/* SECTION 5: Black Block (Skroutz & Integrations) */}
        <section className="relative w-full bg-[#f4f2ea] overflow-hidden min-h-[600px] flex items-center">
          {/* Right side image */}
          <div className="absolute inset-0 md:left-1/2 w-full md:w-1/2 h-1/2 md:h-full top-0 md:top-0">
             <div className="relative w-full h-full bg-white flex flex-col items-center justify-center p-8 md:p-16">
                 <div className="w-full max-w-md bg-white border-2 border-gray-100 rounded-2xl shadow-xl p-6">
                    <div className="flex items-center gap-3 border-b pb-4 mb-4">
                       <ShoppingCart className="text-orange-500" />
                       <span className="font-bold text-xl text-black">Skroutz Integration</span>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-bold text-sm">Παραγγελία #45829</div>
                          <div className="text-xs text-gray-500">Nike Air Max 90</div>
                        </div>
                        <div className="text-green-600 font-bold">€129.00</div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-bold text-sm">Παραγγελία #45831</div>
                          <div className="text-xs text-gray-500">Samsung Galaxy S24</div>
                        </div>
                        <div className="text-green-600 font-bold">€899.00</div>
                      </div>
                    </div>
                    <div className="mt-6 text-center text-sm text-gray-500 font-medium">
                       Συγχρονισμός μέσω chat
                    </div>
                 </div>
             </div>
          </div>

          {/* Left side black block */}
          <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row mt-[50vh] md:mt-0 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full md:w-[55%] lg:w-[45%] bg-[#111] p-8 md:p-12 lg:p-16 text-white shadow-2xl md:my-16 pointer-events-auto"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Άμεση Διασύνδεση<br/>με Skroutz
              </h2>
              <p className="text-lg leading-relaxed font-light text-gray-300 mb-6">
                Η τεχνολογική μας υποδομή δεν περιορίζεται στο δικό σου κατάστημα. Αναπτύξαμε native διασύνδεση με το Skroutz API. 
              </p>
              <p className="text-lg leading-relaxed font-light text-gray-300">
                Ο έμπορος βλέπει, αποδέχεται ή απορρίπτει παραγγελίες του Skroutz Marketplace απευθείας μέσα από το chat. Το AI αναλύει πωλήσεις και συγκρίνει στατιστικά με το eShop, εκτελώντας εντολές σε δευτερόλεπτα χωρίς να απαιτείται σύνδεση σε εξωτερικά panels.
              </p>
            </motion.div>
          </div>
        </section>

      </main>

      {/* Final Tech CTA (No Pricing, just capability) */}
      <section className="w-full bg-[#facc15] py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-8">
            Αυτή είναι η δύναμη της SGK
          </h2>
          <p className="text-xl text-black/80 mb-10 font-medium leading-relaxed">
            Το SigmaLabs AI είναι η απόδειξη ότι μπορούμε να δημιουργήσουμε τεχνολογία αιχμής σε παγκόσμιο επίπεδο. Φανταστείτε τι μπορούμε να χτίσουμε για τη δική σας επιχείρηση.
          </p>
          <Link 
            href="/estimate"
            className="inline-block bg-black text-white hover:bg-gray-900 transition-colors duration-300 font-bold py-4 px-10 rounded-full text-lg shadow-xl"
          >
            Εκτίμηση Έργου
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
