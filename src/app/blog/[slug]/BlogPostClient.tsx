"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Share2, Clock } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

interface BlogPostClientProps {
    slug: string;
    initialPost: any;
}

const BlogPostClient = ({ slug, initialPost: post }: BlogPostClientProps) => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!post) return null;

    // Structured Data for SEO (can be added via script tag in return or better via Next.js metadata as LD+JSON)
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "image": post.image,
        "author": {
            "@type": "Person",
            "name": post.author
        },
        "datePublished": "2026-02-23", // Simplified for schema
        "publisher": {
            "@type": "Organization",
            "name": "SGK Software Development",
            "logo": {
                "@type": "ImageObject",
                "url": "https://sgk.gr/assets/sgk-logo.png"
            }
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <Navbar />

            <main className="pt-32 pb-20">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        {/* Back Link */}
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-12 group"
                        >
                            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                            Πίσω στο Blog
                        </Link>

                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="mb-12"
                        >
                            <div className="flex items-center gap-4 mb-6 text-xs font-medium text-primary uppercase tracking-widest">
                                <span>{post.category}</span>
                                <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Clock size={12} />
                                    5 min read
                                </div>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-heading font-bold leading-tight mb-8">
                                {post.title}
                            </h1>

                            <div className="flex items-center justify-between py-6 border-y border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-heading font-bold text-primary text-sm">
                                        SGK
                                    </div>
                                    <div>
                                        <p className="font-bold">{post.author}</p>
                                        <p className="text-xs text-muted-foreground">{post.date}</p>
                                    </div>
                                </div>

                                <button
                                    className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                                    aria-label="Share article"
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        toast.success("Link copied to clipboard!");
                                    }}
                                >
                                    <Share2 size={20} />
                                </button>
                            </div>
                        </motion.div>

                        {/* Featured Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="rounded-3xl overflow-hidden mb-16 aspect-[21/9]"
                        >
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </motion.div>

                        {/* Content */}
                        <motion.article
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="prose prose-invert prose-lg max-w-none 
                prose-headings:font-heading prose-headings:font-bold prose-headings:text-white
                prose-p:text-muted-foreground prose-p:leading-relaxed
                prose-strong:text-white prose-strong:font-bold
                prose-blockquote:border-primary prose-blockquote:bg-white/5 prose-blockquote:p-6 prose-blockquote:rounded-r-xl"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* Footer CTA */}
                        <div className="mt-20 p-12 rounded-3xl bg-primary/5 border border-primary/10 text-center">
                            <h3 className="text-2xl font-heading font-bold mb-4 text-white">Θέλετε να εκτοξεύσετε την επιχείρησή σας;</h3>
                            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                                Είμαστε εδώ για να σας βοηθήσουμε να υλοποιήσετε την επόμενη μεγάλη ψηφιακή σας ιδέα με AI και custom λύσεις.
                            </p>
                            <Link
                                href="/estimate"
                                className="inline-flex items-center justify-center px-10 py-4 bg-primary text-primary-foreground font-heading font-bold rounded-sm hover:scale-105 transition-all"
                            >
                                Ξεκινήστε Σήμερα
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default BlogPostClient;
