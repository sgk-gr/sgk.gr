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
        <title>SGK Software Development Company | Κατασκευή Eshop, Web Apps, AI Agents & Telecom Platforms</title>
        <meta name="description" content="SGK Software Development Company — 18 χρόνια εμπειρίας. Κατασκευή Eshop (WooCommerce, Shopify), custom web εφαρμογές, AI agents, booking systems, telecom platforms (Cosmote/Vodafone). Δείτε τα projects: KM-FIBER, Sigmalabs AI, Harmony Apartments, yolo8, Rekrua, Skinnera IKE κ.α." />
        <meta name="keywords" content="κατασκευή eshop, woocommerce, shopify, web development, ai agent, custom crm, booking system, σύστημα κρατήσεων, οπτικές ίνες, fiber optics, cosmote, vodafone, dashboard, mobile app, flutter, react, supabase, seo, software development ελλάδα" />
        <link rel="canonical" href="https://sgk.gr" />

        {/* Open Graph / Facebook / Viber */}
        <meta property="og:title" content="SGK Software Development Company | Eshop, Web Apps, AI Agents" />
        <meta property="og:description" content="Κατασκευή Eshop, Web Apps, AI Agents, Booking Systems & Telecom Platforms. 18 χρόνια εμπειρίας στην Ελλάδα." />
        <meta property="og:url" content="https://sgk.gr" />
        <meta property="og:image" content="https://sgk.gr/social-preview.png" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="SGK Software Development" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SGK Software Development Company" />
        <meta name="twitter:description" content="Custom Software, AI Agents & Next-Gen E-shops." />
        <meta name="twitter:image" content="https://sgk.gr/social-preview.png" />
      </Helmet>
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
};

export default Index;
