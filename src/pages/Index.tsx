import { Helmet } from "react-helmet-async";
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

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>SGK Digital Agency | Κατασκευή Eshop, Web Apps, AI Agents & Telecom Platforms</title>
        <meta name="description" content="SGK Digital Agency — 18 χρόνια εμπειρίας. Κατασκευή Eshop (WooCommerce, Shopify), custom web εφαρμογές, AI agents, booking systems, telecom platforms (Cosmote/Vodafone). Δείτε τα projects: KM-FIBER, Sigmalabs AI, Harmony Apartments, yolo8, Rekrua, Skinnera IKE κ.α." />
        <meta name="keywords" content="κατασκευή eshop, woocommerce, shopify, web development, ai agent, custom crm, booking system, σύστημα κρατήσεων, οπτικές ίνες, fiber optics, cosmote, vodafone, dashboard, mobile app, flutter, react, supabase, seo, digital agency ελλάδα" />
        <link rel="canonical" href="https://sgk.gr" />
        <meta property="og:title" content="SGK Digital Agency | Eshop, Web Apps, AI Agents" />
        <meta property="og:description" content="Κατασκευή Eshop, Web Apps, AI Agents, Booking Systems & Telecom Platforms. 18 χρόνια εμπειρίας στην Ελλάδα." />
        <meta property="og:url" content="https://sgk.gr" />
        <meta property="og:type" content="website" />
      </Helmet>
      <Navbar />
      <Hero />
      <WordPressShowcase />
      <WebAppsShowcase />
      <AIAgentsShowcase />
      <EshopOffer />
      <Services />
      <Process />
      <Portfolio />
      <TechStack />
      <Testimonials />
      <About />
      <FAQ />
      <CTABanner />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
