#!/usr/bin/env node
/**
 * Nhắc các số liệu có hạn/cần xem lại. In bảng, luôn exit 0.
 * Trong GitHub Actions (GITHUB_ACTIONS + GITHUB_TOKEN + GITHUB_REPOSITORY), nếu có mục còn ≤ 30 ngày
 * hoặc đã quá hạn thì tạo/cập nhật đúng 1 issue mở có tiêu đề cố định (REST API qua fetch, không thư viện).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TITLE = '⏰ Số liệu cần cập nhật';
const WARN_DAYS = 30;
const DAY = 86400000;
const read = (f) => { try { return fs.readFileSync(path.join(ROOT, f), 'utf8'); } catch { return ''; } };

// Ngày hết miễn trước bạ ô tô điện: đọc từ registration-fee.js (new Date(y, m0, d ...)), dự phòng 2027-02-28.
function evFreeUntil() {
  const m = read('src/lib/registration-fee.js').match(/EV_FREE_UNTIL\s*=\s*new Date\((\d{4}),\s*(\d{1,2}),\s*(\d{1,2})/);
  if (!m) return { date: '2027-02-28', note: ' (không đọc được từ file, dùng mặc định)' };
  const d = new Date(Date.UTC(+m[1], +m[2], +m[3]));
  return { date: d.toISOString().slice(0, 10), note: '' };
}

// fx.json: field `updated` (Vietcombank "M/D/YYYY h:mm:ss AM" hoặc ISO). Hạn = updated + 3 ngày.
function fxDue() {
  try {
    const j = JSON.parse(read('src/data/fx.json'));
    const t = Date.parse(j.updated);
    if (!Number.isFinite(t)) return { date: null, note: `không đọc được updated="${j.updated}"` };
    return { date: new Date(t + 3 * DAY).toISOString().slice(0, 10), note: `cập nhật lần cuối ${j.updated}` };
  } catch (e) {
    return { date: null, note: `lỗi đọc fx.json: ${e.message}` };
  }
}

const ev = evFreeUntil();
const fx = fxDue();
const ITEMS = [
  { key: 'vat-8', desc: 'Giảm thuế GTGT 10%→8% hết hạn (NQ 204/2025/QH15, NĐ 174/2025/NĐ-CP) — kiểm tra có gia hạn không', date: '2026-12-31', file: 'src/lib/vat.js' },
  { key: 'ev-registration', desc: `Ô tô điện miễn lệ phí trước bạ (0%) hết hạn${ev.note}`, date: ev.date, file: 'src/lib/registration-fee.js' },
  { key: 'holidays', desc: 'Lịch nghỉ lễ: đã có 2027, cần thêm 2028', date: '2027-10-01', file: 'src/components/tools/HolidaysTool.astro' },
  { key: 'min-wage', desc: 'Lương tối thiểu vùng (thường đổi 1/1) — xem có nghị định mới', date: '2026-12-01', file: 'src/config/tax-vn.json' },
  { key: 'base-salary', desc: 'Lương cơ sở — xem có điều chỉnh từ 1/7', date: '2027-06-01', file: 'src/config/tax-vn.json' },
  { key: 'tt-89-2026', desc: 'TT 89/2026/TT-BGDĐT (đánh giá học sinh) có hiệu lực 01/12/2026 — rà lại nội dung liên quan', date: '2026-12-15', file: 'src/lib/grade-avg.js' },
  { key: 'electric-1279', desc: 'Giá điện QĐ 1279/QĐ-BCT — kiểm tra biểu giá mới/biểu 5 bậc', date: '2027-03-01', file: 'src/lib/electric.js' },
  { key: 'water', desc: 'Giá nước Hà Nội/TP.HCM/Hải Phòng — kiểm tra quyết định mới', date: '2027-04-01', file: 'src/lib/water.js' },
  { key: 'fx', desc: `Tỷ giá fx.json cũ hơn 3 ngày (${fx.note})`, date: fx.date, file: 'src/data/fx.json', warn: 0 }
];

const today = new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00Z').getTime();
const rows = ITEMS.map((it) => {
  const t = it.date ? Date.parse(it.date + 'T00:00:00Z') : NaN;
  const days = Number.isFinite(t) ? Math.round((t - today) / DAY) : null;
  const status = days == null ? 'LỖI' : days < 0 ? 'QUÁ HẠN' : days <= (it.warn ?? WARN_DAYS) ? 'SẮP ĐẾN' : 'OK';
  return { ...it, days, status };
});

const pad = (s, n) => String(s).padEnd(n);
console.log(`${pad('Trạng thái', 10)} ${pad('Ngày', 10)} ${pad('Còn', 6)} ${pad('Key', 16)} Mô tả  [file]`);
for (const r of rows) console.log(`${pad(r.status, 10)} ${pad(r.date ?? '?', 10)} ${pad(r.days ?? '?', 6)} ${pad(r.key, 16)} ${r.desc}  [${r.file}]`);

const due = rows.filter((r) => r.status !== 'OK');
console.log(due.length ? `\n${due.length} mục cần xử lý (≤ ${WARN_DAYS} ngày, quá hạn hoặc lỗi).` : '\nKhông có mục nào cần xử lý.');

const { GITHUB_ACTIONS, GITHUB_TOKEN, GITHUB_REPOSITORY } = process.env;
if (due.length && GITHUB_ACTIONS && GITHUB_TOKEN && GITHUB_REPOSITORY) {
  const api = `https://api.github.com/repos/${GITHUB_REPOSITORY}`;
  const headers = { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json', 'User-Agent': 'expiry-check' };
  const body = [
    `Kiểm tra tự động ngày ${new Date(today).toISOString().slice(0, 10)}. Chỉ cập nhật khi đã xác minh từ văn bản gốc.`,
    '',
    '| Trạng thái | Ngày | Còn (ngày) | Mục | File |',
    '|---|---|---|---|---|',
    ...due.map((r) => `| ${r.status} | ${r.date ?? '?'} | ${r.days ?? '?'} | ${r.desc.replace(/\|/g, '/')} | \`${r.file}\` |`)
  ].join('\n');
  try {
    const res = await fetch(`${api}/issues?state=open&per_page=100`, { headers, signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`list issues HTTP ${res.status}`);
    const found = (await res.json()).find((i) => !i.pull_request && i.title === TITLE);
    const r2 = await fetch(found ? `${api}/issues/${found.number}` : `${api}/issues`, {
      method: found ? 'PATCH' : 'POST', headers, body: JSON.stringify(found ? { body } : { title: TITLE, body }), signal: AbortSignal.timeout(20000)
    });
    if (!r2.ok) throw new Error(`${found ? 'update' : 'create'} issue HTTP ${r2.status}`);
    console.log(`${found ? 'Đã cập nhật' : 'Đã tạo'} issue: ${(await r2.json()).html_url}`);
  } catch (e) {
    console.warn(`⚠ Không tạo/cập nhật được issue: ${e.message}`);
  }
}
process.exit(0);
