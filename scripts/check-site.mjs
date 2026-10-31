#!/usr/bin/env node
/**
 * Post-build sanity check over dist/. Exits 1 on any problem so CI and the
 * drip-feed refuse to publish a broken site.
 * Checks: every tool + published record has a page; each page has a title,
 * one <h1>, a meta description; no "undefined"/"NaN"/"Infinity" in visible text.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const PUBLISHED = path.join(ROOT, 'src', 'data', 'published');
const SECTION_SLUG = {
  finance: { vi: 'tai-chinh', en: 'en/finance' },
  destiny: { vi: 'van-menh', en: 'en/destiny' },
  tools: { vi: 'cong-cu', en: 'en/tools' },
  life: { vi: 'doi-song', en: 'en/life' }
};

const problems = [];
const fail = (page, msg) => problems.push(`${page}: ${msg}`);

if (!fs.existsSync(DIST)) { console.error('dist/ missing – run `npm run build` first.'); process.exit(1); }

// 1) Every published record must have produced a page.
for (const sec of fs.readdirSync(PUBLISHED)) {
  const dir = path.join(PUBLISHED, sec);
  if (!fs.statSync(dir).isDirectory()) continue;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.json')) continue;
    const rec = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    const base = SECTION_SLUG[rec.section || sec]?.[rec.lang === 'en' ? 'en' : 'vi'];
    if (!base) { fail(f, `unknown section "${rec.section}"`); continue; }
    if (!fs.existsSync(path.join(DIST, base, `${rec.slug}.html`))) fail(f, 'no page built');
  }
}

// 2) Inspect every HTML page.
const pages = [];
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (f.endsWith('.html')) pages.push(p);
  }
})(DIST);

for (const p of pages) {
  const rel = path.relative(DIST, p).replace(/\\/g, '/');
  if (rel.startsWith('google') ) continue; // search-console verification file
  const html = fs.readFileSync(p, 'utf8');
  if (!/<title>[^<]{5,}<\/title>/.test(html)) fail(rel, 'missing title');
  if (!/<meta name="description" content="[^"]{20,}"/.test(html)) fail(rel, 'missing/short description');
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) fail(rel, 'expected exactly one <h1>');
  // Visible text only: drop scripts, styles and tags.
  const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ');
  const bad = text.match(/\b(undefined|NaN|Infinity)\b/);
  if (bad) fail(rel, `visible "${bad[1]}"`);
}

if (problems.length) {
  console.error(`✖ ${problems.length} problem(s):\n  ` + problems.slice(0, 50).join('\n  '));
  process.exit(1);
}
console.log(`✔ check-site: ${pages.length} pages OK`);
