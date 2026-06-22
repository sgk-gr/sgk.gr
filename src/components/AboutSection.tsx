"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutSection() {
  return (
    <section className="w-full bg-white py-12 md:py-16 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row relative items-center">
          
          {/* Left Side: Large Image */}
          <div className="w-full md:w-[60%] relative h-[350px] md:h-[600px] z-0">
            {/* We use an existing image as placeholder. User can change later. */}
            <Image 
              src="/sgk-team.png" 
              alt="SGK Software Development Team" 
              fill
              className="object-cover shadow-2xl"
              priority
            />
          </div>

          {/* Right Side: Content Box overlapping the image */}
          <div className="w-full md:w-[45%] bg-[#4ade80] p-6 md:p-10 relative z-10 md:-ml-[10%] mt-[-40px] md:mt-0 shadow-2xl border border-[#4ade80] flex flex-col justify-center">
            <h2 className="text-black text-3xl md:text-4xl font-light mb-5 tracking-wide">
              Ποιοι είμαστε
            </h2>
            
            <p className="text-black font-bold text-base md:text-lg mb-5 leading-relaxed">
              Η SGK Digital είναι η κορυφαία ελληνική εταιρεία κατασκευής ψηφιακών εφαρμογών, πλατφορμών νέας γενιάς και έξυπνων εργαλείων, προσφέροντας λύσεις που εκτοξεύουν την επιχείρησή σου, χωρίς τεχνικές γνώσεις.
            </p>
            
            <ul className="space-y-2.5 mb-6">
              <li className="flex items-center text-black/90 text-sm md:text-[15px]">
                <span className="w-2.5 h-2.5 bg-black mr-3 shrink-0"></span>
                Χωρίς κρυφές χρεώσεις και στημένα πακέτα.
              </li>
              <li className="flex items-center text-black/90 text-sm md:text-[15px]">
                <span className="w-2.5 h-2.5 bg-black mr-3 shrink-0"></span>
                Παράδοση Premium έργων σε χρόνους ρεκόρ.
              </li>
              <li className="flex items-center text-black/90 text-sm md:text-[15px]">
                <span className="w-2.5 h-2.5 bg-black mr-3 shrink-0"></span>
                Με ενσωματωμένο τον δικό σου AI Υπάλληλο.
              </li>
            </ul>
            
            <p className="text-black/80 text-sm leading-relaxed mb-4">
              Στόχος μας είναι να κάνουμε τον ψηφιακό κόσμο απλό, αστραπιαία γρήγορο και απόλυτα ασφαλή για όλους. Σου μιλάμε ανοιχτά, χτίζοντας τεχνολογία που φέρνει έσοδα. Λειτουργούμε με ένα 100% remote μοντέλο, έχοντας ενώσει μια δεμένη ομάδα από κορυφαίους επαγγελματίες σε διάφορα μέρη της Ελλάδας, με πάθος για τη δική σου επιτυχία.
            </p>

            <p className="text-black/80 text-sm leading-relaxed mb-6 font-medium">
              Είμαστε αφοσιωμένοι στη δημιουργία μιας <span className="font-bold text-black">κορυφαίας ψηφιακής εμπειρίας</span>, φτιαγμένη ειδικά για εσένα.
            </p>
            
            <div>
              <Link 
                href="/about" 
                className="inline-block bg-[#3b5bdb] text-white hover:bg-[#2b4bba] transition-colors duration-300 font-bold py-2.5 px-6 shadow-lg rounded-sm text-sm"
              >
                Μάθε περισσότερα
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
