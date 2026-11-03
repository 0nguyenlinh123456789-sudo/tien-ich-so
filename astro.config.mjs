// @ts-check
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

const site = JSON.parse(readFileSync(new URL('./src/config/site.json', import.meta.url), 'utf8'));

// Sitemap <lastmod>: published records use their own publishedAt (written by scripts/drip-feed.js);
// every other page (tools, sections, static pages) gets the build date.
// Section slugs mirror SECTIONS in src/data/tools.js (kept inline so the config does not import app code).
const SECTION_SLUG = {
  life: { vi: 'doi-song', en: 'life' },
  finance: { vi: 'tai-chinh', en: 'finance' },
  destiny: { vi: 'van-menh', en: 'destiny' },
  tools: { vi: 'cong-cu', en: 'tools' }
};
const BUILD_DATE = new Date().toISOString();
const RECORD_LASTMOD = new Map();
const PUBLISHED = fileURLToPath(new URL('./src/data/published/', import.meta.url));
for (const dir of readdirSync(PUBLISHED)) {
  const full = join(PUBLISHED, dir);
  if (!statSync(full).isDirectory()) continue;
  for (const f of readdirSync(full)) {
    if (!f.endsWith('.json')) continue;
    try {
      const rec = JSON.parse(readFileSync(join(full, f), 'utf8'));
      const lang = rec.lang === 'en' ? 'en' : 'vi';
      const sec = SECTION_SLUG[rec.section || dir]?.[lang];
      const date = rec.publishedAt ? new Date(rec.publishedAt) : null;
      if (!sec || !rec.slug || !date || Number.isNaN(+date)) continue;
      RECORD_LASTMOD.set(`${lang === 'en' ? '/en' : ''}/${sec}/${rec.slug}`, date.toISOString());
    } catch { /* malformed record: falls back to build date */ }
  }
}
const cleanPath = (url) => new URL(url).pathname.replace(/\.html$/, '').replace(/\/+$/, '') || '/';

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
      filter: (page) => !page.includes('/404'),
      serialize: (item) => ({ ...item, lastmod: RECORD_LASTMOD.get(cleanPath(item.url)) || BUILD_DATE })
    })
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
