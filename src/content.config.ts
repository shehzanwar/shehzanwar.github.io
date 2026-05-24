// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// ─── Shared regex ─────────────────────────────────────────────────
// Astro-icon reference: "collection:icon-name" or bare local name (e.g. "logo")
const iconRefRegex = /^[a-z][a-z0-9-]*(:[a-z0-9][a-z0-9-]*)?$/;
const slugRegex    = /^[a-z][a-z0-9-]*$/;

// ─── projects ─────────────────────────────────────────────────────
const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: z
    .object({
      title:       z.string().min(3).max(80),
      slug:        z.string().min(3).max(80).regex(slugRegex, {
                     message: 'slug must be lowercase kebab-case',
                   }),
      summary:     z.string().min(20).max(200),
      description: z.string().min(10),
      category:    z.enum(['Machine Learning', 'Data Engineering', 'Statistical Modeling', 'Predictive Analytics', 'Data Analysis', 'Analytics Engineering']),
      stack:       z.array(z.string().min(1).max(40)).min(1).max(12),
      repoUrl:     z.string().url().optional(),
      liveUrl:     z.string().url().optional(),
      // Optional per file; required by refine when featured === true
      coverIcon:   z
                     .string()
                     .regex(iconRefRegex, {
                       message: 'coverIcon must be a valid astro-icon ref (e.g. lucide:chart-bar)',
                     })
                     .optional(),
      featured:    z.boolean(),
      // Note: uniqueness of order among featured entries must be validated
      // at query-time (cross-document constraints are outside Zod's scope).
      order:       z.number().int().nonnegative(),
      publishedAt: z.coerce.date(),
      status:      z.enum(['shipped', 'in-progress', 'archived']),
    })
    .refine(
      (data) => !data.featured || (data.coverIcon !== undefined && data.coverIcon.length > 0),
      { message: 'coverIcon must be non-empty when featured is true', path: ['coverIcon'] },
    ),
});

// ─── experience ───────────────────────────────────────────────────
const experience = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/experience' }),
  schema: z
    .object({
      company:    z.string().min(1).max(120),
      role:       z.string().min(1).max(100),
      type:       z.enum(['Professional', 'Capstone', 'Internship']).default('Professional'),
      start:      z.coerce.date(),
      // null = current role; undefined = field omitted (treated as current)
      end:        z.coerce.date().nullable().optional(),
      location:   z.string().min(1).max(100),
      highlights: z.array(z.string().min(5)).min(1).max(10),
      skills:     z.array(z.string().min(1).max(40)).min(1).max(20),
    })
    .refine(
      (data) => data.end == null || data.end >= data.start,
      { message: 'end date must be on or after start date', path: ['end'] },
    ),
});

// ─── siteMeta (singleton) ─────────────────────────────────────────
const siteMeta = defineCollection({
  loader: glob({ pattern: 'index.md', base: './src/content/site-meta' }),
  schema: z.object({
    name:     z.string().min(1).max(80),
    headline: z.string().min(1).max(120),
    subhead:  z.string().min(1).max(280),
    email:    z.string().email(),
    socials:  z.record(z.string().url()),
    cvUrl:    z.string().url().optional(),
  }),
});

// ─── skills (amendment) ───────────────────────────────────────────
const skills = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/skills' }),
  schema: z.object({
    title:    z.string().min(1).max(80),
    category: z.enum(['Languages', 'Libraries & Frameworks', 'Developer Tools']),
    tags:     z.array(z.string().min(1).max(50)).min(1).max(10),
    iconRef:  z.string().min(1).regex(iconRefRegex, {
                message: 'iconRef must be a valid astro-icon ref (e.g. lucide:code)',
              }),
  }),
});

// ─── Export ───────────────────────────────────────────────────────
export const collections = { projects, experience, siteMeta, skills };
