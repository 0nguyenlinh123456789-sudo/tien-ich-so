// Shows the export / download modal (rendered once in Layout from monetization.json).
// If downloadAdHtml is set, counts down for downloadAdSeconds; otherwise enables the download button immediately (0s wait) alongside VietQR support & VIP offers.
export function gate(run) {
  const el = typeof document !== 'undefined' && document.getElementById('dl-gate');
  if (!el) return run();
  const go = el.querySelector('[data-dl-go]');
  if (!go) return run();
  const label = go.dataset.label || '⬇ Download';
  let n = Number(el.dataset.seconds ?? 0);
  el.hidden = false;
  let timer = 0;
  if (n > 0) {
    go.disabled = true;
    go.textContent = `${label} (${n})`;
    timer = window.setInterval(() => {
      n -= 1;
      if (n > 0) { go.textContent = `${label} (${n})`; return; }
      clearInterval(timer);
      go.disabled = false;
      go.textContent = label;
    }, 1000);
  } else {
    go.disabled = false;
    go.textContent = label;
  }
  const close = () => { if (timer) clearInterval(timer); el.hidden = true; go.onclick = null; };
  const closeBtn = el.querySelector('[data-dl-close]');
  if (closeBtn) closeBtn.onclick = close;
  el.onclick = (ev) => { if (ev.target === el) close(); };
  // Wire up VietQR amount tabs inside #dl-gate
  const qrBox = el.querySelector('[data-dl-qr]');
  el.querySelectorAll('[data-dl-qr-amt]').forEach((btn) => {
    btn.onclick = () => {
      if (qrBox && btn.dataset.svg) qrBox.innerHTML = btn.dataset.svg;
      el.querySelectorAll('[data-dl-qr-amt]').forEach((x) => x.classList.remove('ring-2', 'ring-emerald-500', 'bg-emerald-50'));
      btn.classList.add('ring-2', 'ring-emerald-500', 'bg-emerald-50');
    };
  });
  const copyBtn = el.querySelector('[data-dl-copy-acc]');
  if (copyBtn) {
    copyBtn.onclick = () => {
      if (navigator.clipboard && copyBtn.dataset.acc) navigator.clipboard.writeText(copyBtn.dataset.acc);
      const orig = copyBtn.textContent;
      copyBtn.textContent = '✓ Đã chép STK';
      setTimeout(() => { copyBtn.textContent = orig; }, 1600);
    };
  }
  // The click on "download" is a fresh user gesture, so print windows and downloads are not blocked.
  go.onclick = () => { close(); run(); };
}
