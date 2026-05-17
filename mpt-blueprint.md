\# MPT Architectural Blueprint: shehzanwar.github.io



\*\*Document Type:\*\* Modules–Pathways–Triggers (MPT) Specification  

\*\*Target Executor:\*\* Claude Sonnet (code-generation pass)  

\*\*Source-of-Truth Authority:\*\* Absolute. Sonnet must not deviate from constraints declared in `BOUNDARY` blocks. Any ambiguity defaults to the constraint, never the convenience.



\---



\## §0. GLOBAL CONSTRAINTS (Apply to All Modules)



\### BOUNDARY-G1 — Stack Lock

\* \*\*Astro v5+ only.\*\* Use `astro:content` Content Layer API (`defineCollection` + `loader` + schema). Do not use the legacy `src/content/config.ts` glob-only pattern.

\* \*\*Tailwind v4+ only.\*\* Use `@import "tailwindcss";` and the `@theme` CSS directive. Do not generate a `tailwind.config.js` for token definition.

\* \*\*React\*\* used only inside `client:\*` islands. Default rendering must emit zero client JS.

\* \*\*All SVG assets\*\* via `astro-icon` (`<Icon name="..." />`). Do not inline raw `<svg>` tags except for the WebGL/canvas hero shell.



\### BOUNDARY-G2 — Negative Prompts (Hard Reject List)

Sonnet must refuse to emit any of the following:

\* \*\*Fonts:\*\* Inter, Roboto, Open Sans, Poppins, generic sans-serif fallback chains without `-apple-system`, `BlinkMacSystemFont`, `"Avenir Next"` leading.

\* \*\*Color clichés:\*\* indigo→purple→pink gradients, `bg-gradient-to-r from-purple-500 to-pink-500`, neon cyan on near-black, "glassmorphism" with default `backdrop-blur` and `white/10` fills.

\* \*\*Layout clichés:\*\* centered single-column hero with a CTA pair, three-card "Features" row with identical cards, accordion FAQ with chevron-right, full-bleed parallax photo headers.

\* \*\*Class conflicts\*\* emitted as duplicate utilities (e.g., `p-4 p-6`). The `cn()` helper is mandatory for any conditional class merging.



\### BOUNDARY-G3 — Accessibility Floor

\* \*\*Mobile input/textarea/select\*\* font-size: 16px minimum (prevents iOS zoom).

\* \*\*All interactive elements:\*\* visible `:focus-visible` ring tied to `--color-focus`.

\* \*\*Color contrast:\*\* WCAG AA against declared semantic backgrounds. No exceptions for "decorative" text larger than 18px — verify contrast anyway.

\* \*\*Respect `prefers-reduced-motion`:\*\* WebGL hero falls back to a static CSS gradient; bento lift transitions reduce to opacity only.



\### BOUNDARY-G4 — Performance Floor

\* \*\*Hero WebGL canvas\*\* must run in `requestAnimationFrame` with throttling tied to `IntersectionObserver` — pause shader when offscreen.

\* \*\*No layout-shifting fonts:\*\* declare `font-display: swap` and reserve metrics via `size-adjust` if a custom font is loaded.

\* \*\*Lighthouse targets\*\* (informational, not gates): Performance ≥ 95, Accessibility = 100, Best Practices ≥ 95, SEO = 100.



\---



\## §1. MODULES (Discrete Build Units)

\*Each module is atomic. Sonnet builds modules in the order dictated by §2 (Pathways), gated by the triggers in §3.\*



\### M01 — Project Foundation

\* \*\*Scope:\*\* `astro.config.mjs`, `package.json`, directory scaffold, integrations registration.

\* \*\*Artifacts:\*\*

&#x20; \* `astro.config.mjs` registering `@astrojs/react`, `astro-icon`, `@tailwindcss/vite`.

&#x20; \* Directory tree: `src/{components,content,layouts,pages,styles,lib,assets}`, `src/components/{islands,primitives,sections}`.

&#x20; \* `src/lib/cn.ts` exporting `cn(...inputs: ClassValue\[])` composed of `clsx` and `twMerge`.

\* \*\*BOUNDARY:\*\* No router middleware. No SSR adapter (target: static output: 'static'). No prefetch strategy beyond Astro's default hover mode.



\### M02 — Design Token System

\* \*\*Scope:\*\* `src/styles/global.css` declaring the `@theme` block.

\* \*\*Artifacts:\*\* CSS custom properties under `@theme`:

&#x20; \* \*\*Color semantics:\*\* `--color-background`, `--color-surface`, `--color-surface-elevated`, `--color-border`, `--color-border-strong`, `--color-text-primary`, `--color-text-secondary`, `--color-text-tertiary`, `--color-accent`, `--color-accent-hover`, `--color-focus`, `--color-success`, `--color-warning`, `--color-danger`.

&#x20; \* \*\*Typography:\*\* `--font-sans` (system stack), `--font-mono` (system mono stack), `--font-display` (optional refined display stack), `--text-xs` through `--text-7xl`, `--leading-tight`, `--leading-normal`, `--leading-relaxed`, `--tracking-tight`, `--tracking-normal`.

&#x20; \* \*\*Spacing/radii:\*\* `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`, `--radius-2xl`.

&#x20; \* \*\*Shadows:\*\* `--shadow-card`, `--shadow-card-hover`, `--shadow-glow` (low-alpha colored, tied to accent).

&#x20; \* \*\*Motion:\*\* `--ease-out-expo`, `--ease-out-quint`, `--duration-fast`, `--duration-base`, `--duration-slow`.

\* \*\*BOUNDARY:\*\*

&#x20; \* Color palette is off-white warm neutral background system (e.g., `oklch(0.98 0.005 90)`) with a deep ink text primary (e.g., `oklch(0.18 0.02 250)`) and a muted cobalt or sage accent — NOT default Tailwind blue, NOT purple, NOT pink. Sonnet must pick one of: muted cobalt `oklch(0.55 0.14 240)`, sage `oklch(0.62 0.08 150)`, or terracotta `oklch(0.62 0.13 40)`. Choose one and use it consistently — do not introduce a second accent.

&#x20; \* Font stack literal: `-apple-system, BlinkMacSystemFont, "Avenir Next", "Segoe UI", system-ui, sans-serif`.

&#x20; \* Define a `\[data-theme="dark"]` override block remapping the same semantic tokens — do not introduce parallel `--color-dark-\*` tokens.



\### M03 — Content Layer (Zod-Validated Collections)

\* \*\*Scope:\*\* `src/content.config.ts` (Astro v5 location) defining collections.

\* \*\*Collections:\*\*

&#x20; \* `projects` — fields: title (string, 3–80), slug (string), summary (string, 20–200), description (string), role (enum: engineer | analyst | researcher | lead), stack (array of string, 1–12), repoUrl (url, optional), liveUrl (url, optional), coverIcon (string, must match an astro-icon collection prefix), featured (boolean), order (number), publishedAt (date), status (enum: shipped | in-progress | archived).

&#x20; \* `experience` — fields: company, role, start (date), end (date, nullable), location, highlights (array of string), skills (array of string).

&#x20; \* `writing` — fields: title, slug, excerpt, publishedAt, readingTime (number), tags (array).

&#x20; \* `siteMeta` (singleton) — fields: name, headline, subhead, email, socials (record), cvUrl.

\* \*\*Loader:\*\* glob loader pointed at `src/content/<collection>/\*.md` (or `.mdx` for writing).

\* \*\*BOUNDARY:\*\* Every schema field uses `z.\*` constraints, not bare types. `refine()` enforces business rules: `experience.end >= experience.start` when present; `projects.featured === true` implies `projects.coverIcon` non-empty; `projects.order` unique among featured.



\### M04 — Layout Primitives

\* \*\*Scope:\*\* `src/layouts/BaseLayout.astro`, `src/layouts/PageLayout.astro`.

\* \*\*Artifacts:\*\*

&#x20; \* `BaseLayout`: `<html lang>`, `<head>` (meta, title, OG, canonical, favicons, font preconnect if any, theme-color), global stylesheet import, `<body>` slot.

&#x20; \* `PageLayout`: composes BaseLayout + `<Nav />` + `<main>` slot + `<Footer />`.

\* \*\*BOUNDARY:\*\* Props typed via `interface Props`. OG image generation deferred (do not implement satori in v1). Inline a single critical CSS rule: `html { color-scheme: light dark; }`.



\### M05 — Navigation (Morphing Dropdown)

\* \*\*Scope:\*\* `src/components/islands/Nav.tsx` (React island, `client:load`).

\* \*\*Behavior:\*\*

&#x20; \* Top-level items: Work, Writing, About, Contact. Hovering an item with sub-content expands a panel beneath the nav.

&#x20; \* The panel uses a single shared container whose height and width animate between item-specific content dimensions — measure children with ResizeObserver, animate via `transform: translate3d` + height transitions on the shared shell (NOT per-panel mount/unmount fades).

&#x20; \* Active item tracked in React state; pointer leaves nav OR Escape key closes panel.

&#x20; \* Mobile: collapses to a sheet triggered by hamburger button. The sheet uses the same item list, no submenus — flat list with section headers.

\* \*\*BOUNDARY:\*\*

&#x20; \* `onpointerenter` / `onpointerleave` on items, NOT `onmouseenter`. Pointer events unify desktop hover and stylus.

&#x20; \* No external animation library. Use CSS transitions on transform, opacity, height with `--ease-out-expo`.

&#x20; \* Nav background: solid `--color-surface` with 1px border-bottom `--color-border`. NOT translucent, NOT blurred.

&#x20; \* The morphing panel must use `will-change: transform` only while open, removed on close.



\### M06 — Hero Section (WebGL Mesh Gradient)

\* \*\*Scope:\*\*

&#x20; \* `src/components/sections/Hero.astro` — server-rendered scaffold (heading, subhead, ctas, skewed wrapper).

&#x20; \* `src/components/islands/MeshGradient.tsx` — React island, `client:visible`, owns the canvas + shader.

\* \*\*Behavior:\*\*

&#x20; \* Canvas absolutely positioned inside a `clip-path: polygon(...)` skewed wrapper.

&#x20; \* Shader: full-screen quad fragment shader. Two layers of value-noise driven by uv + u\_time, mapped through a 3-stop color ramp.

&#x20; \* Typography overlay: the H1 uses `background-clip: text` against a static SVG mask reflecting the gradient.

\* \*\*BOUNDARY:\*\*

&#x20; \* Use `ogl` (≤4KB) for WebGL context management. Do not pull `three.js`.

&#x20; \* `IntersectionObserver` (threshold 0) pauses the RAF loop when hero is out of view.

&#x20; \* `prefers-reduced-motion: reduce` → render a single static frame on mount, do not start the RAF loop.

&#x20; \* Canvas `aria-hidden="true"`. Heading and subhead remain in DOM as semantic `<h1>` and `<p>`.

&#x20; \* No mouse-parallax effects on the gradient.



\### M07 — Bento Grid System

\* \*\*Scope:\*\* `src/components/sections/BentoGrid.astro` + `src/components/primitives/BentoCard.astro`.

\* \*\*Layout:\*\*

&#x20; \* 12-column CSS Grid on lg:, 6-column on md:, single column on mobile.

&#x20; \* Cards declare `data-span="col-X row-Y"` and compose via inline styles driven by the data attribute.

&#x20; \* Card sizes mix: hero card (8×2), tall card (4×2), wide card (8×1), square (4×1), small (2×1). Layout must be asymmetric.

\* \*\*Hover state:\*\*

&#x20; \* `transform: translate3d(0, -4px, 0)` (negative Y lift).

&#x20; \* `box-shadow` transitions from `--shadow-card` to `--shadow-card-hover`.

&#x20; \* Border transitions + 1px inset glow via second box-shadow layer.

\* \*\*BOUNDARY:\*\*

&#x20; \* Transitions are GPU-friendly: only transform, box-shadow, border-color, opacity.

&#x20; \* Card content is server-rendered Astro.

&#x20; \* Entire card is keyboard-reachable.



\### M08 — Spotlight Card (Pointer-Tracking)

\* \*\*Scope:\*\* `src/components/islands/SpotlightCard.tsx`, `client:idle`.

\* \*\*Behavior:\*\*

&#x20; \* Wraps children in a `<div>` that captures `onPointerMove`, `onPointerLeave`.

&#x20; \* Pointer position updates CSS variables `--mx` and `--my` directly on CSSOM (NOT React state).

&#x20; \* Soft-edged radial gradient on `::before` tracks the pointer.

\* \*\*BOUNDARY:\*\*

&#x20; \* Unified `onPointerMove` only.

&#x20; \* `passive: true` listeners.

&#x20; \* Spotlight disabled under `prefers-reduced-motion`.



\### M09 — Utility Layer

\* \*\*Scope:\*\* `src/lib/cn.ts`, `src/lib/format.ts`, `src/lib/seo.ts`.

\* \*\*Artifacts:\*\* `cn` (clsx+twMerge), `formatDate`, `buildMeta`.



\### M10 — Icon System

\* \*\*Scope:\*\* Register `astro-icon` with `lucide` OR `tabler` collection + inline custom collection for brand marks.

\* \*\*BOUNDARY:\*\* Custom SVGs go in `src/icons/`. No raw `<svg>` outside this system.



\### M11 — Page Composition

\* \*\*Scope:\*\* `src/pages/index.astro`, `src/pages/work/index.astro`, `src/pages/work/\[slug].astro`, etc.

\* \*\*BOUNDARY:\*\* No page may exceed \~150 lines of Astro markup. Extract sections into `src/components/sections/`.



\### M12 — Footer

\* \*\*Scope:\*\* `src/components/sections/Footer.astro`.

\* \*\*BOUNDARY:\*\* No newsletter signup. No "Made with ❤️". No back-to-top button.



\### M13 — Content Seeds

\* \*\*Scope:\*\* Seed markdown files for projects, experience, writing.

\* \*\*BOUNDARY:\*\* Use realistic placeholder content (OMSA student, data analytics trajectory). Do NOT use lorem ipsum.



\### M14 — Build \& Deploy Configuration

\* \*\*Scope:\*\* `.github/workflows/deploy.yml`, `astro.config.mjs` site mapping.

\* \*\*BOUNDARY:\*\* `site: "https://shehzanwar.github.io"`, `base: "/"`.



\---



\## §2. PATHWAYS (Execution Order)

\*Pathways are linear dependency chains. Sonnet must complete each pathway before advancing.\*



\* \*\*Pathway A — Foundation:\*\* M01 → M02 → M09 → M10

\* \*\*Pathway B — Data Spine:\*\* M03 → M13

\* \*\*Pathway C — Shell:\*\* M04 → M05 → M12

\* \*\*Pathway D — Hero \& Grid:\*\* M06 → M07 → M08

\* \*\*Pathway E — Composition:\*\* M11

\* \*\*Pathway F — Deploy:\*\* M14



\---



\## §3. TRIGGERS (Gate Conditions)

\*A pathway advances only when all triggers for the completed module pass. A failed trigger means Sonnet must revise that module before continuing.\*



\* \*\*T-M01 (Foundation):\*\* `npm run build` produces zero errors/warnings. `cn()` utility passes conflict resolution.

\* \*\*T-M02 (Tokens):\*\* `@theme` block contains all tokens. No default Tailwind blue/purple/pink strings exist.

\* \*\*T-M03 (Schemas):\*\* Every Zod field has a constraint (min/max/regex).

\* \*\*T-M04 (Layouts):\*\* Valid HTML boilerplate, no layout shift contributors.

\* \*\*T-M05 (Nav):\*\* Full keyboard accessibility, 100 Lighthouse accessibility score.

\* \*\*T-M06 (Hero):\*\* Canvas pauses on scroll out of view, respects reduced-motion.

\* \*\*T-M07 (Bento):\*\* Asymmetric layout, smooth transitions.

\* \*\*T-M08 (Spotlight):\*\* Zero React re-renders during pointer move.

\* \*\*T-M09 to T-M14:\*\* Check corresponding BOUNDARY requirements are verified.



\---



\## §4. SONNET EXECUTION PROTOCOL

When Sonnet receives this MPT document plus a user instruction such as "build M06" or "advance Pathway D":



1\. \*\*Echo the constraints.\*\* Sonnet begins its response with a 3–5 line summary of which BOUNDARY rules apply.

2\. \*\*Produce code in artifact form.\*\* Each file gets a delimited code block with the absolute path as the first line comment.

3\. \*\*Self-check against triggers.\*\* Sonnet appends a `TRIGGER-CHECK` block enumerating each trigger and marking it PASS / FAIL / MANUAL-VERIFY.

4\. \*\*Halt on FAIL.\*\* If a self-check fails, Sonnet revises before proceeding.

5\. \*\*No improvisation.\*\* Sonnet does NOT silently add modules.



\---



\## §5. AMBIGUITY RESOLUTION

1\. \*\*Match Stripe's restraint.\*\* Prefer the more conservative visual choice.

2\. \*\*Prefer server-rendering.\*\* Use Astro over React unless runtime state is required.

3\. \*\*Prefer CSS over JS.\*\* Hover/focus/simple transitions belong in CSS.

4\. \*\*Prefer tokens over values.\*\* Reference `--\*` variables, never raw values.

