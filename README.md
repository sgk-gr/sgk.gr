# SGK Software Development - Official Website

<div align="center">
  <img src="public/logo.png" alt="SGK Logo" width="120" />
  <h3>High-Performance eCommerce, Custom Web Apps & Agentic AI Solutions</h3>
  <p>
    <a href="https://sgk.gr"><strong>Website</strong></a> ·
    <a href="https://sgk.gr/estimate"><strong>Free Estimate</strong></a> ·
    <a href="https://sgk.gr/ai-agents"><strong>AI Agents</strong></a>
  </p>
</div>

---

## 🚀 Overview

SGK Software Development is a premium software agency based in Athens, Greece. With over 18 years of experience, we specialize in building lightning-fast eCommerce stores, custom enterprise web applications, and autonomous AI agentic systems.

This repository contains the official SGK website, built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**, optimized for maximum performance (100/100 PageSpeed) and SEO.

## 🛠 Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **Animations:** Framer Motion, Lucide React
- **Backend/DB:** Supabase, PostgreSQL
- **AI Integration:** OpenAI SDK, LangChain (Agentic AI)
- **Deployment:** Vercel (Optimized for SSR/ISR)
- **Forms & Emails:** Resend, React Hook Form, Zod

## ✨ Key Features

- **Sub-second Performance:** Optimized for Core Web Vitals with near-instant load times.
- **Agentic AI Ready:** Integrated showcases and infrastructure for autonomous AI agents.
- **Headless eCommerce:** Ready for headless WooCommerce and Shopify integrations.
- **SEO Optimized:** Dynamic sitemaps, structured data (JSON-LD), and server-side rendering.
- **Premium UX/UI:** Dark-mode first design with glassmorphism and smooth micro-animations.

## 📁 Project Structure

```bash
src/
├── app/            # Next.js App Router (Pages, Layouts, Sitemap)
├── components/     # UI Components (Shadcn/UI, Custom Blocks)
├── data/           # Static data (Blog posts, Portfolio, Services)
├── hooks/          # Custom React hooks
├── lib/            # Utility functions and shared logic
└── assets/         # Images, fonts, and global styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Bun or NPM

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sgk-gr/sgk.gr.git
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Set up environment variables:
   Create a `.env.local` file with:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   RESEND_API_KEY=your_resend_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## 🌍 Deployment

The site is optimized for **Vercel**. To deploy:

1. Push your changes to GitHub.
2. Connect your repository to Vercel.
3. Vercel will automatically detect the Next.js framework and deploy with optimal settings.

## 📞 Contact

- **Website:** [sgk.gr](https://sgk.gr)
- **Email:** info@sgk.gr
- **Phone:** +30 6999524389
- **Address:** Ermou 1 & Lykovriseos 1, 14452 Metamorfosi, Attica, Greece

---

<p align="center">
  Built with ❤️ by <strong>SGK Software Development</strong>
</p>
