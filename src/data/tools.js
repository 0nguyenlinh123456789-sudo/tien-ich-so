// Central registry for sections & tools (drives routing, nav, sitemap).

export const SECTIONS = {
  life: {
    id: 'life',
    slug: { vi: 'doi-song', en: 'life' },
    name: { vi: 'Đời sống', en: 'Everyday' },
    desc: { vi: 'Lịch âm, tiền điện, địa chỉ mới.', en: 'Lunar calendar, BMI, percent, countdown.' },
    icon: '🌿',
    context: 'tools'
  },
  finance: {
    id: 'finance',
    slug: { vi: 'tai-chinh', en: 'finance' },
    name: { vi: 'Tài chính & Tiền bạc', en: 'Finance & Money' },
    desc: {
      vi: 'Lương, vay, tiết kiệm, nghỉ hưu.',
      en: 'Salary, loans, savings, retirement.'
    },
    icon: '💰',
    context: 'finance'
  },
  destiny: {
    id: 'destiny',
    slug: { vi: 'van-menh', en: 'destiny' },
    name: { vi: 'Thần số học, Tarot & Vận mệnh', en: 'Numerology, Tarot & Destiny' },
    desc: {
      vi: 'Thần số học, Tarot, ngày tốt.',
      en: 'Numerology, tarot, lucky days.'
    },
    icon: '🔮',
    context: 'destiny'
  },
  tools: {
    id: 'tools',
    slug: { vi: 'cong-cu', en: 'tools' },
    name: { vi: 'Hồ sơ & Văn phòng', en: 'Career & Office' },
    desc: {
      vi: 'CV, portfolio, hợp đồng, nén ảnh.',
      en: 'CV, portfolio, contracts, images.'
    },
    icon: '🧰',
    context: 'tools'
  }
};

export const TOOLS = [
  {
    id: 'lunar', section: 'life', icon: '🌙',
    slug: { vi: 'lich-am-hom-nay', en: 'vietnamese-lunar-calendar' },
    title: { vi: 'Lịch âm hôm nay', en: 'Lunar Calendar Today' },
    seo: { vi: 'Lịch âm hôm nay – Âm lịch, lịch vạn niên 2026, 2027', en: 'Vietnamese Lunar Calendar Today – Solar/Lunar Converter' },
    desc: { vi: 'Âm dương, can chi, giờ tốt.', en: 'Lunar date, Can Chi, lucky hours.' },
    faq: [
      { q: { vi: 'Lịch âm Việt Nam khác lịch Trung Quốc không?', en: 'Is the Vietnamese lunar calendar the same as the Chinese one?' }, a: { vi: 'Gần giống nhưng tính theo múi giờ GMT+7 (Trung Quốc dùng GMT+8), nên đôi khi ngày đầu tháng, thậm chí Tết, lệch nhau một ngày.', en: 'Almost, but Vietnam computes it for GMT+7 (China uses GMT+8), so a month start, even Tết, can differ by one day.' } },
      { q: { vi: 'Năm nhuận âm lịch là gì?', en: 'What is a lunar leap year?' }, a: { vi: 'Năm có 13 tháng: thêm một tháng nhuận để lịch âm không lệch mùa. Khoảng 19 năm có 7 năm nhuận.', en: 'A 13-month year with an extra leap month to keep the calendar aligned with seasons, about 7 in every 19 years.' } },
      { q: { vi: 'Giờ hoàng đạo là gì?', en: 'What are lucky hours?' }, a: { vi: 'Theo quan niệm dân gian, mỗi ngày có 6 trong 12 canh giờ được xem là tốt để bắt đầu việc quan trọng. Đây là tham khảo văn hóa, không phải căn cứ khoa học.', en: 'By folk tradition, 6 of the 12 two-hour periods each day are considered auspicious. Cultural reference only.' } }
    ]
  },
  {
    id: 'bmi', section: 'life', icon: '⚖️',
    slug: { vi: 'tinh-bmi', en: 'bmi-tdee-calculator' },
    title: { vi: 'BMI & calo mỗi ngày', en: 'BMI & Daily Calories' },
    seo: { vi: 'Tính BMI chuẩn người châu Á & TDEE – cần ăn bao nhiêu calo', en: 'BMI & TDEE Calculator – How Many Calories Do I Need' },
    desc: { vi: 'Cân nặng chuẩn, calo cần ăn.', en: 'Healthy weight, calorie needs.' },
    faq: [
      { q: { vi: 'Vì sao người châu Á dùng ngưỡng BMI khác?', en: 'Why do Asians use different BMI cut-offs?' }, a: { vi: 'Ở cùng chỉ số BMI, người châu Á thường có tỷ lệ mỡ cao hơn. Năm 2000, Văn phòng WHO khu vực Tây Thái Bình Dương (WPRO) đề xuất: thừa cân từ 23, béo phì từ 25 (thay vì 25 và 30).', en: 'At the same BMI, Asians tend to carry more body fat. In 2000 the WHO Western Pacific office proposed overweight from 23 and obesity from 25 (instead of 25 and 30).' } },
      { q: { vi: 'TDEE là gì?', en: 'What is TDEE?' }, a: { vi: 'Tổng năng lượng cơ thể đốt mỗi ngày = BMR (năng lượng nghỉ, công thức Mifflin–St Jeor) × hệ số vận động. Ăn thấp hơn TDEE khoảng 500 kcal là mức giảm cân phổ biến.', en: 'Total daily energy expenditure = BMR (Mifflin–St Jeor) × activity factor. Eating about 500 kcal below TDEE is a common deficit.' } },
      { q: { vi: 'BMI có chính xác cho người tập gym?', en: 'Is BMI accurate for athletes?' }, a: { vi: 'Không hoàn toàn. BMI không phân biệt cơ và mỡ, nên người nhiều cơ có thể bị xếp thừa cân. Hãy đo thêm vòng eo.', en: 'Not fully: BMI cannot tell muscle from fat. Measure your waist too.' } }
    ]
  },
  {
    id: 'percent', section: 'life', icon: '➗',
    slug: { vi: 'tinh-phan-tram', en: 'percentage-calculator' },
    title: { vi: 'Tính phần trăm', en: 'Percentage Calculator' },
    seo: { vi: 'Tính phần trăm online – % của số, tăng giảm, giảm giá', en: 'Percentage Calculator – percent of, change, discount' },
    desc: { vi: 'Tăng giảm, giảm giá, tỷ lệ.', en: 'Change, discount, ratio.' },
    faq: [
      { q: { vi: 'Cách tính phần trăm tăng giảm?', en: 'How to calculate percentage change?' }, a: { vi: '(Giá trị mới − giá trị cũ) ÷ giá trị cũ × 100. Ví dụ 80 lên 100 là tăng 25%.', en: '(new − old) ÷ old × 100. From 80 to 100 is +25%.' } },
      { q: { vi: 'Giảm 20% rồi tăng 20% có về giá cũ không?', en: 'Does −20% then +20% return to the original?' }, a: { vi: 'Không. 100 giảm 20% còn 80, tăng 20% chỉ được 96.', en: 'No. 100 → 80 → 96.' } }
    ]
  },
  {
    id: 'countdown', section: 'life', icon: '⏳',
    slug: { vi: 'dem-nguoc-tet', en: 'countdown' },
    title: { vi: 'Đếm ngược Tết', en: 'Holiday Countdown' },
    seo: { vi: 'Đếm ngược Tết – còn bao nhiêu ngày nữa đến Tết', en: 'How Many Days Until Christmas? Holiday Countdown' },
    desc: { vi: 'Tết, lễ, ngày của bạn.', en: 'Tết, holidays, your date.' },
    faq: [
      { q: { vi: 'Tết Nguyên đán được tính thế nào?', en: 'How is Tết dated?' }, a: { vi: 'Là ngày mùng 1 tháng Giêng âm lịch, tính theo múi giờ Việt Nam. Trang này tự tính từ lịch âm, không nhập tay.', en: 'It is day 1 of the first lunar month for Vietnam time; computed here from the lunar calendar.' } },
      { q: { vi: 'Có tạo đếm ngược riêng được không?', en: 'Can I make my own countdown?' }, a: { vi: 'Có. Nhập tên và ngày, rồi gửi link cho bạn bè, link giữ nguyên sự kiện.', en: 'Yes. Enter a name and date, then share the link.' } }
    ]
  },
  {
    id: 'electric', section: 'life', icon: '⚡',
    slug: { vi: 'tinh-tien-dien', en: 'electricity-bill-calculator' },
    title: { vi: 'Tính tiền điện', en: 'Electricity Bill' },
    seo: { vi: 'Tính tiền điện online – giá điện sinh hoạt bậc thang mới nhất', en: 'Vietnam Electricity Bill Calculator – residential tiers' },
    desc: { vi: '6 bậc giá EVN, tính ngược từ hóa đơn.', en: 'EVN 6 tiers, reverse from bill.' },
    faq: [
      { q: { vi: 'Giá điện sinh hoạt hiện nay bao nhiêu?', en: 'What is the current residential price?' }, a: { vi: 'Từ 10/5/2025 theo Quyết định 1279/QĐ-BCT: 1.984 đ/kWh (0–50 kWh) đến 3.460 đ/kWh (từ 401 kWh), chưa gồm thuế GTGT.', en: 'Since 10 May 2025 (Decision 1279/QĐ-BCT): 1,984 to 3,460 VND/kWh before VAT.' } },
      { q: { vi: 'Đã áp dụng giá điện 5 bậc chưa?', en: 'Is the 5-tier tariff in effect?' }, a: { vi: 'Quyết định 14/2025/QĐ-TTg quy định cơ cấu 5 bậc nhưng chưa đưa vào hóa đơn; hiện vẫn tính 6 bậc. Trang sẽ cập nhật khi có quyết định giá mới.', en: 'Decision 14/2025/QĐ-TTg defines 5 tiers but bills still use 6 tiers for now.' } },
      { q: { vi: 'Vì sao tiền điện mùa hè tăng vọt?', en: 'Why do summer bills jump?' }, a: { vi: 'Giá tăng theo bậc: mỗi kWh vượt 400 kWh đắt gần gấp 1,75 lần bậc 1. Dùng thêm 100 kWh ở bậc cao tốn hơn nhiều so với ở bậc thấp.', en: 'Higher tiers cost up to ~1.75× tier 1, so extra usage is expensive.' } }
    ]
  },
  {
    id: 'pregnancy', section: 'life', icon: '🤰',
    slug: { vi: 'tinh-ngay-du-sinh', en: 'due-date-ovulation-calculator' },
    title: { vi: 'Ngày dự sinh & rụng trứng', en: 'Due Date & Ovulation' },
    seo: { vi: 'Tính ngày dự sinh, tuần thai & ngày rụng trứng online', en: 'Due Date, Pregnancy Week & Ovulation Calculator' },
    desc: { vi: 'Tuần thai, ngày dễ thụ thai.', en: 'Pregnancy week, fertile days.' },
    faq: [
      { q: { vi: 'Tính ngày dự sinh thế nào?', en: 'How is the due date calculated?' }, a: { vi: 'Quy tắc Naegele: ngày đầu kỳ kinh cuối + 280 ngày (40 tuần), cộng/trừ phần chu kỳ dài/ngắn hơn 28 ngày.', en: 'Naegele’s rule: last period + 280 days, adjusted for cycles longer or shorter than 28 days.' } },
      { q: { vi: 'Ngày dự sinh có chính xác không?', en: 'Is the due date exact?' }, a: { vi: 'Chỉ là ước tính; phần lớn em bé chào đời trong khoảng vài tuần quanh ngày này. Siêu âm 3 tháng đầu cho kết quả tin cậy hơn.', en: 'It is an estimate; first-trimester ultrasound is more reliable.' } },
      { q: { vi: 'Ngày nào dễ thụ thai nhất?', en: 'Which days are most fertile?' }, a: { vi: 'Khoảng 5 ngày trước và ngày rụng trứng, vì tinh trùng sống được vài ngày còn trứng sống khoảng 1 ngày. Không dùng cách này để tránh thai.', en: 'About 5 days before and the day of ovulation. Not a contraception method.' } }
    ]
  },
  {
    id: 'address', section: 'life', icon: '🗺️',
    slug: { vi: 'dia-chi-sau-sap-nhap', en: 'vietnam-province-merger-2025' },
    title: { vi: 'Địa chỉ sau sáp nhập', en: 'Address After Merger' },
    seo: { vi: 'Tra cứu địa chỉ sau sáp nhập tỉnh 2025 – 34 tỉnh thành mới', en: 'Vietnam 2025 Province Merger – old to new address' },
    desc: { vi: 'Tỉnh cũ đổi thành tỉnh nào.', en: 'Old province to new.' },
    faq: [
      { q: { vi: 'Cả nước còn bao nhiêu tỉnh, thành?', en: 'How many provinces now?' }, a: { vi: '34 (28 tỉnh, 6 thành phố) theo Nghị quyết 202/2025/QH15; chính quyền mới hoạt động từ 1/7/2025.', en: '34 (28 provinces, 6 cities) under Resolution 202/2025/QH15, from 1 July 2025.' } },
      { q: { vi: 'Địa chỉ mới viết thế nào?', en: 'How to write the new address?' }, a: { vi: 'Bỏ cấp huyện: Số nhà, đường, xã/phường, tỉnh/thành phố. Ví dụ: 12 Lê Lợi, phường X, TP. Hồ Chí Minh.', en: 'Drop the district: street, ward/commune, province.' } },
      { q: { vi: 'Có phải đổi CCCD, giấy tờ không?', en: 'Must I update my ID?' }, a: { vi: 'Không bắt buộc. Giấy tờ đã cấp vẫn còn giá trị sử dụng; khi cấp đổi theo nhu cầu sẽ ghi địa chỉ mới.', en: 'No; existing documents remain valid.' } }
    ]
  },
  {
    id: 'age', section: 'life', icon: '🎂',
    slug: { vi: 'tinh-tuoi', en: 'age-calculator' },
    title: { vi: 'Tính tuổi', en: 'Age Calculator' },
    seo: { vi: 'Tính tuổi theo ngày sinh – bao nhiêu tuổi, bao nhiêu ngày', en: 'Age Calculator by Date of Birth – years, months, days' },
    desc: { vi: 'Tuổi chính xác, sinh nhật tới.', en: 'Exact age, next birthday.' },
    faq: [
      { q: { vi: 'Tính tuổi chính xác thế nào?', en: 'How is exact age calculated?' }, a: { vi: 'Lấy năm, tháng, ngày hiện tại trừ ngày sinh; nếu chưa tới ngày sinh trong tháng thì mượn số ngày của tháng trước.', en: 'Subtract the birth date from the target date, borrowing days from the previous month when needed.' } },
      { q: { vi: 'Tuổi mụ khác tuổi thật thế nào?', en: 'What is East Asian age?' }, a: { vi: 'Tuổi mụ tính thêm 1 tuổi lúc sinh và cộng tuổi vào mỗi Tết âm lịch, nên thường hơn tuổi thật 1–2 tuổi.', en: 'Traditional age counts 1 at birth and adds a year at each Lunar New Year.' } }
    ]
  },
  {
    id: 'datediff', section: 'life', icon: '📆',
    slug: { vi: 'tinh-khoang-cach-ngay', en: 'date-calculator' },
    title: { vi: 'Tính số ngày', en: 'Date Calculator' },
    seo: { vi: 'Tính số ngày giữa hai ngày, cộng trừ ngày, ngày làm việc', en: 'Date Calculator – days between dates, add days, business days' },
    desc: { vi: 'Khoảng cách, cộng trừ ngày.', en: 'Days between, add days.' },
    faq: [
      { q: { vi: 'Có tính cả ngày cuối không?', en: 'Is the end date included?' }, a: { vi: 'Mặc định không. Chọn "Tính cả ngày cuối" khi cần đếm cả hai đầu, ví dụ số ngày nghỉ phép.', en: 'Not by default; tick "Include end date" to count both ends.' } },
      { q: { vi: 'Ngày làm việc tính thế nào?', en: 'How are business days counted?' }, a: { vi: 'Từ thứ Hai đến thứ Sáu, chưa trừ ngày lễ.', en: 'Monday to Friday; public holidays are not excluded.' } }
    ]
  },
  {
    id: 'convert', section: 'life', icon: '📏',
    slug: { vi: 'doi-don-vi', en: 'unit-converter' },
    title: { vi: 'Đổi đơn vị', en: 'Unit Converter' },
    seo: { vi: 'Đổi đơn vị online – cm sang inch, kg sang pound, độ F sang độ C', en: 'Unit Converter – cm to inches, kg to lbs, °F to °C' },
    desc: { vi: 'Độ dài, cân nặng, nhiệt độ.', en: 'Length, weight, temperature.' },
    faq: [
      { q: { vi: '1 inch bằng bao nhiêu cm?', en: 'How many cm in an inch?' }, a: { vi: 'Đúng 2,54 cm (định nghĩa quốc tế từ 1959).', en: 'Exactly 2.54 cm (international definition since 1959).' } },
      { q: { vi: '1 kg bằng bao nhiêu pound?', en: 'How many pounds in a kg?' }, a: { vi: 'Khoảng 2,2046 lb; 1 lb = 0,45359237 kg.', en: 'About 2.2046 lb; 1 lb = 0.45359237 kg exactly.' } },
      { q: { vi: 'Đổi độ F sang độ C thế nào?', en: 'How to convert °F to °C?' }, a: { vi: '°C = (°F − 32) × 5/9. Ví dụ 100°F ≈ 37,8°C.', en: '°C = (°F − 32) × 5/9; 100°F ≈ 37.8°C.' } }
    ]
  },
  {
    id: 'tip', section: 'life', icon: '🧾',
    slug: { vi: 'tinh-tien-tip', en: 'tip-calculator' },
    title: { vi: 'Tính tiền tip', en: 'Tip Calculator' },
    seo: { vi: 'Tính tiền tip & chia hóa đơn', en: 'Tip Calculator – tip and split the bill' },
    desc: { vi: 'Tip, chia hóa đơn.', en: 'Tip and split the bill.' },
    faq: [
      { q: { vi: 'Ở Mỹ tip bao nhiêu là chuẩn?', en: 'How much should I tip in the US?' }, a: { vi: 'Nhà hàng thường 15–20%, dịch vụ tốt 20% trở lên. Đây là thông lệ, không phải quy định.', en: 'Restaurants commonly 15–20%, 20%+ for great service. A custom, not a rule.' } },
      { q: { vi: 'Tip tính trên giá trước hay sau thuế?', en: 'Tip before or after tax?' }, a: { vi: 'Phổ biến là tính trên giá trước thuế; nhiều người tính trên tổng cho đơn giản.', en: 'Commonly on the pre-tax amount; many simply tip on the total.' } }
    ]
  },
  {
    id: 'area', section: 'life', icon: '📐',
    slug: { vi: 'tinh-dien-tich', en: 'area-calculator' },
    title: { vi: 'Tính diện tích', en: 'Area Calculator' },
    seo: { vi: 'Tính diện tích hình chữ nhật, tam giác, hình tròn, hình thang – có công thức', en: 'Area Calculator – rectangle, triangle, circle, trapezoid' },
    desc: { vi: 'Diện tích, chu vi, công thức.', en: 'Area, perimeter, formula.' },
    faq: [
      { q: { vi: 'Công thức diện tích hình tam giác?', en: 'Triangle area formula?' }, a: { vi: 'S = đáy × chiều cao ÷ 2. Nếu chỉ biết 3 cạnh, dùng công thức Heron: S = √(p(p−a)(p−b)(p−c)), với p là nửa chu vi.', en: 'A = base × height ÷ 2, or Heron’s formula from three sides.' } },
      { q: { vi: '1 mét vuông bằng bao nhiêu cm²?', en: 'How many cm² in 1 m²?' }, a: { vi: '1 m² = 10.000 cm²; 1 ha = 10.000 m².', en: '1 m² = 10,000 cm²; 1 ha = 10,000 m².' } }
    ]
  },
  {
    id: 'gpa', section: 'life', icon: '🎓',
    slug: { vi: 'tinh-diem-gpa', en: 'gpa-calculator' },
    title: { vi: 'Tính GPA', en: 'GPA Calculator' },
    seo: { vi: 'Tính điểm GPA hệ 4 từ thang 10 – xếp loại tốt nghiệp', en: 'GPA Calculator – 10-point to 4.0 scale' },
    desc: { vi: 'Đổi hệ 10 sang hệ 4, xếp loại.', en: '10-point to 4.0, class.' },
    faq: [
      { q: { vi: 'GPA bao nhiêu thì bằng giỏi?', en: 'What GPA is "very good"?' }, a: { vi: 'Theo Thông tư 08/2021/TT-BGDĐT: Xuất sắc từ 3,6; Giỏi từ 3,2 đến dưới 3,6; Khá từ 2,5; Trung bình từ 2,0 (hệ 4). Có thể bị hạ một bậc nếu học lại nhiều hoặc bị kỷ luật.', en: 'Excellent from 3.6, very good from 3.2, good from 2.5, average from 2.0 (Circular 08/2021).' } },
      { q: { vi: 'Đổi điểm hệ 10 sang hệ 4 thế nào?', en: 'How to convert 10-point to 4.0?' }, a: { vi: 'Mỗi môn đổi sang điểm chữ (A từ 8,5 = 4; B từ 7,0 = 3; C từ 5,5 = 2; D từ 4,0 = 1; nhiều trường thêm B+, C+, D+), rồi lấy trung bình có trọng số tín chỉ.', en: 'Convert each course to a letter, then take the credit-weighted average.' } }
    ]
  },
  {
    id: 'ielts', section: 'life', icon: '🇬🇧',
    slug: { vi: 'tinh-diem-ielts', en: 'ielts-band-calculator' },
    title: { vi: 'Tính điểm IELTS', en: 'IELTS Overall Calculator' },
    seo: { vi: 'Cách tính overall IELTS – làm tròn điểm đúng quy tắc', en: 'IELTS Overall Band Score Calculator' },
    desc: { vi: 'Overall từ 4 kỹ năng.', en: 'Overall from 4 skills.' },
    faq: [
      { q: { vi: 'Overall IELTS làm tròn thế nào?', en: 'How is the IELTS overall rounded?' }, a: { vi: 'Lấy trung bình 4 kỹ năng. Phần lẻ .25 làm tròn lên .5, .75 làm tròn lên số nguyên kế tiếp. Ví dụ trung bình 6,25 → 6,5; 6,75 → 7,0; 6,125 → 6,0.', en: 'Average of four bands; .25 rounds up to .5 and .75 up to the next whole band.' } }
    ]
  },
  {
    id: 'holidays', section: 'life', icon: '🏖️',
    slug: { vi: 'lich-nghi-le-2027', en: 'vietnam-public-holidays-2027' },
    title: { vi: 'Lịch nghỉ lễ 2027', en: 'Vietnam Holidays 2027' },
    seo: { vi: 'Lịch nghỉ lễ, nghỉ Tết 2027 chính thức – còn bao nhiêu ngày', en: 'Vietnam Public Holidays 2027' },
    desc: { vi: 'Tết, 30/4, 2/9 – còn mấy ngày.', en: 'Tết, 30/4, 2/9 dates.' },
    faq: [
      { q: { vi: 'Tết Nguyên đán 2027 nghỉ mấy ngày?', en: 'How long is Tết 2027?' }, a: { vi: 'Cán bộ, công chức, viên chức nghỉ 7 ngày liên tục từ thứ Năm 04/02 đến thứ Tư 10/02/2027 (Thông báo 11483/TB-BNV). Doanh nghiệp tự chọn lịch, tối thiểu 5 ngày.', en: 'Public sector: 7 days, 4–10 Feb 2027.' } },
      { q: { vi: 'Một năm có bao nhiêu ngày nghỉ lễ?', en: 'How many public holidays?' }, a: { vi: 'Theo Điều 112 Bộ luật Lao động 2019: Tết Dương lịch 1 ngày, Tết Âm lịch 5 ngày, Giỗ Tổ 1 ngày, 30/4 1 ngày, 1/5 1 ngày, Quốc khánh 2 ngày – tổng 11 ngày hưởng nguyên lương.', en: '11 paid days under the Labour Code 2019, Art. 112.' } }
    ]
  },
  {
    id: 'salary', section: 'finance', icon: '💵',
    slug: { vi: 'tinh-luong-gross-net', en: 'gross-net-salary-calculator' },
    title: { vi: 'Lương Gross – Net 2026', en: 'Gross – Net Salary 2026' },
    seo: { vi: 'Tính lương Gross sang Net 2026 – thuế TNCN, BHXH mới nhất', en: 'Vietnam Gross to Net Salary Calculator 2026' },
    desc: { vi: 'Bảo hiểm, thuế TNCN, giảm trừ.', en: 'Insurance, income tax, deductions.' }
  },
  {
    id: 'loan', section: 'finance', icon: '🏠',
    slug: { vi: 'tinh-lai-vay', en: 'loan-calculator' },
    title: { vi: 'Lãi vay & trả góp', en: 'Loan Calculator' },
    seo: { vi: 'Tính lãi vay ngân hàng mua nhà, mua xe – lịch trả nợ hàng tháng', en: 'Loan & Mortgage Calculator – monthly schedule' },
    desc: { vi: 'Lịch trả nợ từng tháng.', en: 'Monthly schedule.' }
  },
  {
    id: 'savings', section: 'finance', icon: '🏦',
    slug: { vi: 'tinh-lai-tiet-kiem', en: 'savings-interest-calculator' },
    title: { vi: 'Lãi tiết kiệm', en: 'Savings Interest' },
    seo: { vi: 'Tính lãi suất tiết kiệm ngân hàng – gửi bao nhiêu nhận bao nhiêu', en: 'Bank Savings Interest Calculator' },
    desc: { vi: 'Gửi bao nhiêu, nhận bao nhiêu.', en: 'What your deposit earns.' },
    faq: [
      { q: { vi: 'Cách tính lãi tiết kiệm ngân hàng?', en: 'How is savings interest calculated?' }, a: { vi: 'Lãi = tiền gửi × lãi suất năm × số tháng kỳ hạn ÷ 12. Ví dụ 100 triệu, 5,5%/năm, kỳ hạn 12 tháng: lãi 5,5 triệu.', en: 'Interest = deposit × annual rate × months ÷ 12.' } },
      { q: { vi: 'Tái tục gốc và lãi có lợi hơn không?', en: 'Does rolling over help?' }, a: { vi: 'Có: lãi kỳ trước được cộng vào gốc kỳ sau (lãi kép). Gửi càng lâu chênh lệch càng lớn.', en: 'Yes, interest compounds each term.' } },
      { q: { vi: 'Rút trước hạn có mất lãi không?', en: 'Early withdrawal?' }, a: { vi: 'Thường chỉ được hưởng lãi không kỳ hạn rất thấp cho phần rút trước hạn, tùy quy định từng ngân hàng.', en: 'Usually only the low demand rate applies; depends on the bank.' } }
    ]
  },
  {
    id: 'maternity', section: 'finance', icon: '👶',
    slug: { vi: 'tinh-tien-thai-san', en: 'maternity-benefit-calculator' },
    title: { vi: 'Tiền thai sản', en: 'Maternity Pay' },
    seo: { vi: 'Tính tiền thai sản 2026 online – mẹ sinh con, bố nghỉ chăm vợ', en: 'Vietnam Maternity Benefit Calculator 2026' },
    desc: { vi: 'Mẹ 6 tháng, bố 5–10 ngày.', en: 'Mother 6 months, father 5–10 days.' },
    faq: [
      { q: { vi: 'Sinh con được nhận bao nhiêu tiền?', en: 'How much is maternity pay?' }, a: { vi: 'Mẹ nghỉ 6 tháng, mỗi tháng nhận 100% lương đóng BHXH bình quân 6 tháng trước khi nghỉ, cộng trợ cấp một lần 2 lần mức tham chiếu cho mỗi con (5.060.000 đ từ 1/7/2026).', en: '6 months at 100% of the 6-month insured average, plus 2× the reference level per child.' } },
      { q: { vi: 'Bố được nghỉ mấy ngày khi vợ sinh?', en: 'How many days for fathers?' }, a: { vi: '5 ngày làm việc nếu sinh thường; 7 ngày nếu sinh mổ hoặc dưới 32 tuần; 10 ngày nếu sinh đôi, từ sinh ba thêm 3 ngày mỗi con. Nghỉ trong 60 ngày kể từ ngày vợ sinh.', en: '5 working days; 7 for C-section or <32 weeks; 10 for twins; within 60 days of birth.' } },
      { q: { vi: 'Điều kiện hưởng thai sản là gì?', en: 'Eligibility?' }, a: { vi: 'Đóng BHXH bắt buộc từ đủ 6 tháng trở lên trong 12 tháng trước khi sinh con.', en: 'At least 6 months of contributions in the 12 months before birth.' } }
    ]
  },
  {
    id: 'lumpsum', section: 'finance', icon: '💼',
    slug: { vi: 'tinh-bhxh-1-lan', en: 'social-insurance-lump-sum' },
    title: { vi: 'BHXH một lần', en: 'Social Insurance Lump Sum' },
    seo: { vi: 'Tính tiền BHXH 1 lần online theo Luật BHXH 2024', en: 'Vietnam Social Insurance Lump-Sum Calculator' },
    desc: { vi: 'Rút một lần được bao nhiêu.', en: 'What a lump-sum withdrawal pays.' },
    faq: [
      { q: { vi: 'Cách tính BHXH một lần?', en: 'How is it calculated?' }, a: { vi: 'Mỗi năm đóng trước 2014 được 1,5 tháng, từ 2014 được 2 tháng lương đóng BHXH bình quân (khoản 3 Điều 70 Luật BHXH 2024).', en: '1.5 months of average salary per year before 2014, 2 months per year from 2014.' } },
      { q: { vi: 'Khi nào được rút BHXH một lần?', en: 'When can I withdraw?' }, a: { vi: 'Ví dụ: đủ tuổi nghỉ hưu mà chưa đủ 15 năm đóng; ra nước ngoài định cư; bệnh hiểm nghèo; hoặc đã đóng trước 1/7/2025, nghỉ 12 tháng không đóng và chưa đủ 20 năm.', en: 'E.g. retirement age with under 15 years, emigration, serious illness, or contributions before 1/7/2025 with a 12-month gap and under 20 years.' } },
      { q: { vi: 'Có nên rút BHXH một lần?', en: 'Should I withdraw?' }, a: { vi: 'Cân nhắc kỹ: rút rồi sẽ mất toàn bộ thời gian đóng để tính lương hưu và thẻ BHYT do quỹ cấp khi về hưu.', en: 'Think twice: you lose those years toward a pension.' } }
    ]
  },
  {
    id: 'pension', section: 'finance', icon: '👴',
    slug: { vi: 'tinh-luong-huu', en: 'pension-calculator' },
    title: { vi: 'Lương hưu', en: 'Pension' },
    seo: { vi: 'Tính lương hưu online theo Luật BHXH 2024 – nam, nữ', en: 'Vietnam Pension Calculator (Social Insurance Law 2024)' },
    desc: { vi: 'Tỷ lệ hưởng, tiền mỗi tháng.', en: 'Rate and monthly amount.' },
    faq: [
      { q: { vi: 'Đóng bao nhiêu năm được lương hưu?', en: 'How many years for a pension?' }, a: { vi: 'Tối thiểu 15 năm (Luật BHXH 2024, hiệu lực 1/7/2025), thay cho 20 năm trước đây.', en: 'At least 15 years since 1 July 2025.' } },
      { q: { vi: 'Tỷ lệ lương hưu tính thế nào?', en: 'How is the rate set?' }, a: { vi: 'Nữ: 45% khi đủ 15 năm, thêm 2%/năm. Nam: 40% khi đủ 15 năm, thêm 1%/năm đến 45% ở 20 năm, sau đó thêm 2%/năm. Tối đa 75%.', en: 'Women 45% at 15 years +2%/year; men 40% at 15, 45% at 20, then +2%/year; max 75%.' } },
      { q: { vi: 'Đóng bao lâu thì đạt 75%?', en: 'When do I reach 75%?' }, a: { vi: 'Nữ 30 năm, nam 35 năm. Mỗi năm đóng vượt được trợ cấp 1 lần bằng 0,5 tháng lương bình quân khi nghỉ hưu.', en: 'Women 30 years, men 35. Each extra year adds a lump sum of 0.5 month.' } }
    ]
  },
  {
    id: 'mortgage', section: 'finance', icon: '🏡',
    slug: { vi: 'tinh-tra-gop-mua-nha-my', en: 'mortgage-calculator' },
    title: { vi: 'Trả góp mua nhà (USD)', en: 'Mortgage Calculator' },
    seo: { vi: 'Tính trả góp mua nhà ở Mỹ – thuế, bảo hiểm, PMI', en: 'Mortgage Calculator with Taxes, Insurance, PMI & Extra Payments' },
    desc: { vi: 'Gồm thuế, bảo hiểm, trả thêm gốc.', en: 'Taxes, insurance, extra payments.' },
    faq: [
      { q: { vi: 'PITI là gì?', en: 'What is PITI?' }, a: { vi: 'Principal, Interest, Taxes, Insurance: gốc, lãi, thuế nhà đất và bảo hiểm nhà – tổng chi phí hằng tháng thực tế.', en: 'Principal, interest, taxes and insurance: your true monthly housing cost.' } },
      { q: { vi: 'Trả thêm gốc tiết kiệm bao nhiêu?', en: 'How much do extra payments save?' }, a: { vi: 'Mỗi đồng trả thêm giảm dư nợ, nên giảm lãi các tháng sau; công cụ cho thấy số lãi tiết kiệm và thời gian trả xong.', en: 'Each extra dollar cuts the balance and future interest; the tool shows the savings and payoff date.' } },
      { q: { vi: 'Khi nào phải đóng PMI?', en: 'When is PMI required?' }, a: { vi: 'Thường khi khoản vay thông thường có trả trước dưới 20% giá nhà; mức phí thực tế tùy người cho vay.', en: 'Usually on conventional loans with under 20% down; actual rates vary by lender.' } }
    ]
  },
  {
    id: 'fx', section: 'finance', icon: '💱',
    slug: { vi: 'ty-gia-doi-tien', en: 'usd-vnd-exchange-rate' },
    title: { vi: 'Tỷ giá & đổi tiền', en: 'USD to VND Rate' },
    seo: { vi: 'Tỷ giá USD hôm nay – đổi đô sang tiền Việt (Vietcombank)', en: 'USD to VND Exchange Rate Today – converter' },
    desc: { vi: 'USD, EUR, JPY sang VND.', en: 'USD, EUR, JPY to VND.' },
    faq: [
      { q: { vi: 'Tỷ giá ở đây lấy từ đâu?', en: 'Where do the rates come from?' }, a: { vi: 'Bảng tỷ giá tham khảo công khai của Vietcombank, tự cập nhật mỗi sáng. Giá giao dịch thực tế tại ngân hàng có thể khác.', en: 'Vietcombank public reference rates, refreshed every morning.' } },
      { q: { vi: 'Giá mua và giá bán khác nhau thế nào?', en: 'Buy vs sell?' }, a: { vi: 'Giá mua là giá ngân hàng mua ngoại tệ của bạn (bạn bán đô lấy tiền Việt); giá bán là giá ngân hàng bán ngoại tệ cho bạn.', en: 'Buy: the bank buys your foreign currency. Sell: the bank sells it to you.' } }
    ]
  },
  {
    id: 'vat', section: 'finance', icon: '🧾',
    slug: { vi: 'tinh-thue-vat', en: 'vat-calculator' },
    title: { vi: 'Tính thuế VAT', en: 'VAT Calculator' },
    seo: { vi: 'Tính thuế VAT 8%, 10% – tính ngược giá chưa thuế', en: 'VAT Calculator – add or remove 8% / 10% VAT' },
    desc: { vi: 'Cộng thuế, tính ngược.', en: 'Add or remove VAT.' },
    faq: [
      { q: { vi: 'Thuế VAT năm 2026 là 8% hay 10%?', en: 'Is VAT 8% or 10% in 2026?' }, a: { vi: 'Phần lớn hàng hóa, dịch vụ chịu 10% được giảm còn 8% đến hết 31/12/2026 (Nghị quyết 204/2025/QH15). Viễn thông, tài chính – ngân hàng, chứng khoán và hàng trong phụ lục Nghị định 174/2025/NĐ-CP vẫn 10%.', en: 'Most 10% items are cut to 8% until 31 Dec 2026; some sectors stay at 10%.' } },
      { q: { vi: 'Cách tính ngược giá chưa thuế?', en: 'How to remove VAT?' }, a: { vi: 'Giá chưa thuế = giá có thuế ÷ (1 + thuế suất). Ví dụ 1.080.000 đ với thuế 8%: 1.080.000 ÷ 1,08 = 1.000.000 đ.', en: 'Net = gross ÷ (1 + rate).' } }
    ]
  },
  {
    id: 'severance', section: 'finance', icon: '📤',
    slug: { vi: 'tinh-tro-cap-thoi-viec', en: 'severance-pay-calculator-vietnam' },
    title: { vi: 'Trợ cấp thôi việc, thất nghiệp', en: 'Severance & Unemployment Benefit' },
    seo: { vi: 'Tính trợ cấp thôi việc, thất nghiệp 2026', en: 'Vietnam Severance & Unemployment Benefit Calculator 2026' },
    desc: { vi: 'Thôi việc, mất việc, BHTN.', en: 'Severance, job loss, UI.' },
    faq: [
      { q: { vi: 'Làm 5 năm 3 tháng, lương 10 triệu, chưa từng đóng BHTN được trợ cấp thôi việc bao nhiêu?', en: '5 years 3 months, salary 10M, never paid UI: how much severance?' }, a: { vi: '3 tháng lẻ được tính nửa năm nên thời gian tính là 5,5 năm (khoản 3 Điều 8 NĐ 145/2020/NĐ-CP). Mỗi năm được nửa tháng lương (Điều 46 Bộ luật Lao động 2019): 5,5 × 5.000.000 = 27.500.000 đ.', en: 'The 3 odd months count as half a year, so 5.5 years × 5,000,000 = 27,500,000 VND (Labor Code 2019 Art. 46; Decree 145/2020 Art. 8).' } },
      { q: { vi: 'Lương 10 triệu, đóng BHTN 48 tháng thì trợ cấp thất nghiệp bao nhiêu?', en: 'Salary 10M, 48 months of UI: how much unemployment benefit?' }, a: { vi: 'Mức hằng tháng = 60% × 10.000.000 = 6.000.000 đ (không vượt 5 lần lương tối thiểu vùng). 36 tháng đầu được 3 tháng, 12 tháng tiếp theo thêm 1 tháng: tổng 4 tháng, tức 24.000.000 đ (Điều 39 Luật Việc làm 74/2025/QH15).', en: '60% × 10M = 6M/month for 4 months (3 for the first 36 months + 1 for the next 12) = 24M VND (Employment Law 74/2025/QH15 Art. 39).' } },
      { q: { vi: 'Đã đóng BHTN cả quá trình có được trợ cấp thôi việc không?', en: 'If I paid UI the whole time, do I get severance?' }, a: { vi: 'Không. Thời gian đã đóng BHTN bị trừ khỏi thời gian tính trợ cấp thôi việc (Điều 46 Bộ luật Lao động 2019); thay vào đó bạn xét hưởng trợ cấp thất nghiệp nếu đủ 12 tháng đóng trong 24 tháng trước khi nghỉ.', en: 'No. UI-insured time is excluded (Labor Code Art. 46); you claim unemployment benefit instead if eligible.' } }
    ]
  },
  {
    id: 'hkd', section: 'finance', icon: '🏪',
    slug: { vi: 'tinh-thue-ho-kinh-doanh', en: 'vietnam-household-business-tax' },
    title: { vi: 'Thuế hộ kinh doanh', en: 'Household Business Tax' },
    seo: { vi: 'Tính thuế hộ kinh doanh 2026 – bỏ thuế khoán, ngưỡng 1 tỷ', en: 'Vietnam Household Business Tax Calculator 2026' },
    desc: { vi: 'GTGT, TNCN theo doanh thu.', en: 'VAT & PIT by revenue.' },
    faq: [
      { q: { vi: 'Doanh thu dưới 1 tỷ có phải nộp thuế không?', en: 'Revenue under 1 billion: do I pay tax?' }, a: { vi: 'Không. Từ 01/01/2026, hộ kinh doanh có doanh thu năm từ 1 tỷ đồng trở xuống không phải nộp thuế GTGT và thuế TNCN (Điều 7 Luật Thuế TNCN 109/2025/QH15, ngưỡng nâng lên 1 tỷ theo NĐ 141/2026/NĐ-CP).', en: 'No. From 01/01/2026, households with annual revenue up to 1 billion VND pay no VAT and no PIT (PIT Law 109/2025/QH15 Art. 7; threshold raised to 1 bn by Decree 141/2026/ND-CP).' } },
      { q: { vi: 'Bán hàng hóa doanh thu 2 tỷ/năm thì nộp thuế bao nhiêu?', en: 'Selling goods with 2 billion revenue: how much tax?' }, a: { vi: 'GTGT = 2 tỷ × 1% = 20.000.000 đ. TNCN theo tỷ lệ = (2 tỷ − 1 tỷ) × 0,5% = 5.000.000 đ. Tổng khoảng 25.000.000 đ/năm. Doanh thu 1–3 tỷ có thể chọn tính TNCN theo thu nhập (doanh thu − chi phí) × 15% nếu có lợi hơn.', en: 'VAT = 2 bn × 1% = 20,000,000 VND. PIT = (2 bn − 1 bn) × 0.5% = 5,000,000 VND. Total about 25M/year. With revenue 1–3 bn you may instead choose (revenue − expenses) × 15% for PIT.' } },
      { q: { vi: 'Hộ kinh doanh còn phải nộp lệ phí môn bài không?', en: 'Do households still pay the business licence fee?' }, a: { vi: 'Không. Điều 10 Nghị quyết 198/2025/QH15 bỏ thuế khoán và bỏ lệ phí môn bài đối với hộ, cá nhân kinh doanh từ 01/01/2026.', en: 'No. Resolution 198/2025/QH15 Art. 10 abolished presumptive tax and the licence fee from 01/01/2026.' } }
    ]
  },
  {
    id: 'truocba', section: 'finance', icon: '🛵',
    slug: { vi: 'tinh-le-phi-truoc-ba', en: 'vietnam-vehicle-registration-fee' },
    title: { vi: 'Phí trước bạ xe', en: 'Vehicle Registration Fee' },
    seo: { vi: 'Tính lệ phí trước bạ xe máy, ô tô 2026 – phí biển số', en: 'Vietnam Vehicle Registration Fee 2026' },
    desc: { vi: 'Trước bạ + biển số xe.', en: 'Registration tax + plates.' },
    faq: [
      { q: { vi: 'Xe máy năm 2026 nộp lệ phí trước bạ bao nhiêu %?', en: 'What is the 2026 registration tax rate for motorbikes?' }, a: { vi: 'Đăng ký lần đầu 2%, lần 2 trở đi 1%, áp dụng toàn quốc (NĐ 175/2025/NĐ-CP sửa Điều 8 NĐ 10/2022/NĐ-CP). Ví dụ xe giá tính lệ phí 40 triệu đăng ký ở tỉnh (khu vực II): trước bạ 800.000 đ + phí biển số 400.000 đ (TT 71/2025/TT-BTC) = 1.200.000 đ.', en: '2% for first registration, 1% thereafter, nationwide (Decree 175/2025/ND-CP amending Decree 10/2022). Example: a 40M VND bike registered outside Hanoi/HCMC: 800,000 tax + 400,000 plate fee = 1,200,000 VND.' } },
      { q: { vi: 'Ô tô dưới 9 chỗ nộp trước bạ bao nhiêu %?', en: 'What is the rate for cars up to 9 seats?' }, a: { vi: 'Lần đầu 10%, HĐND tỉnh được tăng tối đa 50% (tức tối đa 15%); Hải Phòng áp dụng 12% (NQ 14/2026/NQ-HĐND); tỉnh khác: xem nghị quyết HĐND tỉnh. Lần 2 trở đi 2%.', en: '10% for first registration; provinces may raise it by up to 50% (max 15%). Hai Phong applies 12% (Res. 14/2026/NQ-HĐND); other provinces: see the provincial HĐND resolution. Re-registration: 2%.' } },
      { q: { vi: 'Ô tô điện có được miễn lệ phí trước bạ không?', en: 'Are electric cars exempt?' }, a: { vi: 'Ô tô điện chạy pin đăng ký lần đầu được áp mức 0% đến hết 28/02/2027 (NĐ 51/2025/NĐ-CP). Sau 28/02/2027 cần kiểm tra văn bản mới nhất về ưu đãi ô tô điện. Vẫn phải nộp phí đăng ký, cấp biển số.', en: 'Battery EVs pay 0% on first registration until 28/02/2027 (Decree 51/2025/ND-CP). After that date, check the latest regulation on EV incentives. Plate fees still apply.' } }
    ]
  },
  {
    id: 'retireage', section: 'finance', icon: '👴',
    slug: { vi: 'tinh-tuoi-nghi-huu', en: 'vietnam-retirement-age-calculator' },
    title: { vi: 'Tuổi nghỉ hưu', en: 'Retirement Age' },
    seo: { vi: 'Tính tuổi nghỉ hưu theo năm sinh – nam, nữ (NĐ 135)', en: 'Vietnam Retirement Age Calculator' },
    desc: { vi: 'Khi nào nghỉ hưu?', en: 'When do you retire?' },
    faq: [
      { q: { vi: 'Tuổi nghỉ hưu năm 2026 là bao nhiêu?', en: 'What is the retirement age in 2026?' }, a: { vi: 'Trong điều kiện lao động bình thường, năm 2026 tuổi nghỉ hưu của nam là 61 tuổi 6 tháng, của nữ là 57 tuổi (Điều 169 BLLĐ 2019, Phụ lục I NĐ 135/2020/NĐ-CP). Mỗi năm sau đó tăng nam 3 tháng (đến 62 tuổi năm 2028), nữ 4 tháng (đến 60 tuổi năm 2035).', en: 'Under normal conditions, in 2026 it is 61 years 6 months for men and 57 years for women (Labour Code 2019 Art. 169, Decree 135/2020 Appendix I). It then rises 3 months/year for men (to 62 in 2028) and 4 months/year for women (to 60 in 2035).' } },
      { q: { vi: 'Nam sinh năm 1970 nghỉ hưu năm nào?', en: 'When does a man born in 1970 retire?' }, a: { vi: 'Nam sinh năm 1970 nghỉ hưu khi đủ 62 tuổi, tức năm 2032 (ví dụ sinh tháng 6/1970: nghỉ hưu 30/06/2032, hưởng lương hưu từ 01/07/2032), nếu đủ 15 năm đóng BHXH.', en: 'A man born in 1970 retires at 62, i.e. in 2032 (e.g. born 6/1970: retires 30/06/2032, pension from 01/07/2032), provided he has 15 years of contributions.' } },
      { q: { vi: 'Nghỉ hưu sớm được bao nhiêu tuổi?', en: 'How early can you retire?' }, a: { vi: 'Tối đa 5 tuổi thấp hơn tuổi nghỉ hưu bình thường nếu có đủ 15 năm làm nghề nặng nhọc, độc hại, nguy hiểm hoặc ở vùng đặc biệt khó khăn, hoặc suy giảm khả năng lao động từ 61% (Điều 169 k3 BLLĐ, Điều 5 NĐ 135/2020/NĐ-CP). Ví dụ năm 2026: nam 56 tuổi 6 tháng, nữ 52 tuổi.', en: 'Up to 5 years below the normal age with 15+ years in arduous, hazardous or dangerous jobs or extremely difficult areas, or work capacity reduced by 61%+ (Labour Code Art. 169(3), Decree 135/2020 Art. 5). In 2026: men 56y6m, women 52.' } }
    ]
  },
  {
    id: 'water', section: 'life', icon: '💧',
    slug: { vi: 'tinh-tien-nuoc', en: 'vietnam-water-bill-calculator' },
    title: { vi: 'Tính tiền nước', en: 'Water Bill' },
    seo: { vi: 'Tính tiền nước sinh hoạt 2026 – Hà Nội, TP.HCM, Hải Phòng', en: 'Vietnam Water Bill Calculator 2026' },
    desc: { vi: 'Giá nước bậc thang, VAT, phí.', en: 'Tiered water price, VAT, fees.' },
    faq: [
      { q: { vi: 'Hà Nội dùng 15 m³ nước thì trả bao nhiêu tiền?', en: 'How much is 15 m³ of water in Hanoi?' }, a: { vi: 'Theo QĐ 3541/QĐ-UBND: 10 m³ × 8.500 + 5 m³ × 9.900 = 134.500 đ (chưa VAT); VAT 5% = 6.725 đ; phí BVMT nước thải 10% = 13.450 đ. Tổng 154.675 đ.', en: 'Per Decision 3541/QĐ-UBND: 10 m³ × 8,500 + 5 m³ × 9,900 = 134,500 VND (excl. VAT); VAT 5% = 6,725; wastewater fee 10% = 13,450. Total 154,675 VND.' } },
      { q: { vi: 'TP.HCM hộ 4 người dùng 20 m³ thì tiền nước bao nhiêu?', en: 'HCMC, 4-person household using 20 m³: how much?' }, a: { vi: 'Định mức bậc 1 = 4 người × 4 m³ = 16 m³; bậc 2 đến 24 m³. Tiền nước: 16 × 6.700 + 4 × 12.900 = 158.800 đ; VAT 5% = 7.940 đ; giá thoát nước 30% = 47.640 đ, VAT 8% = 3.811 đ. Tổng khoảng 218.191 đ (năm 2026).', en: 'Tier 1 = 4 people × 4 m³ = 16 m³; tier 2 up to 24 m³. Water: 16 × 6,700 + 4 × 12,900 = 158,800 VND; VAT 5% = 7,940; drainage 30% = 47,640, VAT 8% = 3,811. Total about 218,191 VND (2026).' } },
      { q: { vi: 'Tiền nước phải chịu những khoản thuế, phí nào?', en: 'Which taxes and fees apply to water bills?' }, a: { vi: 'VAT 5% trên tiền nước (Luật Thuế GTGT 48/2024/QH15) và phí BVMT đối với nước thải 10% giá nước chưa VAT (NĐ 346/2025/NĐ-CP). Ở TP.HCM thay phí BVMT bằng giá dịch vụ thoát nước 30% tiền nước, chịu VAT 8% đến hết 2026.', en: 'VAT 5% on water (VAT Law 48/2024/QH15) and a wastewater fee of 10% of the pre-VAT price (Decree 346/2025/ND-CP). HCMC instead charges a drainage service of 30% of the water charge, with 8% VAT through 2026.' } }
    ]
  },
  {
    id: 'diemtb', section: 'life', icon: '📚',
    slug: { vi: 'tinh-diem-trung-binh-mon', en: 'vietnam-school-grade-average' },
    title: { vi: 'Điểm trung bình môn', en: 'School Grade Average' },
    seo: { vi: 'Tính điểm trung bình môn, cả năm, xếp loại học lực (TT 22)', en: 'Vietnam School Grade Average & Rating (Circular 22)' },
    desc: { vi: 'Học kỳ, cả năm, học lực.', en: 'Semester, year, overall grade.' },
    faq: [
      { q: { vi: 'Công thức tính điểm trung bình môn học kỳ là gì?', en: 'How is the semester subject average calculated?' }, a: { vi: 'ĐTBmhk = (tổng điểm đánh giá thường xuyên + 2 × điểm giữa kỳ + 3 × điểm cuối kỳ) / (số điểm thường xuyên + 5), làm tròn 1 chữ số thập phân (Điều 9, Điều 5 TT 22/2021/TT-BGDĐT). Ví dụ thường xuyên 8, 7, 9; giữa kỳ 7,5; cuối kỳ 8: (24 + 15 + 24) / 8 = 7,875 → 7,9.', en: 'Semester average = (sum of regular scores + 2 × mid-term + 3 × final) / (number of regular scores + 5), rounded to 1 decimal (Art. 9, 5 of Circular 22/2021). Example: regular 8, 7, 9; mid 7.5; final 8: (24 + 15 + 24) / 8 = 7.875 → 7.9.' } },
      { q: { vi: 'Điểm trung bình môn cả năm tính thế nào?', en: 'How is the full-year average calculated?' }, a: { vi: 'ĐTBmcn = (ĐTB học kỳ I + 2 × ĐTB học kỳ II) / 3, làm tròn 1 chữ số thập phân. Ví dụ HK I 6,5, HK II 7,0: (6,5 + 14,0) / 3 = 6,83 → 6,8.', en: 'Year average = (Semester I + 2 × Semester II) / 3, rounded to 1 decimal. Example: 6.5 and 7.0 give 20.5 / 3 = 6.83 → 6.8.' } },
      { q: { vi: 'Điều kiện học lực (kết quả học tập) mức Tốt là gì?', en: 'What is required for the Excellent level?' }, a: { vi: 'Theo khoản 2 Điều 9 TT 22/2021/TT-BGDĐT: tất cả môn đánh giá bằng nhận xét đạt mức Đạt; tất cả môn tính điểm có ĐTB từ 6,5 trở lên, trong đó ít nhất 6 môn từ 8,0 trở lên. Không còn điều kiện riêng với Toán hoặc Ngữ văn.', en: 'Per Art. 9(2) of Circular 22/2021: all comment-graded subjects Achieved; every scored subject averages at least 6.5, with at least 6 subjects at 8.0 or above. There is no special Maths/Literature condition.' } }
    ]
  },
  {
    id: 'pitannual', section: 'finance', icon: '🧮',
    slug: { vi: 'quyet-toan-thue-tncn', en: 'vietnam-pit-annual-finalization' },
    title: { vi: 'Quyết toán thuế TNCN', en: 'PIT Annual Finalization' },
    seo: { vi: 'Quyết toán thuế TNCN 2026 & thuế thưởng Tết', en: 'Vietnam PIT Finalization 2026 & Tết Bonus Tax' },
    desc: { vi: 'Hoàn thuế, thuế thưởng Tết.', en: 'Refunds, bonus tax.' },
    faq: [
      { q: { vi: 'Thưởng Tết, lương tháng 13 có tính thuế TNCN không?', en: 'Is the Tết bonus / 13th-month pay taxable?' }, a: { vi: 'Có. Thưởng Tết là thu nhập từ tiền lương, tiền công, được cộng vào thu nhập của tháng chi trả để tạm khấu trừ thuế theo biểu lũy tiến; số thuế chính xác được xác định khi quyết toán cuối năm (Luật Thuế TNCN 109/2025/QH15).', en: 'Yes. It is employment income, added to the month paid for provisional withholding; the exact tax is settled at year-end (PIT Law 109/2025/QH15).' } },
      { q: { vi: 'Năm 2026 giảm trừ gia cảnh bao nhiêu?', en: 'What are the 2026 family deductions?' }, a: { vi: 'Bản thân 15.500.000 đ/tháng (186.000.000 đ/năm), mỗi người phụ thuộc 6.200.000 đ/tháng, theo NQ 110/2025/UBTVQH15, áp dụng từ kỳ tính thuế 2026.', en: '15,500,000 VND/month for yourself (186M/year) and 6,200,000 VND/month per dependent, per Resolution 110/2025/UBTVQH15, from tax period 2026.' } },
      { q: { vi: 'Thu nhập 240 triệu/năm, bảo hiểm 25,2 triệu, không người phụ thuộc thì thuế bao nhiêu?', en: 'Income 240M/year, insurance 25.2M, no dependents: how much tax?' }, a: { vi: 'Thu nhập tính thuế = 240.000.000 − 25.200.000 − 186.000.000 = 28.800.000 đ, nằm trong bậc 1 (đến 120 triệu/năm) thuế suất 5%: thuế cả năm = 1.440.000 đ. Nếu đã bị khấu trừ 2.000.000 đ thì được hoàn 560.000 đ.', en: 'Assessable income = 240M − 25.2M − 186M = 28.8M VND, in bracket 1 (up to 120M/year) at 5%: annual tax = 1,440,000 VND. If 2,000,000 VND was withheld, you get a 560,000 VND refund.' } }
    ]
  },
  {
    id: 'fire', section: 'finance', icon: '🔥',
    slug: { vi: 'tinh-lai-kep-nghi-huu-som', en: 'compound-interest-fire-calculator' },
    title: { vi: 'Lãi kép & nghỉ hưu sớm', en: 'Compound & FIRE' },
    seo: { vi: 'Tính lãi kép & kế hoạch nghỉ hưu sớm FIRE', en: 'Compound Interest & FIRE Retirement Calculator' },
    desc: { vi: 'Khi nào tự do tài chính?', en: 'When can you retire?' }
  },
  {
    id: 'numerology', section: 'destiny', icon: '🔢',
    slug: { vi: 'than-so-hoc', en: 'numerology-calculator' },
    title: { vi: 'Thần số học', en: 'Numerology' },
    seo: { vi: 'Thần số học Pitago – tra con số chủ đạo theo ngày sinh', en: 'Pythagorean Numerology Calculator' },
    desc: { vi: 'Số chủ đạo, năm cá nhân.', en: 'Life path, personal year.' }
  },
  {
    id: 'tarot', section: 'destiny', icon: '🃏',
    slug: { vi: 'boc-bai-tarot', en: 'tarot-reading' },
    title: { vi: 'Bốc bài Tarot', en: 'Tarot Reading' },
    seo: { vi: 'Bốc bài Tarot online miễn phí – tình yêu, sự nghiệp', en: 'Free Online Tarot Reading' },
    desc: { vi: 'Tình yêu, sự nghiệp.', en: 'Love, career.' }
  },
  {
    id: 'goodday', section: 'destiny', icon: '📅',
    slug: { vi: 'xem-ngay-tot-xau', en: 'auspicious-day-finder' },
    title: { vi: 'Xem ngày tốt', en: 'Lucky Days' },
    seo: { vi: 'Xem ngày tốt xấu, giờ hoàng đạo – cưới hỏi, khai trương', en: 'Auspicious Day & Lucky Hour Finder' },
    desc: { vi: 'Cưới hỏi, khai trương.', en: 'Weddings, openings.' }
  },
  {
    id: 'compress', section: 'tools', icon: '🗜️',
    slug: { vi: 'nen-anh-hang-loat', en: 'bulk-image-compressor' },
    title: { vi: 'Nén ảnh', en: 'Compress Images' },
    seo: { vi: 'Nén ảnh online hàng loạt – giảm dung lượng JPG, PNG', en: 'Bulk Image Compressor online' },
    desc: { vi: 'Nhẹ để nộp hồ sơ.', en: 'Small enough to upload.' }
  },
  {
    id: 'moneywords', section: 'tools', icon: '🔤',
    slug: { vi: 'doc-so-tien-thanh-chu', en: 'amount-in-words' },
    title: { vi: 'Số tiền bằng chữ', en: 'Amount in Words' },
    seo: { vi: 'Đọc số tiền thành chữ chuẩn hóa đơn (VNĐ, USD)', en: 'Amount in Words (VND, USD)' },
    desc: { vi: 'Cho hóa đơn, chứng từ.', en: 'For invoices.' }
  },
  {
    id: 'documents', section: 'tools', icon: '📄',
    slug: { vi: 'tao-cv-hop-dong-mau', en: 'cv-contract-templates' },
    title: { vi: 'CV & Hợp đồng', en: 'CV & Contracts' },
    seo: { vi: 'Tạo CV xin việc online & hợp đồng mẫu miễn phí – xuất PDF, Word', en: 'Free CV Builder & Contract Templates' },
    desc: { vi: 'Xuất PDF, Word.', en: 'PDF, Word export.' }
  },
  {
    id: 'forms', section: 'tools', icon: '📝',
    slug: { vi: 'mau-don', en: 'letter-templates' },
    title: { vi: 'Mẫu đơn', en: 'Letter Templates' },
    seo: { vi: 'Mẫu đơn xin nghỉ việc, xin việc, nghỉ phép, nghỉ học – điền online, in ngay', en: 'Vietnamese Letter Templates – resignation, leave, job application' },
    desc: { vi: 'Nghỉ việc, xin việc, nghỉ phép.', en: 'Resignation, leave, application.' },
    faq: [
      { q: { vi: 'Xin nghỉ việc phải báo trước bao lâu?', en: 'Notice period?' }, a: { vi: 'Theo Điều 35 Bộ luật Lao động 2019: 45 ngày với HĐ không xác định thời hạn, 30 ngày với HĐ 12–36 tháng, 3 ngày làm việc với HĐ dưới 12 tháng.', en: 'Labour Code 2019 Art. 35: 45 days, 30 days, or 3 working days depending on contract.' } },
      { q: { vi: 'Có mẫu đơn xin nghỉ việc bắt buộc không?', en: 'Is there a mandatory form?' }, a: { vi: 'Không. Pháp luật không quy định mẫu; chỉ cần thông báo bằng văn bản, rõ ngày nghỉ. Nhiều công ty có mẫu riêng.', en: 'No mandatory form; a written notice with the date is enough.' } },
      { q: { vi: 'Mẫu đơn ly hôn lấy ở đâu?', en: 'Divorce forms?' }, a: { vi: 'Đơn ly hôn là mẫu của Tòa án (đơn khởi kiện ly hôn đơn phương, đơn yêu cầu công nhận thuận tình ly hôn). Hãy lấy mẫu đang áp dụng tại Tòa án nơi nộp hồ sơ để tránh bị trả đơn.', en: 'Divorce petitions use court forms; get the current one from the court.' } }
    ]
  },
  {
    id: 'portfolio', section: 'tools', icon: '🎨',
    slug: { vi: 'tao-portfolio-online', en: 'portfolio-website-builder' },
    title: { vi: 'Portfolio', en: 'Portfolio' },
    seo: { vi: 'Tạo portfolio online miễn phí – 20 mẫu, tải sản phẩm & chỉnh ảnh', en: 'Free Portfolio Website Builder' },
    desc: { vi: 'Tải sản phẩm, chỉnh ảnh.', en: 'Upload and edit your work.' }
  }
];

export const getTool = (id) => TOOLS.find((t) => t.id === id);
export const toolsIn = (section) => TOOLS.filter((t) => t.section === section);

export function sectionUrl(sectionId, lang = 'vi') {
  const s = SECTIONS[sectionId];
  return (lang === 'en' ? '/en/' : '/') + s.slug[lang];
}

export function toolUrl(toolOrId, lang = 'vi') {
  const t = typeof toolOrId === 'string' ? getTool(toolOrId) : toolOrId;
  return sectionUrl(t.section, lang) + '/' + t.slug[lang];
}

export function recordUrl(record) {
  return sectionUrl(record.section, record.lang) + '/' + record.slug;
}

export const homeUrl = (lang) => (lang === 'en' ? '/en' : '/');

