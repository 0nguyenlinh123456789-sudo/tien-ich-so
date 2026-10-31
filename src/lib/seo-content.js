// Build-time content generator for programmatic SEO pages.
// Every page gets real pre-computed numbers rendered as static HTML (not just an empty tool).
import { calcSalary, TAX_CONFIG } from './salary.js';
import { compareLoans } from './loan.js';
import { simulateFire } from './fire.js';
import { numerologyProfile } from './numerology.js';
import { solarToLunar, napAm, monthDays, evaluateDay } from './lunar.js';
import { electricBill, ELECTRIC_TIERS } from './electric.js';
import { maternity, paternity, lumpSum, BASE_SALARY } from './bhxh.js';
import { moneyToWords } from './numwords.js';
import { fmtMoney, fmtNum, fmtPct } from './format.js';
import NUM from '../data/numerology.json';

const WD_VI = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
const WD_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * @returns {{ title: string, description: string, h1: string, intro: string[], table: [string,string][], faq: {q:string,a:string}[] }}
 */
export function buildRecordContent(record) {
  const lang = record.lang === 'en' ? 'en' : 'vi';
  const p = record.params || {};
  const vi = lang === 'vi';
  const m = (v) => fmtMoney(v, lang);
  let out;

  switch (record.tool) {
    case 'salary': {
      const r = calcSalary(p);
      const isNet = p.mode === 'net';
      const amountTxt = m(p.amount);
      const dep = Number(p.dependents) || 0;
      out = vi
        ? {
            h1: isNet ? `Lương Net ${amountTxt} thì Gross bao nhiêu? (${TAX_CONFIG.effectiveFrom.slice(0, 4)})` : `Lương Gross ${amountTxt} nhận Net bao nhiêu? (${TAX_CONFIG.effectiveFrom.slice(0, 4)})`,
            intro: [
              isNet
                ? `Để thực nhận <b>${m(r.net)}</b> mỗi tháng${dep ? ` với ${dep} người phụ thuộc` : ''} tại vùng ${p.region || 1}, mức lương Gross cần thỏa thuận là <b>${m(r.gross)}</b>.`
                : `Với mức lương Gross <b>${m(r.gross)}</b>/tháng${dep ? `, ${dep} người phụ thuộc` : ', không có người phụ thuộc'}, vùng ${p.region || 1}, bạn thực nhận <b>${m(r.net)}</b>/tháng.`,
              `Người lao động đóng bảo hiểm bắt buộc ${m(r.insurance)} (BHXH ${m(r.bhxh)}, BHYT ${m(r.bhyt)}, BHTN ${m(r.bhtn)}) và thuế TNCN ${m(r.pit)}. Thuế suất thực tế ${fmtPct(r.effectiveTaxRate, 'vi', 2)}, tỷ lệ thực nhận ${fmtPct(r.takeHomeRate, 'vi', 1)}.`,
              `Doanh nghiệp phải chi tổng cộng ${m(r.employerCost)} cho vị trí này (gồm ${m(r.employer.total)} bảo hiểm phần công ty đóng). Cách tính áp dụng giảm trừ gia cảnh ${fmtNum(TAX_CONFIG.personalDeduction)} đ/tháng cho bản thân, ${fmtNum(TAX_CONFIG.dependentDeduction)} đ/người phụ thuộc và biểu thuế lũy tiến 5 bậc.`
            ],
            table: [
              ['Lương Gross', m(r.gross)], ['BHXH 8%', m(r.bhxh)], ['BHYT 1,5%', m(r.bhyt)], ['BHTN 1%', m(r.bhtn)],
              ['Giảm trừ gia cảnh', m(r.personalDeduction + r.dependentDeduction)], ['Thu nhập tính thuế', m(r.assessable)],
              ['Thuế TNCN', m(r.pit)], ['Lương Net', m(r.net)], ['Thu nhập Net cả năm', m(r.net * 12)]
            ],
            faq: [
              { q: `Lương ${amountTxt} đóng bảo hiểm bao nhiêu?`, a: `Người lao động đóng ${m(r.insurance)}/tháng (10,5% trên lương đóng bảo hiểm, có áp trần).` },
              { q: `Lương ${amountTxt} có phải đóng thuế TNCN không?`, a: r.pit > 0 ? `Có, thuế TNCN là ${m(r.pit)}/tháng.` : `Không. Thu nhập tính thuế sau giảm trừ bằng 0 nên không phải nộp thuế TNCN.` }
            ]
          }
        : {
            h1: isNet ? `Net salary ${amountTxt}: what is the gross?` : `Gross salary ${amountTxt}: how much is take-home pay in Vietnam?`,
            intro: [
              isNet
                ? `To take home <b>${m(r.net)}</b> per month${dep ? ` with ${dep} dependent(s)` : ''}, the required gross salary is <b>${m(r.gross)}</b>.`
                : `A gross monthly salary of <b>${m(r.gross)}</b>${dep ? ` with ${dep} dependent(s)` : ''} results in a net income of <b>${m(r.net)}</b>.`,
              `Employee insurance is ${m(r.insurance)} and personal income tax is ${m(r.pit)} (effective rate ${fmtPct(r.effectiveTaxRate, 'en', 2)}).`,
              `Total employer cost: ${m(r.employerCost)}. Calculation uses the 2026 personal deduction of ${fmtNum(TAX_CONFIG.personalDeduction, 'en')} VND and the 5-bracket progressive tax.`
            ],
            table: [
              ['Gross', m(r.gross)], ['Social insurance 8%', m(r.bhxh)], ['Health insurance 1.5%', m(r.bhyt)], ['Unemployment 1%', m(r.bhtn)],
              ['Deductions', m(r.personalDeduction + r.dependentDeduction)], ['Assessable income', m(r.assessable)], ['PIT', m(r.pit)], ['Net', m(r.net)], ['Annual net', m(r.net * 12)]
            ],
            faq: [{ q: `How much tax on ${amountTxt}?`, a: `${m(r.pit)} per month.` }]
          };
      break;
    }
    case 'loan': {
      const c = compareLoans({ principal: p.principal, annualRate: p.rate, months: p.months, promoMonths: p.promoMonths || 0, promoRate: p.promoRate || 0 });
      const years = (Number(p.months) / 12).toLocaleString(vi ? 'vi-VN' : 'en-US', { maximumFractionDigits: 1 });
      out = vi
        ? {
            h1: `Vay ${m(p.principal)} trong ${years} năm, lãi suất ${p.rate}%/năm trả bao nhiêu mỗi tháng?`,
            intro: [
              `Khoản vay <b>${m(p.principal)}</b>, thời hạn ${p.months} tháng, lãi suất ${p.rate}%/năm: nếu trả theo <b>dư nợ giảm dần</b>, kỳ đầu bạn trả ${m(c.reducing.firstPayment)} và giảm dần còn ${m(c.reducing.lastPayment)} ở kỳ cuối; tổng lãi ${m(c.reducing.totalInterest)}.`,
              `Nếu trả theo <b>niên kim (trả đều)</b>, mỗi tháng trả cố định khoảng ${m(c.annuity.firstPayment)}, tổng lãi ${m(c.annuity.totalInterest)} – cao hơn ${m(c.annuity.totalInterest - c.reducing.totalInterest)} so với dư nợ giảm dần.`,
              `Theo nguyên tắc an toàn, khoản trả hằng tháng không nên vượt 40% thu nhập; tức thu nhập tối thiểu khoảng ${m(c.annuity.firstPayment / 0.4)}/tháng cho khoản vay này.`
            ],
            table: [
              ['Số tiền vay', m(p.principal)], ['Thời hạn', `${p.months} tháng`], ['Lãi suất', `${p.rate}%/năm`],
              ['Kỳ đầu (dư nợ giảm dần)', m(c.reducing.firstPayment)], ['Tổng lãi (dư nợ giảm dần)', m(c.reducing.totalInterest)],
              ['Trả đều (niên kim)', m(c.annuity.firstPayment)], ['Tổng lãi (niên kim)', m(c.annuity.totalInterest)]
            ],
            faq: [{ q: `Vay ${m(p.principal)} mỗi tháng trả bao nhiêu?`, a: `Từ ${m(c.annuity.firstPayment)} (trả đều) đến ${m(c.reducing.firstPayment)} kỳ đầu (dư nợ giảm dần).` }]
          }
        : {
            h1: `Borrow ${m(p.principal)} for ${years} years at ${p.rate}%: monthly payment`,
            intro: [
              `Declining balance: first payment ${m(c.reducing.firstPayment)}, total interest ${m(c.reducing.totalInterest)}.`,
              `Annuity: fixed payment ${m(c.annuity.firstPayment)}, total interest ${m(c.annuity.totalInterest)}.`,
              `Recommended minimum monthly income (40% rule): ${m(c.annuity.firstPayment / 0.4)}.`
            ],
            table: [['Principal', m(p.principal)], ['Term', `${p.months} months`], ['Rate', `${p.rate}%`], ['First payment (declining)', m(c.reducing.firstPayment)], ['Annuity payment', m(c.annuity.firstPayment)], ['Total interest (annuity)', m(c.annuity.totalInterest)]],
            faq: [{ q: `Monthly payment on ${m(p.principal)}?`, a: `${m(c.annuity.firstPayment)} with equal payments.` }]
          };
      break;
    }
    case 'fire': {
      const r = simulateFire(p);
      out = vi
        ? {
            h1: `Tiết kiệm ${m(p.monthly)}/tháng, lãi ${p.annualReturn}%/năm: bao giờ nghỉ hưu sớm?`,
            intro: [
              `Bắt đầu ở tuổi ${p.currentAge} với ${m(p.initial || 0)}, đầu tư đều ${m(p.monthly)} mỗi tháng, lợi nhuận ${p.annualReturn}%/năm, sau ${r.years} năm bạn có khoảng <b>${m(r.finalBalance)}</b>, trong đó tiền lãi kép là ${m(r.finalInterest)}.`,
              r.fireAge ? `Với chi tiêu ${m(p.annualExpenses)}/năm (giá hôm nay), lạm phát ${p.inflation}% và tỷ lệ rút ${p.withdrawalRate}%, bạn đạt tự do tài chính ở <b>tuổi ${r.fireAge}</b>.` : `Với mức chi tiêu ${m(p.annualExpenses)}/năm, kế hoạch hiện tại chưa đạt FIRE trong 70 năm – hãy tăng tiền đầu tư hoặc giảm chi tiêu.`,
              `Con số FIRE theo giá hôm nay là ${m(r.fireNumberToday)} (chi tiêu năm ÷ ${p.withdrawalRate}%).`
            ],
            table: [['Tiết kiệm/tháng', m(p.monthly)], ['Lợi nhuận', `${p.annualReturn}%/năm`], [`Tài sản sau ${r.years} năm`, m(r.finalBalance)], ['Tiền lãi kép', m(r.finalInterest)], ['Con số FIRE', m(r.fireNumberToday)], ['Tuổi FIRE', r.fireAge ? String(r.fireAge) : '—']],
            faq: [{ q: `Tiết kiệm ${m(p.monthly)} mỗi tháng sau ${r.years} năm được bao nhiêu?`, a: `Khoảng ${m(r.finalBalance)} với lợi nhuận ${p.annualReturn}%/năm.` }]
          }
        : {
            h1: `Invest ${m(p.monthly)}/month at ${p.annualReturn}%: when can you retire?`,
            intro: [
              `After ${r.years} years you would have about <b>${m(r.finalBalance)}</b> (${m(r.finalInterest)} from compounding).`,
              r.fireAge ? `You reach financial independence at <b>age ${r.fireAge}</b>.` : `FIRE is not reached within 70 years under these assumptions.`,
              `FIRE number in today’s money: ${m(r.fireNumberToday)}.`
            ],
            table: [['Monthly investment', m(p.monthly)], ['Return', `${p.annualReturn}%`], [`Wealth after ${r.years}y`, m(r.finalBalance)], ['FIRE number', m(r.fireNumberToday)], ['FIRE age', r.fireAge ? String(r.fireAge) : '—']],
            faq: [{ q: `How much will ${m(p.monthly)}/month grow to?`, a: `${m(r.finalBalance)} after ${r.years} years.` }]
          };
      break;
    }
    case 'numerology': {
      const [y, mo, d] = String(p.dob).split('-').map(Number);
      const r = numerologyProfile({ day: d, month: mo, year: y, targetYear: p.targetYear });
      const lunar = solarToLunar(d, mo, y);
      const na = napAm(lunar.year);
      const mean = NUM.numbers[String(r.lifePath)][lang];
      const py = NUM.personalYear[String(r.personalYear)][lang];
      out = vi
        ? {
            h1: `Sinh ngày ${d} tháng ${mo} năm ${y} mệnh gì? Thần số học & vận hạn ${p.targetYear}`,
            intro: [
              `Người sinh ngày ${d}/${mo}/${y} (âm lịch ${lunar.day}/${lunar.month}/${lunar.year}) là tuổi <b>${na.canChi}</b>, mệnh <b>${na.name}</b> (hành ${na.element}).`,
              `Theo Thần số học Pitago, con số chủ đạo là <b>${r.lifePath} – ${mean.title}</b> (${mean.keyword}). ${mean.strengths}`,
              `Năm ${p.targetYear} là <b>năm cá nhân số ${r.personalYear}</b>: ${py} Bốn đỉnh cao đời người rơi vào các tuổi ${r.peaks.map((x) => x.age).join(', ')}.`
            ],
            table: [['Âm lịch', `${lunar.day}/${lunar.month}/${lunar.year}`], ['Tuổi', na.canChi], ['Mệnh', `${na.name} (${na.element})`], ['Con số chủ đạo', String(r.lifePath)], ['Chỉ số ngày sinh', String(r.birthdayNumber)], [`Năm cá nhân ${p.targetYear}`, String(r.personalYear)], ['Các đỉnh cao (tuổi)', r.peaks.map((x) => `${x.age} (số ${x.number})`).join(', ')], ['Con số may mắn', r.luckyNumbers.join(', ')]],
            faq: [
              { q: `Sinh năm ${y} mệnh gì?`, a: `Người sinh năm âm lịch ${lunar.year} tuổi ${na.canChi}, mệnh ${na.name}.` },
              { q: `Sinh ngày ${d}/${mo}/${y} con số chủ đạo là mấy?`, a: `Con số chủ đạo là ${r.lifePath} – ${mean.title}.` }
            ]
          }
        : {
            h1: `Born ${d}/${mo}/${y}: numerology & ${p.targetYear} forecast`,
            intro: [
              `Lunar date ${lunar.day}/${lunar.month}/${lunar.year}, zodiac year <b>${na.canChi}</b>, element <b>${na.en}</b> (${na.elementEn}).`,
              `Life Path <b>${r.lifePath} – ${mean.title}</b>. ${mean.strengths}`,
              `${p.targetYear} is <b>Personal Year ${r.personalYear}</b>: ${py}`
            ],
            table: [['Lunar date', `${lunar.day}/${lunar.month}/${lunar.year}`], ['Element', `${na.en} (${na.elementEn})`], ['Life Path', String(r.lifePath)], [`Personal year ${p.targetYear}`, String(r.personalYear)], ['Pinnacle ages', r.peaks.map((x) => x.age).join(', ')], ['Lucky numbers', r.luckyNumbers.join(', ')]],
            faq: [{ q: `What is the life path for ${d}/${mo}/${y}?`, a: `${r.lifePath} – ${mean.title}.` }]
          };
      break;
    }
    case 'goodday': {
      const days = monthDays(Number(p.month), Number(p.year));
      const good = days.filter((x) => x.rating === 'good');
      const list = good.slice(0, 12).map((x) => `${(vi ? WD_VI : WD_EN)[x.weekday]} ${x.solar.day}/${x.solar.month} (${x.lunar.day}/${x.lunar.month} ${vi ? 'ÂL' : 'lunar'}, ${x.canChi.day})`);
      out = vi
        ? {
            h1: `Ngày tốt tháng ${p.month} năm ${p.year}${p.purpose && p.purpose !== 'general' ? ` để ${({ wedding: 'cưới hỏi', move: 'chuyển nhà', business: 'khai trương', travel: 'xuất hành', build: 'động thổ' })[p.purpose] || ''}` : ''}`,
            intro: [
              `Tháng ${p.month}/${p.year} có <b>${good.length} ngày hoàng đạo tốt</b> (không phạm Tam Nương, Nguyệt Kỵ): ${list.join('; ')}.`,
              `Hãy nhập năm sinh vào công cụ bên dưới để lọc thêm ngày hợp tuổi và tránh ngày xung tuổi (lục xung), đồng thời xem giờ hoàng đạo chi tiết từng ngày.`
            ],
            table: good.slice(0, 12).map((x) => [`${WD_VI[x.weekday]} ${x.solar.day}/${x.solar.month}`, `ÂL ${x.lunar.day}/${x.lunar.month} · ${x.canChi.day} · ${x.star.vi}`]),
            faq: [{ q: `Tháng ${p.month}/${p.year} có bao nhiêu ngày tốt?`, a: `${good.length} ngày hoàng đạo không phạm Tam Nương, Nguyệt Kỵ.` }]
          }
        : {
            h1: `Auspicious days in ${p.month}/${p.year}`,
            intro: [`${good.length} auspicious days: ${list.join('; ')}.`, `Enter your birth year below to exclude days that clash with your zodiac.`],
            table: good.slice(0, 12).map((x) => [`${WD_EN[x.weekday]} ${x.solar.day}/${x.solar.month}`, `Lunar ${x.lunar.day}/${x.lunar.month} · ${x.canChi.day} · ${x.star.en}`]),
            faq: [{ q: `How many good days in ${p.month}/${p.year}?`, a: `${good.length}.` }]
          };
      break;
    }
    case 'moneywords': {
      const cur = p.currency || 'VND';
      const words = moneyToWords(String(p.amount), cur, lang);
      const num = fmtNum(Number(p.amount), lang);
      out = vi
        ? {
            h1: `${num} ${cur === 'VND' ? 'đồng' : 'USD'} viết bằng chữ là gì?`,
            intro: [`Số tiền <b>${num} ${cur === 'VND' ? 'đ' : 'USD'}</b> viết bằng chữ: <b>${words}</b>.`, `Tiếng Anh: ${moneyToWords(String(p.amount), cur, 'en')}.`],
            table: [['Bằng số', num], ['Bằng chữ (VI)', words], ['Bằng chữ (EN)', moneyToWords(String(p.amount), cur, 'en')]],
            faq: [{ q: `${num} viết bằng chữ thế nào?`, a: words }]
          }
        : {
            h1: `${num} ${cur} in words`,
            intro: [`<b>${num} ${cur}</b> in words: <b>${words}</b>.`, `Vietnamese: ${moneyToWords(String(p.amount), cur, 'vi')}.`],
            table: [['Number', num], ['English', words], ['Vietnamese', moneyToWords(String(p.amount), cur, 'vi')]],
            faq: [{ q: `How to write ${num} in words?`, a: words }]
          };
      break;
    }
    case 'electric': {
      const k = Number(p.kwh);
      const r8 = electricBill(k, 0.08), r10 = electricBill(k, 0.1);
      const used = r8.rows.filter((x) => x.kwh > 0);
      const prev = electricBill(Math.max(0, k - 50), 0.08).total;
      out = {
        h1: `${k} kWh điện bao nhiêu tiền?`,
        intro: [
          `Dùng <b>${k} kWh</b> điện sinh hoạt trong tháng, tiền điện là <b>${m(r8.total)}</b> (thuế GTGT 8%) hoặc <b>${m(r10.total)}</b> (thuế 10%). Chưa thuế: ${m(r8.subtotal)}, bình quân ${fmtNum(Math.round(r8.total / k))} đ/kWh.`,
          `Lượng điện này rơi vào <b>bậc ${used.length}</b> trong biểu giá 6 bậc (Quyết định 1279/QĐ-BCT, từ 10/5/2025). ${k > 50 ? `Nếu bớt 50 kWh, hóa đơn giảm khoảng ${m(r8.total - prev)}.` : ''}`,
          k > 400 ? `Phần vượt 400 kWh bị tính giá cao nhất ${fmtNum(ELECTRIC_TIERS[5].price)} đ/kWh, gần gấp 1,75 lần bậc 1 – máy lạnh, bình nóng lạnh là nguyên nhân thường gặp.` : `Một máy lạnh 1 HP chạy 8 giờ/ngày thường tiêu thụ khoảng 150–250 kWh/tháng tùy loại; dùng máy Inverter và để 26–27°C giúp giảm đáng kể.`
        ],
        table: used.map((x) => [`Bậc ${x.tier}: ${fmtNum(x.kwh)} kWh × ${fmtNum(x.price)} đ`, m(x.amount)]).concat([['Thuế GTGT 8%', m(r8.tax)], ['Tổng cộng', m(r8.total)]]),
        faq: [
          { q: `${k} số điện hết bao nhiêu tiền?`, a: `Khoảng ${m(r8.total)} gồm thuế 8%, theo giá điện sinh hoạt bậc thang hiện hành.` },
          { q: 'Giá điện tính theo bậc như thế nào?', a: '50 kWh đầu giá 1.984 đ, 51–100: 2.050 đ, 101–200: 2.380 đ, 201–300: 2.998 đ, 301–400: 3.350 đ, từ 401: 3.460 đ (chưa thuế).' }
        ]
      };
      break;
    }
    case 'bmi': {
      const h = Number(p.h), w = Number(p.w), hm = h / 100;
      const bmi = w / (hm * hm);
      const BANDS = [[18.5, 'Thiếu cân', 'Underweight'], [23, 'Bình thường', 'Normal'], [25, 'Thừa cân', 'Overweight'], [30, 'Béo phì độ I', 'Obese I'], [99, 'Béo phì độ II', 'Obese II']];
      const band = BANDS.find((b) => bmi < b[0]);
      const lo = 18.5 * hm * hm, hi = 22.9 * hm * hm;
      const diff = w > hi ? w - hi : w < lo ? lo - w : 0;
      const tdeeM = Math.round((10 * w + 6.25 * h - 5 * 30 + 5) * 1.375), tdeeF = Math.round((10 * w + 6.25 * h - 5 * 30 - 161) * 1.375);
      out = vi
        ? {
            h1: `Cao ${h}cm nặng ${w}kg có béo không?`,
            intro: [
              `Chiều cao ${h} cm, cân nặng ${w} kg có chỉ số <b>BMI ${bmi.toFixed(1)}</b>, thuộc nhóm <b>${band[1]}</b> theo ngưỡng cho người châu Á (WHO khu vực Tây Thái Bình Dương).`,
              `Cân nặng hợp lý cho người cao ${h} cm là <b>${lo.toFixed(0)}–${hi.toFixed(0)} kg</b>. ${diff ? `Bạn cần ${w > hi ? 'giảm' : 'tăng'} khoảng <b>${diff.toFixed(1)} kg</b> để vào mức bình thường.` : 'Bạn đang ở mức cân nặng bình thường.'}`,
              `Lượng calo để giữ cân (30 tuổi, vận động nhẹ): khoảng ${fmtNum(tdeeM)} kcal/ngày với nam, ${fmtNum(tdeeF)} kcal/ngày với nữ. Nhập tuổi và mức vận động thật của bạn ở công cụ bên dưới để tính chính xác hơn.`
            ],
            table: [['BMI', bmi.toFixed(1)], ['Phân loại (châu Á)', band[1]], ['Cân nặng chuẩn', `${lo.toFixed(0)}–${hi.toFixed(0)} kg`], ['Calo giữ cân (nam/nữ, 30 tuổi)', `${fmtNum(tdeeM)} / ${fmtNum(tdeeF)} kcal`]],
            faq: [{ q: `Cao ${h}cm nặng bao nhiêu là chuẩn?`, a: `Khoảng ${lo.toFixed(0)}–${hi.toFixed(0)} kg (BMI 18,5–22,9).` }, { q: 'BMI có đủ để biết béo hay không?', a: 'Không hoàn toàn: BMI không phân biệt cơ và mỡ. Hãy đo thêm vòng eo – nam trên 90 cm, nữ trên 80 cm là dấu hiệu mỡ bụng (ngưỡng châu Á).' }]
          }
        : {
            h1: `BMI for ${h} cm and ${w} kg`,
            intro: [`At ${h} cm and ${w} kg your <b>BMI is ${bmi.toFixed(1)}</b>: <b>${band[2]}</b> on Asian cut-offs (WHO Western Pacific).`, `A healthy weight for ${h} cm is <b>${lo.toFixed(0)}–${hi.toFixed(0)} kg</b>${diff ? `; that is ${diff.toFixed(1)} kg ${w > hi ? 'less' : 'more'} than now` : ''}.`],
            table: [['BMI', bmi.toFixed(1)], ['Category (Asian)', band[2]], ['Healthy weight', `${lo.toFixed(0)}–${hi.toFixed(0)} kg`]],
            faq: [{ q: `What is a healthy weight at ${h} cm?`, a: `${lo.toFixed(0)}–${hi.toFixed(0)} kg.` }]
          };
      break;
    }
    case 'forms': {
      const K = {
        nghiviec: { name: p.alias || 'đơn xin nghỉ việc', parts: ['Quốc hiệu, tiêu ngữ', 'Kính gửi: Ban Giám đốc / Phòng Nhân sự', 'Họ tên, chức vụ, bộ phận', 'Ngày nghỉ việc dự kiến', 'Lý do nghỉ', 'Cam kết bàn giao công việc', 'Ngày tháng, chữ ký'] },
        nghiphep: { name: 'đơn xin nghỉ phép', parts: ['Quốc hiệu, tiêu ngữ', 'Kính gửi: Trưởng bộ phận / Ban Giám đốc', 'Họ tên, chức vụ, bộ phận', 'Nghỉ từ ngày … đến ngày …', 'Lý do', 'Người nhận bàn giao', 'Ngày tháng, chữ ký'] },
        nghihoc: { name: 'đơn xin nghỉ học', parts: ['Quốc hiệu, tiêu ngữ', 'Kính gửi: Giáo viên chủ nhiệm', 'Họ tên học sinh, lớp, trường', 'Nghỉ từ ngày … đến ngày …', 'Lý do', 'Cam kết chép bài', 'Chữ ký học sinh và phụ huynh'] },
        uyquyen: { name: 'giấy ủy quyền', parts: ['Quốc hiệu, tiêu ngữ', 'Thông tin người ủy quyền (họ tên, CCCD)', 'Thông tin người được ủy quyền', 'Nội dung, phạm vi ủy quyền', 'Thời hạn ủy quyền', 'Cam kết trách nhiệm', 'Chữ ký người ủy quyền'] },
        emailcv: { name: 'email gửi CV', parts: ['Tiêu đề: [Ứng tuyển] Vị trí – Họ tên', 'Lời chào đúng người nhận', 'Vị trí ứng tuyển và nguồn tin', 'Kinh nghiệm nổi bật (2–3 câu)', 'Ngày có thể bắt đầu', 'Nhắc file CV đính kèm', 'Chữ ký: họ tên, số điện thoại'] },
        xinviec: { name: 'đơn xin việc', parts: ['Quốc hiệu, tiêu ngữ', 'Kính gửi: Phòng Nhân sự công ty', 'Họ tên, ngày sinh', 'Vị trí ứng tuyển, nguồn tin tuyển dụng', 'Kinh nghiệm, kỹ năng nổi bật', 'Ngày có thể bắt đầu', 'Chữ ký, hồ sơ đính kèm'] }
      }[p.kind];
      const notice = p.kind === 'nghiviec'
        ? [`<b>Phải báo trước bao lâu?</b> Theo Điều 35 Bộ luật Lao động 2019: ít nhất <b>45 ngày</b> với hợp đồng không xác định thời hạn, <b>30 ngày</b> với hợp đồng 12–36 tháng, <b>3 ngày làm việc</b> với hợp đồng dưới 12 tháng. Một số ngành nghề đặc thù có thời hạn riêng.`,
           `Có trường hợp được nghỉ <b>không cần báo trước</b>, ví dụ: không được trả lương đủ, đúng hạn; bị ngược đãi, quấy rối; không được bố trí đúng công việc, địa điểm đã thỏa thuận (khoản 2 Điều 35).`]
        : p.kind === 'nghiphep'
          ? [`Người lao động làm đủ 12 tháng được nghỉ hằng năm hưởng nguyên lương ít nhất <b>12 ngày làm việc</b> (Điều 113 Bộ luật Lao động 2019); điều kiện nặng nhọc, độc hại được nhiều hơn.`]
          : [];
      out = {
        h1: record.title,
        intro: [
          `Điền thông tin ở công cụ bên dưới, ${K.name} hiện ngay theo đúng bố cục, rồi bấm <b>In / Lưu PDF</b>. Không cần đăng ký, dữ liệu không rời máy bạn.`,
          ...notice,
          `Pháp luật không bắt buộc một mẫu cố định cho ${K.name}; điều quan trọng là nội dung rõ ràng, có ngày và chữ ký. Nếu công ty, nhà trường có mẫu riêng, hãy dùng mẫu đó.`
        ],
        table: K.parts.map((x, i) => [`Phần ${i + 1}`, x]),
        faq: p.kind === 'nghiviec'
          ? [{ q: 'Xin nghỉ việc phải báo trước bao nhiêu ngày?', a: '45 ngày (HĐ không xác định thời hạn), 30 ngày (HĐ 12–36 tháng), 3 ngày làm việc (HĐ dưới 12 tháng) – Điều 35 Bộ luật Lao động 2019.' }, { q: 'Đơn xin nghỉ việc có cần viết tay không?', a: 'Không bắt buộc. Đơn đánh máy có chữ ký đều hợp lệ; chỉ cần thể hiện rõ ngày nghỉ và được gửi cho người sử dụng lao động.' }]
          : [{ q: `${K.name[0].toUpperCase() + K.name.slice(1)} gồm những nội dung gì?`, a: K.parts.join('; ') + '.' }]
      };
      break;
    }
    case 'lunar': {
      if (!p.d) {
      const mm = Number(p.m), yy = Number(p.y);
      const days = monthDays(mm, yy);
      const first = days[0], last = days[days.length - 1];
      const good = days.filter((x) => x.star.good).map((x) => x.solar.day);
      const special = days.filter((x) => x.lunar.day === 1 || x.lunar.day === 15).map((x) => `${x.solar.day}/${mm} (${x.lunar.day === 1 ? 'mùng 1' : 'rằm'} tháng ${x.lunar.month}${x.lunar.leap ? ' nhuận' : ''})`);
      out = {
        h1: `Lịch âm tháng ${mm} năm ${yy} – Lịch vạn niên`,
        intro: [
          `Tháng ${mm}/${yy} dương lịch bắt đầu ngày <b>${first.lunar.day}/${first.lunar.month}${first.lunar.leap ? ' nhuận' : ''}</b> và kết thúc ngày <b>${last.lunar.day}/${last.lunar.month}${last.lunar.leap ? ' nhuận' : ''}</b> âm lịch, năm ${first.canChi.year}${first.canChi.year !== last.canChi.year ? ` – ${last.canChi.year}` : ''}.`,
          special.length ? `Ngày mùng 1 và rằm trong tháng: ${special.join('; ')}.` : '',
          `Ngày hoàng đạo: ${good.join(', ')}. Bảng dưới liệt kê ngày âm, can chi và ngày hoàng đạo/hắc đạo của cả tháng.`
        ].filter(Boolean),
        table: days.map((x) => [`${WD_VI[x.weekday]} ${x.solar.day}/${mm}`, `${x.lunar.day}/${x.lunar.month}${x.lunar.leap ? 'N' : ''} · ${x.canChi.day} · ${x.star.good ? 'Hoàng đạo' : 'Hắc đạo'}`]),
        faq: [{ q: `Ngày 1/${mm}/${yy} là bao nhiêu âm?`, a: `Ngày ${first.lunar.day} tháng ${first.lunar.month}${first.lunar.leap ? ' nhuận' : ''} năm ${first.canChi.year}.` }, ...(special.length ? [{ q: `Rằm, mùng 1 tháng này vào ngày nào?`, a: special.join('; ') + '.' }] : [])]
      };
      break;
    }
      const e = evaluateDay(Number(p.d), Number(p.m), Number(p.y));
      const l = e.lunar;
      const leap = l.leap ? ' (nhuận)' : '';
      out = {
        h1: `Lịch âm ngày ${p.d}/${p.m}/${p.y}`,
        intro: [
          `${WD_VI[e.weekday]}, ngày ${p.d}/${p.m}/${p.y} dương lịch là <b>ngày ${l.day} tháng ${l.month}${leap} năm ${e.canChi.year}</b> âm lịch.`,
          `Ngày ${e.canChi.day}, tháng ${e.canChi.month}. Đây là ngày <b>${e.star.good ? 'hoàng đạo' : 'hắc đạo'}</b> (sao ${e.star.vi})${e.notes.some((n) => n.key === 'tamNuong') ? ', phạm Tam Nương' : ''}${e.notes.some((n) => n.key === 'nguyetKy') ? ', phạm Nguyệt Kỵ' : ''}${l.day === 1 ? ' – mùng 1 âm lịch' : l.day === 15 ? ' – ngày rằm' : ''}.`,
          `Giờ hoàng đạo: ${e.hours.map((x) => `${x.name} (${x.range})`).join(', ')}.`
        ],
        table: [['Dương lịch', `${WD_VI[e.weekday]}, ${p.d}/${p.m}/${p.y}`], ['Âm lịch', `${l.day}/${l.month}${leap}/${l.year}`], ['Can chi ngày', e.canChi.day], ['Can chi tháng', e.canChi.month], ['Năm', e.canChi.year], ['Ngày', e.star.good ? 'Hoàng đạo' : 'Hắc đạo']],
        faq: [{ q: `Ngày ${p.d}/${p.m}/${p.y} là bao nhiêu âm?`, a: `Ngày ${l.day} tháng ${l.month}${leap} năm ${e.canChi.year}.` }, { q: `Ngày ${p.d}/${p.m}/${p.y} có tốt không?`, a: `Là ngày ${e.star.good ? 'hoàng đạo' : 'hắc đạo'}. Thông tin mang tính tham khảo văn hóa.` }]
      };
      break;
    }
    case 'savings': {
      const P = Number(p.p), t = Number(p.t), r = Number(p.r);
      const once = (P * r / 100 * t) / 12;
      const terms = Math.floor(12 / t) || 1;
      let bal = P; for (let i = 0; i < Math.max(terms, 1); i++) bal += (bal * r / 100 * t) / 12;
      const rTxt = String(r).replace('.', ',');
      out = {
        h1: `Gửi ${m(P)} kỳ hạn ${t} tháng, lãi ${rTxt}%/năm được bao nhiêu?`,
        intro: [
          `Gửi tiết kiệm <b>${m(P)}</b> kỳ hạn ${t} tháng với lãi suất ${rTxt}%/năm, đến hạn bạn nhận <b>${m(once)}</b> tiền lãi, tổng cộng ${m(P + once)}.`,
          `Tương đương khoảng <b>${m(once / t)}</b> tiền lãi mỗi tháng. ${t < 12 ? `Nếu đáo hạn tự gửi lại cả gốc lẫn lãi trong 12 tháng, bạn nhận khoảng ${m(bal - P)} (lãi kép).` : ''}`,
          `Công thức: tiền gửi × lãi suất năm × số tháng ÷ 12. Lãi suất thực tế khác nhau giữa các ngân hàng và hình thức gửi online/tại quầy.`
        ],
        table: [['Tiền gửi', m(P)], ['Kỳ hạn', `${t} tháng`], ['Lãi suất', `${rTxt}%/năm`], ['Tiền lãi cuối kỳ', m(once)], ['Lãi bình quân/tháng', m(once / t)]],
        faq: [{ q: `${m(P)} gửi ${t} tháng lãi bao nhiêu?`, a: `${m(once)} với lãi suất ${rTxt}%/năm.` }]
      };
      break;
    }
    case 'maternity': {
      const r = maternity({ avg: Number(p.avg) });
      const d = paternity({ avg: Number(p.avg) });
      out = {
        h1: `Lương ${m(p.avg)} sinh con được bao nhiêu tiền thai sản?`,
        intro: [
          `Với mức lương đóng BHXH bình quân <b>${m(p.avg)}</b>/tháng trong 6 tháng trước khi nghỉ, mẹ sinh một con nhận khoảng <b>${m(r.total)}</b>.`,
          `Gồm: tiền nghỉ 6 tháng ${m(r.leavePay)} (100% lương bình quân mỗi tháng) và trợ cấp một lần ${m(r.lump)} (2 lần mức tham chiếu ${m(BASE_SALARY)}).`,
          `Nếu người bố có cùng mức lương đóng BHXH, khi vợ sinh thường bố được nghỉ 5 ngày làm việc và nhận khoảng ${m(d.amount)}.`
        ],
        table: [['Nghỉ 6 tháng', m(r.leavePay)], ['Trợ cấp 1 lần', m(r.lump)], ['Tổng mẹ nhận', m(r.total)], ['Bố nghỉ 5 ngày', m(d.amount)]],
        faq: [{ q: 'Điều kiện hưởng thai sản?', a: 'Đóng BHXH bắt buộc đủ 6 tháng trở lên trong 12 tháng trước khi sinh (Luật BHXH 2024).' }, { q: 'Sinh đôi được thêm bao nhiêu?', a: 'Mỗi con từ con thứ hai được nghỉ thêm 1 tháng và thêm một khoản trợ cấp 1 lần.' }]
      };
      break;
    }
    case 'lumpsum': {
      const r = lumpSum({ avg: Number(p.avg), yAfter: Number(p.years) });
      out = {
        h1: `Đóng BHXH ${p.years} năm, lương ${m(p.avg)} rút 1 lần được bao nhiêu?`,
        intro: [
          `Đóng BHXH <b>${p.years} năm</b> (từ năm 2014 trở đi) với lương bình quân ${m(p.avg)}, mức hưởng BHXH một lần ước tính <b>${m(r.amount)}</b>, tương đương ${r.months} tháng lương.`,
          `Theo khoản 3 Điều 70 Luật BHXH 2024: mỗi năm đóng từ 2014 được 2 tháng lương bình quân (trước 2014 là 1,5 tháng). Lương bình quân thực tế được điều chỉnh theo hệ số trượt giá nên số tiền nhận có thể cao hơn.`,
          `Cân nhắc trước khi rút: nếu tiếp tục đóng đủ 15 năm, bạn được hưởng lương hưu hằng tháng và thẻ BHYT khi về hưu.`
        ],
        table: [['Số năm đóng', `${p.years} năm`], ['Lương bình quân', m(p.avg)], ['Số tháng hưởng', `${r.months} tháng`], ['Ước tính nhận', m(r.amount)]],
        faq: [{ q: `${p.years} năm BHXH rút được bao nhiêu?`, a: `Khoảng ${r.months} tháng lương bình quân; với lương ${m(p.avg)} là ${m(r.amount)}.` }]
      };
      break;
    }
    case 'convert': {
      const v = Number(p.v);
      const n2 = (x, d = 2) => x.toLocaleString(vi ? 'vi-VN' : 'en-US', { maximumFractionDigits: d });
      let h1, intro, table, faq;
      if (p.kind === 'cm') {
        const tin = v / 2.54, ft = Math.floor(tin / 12), inch = tin % 12;
        h1 = vi ? `${v} cm là bao nhiêu feet, inch?` : `${v} cm in feet and inches`;
        intro = [vi ? `<b>${v} cm = ${ft} feet ${n2(inch, 1)} inch</b> (${ft}′${n2(inch, 1)}″), tương đương ${n2(tin, 2)} inch hoặc ${n2(v / 30.48, 3)} feet.` : `<b>${v} cm = ${ft} ft ${n2(inch, 1)} in</b> (${ft}′${n2(inch, 1)}″), or ${n2(tin)} inches / ${n2(v / 30.48, 3)} feet.`,
          vi ? `Cách tính: chia cho 2,54 để ra inch, rồi chia 12 để ra feet; phần dư là inch.` : `Divide by 2.54 to get inches, then by 12 for feet; the remainder is inches.`];
        table = [[-4, -2, 0, 2, 4].map((d) => v + d)].flat().map((c) => { const t = c / 2.54; return [`${c} cm`, `${Math.floor(t / 12)}′ ${n2(t % 12, 1)}″`]; });
        faq = [{ q: vi ? `Cao ${v} cm là bao nhiêu feet?` : `How tall is ${v} cm in feet?`, a: `${ft}′${n2(inch, 1)}″` }];
      } else if (p.kind === 'kg' || p.kind === 'lb') {
        const kg = p.kind === 'kg' ? v : v * 0.45359237, lb = kg / 0.45359237;
        h1 = p.kind === 'kg' ? `${v} kg to lbs` : `${v} lbs to kg`;
        intro = [p.kind === 'kg' ? `<b>${v} kg = ${n2(lb, 2)} lbs</b> (${Math.floor(lb)} lb ${n2((lb % 1) * 16, 1)} oz).` : `<b>${v} lbs = ${n2(kg, 2)} kg</b>.`, `1 lb is exactly 0.45359237 kg, so 1 kg ≈ 2.2046 lb.`];
        table = [-10, -5, 0, 5, 10].map((d) => v + d).map((x) => p.kind === 'kg' ? [`${x} kg`, `${n2(x / 0.45359237)} lbs`] : [`${x} lbs`, `${n2(x * 0.45359237)} kg`]);
        faq = [{ q: p.kind === 'kg' ? `How many pounds is ${v} kg?` : `How many kg is ${v} lbs?`, a: p.kind === 'kg' ? `${n2(lb)} lbs` : `${n2(kg)} kg` }];
      } else {
        const c = (v - 32) * 5 / 9;
        h1 = `${v}°F to °C`;
        intro = [`<b>${v}°F = ${n2(c, 1)}°C</b>.`, `Formula: °C = (°F − 32) × 5/9. ${v >= 98 && v <= 104 ? 'Body temperature above 100.4°F (38°C) is generally considered a fever.' : ''}`];
        table = [-10, -5, 0, 5, 10].map((d) => v + d).map((x) => [`${x}°F`, `${n2((x - 32) * 5 / 9, 1)}°C`]);
        faq = [{ q: `What is ${v}°F in Celsius?`, a: `${n2(c, 1)}°C` }];
      }
      out = { h1, intro, table, faq };
      break;
    }
    default:
      out = { h1: record.title || record.slug, intro: [record.description || ''], table: [], faq: [] };
  }

  return {
    title: record.title || out.h1,
    description: record.description || out.intro.join(' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 155),
    ...out
  };
}

