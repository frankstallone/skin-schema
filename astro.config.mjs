import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://skinschema.com',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap(),
    react(),
    partytown({
      // Example: Add dataLayer.push as a forwarding-event.
      config: {
        forward: ['dataLayer.push'],
      },
    }),
  ],
});
