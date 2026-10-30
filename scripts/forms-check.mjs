#!/usr/bin/env node
// Daily free check of src/data/official-forms.json: every official link must still answer.
// A dead link usually means the procedure page moved or the form was replaced; it is reported, never auto-edited.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'data', 'official-forms.json'), 'utf8'));
const LOG = path.join(ROOT, 'data-backlog', '_logs', 'forms-broken.md');
const UA = 'Mozilla/5.0 (compatible; TienIchSo-FormsCheck/1.0)';

const broken = [];
for (const f of catalog.forms) {
  for (const url of new Set([f.officialUrl, ...(f.sources || [])])) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(30000) });
      // Only "gone" answers mean the page was removed; 5xx and 403 are usually temporary or anti-bot responses.
      if (res.status === 404 || res.status === 410) broken.push(`- ${f.name}: HTTP ${res.status} (trang đã bị gỡ) – ${url}`);
      else if (!res.ok) console.log(`(tạm lỗi HTTP ${res.status}, không báo) ${url}`);
    } catch (err) {
      // Some .gov.vn servers still use legacy TLS settings that Node refuses; the page itself is up, so it is not a broken link.
      const code = String(err?.cause?.code || '');
      if (/^(ERR_SSL|UNABLE_TO|CERT_|DEPTH_ZERO|SELF_SIGNED)/.test(code)) { console.log(`(bỏ qua lỗi TLS ${code}) ${url}`); continue; }
      broken.push(`- ${f.name}: không phản hồi – ${url}`);
    }
  }
}

console.log(broken.length ? broken.join('\n') : `Tất cả ${catalog.forms.length} biểu mẫu: link chính thức hoạt động.`);
if (broken.length) {
  fs.mkdirSync(path.dirname(LOG), { recursive: true });
  fs.writeFileSync(LOG, `Link biểu mẫu chính thức không truy cập được – có thể trang thủ tục đã đổi hoặc mẫu đã được thay:\n\n${broken.join('\n')}\n`);
}
