# Architecture Guide

Engineering reference for the Shehzad Anwar portfolio codebase. Written for engineers and AI agents who need to maintain, extend, or debug this site without regressions.

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Island Architecture](#2-island-architecture)
3. [Styling System](#3-styling-system)
4. [Content Collections & Zod Schemas](#4-content-collections--zod-schemas)
5. [Routing & Page Generation](#5-routing--page-generation)
6. [Advanced Component Logic](#6-advanced-component-logic)
7. [Build & Deploy Pipeline](#7-build--deploy-pipeline)
8. [Known Constraints & Gotchas](#8-known-constraints--gotchas)

---

## 1. Design Philosophy

The site was built iteratively using a **Modules–Pathways–Triggers (MPT)** execution framework:

- **Modules (M)** are atomic, independently verifiable units of work — a single component, a schema change, or a routing update. Each module has a clear acceptance criterion (usually "the build passes with zero errors").
- **Pathways (P)** are ordered sequences of modules that together deliver a named feature. A Pathway is only approved once every constituent module passes its build check.
- **Triggers** are the conditions that advance work from one Pathway to the next — typically a clean `npm run build` with no TypeScript errors and no Zod validation failures.

This framework was chosen because Astro's build-time Zod validation provides a reliable contract: if the build passes, the content layer is type-safe. The build is the test suite.

**Implications for future changes:**

- Make schema changes in `content.config.ts` first, then update every affected content file, then run the build. Never update content files without updating the schema simultaneously — the build will fail with a precise error message identifying the violation.
- Clear the `.astro/` cache directory (`rm -rf .astro`) after any schema rename or collection removal. Stale cache entries produce harmless-but-confusing `Duplicate id` warnings.

---

## 2. Island Architecture

The site uses Astro's [Island Architecture](https://docs.astro.build/en/concepts/islands/) with a strict separation of concerns:

### Astro components — static by default

All layout, data fetching, and non-interactive UI is written as `.astro` files. They:

- Run **only at build time** (no JavaScript ships to the browser)
- Fetch data from content collections via `getCollection()` from `astro:content`
- Render HTML that is fully formed before it reaches the browser
- Use scoped `<style>` blocks (Astro scopes CSS to the component automatically)

Examples: `Hero.astro`, `FeaturedProjects.astro`, `ProjectDetail.astro`, `BentoCard.astro`

### React islands — interactive only

Two components run as client-side React islands:

| Component | Directive | Reason |
|---|---|---|
| `Nav.tsx` | `client:load` | Must be interactive immediately — manages dropdown state, mobile sheet, keyboard events |
| `MeshGradient.tsx` | `client:load` | Initialises WebGL context on mount; must hydrate before first paint to avoid a blank canvas |

**Rule:** Do not add `client:*` to any new component unless it genuinely requires browser APIs or user interaction. Every additional island increases JavaScript bundle size and Time to Interactive.

### astro-icon — Astro-only

The `<Icon>` component from `astro-icon` is an **Astro-only** primitive. It cannot be used inside React islands. In `Nav.tsx`, icons that must toggle state (the hamburger ↔ close animation) are implemented as inline SVG directly in the TSX — see `HamburgerIcon()`.

---

## 3. Styling System

### Tailwind CSS v4 — `@theme` directive

This project uses **Tailwind CSS v4**, which changes how configuration works:

- There is **no `tailwind.config.js`**. That file is a v3 pattern and should not be created.
- Tailwind is loaded as a **Vite plugin** in `astro.config.mjs`:

```js
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- All design tokens are defined in the `@theme {}` block inside `src/styles/global.css`:

```css
@import "tailwindcss";

@theme {
  --color-accent: oklch(0.44 0.14 240);
  --font-display: -apple-system, BlinkMacSystemFont, "Avenir Next", ...;
  --text-xl: 1.25rem;
  /* etc. */
}
```

Tailwind v4 automatically generates utility classes from `@theme` custom properties. For example, `--font-display` becomes the `.font-display` utility, `--text-xl` becomes `.text-xl`, and `--tracking-tight` becomes `.tracking-tight`. This is why `className="font-display font-bold text-xl tracking-tight"` works in `Nav.tsx` without any config.

### Color system — oklch throughout

All colors use the `oklch()` color space for perceptually uniform lightness. The accent cobalt is `oklch(0.44 0.14 240)` on light backgrounds (WCAG AA compliant) and `oklch(0.68 0.14 240)` on dark. Both values are defined in the `@theme` block and the `[data-theme="dark"]` override respectively.

### Dark mode

Dark mode is implemented via `[data-theme="dark"]` attribute on the `<html>` element. All semantic color tokens (`--color-background`, `--color-text-primary`, etc.) are remapped in `global.css`. No Tailwind `dark:` variants are needed — the token values change automatically.

### Global utility classes

`global.css` also defines several non-Tailwind utility classes used across the codebase:

- `.page-section` — max-width container with consistent vertical padding
- `.chip` — monospace tag used for stack technology labels
- `.tag` — accent-coloured tag used for categories
- `.status-badge`, `.status-badge--shipped`, `.status-badge--in-progress`, `.status-badge--archived` — project status indicators
- `.prose` — full typography system for rendered Markdown content (headings, code blocks, blockquotes, tables)
- `.spotlight-card` — see [SpotlightCard](#spotlightcard--bento-hover-glow) below

---

## 4. Content Collections & Zod Schemas

All content schemas are defined in `src/content.config.ts` using Astro's Content Layer API with `glob()` loaders. Zod validation runs at `npm run build` — a schema violation halts the build and prints the exact file and field path that failed.

### `projects` collection

```
src/content/projects/*.md
```

The most important collection. Key schema constraints:

- `slug` must match `/^[a-z][a-z0-9-]*$/` — this becomes the URL route `/projects/{slug}`
- `category` is a strict enum: `'Machine Learning' | 'Data Engineering' | 'Statistical Modeling' | 'Predictive Analytics'`
- `status` is a strict enum: `'shipped' | 'in-progress' | 'archived'`
- `coverIcon` is required when `featured === true` — enforced by a Zod `.refine()` cross-field validator
- `order` controls sort position among featured projects — uniqueness must be verified manually (Zod cannot enforce cross-document constraints)

### `experience` collection

```
src/content/experience/*.md
```

Work history entries. The `end` field accepts `null` to represent a current role. A `.refine()` validator enforces `end >= start`.

### `skills` collection

```
src/content/skills/*.md
```

Each file represents one skill displayed in the grid on the About page. The `category` enum controls which column the skill appears in: `'Languages' | 'Libraries & Frameworks' | 'Developer Tools'`. The `iconRef` must be a valid astro-icon reference (e.g. `lucide:code-2`).

### `siteMeta` singleton

```
src/content/site-meta/index.md
```

A single file read by `BaseLayout.astro` for the `<title>`, `<meta name="description">`, and social links. Edit this file to change site-wide identity. The `glob()` loader targets `index.md` specifically, making it a singleton.

---

## 5. Routing & Page Generation

Astro uses file-based routing. Every `.astro` file in `src/pages/` becomes a route.

### Static routes

```
src/pages/index.astro      → /
src/pages/about.astro      → /about
src/pages/contact.astro    → /contact
```

### Dynamic routes — projects

```
src/pages/projects/index.astro      → /projects
src/pages/projects/[slug].astro     → /projects/:slug
```

`[slug].astro` uses `getStaticPaths()` to enumerate all project entries:

```ts
export async function getStaticPaths() {
  const projects = await getCollection('projects');
  return projects.map(entry => ({
    params: { slug: entry.data.slug },   // uses frontmatter slug, not filename
    props: { entry },
  }));
}
```

**Important:** The route parameter is `entry.data.slug` (the frontmatter field), not the filename-derived `entry.id`. This means renaming the `.md` file does not change the public URL — only changing the `slug` field does. This is intentional.

---

## 6. Advanced Component Logic

This section documents the components most likely to break if edited without understanding their internals.

---

### `MeshGradient.tsx` — WebGL Animated Background

**File:** `src/components/islands/MeshGradient.tsx`
**Directive:** `client:load`

#### What it does

Renders an animated, noise-based gradient directly to a WebGL canvas using the [OGL](https://github.com/oframe/ogl) library. The shader uses two layers of value noise at different scales and drift speeds to produce a slow-moving cobalt-to-off-white gradient. A `smoothstep` fade at the bottom blends the canvas into the page background.

#### Rendering pipeline

```
OGL Renderer → Program (vert + frag shaders) → Mesh (full-screen Triangle) → rAF loop
```

The fragment shader receives two uniforms:
- `u_time` — incremented each frame via `t * 0.001` (seconds)
- `u_resolution` — `[window.innerWidth, window.innerHeight]`, updated on resize

#### Critical implementation details

**1. Initial resize via `requestAnimationFrame`**

The resize call is deliberately wrapped in `requestAnimationFrame`:

```ts
requestAnimationFrame(resize);
```

This is required because `client:load` hydrates the component synchronously during page load, before the browser has completed layout. Reading `canvas.clientWidth` before layout gives `0`, causing OGL to call `renderer.setSize(0, 0)` and produce a tiny blue rectangle in the top-left corner. The `rAF` delay guarantees layout is complete before sizing. **Do not remove this `rAF` wrapper.**

**2. IntersectionObserver — RAF gating**

The animation loop is gated by an `IntersectionObserver` on the canvas element. When the canvas leaves the viewport (e.g. the user scrolls away from the hero), `visibleRef.current` is set to `false` and frames are skipped. This avoids burning GPU resources when the gradient is not visible.

**3. `prefers-reduced-motion` support**

If the user has requested reduced motion, the shader renders exactly one static frame and exits. The RAF loop never starts.

**4. Context cleanup**

On unmount, the effect cleanup calls `WEBGL_lose_context` to explicitly release the WebGL context. Without this, hot-reloading in development (which unmounts and remounts the component) can exhaust the browser's WebGL context limit (typically 8–16 per page).

**5. Z-index**

The gradient wrapper (`.hero-gradient` in `Hero.astro`) has `z-index: -1`. The hero content layer has `z-index: 1`. Do not change the canvas's own `position: absolute; inset: 0` styles — they are required for the canvas to fill its absolutely-positioned wrapper.

---

### `Nav.tsx` — Navigation with Morphing Dropdown

**File:** `src/components/islands/Nav.tsx`
**Directive:** `client:load`

#### What it does

Renders a sticky navigation bar with a morphing dropdown panel for the "Projects" link, and a slide-in mobile sheet. All interactivity uses React state with no animation library dependencies.

#### Panel measurement — ResizeObserver + `useLayoutEffect`

The dropdown panel must animate its height from `0` to the exact height of the panel content. Because the panel is always in the DOM (hidden via `opacity: 0`, not `display: none`), its dimensions can be measured without triggering a flash of content.

Measurement happens in `useLayoutEffect` (synchronously, before paint) to avoid a single-frame flicker:

```ts
useLayoutEffect(() => {
  PANEL_KEYS.forEach((key) => {
    const el = contentRefs.current[key];
    // scrollWidth/scrollHeight works even inside hidden (opacity:0) parents
    measuredDims.current[key] = {
      width:  el.scrollWidth,
      height: el.scrollHeight,
    };

    const ro = new ResizeObserver(() => {
      measuredDims.current[key] = { width: t.scrollWidth, height: t.scrollHeight };
    });
    ro.observe(el);
  });
}, []);
```

A `ResizeObserver` on each panel keeps the cached dimensions up to date if the panel content changes size (e.g. viewport resize).

#### Horizontal positioning

When a panel opens, its horizontal offset is calculated from `getBoundingClientRect()` to centre the panel under the triggering nav item, clamped to the nav container edges:

```ts
const center = itemRect.left - navRect.left + itemRect.width / 2;
const raw    = center - dims.width / 2;
setPanelLeft(Math.max(0, Math.min(raw, navRect.width - dims.width)));
```

This offset is applied as a CSS `translate3d(${panelLeft}px, 0, 0)` transform, animated by a CSS transition.

#### "All panels always in DOM" pattern

**Do not** conditionally render or unmount panel content. All panels are always in the DOM and switched by `opacity` + `pointerEvents`. This pattern:
- Avoids layout shift when switching between panels
- Allows `ResizeObserver` to measure all panels upfront
- Prevents content from being re-mounted (and thus re-fetched) on each open

A "sizing ghost" renders the first panel with `visibility: hidden` at the bottom of the panel box to ensure the container is always at least as wide as the widest panel.

#### `will-change` discipline

`will-change: transform` is applied to the sliding translate track **only while the panel is open** (`isOpen ? { willChange: 'transform' } : {}`). This promotes the element to its own compositor layer for smooth animation but does not keep it promoted permanently, which would waste GPU memory.

---

### `BentoCard.astro` — Dynamic Grid Cards

**File:** `src/components/primitives/BentoCard.astro`

#### Grid span system

Cards accept `colSpan` and `rowSpan` props. These are written to CSS custom properties `--col-span` and `--row-span` and consumed by `grid-column: span var(--col-span)`. This allows the parent `BentoGrid` to control card layout through props without hardcoding CSS classes.

Responsive overrides in the card's scoped `<style>`:
- ≤ 1024px: spans are clamped to `min(--col-span, 6)` — prevents 8- or 12-column cards on medium screens
- ≤ 640px: all cards become full-width (`grid-column: 1 / -1`)

#### Hover interaction — pure CSS

The hover lift effect is implemented entirely in CSS:

```css
.bento-inner:hover {
  transform: translate3d(0, -4px, 0);  /* -translate-y-1 */
  box-shadow: var(--shadow-card-hover), inset 0 0 0 1px oklch(0.44 0.14 240 / 0.35);
  border-color: var(--color-accent);
}
```

No JavaScript is involved in `BentoCard`'s hover state. `will-change: transform` is set statically on `.bento-inner` because project cards are almost always hovered.

---

### `SpotlightCard` — Cursor-Tracked Glow Effect

**CSS:** `.spotlight-card` in `src/styles/global.css`
**Logic:** `SpotlightCard.tsx` (React island)

#### How it works

The spotlight glow is a `::before` pseudo-element with a radial gradient centred at the cursor position:

```css
.spotlight-card::before {
  background: radial-gradient(
    280px circle at var(--mx) var(--my),
    oklch(0.44 0.14 240 / 0.10),
    transparent 70%
  );
}
```

`--mx` and `--my` are CSS custom properties set directly on the element via the CSSOM on every `pointermove` event in `SpotlightCard.tsx`:

```ts
// Inside SpotlightCard.tsx — simplified
const onMove = (e: PointerEvent) => {
  const rect = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
  el.style.setProperty('--my', `${e.clientY - rect.top}px`);
};
```

**Why CSSOM mutation, not React state?**

Setting `style.setProperty()` directly on the DOM element bypasses React's reconciler entirely. `pointermove` fires at up to 240Hz on high-refresh displays. Calling `setState` on every event would enqueue 240 re-renders per second, causing severe jank. The CSSOM approach updates the CSS variable synchronously in the same paint cycle with zero JavaScript overhead beyond the property write.

The glow is hidden for users who prefer reduced motion via:

```css
@media (prefers-reduced-motion: reduce) {
  .spotlight-card::before { display: none; }
}
```

---

## 7. Build & Deploy Pipeline

**File:** `.github/workflows/deploy.yml`

The pipeline uses the official Astro GitHub Pages action with OIDC authentication — no `GITHUB_TOKEN` secret is needed:

```
push to main
  └── build job
        ├── actions/configure-pages   (sets base URL)
        ├── npm ci
        ├── npm run build             (Zod validation runs here)
        └── actions/upload-pages-artifact (uploads dist/)
  └── deploy job (needs: build)
        └── actions/deploy-pages      (deploys via OIDC)
```

**Concurrency:** Only one deploy runs at a time (`cancel-in-progress: true`). Rapid pushes to `main` will cancel the in-flight deploy in favour of the latest commit.

**First-time setup:** In the GitHub repository go to **Settings → Pages → Source** and set it to **GitHub Actions**. Without this, the deploy step will fail even though the build succeeds.

---

## 8. Known Constraints & Gotchas

### YAML colons in project titles

YAML treats a bare colon followed by a space as a mapping separator. Project titles containing colons **must be quoted**:

```yaml
# WRONG — YAML parse error
title: Formula One: Statistical Learning

# CORRECT
title: "Formula One: Statistical Learning"
```

### Astro template brace escaping

Astro's template parser treats `{...}` as JavaScript expressions. Literal curly braces inside `<pre>` or `<code>` blocks (e.g. Python f-strings) must use HTML entities:

```astro
<!-- WRONG — Astro tries to evaluate this as JS -->
<code>f"{result:.3f}"</code>

<!-- CORRECT -->
<code>f"&#123;result:.3f&#125;"</code>
```

### Slug routing — frontmatter, not filename

The public URL `/projects/{slug}` is derived from the `slug` field in the Markdown frontmatter, **not** from the filename. This is set explicitly in `getStaticPaths()`:

```ts
params: { slug: entry.data.slug }  // frontmatter field
```

Renaming the `.md` file does not change the URL. Only changing the `slug` field changes the URL. This also means two files can accidentally produce the same URL if they have the same `slug` value — Astro will build both but only one page will exist (the last one processed). Keep slugs unique.

### Duplicate `id` warnings after schema changes

When `content.config.ts` changes (field renames, collection removal), Astro's glob loader may log `Duplicate id` warnings for files it has cached. These are harmless — the content store overwrites the stale entry — but they indicate the cache is stale. Clear it:

```bash
rm -rf .astro
npm run build
```

### `astro-icon` regex constraint

Icon references must match `/^[a-z][a-z0-9-]*(:[a-z0-9][a-z0-9-]*)?$/`. All Lucide icons are prefixed `lucide:` followed by lowercase kebab-case. Browse available icons at [lucide.dev](https://lucide.dev). The `*` wildcard in `astro.config.mjs` bundles the full Lucide set — tree-shaking removes unused icons at build time.

### `astro-icon` is Astro-only

The `<Icon>` component cannot be imported into React islands (`.tsx` files). For icons inside React components, use inline SVG or a separate Astro wrapper component that passes the rendered icon as a slot.

### No Prettier / ESLint configured

There is no `prettier.config.js` or `.eslintrc` in this project. `npm run format` does not exist. Code style is maintained manually. If adding a formatter, ensure it does not reformat the GLSL shader strings in `MeshGradient.tsx` — minification of those strings will break the WebGL program.
