#!/usr/bin/env node
/**
 * Search Console report (read-only) via a Google service account — no dependencies.
 *   npm run gsc                 → last 28 days
 *   npm run gsc -- 7            → last 7 days
 * Key file: secrets/gsc-key.json (git-ignored) or env GSC_KEY_FILE.
 * Writes secrets/gsc-report.json and prints: top queries, top pages,
 * "almost page 1" queries (position 5–20) and pages with impressions but low CTR.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/config/site.json'), 'utf8'));
const KEY = process.env.GSC_KEY_FILE || path.join(ROOT, 'secrets', 'gsc-key.json');
const PROPERTY = process.env.GSC_PROPERTY || site.siteUrl.replace(/\/?$/, '/');
const DAYS = Math.max(1, parseInt(process.argv[2], 10) || 28);

if (!fs.existsSync(KEY)) {
  console.error(`✖ Không thấy key: ${KEY}\n  Xem README mục "Search Console tự động".`);
  process.exit(1);
}
const key = JSON.parse(fs.readFileSync(KEY, 'utf8'));
const b64 = (x) => Buffer.from(typeof x === 'string' ? x : JSON.stringify(x)).toString('base64url');

async function token() {
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${b64({ alg: 'RS256', typ: 'JWT' })}.${b64({
    iss: key.client_email, scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600,
  })}`;
  const sig = crypto.createSign('RSA-SHA256').update(unsigned).sign(key.private_key, 'base64url');
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${unsigned}.${sig}` }),
  });
  const j = await res.json();
  if (!j.access_token) throw new Error(`token: ${JSON.stringify(j)}`);
  return j.access_token;
}

const day = (d) => d.toISOString().slice(0, 10);
const end = new Date(Date.now() - 2 * 864e5); // GSC data lags ~2 days
const start = new Date(end - (DAYS - 1) * 864e5);

async function query(tk, dimensions, rowLimit = 250) {
  const res = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(PROPERTY)}/searchAnalytics/query`, {
    method: 'POST', headers: { authorization: `Bearer ${tk}`, 'content-type': 'application/json' },
    body: JSON.stringify({ startDate: day(start), endDate: day(end), dimensions, rowLimit }),
  });
  const j = await res.json();
  if (j.error) throw new Error(`${j.error.code} ${j.error.message}`);
  return (j.rows || []).map((r) => ({ key: r.keys.join(' | '), clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position }));
}

const fmt = (r) => `${String(r.impressions).padStart(6)} hiển thị  ${String(r.clicks).padStart(4)} click  CTR ${(r.ctr * 100).toFixed(1).padStart(4)}%  vị trí ${r.position.toFixed(1).padStart(5)}  ${r.key}`;
const show = (title, rows) => { console.log(`\n## ${title}`); rows.length ? rows.forEach((r) => console.log(fmt(r))) : console.log('  (chưa có dữ liệu)'); };

try {
  const tk = await token();
  const [queries, pages] = await Promise.all([query(tk, ['query']), query(tk, ['page'])]);
  const sum = (k) => queries.reduce((s, r) => s + r[k], 0);
  console.log(`Search Console ${PROPERTY}  ${day(start)} → ${day(end)}`);
  console.log(`Tổng: ${sum('impressions')} hiển thị, ${sum('clicks')} click, ${queries.length} từ khóa, ${pages.length} trang`);
  show('Top từ khóa', queries.slice(0, 25));
  show('Top trang', pages.slice(0, 20));
  show('Sắp lên trang 1 (vị trí 5–20) – tối ưu nội dung trước', queries.filter((r) => r.position >= 5 && r.position <= 20).sort((a, b) => b.impressions - a.impressions).slice(0, 25));
  show('Nhiều hiển thị nhưng CTR thấp (<2%) – sửa title/description', pages.filter((r) => r.impressions >= 50 && r.ctr < 0.02).slice(0, 20));
  const out = path.join(ROOT, 'secrets', 'gsc-report.json');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify({ property: PROPERTY, start: day(start), end: day(end), queries, pages }, null, 2));
  console.log(`\n✔ Lưu ${path.relative(ROOT, out)}`);
} catch (e) {
  console.error(`✖ ${e.message}`);
  if (/403/.test(e.message)) console.error(`  Chưa cấp quyền: thêm ${key.client_email} vào Search Console → Cài đặt → Người dùng và quyền (quyền Bị hạn chế).`);
  process.exitCode = 1; // not process.exit(): avoids a libuv assert on Windows after fetch
}
