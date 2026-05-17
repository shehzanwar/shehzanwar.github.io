// src: astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://shehzanwar.github.io',
  base: '/',
  output: 'static',
  integrations: [
    react(),
    mdx(),
    icon({
      include: {
        lucide: ['*'],
      },
      iconDir: 'src/icons',
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    define: {
      'import.meta.env.BUILD_DATE': JSON.stringify(new Date().toISOString()),
    },
  },
});
