import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://skinschema.com',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
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
