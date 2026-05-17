# Shehzad Anwar — Portfolio

Personal portfolio and project showcase for **Shehzad Anwar**, Machine Learning & Data Analyst and MS Analytics candidate at Georgia Tech.

Live site: [shehzanwar.github.io](https://shehzanwar.github.io)

---

## Overview

This is a statically-generated personal portfolio built with Astro v5. It showcases data engineering, machine learning, and statistical modeling projects. Content is managed entirely through Markdown files — no database, no CMS, no admin panel. Adding or updating a project is a single file edit.

The site deploys automatically to GitHub Pages on every push to `main` via GitHub Actions.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Astro v5](https://astro.build) — static output, Content Layer API |
| UI Islands | [React 19](https://react.dev) — interactive components only |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) — `@theme` directive, no config file |
| WebGL | [OGL](https://github.com/oframe/ogl) — animated mesh gradient in the hero |
| Schema Validation | [Zod](https://zod.dev) — enforces frontmatter shape at build time |
| Icons | [astro-icon](https://github.com/natemoo-re/astro-icon) — Lucide icon set |
| Deployment | GitHub Actions → GitHub Pages (OIDC, zero secrets) |

---

## Local Development

**Prerequisites:** Node.js 20+, npm 9+.

```bash
# 1. Clone the repository
git clone https://github.com/shehzanwar/shehzanwar.github.io.git
cd shehzanwar.github.io

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
# → http://localhost:4321

# 4. Build for production (validates all content schemas)
npm run build

# 5. Preview the production build locally
npm run preview
```

> **Tip:** Run `npm run build` before committing. It runs full Zod schema validation on every content file — if a frontmatter field is missing or has the wrong type, the build fails with a clear error message pointing to the exact file and field.

---

## Project Structure

```
shehzanwar.github.io/
├── src/
│   ├── components/
│   │   ├── islands/          # React interactive islands (Nav, MeshGradient)
│   │   ├── primitives/       # Low-level Astro components (BentoCard, BentoGrid)
│   │   └── sections/         # Page section components (Hero, FeaturedProjects, etc.)
│   ├── content/
│   │   ├── projects/         # ← ADD NEW PROJECTS HERE (one .md file per project)
│   │   ├── experience/       # Work experience entries
│   │   ├── skills/           # Skill entries for the About page grid
│   │   └── site-meta/        # Site-wide metadata (name, headline, socials)
│   ├── layouts/              # BaseLayout and PageLayout wrappers
│   ├── pages/                # Astro file-based routes
│   └── styles/
│       └── global.css        # Tailwind @theme tokens + global utility classes
├── public/                   # Static assets (favicon.svg, etc.)
├── astro.config.mjs
├── content.config.ts         # Zod schemas for all content collections
└── .github/workflows/        # GitHub Actions deploy pipeline
```

---

## Content Management Guide

### Adding a New Project

All projects live in `src/content/projects/`. To add a new project, create a single Markdown file in that directory. The filename becomes the content ID (internal only) — the public URL slug is controlled by the `slug` field in the frontmatter.

**Step 1.** Create the file:

```
src/content/projects/my-new-project.md
```

**Step 2.** Add the required frontmatter. Every field listed below is enforced by Zod at build time:

```yaml
---
title: "My New Project"
slug: my-new-project
summary: A one-to-two sentence description shown on project cards (20–200 characters).
description: A slightly longer description used in meta tags and the project detail sidebar (min 10 characters).
category: Machine Learning
stack:
  - Python
  - Scikit-Learn
  - Pandas
repoUrl: https://github.com/shehzanwar/my-new-project
featured: true
order: 4
coverIcon: lucide:brain
publishedAt: 2025-12-01
status: shipped
---

## Overview

Your project body content goes here. Standard Markdown is supported.
Full paragraphs, headings, lists, and code blocks all render correctly.
```

**Step 3.** Run `npm run build` to validate. The build will fail with a descriptive error if any field is invalid.

---

### Frontmatter Field Reference

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string (3–80 chars) | Yes | Project display name |
| `slug` | string | Yes | URL path segment: `/projects/{slug}`. Must be lowercase kebab-case: `^[a-z][a-z0-9-]*$` |
| `summary` | string (20–200 chars) | Yes | Short description shown on project cards |
| `description` | string (min 10 chars) | Yes | Used in page `<meta>` description and the sidebar |
| `category` | enum | Yes | See valid values below |
| `stack` | string[] (1–12 items) | Yes | Technology tags rendered as chips |
| `featured` | boolean | Yes | If `true`, appears on the homepage and requires `coverIcon` |
| `order` | integer ≥ 0 | Yes | Sort position among featured projects. Lower = first. Must be unique per featured entry |
| `coverIcon` | string | **Required when `featured: true`** | An `astro-icon` Lucide ref, e.g. `lucide:brain`. See all icons at [lucide.dev](https://lucide.dev) |
| `publishedAt` | date string | Yes | ISO format: `YYYY-MM-DD` |
| `status` | enum | Yes | See valid values below |
| `repoUrl` | URL string | Optional | GitHub or other repository link |
| `liveUrl` | URL string | Optional | Live demo or deployment link |

---

### Valid Enum Values

**`category`** — describes the nature of the project's work:

```
Machine Learning
Data Engineering
Statistical Modeling
Predictive Analytics
```

**`status`** — describes the current state of the project:

```
shipped       # Complete and publicly available
in-progress   # Actively being developed
archived      # No longer maintained
```

---

### Updating Site-Wide Metadata

Edit `src/content/site-meta/index.md` to change your name, headline, subheadline, email, or social links:

```yaml
---
name: "Shehzad Anwar"
headline: "Machine Learning & Data Analyst"
subhead: "MS Analytics candidate at Georgia Tech, specializing in machine learning..."
email: "shehzanwar@gmail.com"
socials:
  github: https://github.com/shehzanwar
  linkedin: https://linkedin.com/in/shehzanwar
---
```

---

### Updating Work Experience

Edit or add files in `src/content/experience/`. Each file requires:

```yaml
---
company: Company Name
role: Your Title
start: 2023-01-01
end: 2024-01-01       # Omit or set to null for current role
location: City, State
highlights:
  - Accomplishment bullet one.
  - Accomplishment bullet two.
skills:
  - Python
  - SQL
---
```

---

### Deploying

Push to the `main` branch. The GitHub Actions workflow at `.github/workflows/deploy.yml` builds and deploys automatically. No manual steps required.

**Prerequisite (first-time only):** In the GitHub repository, go to **Settings → Pages → Source** and set it to **GitHub Actions**.
