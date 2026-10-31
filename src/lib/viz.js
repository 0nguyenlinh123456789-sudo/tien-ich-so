// Bộ biểu đồ nhẹ dùng chung (SVG/CSS thuần, không thư viện).
// Mỗi hàm trả về chuỗi HTML để gán innerHTML trong script client của tool.
// Mọi nhãn/chuỗi đều đi qua escapeHtml; số được chặn NaN/Infinity/âm.
// Màu: biến CSS --viz-1..--viz-6 (xem global.css). Mỗi biểu đồ có role="img" + aria-label
// và luôn kèm nhãn chữ/số (không chỉ dựa vào màu).
import { escapeHtml as esc } from './format.js';

const num = (v) => (Number.isFinite(Number(v)) && Number(v) > 0 ? Number(v) : 0);
const color = (c, i) => (c ? esc(c) : `var(--viz-${(i % 6) + 1})`);
const loc = () => (typeof document !== 'undefined' && document.documentElement.lang === 'en' ? 'en-US' : 'vi-VN');
const pctTxt = (p) => `${(Math.round(p * 1000) / 10).toLocaleString(loc())}%`;
const fmtDefault = (v) => Math.round(v).toLocaleString('vi-VN');

/** Thanh ngang xếp chồng + chú thích. segments: [{label, value, color?}] */
export function barStack(segments, opts = {}) {
  const fmt = opts.format || fmtDefault;
  const segs = (segments || []).map((s, i) => ({ ...s, v: num(s.value), c: color(s.color, i) })).filter((s) => s.v > 0);
  const total = segs.reduce((a, s) => a + s.v, 0);
  if (!total) return '';
  const aria = esc(opts.ariaLabel || segs.map((s) => `${s.label}: ${fmt(s.v)}`).join('; '));
  const bar = segs.map((s) => `<span class="viz-seg" style="width:${((s.v / total) * 100).toFixed(2)}%;background:${s.c}" title="${esc(s.label)}"></span>`).join('');
  const legend = segs.map((s) => `<li><i style="background:${s.c}"></i><span class="viz-lg-l">${esc(s.label)}</span><b>${esc(fmt(s.v))}</b><small>${pctTxt(s.v / total)}</small></li>`).join('');
  return `<figure class="viz">${opts.title ? `<figcaption class="viz-title">${esc(opts.title)}</figcaption>` : ''}<div class="viz-stack" role="img" aria-label="${aria}">${bar}</div><ul class="viz-legend">${legend}</ul></figure>`;
}

/** Biểu đồ vành khuyên SVG. centerText: chuỗi ngắn ở giữa (vd "77%"). */
export function donut(segments, centerText = '', opts = {}) {
  const fmt = opts.format || fmtDefault;
  const segs = (segments || []).map((s, i) => ({ ...s, v: num(s.value), c: color(s.color, i) })).filter((s) => s.v > 0);
  const total = segs.reduce((a, s) => a + s.v, 0);
  if (!total) return '';
  let off = 0;
  const arcs = segs.map((s) => {
    const p = (s.v / total) * 100;
    const a = `<circle cx="21" cy="21" r="15.915" fill="none" stroke="${s.c}" stroke-width="6" stroke-dasharray="${p.toFixed(3)} ${(100 - p).toFixed(3)}" stroke-dashoffset="${(25 - off).toFixed(3)}"/>`;
    off += p;
    return a;
  }).join('');
  const aria = esc(opts.ariaLabel || segs.map((s) => `${s.label}: ${pctTxt(s.v / total)}`).join('; '));
  const legend = segs.map((s) => `<li><i style="background:${s.c}"></i><span class="viz-lg-l">${esc(s.label)}</span><b>${esc(fmt(s.v))}</b><small>${pctTxt(s.v / total)}</small></li>`).join('');
  return `<figure class="viz viz-donut">${opts.title ? `<figcaption class="viz-title">${esc(opts.title)}</figcaption>` : ''}<div class="viz-donut-row"><svg viewBox="0 0 42 42" width="140" height="140" role="img" aria-label="${aria}"><circle cx="21" cy="21" r="15.915" fill="none" stroke="var(--viz-track)" stroke-width="6"/>${arcs}<text x="21" y="22.5" text-anchor="middle" class="viz-donut-c">${esc(centerText)}</text></svg><ul class="viz-legend">${legend}</ul></div></figure>`;
}

/** Cột ngang đơn giản có giá trị. items: [{label, value, color?, note?}] */
export function bars(items, opts = {}) {
  const fmt = opts.format || fmtDefault;
  const list = (items || []).map((s, i) => ({ ...s, v: num(s.value), c: color(s.color, i) }));
  if (!list.length) return '';
  const max = Math.max(...list.map((s) => s.v)) || 1;
  const aria = esc(opts.ariaLabel || list.map((s) => `${s.label}: ${fmt(s.v)}`).join('; '));
  const rows = list.map((s) => `<div class="viz-bar"><div class="viz-bar-h"><span>${esc(s.label)}${s.note ? ` <em>${esc(s.note)}</em>` : ''}</span><b>${esc(fmt(s.v))}</b></div><div class="viz-bar-t"><span style="width:${Math.max(s.v ? 1.5 : 0, (s.v / max) * 100).toFixed(2)}%;background:${s.c}"></span></div></div>`).join('');
  return `<figure class="viz">${opts.title ? `<figcaption class="viz-title">${esc(opts.title)}</figcaption>` : ''}<div role="img" aria-label="${aria}">${rows}</div></figure>`;
}

/** Dòng thời gian dọc. steps: [{date, title, note?, state:'done'|'now'|'next'}] */
export function timeline(steps, opts = {}) {
  const list = steps || [];
  if (!list.length) return '';
  const aria = esc(opts.ariaLabel || list.map((s) => `${s.date} ${s.title}`).join('; '));
  const li = list.map((s) => {
    const st = ['done', 'now', 'next'].includes(s.state) ? s.state : 'next';
    return `<li class="viz-tl-${st}"><span class="viz-tl-dot"></span><div><div class="viz-tl-d">${esc(s.date)}</div><div class="viz-tl-t">${esc(s.title)}</div>${s.note ? `<div class="viz-tl-n">${esc(s.note)}</div>` : ''}</div></li>`;
  }).join('');
  return `<figure class="viz">${opts.title ? `<figcaption class="viz-title">${esc(opts.title)}</figcaption>` : ''}<ol class="viz-tl" role="img" aria-label="${aria}">${li}</ol></figure>`;
}

/** Sơ đồ các bước (SmartArt): số tròn màu + mũi tên nối. steps: [{icon?, title, text?}] */
export function flow(steps, opts = {}) {
  const list = steps || [];
  if (!list.length) return '';
  const aria = esc(opts.ariaLabel || list.map((s, i) => `${i + 1}. ${s.title}${s.text ? ': ' + s.text : ''}`).join('; '));
  const li = list.map((s, i) => `<li style="--c:var(--viz-${(i % 6) + 1})"><span class="viz-flow-n">${s.icon ? esc(s.icon) : i + 1}</span><div><div class="viz-flow-t">${esc(s.title)}</div>${s.text ? `<div class="viz-flow-x">${esc(s.text)}</div>` : ''}</div></li>`).join('');
  return `<figure class="viz">${opts.title ? `<figcaption class="viz-title">${esc(opts.title)}</figcaption>` : ''}<ol class="viz-flow" role="img" aria-label="${aria}">${li}</ol></figure>`;
}

/** Thẻ số liệu màu. items: [{label, value, tone?}] */
export function statCards(items) {
  const tones = ['brand', 'green', 'amber', 'rose', 'sky'];
  return `<div class="viz-stats">${(items || []).map((s) => `<div class="viz-stat viz-tone-${tones.includes(s.tone) ? s.tone : 'brand'}"><div class="viz-stat-l">${esc(s.label)}</div><div class="viz-stat-v">${esc(s.value)}</div></div>`).join('')}</div>`;
}

/** Thanh tiến độ có nhãn %. */
export function progress(ratio, label = '') {
  const p = Math.min(1, Math.max(0, Number.isFinite(Number(ratio)) ? Number(ratio) : 0));
  return `<div class="viz"><div class="viz-bar-h"><span>${esc(label)}</span><b>${pctTxt(p)}</b></div><div class="viz-bar-t" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(p * 100)}" aria-label="${esc(label)}"><span style="width:${(p * 100).toFixed(2)}%;background:var(--viz-1)"></span></div></div>`;
}
