# Static Mega-Portal (Astro + Tailwind, 100% static cho Cloudflare Pages)

Hai thị trường: tiếng Việt ở `/`, tiếng Anh ở `/en`. Tất cả công cụ chạy hoàn toàn trên trình duyệt, không có SSR và không gọi API.

## Cài đặt

```bash
npm install
npm run dev              # http://localhost:4321
npm run backlog:generate # tạo khoảng 30.000 hồ sơ trong data-backlog/
npm run drip:dry         # xem thử drip-feed (không ghi, không push)
npm run build            # xuất ra dist/
```

## Cấu hình 1 lần

| File | Nội dung |
|---|---|
| `src/config/site.json` | `siteUrl` (domain thật), tên site, `indexNowKey` (chuỗi hex 32 ký tự tự đặt), số trang mỗi ngày |
| `src/config/monetization.json` | `smartLinkUrl`, `bannerScriptUrl`, `inContentAdHtml`, `accesstradeDeepLinkPrefix` (ví dụ `https://go.isclix.com/deep_link/xxx/yyy?url=`), `topAffiliateOffers` |
| `src/config/tax-vn.json` | Giảm trừ gia cảnh, biểu thuế 5 bậc, lương cơ sở, lương tối thiểu vùng. Cập nhật tại đây khi luật thay đổi |

## Cloudflare Pages
- Build command: `npm run build`. Output: `dist`. Biến môi trường: `NODE_VERSION=20`.
- Kết nối repo GitHub: mỗi lần drip-feed push, Cloudflare tự build lại.

## Drip-feed tự động
`.github/workflows/auto-publish.yml` chạy lúc 01:00 UTC mỗi ngày:
1. Chuyển 150 file từ `data-backlog/` sang `src/data/published/`.
2. Commit rồi push lên repo.
3. Chờ trang mới lên (tối đa 15 phút), sau đó gửi danh sách URL tới `api.indexnow.org`.

Có thể chạy tay trong tab **Actions → Auto publish → Run workflow**.

## Cấu trúc
```
src/config/            cấu hình kiếm tiền, site, thuế
src/lib/               thuật toán: salary, loan, fire, numerology, lunar, tarot, numwords, vietqr, doc-templates, seo-content
src/components/        MonetizedResult, AffiliateCards, AdSlot, ShareBox, SectionPage, tools/*
src/pages/             tai-chinh | van-menh | cong-cu | en/finance | en/destiny | en/tools  ([...slug].astro)
src/data/published/    hồ sơ đã đăng (mỗi file JSON = 1 trang)
data-backlog/          kho dự trữ
scripts/               generate-backlog.js, drip-feed.js
```

