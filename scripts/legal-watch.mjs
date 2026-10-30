#!/usr/bin/env node
/**
 * Free legal-update watcher (no AI, no paid API).
 * 1. Reads the latest documents from the Government's official portal (vanban.chinhphu.vn).
 * 2. Keeps only legal instruments (Luật, Nghị định, Nghị quyết, Thông tư, Quyết định TTg…) whose subject matches the site's topics.
 * 3. Rule-based review: official domains only, valid document number and date, attachment really downloadable.
 *    Anything that fails a rule is rejected and logged – it is never published.
 * 4. Writes src/data/legal-updates.json (newest first). Items touching salary/tax/insurance are flagged `impact`
 *    so the owner gets a GitHub issue: numbers in src/config/tax-vn.json are never changed automatically.
 *
 * Flags: --dry-run (print only)   --pages N (listing pages to read, default 1)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'src', 'data', 'legal-updates.json');
const IMPACT_OUT = path.join(ROOT, 'data-backlog', '_logs', 'legal-impact.md');
const BASE = 'https://vanban.chinhphu.vn';
const UA = 'Mozilla/5.0 (compatible; TienIchSo-LegalWatch/1.0; +https://github.com)';
const DRY = process.argv.includes('--dry-run');
const MAX_ITEMS = 400;

// Document type from the number suffix. Letters (VPCP-xx), notices (TB-) and reports are not legal instruments.
const TYPES = [
  [/\/QH\d+$/, 'Luật / Nghị quyết Quốc hội'],
  [/\/UBTVQH\d+$/, 'Nghị quyết UBTVQH'],
  [/\/NĐ-CP$/, 'Nghị định'],
  [/\/NQ-CP$/, 'Nghị quyết Chính phủ'],
  [/\/TT-[A-ZĐ]+$/, 'Thông tư'],
  [/\/TTLT-/, 'Thông tư liên tịch'],
  [/\/QĐ-TTg$/, 'Quyết định Thủ tướng'],
  [/\/CT-TTg$/, 'Chỉ thị Thủ tướng'],
  [/\/L-CTN$/, 'Lệnh công bố Luật']
];

// Topic keywords (matched on the lower-cased subject). `impact` topics affect the site's calculators.
const TOPICS = [
  { id: 'luong', label: 'Tiền lương', impact: true, kw: ['tiền lương', 'lương cơ sở', 'lương tối thiểu', 'mức lương', 'phụ cấp'] },
  { id: 'thue', label: 'Thuế TNCN', impact: true, kw: ['thuế thu nhập cá nhân', 'giảm trừ gia cảnh', 'thuế tncn', 'quản lý thuế'] },
  { id: 'baohiem', label: 'Bảo hiểm', impact: true, kw: ['bảo hiểm xã hội', 'bảo hiểm y tế', 'bảo hiểm thất nghiệp', 'hưu trí', 'lương hưu'] },
  { id: 'laodong', label: 'Lao động – Việc làm', kw: ['bộ luật lao động', 'hợp đồng lao động', 'người lao động', 'việc làm', 'an toàn, vệ sinh lao động'] },
  { id: 'dansu', label: 'Dân sự – Hợp đồng', kw: ['dân sự', 'hợp đồng', 'giao dịch', 'công chứng', 'chứng thực'] },
  { id: 'nhadat', label: 'Nhà ở – Đất đai', kw: ['nhà ở', 'đất đai', 'bất động sản', 'quyền sử dụng đất', 'thuê nhà'] },
  { id: 'thuongmai', label: 'Thương mại – Doanh nghiệp', kw: ['luật thương mại', 'mua bán hàng hóa', 'đăng ký doanh nghiệp', 'thành lập doanh nghiệp', 'hộ kinh doanh', 'hóa đơn điện tử'] },
  { id: 'bieumau', label: 'Biểu mẫu – Thủ tục', kw: ['biểu mẫu', 'mẫu đơn', 'tờ khai', 'thủ tục hành chính', 'hộ tịch', 'cư trú', 'căn cước', 'đăng ký'] }
];

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

async function get(url, method = 'GET') {
  const res = await fetch(url, { method, headers: { 'User-Agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(30000) });
  return res;
}

/** Parse the listing table: one <tr> per document. */
function parseListing(html) {
  const rows = html.split(/<tr[\s>]/).slice(1);
  const out = [];
  for (const r of rows) {
    const code = r.match(/<span class="code">([^<]+)<\/span>/)?.[1];
    const date = r.match(/<span class="issued-date">([^<]+)<\/span>/)?.[1];
    const title = r.match(/<span class="substract">([\s\S]*?)<\/span>/)?.[1];
    const href = r.match(/href='(\/\?pageid=27160&docid=\d+)'/)?.[1];
    const files = [...r.matchAll(/href="(https:\/\/datafiles\.chinhphu\.vn\/[^"]+)"/g)].map((m) => m[1]);
    if (code && date && title && href) out.push({ code: decode(code), date: decode(date), title: decode(title), url: BASE + href.replace('&amp;', '&'), files });
  }
  return out;
}

// Internal state-administration subjects that match keywords but do not concern ordinary users.
const EXCLUDE = ['vị trí việc làm', 'biên chế', 'cán bộ, công chức', 'hệ thống chính trị', 'vốn nhà nước'];

function classify(item) {
  const type = TYPES.find(([re]) => re.test(item.code))?.[1] || null;
  const t = item.title.toLowerCase();
  if (EXCLUDE.some((k) => t.includes(k))) return { type, topics: [], impact: false };
  const topics = TOPICS.filter((tp) => tp.kw.some((k) => t.includes(k))).map((tp) => tp.id);
  return { type, topics, impact: TOPICS.some((tp) => tp.impact && topics.includes(tp.id)) };
}

/** Rule-based review. Returns a list of problems; empty = approved. */
async function review(item) {
  const problems = [];
  if (!/^\d+\/(\d{4}\/)?[A-Za-zĐđ0-9-]+$/.test(item.code)) problems.push('số hiệu sai định dạng');
  const m = item.date.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  const d = m ? new Date(`${m[3]}-${m[2]}-${m[1]}T00:00:00Z`) : null;
  if (!d || Number.isNaN(+d) || d.getUTCFullYear() < 2015 || d > new Date(Date.now() + 864e5)) problems.push('ngày ban hành không hợp lệ');
  if (!item.url.startsWith(BASE + '/')) problems.push('không phải nguồn chính thống');
  if (item.title.length < 10 || item.title.length > 800 || /[<>]/.test(item.title)) problems.push('trích yếu bất thường');
  const file = item.files.find((f) => /\.(pdf|docx?|zip)$/i.test(f));
  if (!file) problems.push('không có tệp văn bản gốc');
  else {
    try {
      const res = await get(file, 'HEAD');
      if (!res.ok) problems.push(`tệp gốc không tải được (HTTP ${res.status})`);
    } catch (err) { problems.push('tệp gốc không phản hồi'); }
  }
  // The number's year (when present) must match the issue year
  const y = item.code.match(/^\d+\/(\d{4})\//)?.[1];
  if (y && m && y !== m[3]) problems.push('năm trong số hiệu khác năm ban hành');
  return problems;
}

async function main() {
  const html = await (await get(BASE + '/')).text();
  const listed = parseListing(html);
  if (!listed.length) throw new Error('Không đọc được danh sách văn bản – cấu trúc trang có thể đã thay đổi.');

  const existing = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : { items: [] };
  const seen = new Set(existing.items.map((x) => x.code));
  const added = [];
  const rejected = [];

  for (const item of listed) {
    if (seen.has(item.code)) continue;
    const c = classify(item);
    if (!c.type || !c.topics.length) continue; // not a legal instrument, or off-topic for this site
    const problems = await review(item);
    if (problems.length) { rejected.push({ code: item.code, problems }); continue; }
    added.push({ code: item.code, type: c.type, date: item.date, title: item.title, url: item.url, file: item.files[0], topics: c.topics, impact: c.impact, checkedAt: new Date().toISOString().slice(0, 10) });
  }

  console.log(`Đọc ${listed.length} văn bản · thêm ${added.length} · loại ${rejected.length}`);
  for (const a of added) console.log(`  + ${a.code} [${a.topics.join(',')}]${a.impact ? ' ⚠ ảnh hưởng công cụ tính' : ''} – ${a.title.slice(0, 90)}`);
  for (const r of rejected) console.log(`  ✗ ${r.code}: ${r.problems.join('; ')}`);
  if (DRY || !added.length) return;

  const toDate = (s) => s.split('/').reverse().join('-');
  const items = [...added, ...existing.items].sort((a, b) => toDate(b.date).localeCompare(toDate(a.date))).slice(0, MAX_ITEMS);
  fs.writeFileSync(OUT, JSON.stringify({ source: 'Cổng Thông tin điện tử Chính phủ – vanban.chinhphu.vn', updatedAt: new Date().toISOString(), topics: TOPICS.map(({ id, label }) => ({ id, label })), items }, null, 2) + '\n');

  const impact = added.filter((a) => a.impact);
  if (impact.length) {
    fs.mkdirSync(path.dirname(IMPACT_OUT), { recursive: true });
    fs.writeFileSync(IMPACT_OUT, `Văn bản mới có thể làm thay đổi số liệu trong src/config/tax-vn.json – cần người kiểm tra và cập nhật:\n\n${impact.map((a) => `- **${a.code}** (${a.date}) – ${a.title}\n  ${a.url}`).join('\n')}\n`);
  }
}

main().catch((err) => { console.error(err.message); process.exit(1); });
