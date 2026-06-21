"use client";

import dynamic from 'next/dynamic';
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WelcomeDiscount from "@/components/WelcomeDiscount";
import ServicesSnappiStyle from "@/components/ServicesSnappiStyle";
import SecuritySnappiStyle from "@/components/SecuritySnappiStyle";
import BlogSnappiStyle from "@/components/BlogSnappiStyle";
import SectionDivider from "@/components/SectionDivider";

const WordPressShowcase = dynamic(() => import("@/components/WordPressShowcase"), { ssr: true });
const WebAppsShowcase = dynamic(() => import("@/components/WebAppsShowcase"), { ssr: false });
const AIAgentsShowcase = dynamic(() => import("@/components/AIAgentsShowcase"), { ssr: false });
const Process = dynamic(() => import("@/components/Process"), { ssr: false });
const Portfolio = dynamic(() => import("@/components/Portfolio"), { ssr: false });
const Testimonials = dynamic(() => import("@/components/Testimonials"), { ssr: false });
const Team = dynamic(() => import("@/components/Team"), { ssr: false });
const FAQ = dynamic(() => import("@/components/FAQ"), { ssr: false });
const CTABanner = dynamic(() => import("@/components/CTABanner"), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

export default function IndexClient() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <Hero />
            <WelcomeDiscount />
            
            <SectionDivider leftColor="bg-[#3b5bdb]" rightColor="bg-pink-500" />
            <ServicesSnappiStyle />
            
            <SectionDivider leftColor="bg-pink-500" rightColor="bg-[#4ade80]" />
            <SecuritySnappiStyle />
            
            <SectionDivider leftColor="bg-[#4ade80]" rightColor="bg-[#facc15]" />
            <div id="insights">
                <BlogSnappiStyle />
            </div>
            
            <SectionDivider leftColor="bg-[#facc15]" rightColor="bg-[#101010]" />
            <Footer />
        </div>
    );
}
