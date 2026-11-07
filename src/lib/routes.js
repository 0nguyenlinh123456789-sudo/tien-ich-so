// Static path generation for the 4 sections × 2 languages.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SECTIONS, TOOLS, toolsIn } from '../data/tools.js';

// Resolve from the project root: inside the Vite SSR bundle import.meta.url points at dist/chunks,
// so a relative URL would miss the folder and the build would silently emit zero record pages.
const FROM_CWD = join(process.cwd(), 'src', 'data', 'published');
const FROM_URL = fileURLToPath(new URL('../data/published/', import.meta.url));
const PUBLISHED_DIR = existsSync(FROM_CWD) ? FROM_CWD : FROM_URL;
const TOOL_MAP = new Map(TOOLS.map((t) => [t.id, t]));

export function getAllRecords() {
  const g = /** @type {any} */ (globalThis);
  const now = Date.now();
  if (g.__PUBLISHED_RECORDS_CACHE__ && (now - (g.__PUBLISHED_RECORDS_TS__ || 0) < 10000)) {
    return g.__PUBLISHED_RECORDS_CACHE__;
  }

  const list = [];
  if (existsSync(PUBLISHED_DIR)) {
    for (const folder of readdirSync(PUBLISHED_DIR)) {
      const dir = join(PUBLISHED_DIR, folder);
      try {
        if (!statSync(dir).isDirectory()) continue;
      } catch {
        continue;
      }
      for (const file of readdirSync(dir)) {
        if (!file.endsWith('.json')) continue;
        try {
          const data = JSON.parse(readFileSync(join(dir, file), 'utf8'));
          if (!data || !data.slug || !data.tool) continue;
          const tool = TOOL_MAP.get(data.tool);
          if (!tool) continue;
          list.push({
            ...data,
            lang: data.lang === 'en' ? 'en' : 'vi',
            section: data.section || (SECTIONS[folder] ? folder : tool.section)
          });
        } catch {
          /* ignore malformed JSON */
        }
      }
    }
  }

  list.sort((a, b) => (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0));
  g.__PUBLISHED_RECORDS_CACHE__ = list;
  g.__PUBLISHED_RECORDS_TS__ = now;
  return list;
}

export function getSectionPaths(sectionId, lang) {
  const g = /** @type {any} */ (globalThis);
  const cacheKey = `${sectionId}:${lang}`;
  const now = Date.now();
  if (g.__SECTION_PATHS_CACHE__?.[cacheKey] && (now - (g.__SECTION_PATHS_TS__?.[cacheKey] || 0) < 10000)) {
    return g.__SECTION_PATHS_CACHE__[cacheKey];
  }

  const tools = toolsIn(sectionId);
  const toolSlugs = new Set(tools.map((t) => t.slug[lang]));
  const records = getAllRecords().filter((r) => r.section === sectionId && r.lang === lang && !toolSlugs.has(r.slug));

  // Group by tool for "related" links
  const byTool = {};
  records.forEach((r) => { (byTool[r.tool] ||= []).push(r); });

  const pick = (r) => ({ slug: r.slug, title: r.title, tool: r.tool, section: r.section, lang: r.lang });
  const paths = [
    { params: { slug: undefined }, props: { kind: 'index', sectionId, lang, popular: records.slice(-60).reverse().map(pick) } },
    ...tools.map((tool) => ({
      params: { slug: tool.slug[lang] },
      props: { kind: 'tool', sectionId, lang, toolId: tool.id, popular: (byTool[tool.id] || []).slice(-24).reverse().map(pick) }
    }))
  ];
  for (const r of records) {
    const siblings = byTool[r.tool];
    const i = siblings.indexOf(r);
    const related = [];
    for (let k = 1; related.length < 8 && k < siblings.length; k++) {
      const a = siblings[i - k];
      const b = siblings[i + k];
      if (b) related.push(pick(b));
      if (a && related.length < 8) related.push(pick(a));
    }
    paths.push({ params: { slug: r.slug }, props: { kind: 'record', sectionId, lang, toolId: r.tool, record: r, related } });
  }

  g.__SECTION_PATHS_CACHE__ ||= {};
  g.__SECTION_PATHS_TS__ ||= {};
  g.__SECTION_PATHS_CACHE__[cacheKey] = paths;
  g.__SECTION_PATHS_TS__[cacheKey] = now;
  return paths;
}
