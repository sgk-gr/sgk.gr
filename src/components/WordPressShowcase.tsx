"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Rocket, Search } from "lucide-react";

const features = [
  {
    title: "< 1s Load Time",
    description: "Optimized κώδικας, caching και CDN για instant page loads.",
    icon: <Zap size={24} className="text-[#3b5bdb]" />,
    color: "bg-[#3b5bdb]/10"
  },
  {
    title: "100/100 PageSpeed",
    description: "Core Web Vitals στο πράσινο — κάθε φορά, χωρίς συμβιβασμούς.",
    icon: <Rocket size={24} className="text-[#4ade80]" />,
    color: "bg-[#4ade80]/10"
  },
  {
    title: "Enterprise Security",
    description: "SSL, firewall, anti-malware και automated backups by default.",
    icon: <Shield size={24} className="text-[#facc15]" />,
    color: "bg-[#facc15]/10"
  },
  {
    title: "SEO-Ready",
    description: "Schema markup, sitemap, meta optimization — built-in από την αρχή.",
    icon: <Search size={24} className="text-[#3b5bdb]" />,
    color: "bg-[#3b5bdb]/10"
  },
];

const WordPressShowcase = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-heading font-bold text-xs tracking-[0.2em] uppercase mb-4 text-[#3b5bdb]">
              WordPress eShops
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-[1.1] mb-6 text-black">
              eShops νέας γενιάς
              <br />
              <span className="text-[#3b5bdb]">με απίστευτη ταχύτητα</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg">
              Χτίζουμε WordPress & WooCommerce καταστήματα που φορτώνουν σε
              χιλιοστά του δευτερολέπτου. Custom θέμα, zero bloat, maximum
              performance — το eshop σας γίνεται η ταχύτερη εμπειρία αγορών
              για τους πελάτες σας.
            </p>
            <a
              href="/estimate"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#3b5bdb] text-white font-bold rounded-xl hover:bg-[#2b4bba] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Ζητήστε Προσφορά
            </a>
          </motion.div>

          {/* Right — Feature cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${f.color} group-hover:scale-110 transition-transform duration-300`}>
                  {f.icon}
                </div>
                <h3 className="font-heading font-bold text-xl mb-3 text-black">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {f.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Speed bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 p-8 md:p-10 rounded-3xl bg-gray-50 border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-10 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div>
              <p className="font-heading font-bold text-2xl text-black">Average Load Time</p>
              <p className="text-gray-500 mt-1">Τα eshops μας vs industry average</p>
            </div>
          </div>
          <div className="flex-1 max-w-lg w-full">
            <div className="flex justify-between text-sm font-bold text-gray-800 mb-2">
              <span>SGK eShops</span>
              <span className="text-[#4ade80] font-black text-lg">0.8s</span>
            </div>
            <div className="h-4 rounded-full bg-gray-200 overflow-hidden mb-6">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "20%" }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full rounded-full bg-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.5)]"
              />
            </div>
            <div className="flex justify-between text-sm font-bold text-gray-500 mb-2">
              <span>Industry Average</span>
              <span>3.7s</span>
            </div>
            <div className="h-4 rounded-full bg-gray-200 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "80%" }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.7 }}
                className="h-full rounded-full bg-gray-400"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WordPressShowcase;
