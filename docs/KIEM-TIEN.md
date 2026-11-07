# Kiếm tiền từ Tiện Ích Số – 0 đồng chi phí

Mọi mục dưới đây đều **miễn phí đăng ký, không cần thẻ, không phí duy trì**. Chỉ cần điền link/mã vào
`src/config/monetization.json` rồi push: Cloudflare tự build và lên web trong ~2 phút.

Thứ tự nên làm (dễ → khó, tiền về ngay → cần duyệt):

## 1. Nhận ủng hộ qua VietQR (làm ngay, 2 phút, không cần duyệt)

Điền trong `monetization.json`:

```json
"donate": { "bank": "Vietcombank", "account": "0011001234567", "name": "NGUYEN VAN A" }
```

`bank` là tên hoặc BIN trong `src/lib/vietqr.js`. Sau khi push, dưới **mọi kết quả tính toán** và ở trang `/ung-ho`
sẽ có mã QR chuyển khoản kèm nút 10k/20k/50k. Tiền vào thẳng tài khoản, không qua trung gian, không phí.

Thêm `"donateUrl": "https://ko-fi.com/<ten>"` (Ko-fi miễn phí 0% phí nền tảng) hoặc `https://paypal.me/<ten>` cho khách nước ngoài ở `/en`.

## 2. Tiếp thị liên kết Shopee / Lazada / Tiki qua Accesstrade (miễn phí, duyệt 1–3 ngày)

Trang đã có sẵn 22 ô gợi ý sản phẩm theo từng công cụ (BMI → cân, tiền điện → ổ cắm đo điện, QR → bảng mica…).
Hiện link dẫn thẳng về Shopee nên **chưa có hoa hồng**. Để có hoa hồng:

1. Đăng ký publisher tại https://pub.accesstrade.vn (cá nhân, miễn phí). Khai website: link workers.dev hiện tại.
2. Vào chiến dịch Shopee / Lazada / Tiki → bấm *Đăng ký chạy* → được duyệt.
3. Lấy **deep link prefix** (dạng `https://go.isclix.com/deep_link/<id>?url=`) và dán vào
   `"accesstradeDeepLinkPrefix"`. Toàn bộ 22 link tự động bọc lại → mỗi đơn hàng khách mua trong 7–30 ngày
   sau khi bấm link đều tính hoa hồng (Shopee ~1–10% tùy ngành).

Thay thế hoặc bổ sung: Shopee Affiliate trực tiếp (https://affiliate.shopee.vn) – cũng miễn phí, tự tạo link theo
từ khóa rồi thay `url` của từng offer.

Cho bản `/en`: Amazon Associates (https://affiliate-program.amazon.com) miễn phí, đổi `url` các offer `lang: ["en"]`
sang link có tag `?tag=<id>-20`. Lưu ý cần 3 đơn trong 180 ngày để giữ tài khoản.

## 3. Quảng cáo hiển thị không cần tên miền riêng (duyệt trong ngày)

Hai mạng nhận cả subdomain `workers.dev`, trả qua PayPal/chuyển khoản, không cần tên miền:

- **Adsterra** (https://adsterra.com) – chọn *Banner 300×250* và *Native banner*. Tránh Popunder/Social bar vì phá
  trải nghiệm và làm Google hạ hạng.
- **Monetag** (https://monetag.com) – tương tự, dùng *Multitag* hoặc *In-page push*.

Dán mã vào:

| Vị trí | Khóa trong monetization.json |
|---|---|
| Giữa kết quả tính (mọi công cụ) | `inContentAdHtml` |
| Dính đáy màn hình điện thoại | `stickyAdHtml` |
| 5 giây trước khi tải CV/PDF/ảnh | `downloadAdHtml` (chỉnh `downloadAdSeconds`) |
| Script toàn trang (nếu mạng yêu cầu) | `bannerScriptUrl` + `bannerScriptAttributes` |

RPM thực tế cho traffic Việt Nam thấp (khoảng 0,3–1,5 USD / 1.000 lượt xem) nên đây là nguồn phụ; nguồn chính vẫn là mục 2 và 4.

## 4. Google AdSense (RPM cao nhất, cần tên miền riêng – vẫn có cách 0 đồng)

AdSense **không duyệt** subdomain kiểu `*.workers.dev`; cần tên miền bạn sở hữu. Cách miễn phí:

1. Xin tên miền **`.eu.org`** tại https://nic.eu.org (miễn phí vĩnh viễn, duyệt thủ công 1–4 tuần). Khi khai
   nameserver, dùng 2 NS mà Cloudflare cấp cho bạn (thêm site vào Cloudflare *Free* trước, mục "Add a site").
2. Khi tên miền hoạt động trên Cloudflare: Workers & Pages → `tien-ich-so` → *Settings* → *Domains & Routes* →
   *Add custom domain*. Đổi `siteUrl` trong `src/config/site.json` sang tên miền mới, push.
3. Đợi ~1–2 tháng cho Google index lại tên miền mới (sitemap tự cập nhật), rồi đăng ký AdSense tại
   https://adsense.google.com. Dán dòng ads.txt được cấp vào `"adsTxt"`, mã quảng cáo vào `inContentAdHtml` /
   `stickyAdHtml`.

Trang đã có sẵn: Chính sách bảo mật, Điều khoản, Giới thiệu, Liên hệ, ads.txt động – đủ điều kiện nội dung AdSense yêu cầu.

## 5. Nhận việc qua Zalo (giá trị đơn cao nhất)

Điền `"zaloUrl": "https://zalo.me/09xxxxxxxx"` → footer và trang Liên hệ hiện nút Zalo. Khách từ công cụ
Portfolio/CV/Hợp đồng thường cần: gắn tên miền riêng, chỉnh sửa theo yêu cầu, thiết kế hồ sơ. Bạn báo giá trực tiếp;
chi phí tên miền (nếu có) do khách trả.

## 6. Theo dõi hiệu quả (miễn phí)

- `npm run gsc` – từ khóa đang lên hạng từ Search Console (cần `secrets/gsc-key.json`).
- Cloudflare → Workers → `tien-ich-so` → *Metrics*: lượt truy cập theo ngày.
- Accesstrade/Shopee dashboard: click, đơn, hoa hồng theo từng link (đặt `utm_content` khác nhau cho từng offer nếu muốn so sánh).

## Những gì KHÔNG nên làm

- Không mua tên miền/hosting/plugin: dự án cam kết 0 chi phí.
- Không dùng popunder / redirect ads: mất thứ hạng Google là mất toàn bộ nguồn traffic.
- Không tự bấm quảng cáo hay nhờ người bấm: khóa tài khoản vĩnh viễn.
