// Generic form <-> URL query sync: makes every result shareable & bookmarkable.
import { parseNum } from '../lib/format.js';

export function readForm(form) {
  const data = {};
  for (const el of form.elements) {
    if (!el.name) continue;
    if (el.type === 'radio') { if (el.checked) data[el.name] = el.value; continue; }
    if (el.type === 'checkbox') { data[el.name] = el.checked; continue; }
    if (el.type === 'file') continue;
    data[el.name] = el.dataset.money !== undefined ? parseNum(el.value) : el.value;
  }
  return data;
}

function writeUrl(form) {
  const p = new URLSearchParams();
  for (const el of form.elements) {
    if (!el.name || el.type === 'file' || el.dataset.noUrl !== undefined) continue;
    if (el.type === 'radio' && !el.checked) continue;
    if (el.type === 'checkbox') { if (el.checked) p.set(el.name, '1'); continue; }
    if (el.value !== '') p.set(el.name, el.dataset.money !== undefined ? String(parseNum(el.value)) : el.value);
  }
  const qs = p.toString();
  history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
}

function restore(form) {
  const p = new URLSearchParams(location.search);
  let restored = false;
  for (const el of form.elements) {
    if (!el.name || !p.has(el.name) || el.type === 'file') continue;
    const v = p.get(el.name);
    if (el.type === 'radio') el.checked = el.value === v;
    else if (el.type === 'checkbox') el.checked = v === '1';
    else el.value = el.dataset.money !== undefined ? formatMoneyInput(v) : v;
    restored = true;
  }
  return restored;
}

export function formatMoneyInput(v) {
  const n = Math.round(parseNum(v));
  return n ? new Intl.NumberFormat('vi-VN').format(n) : '';
}

/** Live thousand-separator formatting for inputs with data-money */
export function bindMoneyInputs(root) {
  root.querySelectorAll('input[data-money]').forEach((el) => {
    el.addEventListener('blur', () => { el.value = formatMoneyInput(el.value); });
    el.addEventListener('input', () => {
      const raw = el.value.replace(/[^\d]/g, '');
      if (/^[\d.,\s]*$/.test(el.value) && raw) {
        const pos = el.value.length - el.selectionStart;
        el.value = new Intl.NumberFormat('vi-VN').format(Number(raw));
        const np = Math.max(0, el.value.length - pos);
        el.setSelectionRange(np, np);
      }
    });
  });
}

/**
 * @param {HTMLFormElement} form
 * @param {(data: object) => void} onRun
 */
export function bindToolForm(form, onRun) {
  bindMoneyInputs(form);
  const run = (scroll) => {
    const data = readForm(form);
    onRun(data);
    if (scroll) {
      const target = form.closest('[data-tool]')?.querySelector('[data-monetized]');
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    writeUrl(form);
    run(true);
  });
  const restored = restore(form);
  if (restored || form.dataset.autorun === 'true') run(false);
}

export function showResult(root) {
  const sec = root.querySelector('[data-monetized]');
  if (sec) sec.hidden = false;
}

