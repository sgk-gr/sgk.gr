"use client";

import dynamic from 'next/dynamic';
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

const WordPressShowcase = dynamic(() => import("@/components/WordPressShowcase"), { ssr: true });
const WebAppsShowcase = dynamic(() => import("@/components/WebAppsShowcase"), { ssr: false });
const AIAgentsShowcase = dynamic(() => import("@/components/AIAgentsShowcase"), { ssr: false });
const EshopOffer = dynamic(() => import("@/components/EshopOffer"), { ssr: false });
const Services = dynamic(() => import("@/components/Services"), { ssr: false });
const Process = dynamic(() => import("@/components/Process"), { ssr: false });
const Portfolio = dynamic(() => import("@/components/Portfolio"), { ssr: false });
const TechStack = dynamic(() => import("@/components/TechStack"), { ssr: false });
const Testimonials = dynamic(() => import("@/components/Testimonials"), { ssr: false });
const About = dynamic(() => import("@/components/About"), { ssr: false });
const Team = dynamic(() => import("@/components/Team"), { ssr: false });
const FAQ = dynamic(() => import("@/components/FAQ"), { ssr: false });
const CTABanner = dynamic(() => import("@/components/CTABanner"), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

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
            <Team />
            <FAQ />
            <CTABanner />
            <Footer />
        </div>
    );
}
