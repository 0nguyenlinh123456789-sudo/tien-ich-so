// In-browser photo editor for portfolio work: crop ratio, zoom/pan, rotate, flip, light & colour, filter presets, text layers.
// Non-destructive: the caller keeps the original image plus the returned `state`, so an edit can always be reopened.
import { escapeHtml as e } from './format.js';

const RATIOS = [['orig', 'Gốc', 'Original'], ['1', '1:1', '1:1'], ['4/3', '4:3', '4:3'], ['3/2', '3:2', '3:2'], ['16/9', '16:9', '16:9'], ['3/4', '3:4', '3:4'], ['4/5', '4:5', '4:5'], ['9/16', '9:16', '9:16']];
const PRESETS = {
  none: { vi: 'Gốc', en: 'None', v: {} },
  vivid: { vi: 'Rực rỡ', en: 'Vivid', v: { contrast: 115, saturate: 140 } },
  warm: { vi: 'Ấm áp', en: 'Warm', v: { sepia: 25, saturate: 120, brightness: 104 } },
  cool: { vi: 'Lạnh', en: 'Cool', v: { hue: -12, saturate: 90, brightness: 104 } },
  mono: { vi: 'Đen trắng', en: 'B&W', v: { grayscale: 100, contrast: 120 } },
  film: { vi: 'Film cổ', en: 'Vintage', v: { sepia: 45, contrast: 90, brightness: 106, saturate: 80 } },
  fade: { vi: 'Nhạt mờ', en: 'Faded', v: { contrast: 80, brightness: 112, saturate: 75 } },
  drama: { vi: 'Kịch tính', en: 'Drama', v: { contrast: 145, brightness: 92, saturate: 110 } }
};
const BASE = { brightness: 100, contrast: 100, saturate: 100, hue: 0, sepia: 0, grayscale: 0, blur: 0, vignette: 0 };
const FONTS = [['Be Vietnam Pro', 'Be Vietnam Pro'], ['Lora', 'Lora (có chân)'], ['Impact', 'Impact'], ['Courier New', 'Mono'], ['Brush Script MT', 'Viết tay']];

export const defaultState = () => ({ ratio: 'orig', zoom: 1, panX: 0, panY: 0, rot: 0, flip: false, preset: 'none', adj: { ...BASE }, texts: [], radius: 0 });

const ratioOf = (r, img, rot) => {
  if (r === 'orig') return rot % 180 ? img.height / img.width : img.width / img.height;
  const [a, b] = r.split('/').map(Number);
  return a / (b || 1);
};
const filterOf = (a) => `brightness(${a.brightness}%) contrast(${a.contrast}%) saturate(${a.saturate}%) hue-rotate(${a.hue}deg) sepia(${a.sepia}%) grayscale(${a.grayscale}%)` + (a.blur ? ` blur(${a.blur}px)` : '');

// Draws the edited image into a canvas of width W. Shared by the live preview and the final export.
function paint(cv, img, s, W) {
  const ratio = ratioOf(s.ratio, img, s.rot);
  cv.width = Math.round(W); cv.height = Math.round(W / ratio);
  const ctx = cv.getContext('2d');
  const turned = s.rot % 180 !== 0;
  const iw = turned ? img.height : img.width, ih = turned ? img.width : img.height;
  const k = Math.max(cv.width / iw, cv.height / ih) * s.zoom;
  ctx.save();
  if (s.radius) { ctx.beginPath(); ctx.roundRect(0, 0, cv.width, cv.height, (s.radius / 100) * Math.min(cv.width, cv.height) / 2); ctx.clip(); }
  ctx.filter = filterOf(s.adj);
  ctx.translate(cv.width / 2 + s.panX * cv.width, cv.height / 2 + s.panY * cv.height);
  ctx.rotate((s.rot * Math.PI) / 180);
  if (s.flip) ctx.scale(-1, 1);
  ctx.drawImage(img, (-img.width * k) / 2, (-img.height * k) / 2, img.width * k, img.height * k);
  ctx.restore();
  if (s.adj.vignette) {
    const g = ctx.createRadialGradient(cv.width / 2, cv.height / 2, Math.min(cv.width, cv.height) * 0.3, cv.width / 2, cv.height / 2, Math.hypot(cv.width, cv.height) / 2);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${s.adj.vignette / 100})`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, cv.width, cv.height);
  }
  for (const t of s.texts) {
    const size = (t.size / 100) * cv.width;
    ctx.font = `${t.bold ? 800 : 400} ${size}px "${t.font}", sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const x = t.x * cv.width, y = t.y * cv.height;
    if (t.bg) {
      const w = ctx.measureText(t.text).width + size * 0.8;
      ctx.fillStyle = t.bg; ctx.fillRect(x - w / 2, y - size * 0.75, w, size * 1.5);
    }
    if (t.shadow) { ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = size * 0.25; ctx.shadowOffsetY = size * 0.06; }
    ctx.fillStyle = t.color; ctx.fillText(t.text, x, y);
    ctx.shadowColor = 'transparent';
  }
}

export function loadImage(src) {
  return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
}

// Renders the final JPEG/PNG data URL straight from a saved state (used when re-exporting without opening the editor).
export async function renderEdited(src, state, W = 1400) {
  const img = await loadImage(src);
  const cv = document.createElement('canvas');
  paint(cv, img, state, Math.min(W, Math.max(img.width, img.height)));
  return state.radius ? cv.toDataURL('image/png') : cv.toDataURL('image/jpeg', 0.86);
}

const css = `.ie-bg{position:fixed;inset:0;z-index:100;background:rgba(15,23,42,.75);display:flex;align-items:center;justify-content:center;padding:12px}
.ie{background:#fff;border-radius:16px;width:min(1100px,100%);max-height:96vh;display:grid;grid-template-columns:minmax(0,1fr) 300px;overflow:hidden;font:14px "Be Vietnam Pro",system-ui,sans-serif;color:#0f172a}
.ie-stage{background:repeating-conic-gradient(#e2e8f0 0 25%,#f8fafc 0 50%) 0 0/20px 20px;display:flex;align-items:center;justify-content:center;padding:16px;min-height:300px;position:relative}
.ie-stage canvas{max-width:100%;max-height:calc(96vh - 90px);box-shadow:0 10px 30px rgba(0,0,0,.25);cursor:grab;touch-action:none}
.ie-side{border-left:1px solid #e2e8f0;overflow:auto;max-height:96vh;padding:14px;display:flex;flex-direction:column;gap:12px}
.ie-side h4{margin:0 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:#64748b}
.ie-row{display:flex;flex-wrap:wrap;gap:6px}.ie-b{border:1px solid #cbd5e1;background:#fff;border-radius:8px;padding:5px 9px;font:inherit;font-size:13px;cursor:pointer}
.ie-b:hover{border-color:#2563eb}.ie-b.on{background:#2563eb;border-color:#2563eb;color:#fff}
.ie-s{display:grid;grid-template-columns:86px 1fr 34px;align-items:center;gap:6px;font-size:13px;padding:3px 0}.ie-s input{width:100%;accent-color:#2563eb}.ie-s output{text-align:right;color:#64748b;font-size:12px}
.ie-pre{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}.ie-pre button{border:2px solid transparent;border-radius:8px;padding:0;background:none;cursor:pointer;font-size:11px;color:#334155}
.ie-pre button.on{border-color:#2563eb}.ie-pre canvas{width:100%;aspect-ratio:1;object-fit:cover;border-radius:6px;display:block}
.ie-t{border:1px solid #e2e8f0;border-radius:10px;padding:8px;display:grid;gap:6px}.ie-t.on{border-color:#2563eb;box-shadow:0 0 0 2px #bfdbfe}
.ie-t input[type=text],.ie-t select{width:100%;border:1px solid #cbd5e1;border-radius:6px;padding:5px 7px;font:inherit}
.ie-foot{display:flex;gap:8px;position:sticky;bottom:-14px;background:#fff;padding:10px 0 4px;margin-top:auto}
.ie-ok{flex:1;background:#2563eb;color:#fff;border:0;border-radius:10px;padding:10px;font:inherit;font-weight:700;cursor:pointer}
.ie-hint{position:absolute;bottom:8px;left:50%;transform:translateX(-50%);background:rgba(15,23,42,.7);color:#fff;font-size:12px;padding:3px 10px;border-radius:99px;white-space:nowrap}
@media(max-width:800px){.ie{grid-template-columns:1fr;overflow:auto}.ie-side{border-left:0;max-height:none}.ie-stage canvas{max-height:50vh}}`;

// Opens the editor; resolves to { dataUrl, state } on apply, or null on cancel.
export function openImageEditor(src, prev, lang = 'vi') {
  const vi = lang !== 'en';
  const L = (a, b) => (vi ? a : b);
  const s = JSON.parse(JSON.stringify(prev || defaultState()));
  s.adj = { ...BASE, ...s.adj };
  if (!document.getElementById('ie-css')) {
    const st = document.createElement('style'); st.id = 'ie-css'; st.textContent = css; document.head.appendChild(st);
  }
  return loadImage(src).then((img) => new Promise((resolve) => {
    const bg = document.createElement('div');
    bg.className = 'ie-bg';
    const slider = (key, label, min, max) => `<label class="ie-s">${label}<input type="range" min="${min}" max="${max}" data-adj="${key}" value="${s.adj[key]}"><output data-out="${key}">${s.adj[key]}</output></label>`;
    bg.innerHTML = `<div class="ie" role="dialog" aria-label="${L('Chỉnh sửa ảnh', 'Edit image')}">
<div class="ie-stage"><canvas data-cv></canvas><span class="ie-hint">${L('Kéo ảnh để dịch khung · kéo chữ để di chuyển', 'Drag to reposition · drag text to move it')}</span></div>
<div class="ie-side">
<div><h4>${L('Cắt khung', 'Crop')}</h4><div class="ie-row">${RATIOS.map(([k, a, b]) => `<button type="button" class="ie-b" data-ratio="${k}">${L(a, b)}</button>`).join('')}</div>
<label class="ie-s" style="margin-top:8px">${L('Phóng to', 'Zoom')}<input type="range" min="100" max="400" data-zoom value="${Math.round(s.zoom * 100)}"><output data-out="zoom">${Math.round(s.zoom * 100)}</output></label>
<label class="ie-s">${L('Bo góc', 'Corners')}<input type="range" min="0" max="100" data-radius value="${s.radius}"><output data-out="radius">${s.radius}</output></label>
<div class="ie-row" style="margin-top:6px"><button type="button" class="ie-b" data-act="rotl">⟲ ${L('Xoay trái', 'Left')}</button><button type="button" class="ie-b" data-act="rotr">⟳ ${L('Xoay phải', 'Right')}</button><button type="button" class="ie-b" data-act="flip">⇋ ${L('Lật', 'Flip')}</button><button type="button" class="ie-b" data-act="center">⊕ ${L('Căn giữa', 'Center')}</button></div></div>
<div><h4>${L('Bộ lọc màu', 'Filters')}</h4><div class="ie-pre">${Object.entries(PRESETS).map(([k, p]) => `<button type="button" data-preset="${k}"><canvas data-pre="${k}" width="80" height="80"></canvas>${vi ? p.vi : p.en}</button>`).join('')}</div></div>
<div><h4>${L('Ánh sáng & màu', 'Light & colour')}</h4>
${slider('brightness', L('Độ sáng', 'Brightness'), 40, 160)}${slider('contrast', L('Tương phản', 'Contrast'), 40, 180)}${slider('saturate', L('Bão hòa', 'Saturation'), 0, 200)}${slider('hue', L('Tông màu', 'Hue'), -180, 180)}${slider('sepia', L('Ngả nâu', 'Sepia'), 0, 100)}${slider('grayscale', L('Đen trắng', 'Grayscale'), 0, 100)}${slider('blur', L('Làm mờ', 'Blur'), 0, 12)}${slider('vignette', L('Tối viền', 'Vignette'), 0, 90)}</div>
<div><h4>${L('Chữ trên ảnh', 'Text layers')}</h4><div data-texts style="display:grid;gap:8px"></div><button type="button" class="ie-b" data-act="addtext" style="margin-top:6px">＋ ${L('Thêm chữ', 'Add text')}</button></div>
<div class="ie-foot"><button type="button" class="ie-b" data-act="reset">${L('Đặt lại', 'Reset')}</button><button type="button" class="ie-b" data-act="cancel">${L('Hủy', 'Cancel')}</button><button type="button" class="ie-ok" data-act="ok">✓ ${L('Áp dụng', 'Apply')}</button></div>
</div></div>`;
    document.body.appendChild(bg);
    const cv = bg.querySelector('[data-cv]');
    let active = -1;

    const preview = () => {
      const stage = bg.querySelector('.ie-stage');
      const r = ratioOf(s.ratio, img, s.rot);
      const maxW = Math.max(200, stage.clientWidth - 32), maxH = Math.max(200, Math.min(innerHeight * 0.96 - 90, innerWidth <= 800 ? innerHeight * 0.5 : 9999));
      paint(cv, img, s, Math.min(maxW, maxH * r, 1000));
    };
    const sync = () => {
      bg.querySelectorAll('[data-ratio]').forEach((b) => b.classList.toggle('on', b.dataset.ratio === s.ratio));
      bg.querySelectorAll('[data-preset]').forEach((b) => b.classList.toggle('on', b.dataset.preset === s.preset));
      bg.querySelectorAll('[data-adj]').forEach((i) => { i.value = s.adj[i.dataset.adj]; bg.querySelector(`[data-out="${i.dataset.adj}"]`).textContent = s.adj[i.dataset.adj]; });
      bg.querySelector('[data-zoom]').value = Math.round(s.zoom * 100); bg.querySelector('[data-out="zoom"]').textContent = Math.round(s.zoom * 100);
      bg.querySelector('[data-radius]').value = s.radius; bg.querySelector('[data-out="radius"]').textContent = s.radius;
      preview();
    };
    const drawTexts = () => {
      bg.querySelector('[data-texts]').innerHTML = s.texts.map((t, i) => `<div class="ie-t${i === active ? ' on' : ''}" data-ti="${i}">
<input type="text" data-tk="text" value="${e(t.text)}" maxlength="120">
<div class="ie-row" style="align-items:center"><select data-tk="font" style="flex:1">${FONTS.map(([f, n]) => `<option value="${e(f)}"${f === t.font ? ' selected' : ''}>${e(n)}</option>`).join('')}</select>
<input type="color" data-tk="color" value="${t.color}" title="${L('Màu chữ', 'Colour')}" style="width:34px;height:30px;border:0;padding:0">
<input type="color" data-tk="bg" value="${t.bg || '#000000'}" title="${L('Màu nền chữ', 'Background')}" style="width:34px;height:30px;border:0;padding:0;opacity:${t.bg ? 1 : 0.35}"></div>
<label class="ie-s">${L('Cỡ chữ', 'Size')}<input type="range" min="2" max="30" data-tk="size" value="${t.size}"><output>${t.size}</output></label>
<div class="ie-row"><button type="button" class="ie-b${t.bold ? ' on' : ''}" data-tt="bold"><b>B</b></button><button type="button" class="ie-b${t.shadow ? ' on' : ''}" data-tt="shadow">${L('Bóng', 'Shadow')}</button><button type="button" class="ie-b${t.bg ? ' on' : ''}" data-tt="bg">${L('Nền', 'Box')}</button><button type="button" class="ie-b" data-tt="del" style="margin-left:auto">🗑</button></div></div>`).join('');
    };
    const thumbs = () => Object.entries(PRESETS).forEach(([k, p]) => {
      const c = bg.querySelector(`[data-pre="${k}"]`);
      paint(c, img, { ...defaultState(), ratio: '1', adj: { ...BASE, ...p.v } }, 80);
    });

    const close = (val) => { removeEventListener('resize', preview); removeEventListener('keydown', onKey); bg.remove(); resolve(val); };
    const onKey = (ev) => { if (ev.key === 'Escape') close(null); };
    addEventListener('resize', preview); addEventListener('keydown', onKey);

    bg.addEventListener('click', (ev) => {
      const t = ev.target.closest('button');
      if (ev.target === bg) return close(null);
      if (!t) return;
      if (t.dataset.ratio) { s.ratio = t.dataset.ratio; s.panX = s.panY = 0; return sync(); }
      if (t.dataset.preset) { s.preset = t.dataset.preset; s.adj = { ...BASE, blur: s.adj.blur, vignette: s.adj.vignette, ...PRESETS[s.preset].v }; return sync(); }
      const box = t.closest('[data-ti]');
      if (box && t.dataset.tt) {
        const i = Number(box.dataset.ti), tx = s.texts[i];
        if (t.dataset.tt === 'del') { s.texts.splice(i, 1); active = -1; }
        else if (t.dataset.tt === 'bg') tx.bg = tx.bg ? '' : '#000000';
        else tx[t.dataset.tt] = !tx[t.dataset.tt];
        drawTexts(); return preview();
      }
      switch (t.dataset.act) {
        case 'rotl': s.rot = (s.rot + 270) % 360; break;
        case 'rotr': s.rot = (s.rot + 90) % 360; break;
        case 'flip': s.flip = !s.flip; break;
        case 'center': s.panX = s.panY = 0; s.zoom = 1; break;
        case 'reset': Object.assign(s, defaultState()); active = -1; drawTexts(); break;
        case 'addtext': s.texts.push({ text: L('Tên dự án', 'Project name'), x: 0.5, y: 0.85, size: 8, color: '#ffffff', font: 'Be Vietnam Pro', bold: true, shadow: true, bg: '' }); active = s.texts.length - 1; drawTexts(); break;
        case 'cancel': return close(null);
        case 'ok': {
          const out = document.createElement('canvas');
          paint(out, img, s, Math.min(1400, Math.max(img.width, img.height)));
          return close({ dataUrl: s.radius ? out.toDataURL('image/png') : out.toDataURL('image/jpeg', 0.86), state: s });
        }
        default: return;
      }
      sync();
    });
    bg.addEventListener('input', (ev) => {
      const el = ev.target;
      if (el.dataset.adj) { s.adj[el.dataset.adj] = Number(el.value); s.preset = ''; return sync(); }
      if (el.hasAttribute('data-zoom')) { s.zoom = Number(el.value) / 100; return sync(); }
      if (el.hasAttribute('data-radius')) { s.radius = Number(el.value); return sync(); }
      const box = el.closest('[data-ti]');
      if (box && el.dataset.tk) {
        const tx = s.texts[Number(box.dataset.ti)];
        tx[el.dataset.tk] = el.dataset.tk === 'size' ? Number(el.value) : el.value;
        if (el.dataset.tk === 'size') el.nextElementSibling.textContent = el.value;
        if (el.dataset.tk === 'bg') el.style.opacity = '1';
        preview();
      }
    });

    // Dragging: grab the nearest text layer if the pointer is on one, otherwise pan the photo inside the crop frame.
    let drag = null;
    cv.addEventListener('pointerdown', (ev) => {
      const r = cv.getBoundingClientRect();
      const px = (ev.clientX - r.left) / r.width, py = (ev.clientY - r.top) / r.height;
      const hit = s.texts.findIndex((t) => Math.abs(t.x - px) < 0.25 && Math.abs(t.y - py) < Math.max(0.05, (t.size / 100) * (r.width / r.height)));
      drag = { hit, x: ev.clientX, y: ev.clientY, w: r.width, h: r.height, start: hit >= 0 ? { ...s.texts[hit] } : { panX: s.panX, panY: s.panY } };
      if (hit >= 0 && hit !== active) { active = hit; drawTexts(); }
      cv.setPointerCapture(ev.pointerId); cv.style.cursor = 'grabbing';
    });
    cv.addEventListener('pointermove', (ev) => {
      if (!drag) return;
      const dx = (ev.clientX - drag.x) / drag.w, dy = (ev.clientY - drag.y) / drag.h;
      if (drag.hit >= 0) { const t = s.texts[drag.hit]; t.x = Math.min(1, Math.max(0, drag.start.x + dx)); t.y = Math.min(1, Math.max(0, drag.start.y + dy)); }
      else { s.panX = drag.start.panX + dx; s.panY = drag.start.panY + dy; }
      preview();
    });
    const end = () => { drag = null; cv.style.cursor = 'grab'; };
    cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
    cv.addEventListener('wheel', (ev) => { ev.preventDefault(); s.zoom = Math.min(4, Math.max(1, s.zoom - ev.deltaY * 0.001)); sync(); }, { passive: false });

    drawTexts(); thumbs(); requestAnimationFrame(sync);
  }));
}
