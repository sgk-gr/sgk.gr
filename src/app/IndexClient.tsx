"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WordPressShowcase from "@/components/WordPressShowcase";
import WebAppsShowcase from "@/components/WebAppsShowcase";
import AIAgentsShowcase from "@/components/AIAgentsShowcase";
import EshopOffer from "@/components/EshopOffer";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Portfolio from "@/components/Portfolio";
import TechStack from "@/components/TechStack";
import Testimonials from "@/components/Testimonials";
import About from "@/components/About";
import FAQ from "@/components/FAQ";
import CTABanner from "@/components/CTABanner";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

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
