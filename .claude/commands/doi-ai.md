---
description: Chạy cả đội AI agent - nghiên cứu → phân tích → làm → đánh giá → kiểm thử
argument-hint: [chủ đề hoặc để trống để tự tìm cơ hội]
---

Điều phối đội agent của dự án cho chủ đề: $ARGUMENTS

1. **market-researcher**: tìm nhu cầu có số liệu (nếu chủ đề trống, tự tìm 3 cơ hội tốt nhất chưa có trong `src/data/tools.js`).
2. **value-analyst**: chấm điểm, kết luận LÀM / HOÃN / BỎ.
3. **feasibility-tester**: kiểm khả thi dữ liệu/kỹ thuật cho các mục LÀM.
4. Trình người dùng bảng tóm tắt và **dừng lại chờ đồng ý** trước khi viết code.
5. Sau khi được đồng ý: **builder** làm → **ux-optimizer** rà UI → **reviewer** đánh giá → builder sửa lỗi → **feasibility-tester** đo thực tế.
6. Báo cáo bằng tiếng Việt, ngắn gọn, kết quả thật. Chỉ commit/push khi người dùng bảo.

Mọi bước tuân thủ: không chi phí định kỳ; xác minh số liệu pháp lý; trước khi bảo người dùng đăng ký dịch vụ nào phải nói rõ có miễn phí lâu dài, có cần thẻ, có thể bị trừ tiền không.
