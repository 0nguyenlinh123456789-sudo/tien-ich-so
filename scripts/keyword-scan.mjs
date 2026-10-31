#!/usr/bin/env node
/**
 * Free demand discovery from Google autocomplete (what people actually type).
 * Usage: node scripts/keyword-scan.mjs [--hl vi --gl vn] seed1 "seed 2" ...
 * Expands each seed with a–z / common words and ranks suggestions by how often
 * they reappear across expansions (a rough popularity signal; no search volumes).
 */
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args.splice(i, 2)[1] : d; };
const hl = opt('--hl', 'vi'), gl = opt('--gl', 'vn');
const seeds = args.length ? args : ['tính', 'cách tính', 'tra cứu', 'mẫu đơn', 'đổi', 'xem', 'lịch'];
const tails = ['', ...'abcdeghiklmnopqrstuvxy'.split('')];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function suggest(q) {
  const url = `https://suggestqueries.google.com/complete/search?client=firefox&hl=${hl}&gl=${gl}&q=${encodeURIComponent(q)}`;
  try { const r = await fetch(url); return (await r.json())[1] || []; } catch { return []; }
}

const score = new Map();
for (const seed of seeds) {
  for (const t of tails) {
    const list = await suggest(t ? `${seed} ${t}` : seed);
    list.forEach((s, i) => score.set(s, (score.get(s) || 0) + (10 - i)));
    await sleep(150); // be polite
  }
}
const top = [...score].sort((a, b) => b[1] - a[1]).slice(0, Number(opt('--top', 150)));
for (const [k, v] of top) console.log(String(v).padStart(4), k);
