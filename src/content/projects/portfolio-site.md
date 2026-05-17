---
title: This Portfolio
slug: portfolio-site
summary: Statically-generated personal site built with Astro 5, isolated React islands, Tailwind CSS v4 design tokens, and a WebGL mesh-gradient hero — zero client JS by default.
description: Engineered with Astro's Content Layer API for zero-JS-by-default rendering. Interactive components are isolated as React islands only where runtime state is required. The full design-token system lives in a Tailwind v4 @theme block, and the hero uses an OGL fragment shader with IntersectionObserver-gated RAF loop.
role: engineer
stack:
  - Astro
  - React
  - Tailwind CSS v4
  - TypeScript
  - WebGL
  - OGL
featured: false
order: 0
publishedAt: 2025-05-01
status: in-progress
---

## Design decisions

**Zero-JS by default.** Every page is server-rendered Astro. React is loaded only where a component requires runtime state — the morphing nav dropdown, the WebGL gradient, and the spotlight card effect.

**Content Layer API.** Collections are defined with Zod schemas in `src/content.config.ts`. All frontmatter is validated at build time; invalid entries fail the build rather than silently rendering wrong data.

**Token-first CSS.** All visual decisions — color, spacing, shadow, motion — live as `@theme` CSS variables. Components reference tokens, never raw values.
