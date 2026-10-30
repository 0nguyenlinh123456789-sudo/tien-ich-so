// Static path generation for the 3 sections × 2 languages.
import { SECTIONS, TOOLS, toolsIn } from '../data/tools.js';

// Every JSON file in src/data/published/** is one programmatic page.
const modules = import.meta.glob('../data/published/**/*.json', { eager: true, import: 'default' });

export function getAllRecords() {
  const list = [];
  for (const [path, data] of Object.entries(modules)) {
    if (!data || !data.slug || !data.tool) continue;
    const tool = TOOLS.find((t) => t.id === data.tool);
    if (!tool) continue;
    const folder = path.split('/').slice(-2, -1)[0];
    list.push({ ...data, lang: data.lang === 'en' ? 'en' : 'vi', section: data.section || (SECTIONS[folder] ? folder : tool.section) });
  }
  return list.sort((a, b) => String(a.slug).localeCompare(String(b.slug)));
}

export function getSectionPaths(sectionId, lang) {
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
  return paths;
}

