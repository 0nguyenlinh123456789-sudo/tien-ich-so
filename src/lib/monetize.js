// Monetization helpers – reads the single central config file.
import M from '../config/monetization.json';

export const MONETIZATION = M;

export function wrapAffiliate(url, wrap = true) {
  if (!url) return '#';
  const prefix = (M.accesstradeDeepLinkPrefix || '').trim();
  if (!wrap || !prefix) return url;
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

