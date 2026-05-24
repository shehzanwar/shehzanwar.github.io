---
name: Obsidian Precision
colors:
  surface: '#13131b'
  surface-dim: '#13131b'
  surface-bright: '#393841'
  surface-container-lowest: '#0d0d15'
  surface-container-low: '#1b1b23'
  surface-container: '#1f1f27'
  surface-container-high: '#292932'
  surface-container-highest: '#34343d'
  on-surface: '#e4e1ed'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#e4e1ed'
  inverse-on-surface: '#303038'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#4fdbc8'
  on-secondary: '#003731'
  secondary-container: '#04b4a2'
  on-secondary-container: '#003f38'
  tertiary: '#ffb783'
  on-tertiary: '#4f2500'
  tertiary-container: '#d97721'
  on-tertiary-container: '#452000'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#71f8e4'
  secondary-fixed-dim: '#4fdbc8'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005048'
  tertiary-fixed: '#ffdcc5'
  tertiary-fixed-dim: '#ffb783'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#703700'
  background: '#13131b'
  on-background: '#e4e1ed'
  surface-variant: '#34343d'
typography:
  display:
    fontFamily: Geist
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  body-md:
    fontFamily: Geist
    fontSize: 15px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
  code:
    fontFamily: jetbrainsMono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1200px
  gutter: 24px
  margin-mobile: 20px
  stack-xl: 80px
  stack-lg: 48px
  stack-md: 24px
  stack-sm: 12px
---

## Brand & Style

This design system is engineered for a premium personal portfolio that communicates technical mastery and aesthetic discipline. It blends the structural rigour of developer-centric tools with the polished minimalism of high-end consumer hardware.

The style is defined by **High-Contrast Minimalism** and **Technical Glassmorphism**. It utilizes deep, ink-like backgrounds to make content appear as if it is floating on a dark void. Precision is conveyed through razor-sharp borders, subtle glows, and a meticulous attention to typography and alignment. The emotional goal is to evoke a sense of calm authority, projecting a professional who values both the code and the craft.

## Colors

The palette is rooted in a "Deep Dark" aesthetic. The foundation is a rich charcoal (#0A0A0B), providing the maximum possible contrast for the crisp off-white typography (#F5F5F7). 

- **Primary (Indigo):** Used for primary actions and focused states.
- **Secondary (Teal):** Used for success indicators, status badges, and technical highlights.
- **Surface Layers:** Secondary surfaces use a slightly lighter navy-charcoal (#111114) to create depth without sacrificing the dark mood.
- **Accents:** Neon-adjacent hues are used sparingly as 1px "glow" borders or tiny pips of color to signify life and interactivity within a static layout.

## Typography

This design system uses **Geist** to achieve a technical, monospaced-adjacent feel while maintaining the readability of a premium grotesque. 

The hierarchy relies on significant scale differences between display text and body copy. Headlines should use tighter tracking (negative letter spacing) to feel cohesive and "locked-in," while labels and small captions should use increased tracking to maintain legibility and a sense of luxury. For code blocks and technical metadata, JetBrains Mono is the preferred utility face.

## Layout & Spacing

The layout follows a **Fixed-Fluid Hybrid** model. Content is contained within a 1200px central column for desktop, ensuring readability and focus.

- **Grid:** A 12-column system is used for project galleries, while a simplified 2-column "asymmetric" split is used for hero sections (text vs. visual/code).
- **Rhythm:** Generous vertical whitespace (stack-xl) separates major sections to allow the design to "breathe."
- **Alignment:** Strict edge alignment is mandatory. Content should snap to the grid to reinforce the "technical clarity" of the brand.
- **Mobile:** Breakpoints at 768px (Tablet) and 480px (Mobile). On mobile, the 12-column grid collapses to a single column, and margins are reduced to 20px.

## Elevation & Depth

Hierarchy is established through **Tonal layering** and **Inner Glows** rather than traditional heavy drop shadows.

1.  **Base (Level 0):** The deepest charcoal (#0A0A0B).
2.  **Surface (Level 1):** Cards and containers (#111114) with a 1px solid border at 8% white opacity.
3.  **Floating (Level 2):** Modals or active cards use a subtle backdrop blur (20px) and a slightly brighter top-border to simulate a light source from above.
4.  **Interactive Glow:** On hover, primary elements may emit a very faint, diffused indigo outer glow (blur: 40px, opacity: 15%) to indicate focus.

## Shapes

The shape language is **Soft-Geometric**. 

We avoid the "playfulness" of fully rounded pill shapes in favor of a 0.25rem (4px) or 0.5rem (8px) radius. This small roundness softens the brutalism just enough to feel modern and premium, while the sharp corners maintain a high-end, architectural precision. Large cards use the `rounded-lg` (8px) setting, while buttons and chips use the standard `rounded` (4px).

## Components

### Buttons
- **Primary:** Solid indigo background with white text. No shadow, 4px border radius.
- **Secondary:** Ghost style. Transparent background with a 1px border (#A1A1AA at 20%). Subtle white text.
- **Refinement:** All buttons use a 200ms transition on hover, slightly increasing the border opacity or background brightness.

### Cards
- **Project Cards:** Deep charcoal background, 1px border. Feature an "Inner Glow" (a top-edge light stroke) to separate them from the background.
- **Glassmorphism:** Use for navigation bars and floating overlays. Background: `rgba(10, 10, 11, 0.7)` with a `backdrop-filter: blur(12px)`.

### Inputs & Fields
- **Style:** Underlined or fully enclosed with 1px borders. Focus state changes border color to Primary Indigo with a 2px outer glow.
- **Typography:** Uses the `code` font-family for input text to emphasize the technical nature of the portfolio.

### Chips & Badges
- **Technical Tags:** Small, all-caps labels with a subtle background (`#111114`) and secondary teal text. 4px radius. Used for "Languages" or "Tools."

### Lists
- Clean, vertical lists with 1px horizontal dividers at 5% white opacity. Iconography should be thin-stroke (1.5pt) linear icons.