// @ts-check
import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

const site = JSON.parse(readFileSync(new URL('./src/config/site.json', import.meta.url), 'utf8'));

// 100% static output – no SSR adapter needed for Cloudflare Pages.
// build.format 'file' => /tai-chinh/tinh-luong-gross-net.html, served by Cloudflare Pages at the clean URL (no trailing slash).
export default defineConfig({
  site: site.siteUrl,
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [
    sitemap({
      entryLimit: 40000,
      filter: (page) => !page.includes('/404')
    })
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
