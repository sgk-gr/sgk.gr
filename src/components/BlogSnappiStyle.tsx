"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { BLOG_POSTS } from "@/data/blog-posts";
import { ChevronLeft, ChevronRight } from "lucide-react";

const LINE_COLORS = [
  { bg: "bg-[#3b5bdb]", textHover: "group-hover:text-[#3b5bdb]" },
  { bg: "bg-pink-500", textHover: "group-hover:text-pink-500" },
  { bg: "bg-[#4ade80]", textHover: "group-hover:text-[#4ade80]" },
  { bg: "bg-[#facc15]", textHover: "group-hover:text-[#facc15]" },
  { bg: "bg-purple-500", textHover: "group-hover:text-purple-500" },
  { bg: "bg-cyan-400", textHover: "group-hover:text-cyan-400" },
  { bg: "bg-amber-400", textHover: "group-hover:text-amber-400" },
];

export default function BlogSnappiStyle() {
  const sectionRef = useRef(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = current.clientWidth * 0.8;
      current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full bg-[#fcfcfc] py-20 md:py-32 relative overflow-hidden" ref={sectionRef}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header with Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-light text-left text-black tracking-wide"
          >
            Αξίζει να διαβάσεις
          </motion.h2>
        </div>

        {/* Blog Scroll Container with Floating Buttons */}
        <div className="relative group/carousel">
          
          {/* Floating Left Button */}
          <button 
            onClick={() => scroll('left')}
            className="hidden md:flex absolute -left-4 lg:-left-6 top-[35%] -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-100 items-center justify-center text-gray-700 hover:text-[#3b5bdb] hover:scale-110 transition-all duration-300 opacity-0 group-hover/carousel:opacity-100"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} strokeWidth={1.5} />
          </button>

          {/* Floating Right Button */}
          <button 
            onClick={() => scroll('right')}
            className="hidden md:flex absolute -right-4 lg:-right-6 top-[35%] -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-100 items-center justify-center text-gray-700 hover:text-[#3b5bdb] hover:scale-110 transition-all duration-300 opacity-0 group-hover/carousel:opacity-100"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} strokeWidth={1.5} />
          </button>

          {/* Scroll Area */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-x-8 pb-12 pt-4 px-4 sm:px-6 lg:px-8 -mx-4 sm:-mx-6 lg:-mx-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {BLOG_POSTS.slice(0, 8).map((post, index) => {
              const colorTheme = LINE_COLORS[index % LINE_COLORS.length];
              
              return (
                <motion.div 
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex flex-col group cursor-pointer min-w-[300px] md:min-w-[380px] max-w-[300px] md:max-w-[380px] flex-shrink-0 snap-start"
                >
                  <Link href={`/blog/${post.slug}`} className="flex flex-col h-full w-full">
                    {/* Image Container */}
                    <div className="w-full aspect-square relative mb-0 overflow-hidden bg-gray-100">
                      <Image 
                        src={post.image || "/hero_slide_1.png"}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>

                    {/* The Line (Dynamic Color under image, Beige extending into gap) */}
                    <div className={`w-full h-1.5 ${colorTheme.bg} relative z-10 flex-shrink-0
                      ${index !== Math.min(BLOG_POSTS.length, 8) - 1 ? "md:after:content-[''] md:after:absolute md:after:left-full md:after:w-8 md:after:h-1.5 md:after:bg-[#e6e2d6]" : ""}
                    `}></div>

                    {/* Text Content */}
                    <div className="pt-6 pr-4 flex-grow flex flex-col">
                      <p className="text-[13px] text-gray-500 mb-3 tracking-wider font-light">
                        {post.date}
                      </p>
                      <h3 className={`text-xl font-light text-black leading-snug transition-colors duration-300 ${colorTheme.textHover} line-clamp-3`}>
                        {post.title}
                      </h3>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
