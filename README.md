# Tiện Ích Số – static tools portal (Astro + Tailwind)

Vietnamese at `/`, English at `/en`. Every tool runs entirely in the browser: no server, no API keys, no running cost.
Live: https://tien-ich-so.0-nguyenlinh123-456-789.workers.dev (Cloudflare Workers static assets, free plan).

## Commands

```bash
npm install
npm run dev              # http://localhost:4321
npm run check            # build + scripts/check-site.mjs (run before every push)
npm run backlog:generate # refill data-backlog/ (skips slugs already published/queued)
npm run drip:dry         # preview the next daily batch (no write, no push)
npm run keywords -- "tính" "mẫu đơn"   # Google-autocomplete demand scan
```

Node 22+ is required (Astro 7). `.nvmrc` pins it for Cloudflare and CI.

## How it runs by itself

| What | Where | When |
|---|---|---|
| Publish N backlog pages, build, **check**, commit, ping IndexNow | `.github/workflows/auto-publish.yml` → `scripts/drip-feed.js` | 01:00 UTC daily |
| Build + check on every push (red ✗ = something broke) | `.github/workflows/ci.yml` | each push |
| Cloudflare rebuilds and deploys | Workers & Pages → `tien-ich-so` | each push |
| Legal/forms watcher | `.github/workflows/legal-watch.yml` | scheduled |

If the build or check fails, drip-feed restores the backlog and publishes nothing, and Cloudflare keeps serving the previous version, so the live site never goes down.

## Where to change things

| Change | File |
|---|---|
| Site URL, name, pages per day | `src/config/site.json` |
| Ads, affiliate links, Accesstrade prefix | `src/config/monetization.json` |
| Tax, base salary, regional minimum wage | `src/config/tax-vn.json` |
| Electricity tariff | `src/lib/electric.js` |
| Add/rename a tool, its SEO title and FAQ | `src/data/tools.js` (+ component in `src/components/tools/`, + line in `ToolRenderer.astro`) |
| Text of programmatic pages | `src/lib/seo-content.js` (one `case` per tool) |
| Which programmatic pages exist | `scripts/generate-backlog.js` (one numbered block per page type) |

## Layout

```
src/config/        site, monetization, tax config (JSON)
src/data/          tools.js (registry), published/ (one JSON = one live page)
src/lib/           pure logic: salary, loan, fire, lunar, bhxh, electric, units, numerology, tarot,
                   cv/doc/portfolio templates, seo-content (page text), format (escapeHtml, numbers)
src/scripts/       browser helpers: form-state (URL sync), download-gate (ad before download)
src/components/    Layout pieces, SectionPage (tool/record pages), MonetizedResult, AdSlot, tools/*
src/pages/         doi-song | tai-chinh | van-menh | cong-cu, mirrored under en/
data-backlog/      queued pages; filename order = publish order (000000-* first, zz-* last)
data-archive/      pages pulled out of the queue as thin/scaled content (full-date numerology, past/far lunar days,
                   rare unit values). drip-feed never reads it; generate-backlog treats its slugs as existing so they
                   are not recreated. To restore one: git mv it back into data-backlog/<section>/
scripts/           drip-feed, generate-backlog, check-site, keyword-scan, legal-watch, forms-check
```

## Rules that keep it safe

- Any text a visitor can control (form fields, URL params, file names) goes through `escapeHtml` before `innerHTML`.
- Legal figures (tax, insurance, tariffs) must cite the document and be verified before changing.
- Never add a paid service; everything here works on free tiers without a card.

## Search Console tự động

`npm run gsc` (hoặc `npm run gsc -- 7` cho 7 ngày) kéo số liệu Search Console chỉ-đọc qua service account: top từ khóa, top trang, từ khóa vị trí 5–20 (sắp lên trang 1) và trang CTR thấp. Kết quả lưu `secrets/gsc-report.json`.

Key đặt tại `secrets/gsc-key.json` (thư mục `secrets/` đã git-ignore — không bao giờ commit). Service account chỉ cần quyền **Bị hạn chế** trong Search Console.
