import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwind from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://agentdiaries.hexora.ca',
  integrations: [mdx(), react()],
  vite: {
    plugins: [tailwind()]
  }
});
