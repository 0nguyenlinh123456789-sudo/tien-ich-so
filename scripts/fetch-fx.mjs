#!/usr/bin/env node
/**
 * Daily reference exchange rates from Vietcombank's public XML feed → src/data/fx.json.
 * Keeps the previous file if the feed is unreachable or malformed, so builds never break.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'fx.json');
const URL_ = 'https://portal.vietcombank.com.vn/Usercontrols/TVPortal.TyGia/pXML.aspx';
const num = (s) => { const v = Number(String(s).replace(/,/g, '')); return Number.isFinite(v) && v > 0 ? v : null; };

try {
  const res = await fetch(URL_, { signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const xml = await res.text();
  const time = (xml.match(/<DateTime>([^<]+)<\/DateTime>/) || [])[1];
  const rates = {};
  for (const m of xml.matchAll(/<Exrate CurrencyCode="(\w{3})" CurrencyName="([^"]*)" Buy="([^"]*)" Transfer="([^"]*)" Sell="([^"]*)"/g)) {
    const [, code, name, buy, transfer, sell] = m;
    const t = num(transfer), s = num(sell);
    if (t && s) rates[code] = { name: name.trim(), buy: num(buy), transfer: t, sell: s };
  }
  if (!rates.USD || Object.keys(rates).length < 10) throw new Error('feed looks incomplete');
  fs.writeFileSync(OUT, JSON.stringify({ source: 'Vietcombank', updated: time || new Date().toISOString(), rates }, null, 2) + '\n');
  console.log(`✔ fx.json: ${Object.keys(rates).length} currencies, USD sell ${rates.USD.sell}`);
} catch (e) {
  console.warn(`⚠ fetch-fx skipped (${e.message}); keeping existing fx.json`);
  if (!fs.existsSync(OUT)) process.exit(1);
}
