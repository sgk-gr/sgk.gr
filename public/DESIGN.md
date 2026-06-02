---
name: Vivid Momentum
colors:
  surface: '#f8f9ff'
  surface-dim: '#d8dadf'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3f9'
  surface-container: '#eceef3'
  surface-container-high: '#e6e8ed'
  surface-container-highest: '#e1e2e8'
  on-surface: '#191c20'
  on-surface-variant: '#5a4136'
  inverse-surface: '#2e3135'
  inverse-on-surface: '#eff0f6'
  outline: '#8e7164'
  outline-variant: '#e2bfb0'
  surface-tint: '#a04100'
  primary: '#a04100'
  on-primary: '#ffffff'
  primary-container: '#ff6b00'
  on-primary-container: '#572000'
  inverse-primary: '#ffb693'
  secondary: '#0050cc'
  on-secondary: '#ffffff'
  secondary-container: '#0266ff'
  on-secondary-container: '#f9f7ff'
  tertiary: '#585f66'
  on-tertiary: '#ffffff'
  tertiary-container: '#939aa1'
  on-tertiary-container: '#2b3238'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcc'
  primary-fixed-dim: '#ffb693'
  on-primary-fixed: '#351000'
  on-primary-fixed-variant: '#7a3000'
  secondary-fixed: '#dae1ff'
  secondary-fixed-dim: '#b3c5ff'
  on-secondary-fixed: '#001849'
  on-secondary-fixed-variant: '#003fa4'
  tertiary-fixed: '#dce3eb'
  tertiary-fixed-dim: '#c0c7cf'
  on-tertiary-fixed: '#151c22'
  on-tertiary-fixed-variant: '#40484e'
  background: '#f8f9ff'
  on-background: '#191c20'
  surface-variant: '#e1e2e8'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 64px
    fontWeight: '800'
    lineHeight: 72px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Montserrat
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-sm:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-bold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1200px
  gutter: 24px
  section-padding-desktop: 120px
  section-padding-mobile: 64px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style
The brand personality is energetic, optimistic, and highly efficient. It aims to evoke a sense of "organized momentum"—the feeling that a business is moving forward rapidly but under expert control. The target audience consists of growth-focused founders and marketing managers who value both creative flair and data-driven reliability.

The design style is **Corporate Modern with a Vibrant Twist**. It leverages the clarity and trust of high-end SaaS platforms but injects "happy" energy through saturation and fluid shapes. It utilizes generous white space to ensure focus on conversion goals, balanced by soft, optimistic secondary tones that prevent the UI from feeling sterile.

## Colors
This design system utilizes a high-energy palette designed to drive action. 
- **Primary (Energetic Orange):** Used for main Call-to-Action (CTA) elements and key highlights to signal urgency and enthusiasm.
- **Secondary (Friendly Blue):** Used for trust-building elements, icons, and secondary buttons to provide professional grounding.
- **Tertiary (Airy Sky):** A soft pastel blue used for large background sections and card surfaces to maintain a "light" feel.
- **Neutral (Deep Slate):** Applied to typography and borders to ensure high legibility and a premium, grounded finish.
- **Surface:** The background remains primarily white (#FFFFFF) to maximize the "airy" aesthetic.

## Typography
The typography strategy pairs the geometric confidence of Montserrat for headlines with the functional precision of Inter for body copy. 

Headlines use heavy weights and tight letter-spacing to communicate authority and speed. Body text is set with generous line heights to ensure a "breezy" reading experience, reducing cognitive load during the conversion process. Labels and buttons use Inter SemiBold to maintain a professional, utilitarian feel for interactive elements.

## Layout & Spacing
The layout follows a **Fixed Grid** model for desktop to ensure content remains centered and readable, transitioning to a fluid single-column layout for mobile.

Spacing is intentionally oversized to create an "airy" feel. Section vertical padding is set high to allow each value proposition room to breathe. Components within cards use a tight 8px-based rhythm to maintain visual grouping, while major layout blocks use 48px or 120px increments to signal clear thematic shifts.

## Elevation & Depth
Depth is created through **Ambient Shadows** and **Tonal Layers** rather than harsh lines. 
- **Level 1 (Subtle):** Used for cards and containers. A very soft, wide-spread shadow (0px 4px 20px rgba(0,0,0,0.04)) creates a lifted effect without feeling heavy.
- **Level 2 (Interactive):** Used for hovered buttons and active states. The shadow becomes more pronounced and slightly tinted with the primary color to simulate a physical glow.
- **Tonal Tiers:** Light pastel backgrounds (Tertiary Blue) are used to separate "Trust" sections (like testimonials or logos) from the main conversion flow.

## Shapes
The shape language is defined by **Friendly Roundedness**. Standard components like input fields and small buttons use a 0.5rem (8px) radius. Large cards and containers use 1.5rem (24px) to emphasize the soft, approachable nature of the brand. Buttons never use sharp corners, ensuring the UI feels safe and modern.

## Components
- **Primary Buttons:** High-contrast Orange backgrounds with White text. Use a subtle inner-glow on top to give a "squishy" tactile feel.
- **Input Fields:** Large 56px height for accessibility, featuring a light grey border that turns Secondary Blue on focus.
- **Value Cards:** White background with a "Level 1" shadow and a 24px corner radius. Feature an icon in a Secondary Blue soft-circle.
- **Testimonial Chips:** Small, pill-shaped badges used to highlight key metrics (e.g., "+40% ROI") using Secondary Blue backgrounds with White text.
- **Progress Indicators:** Thin, fluid lines using the Primary Orange to guide the user's eye down the landing page toward the final CTA.