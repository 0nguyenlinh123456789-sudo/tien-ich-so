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
import { retirementAge } from './retirement-age.js';
import { registrationFee } from './registration-fee.js';
import { hourlyWage, nightRate, OT_RATES } from './overtime.js';
import { waterBill, WATER_REGIONS, WATER_VAT, drainageVat } from './water.js';
import { hkdTax, SECTORS as HKD_SECTORS, THRESHOLD as HKD_THRESHOLD } from './hkd.js';
import { severance, jobLoss, unemployment } from './severance.js';
import { semesterAvg, round1, classify, LEVELS } from './grade-avg.js';
import NUM from '../data/numerology.json';

// "1,2 tỷ", "40 triệu" – short Vietnamese money words for titles.
const vnd = (n) => {
  const x = Number(n) || 0;
  if (x >= 1e9) return `${String(+(x / 1e9).toFixed(2)).replace('.', ',')} tỷ`;
  if (x >= 1e6) return `${String(+(x / 1e6).toFixed(2)).replace('.', ',')} triệu`;
  return `${fmtNum(x)} đồng`;
};

// Meta description ≤ 155 ký tự, cắt ở ranh giới từ thay vì giữa chữ.
const cutDesc = (t) => (t.length <= 155 ? t : t.slice(0, 154).replace(/[\s,;:–-]+\S*$/, '') + '…');

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
      // "Thôi việc" và "nghỉ việc" dùng chung mẫu đơn (kind nghiviec) nhưng khác ý định tìm kiếm:
      // thôi việc = thủ tục chấm dứt HĐLĐ; nghỉ việc = cách viết đơn lịch sự. Nội dung tách hẳn để tránh trùng lặp.
      // Căn cứ: Bộ luật Lao động 45/2019/QH14 – Điều 35 (báo trước), Điều 40 (nghỉ trái luật), Điều 46 (trợ cấp thôi việc), Điều 48 (thanh toán khi chấm dứt).
      if (p.kind === 'nghiviec' && /thôi việc/i.test(p.alias || '')) {
        out = {
          h1: record.title,
          description: 'Thủ tục thôi việc theo Điều 35 BLLĐ 2019: báo trước 45 ngày, 30 ngày hoặc 3 ngày làm việc tùy hợp đồng, trường hợp không cần báo trước, trợ cấp sau nghỉ.',
          intro: [
            `Đơn xin thôi việc là văn bản người lao động dùng để <b>đơn phương chấm dứt hợp đồng lao động</b> theo Điều 35 Bộ luật Lao động 2019. Điền thông tin ở công cụ bên dưới rồi bấm <b>In / Lưu PDF</b>; dữ liệu không rời máy bạn.`,
            `<b>Thời hạn báo trước</b> (khoản 1 Điều 35): ít nhất <b>45 ngày</b> với hợp đồng không xác định thời hạn, <b>30 ngày</b> với hợp đồng xác định thời hạn từ 12 đến 36 tháng, <b>3 ngày làm việc</b> với hợp đồng dưới 12 tháng. Một số ngành nghề đặc thù có thời hạn riêng. Ngày nghỉ ghi trong đơn nên tính từ ngày công ty nhận đơn.`,
            `<b>Không cần báo trước</b> (khoản 2 Điều 35) khi: không được bố trí đúng công việc, địa điểm, điều kiện đã thỏa thuận; không được trả đủ lương hoặc trả không đúng hạn; bị ngược đãi, quấy rối tình dục; lao động nữ mang thai phải nghỉ theo chỉ định; đủ tuổi nghỉ hưu; người sử dụng lao động cung cấp thông tin không trung thực khi giao kết hợp đồng.`,
            `<b>Nghỉ không đúng luật</b> (không báo trước đủ ngày, không thuộc khoản 2) thì không được trợ cấp thôi việc và phải bồi thường cho người sử dụng lao động (Điều 40).`,
            `<b>Sau khi chấm dứt hợp đồng</b>: hai bên thanh toán đầy đủ các khoản trong thời hạn luật định; công ty phải hoàn thành thủ tục xác nhận thời gian đóng bảo hiểm xã hội và trả lại bản chính giấy tờ đã giữ (Điều 48). Nếu làm việc thường xuyên từ đủ 12 tháng, bạn được trợ cấp thôi việc nửa tháng lương cho mỗi năm làm việc chưa đóng bảo hiểm thất nghiệp (Điều 46) – xem <a href="/tai-chinh/tinh-tro-cap-thoi-viec">công cụ tính trợ cấp thôi việc</a>.`
          ],
          table: [
            ['Bước 1', 'Xác định loại hợp đồng để biết số ngày phải báo trước'],
            ['Bước 2', 'Nộp đơn cho người có thẩm quyền, giữ bản có ký nhận hoặc email xác nhận ngày nhận'],
            ['Bước 3', 'Tiếp tục làm việc hết thời hạn báo trước, bàn giao công việc, tài sản'],
            ['Bước 4', 'Nhận lương còn lại, phép năm chưa nghỉ, trợ cấp thôi việc (nếu đủ điều kiện)'],
            ['Bước 5', 'Nhận xác nhận thời gian đóng BHXH và bản chính giấy tờ đã nộp'],
            ['Bước 6', 'Nếu chưa có việc mới: làm hồ sơ hưởng trợ cấp thất nghiệp tại trung tâm dịch vụ việc làm']
          ],
          faq: [
            { q: 'Xin thôi việc phải báo trước bao nhiêu ngày?', a: '45 ngày (HĐ không xác định thời hạn), 30 ngày (HĐ 12–36 tháng), 3 ngày làm việc (HĐ dưới 12 tháng) – khoản 1 Điều 35 Bộ luật Lao động 2019.' },
            { q: 'Nghỉ ngang không báo trước đủ ngày thì sao?', a: 'Đó là đơn phương chấm dứt trái luật: không được trợ cấp thôi việc và phải bồi thường cho người sử dụng lao động (Điều 40 Bộ luật Lao động 2019).' },
            { q: 'Thôi việc xong cần nhận lại những gì?', a: 'Lương và các khoản còn lại, trợ cấp thôi việc nếu đủ điều kiện, xác nhận thời gian đóng bảo hiểm xã hội và bản chính giấy tờ công ty đã giữ (Điều 48 Bộ luật Lao động 2019).' }
          ]
        };
        break;
      }
      const notice = p.kind === 'nghiviec'
        ? [`Một lá đơn xin nghỉ việc tốt chỉ cần <b>ngắn gọn và lịch sự</b>: ngày nghỉ dự kiến, lý do nêu trung tính, lời cảm ơn công ty và cam kết bàn giao. Đơn được lưu trong hồ sơ nhân sự, nên giữ giọng văn tôn trọng dù bạn rời đi vì lý do gì.`,
           `<b>Cách ghi lý do:</b> chọn lý do thật nhưng không đổ lỗi, ví dụ "theo định hướng phát triển nghề nghiệp mới", "vì lý do gia đình", "chuyển nơi sinh sống", "để tiếp tục học tập". Tránh chỉ trích quản lý, đồng nghiệp hay so sánh lương trong đơn; những góp ý đó nên để buổi trao đổi trực tiếp.`,
           `<b>Nên nói chuyện với quản lý trực tiếp trước</b>, rồi mới gửi đơn chính thức qua email hoặc bản in. Ngày nghỉ ghi trong đơn phải tôn trọng thời hạn báo trước theo loại hợp đồng – xem chi tiết thủ tục ở <a href="/cong-cu/mau-don-xin-thoi-viec">mẫu đơn xin thôi việc và thời hạn báo trước</a>.`]
        : p.kind === 'nghiphep'
          ? [`Người lao động làm đủ 12 tháng được nghỉ hằng năm hưởng nguyên lương ít nhất <b>12 ngày làm việc</b> (Điều 113 Bộ luật Lao động 2019); điều kiện nặng nhọc, độc hại được nhiều hơn.`]
          : [];
      out = {
        description: p.kind === 'nghiviec' ? 'Cách viết đơn xin nghỉ việc lịch sự: ghi lý do trung tính, lời cảm ơn, cam kết bàn giao, kèm câu mẫu từng phần. Điền online, in hoặc lưu PDF miễn phí.' : undefined,
        h1: record.title,
        intro: [
          `Điền thông tin ở công cụ bên dưới, ${K.name} hiện ngay theo đúng bố cục, rồi bấm <b>In / Lưu PDF</b>. Không cần đăng ký, dữ liệu không rời máy bạn.`,
          ...notice,
          `Pháp luật không bắt buộc một mẫu cố định cho ${K.name}; điều quan trọng là nội dung rõ ràng, có ngày và chữ ký. Nếu công ty, nhà trường có mẫu riêng, hãy dùng mẫu đó.`
        ],
        table: p.kind === 'nghiviec'
          ? [
              ['Mở đầu', 'Em/Tôi tên là …, hiện là … tại bộ phận …'],
              ['Đề nghị', 'Em xin phép được nghỉ việc kể từ ngày …'],
              ['Lý do', 'Vì lý do gia đình / theo định hướng nghề nghiệp mới …'],
              ['Cảm ơn', 'Em chân thành cảm ơn Ban Giám đốc và anh chị đã hướng dẫn, tạo điều kiện trong thời gian qua.'],
              ['Bàn giao', 'Em sẽ bàn giao đầy đủ công việc, tài liệu cho … trước ngày nghỉ.'],
              ['Kết', 'Kính mong Ban Giám đốc xem xét, chấp thuận. Trân trọng.']
            ]
          : K.parts.map((x, i) => [`Phần ${i + 1}`, x]),
        faq: p.kind === 'nghiviec'
          ? [{ q: 'Nên ghi lý do nghỉ việc thế nào cho khéo?', a: 'Ngắn gọn, trung tính và đúng sự thật: lý do gia đình, sức khỏe, học tập, chuyển nơi ở hoặc định hướng nghề nghiệp mới. Không cần kể chi tiết hay phàn nàn trong đơn.' }, { q: 'Đơn xin nghỉ việc có cần viết tay không?', a: 'Không bắt buộc. Đơn đánh máy có chữ ký đều hợp lệ; chỉ cần thể hiện rõ ngày nghỉ và được gửi cho người sử dụng lao động.' }, { q: 'Có nên báo quản lý trước khi nộp đơn?', a: 'Nên. Trao đổi trực tiếp giúp hai bên thống nhất ngày nghỉ, kế hoạch bàn giao và giữ quan hệ tốt; đơn chính thức gửi sau để làm căn cứ.' }]
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
        intro = [p.kind === 'kg' ? `<b>${v} kg = ${n2(lb, 2)} lbs</b> (${Math.floor(lb)} lb ${n2((lb % 1) * 16, 1)} oz).` : `<b>${v} lbs = ${n2(kg, 2)} kg</b>.`, `1 lb is exactly 0.45359237 kg, so 1 kg ≈ 2.2046 lb. Quick mental check: double the kg and add 10%.`];
        table = [-10, -5, 0, 5, 10].map((d) => v + d).map((x) => p.kind === 'kg' ? [`${x} kg`, `${n2(x / 0.45359237)} lbs`] : [`${x} lbs`, `${n2(x * 0.45359237)} kg`]);
        faq = [{ q: p.kind === 'kg' ? `How many pounds is ${v} kg?` : `How many kg is ${v} lbs?`, a: p.kind === 'kg' ? `${n2(lb)} lbs` : `${n2(kg)} kg` }];
      } else {
        const c = (v - 32) * 5 / 9;
        h1 = `${v}°F to °C`;
        intro = [`<b>${v}°F = ${n2(c, 1)}°C</b> (${n2(c + 273.15, 2)} K).`, `Formula: °C = (°F − 32) × 5/9. ${v >= 98 && v <= 104 ? 'Body temperature above 100.4°F (38°C) is generally considered a fever.' : 'Quick estimate: subtract 30, then halve.'}`];
        table = [-10, -5, 0, 5, 10].map((d) => v + d).map((x) => [`${x}°F`, `${n2((x - 32) * 5 / 9, 1)}°C`]);
        faq = [{ q: `What is ${v}°F in Celsius?`, a: `${n2(c, 1)}°C` }];
      }
      out = { h1, intro, table, faq };
      break;
    }
    case 'retireage': {
      // Căn cứ: Điều 169 BLLĐ 45/2019/QH14; NĐ 135/2020/NĐ-CP (Điều 3, 4, Phụ lục I).
      const Y = Math.trunc(Number(p.year));
      const female = p.sex === 'female';
      const who = female ? 'Nữ' : 'Nam';
      const rows = Array.from({ length: 12 }, (_, i) => ({ mo: i + 1, r: retirementAge({ sex: female ? 'female' : 'male', month: i + 1, year: Y }) }));
      if (rows.some((x) => x.r.invalid)) { out = { h1: record.title || record.slug, intro: [record.title || ''], table: [], faq: [] }; break; }
      const age = (r) => `${r.ageYears} tuổi${r.ageMonths ? ` ${r.ageMonths} tháng` : ''}`;
      const when = (r) => `tháng ${r.retireMonth}/${r.retireYear}`;
      const a = rows[0].r, z = rows[11].r;
      const sameAge = rows.every((x) => x.r.ageYears === a.ageYears && x.r.ageMonths === a.ageMonths);
      const years = [...new Set(rows.map((x) => x.r.retireYear))];
      out = {
        h1: `${who} sinh năm ${Y} nghỉ hưu năm nào, bao nhiêu tuổi?`,
        intro: [
          `${who} sinh năm ${Y}, làm việc trong điều kiện bình thường, nghỉ hưu vào <b>năm ${years.join(' hoặc ')}</b>. Sinh tháng 1/${Y}: đủ tuổi nghỉ hưu <b>${age(a)}</b>, nghỉ hưu ${when(a)}; sinh tháng 12/${Y}: <b>${age(z)}</b>, nghỉ hưu ${when(z)}.`,
          sameAge
            ? `Mọi tháng sinh trong năm ${Y} đều có cùng tuổi nghỉ hưu ${age(a)}${(female ? a.ageYears >= 60 : a.ageYears >= 62) ? ' – đây là mức tối đa sau lộ trình tăng tuổi nghỉ hưu' : ''}.`
            : `Năm ${Y} thuộc giai đoạn chuyển tiếp: tuổi nghỉ hưu ${female ? 'nữ tăng 4 tháng' : 'nam tăng 3 tháng'} mỗi năm, nên người sinh cuối năm có thể phải làm thêm vài tháng so với người sinh đầu năm. Xem bảng 12 tháng sinh bên dưới.`,
          `Thời điểm nghỉ hưu là hết ngày cuối cùng của tháng đủ tuổi; lương hưu được hưởng từ ngày 01 của tháng liền kề. Người làm nghề nặng nhọc, độc hại hoặc suy giảm khả năng lao động có thể nghỉ sớm tối đa 5 tuổi. Căn cứ: Điều 169 Bộ luật Lao động 45/2019/QH14, Nghị định 135/2020/NĐ-CP.`
        ],
        table: rows.map((x) => [`Sinh tháng ${x.mo}/${Y}`, `${age(x.r)} – nghỉ hưu ${when(x.r)}, hưởng lương hưu từ 01/${x.r.pensionMonth}/${x.r.pensionYear}`]),
        faq: [
          { q: `${who} sinh năm ${Y} bao nhiêu tuổi được nghỉ hưu?`, a: sameAge ? `${age(a)} (điều kiện lao động bình thường).` : `Từ ${age(a)} (sinh tháng 1) đến ${age(z)} (sinh tháng 12), tùy tháng sinh.` },
          { q: `${who} sinh năm ${Y} nghỉ hưu sớm được không?`, a: 'Được nghỉ sớm tối đa 5 tuổi nếu có đủ 15 năm làm nghề nặng nhọc, độc hại, vùng đặc biệt khó khăn hoặc suy giảm khả năng lao động từ 61% (Điều 5 NĐ 135/2020/NĐ-CP).' }
        ]
      };
      break;
    }
    case 'truocba': {
      // Căn cứ: Điều 8 NĐ 10/2022/NĐ-CP sửa bởi NĐ 175/2025/NĐ-CP; phí biển số: TT 60/2023/TT-BTC sửa bởi TT 71/2025/TT-BTC.
      const P = Number(p.price);
      const pr = vnd(P);
      if (p.vehicle === 'car9') {
        const c = (rate, region) => registrationFee({ vehicle: 'car9', price: P, first: true, carRate: rate, region });
        const a1 = c(0.1, '1'), a2 = c(0.1, '2'), b1 = c(0.12, '1'), b2 = c(0.12, '2');
        out = {
          h1: `Phí trước bạ ô tô ${pr} là bao nhiêu? (xe ≤ 9 chỗ)`,
          intro: [
            `Ô tô chở người đến 9 chỗ giá tính lệ phí <b>${pr}</b> đăng ký lần đầu: lệ phí trước bạ <b>${m(a1.tax)}</b> ở nơi thu 10%, hoặc <b>${m(b1.tax)}</b> ở nơi thu 12% (như Hải Phòng).`,
            `Cộng phí đăng ký, cấp biển số: tại Hà Nội, TP.HCM (khu vực I) thêm ${m(a1.plate)}, tổng ${m(a1.total)} (mức 10%); tại tỉnh khác (khu vực II) thêm ${m(a2.plate)}, tổng ${m(a2.total)}.`,
            `Giá tính lệ phí là giá trong bảng giá của UBND tỉnh/thành, có thể khác giá bán thực tế. Chưa gồm phí đăng kiểm, bảo hiểm, phí đường bộ. Căn cứ: NĐ 10/2022/NĐ-CP (sửa bởi NĐ 175/2025/NĐ-CP), TT 60/2023/TT-BTC (sửa bởi TT 71/2025/TT-BTC).`
          ],
          table: [
            ['Lệ phí trước bạ 10%', m(a1.tax)], ['Lệ phí trước bạ 12%', m(b1.tax)],
            ['Biển số khu vực I (Hà Nội, TP.HCM)', m(a1.plate)], ['Biển số khu vực II (tỉnh khác)', m(a2.plate)],
            ['Tổng mức 10% – khu vực I', m(a1.total)], ['Tổng mức 10% – khu vực II', m(a2.total)],
            ['Tổng mức 12% – khu vực I', m(b1.total)], ['Tổng mức 12% – khu vực II', m(b2.total)]
          ],
          faq: [
            { q: `Mua ô tô ${pr} đóng trước bạ bao nhiêu?`, a: `${m(a1.tax)} nếu tỉnh thu 10%, ${m(b1.tax)} nếu thu 12% (đăng ký lần đầu, xe ≤ 9 chỗ).` },
            { q: 'Ô tô cũ sang tên đóng trước bạ bao nhiêu?', a: 'Lần thứ 2 trở đi thu 2% trên giá tính lệ phí (đã tính tỷ lệ chất lượng còn lại).' }
          ]
        };
      } else {
        const r1 = registrationFee({ vehicle: 'moto', price: P, first: true, region: '1' });
        const r2 = registrationFee({ vehicle: 'moto', price: P, first: true, region: '2' });
        const used = registrationFee({ vehicle: 'moto', price: P, first: false, region: '2' });
        out = {
          h1: `Phí trước bạ xe máy ${pr} là bao nhiêu?`,
          intro: [
            `Xe máy giá tính lệ phí <b>${pr}</b> đăng ký lần đầu phải nộp lệ phí trước bạ 2% là <b>${m(r1.tax)}</b>. Cộng phí cấp biển số, tổng cộng <b>${m(r1.total)}</b> tại Hà Nội, TP.HCM hoặc <b>${m(r2.total)}</b> tại tỉnh khác.`,
            `Phí biển số xe máy phụ thuộc giá xe: ${P <= 15e6 ? 'đến 15 triệu' : P <= 40e6 ? 'trên 15 đến 40 triệu' : 'trên 40 triệu'} thu ${m(r1.plate)} ở khu vực I và ${m(r2.plate)} ở khu vực II. Nếu mua xe cũ sang tên, lệ phí trước bạ chỉ 1%: ${m(used.tax)}.`,
            `Căn cứ: Điều 8 NĐ 10/2022/NĐ-CP (sửa bởi NĐ 175/2025/NĐ-CP); phí biển số theo TT 60/2023/TT-BTC (sửa bởi TT 71/2025/TT-BTC). Giá tính lệ phí theo bảng giá của UBND tỉnh, có thể khác giá mua.`
          ],
          table: [
            ['Giá tính lệ phí', m(P)], ['Lệ phí trước bạ lần đầu (2%)', m(r1.tax)],
            ['Biển số khu vực I (Hà Nội, TP.HCM)', m(r1.plate)], ['Biển số khu vực II (tỉnh khác)', m(r2.plate)],
            ['Tổng khu vực I', m(r1.total)], ['Tổng khu vực II', m(r2.total)], ['Xe cũ sang tên (1%)', m(used.tax)]
          ],
          faq: [
            { q: `Xe máy ${pr} đóng trước bạ bao nhiêu?`, a: `${m(r1.tax)} (2%, đăng ký lần đầu), chưa gồm phí biển số.` },
            { q: 'Khu vực I gồm những đâu?', a: 'Hà Nội và TP. Hồ Chí Minh; các tỉnh, thành khác thuộc khu vực II theo TT 60/2023/TT-BTC.' }
          ]
        };
      }
      break;
    }
    case 'overtime': {
      // Căn cứ: Điều 98, 106, 107 BLLĐ 45/2019/QH14; Điều 57 NĐ 145/2020/NĐ-CP.
      const S = Number(p.salary);
      const w = hourlyWage(S, 26, 8), w22 = hourlyWage(S, 22, 8);
      const kinds = [
        ['Ngày thường', OT_RATES.weekday], ['Ngày nghỉ hằng tuần', OT_RATES.weekend], ['Ngày lễ, Tết', OT_RATES.holiday],
        ['Ban đêm ngày thường', nightRate('weekday')], ['Ban đêm ngày thường (đã làm thêm ban ngày)', nightRate('weekday', true)],
        ['Ban đêm ngày nghỉ hằng tuần', nightRate('weekend')], ['Ban đêm ngày lễ, Tết', nightRate('holiday')]
      ];
      const pct = (r) => Math.round(r * 100) + '%';
      out = {
        h1: `Lương ${fmtNum(S / 1e6)} triệu tăng ca 1 giờ được bao nhiêu?`,
        intro: [
          `Lương <b>${m(S)}</b>/tháng, 26 ngày công, 8 giờ/ngày thì lương 1 giờ là ${m(w)}. Tăng ca ngày thường được ít nhất <b>${m(w * 1.5)}/giờ</b> (150%), ngày nghỉ hằng tuần ${m(w * 2)}/giờ (200%), ngày lễ, Tết ${m(w * 3)}/giờ (300%).`,
          `Nếu công ty tính 22 ngày công (nghỉ thứ Bảy, Chủ nhật), lương giờ là ${m(w22)} và tăng ca ngày thường được ${m(w22 * 1.5)}/giờ. Làm đủ 40 giờ tăng ca ngày thường – mức tối đa 1 tháng theo Điều 107 BLLĐ 2019 – được khoảng ${m(w * 1.5 * 40)} (26 ngày công).`,
          'Căn cứ: Điều 98 BLLĐ 2019 (150% – 200% – 300%; làm việc ban đêm thêm ít nhất 30%; làm thêm ban đêm thêm 20%) và Điều 57 NĐ 145/2020/NĐ-CP. Đây là mức tối thiểu; lương tính làm thêm là lương theo hợp đồng của công việc đang làm.'
        ],
        table: kinds.map(([l, r]) => [`${l} (${pct(r)})`, `${m(w * r)}/giờ`]),
        faq: [
          { q: `Lương ${fmtNum(S / 1e6)} triệu tăng ca 10 giờ được bao nhiêu?`, a: `Khoảng ${m(w * 1.5 * 10)} nếu tăng ca ngày thường (26 ngày công, 8 giờ/ngày); ${m(w * 2 * 10)} nếu làm vào ngày nghỉ hằng tuần.` },
          { q: 'Tăng ca ngày lễ được trả bao nhiêu?', a: `Ít nhất 300% lương giờ, tức ${m(w * 3)}/giờ với mức lương này; người hưởng lương ngày còn được trả thêm lương ngày lễ.` }
        ]
      };
      break;
    }
    case 'pregnancy': {
      // Rụng trứng ≈ 14 ngày trước kỳ kinh kế tiếp (pha hoàng thể ~14 ngày); cửa sổ dễ thụ thai = 5 ngày trước rụng trứng + ngày rụng trứng.
      const C = Math.trunc(Number(p.cycle));
      const ov = C - 14;
      const day = (n) => `ngày thứ ${n}`;
      out = {
        h1: `Chu kỳ ${C} ngày rụng trứng vào ngày nào?`,
        intro: [
          `Với chu kỳ kinh nguyệt <b>${C} ngày</b>, trứng thường rụng vào khoảng <b>${day(ov)}</b> tính từ ngày đầu tiên có kinh (ngày có kinh là ngày thứ 1). Những ngày dễ thụ thai nhất là từ <b>${day(ov - 5)} đến ${day(ov)}</b>, cao nhất ở ${day(ov - 2)} – ${day(ov)}.`,
          `Cách tính: pha sau rụng trứng (pha hoàng thể) thường kéo dài khoảng 14 ngày và ít thay đổi, nên ngày rụng trứng ≈ độ dài chu kỳ − 14 = ${C} − 14 = ${ov}. Tinh trùng sống được tới 5 ngày trong cơ thể người nữ, còn trứng chỉ sống 12–24 giờ sau khi rụng, vì vậy “cửa sổ thụ thai” gồm 5 ngày trước và ngày rụng trứng.`,
          `${C < 24 ? 'Chu kỳ dưới 24 ngày là chu kỳ ngắn; nếu kéo dài hoặc kèm triệu chứng bất thường nên đi khám phụ khoa. ' : C > 35 ? 'Chu kỳ trên 35 ngày là chu kỳ dài; nếu thường xuyên như vậy nên đi khám phụ khoa. ' : ''}Đây là ước tính cho chu kỳ đều. Que thử rụng trứng (LH), theo dõi thân nhiệt hoặc siêu âm nang noãn cho kết quả chính xác hơn. Không dùng cách tính này để tránh thai.`
        ],
        table: [
          ['Ngày bắt đầu có kinh', day(1)],
          ['Bắt đầu cửa sổ dễ thụ thai', day(ov - 5)],
          ['Ngày rụng trứng (ước tính)', day(ov)],
          ['Kỳ kinh tiếp theo', day(C + 1)]
        ],
        faq: [
          { q: `Chu kỳ ${C} ngày thì quan hệ ngày nào dễ có thai?`, a: `Từ ${day(ov - 5)} đến ${day(ov)} của chu kỳ (tính ngày đầu có kinh là ngày 1), dễ nhất là 2 ngày trước rụng trứng và ngày rụng trứng.` },
          { q: 'Làm sao biết chính xác ngày rụng trứng?', a: 'Dùng que thử rụng trứng (đo hormone LH, thường dương tính 24–36 giờ trước rụng trứng), theo dõi thân nhiệt buổi sáng, quan sát dịch nhầy cổ tử cung, hoặc siêu âm nang noãn tại cơ sở y tế.' }
        ]
      };
      break;
    }
    case 'water': {
      // Căn cứ: Hà Nội QĐ 3541/QĐ-UBND (07/7/2023); TP.HCM QĐ 25/2019/QĐ-UBND; VAT thoát nước NQ 204/2025/QH15.
      const X = Number(p.m3);
      const now = new Date();
      const yr = now.getFullYear();
      if (p.region === 'hcm') {
        const N = Math.max(1, Math.trunc(Number(p.people) || 1));
        const r = waterBill({ region: 'hcm', m3: X, people: N, now });
        const t = WATER_REGIONS.hcm.tiers;
        const used = r.rows.filter((x) => x.m3 > 0);
        const dv = drainageVat(now);
        out = {
          h1: `Tiền nước TP.HCM ${N} người dùng ${X} m³ bao nhiêu?`,
          intro: [
            `Hộ ${N} nhân khẩu ở TP.HCM dùng <b>${X} m³</b> nước/tháng trả khoảng <b>${m(r.total)}</b> (năm ${yr}), bình quân ${fmtNum(Math.round(r.total / X))} đ/m³ gồm thuế, phí.`,
            `Định mức của hộ ${N} người: ${4 * N} m³ đầu giá ${fmtNum(t[0].price)} đ, ${4 * N}–${6 * N} m³ giá ${fmtNum(t[1].price)} đ, trên ${6 * N} m³ giá ${fmtNum(t[2].price)} đ (chưa VAT). Tiền nước chưa thuế ${m(r.subtotal)}, cộng VAT 5%, giá dịch vụ thoát nước 30% và VAT thoát nước ${Math.round(dv * 100)}%.`,
            `Bảng giá vùng Sawaco theo QĐ 25/2019/QĐ-UBND; VAT thoát nước 8% áp dụng đến 31/12/2026 (NQ 204/2025/QH15), từ 2027 dự kiến 10%. Số nhân khẩu tính theo sổ định mức đăng ký với công ty cấp nước.`
          ],
          table: used.map((x) => [`Bậc ${x.tier}: ${fmtNum(x.m3)} m³ × ${fmtNum(x.price)} đ`, m(x.amount)]).concat([
            ['VAT nước sạch 5%', m(r.vat)], ['Dịch vụ thoát nước 30%', m(r.drainAmt)], [`VAT thoát nước ${Math.round(dv * 100)}%`, m(r.drainVatAmt)], ['Tổng cộng', m(r.total)]
          ]),
          faq: [
            { q: `${N} người dùng ${X} khối nước hết bao nhiêu tiền ở TP.HCM?`, a: `Khoảng ${m(r.total)} gồm VAT và phí thoát nước (năm ${yr}).` },
            { q: 'Vì sao đăng ký đủ nhân khẩu lại rẻ hơn?', a: `Định mức giá thấp tính theo người (4 m³/người/tháng); mỗi người thêm giúp ${4} m³ được tính giá ${fmtNum(t[0].price)} đ thay vì giá cao hơn.` }
          ]
        };
      } else {
        const r = waterBill({ region: 'hanoi', m3: X, now });
        const used = r.rows.filter((x) => x.m3 > 0);
        out = {
          h1: `Tiền nước Hà Nội ${X} m³ bao nhiêu tiền?`,
          intro: [
            `Dùng <b>${X} m³</b> nước sinh hoạt mỗi tháng ở Hà Nội, hóa đơn khoảng <b>${m(r.total)}</b> (năm ${yr}), gồm tiền nước ${m(r.subtotal)}, VAT 5% ${m(r.vat)} và phí bảo vệ môi trường 10% ${m(r.feeAmt)}.`,
            `Lượng nước này rơi vào <b>bậc ${used.length}</b>: 10 m³ đầu giá 8.500 đ, 10–20 m³: 9.900 đ, 20–30 m³: 16.000 đ, trên 30 m³: 27.000 đ (chưa VAT, tính theo đồng hồ/tháng). ${X > 30 ? 'Phần vượt 30 m³ có giá gấp hơn 3 lần bậc 1.' : ''}`,
            `Căn cứ: QĐ 3541/QĐ-UBND ngày 07/7/2023 của UBND Hà Nội (áp dụng từ 01/01/2024); phí BVMT nước thải theo NĐ 346/2025/NĐ-CP. Hộ nghèo, cận nghèo, hộ chính sách được giá ưu đãi bậc 1.`
          ],
          table: used.map((x) => [`Bậc ${x.tier}: ${fmtNum(x.m3)} m³ × ${fmtNum(x.price)} đ`, m(x.amount)]).concat([
            [`VAT ${Math.round(WATER_VAT * 100)}%`, m(r.vat)], ['Phí BVMT nước thải 10%', m(r.feeAmt)], ['Tổng cộng', m(r.total)]
          ]),
          faq: [
            { q: `${X} khối nước Hà Nội bao nhiêu tiền?`, a: `Khoảng ${m(r.total)} gồm VAT 5% và phí bảo vệ môi trường 10%.` },
            { q: 'Bậc giá nước Hà Nội tính theo người hay theo hộ?', a: 'Theo m³/đồng hồ/tháng; nhà nhiều hộ chung đồng hồ được chia định mức theo số hộ.' }
          ]
        };
      }
      break;
    }
    case 'hkd': {
      // Căn cứ: Luật Thuế TNCN 109/2025/QH15; NĐ 141/2026/NĐ-CP (ngưỡng 1 tỷ); NQ 198/2025/QH15; Luật Thuế GTGT 48/2024/QH15.
      const R = Number(p.revenue);
      const r = hkdTax(R, p.sector, 0);
      const s = r.sector;
      const rt = vnd(R);
      const pct = (x) => `${String(+(x * 100).toFixed(2)).replace('.', ',')}%`;
      out = {
        h1: `Thuế hộ kinh doanh doanh thu ${rt}/năm – ${s.vi.toLowerCase()}`,
        intro: [
          `Hộ kinh doanh ngành <b>${s.vi.toLowerCase()}</b> có doanh thu <b>${rt}/năm</b> nộp khoảng <b>${m(r.total)}</b> thuế mỗi năm (≈ ${m(r.monthly)}/tháng) theo phương pháp tỷ lệ trên doanh thu: GTGT ${m(r.vat)} và thuế TNCN ${m(r.pit)}.`,
          `GTGT = ${rt} × ${pct(s.vat)}; TNCN = (doanh thu − ${vnd(HKD_THRESHOLD)} ngưỡng không chịu thuế) × ${pct(s.pit)}. Từ năm 2026 bỏ thuế khoán và lệ phí môn bài. ${r.mode === 'choice' ? `Doanh thu đến 3 tỷ được chọn cách tính theo thu nhập (15% × (doanh thu − chi phí)) nếu có đủ hóa đơn chi phí; cách đó chỉ lợi hơn khi chi phí lớn hơn ${m(Math.max(0, R - r.rateAmt / 0.15))}.` : ''}`,
          `Căn cứ: Luật Thuế TNCN 109/2025/QH15, NĐ 141/2026/NĐ-CP (ngưỡng 1 tỷ đồng), NQ 198/2025/QH15, Luật Thuế GTGT 48/2024/QH15. Số liệu ước tính, chưa gồm thuế tiêu thụ đặc biệt, tài nguyên (nếu có).`
        ],
        table: [
          ['Doanh thu năm', m(R)], ['Ngành nghề', s.vi], [`Thuế GTGT (${pct(s.vat)})`, m(r.vat)],
          [`Thuế TNCN (${pct(s.pit)} phần vượt 1 tỷ)`, m(r.pit)], ['Tổng thuế/năm', m(r.total)], ['Bình quân/tháng', m(r.monthly)]
        ],
        faq: [
          { q: `Doanh thu ${rt} nộp thuế bao nhiêu?`, a: `Khoảng ${m(r.total)}/năm với ngành ${s.vi.toLowerCase()} (phương pháp tỷ lệ).` },
          { q: 'Doanh thu bao nhiêu thì không phải nộp thuế?', a: 'Từ 1 tỷ đồng/năm trở xuống không phải nộp GTGT và TNCN (NĐ 141/2026/NĐ-CP, từ 01/01/2026).' }
        ]
      };
      break;
    }
    case 'severance': {
      // Căn cứ: BLLĐ 45/2019/QH14 Điều 46, 47; NĐ 145/2020/NĐ-CP Điều 8;
      // Luật Việc làm 74/2025/QH15 Điều 38, 39 (từ 01/01/2026); lương tối thiểu vùng NĐ 293/2025/NĐ-CP.
      const tr = (v) => `${String(+(v / 1e6).toFixed(2)).replace('.', ',')} triệu`;
      const basis = 'Căn cứ: Điều 46, 47 Bộ luật Lao động 2019; Điều 8 NĐ 145/2020/NĐ-CP; Điều 38, 39 Luật Việc làm 74/2025/QH15; lương tối thiểu vùng theo NĐ 293/2025/NĐ-CP.';
      if (p.kind === 'ui') {
        const S = Number(p.salary);
        if (!Number.isFinite(S) || S <= 0) { out = { h1: record.title || record.slug, intro: [record.title || ''], table: [], faq: [] }; break; }
        const reg = [1, 2, 3, 4].map((r) => unemployment(S, 36, r));
        const rows = Array.from({ length: 12 }, (_, i) => ({ y: i + 1, u: unemployment(S, (i + 1) * 12, 1) }));
        const capped = reg[0].capped;
        out = {
          h1: `Trợ cấp thất nghiệp lương ${tr(S)} được bao nhiêu?`,
          intro: [
            `Lương đóng bảo hiểm thất nghiệp bình quân 6 tháng cuối <b>${tr(S)}</b>: trợ cấp thất nghiệp <b>${m(reg[0].monthly)}/tháng</b> (vùng I)${capped ? `, đã bị giới hạn ở mức trần 5 lần lương tối thiểu vùng (60% lương là ${m(0.6 * S)})` : ` (60% mức lương)`}.`,
            `Đóng đủ 12–36 tháng được hưởng 3 tháng, tổng <b>${m(rows[0].u.total)}</b>; sau đó cứ thêm đủ 12 tháng được thêm 1 tháng, tối đa 12 tháng (đóng từ 144 tháng): tổng tối đa <b>${m(rows[11].u.total)}</b>. ${reg.some((x) => x.capped) ? `Ở vùng có lương tối thiểu thấp, mức trần nhỏ hơn: vùng II ${m(reg[1].monthly)}, vùng III ${m(reg[2].monthly)}, vùng IV ${m(reg[3].monthly)}/tháng.` : ''}`,
            `Điều kiện: đã đóng BHTN từ đủ 12 tháng trong 24 tháng trước khi nghỉ việc, chấm dứt hợp đồng đúng luật (không tự ý bỏ việc trái luật). ${basis}`
          ],
          table: [1, 2, 3, 4].map((r, i) => [`Mức hưởng/tháng – vùng ${['I', 'II', 'III', 'IV'][i]} (trần ${m(reg[i].cap)})`, m(reg[i].monthly)]).concat(
            rows.map(({ y, u }) => [`Đóng ${y} năm (${y * 12} tháng) – vùng I`, `${u.duration} tháng × ${m(u.monthly)} = ${m(u.total)}`])
          ),
          faq: [
            { q: `Lương ${tr(S)} thất nghiệp được bao nhiêu một tháng?`, a: `${m(reg[0].monthly)}/tháng ở vùng I${capped ? ' (mức trần)' : ''}; vùng IV ${m(reg[3].monthly)}.` },
            { q: 'Đóng bao lâu thì được hưởng 12 tháng trợ cấp thất nghiệp?', a: 'Từ đủ 144 tháng (12 năm) đóng BHTN trở lên; 12–36 tháng được 3 tháng, mỗi 12 tháng thêm được thêm 1 tháng.' }
          ]
        };
        break;
      }
      const N = Math.trunc(Number(p.years));
      if (!(N >= 1 && N <= 60)) { out = { h1: record.title || record.slug, intro: [record.title || ''], table: [], faq: [] }; break; }
      const mo = N * 12;
      const SAL = [7e6, 10e6, 15e6, 20e6, 30e6];
      const s10 = severance(10e6, mo), j10 = jobLoss(10e6, mo), u10 = unemployment(10e6, mo, 1);
      out = {
        h1: `Làm ${N} năm nghỉ việc được bao nhiêu tiền trợ cấp?`,
        intro: [
          `Làm việc ${N} năm (${mo} tháng), lương bình quân 10 triệu, <b>chưa từng đóng bảo hiểm thất nghiệp</b>: trợ cấp thôi việc = 1/2 tháng lương × ${N} năm = <b>${m(s10.amount)}</b>; nếu bị mất việc do tái cơ cấu, thay đổi công nghệ thì trợ cấp mất việc là <b>${m(j10.amount)}</b> (1 tháng lương mỗi năm, ít nhất 2 tháng).`,
          `Lưu ý: thời gian <b>đã đóng BHTN không được tính</b> trợ cấp thôi việc – thay vào đó được hưởng trợ cấp thất nghiệp. Nếu cả ${N} năm đều đã đóng BHTN với lương 10 triệu, trợ cấp thôi việc bằng 0 nhưng được trợ cấp thất nghiệp ${u10.duration} tháng × ${m(u10.monthly)} = <b>${m(u10.total)}</b>.`,
          `Bảng dưới so sánh hai trường hợp theo các mức lương (trợ cấp thất nghiệp tính ở vùng I, 60% lương, trần 5 lần lương tối thiểu vùng). ${basis}`
        ],
        table: SAL.map((S) => {
          const sv = severance(S, mo), u = unemployment(S, mo, 1);
          return [`Lương ${tr(S)}`, `Chưa đóng BHTN: thôi việc ${m(sv.amount)} | Đã đóng BHTN cả ${N} năm: thất nghiệp ${u.duration} tháng × ${m(u.monthly)} = ${m(u.total)}`];
        }),
        faq: [
          { q: `Làm ${N} năm đã đóng bảo hiểm thất nghiệp có được trợ cấp thôi việc không?`, a: `Không cho phần thời gian đã đóng BHTN (Điều 46 BLLĐ 2019); bù lại được trợ cấp thất nghiệp ${u10.duration} tháng nếu đủ điều kiện.` },
          { q: 'Tiền lương tính trợ cấp thôi việc là lương nào?', a: 'Tiền lương bình quân theo hợp đồng của 6 tháng liền kề trước khi nghỉ việc (Điều 8 NĐ 145/2020/NĐ-CP).' }
        ]
      };
      break;
    }
    case 'diemtb': {
      // Căn cứ: TT 22/2021/TT-BGDĐT Điều 5 k3 (làm tròn 1 chữ số), Điều 6 k2 (số ĐĐGtx), Điều 9 k1, k2, k3.
      const basis = 'Căn cứ: Điều 5, 6, 9 Thông tư 22/2021/TT-BGDĐT (đánh giá học sinh THCS, THPT).';
      const fmt1 = (v) => String(v).replace('.', ',');
      if (p.kind === 'target') {
        const X = Number(p.target);
        if (!(X > 0 && X <= 10)) { out = { h1: record.title || record.slug, intro: [record.title || ''], table: [], faq: [] }; break; }
        // Điểm cuối kỳ nhỏ nhất (bước 0,1) để ĐTB học kỳ (đã làm tròn) ≥ X; null nếu kể cả 10 cũng không đủ.
        const need = (n, t) => {
          for (let k = 0; k <= 100; k++) {
            const ck = round1(k / 10);
            const r = semesterAvg(Array(n).fill(t), t, ck);
            if (r && r.avg >= X) return { ck, avg: r.avg };
          }
          return null;
        };
        const combos = [];
        for (const n of [2, 3, 4]) for (const t of [6, 7, 8]) combos.push({ n, t, r: need(n, t) });
        const show = (c) => (c.r ? (c.r.ck === 0 ? 'đã đạt (kể cả 0 điểm)' : `${fmt1(c.r.ck)} điểm (ĐTB ${fmt1(c.r.avg)})`) : 'không thể đạt, kể cả 10 điểm');
        const ex = combos.find((c) => c.n === 3 && c.t === 7);
        const hard = combos.filter((c) => !c.r).length;
        out = {
          h1: `Cần bao nhiêu điểm cuối kỳ để được ${fmt1(X)}?`,
          intro: [
            `Môn có 3 điểm thường xuyên (TX) trung bình 7 và giữa kỳ 7: muốn điểm trung bình học kỳ đạt <b>${fmt1(X)}</b> cần thi cuối kỳ <b>${show(ex)}</b>. Công thức (TT 22): ĐTB học kỳ = (tổng điểm TX + 2 × giữa kỳ + 3 × cuối kỳ) / (số cột TX + 5), làm tròn 1 chữ số.`,
            `Bảng dưới tính sẵn 9 trường hợp: 2, 3 hoặc 4 cột TX (môn 35 tiết, đến 70 tiết, trên 70 tiết/năm), điểm TX trung bình và giữa kỳ cùng bằng 6, 7 hoặc 8. ${hard ? `Có ${hard} trường hợp không thể đạt ${fmt1(X)} dù cuối kỳ được 10.` : ''} Điểm cuối kỳ có hệ số 3 nên mỗi 0,1 điểm thi kéo ĐTB lên nhiều nhất.`,
            basis
          ],
          table: combos.map((c) => [`${c.n} cột TX, TX = giữa kỳ = ${c.t}`, show(c)]),
          faq: [
            { q: `TX 7, giữa kỳ 7 thì cuối kỳ bao nhiêu để được ${fmt1(X)}?`, a: `Với 3 cột TX: ${show(ex)}. Với 2 cột: ${show(combos.find((c) => c.n === 2 && c.t === 7))}; 4 cột: ${show(combos.find((c) => c.n === 4 && c.t === 7))}.` },
            { q: 'Điểm trung bình môn làm tròn thế nào?', a: 'Làm tròn đến 1 chữ số thập phân (Điều 5 TT 22/2021), ví dụ 6,45 thành 6,5; 6,44 thành 6,4.' }
          ]
        };
        break;
      }
      const LV = { tot: 3, kha: 2, dat: 1 }[p.level];
      if (!LV) { out = { h1: record.title || record.slug, intro: [record.title || ''], table: [], faq: [] }; break; }
      const name = LEVELS[LV].vi;
      const crit = {
        3: 'tất cả môn đánh giá bằng nhận xét đều Đạt; tất cả môn tính điểm có ĐTB từ 6,5 trở lên, trong đó ít nhất 6 môn từ 8,0 trở lên',
        2: 'tất cả môn đánh giá bằng nhận xét đều Đạt; tất cả môn tính điểm có ĐTB từ 5,0 trở lên, trong đó ít nhất 6 môn từ 6,5 trở lên',
        1: 'có nhiều nhất 1 môn nhận xét Chưa đạt; ít nhất 6 môn tính điểm có ĐTB từ 5,0 trở lên; không có môn nào dưới 3,5'
      }[LV];
      const ok9 = { 3: [8.5, 8.0, 8.2, 9.0, 8.1, 8.0, 7.0, 6.8, 7.5], 2: [7.0, 6.5, 6.8, 7.2, 6.6, 6.5, 5.5, 5.0, 6.0], 1: [5.0, 5.5, 6.0, 5.2, 5.0, 5.1, 4.0, 3.5, 4.5] }[LV];
      const miss = ok9.slice(); miss[8] = { 3: 6.4, 2: 4.9, 1: 3.4 }[LV];
      const adj = ok9.slice(); adj[8] = { 3: 3.0, 2: 3.0, 1: 2.0 }[LV];
      const lv = (r) => (r.level == null ? '–' : LEVELS[r.level].vi);
      const cases = [
        { label: `Đủ điều kiện ${name}`, s: ok9, r: classify(ok9) },
        { label: `Thiếu 1 môn (môn thứ 9 = ${fmt1(miss[8])})`, s: miss, r: classify(miss) },
        { label: `1 môn rất thấp (môn thứ 9 = ${fmt1(adj[8])})`, s: adj, r: classify(adj) }
      ];
      const desc = (c) => `${c.s.map(fmt1).join('; ')} → ${lv(c.r)}${c.r.adjusted ? ` (mức gốc ${LEVELS[c.r.base].vi}, được nâng 1 bậc theo Điều 9 k3)` : ''}`;
      out = {
        h1: `Học lực ${name} cần điều kiện gì?`,
        intro: [
          `Theo Thông tư 22/2021, kết quả học tập mức <b>${name}</b> khi: ${crit}. Ví dụ 9 môn tính điểm ${ok9.map(fmt1).join('; ')} được xếp <b>${lv(cases[0].r)}</b>.`,
          `Chỉ cần môn thứ 9 xuống ${fmt1(miss[8])} là xếp <b>${lv(cases[1].r)}</b>. Nếu chỉ vì đúng 1 môn mà bị hạ từ 2 bậc trở lên, học sinh được điều chỉnh lên 1 bậc (Điều 9 k3): ví dụ môn thứ 9 chỉ ${fmt1(adj[8])} thì kết quả là <b>${lv(cases[2].r)}</b>${cases[2].r.adjusted ? ` thay vì ${LEVELS[cases[2].r.base].vi}` : ''}.`,
          `Mức đánh giá áp dụng cho học kỳ (theo ĐTB học kỳ) và cả năm (theo ĐTB cả năm). ${basis}`
        ],
        table: cases.map((c) => [c.label, desc(c)]),
        faq: [
          { q: `Có 1 môn dưới ${LV === 3 ? '6,5' : LV === 2 ? '5,0' : '3,5'} có được ${name} không?`, a: `Không đạt mức ${name} theo Điều 9 k2; nhưng nếu chỉ vì môn đó mà bị hạ từ 2 bậc trở lên thì được điều chỉnh lên 1 bậc.` },
          { q: 'Tiểu học có xếp học lực theo điểm trung bình không?', a: 'Không. Tiểu học đánh giá theo TT 27/2020/TT-BGDĐT, không tính điểm trung bình; TT 22/2021 áp dụng cho THCS, THPT.' }
        ]
      };
      break;
    }
    default:
      out = { h1: record.title || record.slug, intro: [record.description || ''], table: [], faq: [] };
  }

  return {
    ...out,
    title: record.title || out.h1,
    description: record.description || out.description || cutDesc(out.intro.join(' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim())
  };
}

