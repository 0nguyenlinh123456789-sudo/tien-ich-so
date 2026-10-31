#!/usr/bin/env node
/**
 * Generate programmatic-SEO records into data-backlog/<section>/<priority>__<slug>.json
 * Usage: node scripts/generate-backlog.js [--target-year 2027] [--force]
 *
 * Records are interleaved by priority so every daily drip contains a mix of sections & tools.
 * Already published slugs (src/data/published) are skipped automatically.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { slugify } from '../src/lib/format.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BACKLOG = path.join(ROOT, 'data-backlog');
const PUBLISHED = path.join(ROOT, 'src', 'data', 'published');

const args = process.argv.slice(2);
const argVal = (name, def) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : def; };
const now = new Date();
const TARGET_YEAR = Number(argVal('--target-year', now.getFullYear() + (now.getMonth() >= 9 ? 1 : 0)));
const FORCE = args.includes('--force');

const vnd = (n) => {
  if (n >= 1e9) return `${String(+(n / 1e9).toFixed(2)).replace('.', ',')} tỷ`;
  if (n >= 1e6) return `${String(+(n / 1e6).toFixed(2)).replace('.', ',')} triệu`;
  return `${String(n / 1e3)} nghìn`;
};
const vndEn = (n) => {
  if (n >= 1e9) return `${+(n / 1e9).toFixed(2)} billion VND`;
  if (n >= 1e6) return `${+(n / 1e6).toFixed(2)} million VND`;
  return `${n / 1e3}k VND`;
};

// ---------- builders ----------
const groups = []; // each group = array of records of one kind (interleaved later)

// 1) Salary
{
  const vi = [], en = [];
  for (let a = 5e6; a <= 150e6; a += a < 50e6 ? 5e5 : a < 100e6 ? 1e6 : 5e6) {
    for (let dep = 0; dep <= 3; dep++) {
      const depTxt = dep ? ` ${dep} người phụ thuộc` : '';
      vi.push({
        section: 'finance', lang: 'vi', tool: 'salary',
        slug: slugify(`luong gross ${vnd(a)}${depTxt} nhan net bao nhieu`),
        title: `Lương Gross ${vnd(a)}${depTxt} nhận Net bao nhiêu?`,
        params: { mode: 'gross', amount: a, dependents: dep, region: '1' }
      });
      vi.push({
        section: 'finance', lang: 'vi', tool: 'salary',
        slug: slugify(`luong net ${vnd(a)}${depTxt} thi gross bao nhieu`),
        title: `Lương Net ${vnd(a)}${depTxt} thì Gross bao nhiêu?`,
        params: { mode: 'net', amount: a, dependents: dep, region: '1' }
      });
    }
    if (a % 1e6 === 0) {
      en.push({
        section: 'finance', lang: 'en', tool: 'salary',
        slug: slugify(`gross salary ${vndEn(a)} net take home vietnam`),
        title: `Gross salary ${vndEn(a)}: take-home pay in Vietnam`,
        params: { mode: 'gross', amount: a, dependents: 0, region: '1' }
      });
    }
  }
  groups.push(vi, en);
}

// 2) Loans
{
  const vi = [], en = [];
  const principals = [50e6, 100e6, 200e6, 300e6, 500e6, 700e6, 800e6, 1e9, 1.5e9, 2e9, 2.5e9, 3e9, 4e9, 5e9];
  const terms = [12, 24, 36, 60, 120, 180, 240, 300];
  const rates = [7, 8, 9, 10, 11, 12];
  for (const p of principals) for (const mo of terms) for (const r of rates) {
    const yrs = mo / 12;
    vi.push({
      section: 'finance', lang: 'vi', tool: 'loan',
      slug: slugify(`vay ${vnd(p)} ${yrs} nam lai suat ${r} phan tram tra bao nhieu moi thang`),
      title: `Vay ${vnd(p)} trong ${yrs} năm, lãi ${r}%/năm trả bao nhiêu mỗi tháng?`,
      params: { principal: p, months: mo, rate: r, method: 'reducing', promoMonths: 0, promoRate: 0 }
    });
    if (r % 2 === 0 && [500e6, 1e9, 2e9, 3e9].includes(p)) {
      en.push({
        section: 'finance', lang: 'en', tool: 'loan',
        slug: slugify(`${vndEn(p)} loan ${yrs} years ${r} percent monthly payment`),
        title: `${vndEn(p)} loan over ${yrs} years at ${r}%: monthly payment`,
        params: { principal: p, months: mo, rate: r, method: 'annuity', promoMonths: 0, promoRate: 0 }
      });
    }
  }
  groups.push(vi, en);
}

// 3) FIRE / compound interest
{
  const vi = [], en = [];
  const monthly = [1e6, 2e6, 3e6, 5e6, 7e6, 10e6, 15e6, 20e6, 30e6, 50e6];
  const returns = [6, 8, 10, 12, 15];
  const ages = [22, 25, 30, 35, 40];
  for (const mth of monthly) for (const r of returns) for (const age of ages) {
    const base = { currentAge: age, initial: 0, monthly: mth, annualReturn: r, contributionGrowth: 5, annualExpenses: Math.max(60e6, mth * 18), inflation: 4, withdrawalRate: 4, years: 30 };
    vi.push({
      section: 'finance', lang: 'vi', tool: 'fire',
      slug: slugify(`tiet kiem ${vnd(mth)} moi thang lai ${r} phan tram tu ${age} tuoi bao gio nghi huu`),
      title: `Tiết kiệm ${vnd(mth)}/tháng, lãi ${r}%/năm từ ${age} tuổi: bao giờ nghỉ hưu?`,
      params: base
    });
    if (age === 30) en.push({
      section: 'finance', lang: 'en', tool: 'fire',
      slug: slugify(`invest ${vndEn(mth)} per month ${r} percent fire retirement age`),
      title: `Invest ${vndEn(mth)}/month at ${r}%: when can you retire?`,
      params: base
    });
  }
  groups.push(vi, en);
}

// 4) Numerology by birth date
{
  const vi = [], en = [];
  for (let y = 1960; y <= 2010; y++) {
    for (let mo = 1; mo <= 12; mo++) {
      const days = new Date(y, mo, 0).getDate();
      for (let d = 1; d <= days; d++) {
        const dob = `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        vi.push({
          section: 'destiny', lang: 'vi', tool: 'numerology',
          slug: `sinh-ngay-${d}-thang-${mo}-nam-${y}-menh-gi-${TARGET_YEAR}`,
          title: `Sinh ngày ${d}/${mo}/${y} mệnh gì? Thần số học & vận hạn ${TARGET_YEAR}`,
          params: { dob, targetYear: TARGET_YEAR }
        });
        if (y >= 1980 && y <= 2005) en.push({
          section: 'destiny', lang: 'en', tool: 'numerology',
          slug: `born-${d}-${mo}-${y}-numerology-${TARGET_YEAR}`,
          title: `Born ${d}/${mo}/${y}: numerology & ${TARGET_YEAR} forecast`,
          params: { dob, targetYear: TARGET_YEAR }
        });
      }
    }
  }
  groups.push(vi, en);
}

// 5) Good days – next 24 months × purposes
{
  const vi = [], en = [];
  const purposes = [['general', ''], ['wedding', 'cuoi hoi'], ['move', 'chuyen nha'], ['business', 'khai truong'], ['travel', 'xuat hanh'], ['build', 'dong tho']];
  for (let k = 0; k < 24; k++) {
    const dt = new Date(now.getFullYear(), now.getMonth() + k, 1);
    const mo = dt.getMonth() + 1, y = dt.getFullYear();
    for (const [pid, ptxt] of purposes) {
      vi.push({
        section: 'destiny', lang: 'vi', tool: 'goodday',
        slug: slugify(`ngay tot thang ${mo} nam ${y} ${ptxt}`),
        title: `Ngày tốt tháng ${mo}/${y}${ptxt ? ' ' + ({ wedding: 'cưới hỏi', move: 'chuyển nhà', business: 'khai trương', travel: 'xuất hành', build: 'động thổ' })[pid] : ''}`,
        params: { month: mo, year: y, purpose: pid }
      });
    }
    en.push({ section: 'destiny', lang: 'en', tool: 'goodday', slug: `auspicious-days-${mo}-${y}`, title: `Auspicious days in ${mo}/${y}`, params: { month: mo, year: y, purpose: 'general' } });
  }
  groups.push(vi, en);
}

// 6) Money in words
{
  const vi = [], en = [];
  const amounts = new Set();
  for (let i = 1; i <= 100; i++) amounts.add(i * 1e5);
  for (let i = 1; i <= 200; i++) amounts.add(i * 1e6);
  for (let i = 1; i <= 50; i++) amounts.add(i * 1e8);
  [1500, 2500, 15000, 25000, 35000, 45000, 55000, 150000, 250000, 350000, 450000, 550000].forEach((a) => amounts.add(a));
  for (const a of [...amounts].sort((x, y) => x - y)) {
    vi.push({ section: 'tools', lang: 'vi', tool: 'moneywords', slug: `${a}-dong-viet-bang-chu`, title: `${a.toLocaleString('vi-VN')} đồng viết bằng chữ`, params: { amount: String(a), currency: 'VND', outLang: 'vi' } });
    if (a <= 1e6 && a % 1000 === 0) en.push({ section: 'tools', lang: 'en', tool: 'moneywords', slug: `${a}-usd-in-words`, title: `${a.toLocaleString('en-US')} USD in words`, params: { amount: String(a), currency: 'USD', outLang: 'en' } });
  }
  groups.push(vi, en);
}

// 7) Electricity bill by kWh
{
  const vi = [];
  for (let k = 50; k <= 1500; k += k < 600 ? 10 : 50) {
    vi.push({ section: 'life', lang: 'vi', tool: 'electric', slug: `tien-dien-${k}-kwh-bao-nhieu-tien`, title: `${k} kWh điện bao nhiêu tiền?`, params: { kwh: k } });
  }
  groups.push(vi);
}

// 8) BMI by height × weight (only plausible combinations)
{
  const vi = [], en = [];
  for (let h = 145; h <= 190; h += 1) for (let w = 38; w <= 110; w += 1) {
    const bmi = w / ((h / 100) ** 2);
    if (bmi < 15.5 || bmi > 36) continue;
    if (h % 2 || w % 2) continue; // keep the set moderate: even cm × even kg
    vi.push({ section: 'life', lang: 'vi', tool: 'bmi', slug: `cao-${h}cm-nang-${w}kg-bmi-bao-nhieu`, title: `Cao ${h}cm nặng ${w}kg có béo không? BMI bao nhiêu`, params: { h, w } });
    if (h % 4 === 0) en.push({ section: 'life', lang: 'en', tool: 'bmi', slug: `bmi-${h}cm-${w}kg`, title: `BMI for ${h} cm and ${w} kg`, params: { h, w } });
  }
  groups.push(vi, en);
}

// 9) Lunar date for each day of the next 15 months
{
  const vi = [];
  for (let k = 0; k < 460; k++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + k);
    const dd = d.getDate(), mm = d.getMonth() + 1, yy = d.getFullYear();
    vi.push({ section: 'life', lang: 'vi', tool: 'lunar', slug: `lich-am-ngay-${dd}-thang-${mm}-nam-${yy}`, title: `Lịch âm ngày ${dd}/${mm}/${yy}`, params: { d: dd, m: mm, y: yy } });
  }
  groups.push(vi);
}

// 10) Savings interest
{
  const vi = [];
  for (const p of [10e6, 20e6, 50e6, 100e6, 200e6, 300e6, 500e6, 1e9, 2e9]) for (const t of [1, 3, 6, 12, 24]) for (const r of [4, 5, 5.5, 6, 7]) {
    vi.push({ section: 'finance', lang: 'vi', tool: 'savings', slug: slugify(`gui ${vnd(p)} ky han ${t} thang lai ${String(r).replace('.', ' ')} phan tram duoc bao nhieu`), title: `Gửi ${vnd(p)} kỳ hạn ${t} tháng, lãi ${String(r).replace('.', ',')}%/năm được bao nhiêu?`, params: { p, t, r } });
  }
  groups.push(vi);
}

// 11) Maternity pay by insured salary
{
  const vi = [];
  for (let a = 5e6; a <= 50e6; a += 1e6) vi.push({ section: 'finance', lang: 'vi', tool: 'maternity', slug: slugify(`luong ${vnd(a)} sinh con duoc bao nhieu tien thai san`), title: `Lương ${vnd(a)} sinh con được bao nhiêu tiền thai sản?`, params: { avg: a } });
  groups.push(vi);
}

// 12) Social insurance lump sum
{
  const vi = [];
  for (const a of [5e6, 7e6, 10e6, 15e6, 20e6]) for (let y = 1; y <= 20; y++) vi.push({ section: 'finance', lang: 'vi', tool: 'lumpsum', slug: slugify(`dong bhxh ${y} nam luong ${vnd(a)} rut 1 lan duoc bao nhieu`), title: `Đóng BHXH ${y} năm, lương ${vnd(a)} rút 1 lần được bao nhiêu?`, params: { avg: a, years: y } });
  groups.push(vi);
}

// 13) Unit conversions
{
  const en = [], vi = [];
  for (let c = 140; c <= 210; c++) {
    en.push({ section: 'life', lang: 'en', tool: 'convert', slug: `${c}-cm-in-feet-and-inches`, title: `${c} cm in feet and inches`, params: { kind: 'cm', v: c } });
    if (c % 2 === 0) vi.push({ section: 'life', lang: 'vi', tool: 'convert', slug: `${c}-cm-la-bao-nhieu-feet`, title: `${c} cm là bao nhiêu feet, inch?`, params: { kind: 'cm', v: c } });
  }
  for (let k = 40; k <= 150; k++) en.push({ section: 'life', lang: 'en', tool: 'convert', slug: `${k}-kg-to-lbs`, title: `${k} kg to lbs`, params: { kind: 'kg', v: k } });
  for (let l = 90; l <= 330; l += 5) en.push({ section: 'life', lang: 'en', tool: 'convert', slug: `${l}-lbs-to-kg`, title: `${l} lbs to kg`, params: { kind: 'lb', v: l } });
  for (let f = 0; f <= 110; f++) en.push({ section: 'life', lang: 'en', tool: 'convert', slug: `${f}-f-to-c`, title: `${f}°F to °C`, params: { kind: 'f', v: f } });
  groups.push(en, vi);
}

// 14) Lunar calendar by month (high search demand on "lịch âm tháng …", "lịch vạn niên")
{
  const vi = [];
  for (let k = 0; k < 18; k++) {
    const d = new Date(now.getFullYear(), now.getMonth() + k, 1);
    const m = d.getMonth() + 1, y = d.getFullYear();
    vi.push({ section: 'life', lang: 'vi', tool: 'lunar', slug: `lich-am-thang-${m}-nam-${y}`, title: `Lịch âm tháng ${m} năm ${y} – Lịch vạn niên`, params: { m, y } });
  }
  groups.push(vi);
}

// ---------- write ----------
function existingSlugs() {
  const set = new Set();
  for (const base of [PUBLISHED, BACKLOG]) {
    if (!fs.existsSync(base)) continue;
    for (const sec of fs.readdirSync(base)) {
      const dir = path.join(base, sec);
      if (!fs.statSync(dir).isDirectory()) continue;
      for (const f of fs.readdirSync(dir)) if (f.endsWith('.json')) set.add(`${sec}/${f.replace(/^\d+__/, '').replace(/\.json$/, '')}`);
    }
  }
  return set;
}

const seen = FORCE ? new Set() : existingSlugs();
const unique = new Set();
// Interleave: round-robin over groups
const queues = groups.map((g) => g.slice());
let prio = 0;
let written = 0;
let startPrio = 0;
if (fs.existsSync(BACKLOG)) {
  for (const sec of fs.readdirSync(BACKLOG)) {
    const dir = path.join(BACKLOG, sec);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const f of fs.readdirSync(dir)) { const m = f.match(/^(\d+)__/); if (m) startPrio = Math.max(startPrio, Number(m[1]) + 1); }
  }
}
prio = startPrio;

while (queues.some((q) => q.length)) {
  for (const q of queues) {
    const rec = q.shift();
    if (!rec) continue;
    const key = `${rec.section}/${rec.slug}`;
    if (seen.has(key) || unique.has(key)) continue;
    unique.add(key);
    const dir = path.join(BACKLOG, rec.section);
    fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, `${String(prio).padStart(6, '0')}__${rec.slug}.json`);
    fs.writeFileSync(file, JSON.stringify(rec, null, 2));
    prio++;
    written++;
  }
}

console.log(`✔ Generated ${written} backlog records (target year ${TARGET_YEAR}) in data-backlog/`);

