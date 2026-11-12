// Document templates: CVs + contracts. Each template = { id, group, name, fields, render(values) -> HTML }.
// group: 'cv' | 'vn' (Vietnamese law) | 'intl' (foreign law). Contracts also carry `category` and `law` (legal basis shown in the UI).
//
// ACCURACY RULE: only cite article numbers that have been checked against the official text.
// None of these Vietnamese contracts has a mandatory state-issued form; they are reference templates that
// contain the content the cited law requires. Verified 10/2026.
import { moneyToWords } from './numwords.js';
import { escapeHtml as e, fmtNum } from './format.js';
import { cvTemplates } from './cv-templates.js';
import { buildVietQrSvg } from './vietqr.js';

const today = () => new Date().toISOString().slice(0, 10);
const viDate = (iso) => {
  if (!iso) return 'ngày …… tháng …… năm ……';
  const [y, m, d] = iso.split('-');
  return `ngày ${d} tháng ${m} năm ${y}`;
};
const enDate = (iso) => (iso ? new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '________');
const nl = (s) => e(s).replace(/\n/g, '<br>');
const lines = (s) => String(s || '').split('\n').map((x) => x.trim()).filter(Boolean);
const num = (v) => Number(String(v ?? '').replace(/\D/g, '')) || 0;
const money = (v, lang = 'vi') => fmtNum(num(v), lang);
const moneyWords = (v, lang = 'vi') => moneyToWords(String(num(v)), 'VND', lang);
const blank = (v, filler = '…………………') => e(v) || filler;

const DOC = `font-family:'Times New Roman',Times,serif;font-size:14px;line-height:1.6;color:#000`;
const nationalHeader = `<p style="text-align:center;margin:0"><b>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</b><br><b><u>Độc lập – Tự do – Hạnh phúc</u></b></p>`;
const title = (t, basis) => `<h2 style="text-align:center;margin:18px 0 4px;font-size:18px">${t}</h2>${basis ? `<div style="text-align:center;font-style:italic;margin-bottom:12px">${basis}</div>` : ''}`;
const art = (n, t, body) => `<p style="margin:10px 0"><b>Điều ${n}. ${t}</b><br>${body}</p>`;
const clause = (n, t, body) => `<p style="margin:10px 0"><b>${n}. ${t}.</b> ${body}</p>`;

// ---------- Party blocks ----------
const orgFields = (p, label) => [
  { name: `${p}Name`, label: `${label} – Tên tổ chức / cá nhân`, default: '' },
  { name: `${p}Rep`, label: 'Người đại diện, chức vụ (nếu là tổ chức)', default: '' },
  { name: `${p}Id`, label: 'Mã số thuế / Số CCCD', default: '' },
  { name: `${p}Address`, label: 'Địa chỉ', default: '' },
  { name: `${p}Phone`, label: 'Điện thoại', default: '' }
];
const personFields = (p, label) => [
  { name: `${p}Name`, label: `${label} – Họ và tên`, default: '' },
  { name: `${p}Dob`, label: 'Ngày sinh', type: 'date', default: '' },
  { name: `${p}Id`, label: 'Số CCCD, ngày cấp, nơi cấp', default: '' },
  { name: `${p}Address`, label: 'Nơi cư trú', default: '' },
  { name: `${p}Phone`, label: 'Điện thoại', default: '' }
];
const orgBlock = (head, v, p) => `<p style="margin:8px 0"><b>${head}</b><br>
  Tên: <b>${blank(v[p + 'Name'])}</b><br>
  ${v[p + 'Rep'] ? `Đại diện: ${e(v[p + 'Rep'])}<br>` : ''}
  Mã số thuế / CCCD: ${blank(v[p + 'Id'], '…………')}<br>
  Địa chỉ: ${blank(v[p + 'Address'])}<br>
  Điện thoại: ${blank(v[p + 'Phone'], '…………')}</p>`;
const personBlock = (head, v, p) => `<p style="margin:8px 0"><b>${head}</b><br>
  Họ và tên: <b>${blank(v[p + 'Name'])}</b>${v[p + 'Gender'] ? `&nbsp;&nbsp; Giới tính: ${e(v[p + 'Gender'])}` : ''}<br>
  Ngày sinh: ${v[p + 'Dob'] ? viDate(v[p + 'Dob']).replace('ngày ', '') : '……/……/………'}<br>
  Số CCCD: ${blank(v[p + 'Id'], '…………')}<br>
  Nơi cư trú: ${blank(v[p + 'Address'])}<br>
  Điện thoại: ${blank(v[p + 'Phone'], '…………')}</p>`;
const signBlock = (left, right, en = false) => `
  <table style="width:100%;margin-top:36px;text-align:center;border-collapse:collapse"><tr>
  <td style="width:50%;vertical-align:top"><b>${left}</b><br><i>${en ? '(Signature &amp; full name)' : '(Ký, ghi rõ họ tên)'}</i><br><br><br><br><br></td>
  <td style="width:50%;vertical-align:top"><b>${right}</b><br><i>${en ? '(Signature &amp; full name)' : '(Ký, ghi rõ họ tên, đóng dấu nếu có)'}</i><br><br><br><br><br></td></tr></table>`;
const opening = (v) => `<p>Hôm nay, ${viDate(v.signDate)}, tại ${blank(v.signPlace, '……………')}, chúng tôi gồm:</p>`;
const signFields = [
  { name: 'signDate', label: 'Ngày ký', type: 'date', default: today() },
  { name: 'signPlace', label: 'Địa điểm ký', default: '' }
];
const payFields = [
  { name: 'payBank', label: 'Ngân hàng nhận thanh toán / đặt cọc VietQR (VD: VietinBank, VCB, MB)', default: 'VietinBank' },
  { name: 'payAccount', label: 'Số tài khoản nhận tiền (để tạo mã VietQR tự động trên hợp đồng/báo giá)', default: '105612356699' }
];
const vietQrPayBox = (v, amountVnd, memoText) => {
  const bank = String(v.payBank || 'VietinBank').trim();
  const acc = String(v.payAccount || '105612356699').replace(/\s+/g, '');
  if (!bank || !acc) return '';
  const amt = num(amountVnd);
  const memoStr = String(memoText || 'Thanh toan hop dong').slice(0, 45);
  const svgQr = buildVietQrSvg({ bank, account: acc, amount: amt >= 1000 ? amt : 0, memo: memoStr });
  const memo = encodeURIComponent(memoStr);
  const qrUrl = `https://img.vietqr.io/image/${encodeURIComponent(bank)}-${encodeURIComponent(acc)}-compact2.png?addInfo=${memo}${amt >= 1000 ? `&amount=${amt}` : ''}`;
  return `<div style="margin:14px 0;padding:12px 14px;border:1.5px solid #0f172a;border-radius:8px;display:flex;align-items:center;gap:14px;background:#f8fafc">
    ${svgQr ? `<div style="width:108px;height:108px;flex-shrink:0;border:1px solid #cbd5e1;border-radius:6px;background:#fff;padding:3px">${svgQr}</div>` : `<img src="${qrUrl}" alt="VietQR" style="width:108px;height:108px;object-fit:contain;border:1px solid #cbd5e1;border-radius:6px;background:#fff;padding:3px" />`}
    <div style="font-size:13px;line-height:1.5">
      <b>THÔNG TIN CHUYỂN KHOẢN / ĐẶT CỌC NHANH (VIETQR NAPAS 247)</b><br>
      Ngân hàng thụ hưởng: <b>${e(bank)}</b> &nbsp;|&nbsp; Số tài khoản: <b>${e(acc)}</b><br>
      ${amt >= 1000 ? `Số tiền tự động điền: <b>${fmtNum(amt)} đồng</b> (${moneyWords(amt)})<br>` : ''}
      Nội dung chuyển khoản: <b>${e(memoStr)}</b>
    </div>
  </div>`;
};
const closingVi = (copies = 2) => `Hợp đồng có hiệu lực kể từ ngày ký, được lập thành ${String(copies).padStart(2, '0')} bản có giá trị pháp lý như nhau, mỗi bên giữ ${String(copies / 2).padStart(2, '0')} bản. Tranh chấp phát sinh được giải quyết trước hết bằng thương lượng, hòa giải; nếu không thành, một trong các bên có quyền yêu cầu Tòa án có thẩm quyền giải quyết theo quy định của pháp luật.`;

const BLDS = 'Bộ luật Dân sự số 91/2015/QH13';
const BLLD = 'Bộ luật Lao động số 45/2019/QH14';
const LTM = 'Luật Thương mại số 36/2005/QH11';
const LNO = 'Luật Nhà ở số 27/2023/QH15';
const LSHTT = 'Luật Sở hữu trí tuệ số 50/2005/QH11 (sửa đổi, bổ sung)';

// Probation limits – BLLĐ 2019 Điều 25
const PROBATION = [
  { v: '180', label: 'Người quản lý doanh nghiệp – tối đa 180 ngày' },
  { v: '60', label: 'Chức danh cần trình độ cao đẳng trở lên – tối đa 60 ngày' },
  { v: '30', label: 'Trình độ trung cấp, công nhân kỹ thuật, nhân viên nghiệp vụ – tối đa 30 ngày' },
  { v: '6', label: 'Công việc khác – tối đa 06 ngày làm việc' }
];

// =====================================================================
// VIETNAMESE LAW – Vietnamese text
// =====================================================================
function vnContracts() {
  return [
    {
      id: 'laodong', category: 'Lao động', name: 'Hợp đồng lao động',
      law: `${BLLD} – Điều 20 (loại hợp đồng), Điều 21 (nội dung bắt buộc)`,
      fields: [
        ...orgFields('a', 'Người sử dụng lao động'),
        ...personFields('b', 'Người lao động'),
        { name: 'bGender', label: 'Giới tính người lao động', type: 'select', options: ['Nam', 'Nữ'], default: 'Nam' },
        { name: 'position', label: 'Công việc / chức danh', default: 'Nhân viên kinh doanh' },
        { name: 'place', label: 'Địa điểm làm việc', default: '' },
        { name: 'type', label: 'Loại hợp đồng (Điều 20)', type: 'select', options: ['Hợp đồng lao động không xác định thời hạn', 'Hợp đồng lao động xác định thời hạn'], default: 'Hợp đồng lao động xác định thời hạn' },
        { name: 'months', label: 'Thời hạn (tháng, tối đa 36) – chỉ với HĐ xác định thời hạn', type: 'number', default: '12' },
        { name: 'startDate', label: 'Ngày bắt đầu làm việc', type: 'date', default: today() },
        { name: 'salary', label: 'Mức lương theo công việc/chức danh (đồng/tháng)', default: '15000000' },
        { name: 'allowance', label: 'Phụ cấp lương và các khoản bổ sung khác', default: 'Phụ cấp ăn trưa 730.000 đồng/tháng' },
        { name: 'payDay', label: 'Thời hạn trả lương', default: 'Trước ngày 05 của tháng kế tiếp' },
        { name: 'hours', label: 'Thời giờ làm việc', default: '08 giờ/ngày, 40 giờ/tuần, từ thứ Hai đến thứ Sáu' },
        ...signFields
      ],
      render: (v) => {
        const fixed = v.type !== 'Hợp đồng lao động không xác định thời hạn';
        const m = Math.min(36, Math.max(1, num(v.months) || 12));
        return `<div style="${DOC}">${nationalHeader}${title('HỢP ĐỒNG LAO ĐỘNG', `Căn cứ ${BLLD} và các văn bản hướng dẫn thi hành`)}
        ${opening(v)}${orgBlock('NGƯỜI SỬ DỤNG LAO ĐỘNG (Bên A)', v, 'a')}${personBlock('NGƯỜI LAO ĐỘNG (Bên B)', v, 'b')}
        <p>Hai bên thỏa thuận giao kết hợp đồng lao động với các điều khoản sau:</p>
        ${art(1, 'Công việc, địa điểm làm việc và thời hạn hợp đồng', `Công việc: <b>${blank(v.position)}</b>.<br>Địa điểm làm việc: ${blank(v.place, 'trụ sở Bên A')}.<br>Loại hợp đồng: <b>${e(v.type)}</b>${fixed ? `, thời hạn ${m} tháng` : ''}, kể từ ${viDate(v.startDate)}.`)}
        ${art(2, 'Tiền lương, phụ cấp và hình thức trả lương', `Mức lương theo công việc, chức danh: <b>${money(v.salary)} đồng/tháng</b> (Bằng chữ: ${moneyWords(v.salary)}).<br>Phụ cấp lương và các khoản bổ sung khác: ${blank(v.allowance, 'không')}.<br>Hình thức trả lương: chuyển khoản. Thời hạn trả lương: ${blank(v.payDay)}.`)}
        ${art(3, 'Chế độ nâng bậc, nâng lương', 'Bên B được xét nâng bậc, nâng lương theo thang lương, bảng lương và quy chế của Bên A, căn cứ kết quả thực hiện công việc.')}
        ${art(4, 'Thời giờ làm việc, thời giờ nghỉ ngơi', `Thời giờ làm việc: ${blank(v.hours)}.<br>Nghỉ hằng năm, nghỉ lễ, Tết, nghỉ việc riêng theo quy định của Bộ luật Lao động và nội quy lao động của Bên A.`)}
        ${art(5, 'Trang bị bảo hộ lao động', 'Bên B được trang bị phương tiện bảo vệ cá nhân, bảo đảm an toàn, vệ sinh lao động phù hợp với công việc theo quy định của pháp luật.')}
        ${art(6, 'Bảo hiểm xã hội, bảo hiểm y tế, bảo hiểm thất nghiệp', 'Hai bên tham gia bảo hiểm xã hội bắt buộc, bảo hiểm y tế, bảo hiểm thất nghiệp theo quy định của pháp luật; mức đóng của mỗi bên theo tỷ lệ pháp luật quy định.')}
        ${art(7, 'Đào tạo, bồi dưỡng, nâng cao trình độ, kỹ năng nghề', 'Bên B được tham gia các chương trình đào tạo, bồi dưỡng do Bên A tổ chức hoặc cử đi theo nhu cầu công việc. Quyền lợi, nghĩa vụ và chi phí đào tạo (nếu có) thực hiện theo hợp đồng đào tạo riêng.')}
        ${art(8, 'Quyền và nghĩa vụ của các bên', 'Bên A: bảo đảm việc làm, trả lương đầy đủ, đúng hạn; thực hiện các chế độ đối với Bên B theo quy định.<br>Bên B: hoàn thành công việc được giao; chấp hành nội quy lao động, kỷ luật lao động; bảo vệ tài sản và giữ bí mật kinh doanh, bí mật công nghệ của Bên A.')}
        ${art(9, 'Sửa đổi, chấm dứt hợp đồng', 'Việc sửa đổi, bổ sung hợp đồng thực hiện bằng văn bản. Việc chấm dứt và đơn phương chấm dứt hợp đồng thực hiện theo quy định của Bộ luật Lao động (Điều 34 đến Điều 37).')}
        ${art(10, 'Điều khoản thi hành', closingVi(2))}
        ${signBlock('NGƯỜI LAO ĐỘNG', 'NGƯỜI SỬ DỤNG LAO ĐỘNG')}</div>`;
      }
    },
    {
      id: 'thuviec', category: 'Lao động', name: 'Hợp đồng thử việc',
      law: `${BLLD} – Điều 24 (thử việc), Điều 25 (thời gian thử việc), Điều 26 (lương thử việc ≥ 85%), Điều 27 (kết thúc thử việc)`,
      fields: [
        ...orgFields('a', 'Người sử dụng lao động'),
        ...personFields('b', 'Người lao động'),
        { name: 'position', label: 'Công việc thử việc', default: 'Chuyên viên kế toán' },
        { name: 'level', label: 'Nhóm công việc (quyết định thời gian thử việc tối đa)', type: 'select', options: PROBATION.map((p) => p.label), default: PROBATION[1].label },
        { name: 'days', label: 'Số ngày thử việc', type: 'number', default: '60' },
        { name: 'startDate', label: 'Ngày bắt đầu thử việc', type: 'date', default: today() },
        { name: 'fullSalary', label: 'Lương chính thức của công việc (đồng/tháng)', default: '12000000' },
        { name: 'percent', label: 'Lương thử việc (% lương chính thức, tối thiểu 85%)', type: 'number', default: '85' },
        ...signFields
      ],
      render: (v) => {
        const lvl = PROBATION.find((p) => p.label === v.level) || PROBATION[1];
        const days = Math.min(num(lvl.v), Math.max(1, num(v.days) || num(lvl.v)));
        const pct = Math.max(85, Math.min(100, num(v.percent) || 85));
        const pay = Math.round(num(v.fullSalary) * pct / 100);
        const unit = lvl.v === '6' ? 'ngày làm việc' : 'ngày';
        return `<div style="${DOC}">${nationalHeader}${title('HỢP ĐỒNG THỬ VIỆC', `Căn cứ ${BLLD}`)}
        ${opening(v)}${orgBlock('NGƯỜI SỬ DỤNG LAO ĐỘNG (Bên A)', v, 'a')}${personBlock('NGƯỜI LAO ĐỘNG (Bên B)', v, 'b')}
        ${art(1, 'Công việc và thời gian thử việc', `Công việc: <b>${blank(v.position)}</b>.<br>Thời gian thử việc: <b>${days} ${unit}</b>, kể từ ${viDate(v.startDate)} (không vượt quá thời gian tối đa theo Điều 25 Bộ luật Lao động; chỉ thử việc một lần đối với một công việc).`)}
        ${art(2, 'Tiền lương thử việc', `Lương thử việc: <b>${fmtNum(pay)} đồng/tháng</b> (Bằng chữ: ${moneyWords(pay)}), bằng ${pct}% mức lương của công việc đó (${money(v.fullSalary)} đồng/tháng), không thấp hơn 85% theo Điều 26 Bộ luật Lao động.`)}
        ${art(3, 'Kết thúc thời gian thử việc', 'Khi kết thúc thời gian thử việc, Bên A thông báo kết quả thử việc cho Bên B. Trường hợp đạt yêu cầu, hai bên tiếp tục thực hiện hoặc giao kết hợp đồng lao động. Trong thời gian thử việc, mỗi bên có quyền hủy bỏ thỏa thuận thử việc mà không cần báo trước và không phải bồi thường (Điều 27 Bộ luật Lao động).')}
        ${art(4, 'Quyền và nghĩa vụ khác', 'Thời giờ làm việc, nghỉ ngơi, an toàn, vệ sinh lao động thực hiện theo nội quy của Bên A và quy định của pháp luật. Bên B có trách nhiệm hoàn thành công việc, giữ bí mật thông tin của Bên A.')}
        ${art(5, 'Điều khoản thi hành', closingVi(2))}
        ${signBlock('NGƯỜI LAO ĐỘNG', 'NGƯỜI SỬ DỤNG LAO ĐỘNG')}</div>`;
      }
    },
    {
      id: 'thuenha', category: 'Nhà ở & Tài sản', name: 'Hợp đồng thuê nhà ở',
      law: `${BLDS} – Điều 472 trở đi (hợp đồng thuê tài sản); ${LNO}`,
      fields: [
        ...personFields('a', 'Bên cho thuê'),
        ...personFields('b', 'Bên thuê'),
        { name: 'property', label: 'Địa chỉ nhà cho thuê', default: '' },
        { name: 'area', label: 'Diện tích sử dụng (m²)', default: '30' },
        { name: 'ownership', label: 'Giấy tờ chứng minh quyền sở hữu/quyền cho thuê', default: 'Giấy chứng nhận quyền sử dụng đất, quyền sở hữu nhà ở số ……' },
        { name: 'rent', label: 'Giá thuê (đồng/tháng)', default: '5000000' },
        { name: 'deposit', label: 'Tiền đặt cọc (đồng)', default: '10000000' },
        { name: 'term', label: 'Thời hạn thuê (tháng)', type: 'number', default: '12' },
        { name: 'startDate', label: 'Ngày bàn giao nhà', type: 'date', default: today() },
        ...payFields,
        ...signFields
      ],
      render: (v) => `<div style="${DOC}">${nationalHeader}${title('HỢP ĐỒNG THUÊ NHÀ Ở', `Căn cứ ${BLDS}; ${LNO}`)}
        ${opening(v)}${personBlock('BÊN CHO THUÊ (Bên A)', v, 'a')}${personBlock('BÊN THUÊ (Bên B)', v, 'b')}
        ${art(1, 'Nhà ở cho thuê', `Địa chỉ: <b>${blank(v.property)}</b>. Diện tích sử dụng: ${blank(v.area, '……')} m².<br>Giấy tờ: ${blank(v.ownership)}.<br>Mục đích thuê: để ở.`)}
        ${art(2, 'Thời hạn thuê', `${num(v.term) || '……'} tháng, kể từ ${viDate(v.startDate)}. Hết thời hạn, hai bên có thể thỏa thuận gia hạn bằng văn bản.`)}
        ${art(3, 'Giá thuê, phương thức và thời hạn thanh toán', `Giá thuê: <b>${money(v.rent)} đồng/tháng</b> (Bằng chữ: ${moneyWords(v.rent)}). Thanh toán trước ngày 05 hằng tháng bằng tiền mặt hoặc chuyển khoản.<br>Chi phí điện, nước, internet, dịch vụ do Bên B thanh toán theo thực tế sử dụng.`)}
        ${art(4, 'Tiền đặt cọc', `Bên B đặt cọc <b>${money(v.deposit)} đồng</b> (Bằng chữ: ${moneyWords(v.deposit)}) để bảo đảm thực hiện hợp đồng. Khi hợp đồng chấm dứt đúng thỏa thuận, Bên A hoàn trả tiền cọc trong 07 ngày sau khi trừ các khoản Bên B còn nợ hoặc chi phí khắc phục hư hỏng do lỗi của Bên B (nếu có).${vietQrPayBox(v, v.deposit, 'Dat coc thue nha')}`)}
        ${art(5, 'Quyền và nghĩa vụ của Bên A', 'Giao nhà và trang thiết bị đúng hiện trạng đã thỏa thuận; bảo đảm cho Bên B sử dụng ổn định trong thời hạn thuê; bảo dưỡng, sửa chữa hư hỏng lớn không do lỗi của Bên B; nhận tiền thuê đầy đủ, đúng hạn.')}
        ${art(6, 'Quyền và nghĩa vụ của Bên B', 'Sử dụng nhà đúng mục đích; trả tiền thuê đúng hạn; giữ gìn nhà và trang thiết bị, sửa chữa hư hỏng do lỗi của mình; không cho thuê lại khi chưa được Bên A đồng ý; chấp hành quy định về an ninh trật tự, phòng cháy chữa cháy, đăng ký cư trú; trả nhà khi hết hạn.')}
        ${art(7, 'Đơn phương chấm dứt hợp đồng', 'Bên muốn đơn phương chấm dứt hợp đồng phải thông báo cho bên kia bằng văn bản trước ít nhất 30 ngày, trừ trường hợp hai bên có thỏa thuận khác. Bên vi phạm nghĩa vụ báo trước phải bồi thường thiệt hại phát sinh (nếu có) theo quy định của pháp luật.')}
        ${art(8, 'Điều khoản thi hành', closingVi(2))}
        ${signBlock('BÊN CHO THUÊ', 'BÊN THUÊ')}</div>`
    },
    {
      id: 'thuetaisan', category: 'Nhà ở & Tài sản', name: 'Hợp đồng thuê tài sản (xe, máy móc, thiết bị)',
      law: `${BLDS} – Điều 472 trở đi (hợp đồng thuê tài sản)`,
      fields: [
        ...orgFields('a', 'Bên cho thuê'),
        ...orgFields('b', 'Bên thuê'),
        { name: 'asset', label: 'Tài sản thuê (tên, nhãn hiệu, biển số/số khung, tình trạng)', type: 'textarea', default: 'Xe ô tô con 5 chỗ, nhãn hiệu ……, biển số ……, tình trạng hoạt động tốt.' },
        { name: 'rent', label: 'Giá thuê (đồng/tháng)', default: '12000000' },
        { name: 'deposit', label: 'Tiền đặt cọc / ký quỹ (đồng)', default: '20000000' },
        { name: 'term', label: 'Thời hạn thuê (tháng)', type: 'number', default: '6' },
        { name: 'startDate', label: 'Ngày giao tài sản', type: 'date', default: today() },
        ...signFields
      ],
      render: (v) => `<div style="${DOC}">${nationalHeader}${title('HỢP ĐỒNG THUÊ TÀI SẢN', `Căn cứ ${BLDS}`)}
        ${opening(v)}${orgBlock('BÊN CHO THUÊ (Bên A)', v, 'a')}${orgBlock('BÊN THUÊ (Bên B)', v, 'b')}
        ${art(1, 'Tài sản thuê', nl(v.asset))}
        ${art(2, 'Thời hạn thuê', `${num(v.term) || '……'} tháng, kể từ ${viDate(v.startDate)}. Việc giao, trả tài sản được lập biên bản ghi rõ tình trạng tài sản.`)}
        ${art(3, 'Giá thuê và thanh toán', `<b>${money(v.rent)} đồng/tháng</b> (Bằng chữ: ${moneyWords(v.rent)}), thanh toán trước ngày 05 hằng tháng.<br>Tiền đặt cọc: ${money(v.deposit)} đồng (Bằng chữ: ${moneyWords(v.deposit)}), hoàn trả khi Bên B trả tài sản đúng tình trạng đã thỏa thuận, trừ hao mòn tự nhiên.`)}
        ${art(4, 'Quyền và nghĩa vụ của Bên A', 'Giao tài sản đúng số lượng, chất lượng, chủng loại, tình trạng và kèm giấy tờ cần thiết; bảo đảm giá trị sử dụng của tài sản và quyền sử dụng ổn định của Bên B.')}
        ${art(5, 'Quyền và nghĩa vụ của Bên B', 'Bảo quản, sử dụng tài sản đúng công dụng; chịu chi phí bảo dưỡng thông thường; không cho thuê lại khi chưa được Bên A đồng ý; bồi thường nếu làm mất, hư hỏng tài sản do lỗi của mình; trả tài sản đúng hạn.')}
        ${art(6, 'Điều khoản thi hành', closingVi(2))}
        ${signBlock('BÊN CHO THUÊ', 'BÊN THUÊ')}</div>`
    },
    {
      id: 'datcoc', category: 'Nhà ở & Tài sản', name: 'Hợp đồng đặt cọc',
      law: `${BLDS} – Điều 328 (đặt cọc)`,
      fields: [
        ...personFields('a', 'Bên đặt cọc'),
        ...personFields('b', 'Bên nhận đặt cọc'),
        { name: 'purpose', label: 'Mục đích đặt cọc (giao kết hợp đồng gì, về tài sản nào)', type: 'textarea', default: 'Bảo đảm việc giao kết hợp đồng chuyển nhượng quyền sử dụng đất và tài sản gắn liền với đất tại thửa đất số ……, tờ bản đồ số ……, địa chỉ ……' },
        { name: 'price', label: 'Giá trị giao dịch dự kiến (đồng)', default: '2000000000' },
        { name: 'deposit', label: 'Số tiền đặt cọc (đồng)', default: '200000000' },
        { name: 'deadline', label: 'Hạn giao kết hợp đồng chính', type: 'date', default: today() },
        ...payFields,
        ...signFields
      ],
      render: (v) => `<div style="${DOC}">${nationalHeader}${title('HỢP ĐỒNG ĐẶT CỌC', `Căn cứ ${BLDS}`)}
        ${opening(v)}${personBlock('BÊN ĐẶT CỌC (Bên A)', v, 'a')}${personBlock('BÊN NHẬN ĐẶT CỌC (Bên B)', v, 'b')}
        ${art(1, 'Tài sản đặt cọc', `Bên A giao cho Bên B số tiền <b>${money(v.deposit)} đồng</b> (Bằng chữ: ${moneyWords(v.deposit)}).${vietQrPayBox(v, v.deposit, 'Chuyen khoan dat coc')}`)}
        ${art(2, 'Mục đích đặt cọc', `${nl(v.purpose)}<br>Giá trị giao dịch dự kiến: ${money(v.price)} đồng (Bằng chữ: ${moneyWords(v.price)}). Hạn giao kết hợp đồng: chậm nhất ${viDate(v.deadline)}.`)}
        ${art(3, 'Xử lý tiền đặt cọc', 'Theo Điều 328 Bộ luật Dân sự: (a) Trường hợp hợp đồng được giao kết, thực hiện thì tiền đặt cọc được trả lại cho Bên A hoặc được trừ để thực hiện nghĩa vụ trả tiền; (b) Nếu Bên A từ chối việc giao kết, thực hiện hợp đồng thì tiền đặt cọc thuộc về Bên B; (c) Nếu Bên B từ chối việc giao kết, thực hiện hợp đồng thì phải trả cho Bên A tiền đặt cọc và một khoản tiền tương đương giá trị tiền đặt cọc.')}
        ${art(4, 'Cam kết của các bên', 'Bên B cam kết tài sản thuộc quyền sở hữu/sử dụng hợp pháp của mình, không có tranh chấp, không bị kê biên. Bên A đã tìm hiểu kỹ thông tin về tài sản. Đối với giao dịch về bất động sản, hợp đồng chuyển nhượng chính thức phải được công chứng hoặc chứng thực theo quy định của pháp luật.')}
        ${art(5, 'Điều khoản thi hành', closingVi(2))}
        ${signBlock('BÊN ĐẶT CỌC', 'BÊN NHẬN ĐẶT CỌC')}</div>`
    },
    {
      id: 'vaytien', category: 'Dân sự', name: 'Hợp đồng vay tiền',
      law: `${BLDS} – Điều 463 (hợp đồng vay tài sản), Điều 466 (nghĩa vụ trả nợ), Điều 468 (lãi suất tối đa 20%/năm)`,
      fields: [
        ...personFields('a', 'Bên cho vay'),
        ...personFields('b', 'Bên vay'),
        { name: 'amount', label: 'Số tiền vay (đồng)', default: '50000000' },
        { name: 'rate', label: 'Lãi suất (%/năm, tối đa 20% – để 0 nếu vay không lãi)', type: 'number', default: '10' },
        { name: 'startDate', label: 'Ngày nhận tiền vay', type: 'date', default: today() },
        { name: 'dueDate', label: 'Hạn trả nợ', type: 'date', default: today() },
        { name: 'purpose', label: 'Mục đích vay', default: 'Tiêu dùng cá nhân' },
        ...signFields
      ],
      render: (v) => {
        const raw = Number(String(v.rate || '0').replace(',', '.')) || 0;
        const rate = Math.min(20, Math.max(0, raw));
        return `<div style="${DOC}">${nationalHeader}${title('HỢP ĐỒNG VAY TIỀN', `Căn cứ ${BLDS}`)}
        ${opening(v)}${personBlock('BÊN CHO VAY (Bên A)', v, 'a')}${personBlock('BÊN VAY (Bên B)', v, 'b')}
        ${art(1, 'Số tiền vay', `Bên A cho Bên B vay số tiền <b>${money(v.amount)} đồng</b> (Bằng chữ: ${moneyWords(v.amount)}). Bên B đã nhận đủ số tiền vào ${viDate(v.startDate)}.<br>Mục đích vay: ${blank(v.purpose)}.`)}
        ${art(2, 'Lãi suất', rate > 0 ? `Lãi suất ${String(rate).replace('.', ',')}%/năm tính trên số tiền vay, không vượt quá mức 20%/năm theo khoản 1 Điều 468 Bộ luật Dân sự.` : 'Đây là khoản vay không có lãi.')}
        ${art(3, 'Thời hạn và phương thức trả nợ', `Bên B trả đủ nợ gốc${rate > 0 ? ' và lãi' : ''} chậm nhất ${viDate(v.dueDate)}, bằng tiền mặt hoặc chuyển khoản vào tài khoản của Bên A.`)}
        ${art(4, 'Chậm trả nợ', rate > 0 ? 'Trường hợp Bên B không trả hoặc trả không đầy đủ khi đến hạn thì phải trả lãi trên nợ gốc quá hạn bằng 150% lãi suất vay theo hợp đồng tương ứng với thời gian chậm trả, trừ trường hợp có thỏa thuận khác (khoản 5 Điều 466 Bộ luật Dân sự).' : 'Trường hợp Bên B không trả hoặc trả không đầy đủ khi đến hạn thì Bên A có quyền yêu cầu trả lãi đối với số tiền chậm trả theo quy định tại khoản 4 Điều 466 Bộ luật Dân sự.')}
        ${art(5, 'Điều khoản thi hành', closingVi(2))}
        ${signBlock('BÊN VAY', 'BÊN CHO VAY')}</div>`;
      }
    },
    {
      id: 'uyquyen', category: 'Dân sự', name: 'Hợp đồng ủy quyền',
      law: `${BLDS} – Điều 562 (hợp đồng ủy quyền), Điều 563 (thời hạn ủy quyền)`,
      fields: [
        ...personFields('a', 'Bên ủy quyền'),
        ...personFields('b', 'Bên được ủy quyền'),
        { name: 'scope', label: 'Phạm vi ủy quyền (công việc cụ thể)', type: 'textarea', default: 'Thay mặt Bên A liên hệ cơ quan có thẩm quyền để nộp hồ sơ, nhận kết quả thủ tục …… và ký các giấy tờ liên quan.' },
        { name: 'term', label: 'Thời hạn ủy quyền (để trống = 01 năm theo Điều 563)', default: '06 tháng kể từ ngày ký' },
        { name: 'fee', label: 'Thù lao (đồng, để 0 nếu không có)', default: '0' },
        ...signFields
      ],
      render: (v) => `<div style="${DOC}">${nationalHeader}${title('HỢP ĐỒNG ỦY QUYỀN', `Căn cứ ${BLDS}`)}
        ${opening(v)}${personBlock('BÊN ỦY QUYỀN (Bên A)', v, 'a')}${personBlock('BÊN ĐƯỢC ỦY QUYỀN (Bên B)', v, 'b')}
        ${art(1, 'Phạm vi ủy quyền', nl(v.scope))}
        ${art(2, 'Thời hạn ủy quyền', v.term ? e(v.term) + '.' : '01 năm kể từ ngày xác lập việc ủy quyền (Điều 563 Bộ luật Dân sự).')}
        ${art(3, 'Thù lao', num(v.fee) ? `${money(v.fee)} đồng (Bằng chữ: ${moneyWords(v.fee)}).` : 'Việc ủy quyền không có thù lao.')}
        ${art(4, 'Quyền và nghĩa vụ của các bên', 'Bên B thực hiện công việc trong phạm vi ủy quyền, báo cho Bên A về việc thực hiện; không được ủy quyền lại nếu không được Bên A đồng ý. Bên A cung cấp thông tin, tài liệu cần thiết và chịu trách nhiệm về cam kết do Bên B thực hiện trong phạm vi ủy quyền.')}
        ${art(5, 'Công chứng, chứng thực', 'Trường hợp pháp luật quy định việc ủy quyền phải được công chứng hoặc chứng thực (ví dụ ủy quyền liên quan đến bất động sản), các bên có trách nhiệm thực hiện thủ tục này.')}
        ${art(6, 'Điều khoản thi hành', closingVi(2))}
        ${signBlock('BÊN ĐƯỢC ỦY QUYỀN', 'BÊN ỦY QUYỀN')}</div>`
    },
    {
      id: 'dichvu', category: 'Dịch vụ & Thương mại', name: 'Hợp đồng dịch vụ (freelancer, cộng tác viên)',
      law: `${BLDS} – Điều 513 trở đi (hợp đồng dịch vụ); khấu trừ thuế TNCN theo Nghị định 253/2026/NĐ-CP`,
      fields: [
        ...orgFields('a', 'Bên sử dụng dịch vụ'),
        ...orgFields('b', 'Bên cung ứng dịch vụ'),
        { name: 'scope', label: 'Nội dung công việc', type: 'textarea', default: 'Thiết kế và lập trình website giới thiệu doanh nghiệp gồm 05 trang.' },
        { name: 'fee', label: 'Tổng phí dịch vụ (đồng)', default: '20000000' },
        { name: 'deadline', label: 'Hạn bàn giao', type: 'date', default: today() },
        ...payFields,
        ...signFields
      ],
      render: (v) => `<div style="${DOC}">${nationalHeader}${title('HỢP ĐỒNG DỊCH VỤ', `Căn cứ ${BLDS}`)}
        ${opening(v)}${orgBlock('BÊN SỬ DỤNG DỊCH VỤ (Bên A)', v, 'a')}${orgBlock('BÊN CUNG ỨNG DỊCH VỤ (Bên B)', v, 'b')}
        ${art(1, 'Nội dung dịch vụ', nl(v.scope))}
        ${art(2, 'Thời hạn thực hiện', `Bên B bàn giao kết quả chậm nhất ${viDate(v.deadline)}. Hai bên lập biên bản nghiệm thu khi bàn giao.`)}
        ${art(3, 'Phí dịch vụ và thanh toán', `Tổng phí: <b>${money(v.fee)} đồng</b> (Bằng chữ: ${moneyWords(v.fee)}). Đợt 1: 50% sau khi ký hợp đồng; Đợt 2: 50% sau khi nghiệm thu.<br>Trường hợp Bên B là cá nhân, Bên A khấu trừ thuế thu nhập cá nhân 10% đối với khoản thanh toán từ 5.000.000 đồng/lần trở lên theo quy định hiện hành (Nghị định 253/2026/NĐ-CP), trừ trường hợp Bên B đủ điều kiện cam kết không khấu trừ.${vietQrPayBox(v, Math.round(num(v.fee) * 0.5), 'Tam ung 50% HD dich vu')}`)}
        ${art(4, 'Quyền sở hữu kết quả công việc', 'Sau khi Bên A thanh toán đủ phí dịch vụ, quyền sở hữu đối với kết quả công việc thuộc về Bên A, trừ trường hợp hai bên có thỏa thuận khác bằng văn bản.')}
        ${art(5, 'Bảo mật và đơn phương chấm dứt', 'Hai bên bảo mật thông tin của nhau. Mỗi bên có quyền đơn phương chấm dứt hợp đồng theo quy định của Bộ luật Dân sự và phải báo trước cho bên kia một thời gian hợp lý; Bên A thanh toán cho Bên B phần dịch vụ đã thực hiện.')}
        ${art(6, 'Điều khoản thi hành', closingVi(2))}
        ${signBlock('BÊN SỬ DỤNG DỊCH VỤ', 'BÊN CUNG ỨNG DỊCH VỤ')}</div>`
    },
    {
      id: 'baogia', category: 'Dịch vụ & Thương mại', name: 'Báo giá & Đề nghị thanh toán / Đặt cọc (kèm mã VietQR)',
      law: `${BLDS} – Đề nghị giao kết hợp đồng và xác nhận đặt cọc thanh toán`,
      fields: [
        ...orgFields('a', 'Đơn vị / Cá nhân gửi báo giá'),
        ...orgFields('b', 'Khách hàng / Đơn vị nhận báo giá'),
        { name: 'items', label: 'Hạng mục báo giá – mỗi dòng: Tên hạng mục | ĐVT | Số lượng | Đơn giá (đồng)', type: 'textarea', default: 'Thiết kế bộ nhận diện thương hiệu (Logo, Guideline) | Trọn gói | 1 | 12000000\nThiết kế giao diện Website / Portfolio chuẩn SEO | Trang | 5 | 1600000' },
        { name: 'depositPct', label: 'Tỷ lệ đặt cọc kích hoạt dự án (%)', type: 'number', default: '50' },
        { name: 'validDays', label: 'Hiệu lực báo giá (ngày)', type: 'number', default: '15' },
        ...payFields,
        ...signFields
      ],
      render: (v) => {
        const rows = lines(v.items).map((l) => l.split('|').map((x) => x.trim()));
        const total = rows.reduce((s, [, , q, p]) => s + num(q) * num(p), 0);
        const depPct = Math.max(10, Math.min(100, num(v.depositPct) || 50));
        const depAmt = Math.round((total * depPct) / 100);
        const td = 'border:1px solid #000;padding:5px 7px';
        return `<div style="${DOC}">${nationalHeader}${title('BẢNG BÁO GIÁ & ĐỀ NGHỊ TẠM ỨNG DỰ ÁN', `Ngày lập: ${viDate(v.signDate)}`)}
        ${orgBlock('ĐƠN VỊ CUNG CẤP DỊCH VỤ / BÁO GIÁ', v, 'a')}${orgBlock('KHÁCH HÀNG / ĐƠN VỊ NHẬN BÁO GIÁ', v, 'b')}
        ${art(1, 'Chi tiết hạng mục & chi phí', `<table style="width:100%;border-collapse:collapse;margin-top:6px;font-size:13px"><tr><th style="${td}">STT</th><th style="${td}">Hạng mục công việc / Sản phẩm</th><th style="${td}">ĐVT</th><th style="${td}">SL</th><th style="${td}">Đơn giá</th><th style="${td}">Thành tiền</th></tr>
          ${rows.map(([n, u, q, p], i) => `<tr><td style="${td};text-align:center">${i + 1}</td><td style="${td}">${e(n || '')}</td><td style="${td};text-align:center">${e(u || '')}</td><td style="${td};text-align:right">${fmtNum(num(q))}</td><td style="${td};text-align:right">${fmtNum(num(p))}</td><td style="${td};text-align:right">${fmtNum(num(q) * num(p))}</td></tr>`).join('')}
          <tr><td colspan="5" style="${td};text-align:right"><b>TỔNG CỘNG THANH TOÁN</b></td><td style="${td};text-align:right"><b>${fmtNum(total)} đ</b></td></tr>
          <tr><td colspan="5" style="${td};text-align:right"><b>Số tiền đặt cọc / tạm ứng đợt 1 (${depPct}%)</b></td><td style="${td};text-align:right"><b>${fmtNum(depAmt)} đ</b></td></tr></table>
          Bằng chữ (tổng cộng): ${moneyWords(total)}.`)}
        ${art(2, 'Phương thức thanh toán & Quét mã VietQR đặt cọc ngay', `Khách hàng xác nhận triển khai bằng cách chuyển khoản đặt cọc đợt 1 (${depPct}% tương đương <b>${fmtNum(depAmt)} đồng</b>). Báo giá có hiệu lực trong vòng ${num(v.validDays) || 15} ngày kể từ ngày lập.${vietQrPayBox(v, depAmt, 'Tam ung bao gia ' + (v.bName || ''))}`)}
        ${signBlock('XÁC NHẬN CỦA KHÁCH HÀNG', 'ĐƠN VỊ LẬP BÁO GIÁ')}</div>`;
      }
    },
    {
      id: 'muabanhh', category: 'Dịch vụ & Thương mại', name: 'Hợp đồng mua bán hàng hóa',
      law: `${LTM}; ${BLDS} – phạt vi phạm tối đa 8% (Điều 301 Luật Thương mại)`,
      fields: [
        ...orgFields('a', 'Bên bán'),
        ...orgFields('b', 'Bên mua'),
        { name: 'goods', label: 'Hàng hóa – mỗi dòng: Tên hàng | Đơn vị | Số lượng | Đơn giá (đồng)', type: 'textarea', default: 'Giấy in A4 Double A 80gsm | Thùng | 50 | 450000\nMực in HP 107A | Hộp | 20 | 650000' },
        { name: 'vat', label: 'Thuế GTGT (%)', type: 'number', default: '10' },
        { name: 'delivery', label: 'Địa điểm và thời hạn giao hàng', default: 'Tại kho Bên mua, chậm nhất 07 ngày kể từ ngày ký' },
        { name: 'penalty', label: 'Mức phạt vi phạm (%, tối đa 8%)', type: 'number', default: '8' },
        ...payFields,
        ...signFields
      ],
      render: (v) => {
        const items = lines(v.goods).map((l) => l.split('|').map((x) => x.trim()));
        const sub = items.reduce((s, [, , q, p]) => s + num(q) * num(p), 0);
        const vatPct = Math.max(0, Math.min(10, num(v.vat)));
        const vat = Math.round(sub * vatPct / 100);
        const pen = Math.min(8, Math.max(0, num(v.penalty)));
        const td = 'border:1px solid #000;padding:4px 6px';
        return `<div style="${DOC}">${nationalHeader}${title('HỢP ĐỒNG MUA BÁN HÀNG HÓA', `Căn cứ ${LTM}; ${BLDS}`)}
        ${opening(v)}${orgBlock('BÊN BÁN (Bên A)', v, 'a')}${orgBlock('BÊN MUA (Bên B)', v, 'b')}
        ${art(1, 'Hàng hóa, số lượng, giá', `<table style="width:100%;border-collapse:collapse;margin-top:6px;font-size:13px"><tr><th style="${td}">STT</th><th style="${td}">Tên hàng</th><th style="${td}">ĐVT</th><th style="${td}">Số lượng</th><th style="${td}">Đơn giá</th><th style="${td}">Thành tiền</th></tr>
          ${items.map(([n, u, q, p], i) => `<tr><td style="${td};text-align:center">${i + 1}</td><td style="${td}">${e(n || '')}</td><td style="${td}">${e(u || '')}</td><td style="${td};text-align:right">${fmtNum(num(q))}</td><td style="${td};text-align:right">${fmtNum(num(p))}</td><td style="${td};text-align:right">${fmtNum(num(q) * num(p))}</td></tr>`).join('')}
          <tr><td colspan="5" style="${td};text-align:right">Cộng tiền hàng</td><td style="${td};text-align:right">${fmtNum(sub)}</td></tr>
          <tr><td colspan="5" style="${td};text-align:right">Thuế GTGT ${vatPct}%</td><td style="${td};text-align:right">${fmtNum(vat)}</td></tr>
          <tr><td colspan="5" style="${td};text-align:right"><b>Tổng cộng</b></td><td style="${td};text-align:right"><b>${fmtNum(sub + vat)}</b></td></tr></table>
          Bằng chữ: ${moneyWords(sub + vat)}.`)}
        ${art(2, 'Chất lượng hàng hóa', 'Hàng mới 100%, đúng chủng loại, quy cách, có hóa đơn và chứng từ nguồn gốc hợp lệ.')}
        ${art(3, 'Giao nhận hàng', `${blank(v.delivery)}. Hai bên lập biên bản giao nhận khi giao hàng.`)}
        ${art(4, 'Thanh toán', `Bên B thanh toán bằng chuyển khoản trong vòng 07 ngày kể từ ngày nhận đủ hàng và hóa đơn giá trị gia tăng hợp lệ.${vietQrPayBox(v, sub + vat, 'Thanh toan HD mua ban')}`)}
        ${art(5, 'Phạt vi phạm và bồi thường thiệt hại', `Bên vi phạm nghĩa vụ hợp đồng chịu phạt ${pen}% giá trị phần nghĩa vụ bị vi phạm (không vượt quá 8% theo Điều 301 Luật Thương mại) và bồi thường thiệt hại thực tế phát sinh theo quy định.`)}
        ${art(6, 'Điều khoản thi hành', closingVi(2))}
        ${signBlock('ĐẠI DIỆN BÊN BÁN', 'ĐẠI DIỆN BÊN MUA')}</div>`;
      }
    },
    {
      id: 'hoptac', category: 'Dịch vụ & Thương mại', name: 'Hợp đồng hợp tác kinh doanh',
      law: `${BLDS} – Điều 504 trở đi (hợp đồng hợp tác)`,
      fields: [
        ...orgFields('a', 'Bên A'),
        ...orgFields('b', 'Bên B'),
        { name: 'purpose', label: 'Mục đích, nội dung hợp tác', type: 'textarea', default: 'Cùng góp vốn mở và vận hành cửa hàng cà phê tại địa chỉ ……' },
        { name: 'capitalA', label: 'Vốn góp Bên A (đồng)', default: '300000000' },
        { name: 'capitalB', label: 'Vốn góp Bên B (đồng)', default: '200000000' },
        { name: 'term', label: 'Thời hạn hợp tác', default: '03 năm kể từ ngày ký' },
        ...signFields
      ],
      render: (v) => {
        const a = num(v.capitalA), b = num(v.capitalB), t = a + b || 1;
        const pa = Math.round((a / t) * 1000) / 10, pb = Math.round((100 - pa) * 10) / 10;
        return `<div style="${DOC}">${nationalHeader}${title('HỢP ĐỒNG HỢP TÁC KINH DOANH', `Căn cứ ${BLDS}`)}
        ${opening(v)}${orgBlock('BÊN A', v, 'a')}${orgBlock('BÊN B', v, 'b')}
        ${art(1, 'Mục đích và nội dung hợp tác', nl(v.purpose))}
        ${art(2, 'Thời hạn hợp tác', blank(v.term))}
        ${art(3, 'Vốn góp', `Bên A góp ${money(a)} đồng (${String(pa).replace('.', ',')}%); Bên B góp ${money(b)} đồng (${String(pb).replace('.', ',')}%). Tổng vốn: ${money(a + b)} đồng (Bằng chữ: ${moneyWords(a + b)}).`)}
        ${art(4, 'Phân chia lợi nhuận và chịu rủi ro', 'Lợi nhuận và rủi ro được phân chia theo tỷ lệ vốn góp nêu tại Điều 3, trừ trường hợp các bên có thỏa thuận khác bằng văn bản. Việc quyết toán thực hiện hằng quý.')}
        ${art(5, 'Điều hành và quyết định', 'Các vấn đề quan trọng (vay vốn, thay đổi địa điểm, kết nạp thành viên mới, chấm dứt hợp tác) do các bên thống nhất quyết định. Mỗi bên có quyền được thông tin, kiểm tra sổ sách kế toán.')}
        ${art(6, 'Rút khỏi hợp đồng và chấm dứt', 'Việc rút khỏi hợp đồng hợp tác, chấm dứt hợp tác và phân chia tài sản chung thực hiện theo thỏa thuận và quy định của Bộ luật Dân sự về hợp đồng hợp tác.')}
        ${art(7, 'Điều khoản thi hành', closingVi(2))}
        ${signBlock('BÊN A', 'BÊN B')}</div>`;
      }
    },
    {
      id: 'baomat', category: 'Dịch vụ & Thương mại', name: 'Thỏa thuận bảo mật thông tin (NDA)',
      law: `${BLDS}; ${LSHTT} (bí mật kinh doanh)`,
      fields: [
        ...orgFields('a', 'Bên tiết lộ'),
        ...orgFields('b', 'Bên nhận thông tin'),
        { name: 'purpose', label: 'Mục đích trao đổi thông tin', default: 'Đánh giá khả năng hợp tác phát triển phần mềm quản lý bán hàng' },
        { name: 'years', label: 'Thời hạn bảo mật (năm)', type: 'number', default: '3' },
        ...signFields
      ],
      render: (v) => `<div style="${DOC}">${nationalHeader}${title('THỎA THUẬN BẢO MẬT THÔNG TIN', `Căn cứ ${BLDS}; ${LSHTT}`)}
        ${opening(v)}${orgBlock('BÊN TIẾT LỘ (Bên A)', v, 'a')}${orgBlock('BÊN NHẬN THÔNG TIN (Bên B)', v, 'b')}
        ${art(1, 'Mục đích', `Các bên trao đổi thông tin nhằm: ${blank(v.purpose)}.`)}
        ${art(2, 'Thông tin bảo mật', 'Là mọi thông tin kỹ thuật, tài chính, kinh doanh, khách hàng, bí mật kinh doanh do Bên A cung cấp dưới mọi hình thức, trừ thông tin: (a) đã được công bố công khai không do lỗi của Bên B; (b) Bên B đã có hợp pháp trước khi nhận; (c) phải cung cấp theo yêu cầu của cơ quan nhà nước có thẩm quyền.')}
        ${art(3, 'Nghĩa vụ của Bên B', 'Chỉ sử dụng thông tin cho mục đích nêu tại Điều 1; không tiết lộ cho bên thứ ba khi chưa có sự đồng ý bằng văn bản của Bên A; áp dụng biện pháp bảo vệ cần thiết; hoàn trả hoặc hủy tài liệu khi Bên A yêu cầu.')}
        ${art(4, 'Thời hạn', `Nghĩa vụ bảo mật có hiệu lực trong ${num(v.years) || '……'} năm kể từ ngày ký, kể cả khi quan hệ hợp tác chấm dứt.`)}
        ${art(5, 'Vi phạm', 'Bên vi phạm phải chấm dứt hành vi vi phạm và bồi thường toàn bộ thiệt hại thực tế phát sinh theo quy định của pháp luật.')}
        ${art(6, 'Điều khoản thi hành', closingVi(2))}
        ${signBlock('BÊN TIẾT LỘ', 'BÊN NHẬN THÔNG TIN')}</div>`
    }
  ].map((t) => ({ ...t, group: 'vn', basis: 'ref' }));
}

// =====================================================================
// VIETNAMESE LAW – English versions (for foreigners working/renting in Vietnam)
// =====================================================================
const enParty = (p, label) => [
  { name: `${p}Name`, label: `${label} – Name`, default: '' },
  { name: `${p}Id`, label: 'Passport / ID / Tax code', default: '' },
  { name: `${p}Address`, label: 'Address', default: '' }
];
const enPartyBlock = (head, v, p) => `<p style="margin:8px 0"><b>${head}</b><br>Name: <b>${blank(v[p + 'Name'], '____________')}</b><br>Passport / ID / Tax code: ${blank(v[p + 'Id'], '________')}<br>Address: ${blank(v[p + 'Address'], '____________')}</p>`;

function vnEnglish() {
  return [
    {
      id: 'employment', category: 'Lao động', name: 'Employment Contract (Vietnam law, English)',
      law: `${BLLD} – Articles 20, 21, 24–27`,
      fields: [
        ...enParty('a', 'Employer'), ...enParty('b', 'Employee'),
        { name: 'bDob', label: 'Employee date of birth', type: 'date', default: '' },
        { name: 'position', label: 'Position', default: 'Software Engineer' },
        { name: 'place', label: 'Place of work', default: '' },
        { name: 'months', label: 'Term in months (max 36; 0 = indefinite term)', type: 'number', default: '12' },
        { name: 'startDate', label: 'Start date', type: 'date', default: today() },
        { name: 'salary', label: 'Monthly salary (VND)', default: '25000000' },
        { name: 'hours', label: 'Working hours', default: '8 hours/day, 40 hours/week, Monday to Friday' },
        { name: 'signDate', label: 'Signing date', type: 'date', default: today() }
      ],
      render: (v) => {
        const m = Math.min(36, num(v.months));
        return `<div style="${DOC}">${title('EMPLOYMENT CONTRACT', `Pursuant to the Labour Code of Vietnam No. 45/2019/QH14`)}
        <p>This Contract is made on ${enDate(v.signDate)} between:</p>
        ${enPartyBlock('THE EMPLOYER', v, 'a')}${enPartyBlock('THE EMPLOYEE', v, 'b')}<p>Employee date of birth: ${v.bDob ? enDate(v.bDob) : '________'}</p>
        ${clause(1, 'Job and term', `Position: <b>${blank(v.position)}</b> at ${blank(v.place, 'the Employer’s premises')}. Contract type: ${m ? `definite term of ${m} months` : 'indefinite term'}, starting ${enDate(v.startDate)}.`)}
        ${clause(2, 'Salary', `Monthly salary <b>${money(v.salary, 'en')} VND</b> (${moneyWords(v.salary, 'en')}), paid by bank transfer before the 5th of the following month. Salary review according to the Employer’s pay regulations.`)}
        ${clause(3, 'Working time and rest', `${e(v.hours)}. Annual leave, public holidays and personal leave in accordance with the Labour Code.`)}
        ${clause(4, 'Insurance', 'Both parties participate in compulsory social insurance, health insurance and unemployment insurance at the statutory rates.')}
        ${clause(5, 'Protective equipment and training', 'The Employee is provided with personal protective equipment appropriate to the job and may attend training arranged by the Employer.')}
        ${clause(6, 'Probation', 'If a probation period is agreed, it must not exceed the maximum set by Article 25 of the Labour Code, probation pay must be at least 85% of the job’s salary (Article 26), and during probation either party may cancel without prior notice or compensation (Article 27).')}
        ${clause(7, 'Termination', 'Termination and unilateral termination follow Articles 34 to 37 of the Labour Code.')}
        ${clause(8, 'Governing law', 'This Contract is governed by the laws of the Socialist Republic of Vietnam and made in two counterparts of equal validity. If a Vietnamese version is signed, the Vietnamese version prevails.')}
        ${signBlock('EMPLOYEE', 'EMPLOYER', true)}</div>`;
      }
    },
    {
      id: 'lease', category: 'Nhà ở & Tài sản', name: 'Residential Lease (Vietnam law, English)',
      law: `${BLDS}; ${LNO}`,
      fields: [
        ...enParty('a', 'Landlord'), ...enParty('b', 'Tenant'),
        { name: 'property', label: 'Property address', default: '' },
        { name: 'rent', label: 'Monthly rent (VND)', default: '8000000' },
        { name: 'deposit', label: 'Security deposit (VND)', default: '16000000' },
        { name: 'term', label: 'Term (months)', type: 'number', default: '12' },
        { name: 'startDate', label: 'Start date', type: 'date', default: today() },
        { name: 'signDate', label: 'Signing date', type: 'date', default: today() }
      ],
      render: (v) => `<div style="${DOC}">${title('RESIDENTIAL LEASE AGREEMENT', 'Pursuant to the Civil Code No. 91/2015/QH13 and the Law on Housing No. 27/2023/QH15 of Vietnam')}
        <p>Dated ${enDate(v.signDate)}, between:</p>${enPartyBlock('LANDLORD', v, 'a')}${enPartyBlock('TENANT', v, 'b')}
        ${clause(1, 'Premises', `The property at <b>${blank(v.property)}</b>, for residential use.`)}
        ${clause(2, 'Term', `${num(v.term) || '__'} months from ${enDate(v.startDate)}, renewable by written agreement.`)}
        ${clause(3, 'Rent', `<b>${money(v.rent, 'en')} VND</b> per month (${moneyWords(v.rent, 'en')}), payable in advance by the 5th of each month. Utilities are paid by the Tenant at actual usage.`)}
        ${clause(4, 'Deposit', `<b>${money(v.deposit, 'en')} VND</b> (${moneyWords(v.deposit, 'en')}), refunded within 7 days after the lease ends, less unpaid amounts or repair costs caused by the Tenant.`)}
        ${clause(5, 'Obligations', 'The Landlord hands over the premises as agreed and carries out major repairs not caused by the Tenant. The Tenant pays on time, keeps the premises in good condition, does not sublet without consent, and complies with residence registration and fire-safety rules.')}
        ${clause(6, 'Early termination', 'A party terminating early must give at least 30 days’ written notice unless otherwise agreed, and compensates any resulting damage.')}
        ${clause(7, 'Governing law', 'Laws of the Socialist Republic of Vietnam. Two counterparts of equal validity.')}
        ${signBlock('LANDLORD', 'TENANT', true)}</div>`
    },
    {
      id: 'service', category: 'Dịch vụ & Thương mại', name: 'Service Agreement (Vietnam law, English)',
      law: `${BLDS} – Article 513 onwards`,
      fields: [
        ...enParty('a', 'Client'), ...enParty('b', 'Provider'),
        { name: 'scope', label: 'Scope of work', type: 'textarea', default: 'Design and develop a 5-page company website.' },
        { name: 'fee', label: 'Total fee (VND)', default: '30000000' },
        { name: 'deadline', label: 'Delivery date', type: 'date', default: today() },
        { name: 'signDate', label: 'Signing date', type: 'date', default: today() }
      ],
      render: (v) => `<div style="${DOC}">${title('SERVICE AGREEMENT', 'Pursuant to the Civil Code of Vietnam No. 91/2015/QH13')}
        <p>Dated ${enDate(v.signDate)}, between:</p>${enPartyBlock('CLIENT', v, 'a')}${enPartyBlock('PROVIDER', v, 'b')}
        ${clause(1, 'Services', nl(v.scope))}
        ${clause(2, 'Delivery', `No later than ${enDate(v.deadline)}, with a written acceptance record.`)}
        ${clause(3, 'Fee', `<b>${money(v.fee, 'en')} VND</b> (${moneyWords(v.fee, 'en')}): 50% on signing, 50% on acceptance. Where the Provider is an individual, the Client withholds 10% personal income tax on payments of VND 5,000,000 or more per payment as required by Decree 253/2026/ND-CP, unless an exemption commitment applies.`)}
        ${clause(4, 'Ownership', 'Upon full payment, ownership of the deliverables passes to the Client unless otherwise agreed in writing.')}
        ${clause(5, 'Confidentiality and termination', 'Both parties keep each other’s information confidential. Unilateral termination follows the Civil Code with reasonable prior notice; work performed is paid for.')}
        ${clause(6, 'Governing law', 'Laws of the Socialist Republic of Vietnam. Two counterparts of equal validity.')}
        ${signBlock('CLIENT', 'PROVIDER', true)}</div>`
    }
  ].map((t) => ({ ...t, group: 'vn', basis: 'ref' }));
}

// =====================================================================
// FOREIGN LAW – English, governing law chosen by the user
// =====================================================================
const JURIS = {
  'England and Wales': { law: 'the laws of England and Wales', courts: 'the courts of England and Wales', cur: 'GBP' },
  'Singapore': { law: 'the laws of the Republic of Singapore', courts: 'the courts of the Republic of Singapore', cur: 'SGD' },
  'New York, USA': { law: 'the laws of the State of New York, without regard to its conflict-of-laws rules', courts: 'the state and federal courts located in New York County, New York', cur: 'USD' },
  'California, USA': { law: 'the laws of the State of California, without regard to its conflict-of-laws rules', courts: 'the state and federal courts located in the State of California', cur: 'USD' },
  'Delaware, USA': { law: 'the laws of the State of Delaware, without regard to its conflict-of-laws rules', courts: 'the state and federal courts located in the State of Delaware', cur: 'USD' }
};
const jurisField = { name: 'juris', label: 'Governing law', type: 'select', options: Object.keys(JURIS), default: 'England and Wales' };
const J = (v) => JURIS[v.juris] || JURIS['England and Wales'];
const amt = (v, k) => `${J(v).cur} ${fmtNum(num(v[k]), 'en')}`;
const intlSign = (l, r) => signBlock(l, r, true);
const general = (v, n) => clause(n, 'Governing law and jurisdiction', `This Agreement is governed by ${J(v).law}. Each party submits to the exclusive jurisdiction of ${J(v).courts}.`) +
  clause(n + 1, 'Entire agreement', 'This Agreement is the entire agreement between the parties on its subject matter and may be amended only in writing signed by both parties. If any provision is held unenforceable, the remainder stays in effect.');

function intlContracts() {
  return [
    {
      id: 'intl-nda', category: 'Business', name: 'Mutual Non-Disclosure Agreement (NDA)',
      fields: [jurisField, ...enParty('a', 'Party A'), ...enParty('b', 'Party B'),
        { name: 'purpose', label: 'Purpose', default: 'evaluating a potential business relationship' },
        { name: 'years', label: 'Confidentiality period (years)', type: 'number', default: '3' },
        { name: 'signDate', label: 'Effective date', type: 'date', default: today() }],
      render: (v) => `<div style="${DOC}">${title('MUTUAL NON-DISCLOSURE AGREEMENT')}
        <p>This Agreement is made on ${enDate(v.signDate)} between:</p>${enPartyBlock('PARTY A', v, 'a')}${enPartyBlock('PARTY B', v, 'b')}
        ${clause(1, 'Purpose', `The parties wish to exchange Confidential Information for the purpose of ${e(v.purpose)} (the “Purpose”).`)}
        ${clause(2, 'Confidential Information', 'Means any non-public business, technical or financial information disclosed by one party (“Discloser”) to the other (“Recipient”), in any form, that is marked confidential or would reasonably be understood to be confidential.')}
        ${clause(3, 'Exclusions', 'Information that (a) is or becomes public other than through the Recipient’s breach; (b) was lawfully known to the Recipient before disclosure; (c) is independently developed without use of the Confidential Information; or (d) is lawfully received from a third party without restriction.')}
        ${clause(4, 'Obligations', 'The Recipient shall use Confidential Information only for the Purpose, protect it with at least reasonable care, and disclose it only to its employees and advisers who need to know it and are bound by equivalent obligations.')}
        ${clause(5, 'Compelled disclosure', 'The Recipient may disclose information required by law or court order, giving the Discloser prompt notice where legally permitted.')}
        ${clause(6, 'Term and return', `Obligations last ${num(v.years) || '__'} years from the effective date. On request, the Recipient shall return or destroy the Confidential Information.`)}
        ${clause(7, 'No licence', 'No licence or other right is granted except as expressly stated. Information is provided “as is”.')}
        ${clause(8, 'Remedies', 'Unauthorised disclosure may cause irreparable harm; the Discloser may seek injunctive relief in addition to other remedies.')}
        ${general(v, 9)}${intlSign('PARTY A', 'PARTY B')}</div>`
    },
    {
      id: 'intl-contractor', category: 'Business', name: 'Independent Contractor Agreement',
      fields: [jurisField, ...enParty('a', 'Client'), ...enParty('b', 'Contractor'),
        { name: 'scope', label: 'Services', type: 'textarea', default: 'Design and build a marketing website.' },
        { name: 'fee', label: 'Fee (amount, currency follows governing law)', default: '5000' },
        { name: 'terms', label: 'Payment terms', default: 'within 30 days of a valid invoice' },
        { name: 'signDate', label: 'Effective date', type: 'date', default: today() }],
      render: (v) => `<div style="${DOC}">${title('INDEPENDENT CONTRACTOR AGREEMENT')}
        <p>This Agreement is made on ${enDate(v.signDate)} between:</p>${enPartyBlock('CLIENT', v, 'a')}${enPartyBlock('CONTRACTOR', v, 'b')}
        ${clause(1, 'Services', nl(v.scope))}
        ${clause(2, 'Fees', `The Client shall pay <b>${amt(v, 'fee')}</b>, ${e(v.terms)}. The Contractor bears its own expenses unless pre-approved in writing.`)}
        ${clause(3, 'Independent status', 'The Contractor is an independent contractor, not an employee, worker or agent of the Client, controls the manner of performing the services, and is solely responsible for its own taxes, social contributions and insurance.')}
        ${clause(4, 'Intellectual property', 'Upon full payment, the Contractor assigns to the Client all rights in the deliverables created under this Agreement, excluding the Contractor’s pre-existing materials, which are licensed to the Client on a non-exclusive, perpetual basis as needed to use the deliverables.')}
        ${clause(5, 'Confidentiality', 'Each party keeps the other’s confidential information secret during and after this Agreement.')}
        ${clause(6, 'Termination', 'Either party may terminate on 14 days’ written notice, or immediately for material breach not remedied within 7 days of notice. The Client pays for services performed up to termination.')}
        ${clause(7, 'Liability', 'Except for breach of confidentiality or fraud, each party’s total liability is limited to the fees paid under this Agreement.')}
        ${general(v, 8)}${intlSign('CLIENT', 'CONTRACTOR')}</div>`
    },
    {
      id: 'intl-services', category: 'Business', name: 'Master Services Agreement (B2B)',
      fields: [jurisField, ...enParty('a', 'Customer'), ...enParty('b', 'Supplier'),
        { name: 'scope', label: 'Services', type: 'textarea', default: 'Monthly IT support and maintenance as described in Schedule 1.' },
        { name: 'fee', label: 'Monthly fee', default: '2000' },
        { name: 'months', label: 'Initial term (months)', type: 'number', default: '12' },
        { name: 'signDate', label: 'Effective date', type: 'date', default: today() }],
      render: (v) => `<div style="${DOC}">${title('MASTER SERVICES AGREEMENT')}
        <p>This Agreement is made on ${enDate(v.signDate)} between:</p>${enPartyBlock('CUSTOMER', v, 'a')}${enPartyBlock('SUPPLIER', v, 'b')}
        ${clause(1, 'Services', `${nl(v.scope)} The Supplier shall perform the services with reasonable skill and care and in accordance with good industry practice.`)}
        ${clause(2, 'Term', `An initial term of ${num(v.months) || '__'} months from the effective date, renewing automatically for successive 12-month periods unless either party gives 60 days’ written notice before renewal.`)}
        ${clause(3, 'Charges', `<b>${amt(v, 'fee')}</b> per month, invoiced monthly in advance and payable within 30 days. Amounts are exclusive of applicable sales taxes or VAT.`)}
        ${clause(4, 'Customer obligations', 'The Customer shall provide timely access, information and cooperation reasonably required by the Supplier.')}
        ${clause(5, 'Data protection', 'Each party shall comply with data protection laws applicable to it. Where the Supplier processes personal data on the Customer’s behalf, the parties shall enter into any data processing terms those laws require.')}
        ${clause(6, 'Termination', 'Either party may terminate immediately by written notice if the other commits a material breach not remedied within 30 days of notice, or becomes insolvent.')}
        ${clause(7, 'Limitation of liability', 'Neither party is liable for indirect or consequential loss. Each party’s total liability in any 12-month period is limited to the charges paid in that period, except for liability that cannot be limited by law.')}
        ${general(v, 8)}${intlSign('CUSTOMER', 'SUPPLIER')}</div>`
    },
    {
      id: 'intl-sale', category: 'Business', name: 'Sale of Goods Agreement',
      fields: [jurisField, ...enParty('a', 'Seller'), ...enParty('b', 'Buyer'),
        { name: 'goods', label: 'Goods description and quantity', type: 'textarea', default: '500 units of stainless steel water bottles, 750 ml, model SB-750.' },
        { name: 'price', label: 'Total price', default: '7500' },
        { name: 'delivery', label: 'Delivery terms', default: 'DAP Buyer’s warehouse (Incoterms® 2020), within 30 days' },
        { name: 'signDate', label: 'Date', type: 'date', default: today() }],
      render: (v) => `<div style="${DOC}">${title('SALE OF GOODS AGREEMENT')}
        <p>This Agreement is made on ${enDate(v.signDate)} between:</p>${enPartyBlock('SELLER', v, 'a')}${enPartyBlock('BUYER', v, 'b')}
        ${clause(1, 'Goods', nl(v.goods))}
        ${clause(2, 'Price and payment', `Total price <b>${amt(v, 'price')}</b>, exclusive of taxes unless stated. 30% on order, 70% within 15 days of delivery.`)}
        ${clause(3, 'Delivery and risk', `${e(v.delivery)}. Risk passes in accordance with the agreed delivery term; title passes on full payment.`)}
        ${clause(4, 'Inspection', 'The Buyer shall inspect the goods within 7 days of delivery and notify the Seller in writing of any non-conformity, failing which the goods are deemed accepted, except for latent defects.')}
        ${clause(5, 'Warranty', 'The Seller warrants that the goods conform to the description, are free from material defects for 12 months from delivery, and are sold with good title. Remedy: repair, replacement or refund at the Seller’s option.')}
        ${clause(6, 'Force majeure', 'Neither party is liable for delay caused by events beyond its reasonable control, provided it notifies the other promptly.')}
        ${general(v, 7)}${intlSign('SELLER', 'BUYER')}</div>`
    },
    {
      id: 'intl-loan', category: 'Personal', name: 'Personal Loan Agreement',
      fields: [jurisField, ...enParty('a', 'Lender'), ...enParty('b', 'Borrower'),
        { name: 'amount', label: 'Principal', default: '10000' },
        { name: 'rate', label: 'Interest rate (% per year, 0 = interest-free)', type: 'number', default: '5' },
        { name: 'dueDate', label: 'Repayment date', type: 'date', default: today() },
        { name: 'signDate', label: 'Date', type: 'date', default: today() }],
      render: (v) => `<div style="${DOC}">${title('PERSONAL LOAN AGREEMENT')}
        <p>This Agreement is made on ${enDate(v.signDate)} between:</p>${enPartyBlock('LENDER', v, 'a')}${enPartyBlock('BORROWER', v, 'b')}
        ${clause(1, 'Loan', `The Lender lends the Borrower <b>${amt(v, 'amount')}</b>, receipt of which the Borrower acknowledges.`)}
        ${clause(2, 'Interest', Number(v.rate) > 0 ? `Simple interest at ${e(v.rate)}% per year on the outstanding principal. The parties confirm this rate does not exceed any maximum permitted by applicable law; if it does, it is reduced to the maximum lawful rate.` : 'The loan is interest-free.')}
        ${clause(3, 'Repayment', `The Borrower shall repay the principal${Number(v.rate) > 0 ? ' and accrued interest' : ''} in full by ${enDate(v.dueDate)}. Early repayment is permitted without penalty.`)}
        ${clause(4, 'Default', 'If any amount is not paid when due and remains unpaid 14 days after written demand, the entire outstanding balance becomes immediately payable.')}
        ${general(v, 5)}${intlSign('BORROWER', 'LENDER')}</div>`
    },
    {
      id: 'intl-referral', category: 'Business', name: 'Referral / Affiliate Commission Agreement',
      fields: [jurisField, ...enParty('a', 'Company'), ...enParty('b', 'Referrer'),
        { name: 'percent', label: 'Commission (% of net revenue)', type: 'number', default: '10' },
        { name: 'months', label: 'Commission period per referred customer (months)', type: 'number', default: '12' },
        { name: 'signDate', label: 'Effective date', type: 'date', default: today() }],
      render: (v) => `<div style="${DOC}">${title('REFERRAL AGREEMENT')}
        <p>This Agreement is made on ${enDate(v.signDate)} between:</p>${enPartyBlock('COMPANY', v, 'a')}${enPartyBlock('REFERRER', v, 'b')}
        ${clause(1, 'Referrals', 'The Referrer may introduce prospective customers to the Company. A “Qualified Referral” is a customer first introduced by the Referrer, accepted by the Company and who signs a paid contract within 90 days of introduction.')}
        ${clause(2, 'Commission', `The Company pays ${num(v.percent)}% of net revenue received from each Qualified Referral for ${num(v.months) || '__'} months from that customer’s first payment, paid monthly in arrears with a statement.`)}
        ${clause(3, 'Conduct', 'The Referrer shall not make representations on the Company’s behalf beyond approved materials, shall comply with applicable advertising, anti-spam and anti-bribery laws, and shall clearly disclose its commercial relationship where required.')}
        ${clause(4, 'Status', 'The Referrer is an independent contractor and responsible for its own taxes.')}
        ${clause(5, 'Termination', 'Either party may terminate on 30 days’ written notice. Commission on Qualified Referrals made before termination remains payable for the commission period.')}
        ${general(v, 6)}${intlSign('COMPANY', 'REFERRER')}</div>`
    },
    {
      id: 'intl-offer-us', category: 'Employment', name: 'At-Will Employment Offer Letter (USA)',
      fields: [
        { name: 'juris', label: 'State', type: 'select', options: ['New York, USA', 'California, USA', 'Delaware, USA'], default: 'New York, USA' },
        { name: 'aName', label: 'Company name', default: '' }, { name: 'bName', label: 'Candidate name', default: '' },
        { name: 'position', label: 'Position', default: 'Product Designer' },
        { name: 'salary', label: 'Annual base salary (USD)', default: '95000' },
        { name: 'exempt', label: 'FLSA classification', type: 'select', options: ['Exempt', 'Non-exempt'], default: 'Exempt' },
        { name: 'startDate', label: 'Start date', type: 'date', default: today() },
        { name: 'signDate', label: 'Date', type: 'date', default: today() }],
      render: (v) => `<div style="${DOC}"><p>${enDate(v.signDate)}</p><p>Dear ${blank(v.bName, '________')},</p>
        <p>${blank(v.aName, 'The Company')} is pleased to offer you the position of <b>${blank(v.position)}</b> on the following terms.</p>
        ${clause(1, 'Start date', enDate(v.startDate))}
        ${clause(2, 'Compensation', `Annual base salary of <b>USD ${fmtNum(num(v.salary), 'en')}</b>, paid in accordance with the Company’s regular payroll and subject to applicable withholdings. This position is classified as <b>${e(v.exempt)}</b> under the Fair Labor Standards Act.`)}
        ${clause(3, 'Benefits', 'You will be eligible for the benefits the Company offers to similarly situated employees, subject to plan terms.')}
        ${clause(4, 'At-will employment', 'Your employment is at-will: either you or the Company may end it at any time, with or without cause or notice, to the extent permitted by applicable law. Only a written agreement signed by an authorized officer can change this.')}
        ${clause(5, 'Conditions', 'This offer is contingent on verification of your identity and authorization to work in the United States (Form I-9) and your signing the Company’s confidentiality and invention assignment agreement.')}
        ${clause(6, 'Governing law', `This letter is governed by ${J(v).law}.`)}
        <p>Please sign below to accept this offer.</p>${intlSign('CANDIDATE', 'FOR THE COMPANY')}</div>`
    }
  ].map((t) => ({ ...t, group: 'intl' }));
}

export function getTemplates(lang = 'vi') {
  const vi = lang === 'vi';
  const vn = vi ? [...vnContracts(), ...vnEnglish()] : [...vnEnglish(), ...vnContracts()];
  return [...cvTemplates(lang), ...vn, ...intlContracts()];
}
