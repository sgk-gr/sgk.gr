"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function OrderAIAgentPage() {
    const [formData, setFormData] = useState({
        name: "",
        company: "",
        email: "",
        phone: "",
        details: "",
        packageType: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [isWidgetOpen, setIsWidgetOpen] = useState(true);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const selectPackageAndScroll = (pkg: string) => {
        setFormData({ ...formData, packageType: pkg });
        scrollToForm();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg("");

        try {
            const res = await fetch("/api/order-ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                throw new Error("Failed to submit");
            }

            setIsSuccess(true);
        } catch (err) {
            setErrorMsg("Παρουσιάστηκε σφάλμα. Παρακαλούμε δοκιμάστε ξανά.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const scrollToForm = () => {
        document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#0a0b10] selection:text-white pb-24 lg:pb-0">
            {/* Minimal Light Header */}
            <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-black tracking-tight text-[#0a0b10]">
                        SGK<span className="text-[#5b36f5]">.</span>
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link href="/liveavatar-demo" target="_blank" className="hidden md:block text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                            Live Demo
                        </Link>
                        <button 
                            onClick={scrollToForm}
                            className="px-5 py-2.5 rounded-full bg-[#0a0b10] hover:bg-slate-800 text-white text-sm font-semibold transition-colors"
                        >
                            Get started &rarr;
                        </button>
                    </div>
                </div>
            </header>

            <main>
                {/* HERO SECTION - Synthesia Style */}
                <section className="pt-40 pb-20 px-6 sm:pt-48 sm:pb-24 flex flex-col items-center text-center max-w-5xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs tracking-wide mb-8">
                        <span className="text-[#ff5c5c]">G</span> OVER 2,000 FIVE-STAR REVIEWS ON G2 ⓘ
                    </div>
                    
                    <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-[#0a0b10] mb-8 leading-[1.1]">
                        All-in-one AI Video <br className="hidden sm:block"/>
                        platform for business
                    </h1>
                    
                    <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Create studio-quality interactive avatars in 160+ languages. 
                        Save up to 90% of time and cost on customer service and sales.
                    </p>

                    <div className="flex flex-col items-center gap-4">
                        <button 
                            onClick={scrollToForm}
                            className="px-8 py-4 rounded-full bg-[#0a0b10] hover:bg-slate-800 text-white font-semibold text-lg transition-all"
                        >
                            Get started for FREE &rarr;
                        </button>
                        <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                            <span>No credit card required</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span>Rated 4.7/5 on G2</span>
                        </div>
                    </div>
                </section>

                {/* TRUST LOGOS */}
                <section className="py-12 border-t border-b border-slate-100 bg-white">
                    <p className="text-center text-sm font-medium text-slate-500 mb-8">Trusted by over 50,000 companies of all sizes</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale px-6">
                        <span className="text-xl font-bold font-serif tracking-tighter">REUTERS</span>
                        <span className="text-xl font-bold tracking-tighter">zoom</span>
                        <span className="text-xl font-bold">SAP</span>
                        <span className="text-xl font-bold">MERCK</span>
                        <span className="text-xl font-bold">Heineken</span>
                    </div>
                </section>

                {/* FEATURE BLOCKS - 2 Column Style */}
                <section className="py-32 px-6 max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#0a0b10] mb-6">
                            One platform to create, localize, <br className="hidden md:block"/>
                            manage, and publish AI avatars
                        </h2>
                        <p className="text-slate-600">One tool for your entire workflow. From first draft to global distribution.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Box 1 */}
                        <div className="bg-[#f7f7f9] rounded-3xl p-10 flex flex-col">
                            <span className="text-[#5b36f5] text-xs font-bold uppercase tracking-wider mb-4">• AI VIDEO ASSISTANT</span>
                            <h3 className="text-3xl font-bold text-[#0a0b10] mb-4 tracking-tight">Turn any content into video, instantly</h3>
                            <p className="text-slate-600 mb-10 text-lg">Automatically transform documents, links, or ideas into engaging avatars that match your brand style.</p>
                            <div className="mt-auto h-64 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl border border-white/50 shadow-inner flex items-center justify-center text-indigo-900/20 font-bold text-4xl">
                                AI Assistant
                            </div>
                        </div>

                        {/* Box 2 */}
                        <div className="bg-[#f7f7f9] rounded-3xl p-10 flex flex-col">
                            <span className="text-[#5b36f5] text-xs font-bold uppercase tracking-wider mb-4">• EXPRESSIVE AVATARS</span>
                            <h3 className="text-3xl font-bold text-[#0a0b10] mb-4 tracking-tight">Create your own expressive AI Avatar</h3>
                            <p className="text-slate-600 mb-10 text-lg">Your AI Avatar speaks 160+ languages, fluently and with uncanny expressiveness. And yes, you stay in full control.</p>
                            <div className="mt-auto h-64 bg-gradient-to-br from-[#0a0b10] to-slate-800 rounded-2xl border border-white/50 shadow-inner flex items-center justify-center text-white/20 font-bold text-4xl">
                                Custom Avatar
                            </div>
                        </div>
                    </div>
                </section>

                {/* PRICING SECTION - Light Mode */}
                <section id="pricing" className="py-24 px-6 relative bg-white border-t border-slate-100">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#0a0b10] mb-6">Choose your plan</h2>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                                Transparent pricing. No hidden fees. <br/>
                                One-time setup, design, and AI training cost: <span className="text-[#0a0b10] font-bold">3.000€</span>.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {/* Basic Plan */}
                            <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col hover:border-slate-300 transition-all shadow-sm">
                                <h3 className="text-2xl font-bold text-[#0a0b10] mb-2">Basic</h3>
                                <p className="text-slate-500 text-sm mb-6">Ideal for small businesses.</p>
                                <div className="mb-6">
                                    <span className="text-4xl font-black text-[#0a0b10]">150€</span>
                                    <span className="text-slate-500"> / mo</span>
                                </div>
                                <ul className="space-y-4 mb-8 flex-1 text-slate-600 text-sm">
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#5b36f5] font-bold">✓</span> Up to 300 minutes
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#5b36f5] font-bold">✓</span> ~0.50€ / minute
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#5b36f5] font-bold">✓</span> 50+ Languages
                                    </li>
                                </ul>
                                <button onClick={() => selectPackageAndScroll("Basic")} className="w-full py-3 rounded-xl border border-slate-200 text-[#0a0b10] font-semibold hover:bg-slate-50 transition-colors">
                                    Select Basic
                                </button>
                            </div>

                            {/* Pro Plan */}
                            <div className="bg-[#0a0b10] border border-[#0a0b10] rounded-3xl p-8 flex flex-col shadow-2xl relative transform md:-translate-y-4 text-white">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#5b36f5] text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                                    Most Popular
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                                <p className="text-slate-400 text-sm mb-6">For growing companies.</p>
                                <div className="mb-6">
                                    <span className="text-4xl font-black text-white">250€</span>
                                    <span className="text-slate-400"> / mo</span>
                                </div>
                                <ul className="space-y-4 mb-8 flex-1 text-slate-300 text-sm">
                                    <li className="flex items-center gap-3">
                                        <span className="text-white font-bold">✓</span> Up to 600 minutes
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-white font-bold">✓</span> ~0.41€ / minute
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-white font-bold">✓</span> Priority Support
                                    </li>
                                </ul>
                                <button onClick={() => selectPackageAndScroll("Pro")} className="w-full py-3 rounded-xl bg-white text-[#0a0b10] font-semibold hover:bg-slate-100 transition-colors">
                                    Select Pro
                                </button>
                            </div>

                            {/* Enterprise Plan */}
                            <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col hover:border-slate-300 transition-all shadow-sm">
                                <h3 className="text-2xl font-bold text-[#0a0b10] mb-2">Enterprise</h3>
                                <p className="text-slate-500 text-sm mb-6">For maximum coverage.</p>
                                <div className="mb-6">
                                    <span className="text-4xl font-black text-[#0a0b10]">450€</span>
                                    <span className="text-slate-500"> / mo</span>
                                </div>
                                <ul className="space-y-4 mb-8 flex-1 text-slate-600 text-sm">
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#5b36f5] font-bold">✓</span> Up to 1.200 minutes
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#5b36f5] font-bold">✓</span> ~0.37€ / min (Best value)
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#5b36f5] font-bold">✓</span> 24/7 Dedicated Support
                                    </li>
                                </ul>
                                <button onClick={() => selectPackageAndScroll("Enterprise")} className="w-full py-3 rounded-xl border border-slate-200 text-[#0a0b10] font-semibold hover:bg-slate-50 transition-colors">
                                    Select Enterprise
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ SECTION */}
                <section className="py-24 px-6 max-w-5xl mx-auto border-t border-slate-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="md:col-span-1">
                            <h2 className="text-4xl font-bold tracking-tight text-[#0a0b10] sticky top-32">
                                You've likely got a few questions
                            </h2>
                        </div>
                        <div className="md:col-span-2 space-y-6">
                            {[
                                "Is the setup fee one-time?",
                                "Can I customize the AI avatar to look like my team?",
                                "Does the AI integrate with my existing CRM?",
                                "How does the AI handle multiple languages?"
                            ].map((question, i) => (
                                <div key={i} className="border-b border-slate-200 pb-6">
                                    <h3 className="text-lg font-bold text-[#0a0b10] flex justify-between items-center cursor-pointer hover:text-slate-700">
                                        {question}
                                        <span className="text-slate-400 text-2xl font-light">+</span>
                                    </h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CONTACT FORM SECTION (Light mode styling) */}
                <section id="contact-form" className="py-32 px-6 bg-[#f7f7f9] border-t border-slate-200">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold tracking-tight text-[#0a0b10] mb-4">Ready to try?</h2>
                            <p className="text-slate-600 text-lg">
                                Fill out the form and our team will get in touch to discuss your custom AI Agent.
                            </p>
                        </div>

                        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
                            {isSuccess ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <div className="text-emerald-600 text-3xl font-bold">✓</div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#0a0b10] mb-4">Request Sent Successfully!</h3>
                                    <p className="text-slate-600">
                                        Thank you for your interest. An SGK Digital representative will contact you shortly.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-[#0a0b10] ml-1">Full Name *</label>
                                            <input 
                                                type="text" 
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0a0b10] focus:ring-1 focus:ring-[#0a0b10] transition-all"
                                                placeholder="e.g. John Doe"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-[#0a0b10] ml-1">Company</label>
                                            <input 
                                                type="text" 
                                                name="company"
                                                value={formData.company}
                                                onChange={handleChange}
                                                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0a0b10] focus:ring-1 focus:ring-[#0a0b10] transition-all"
                                                placeholder="Your Company Ltd"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-[#0a0b10] ml-1">Email *</label>
                                            <input 
                                                type="email" 
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0a0b10] focus:ring-1 focus:ring-[#0a0b10] transition-all"
                                                placeholder="info@company.com"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-[#0a0b10] ml-1">Phone</label>
                                            <input 
                                                type="tel" 
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0a0b10] focus:ring-1 focus:ring-[#0a0b10] transition-all"
                                                placeholder="e.g. +30 210..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-[#0a0b10] ml-1">Selected Plan</label>
                                        <select 
                                            name="packageType"
                                            value={formData.packageType}
                                            onChange={handleChange}
                                            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-[#0a0b10] focus:ring-1 focus:ring-[#0a0b10] transition-all"
                                        >
                                            <option value="">Select a plan (Optional)</option>
                                            <option value="Basic">Basic - 150€ / mo (300 mins)</option>
                                            <option value="Pro">Pro - 250€ / mo (600 mins)</option>
                                            <option value="Enterprise">Enterprise - 450€ / mo (1.200 mins)</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-[#0a0b10] ml-1">Selected Plan</label>
                                        <select 
                                            name="packageType"
                                            value={formData.packageType}
                                            onChange={handleChange}
                                            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-[#0a0b10] focus:ring-1 focus:ring-[#0a0b10] transition-all"
                                        >
                                            <option value="">Select a plan (Optional)</option>
                                            <option value="Basic">Basic - 150€ / mo (300 mins)</option>
                                            <option value="Pro">Pro - 250€ / mo (600 mins)</option>
                                            <option value="Enterprise">Enterprise - 450€ / mo (1.200 mins)</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-[#0a0b10] ml-1">Project Details</label>
                                        <textarea 
                                            name="details"
                                            value={formData.details}
                                            onChange={handleChange}
                                            rows={4}
                                            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0a0b10] focus:ring-1 focus:ring-[#0a0b10] transition-all resize-y"
                                            placeholder="How do you plan to use the AI avatar?"
                                        />
                                    </div>

                                    <button 
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-4 rounded-xl bg-[#0a0b10] hover:bg-slate-800 text-white font-bold text-lg transition-all disabled:opacity-70 flex items-center justify-center"
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center gap-2">
                                                <span className="w-5 h-5 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                                                Sending...
                                            </span>
                                        ) : "Request Quote"}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </section>
            </main>
            
            {/* LARGE GRADIENT CTA FOOTER */}
            <section className="py-32 px-6 bg-gradient-to-br from-indigo-400 via-purple-500 to-indigo-600 text-center">
                <h2 className="text-5xl font-bold tracking-tight text-white mb-4">Ready to try Live Avatar?</h2>
                <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                    Join innovative businesses today and start making AI videos in 160+ languages.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button 
                        onClick={scrollToForm}
                        className="px-8 py-4 rounded-full bg-white hover:bg-slate-50 text-[#0a0b10] font-bold text-lg transition-all"
                    >
                        Get started for free &rarr;
                    </button>
                    <Link 
                        href="/liveavatar-demo" 
                        target="_blank"
                        className="px-8 py-4 rounded-full bg-transparent hover:bg-white/10 text-white font-bold text-lg transition-colors border border-white/30"
                    >
                        Book demo
                    </Link>
                </div>
            </section>

            <footer className="py-12 text-center text-slate-500 text-sm bg-[#0a0b10] text-white/60">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-left mb-12">
                    <div>
                        <h4 className="font-bold text-white mb-4">Features</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-white transition-colors">AI Avatar Generator</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">160+ Languages</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Custom Avatars</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4">Use Cases</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-white transition-colors">Customer Service</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Sales Enablement</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Marketing</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4">Resources</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4">Company</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-white/10 pt-8">
                    &copy; {new Date().getFullYear()} SGK Digital. All rights reserved.
                </div>
            </footer>

            {/* FLOATING INTERACTIVE AVATAR WIDGET (Synthesia Exact Clone) */}
            {isWidgetOpen && (
                <div className="fixed bottom-6 right-6 w-[280px] h-[360px] rounded-2xl shadow-2xl z-[100] border border-white/20 overflow-hidden hidden sm:block shadow-black/60 group">
                    
                    {/* Background Image */}
                    <img 
                        src="/avatar-preview-man.png" 
                        alt="AI Avatar Preview" 
                        className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Bottom Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101015]/95 via-[#101015]/40 to-transparent pointer-events-none" />

                    {/* Header Controls */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                        {/* Unmute Button */}
                        <button className="w-[38px] h-[38px] rounded-full bg-white/30 backdrop-blur-md border border-white/50 flex items-center justify-center hover:bg-white/40 transition-colors">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="black" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                            </svg>
                        </button>
                        
                        {/* Close Button */}
                        <button onClick={() => setIsWidgetOpen(false)} className="w-[38px] h-[38px] rounded-full bg-white/30 backdrop-blur-md border border-white/50 flex items-center justify-center hover:bg-white/40 transition-colors">
                            <div className="w-5 h-5 bg-[#0a0b10] rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold leading-none mb-0.5">×</span>
                            </div>
                        </button>
                    </div>
                    
                    {/* Bottom CTA */}
                    <div className="absolute bottom-5 left-5 right-5 z-10">
                        <Link 
                            href="/liveavatar-demo" 
                            target="_blank"
                            className="block w-full bg-white text-center text-[#002b5c] font-bold text-lg py-3.5 rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.2)] hover:bg-slate-50 transition-colors"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
