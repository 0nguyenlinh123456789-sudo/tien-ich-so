// Shared formatting helpers (server + client).

export function fmtMoney(value, lang = 'vi', currency) {
  const n = Math.round(Number(value) || 0);
  const cur = currency || (lang === 'vi' ? 'VND' : 'VND');
  if (cur === 'VND') {
    return new Intl.NumberFormat(lang === 'vi' ? 'vi-VN' : 'en-US').format(n) + (lang === 'vi' ? ' ₫' : ' VND');
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: cur, maximumFractionDigits: 0 }).format(n);
}

export function fmtNum(value, lang = 'vi', digits = 0) {
  return new Intl.NumberFormat(lang === 'vi' ? 'vi-VN' : 'en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(Number(value) || 0);
}

export function fmtPct(value, lang = 'vi', digits = 1) {
  return fmtNum(value * 100, lang, digits) + '%';
}

/** Parse a user-typed number: "15.000.000", "15,000,000", "15tr", "1.5 ty" */
export function parseNum(input) {
  if (typeof input === 'number') return input;
  let s = String(input || '').trim().toLowerCase();
  if (!s) return 0;
  let mul = 1;
  if (/(tỷ|ty|billion|bn|b)$/.test(s)) mul = 1e9;
  else if (/(triệu|trieu|tr|million|m)$/.test(s)) mul = 1e6;
  else if (/(nghìn|nghin|ngàn|ngan|k|thousand)$/.test(s)) mul = 1e3;
  s = s.replace(/[^\d.,-]/g, '');
  if (mul > 1) {
    // "1,5" or "1.5" as decimal when a unit is given
    s = s.replace(',', '.');
    const v = parseFloat(s);
    return isNaN(v) ? 0 : v * mul;
  }
  s = s.replace(/[.,](?=\d{3}(\D|$))/g, '');
  s = s.replace(',', '.');
  const v = parseFloat(s);
  return isNaN(v) ? 0 : v;
}

export function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export function slugify(str) {
  return String(str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function toCsv(rows) {
  return rows
    .map((r) => r.map((c) => {
      const s = String(c ?? '');
      return /[",\n;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    }).join(','))
    .join('\n');
}

export function downloadText(filename, text, mime = 'text/csv;charset=utf-8') {
  const blob = new Blob(['\ufeff' + text], { type: mime });
  downloadBlob(filename, blob);
}

import { gate } from '../scripts/download-gate.js';

export function downloadBlob(filename, blob) {
  gate(() => saveBlob(filename, blob));
}

function saveBlob(filename, blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

