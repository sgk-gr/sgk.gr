"use client";

import dynamic from 'next/dynamic';
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

const WordPressShowcase = dynamic(() => import("@/components/WordPressShowcase"), { ssr: true });
const WebAppsShowcase = dynamic(() => import("@/components/WebAppsShowcase"), { ssr: true });
const AIAgentsShowcase = dynamic(() => import("@/components/AIAgentsShowcase"), { ssr: true });
const EshopOffer = dynamic(() => import("@/components/EshopOffer"), { ssr: true });
const Services = dynamic(() => import("@/components/Services"), { ssr: true });
const Process = dynamic(() => import("@/components/Process"), { ssr: true });
const Portfolio = dynamic(() => import("@/components/Portfolio"), { ssr: true });
const TechStack = dynamic(() => import("@/components/TechStack"), { ssr: true });
const Testimonials = dynamic(() => import("@/components/Testimonials"), { ssr: true });
const About = dynamic(() => import("@/components/About"), { ssr: true });
const FAQ = dynamic(() => import("@/components/FAQ"), { ssr: true });
const CTABanner = dynamic(() => import("@/components/CTABanner"), { ssr: true });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: true });

export default function IndexClient() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <Hero />
            <div id="insights">
                <WordPressShowcase />
            </div>
            <div id="solutions">
                <WebAppsShowcase />
                <AIAgentsShowcase />
            </div>
            <EshopOffer />
            <Services />
            <Process />
            <Portfolio />
            <TechStack />
            <Testimonials />
            <About />
            <FAQ />
            <CTABanner />
            <Footer />
        </div>
    );
}
