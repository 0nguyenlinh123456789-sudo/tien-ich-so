// Monetization helpers – reads the single central config file.
import M from '../config/monetization.json';
import qrcode from 'qrcode-generator';
import { vietQr, cleanMemo, BANKS } from './vietqr.js';

export const MONETIZATION = M;

export function wrapAffiliate(url, wrap = true) {
  if (!url) return '#';
  if (!wrap) return url;
  // Accesstrade deep-link prefixes differ per campaign (Shopee ≠ Lazada ≠ Tiki),
  // so match the merchant's hostname against the per-merchant map first.
  const map = M.accesstradeDeepLinkPrefixes || {};
  let host = '';
  try { host = new URL(url).hostname; } catch { /* relative or malformed → leave as-is */ }
  const key = Object.keys(map).find((k) => k && host.endsWith(k) && String(map[k] || '').trim());
  const prefix = (key ? String(map[key]).trim() : (M.accesstradeDeepLinkPrefix || '').trim());
  if (!prefix) return url;
  return prefix + encodeURIComponent(url);
}

/** Offers matching a context (finance | destiny | tools) and language. */
export function offersFor(context, lang = 'vi', limit = 3, tool = null) {
  const ok = (o) => o.url && (!o.lang || o.lang.includes(lang));
  const all = M.topAffiliateOffers || [];
  // Offers made for this exact tool first, then the section-wide ones.
  const list = [
    ...all.filter((o) => ok(o) && tool && o.tools?.includes(tool)),
    ...all.filter((o) => ok(o) && !o.tools && (!o.contexts || o.contexts.includes(context)))
  ];
  return list.slice(0, limit).map((o) => ({ ...o, href: wrapAffiliate(o.url, o.wrapWithAccesstrade !== false) }));
}

export const hasSmartLink = () => Boolean((M.smartLinkUrl || '').trim());


/**
 * Donation block (zero-cost, no sign-up): a static VietQR code generated at build time from
 * monetization.json -> donate { bank, account, name, memo, amounts }. Returns null until the
 * account is filled in, so nothing renders by default.
 */
export function donateInfo() {
  const d = M.donate || {};
  const account = String(d.account || '').replace(/\s/g, '');
  if (!account || !d.bank) return null;
  const bankKey = String(d.bank).trim();
  const row = BANKS.find(([bin, name]) => bin === bankKey || name.toLowerCase() === bankKey.toLowerCase());
  if (!row) return null;
  const [bin, bankName] = row;
  const memo = cleanMemo(d.memo || 'Ung ho Tien Ich So');
  const amounts = (Array.isArray(d.amounts) ? d.amounts : [10000, 20000, 50000]).map(Number).filter((n) => n > 0);
  const svg = (amount) => {
    const q = qrcode(0, 'M');
    q.addData(vietQr({ bin, account, amount, memo }));
    q.make();
    return q.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
  };
  return { bin, bankName, account, name: String(d.name || '').trim(), memo, amounts, svg: svg(0), amountSvgs: amounts.map((a) => ({ amount: a, svg: svg(a) })) };
}

export const donateUrl = () => ((M.donateUrl || '').startsWith('https://') ? M.donateUrl : '');
