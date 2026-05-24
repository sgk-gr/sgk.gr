"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BLOG_POSTS } from "@/data/blog-posts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, ArrowRight } from "lucide-react";

const BlogClient = () => {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
            <Navbar />

            <main className="pt-32 pb-20">
                <div className="container mx-auto px-6">
                    {/* Header */}
                    <div className="max-w-3xl mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <p className="text-primary font-heading text-xs tracking-[0.2em] uppercase mb-4">
                                Insights & Knowledge
                            </p>
                            <h1 className="text-5xl md:text-7xl font-heading font-bold leading-tight mb-6">
                                Το Blog της <span className="text-gradient">SGK Software Development</span>
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Σκέψεις, οδηγοί και στρατηγικές για το πώς η τεχνολογία μπορεί να εκτοξεύσει την επιχείρησή σας.
                            </p>
                        </motion.div>
                    </div>

                    {/* Posts Grid */}
                    <div className="grid md:grid-cols-2 gap-10">
                        {BLOG_POSTS.map((post, index) => (
                            <motion.article
                                key={post.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="group flex flex-col"
                            >
                                <Link href={`/blog/${post.slug}`} className="block overflow-hidden rounded-2xl mb-6 relative aspect-[16/9]">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </Link>

                                <div className="flex items-center gap-4 mb-4 text-xs font-medium text-muted-foreground uppercase tracking-widest">
                                    <span className="text-primary">{post.category}</span>
                                    <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={12} />
                                        {post.date}
                                    </div>
                                </div>

                                <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4 leading-snug group-hover:text-primary transition-colors">
                                    <Link href={`/blog/${post.slug}`}>
                                        {post.title}
                                    </Link>
                                </h2>

                                <p className="text-muted-foreground leading-relaxed mb-6 line-clamp-2">
                                    {post.excerpt}
                                </p>

                                <Link
                                    href={`/blog/${post.slug}`}
                                    className="mt-auto inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest group/link"
                                >
                                    Διαβάστε Περισσότερα
                                    <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-1" />
                                </Link>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default BlogClient;
