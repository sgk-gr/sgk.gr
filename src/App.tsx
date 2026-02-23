import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CaseStudySigmalabs from "./pages/CaseStudySigmalabs";
import CaseStudySkinnera from "./pages/CaseStudySkinnera";
import CaseStudyHarmony from "./pages/CaseStudyHarmony";
import CaseStudyYolo8 from "./pages/CaseStudyYolo8";
import CaseStudyEnergy from "./pages/CaseStudyEnergy";
import CaseStudyRekrua from "./pages/CaseStudyRekrua";
import CaseStudyLTG from "./pages/CaseStudyLTG";
import CaseStudyEvolis from "./pages/CaseStudyEvolis";
import CaseStudySuperApp from "./pages/CaseStudySuperApp";
import CaseStudyKMFiber from "./pages/CaseStudyKMFiber";
import CookieBanner from "./components/CookieBanner";
import FloatingCTA from "./components/FloatingCTA";
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import EshopDemo from "./pages/EshopDemo";
import Sitemap from "./pages/Sitemap";
import Estimate from "./pages/Estimate";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <CookieBanner />
        <FloatingCTA />
        {/* Noise Overlay */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[9998] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/eshop-demo" element={<EshopDemo />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="/estimate" element={<Estimate />} />
          <Route path="/case-study/sigmalabs-ai" element={<CaseStudySigmalabs />} />
          <Route path="/case-study/skinnera" element={<CaseStudySkinnera />} />
          <Route path="/case-study/harmony-apartments" element={<CaseStudyHarmony />} />
          <Route path="/case-study/yolo8" element={<CaseStudyYolo8 />} />
          <Route path="/case-study/energy-solutions" element={<CaseStudyEnergy />} />
          <Route path="/case-study/rekrua" element={<CaseStudyRekrua />} />
          <Route path="/case-study/live-tour-guide" element={<CaseStudyLTG />} />
          <Route path="/case-study/evolis-ai" element={<CaseStudyEvolis />} />
          <Route path="/case-study/super-app" element={<CaseStudySuperApp />} />
          <Route path="/case-study/km-fiber" element={<CaseStudyKMFiber />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
