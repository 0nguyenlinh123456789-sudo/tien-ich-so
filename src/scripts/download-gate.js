// Shows the download ad (rendered once in Layout from monetization.json -> downloadAdHtml)
// for a few seconds before running the download. No ad configured → runs immediately.
export function gate(run) {
  const el = typeof document !== 'undefined' && document.getElementById('dl-gate');
  if (!el) return run();
  const go = el.querySelector('[data-dl-go]');
  const label = go.dataset.label;
  let n = Number(el.dataset.seconds) || 5;
  el.hidden = false;
  go.disabled = true;
  go.textContent = `${label} (${n})`;
  const timer = setInterval(() => {
    n -= 1;
    if (n > 0) { go.textContent = `${label} (${n})`; return; }
    clearInterval(timer);
    go.disabled = false;
    go.textContent = label;
  }, 1000);
  const close = () => { clearInterval(timer); el.hidden = true; go.onclick = null; };
  el.querySelector('[data-dl-close]').onclick = close;
  // The click on "download" is a fresh user gesture, so print windows and downloads are not blocked.
  go.onclick = () => { close(); run(); };
}
