#!/usr/bin/env node
/**
 * Daily drip-feed publisher.
 * 1. Moves N records (default 150, see src/config/site.json -> dripFeedPerDay) from data-backlog/ to src/data/published/
 * 2. git commit & push  → Cloudflare Pages rebuilds automatically
 * 3. Waits until the first new URL is live, then submits all new URLs to IndexNow (Bing, Yandex, Seznam, Naver… share the pool)
 *
 * Flags:
 *   --count 150      number of records to publish
 *   --dry-run        only print what would happen
 *   --no-git         skip commit/push
 *   --no-ping        skip IndexNow
 *   --wait 900       max seconds to wait for the deploy before pinging (default 900)
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BACKLOG = path.join(ROOT, 'data-backlog');
const PUBLISHED = path.join(ROOT, 'src', 'data', 'published');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'config', 'site.json'), 'utf8'));

const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const COUNT = Number(val('--count', site.dripFeedPerDay || 150));
const DRY = has('--dry-run');
const NO_GIT = has('--no-git');
const NO_PING = has('--no-ping');
const MAX_WAIT = Number(val('--wait', 900));

const SECTION_SLUG = {
  finance: { vi: 'tai-chinh', en: 'en/finance' },
  destiny: { vi: 'van-menh', en: 'en/destiny' },
  tools: { vi: 'cong-cu', en: 'en/tools' },
  life: { vi: 'doi-song', en: 'en/life' }
};

function listBacklog() {
  if (!fs.existsSync(BACKLOG)) return [];
  const files = [];
  for (const sec of fs.readdirSync(BACKLOG)) {
    const dir = path.join(BACKLOG, sec);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const f of fs.readdirSync(dir)) if (f.endsWith('.json')) files.push({ section: sec, file: f, full: path.join(dir, f) });
  }
  return files.sort((a, b) => a.file.localeCompare(b.file));
}

function recordUrl(rec) {
  const base = site.siteUrl.replace(/\/$/, '');
  const sec = SECTION_SLUG[rec.section]?.[rec.lang === 'en' ? 'en' : 'vi'];
  return `${base}/${sec}/${rec.slug}`;
}

function sh(cmd) {
  console.log('$ ' + cmd);
  return execSync(cmd, { cwd: ROOT, stdio: 'pipe', encoding: 'utf8' }).trim();
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForLive(url) {
  const deadline = Date.now() + MAX_WAIT * 1000;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { method: 'GET', redirect: 'follow', headers: { 'Cache-Control': 'no-cache' } });
      if (res.ok) return true;
    } catch { /* not yet */ }
    await sleep(30_000);
  }
  return false;
}

async function pingIndexNow(urls) {
  const host = new URL(site.siteUrl).host;
  const body = {
    host,
    key: site.indexNowKey,
    keyLocation: `${site.siteUrl.replace(/\/$/, '')}/${site.indexNowKey}.txt`,
    urlList: urls
  };
  // IndexNow accepts up to 10,000 URLs per request
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body)
  });
  console.log(`IndexNow → HTTP ${res.status} ${res.statusText}`);
  if (res.status >= 400) console.log(await res.text());
  return res.status;
}

async function main() {
  const backlog = listBacklog();
  if (!backlog.length) {
    console.log('Backlog is empty – nothing to publish. Run `npm run backlog:generate`.');
    return;
  }
  const batch = [];
  for (const item of backlog) {
    if (batch.length >= COUNT) break;
    let rec;
    try { rec = JSON.parse(fs.readFileSync(item.full, 'utf8')); } catch (e) { console.warn('Skip invalid JSON', item.file); continue; }
    rec.section = rec.section || item.section;
    const dest = path.join(PUBLISHED, rec.section, `${rec.slug}.json`);
    if (fs.existsSync(dest)) {
      if (!DRY) fs.unlinkSync(item.full);
      continue;
    }
    batch.push({ item, rec, dest });
  }

  const publishedAt = new Date().toISOString();
  const urls = [];
  for (const { item, rec, dest } of batch) {
    urls.push(recordUrl(rec));
    if (DRY) continue;
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, JSON.stringify({ ...rec, publishedAt }, null, 2));
    fs.unlinkSync(item.full);
  }

  console.log(`${DRY ? '[dry-run] Would publish' : 'Published'} ${batch.length} records. Remaining backlog: ${backlog.length - batch.length}`);
  urls.slice(0, 10).forEach((u) => console.log('  ' + u));
  if (urls.length > 10) console.log(`  … +${urls.length - 10} more`);
  if (DRY || !batch.length) return;

  // Log for later re-pinging / auditing
  const logDir = path.join(ROOT, 'data-backlog', '_logs');
  fs.mkdirSync(logDir, { recursive: true });
  fs.writeFileSync(path.join(logDir, `${publishedAt.slice(0, 10)}.txt`), urls.join('\n') + '\n', { flag: 'a' });

  if (!NO_GIT) {
    sh('git add -A src/data/published data-backlog');
    const status = sh('git status --porcelain');
    if (status) {
      sh(`git commit -m "chore(drip): publish ${batch.length} pages ${publishedAt.slice(0, 10)}"`);
      sh('git push');
    } else {
      console.log('Nothing to commit.');
    }
  }

  if (!NO_PING) {
    if (site.siteUrl.includes('example.')) {
      console.log('⚠ siteUrl is still the example domain – skipping IndexNow. Update src/config/site.json.');
      return;
    }
    console.log(`Waiting for deployment (max ${MAX_WAIT}s): ${urls[0]}`);
    const live = NO_GIT ? true : await waitForLive(urls[0]);
    if (!live) console.log('⚠ Deployment not detected in time – pinging anyway (search engines will retry).');
    await pingIndexNow(urls);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

