// CV / resume designs. All share the same fields (group 'cv'), so switching design keeps the user's data.
// Inline styles only: the same HTML is used for preview, print-to-PDF and the .doc export.
import { escapeHtml as e } from './format.js';

const lines = (s) => String(s || '').split('\n').map((x) => x.trim()).filter(Boolean);
const list = (s) => String(s || '').split(',').map((x) => x.trim()).filter(Boolean);
const rows = (s) => lines(s).map((l) => l.split('|').map((x) => x.trim()));
const color = (v, d) => (/^#[0-9a-f]{6}$/i.test(v) ? v : d);
const photoSrc = (v) => (/^data:image\/(png|jpe?g|webp);base64,[a-z0-9+/=]+$/i.test(v || '') || /^data:image\/svg\+xml;charset=utf-8,[a-z0-9%~._-]*$/i.test(v || '') || /^https:\/\/(avatars\.githubusercontent\.com|api\.dicebear\.com)\/[^\s"'<>]+$/i.test(v || '') ? v : '');
const initials = (name) => String(name || '').trim().split(/\s+/).slice(-2).map((w) => w[0] || '').join('').toUpperCase();
// "skill:4" -> { name, level 1-5 }
const skill = (s) => { const [n, l] = s.split(':'); return { name: n.trim(), level: Math.min(5, Math.max(1, Number(l) || 4)) }; };
// Description bullets are separated by ";"
const bullets = (d, style = '') => {
  const b = String(d || '').split(';').map((x) => x.trim()).filter(Boolean);
  if (b.length <= 1) return b.length ? `<div style="${style}">${e(b[0])}</div>` : '';
  return `<ul style="margin:4px 0 0;padding-left:18px;${style}">${b.map((x) => `<li style="margin:2px 0">${e(x)}</li>`).join('')}</ul>`;
};
const FONT = `'Be Vietnam Pro',Arial,Helvetica,sans-serif`;
// Lora ships a Vietnamese subset (Georgia breaks stacked diacritics such as ắ, ầ, ề).
const SERIF = `Lora,'Times New Roman',serif`;

function avatar(v, size, c, ring = '#fff') {
  const src = photoSrc(v.photo);
  const isId = v.photoShape === '3x4';
  const w = size;
  const h = isId ? Math.round(size * 1.28) : size;
  const radius = isId ? '10px' : '50%';
  const base = `width:${w}px;height:${h}px;border-radius:${radius};border:3px solid ${ring};flex-shrink:0`;
  return src
    ? `<img src="${src}" alt="" style="${base};object-fit:cover;display:block" />`
    : `<div style="${base};background:${c};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:${Math.round(size * 0.34)}px">${e(initials(v.fullName))}</div>`;
}

// Vector icons (paths from Lucide, ISC licence © Lucide Contributors). Stroke uses currentColor so each design tints them.
const ICON_PATHS = {
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  cap: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
  star: '<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  award: '<circle cx="12" cy="8" r="6"/><path d="M15.48 12.89 17 22l-5-3-5 3 1.52-9.11"/>',
  user: '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>'
};
const icon = (name, size = 13, extra = '') => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px;flex-shrink:0;${extra}">${ICON_PATHS[name]}</svg>`;

function contacts(v) {
  return [[icon('mail'), v.email], [icon('phone'), v.phone], [icon('pin'), v.address], [icon('link'), v.website]].filter(([, x]) => x);
}

function fieldsFor(vi) {
  return [
    { name: 'fullName', label: vi ? 'Họ tên' : 'Full name', default: vi ? 'Nguyễn Minh Anh' : 'Alex Johnson' },
    { name: 'title', label: vi ? 'Vị trí ứng tuyển' : 'Job title', default: vi ? 'Chuyên viên Digital Marketing' : 'Digital Marketing Specialist' },
    { name: 'photo', label: vi ? 'Ảnh chân dung (không bắt buộc)' : 'Photo (optional)', type: 'photo', default: '' },
    { name: 'email', label: 'Email', default: vi ? 'minhanh.nguyen@gmail.com' : 'alex.johnson@email.com' },
    { name: 'phone', label: vi ? 'Điện thoại' : 'Phone', default: vi ? '0912 345 678' : '+1 555 0100' },
    { name: 'address', label: vi ? 'Địa chỉ' : 'Location', default: vi ? 'Quận 3, TP. Hồ Chí Minh' : 'Austin, TX' },
    { name: 'website', label: vi ? 'Website / LinkedIn' : 'Website / LinkedIn', default: 'linkedin.com/in/minhanh' },
    { name: 'summary', label: vi ? 'Giới thiệu bản thân (2–3 câu, nêu thành tích nổi bật)' : 'Professional summary', type: 'textarea', default: vi ? 'Hơn 4 năm kinh nghiệm Digital Marketing trong ngành bán lẻ và thương mại điện tử. Từng quản lý ngân sách quảng cáo 800 triệu/tháng với ROAS trung bình 4,2. Mục tiêu: dẫn dắt đội performance marketing tăng trưởng doanh thu bền vững.' : '4+ years in digital marketing for retail and e-commerce. Managed $30k/month ad budgets at an average 4.2 ROAS. Looking to lead a performance marketing team.' },
    { name: 'experience', label: vi ? 'Kinh nghiệm – mỗi dòng: Thời gian | Công ty | Vị trí | Thành tích (ngăn bằng dấu ;)' : 'Experience – per line: Period | Company | Role | Achievements (separate with ;)', type: 'textarea', rows: 6, default: vi ? '03/2023 – nay | Công ty CP Thương mại ABC | Senior Digital Marketing | Quản lý ngân sách 800 triệu/tháng trên Facebook, Google, TikTok; Tăng doanh thu online 65% sau 12 tháng; Xây dựng và đào tạo đội 4 người\n06/2021 – 02/2023 | Công ty TNHH XYZ | Chuyên viên Performance | Giảm 30% chi phí/đơn hàng nhờ tối ưu tệp đối tượng; Triển khai 120+ chiến dịch A/B test\n07/2020 – 05/2021 | Agency Sáng Tạo Việt | Thực tập sinh Marketing | Viết 80+ bài SEO, 15 bài lên top 3 Google' : '03/2023 – now | ABC Retail | Senior Digital Marketer | Managed $30k/month across Meta, Google, TikTok; Grew online revenue 65% in 12 months; Hired and coached a team of 4\n06/2021 – 02/2023 | XYZ Ltd | Performance Specialist | Cut cost per order 30%; Ran 120+ A/B tests' },
    { name: 'education', label: vi ? 'Học vấn – mỗi dòng: Thời gian | Trường | Chuyên ngành | Ghi chú' : 'Education – Period | School | Major | Note', type: 'textarea', default: vi ? '2016 – 2020 | Đại học Kinh tế TP.HCM | Marketing | Tốt nghiệp loại Giỏi, GPA 3.5/4' : '2016 – 2020 | State University | Marketing | GPA 3.5/4' },
    { name: 'skills', label: vi ? 'Kỹ năng – phân tách dấu phẩy, thêm :1-5 để chấm mức (VD: Excel:4)' : 'Skills – comma separated, add :1-5 for level (e.g. Excel:4)', default: 'Facebook Ads:5, Google Ads:5, TikTok Ads:4, Google Analytics 4:4, SEO:4, Excel:4, Canva:3' },
    { name: 'languages', label: vi ? 'Ngoại ngữ (phân tách dấu phẩy)' : 'Languages', default: vi ? 'Tiếng Anh – IELTS 7.0, Tiếng Trung – HSK 3' : 'English – native, Spanish – intermediate' },
    { name: 'certificates', label: vi ? 'Chứng chỉ / Giải thưởng (mỗi dòng 1 mục)' : 'Certificates / Awards (one per line)', type: 'textarea', default: vi ? 'Google Ads Search Certification – 2024\nMeta Certified Media Buying Professional – 2023\nNhân viên xuất sắc năm 2023 – Công ty ABC' : 'Google Ads Search Certification – 2024\nMeta Certified Media Buying Professional – 2023' },
    { name: 'color', label: vi ? 'Màu chủ đạo' : 'Accent color', type: 'color', default: '' }
  ];
}

function sectionTitles(vi) {
  return vi
    ? { summary: 'Giới thiệu', exp: 'Kinh nghiệm làm việc', edu: 'Học vấn', skills: 'Kỹ năng', lang: 'Ngoại ngữ', cert: 'Chứng chỉ & Giải thưởng', contact: 'Liên hệ' }
    : { summary: 'Profile', exp: 'Experience', edu: 'Education', skills: 'Skills', lang: 'Languages', cert: 'Certificates & Awards', contact: 'Contact' };
}

// ---------- Designs ----------

// 1. Modern sidebar
function modern(v, T) {
  const c = color(v.color, '#1e3a5f');
  const h = (t) => `<div style="font-size:12px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:${c};margin:22px 0 10px;display:flex;align-items:center;gap:8px">${t}<span style="flex:1;height:2px;background:${c}22"></span></div>`;
  const sh = (t) => `<div style="font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#fff;opacity:.9;margin:24px 0 10px;border-bottom:1px solid rgba(255,255,255,.25);padding-bottom:6px">${t}</div>`;
  return `<div style="font-family:${FONT};display:flex;min-height:1123px;color:#1e293b;font-size:12.5px;line-height:1.55">
    <aside style="width:250px;background:${c};color:#fff;padding:36px 24px;flex-shrink:0">
      <div style="display:flex;justify-content:center">${avatar(v, 130, 'rgba(255,255,255,.15)', 'rgba(255,255,255,.3)')}</div>
      ${sh(T.contact)}
      ${contacts(v).map(([i, x]) => `<div style="display:flex;gap:8px;margin:6px 0;word-break:break-word"><span style="opacity:.7">${i}</span><span>${e(x)}</span></div>`).join('')}
      ${list(v.skills).length ? sh(T.skills) + list(v.skills).map(skill).map((s) => `<div style="margin:8px 0"><div>${e(s.name)}</div><div style="height:5px;background:rgba(255,255,255,.2);border-radius:9px;margin-top:4px"><div style="height:5px;width:${s.level * 20}%;background:#fff;border-radius:9px"></div></div></div>`).join('') : ''}
      ${list(v.languages).length ? sh(T.lang) + list(v.languages).map((x) => `<div style="margin:5px 0">${e(x)}</div>`).join('') : ''}
    </aside>
    <main style="flex:1;padding:40px 36px">
      <div style="font-size:34px;font-weight:900;line-height:1.1;color:#0f172a;letter-spacing:-.5px">${e(v.fullName)}</div>
      <div style="font-size:16px;font-weight:600;color:${c};margin-top:6px">${e(v.title)}</div>
      ${v.summary ? h(T.summary) + `<p style="margin:0;color:#334155">${e(v.summary)}</p>` : ''}
      ${h(T.exp)}
      ${rows(v.experience).map(([p, co, role, d]) => `<div style="margin-bottom:14px"><div style="display:flex;justify-content:space-between;gap:12px"><b style="font-size:14px;color:#0f172a">${e(role || '')}</b><span style="color:#64748b;white-space:nowrap;font-size:11.5px">${e(p || '')}</span></div><div style="color:${c};font-weight:600">${e(co || '')}</div>${bullets(d, 'color:#334155')}</div>`).join('')}
      ${h(T.edu)}
      ${rows(v.education).map(([p, s, m, n]) => `<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;gap:12px"><b style="color:#0f172a">${e(s || '')}</b><span style="color:#64748b;font-size:11.5px;white-space:nowrap">${e(p || '')}</span></div><div>${e(m || '')}${n ? ` · <span style="color:#64748b">${e(n)}</span>` : ''}</div></div>`).join('')}
      ${lines(v.certificates).length ? h(T.cert) + lines(v.certificates).map((x) => `<div style="margin:4px 0;padding-left:14px;position:relative"><span style="position:absolute;left:0;color:${c}">▸</span>${e(x)}</div>`).join('') : ''}
    </main>
  </div>`;
}

// 3. Minimal ATS-friendly (single column, no graphics)
function minimal(v, T) {
  const c = color(v.color, '#111827');
  const h = (t) => `<div style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:${c};border-bottom:1.5px solid ${c};padding-bottom:3px;margin:18px 0 8px">${t}</div>`;
  return `<div style="font-family:${FONT};color:#111827;padding:48px 56px;font-size:12.5px;line-height:1.5;min-height:1123px;box-sizing:border-box">
    <div style="font-size:30px;font-weight:800;letter-spacing:-.5px">${e(v.fullName)}</div>
    <div style="font-size:14px;color:#374151;margin-top:2px">${e(v.title)}</div>
    <div style="font-size:11.5px;color:#4b5563;margin-top:6px">${contacts(v).map(([, x]) => e(x)).join(' | ')}</div>
    ${v.summary ? h(T.summary) + `<p style="margin:0">${e(v.summary)}</p>` : ''}
    ${h(T.exp)}
    ${rows(v.experience).map(([p, co, role, d]) => `<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between"><span><b>${e(role || '')}</b>, ${e(co || '')}</span><span style="color:#4b5563">${e(p || '')}</span></div>${bullets(d)}</div>`).join('')}
    ${h(T.edu)}
    ${rows(v.education).map(([p, s, m, n]) => `<div style="display:flex;justify-content:space-between;margin-bottom:6px"><span><b>${e(s || '')}</b> – ${e(m || '')}${n ? `. ${e(n)}` : ''}</span><span style="color:#4b5563">${e(p || '')}</span></div>`).join('')}
    ${list(v.skills).length ? h(T.skills) + `<div>${list(v.skills).map((s) => e(skill(s).name)).join(', ')}</div>` : ''}
    ${list(v.languages).length ? h(T.lang) + `<div>${list(v.languages).map(e).join(', ')}</div>` : ''}
    ${lines(v.certificates).length ? h(T.cert) + `<ul style="margin:0;padding-left:18px">${lines(v.certificates).map((x) => `<li>${e(x)}</li>`).join('')}</ul>` : ''}
  </div>`;
}

// 4. Creative (colour header band + timeline)
function creative(v, T) {
  const c = color(v.color, '#0d9488');
  const h = (t) => `<div style="font-size:15px;font-weight:800;color:#0f172a;margin:22px 0 12px"><span style="display:inline-block;width:22px;height:6px;border-radius:9px;background:${c};margin-right:8px;vertical-align:middle"></span>${t}</div>`;
  return `<div style="font-family:${FONT};color:#1e293b;font-size:12.5px;line-height:1.55;min-height:1123px">
    <header style="background:linear-gradient(135deg,${c},#0f172a);color:#fff;padding:40px 44px;display:flex;align-items:center;gap:26px">
      ${avatar(v, 120, 'rgba(255,255,255,.2)', 'rgba(255,255,255,.35)')}
      <div style="flex:1">
        <div style="font-size:34px;font-weight:900;line-height:1.1;letter-spacing:-.5px">${e(v.fullName)}</div>
        <div style="font-size:16px;opacity:.9;margin-top:4px">${e(v.title)}</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px 16px;margin-top:12px;font-size:11.5px;opacity:.9">${contacts(v).map(([i, x]) => `<span>${i} ${e(x)}</span>`).join('')}</div>
      </div>
    </header>
    <div style="display:flex;gap:32px;padding:10px 44px 40px">
      <main style="flex:1.7">
        ${v.summary ? h(T.summary) + `<p style="margin:0;color:#334155">${e(v.summary)}</p>` : ''}
        ${h(T.exp)}
        <div style="border-left:2px solid ${c}33;margin-left:5px;padding-left:20px">
          ${rows(v.experience).map(([p, co, role, d]) => `<div style="position:relative;margin-bottom:16px"><span style="position:absolute;left:-27px;top:3px;width:12px;height:12px;border-radius:50%;background:#fff;border:3px solid ${c};box-sizing:border-box"></span><div style="font-size:11px;font-weight:700;color:${c}">${e(p || '')}</div><b style="font-size:14px;color:#0f172a">${e(role || '')}</b><div style="color:#64748b">${e(co || '')}</div>${bullets(d, 'color:#334155')}</div>`).join('')}
        </div>
      </main>
      <aside style="flex:1">
        ${h(T.edu)}
        ${rows(v.education).map(([p, s, m, n]) => `<div style="margin-bottom:10px"><b style="color:#0f172a">${e(s || '')}</b><div>${e(m || '')}</div><div style="color:#64748b;font-size:11.5px">${e(p || '')}${n ? ` · ${e(n)}` : ''}</div></div>`).join('')}
        ${list(v.skills).length ? h(T.skills) + `<div>${list(v.skills).map((s) => `<span style="display:inline-block;margin:0 6px 6px 0;padding:4px 10px;border-radius:8px;background:${c}14;color:${c};font-weight:600;font-size:11.5px">${e(skill(s).name)}</span>`).join('')}</div>` : ''}
        ${list(v.languages).length ? h(T.lang) + list(v.languages).map((x) => `<div style="margin:4px 0">${e(x)}</div>`).join('') : ''}
        ${lines(v.certificates).length ? h(T.cert) + lines(v.certificates).map((x) => `<div style="margin:6px 0;padding:8px 10px;border-radius:8px;background:#f8fafc;border:1px solid #e2e8f0">🏅 ${e(x)}</div>`).join('') : ''}
      </aside>
    </div>
  </div>`;
}

// 5. Executive (dark top band, right sidebar)
function executive(v, T) {
  const c = color(v.color, '#b45309');
  const h = (t) => `<div style="font-size:12px;font-weight:800;letter-spacing:2.5px;text-transform:uppercase;color:#0f172a;margin:22px 0 10px;padding-left:10px;border-left:4px solid ${c}">${t}</div>`;
  return `<div style="font-family:${FONT};color:#1e293b;font-size:12.5px;line-height:1.55;min-height:1123px;display:flex;flex-direction:column">
    <header style="background:#0f172a;color:#fff;padding:38px 44px;display:flex;justify-content:space-between;align-items:center;gap:20px;border-bottom:6px solid ${c}">
      <div>
        <div style="font-size:36px;font-weight:300;letter-spacing:1px;line-height:1.1">${e(v.fullName).replace(/(\S+)$/, `<b style="font-weight:900;color:${c}">$1</b>`)}</div>
        <div style="font-size:14px;letter-spacing:3px;text-transform:uppercase;opacity:.8;margin-top:8px">${e(v.title)}</div>
      </div>
      ${photoSrc(v.photo) ? avatar(v, 110, c, c) : ''}
    </header>
    <div style="display:flex;flex:1">
      <main style="flex:1.8;padding:12px 32px 40px 44px">
        ${v.summary ? h(T.summary) + `<p style="margin:0;color:#334155">${e(v.summary)}</p>` : ''}
        ${h(T.exp)}
        ${rows(v.experience).map(([p, co, role, d]) => `<div style="margin-bottom:14px"><div style="display:flex;justify-content:space-between;gap:12px"><b style="font-size:14px;color:#0f172a">${e(role || '')}</b><span style="background:${c}1a;color:${c};font-weight:700;font-size:11px;padding:1px 8px;border-radius:6px;white-space:nowrap">${e(p || '')}</span></div><div style="font-weight:600;color:#475569">${e(co || '')}</div>${bullets(d, 'color:#334155')}</div>`).join('')}
        ${h(T.edu)}
        ${rows(v.education).map(([p, s, m, n]) => `<div style="margin-bottom:8px"><b>${e(s || '')}</b> · ${e(m || '')} <span style="color:#64748b">(${e(p || '')})</span>${n ? `<div style="color:#64748b">${e(n)}</div>` : ''}</div>`).join('')}
      </main>
      <aside style="flex:1;background:#f8fafc;padding:12px 28px 40px;border-left:1px solid #e2e8f0">
        ${h(T.contact)}
        ${contacts(v).map(([i, x]) => `<div style="margin:6px 0;word-break:break-word"><span style="color:${c};margin-right:6px">${i}</span>${e(x)}</div>`).join('')}
        ${list(v.skills).length ? h(T.skills) + list(v.skills).map(skill).map((s) => `<div style="display:flex;justify-content:space-between;align-items:center;margin:6px 0"><span>${e(s.name)}</span><span style="letter-spacing:2px;color:${c}">${'●'.repeat(s.level)}<span style="color:#cbd5e1">${'●'.repeat(5 - s.level)}</span></span></div>`).join('') : ''}
        ${list(v.languages).length ? h(T.lang) + list(v.languages).map((x) => `<div style="margin:4px 0">${e(x)}</div>`).join('') : ''}
        ${lines(v.certificates).length ? h(T.cert) + lines(v.certificates).map((x) => `<div style="margin:6px 0">${e(x)}</div>`).join('') : ''}
      </aside>
    </div>
  </div>`;
}

// 7. Right sidebar, light tint
function rightSide(v, T) {
  const c = color(v.color, '#15803d');
  const h = (t) => `<div style="font-size:14px;font-weight:800;color:${c};margin:20px 0 8px">${t}</div>`;
  return `<div style="font-family:${FONT};display:flex;min-height:1123px;color:#1e293b;font-size:12.5px;line-height:1.55">
    <main style="flex:1;padding:44px 32px 40px 48px">
      <div style="font-size:36px;font-weight:900;line-height:1.05;color:#0f172a">${e(v.fullName)}</div>
      <div style="display:inline-block;margin-top:10px;background:${c};color:#fff;padding:3px 12px;border-radius:6px;font-weight:600">${e(v.title)}</div>
      ${v.summary ? h(T.summary) + `<p style="margin:0">${e(v.summary)}</p>` : ''}
      ${h(T.exp)}${rows(v.experience).map(([p, co, role, d]) => `<div style="margin-bottom:14px"><div style="display:flex;justify-content:space-between;gap:12px"><b style="font-size:14px">${e(role || '')}</b><span style="color:#64748b;font-size:11.5px;white-space:nowrap">${e(p || '')}</span></div><div style="color:${c};font-weight:600">${e(co || '')}</div>${bullets(d)}</div>`).join('')}
      ${h(T.edu)}${rows(v.education).map(([p, s, m, n]) => `<div style="margin-bottom:8px"><b>${e(s || '')}</b> – ${e(m || '')} <span style="color:#64748b">(${e(p || '')})</span>${n ? `<div style="color:#64748b">${e(n)}</div>` : ''}</div>`).join('')}
    </main>
    <aside style="width:240px;background:${c}12;padding:44px 24px;flex-shrink:0;border-left:4px solid ${c}">
      <div style="display:flex;justify-content:center">${avatar(v, 120, c, '#fff')}</div>
      ${h(T.contact)}${contacts(v).map(([i, x]) => `<div style="margin:5px 0;word-break:break-word"><span style="color:${c}">${i}</span> ${e(x)}</div>`).join('')}
      ${list(v.skills).length ? h(T.skills) + list(v.skills).map((s) => `<div style="margin:4px 0">✓ ${e(skill(s).name)}</div>`).join('') : ''}
      ${list(v.languages).length ? h(T.lang) + list(v.languages).map((x) => `<div style="margin:4px 0">${e(x)}</div>`).join('') : ''}
      ${lines(v.certificates).length ? h(T.cert) + lines(v.certificates).map((x) => `<div style="margin:5px 0">${e(x)}</div>`).join('') : ''}
    </aside>
  </div>`;
}

// 8. Boxed cards
function boxed(v, T) {
  const c = color(v.color, '#6d28d9');
  const box = (t, body) => `<section style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:14px 18px;margin-bottom:14px;break-inside:avoid"><div style="font-size:13px;font-weight:800;color:${c};margin-bottom:8px">${t}</div>${body}</section>`;
  return `<div style="font-family:${FONT};color:#1e293b;font-size:12.5px;line-height:1.55;min-height:1123px;background:#f8fafc;padding:36px 40px;box-sizing:border-box">
    <header style="display:flex;align-items:center;gap:20px;background:#fff;border-radius:14px;padding:20px 24px;margin-bottom:14px;border-top:5px solid ${c}">
      ${avatar(v, 90, c, `${c}33`)}
      <div style="flex:1"><div style="font-size:28px;font-weight:900;color:#0f172a">${e(v.fullName)}</div><div style="color:${c};font-weight:600;font-size:14px">${e(v.title)}</div></div>
      <div style="font-size:11.5px;text-align:right;color:#475569">${contacts(v).map(([, x]) => e(x)).join('<br>')}</div>
    </header>
    <div style="display:flex;gap:14px">
      <div style="flex:1.7">
        ${v.summary ? box(T.summary, `<p style="margin:0">${e(v.summary)}</p>`) : ''}
        ${box(T.exp, rows(v.experience).map(([p, co, role, d]) => `<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;gap:12px"><b>${e(role || '')}</b><span style="color:#64748b;font-size:11.5px;white-space:nowrap">${e(p || '')}</span></div><div style="color:#64748b">${e(co || '')}</div>${bullets(d)}</div>`).join(''))}
      </div>
      <div style="flex:1">
        ${box(T.edu, rows(v.education).map(([p, s, m, n]) => `<div style="margin-bottom:8px"><b>${e(s || '')}</b><div>${e(m || '')}</div><div style="color:#64748b;font-size:11.5px">${e(p || '')}${n ? ` · ${e(n)}` : ''}</div></div>`).join(''))}
        ${list(v.skills).length ? box(T.skills, list(v.skills).map((s) => `<span style="display:inline-block;margin:0 5px 5px 0;padding:3px 9px;border-radius:999px;background:${c};color:#fff;font-size:11px">${e(skill(s).name)}</span>`).join('')) : ''}
        ${list(v.languages).length ? box(T.lang, list(v.languages).map((x) => `<div>${e(x)}</div>`).join('')) : ''}
        ${lines(v.certificates).length ? box(T.cert, lines(v.certificates).map((x) => `<div style="margin:4px 0">${e(x)}</div>`).join('')) : ''}
      </div>
    </div>
  </div>`;
}

// 9. Developer / monospace
function tech(v, T) {
  const c = color(v.color, '#0d9488');
  const MONO = `'JetBrains Mono',Consolas,'Courier New',monospace`;
  const h = (t) => `<div style="font-family:${MONO};font-size:13px;font-weight:700;color:${c};margin:20px 0 8px">## ${t}</div>`;
  return `<div style="font-family:${FONT};color:#1e293b;font-size:12.5px;line-height:1.55;min-height:1123px">
    <header style="background:#0b1220;color:#e2e8f0;padding:34px 48px;font-family:${MONO}">
      <div style="color:${c};font-size:12px">&#36; whoami</div>
      <div style="font-size:30px;font-weight:700;color:#fff;margin-top:4px;font-family:${FONT}">${e(v.fullName)}</div>
      <div style="font-size:14px;margin-top:2px">&gt; ${e(v.title)}</div>
      <div style="font-size:11.5px;margin-top:10px;color:#94a3b8">${contacts(v).map(([, x]) => e(x)).join('  //  ')}</div>
    </header>
    <div style="padding:6px 48px 40px">
      ${v.summary ? h(T.summary) + `<p style="margin:0">${e(v.summary)}</p>` : ''}
      ${list(v.skills).length ? h(T.skills) + `<div>${list(v.skills).map((s) => `<code style="display:inline-block;margin:0 6px 6px 0;padding:2px 8px;border-radius:4px;background:#0b1220;color:${c === '#111827' ? '#e2e8f0' : c};font-family:${MONO};font-size:11px">${e(skill(s).name)}</code>`).join('')}</div>` : ''}
      ${h(T.exp)}${rows(v.experience).map(([p, co, role, d]) => `<div style="margin-bottom:12px;padding-left:12px;border-left:2px solid ${c}"><div style="display:flex;justify-content:space-between;gap:12px"><b style="font-size:13.5px">${e(role || '')} @ ${e(co || '')}</b><span style="font-family:${MONO};font-size:11px;color:#64748b;white-space:nowrap">${e(p || '')}</span></div>${bullets(d)}</div>`).join('')}
      ${h(T.edu)}${rows(v.education).map(([p, s, m, n]) => `<div style="margin-bottom:6px"><b>${e(s || '')}</b> – ${e(m || '')} <span style="font-family:${MONO};font-size:11px;color:#64748b">${e(p || '')}</span>${n ? ` · ${e(n)}` : ''}</div>`).join('')}
      ${list(v.languages).length ? h(T.lang) + `<div>${list(v.languages).map(e).join(' · ')}</div>` : ''}
      ${lines(v.certificates).length ? h(T.cert) + lines(v.certificates).map((x) => `<div>- ${e(x)}</div>`).join('') : ''}
    </div>
  </div>`;
}

// 11. Fresh graduate (education before experience)
function fresher(v, T) {
  const c = color(v.color, '#db2777');
  const h = (t) => `<div style="margin:20px 0 10px -48px"><span style="display:inline-block;font-size:13px;font-weight:800;color:#fff;background:${c};padding:3px 16px 3px 48px;border-radius:0 999px 999px 0">${t}</span></div>`;
  return `<div style="font-family:${FONT};color:#1e293b;font-size:12.5px;line-height:1.55;min-height:1123px;padding:40px 48px;box-sizing:border-box;overflow:hidden">
    <header style="display:flex;gap:24px;align-items:center">
      ${avatar(v, 120, c, `${c}40`)}
      <div><div style="font-size:32px;font-weight:900;color:#0f172a">${e(v.fullName)}</div><div style="font-size:15px;color:${c};font-weight:700">${e(v.title)}</div>
      <div style="margin-top:8px;font-size:11.5px;color:#475569">${contacts(v).map(([i, x]) => `<div>${i} ${e(x)}</div>`).join('')}</div></div>
    </header>
    ${v.summary ? h(T.summary) + `<p style="margin:0">${e(v.summary)}</p>` : ''}
    ${h(T.edu)}${rows(v.education).map(([p, s, m, n]) => `<div style="margin-bottom:8px"><div style="display:flex;justify-content:space-between;gap:12px"><b style="font-size:13.5px">${e(s || '')}</b><span style="color:#64748b;white-space:nowrap">${e(p || '')}</span></div><div>${e(m || '')}${n ? ` – <b style="color:${c}">${e(n)}</b>` : ''}</div></div>`).join('')}
    ${h(T.exp)}${rows(v.experience).map(([p, co, role, d]) => `<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;gap:12px"><b>${e(role || '')} – ${e(co || '')}</b><span style="color:#64748b;white-space:nowrap">${e(p || '')}</span></div>${bullets(d)}</div>`).join('')}
    <div style="display:flex;gap:32px">
      <div style="flex:1">${list(v.skills).length ? h(T.skills) + list(v.skills).map((s) => `<div style="margin:3px 0">● ${e(skill(s).name)}</div>`).join('') : ''}</div>
      <div style="flex:1">${list(v.languages).length ? h(T.lang) + list(v.languages).map((x) => `<div style="margin:3px 0">● ${e(x)}</div>`).join('') : ''}</div>
    </div>
    ${lines(v.certificates).length ? h(T.cert) + lines(v.certificates).map((x) => `<div style="margin:3px 0">🏆 ${e(x)}</div>`).join('') : ''}
  </div>`;
}

// 12. Bold headline (oversized name, accent bar)
function bold(v, T) {
  const c = color(v.color, '#b45309');
  const h = (t) => `<div style="font-size:20px;font-weight:900;color:#0f172a;margin:22px 0 8px;letter-spacing:-.3px">${t}<span style="color:${c}">.</span></div>`;
  return `<div style="font-family:${FONT};color:#1e293b;font-size:12.5px;line-height:1.55;min-height:1123px;display:flex">
    <div style="width:14px;background:${c};flex-shrink:0"></div>
    <div style="flex:1;padding:44px 48px">
      <div style="display:flex;justify-content:space-between;gap:20px;align-items:flex-start">
        <div><div style="font-size:46px;font-weight:900;line-height:1;letter-spacing:-1.5px;color:#0f172a">${e(v.fullName)}</div><div style="font-size:16px;margin-top:10px;color:${c};font-weight:700">${e(v.title)}</div></div>
        ${photoSrc(v.photo) ? avatar(v, 100, c, c) : ''}
      </div>
      <div style="margin-top:12px;font-size:11.5px;color:#475569">${contacts(v).map(([, x]) => e(x)).join('  /  ')}</div>
      ${v.summary ? h(T.summary) + `<p style="margin:0;font-size:13.5px">${e(v.summary)}</p>` : ''}
      ${h(T.exp)}${rows(v.experience).map(([p, co, role, d]) => `<div style="display:flex;gap:18px;margin-bottom:12px"><div style="width:110px;flex-shrink:0;color:#64748b;font-size:11.5px">${e(p || '')}</div><div style="flex:1"><b style="font-size:13.5px">${e(role || '')}</b><div style="color:${c};font-weight:600">${e(co || '')}</div>${bullets(d)}</div></div>`).join('')}
      ${h(T.edu)}${rows(v.education).map(([p, s, m, n]) => `<div style="display:flex;gap:18px;margin-bottom:8px"><div style="width:110px;flex-shrink:0;color:#64748b;font-size:11.5px">${e(p || '')}</div><div><b>${e(s || '')}</b> – ${e(m || '')}${n ? `<div style="color:#64748b">${e(n)}</div>` : ''}</div></div>`).join('')}
      <div style="display:flex;gap:32px">
        <div style="flex:1">${list(v.skills).length ? h(T.skills) + list(v.skills).map((s) => e(skill(s).name)).join(', ') : ''}</div>
        <div style="flex:1">${list(v.languages).length ? h(T.lang) + list(v.languages).map(e).join('<br>') : ''}</div>
      </div>
      ${lines(v.certificates).length ? h(T.cert) + lines(v.certificates).map((x) => `<div>${e(x)}</div>`).join('') : ''}
    </div>
  </div>`;
}

// ---------- Shared bits for the designs below ----------
const exps = (v) => rows(v.experience).map(([p, co, role, d]) => ({ p: e(p || ''), co: e(co || ''), role: e(role || ''), d }));
const edus = (v) => rows(v.education).map(([p, s, m, n]) => ({ p: e(p || ''), s: e(s || ''), m: e(m || ''), n: e(n || '') }));
const skills = (v) => list(v.skills).map(skill).map((s) => ({ ...s, name: e(s.name) }));
const langs = (v) => list(v.languages).map(e);
const certs = (v) => lines(v.certificates).map(e);
const page = (style, body) => `<div style="font-family:${FONT};color:#1e293b;font-size:12.5px;line-height:1.55;min-height:1123px;box-sizing:border-box;position:relative;overflow:hidden;${style}">${body}</div>`;
// Circular gauge (conic-gradient) for skill levels
const ring = (pct, c, size = 54, track = '#e2e8f0', inner = '#fff') => `<div style="width:${size}px;height:${size}px;border-radius:50%;background:conic-gradient(${c} ${pct}%,${track} 0);display:flex;align-items:center;justify-content:center"><div style="width:${size - 12}px;height:${size - 12}px;border-radius:50%;background:${inner};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:${c}">${pct}%</div></div>`;

// 13. Centre timeline – experience alternates left/right of a vertical line
function timeline(v, T) {
  const c = color(v.color, '#1f55e6');
  const h = (t) => `<div style="text-align:center;margin:24px 0 14px"><span style="background:${c};color:#fff;padding:5px 18px;border-radius:999px;font-weight:800;font-size:12px;letter-spacing:1.5px;text-transform:uppercase">${t}</span></div>`;
  return page('padding:44px 48px', `
    <div style="text-align:center">${avatar(v, 96, c, `${c}33`).replace('flex-shrink:0', 'flex-shrink:0;margin:0 auto')}
      <div style="font-size:32px;font-weight:900;color:#0f172a;margin-top:10px">${e(v.fullName)}</div>
      <div style="color:${c};font-weight:700;font-size:15px">${e(v.title)}</div>
      <div style="font-size:11.5px;color:#64748b;margin-top:6px">${contacts(v).map(([, x]) => e(x)).join(' · ')}</div>
      ${v.summary ? `<p style="max-width:600px;margin:14px auto 0;color:#334155">${e(v.summary)}</p>` : ''}</div>
    ${h(T.exp)}
    <div style="position:relative">
      <div style="position:absolute;left:50%;top:0;bottom:0;width:2px;background:${c}40"></div>
      ${exps(v).map((x, i) => `<div style="display:flex;justify-content:${i % 2 ? 'flex-start' : 'flex-end'};position:relative;margin-bottom:14px">
        <span style="position:absolute;left:50%;top:6px;width:14px;height:14px;margin-left:-7px;border-radius:50%;background:${c};border:3px solid #fff;box-shadow:0 0 0 2px ${c}"></span>
        <div style="width:44%;${i % 2 ? 'margin-left:56%' : 'margin-right:56%'};text-align:${i % 2 ? 'left' : 'right'}">
          <div style="font-size:11px;font-weight:800;color:${c}">${x.p}</div><b style="font-size:13.5px;color:#0f172a">${x.role}</b><div style="color:#64748b">${x.co}</div>${bullets(x.d, `text-align:left;color:#334155;${i % 2 ? '' : 'direction:ltr'}`)}</div></div>`).join('')}
    </div>
    <div style="display:flex;gap:28px">
      <div style="flex:1">${h(T.edu)}${edus(v).map((x) => `<div style="text-align:center;margin-bottom:8px"><b>${x.s}</b><div>${x.m}</div><div style="color:#64748b;font-size:11.5px">${x.p}${x.n ? ` · ${x.n}` : ''}</div></div>`).join('')}</div>
      <div style="flex:1">${h(T.skills)}<div style="text-align:center">${skills(v).map((s) => `<span style="display:inline-block;margin:3px;padding:3px 10px;border:1.5px solid ${c};border-radius:999px;color:${c};font-weight:600;font-size:11px">${s.name}</span>`).join('')}</div>
        ${langs(v).length ? `<div style="text-align:center;margin-top:10px;color:#475569">${langs(v).join(' · ')}</div>` : ''}</div>
    </div>
    ${certs(v).length ? h(T.cert) + `<div style="text-align:center">${certs(v).join('<br>')}</div>` : ''}`);
}

// 14. Infographic – stat tiles and circular skill gauges
function infographic(v, T) {
  const c = color(v.color, '#0d9488');
  const years = exps(v).length;
  const h = (t, icon) => `<div style="display:flex;align-items:center;gap:8px;margin:20px 0 10px"><span style="width:26px;height:26px;border-radius:8px;background:${c};color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px">${icon}</span><b style="font-size:15px;color:#0f172a">${t}</b></div>`;
  const stat = (n, l) => `<div style="flex:1;background:#fff;border-radius:12px;padding:12px;text-align:center"><div style="font-size:26px;font-weight:900;color:${c}">${n}</div><div style="font-size:10.5px;color:#64748b;text-transform:uppercase;letter-spacing:1px">${l}</div></div>`;
  return page('background:#f1f5f9', `
    <header style="background:${c};color:#fff;padding:32px 44px 70px;display:flex;align-items:center;gap:22px">
      ${avatar(v, 100, 'rgba(255,255,255,.2)', 'rgba(255,255,255,.4)')}
      <div><div style="font-size:30px;font-weight:900">${e(v.fullName)}</div><div style="opacity:.9;font-size:15px">${e(v.title)}</div>
      <div style="font-size:11px;opacity:.85;margin-top:6px">${contacts(v).map(([i, x]) => `${i} ${e(x)}`).join('&nbsp;&nbsp; ')}</div></div>
    </header>
    <div style="display:flex;gap:12px;margin:-46px 44px 0">${stat(years, T.exp)}${stat(skills(v).length, T.skills)}${stat(langs(v).length, T.lang)}${stat(certs(v).length, T.cert.split(' & ')[0])}</div>
    <div style="display:flex;gap:24px;padding:4px 44px 40px">
      <main style="flex:1.6">
        ${v.summary ? h(T.summary, '★') + `<p style="margin:0">${e(v.summary)}</p>` : ''}
        ${h(T.exp, '◆')}${exps(v).map((x) => `<div style="background:#fff;border-radius:10px;padding:10px 14px;margin-bottom:8px;border-left:4px solid ${c}"><div style="display:flex;justify-content:space-between;gap:8px"><b>${x.role}</b><span style="font-size:11px;color:#64748b;white-space:nowrap">${x.p}</span></div><div style="color:${c};font-weight:600;font-size:12px">${x.co}</div>${bullets(x.d)}</div>`).join('')}
        ${h(T.edu, '▲')}${edus(v).map((x) => `<div style="background:#fff;border-radius:10px;padding:10px 14px;margin-bottom:8px"><b>${x.s}</b> – ${x.m}<div style="font-size:11px;color:#64748b">${x.p}${x.n ? ` · ${x.n}` : ''}</div></div>`).join('')}
      </main>
      <aside style="flex:1">
        ${h(T.skills, '●')}<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">${skills(v).map((s) => `<div style="background:#fff;border-radius:10px;padding:8px;display:flex;flex-direction:column;align-items:center;gap:4px">${ring(s.level * 20, c)}<div style="font-size:10.5px;text-align:center;font-weight:600">${s.name}</div></div>`).join('')}</div>
        ${langs(v).length ? h(T.lang, '✦') + langs(v).map((x) => `<div style="background:#fff;border-radius:8px;padding:6px 10px;margin-bottom:6px">${x}</div>`).join('') : ''}
        ${certs(v).length ? h(T.cert, '✓') + certs(v).map((x) => `<div style="font-size:11.5px;margin-bottom:6px">🏅 ${x}</div>`).join('') : ''}
      </aside>
    </div>`);
}

// 15. Magazine – giant initial, serif masthead, three newspaper columns
function magazine(v, T) {
  const c = color(v.color, '#9f1239');
  const h = (t) => `<div style="font-family:${SERIF};font-size:16px;font-style:italic;color:${c};border-bottom:1px solid #1c1917;margin:14px 0 6px;padding-bottom:2px">${t}</div>`;
  const first = e(String(v.fullName || ' ').trim().split(/\s+/).pop()[0] || '');
  return page('padding:44px 48px;background:#fffdf8;color:#1c1917', `
    <div style="border-top:6px double #1c1917;border-bottom:1px solid #1c1917;padding:10px 0;display:flex;justify-content:space-between;font-size:10.5px;letter-spacing:2px;text-transform:uppercase"><span>Curriculum Vitae</span><span>${contacts(v).map(([, x]) => e(x)).slice(0, 2).join(' · ')}</span></div>
    <div style="display:flex;align-items:center;gap:18px;margin:16px 0 10px">
      <div style="font-family:${SERIF};font-size:120px;line-height:.8;color:${c};font-weight:700">${first}</div>
      <div><div style="font-family:${SERIF};font-size:42px;line-height:1;font-weight:700">${e(v.fullName)}</div><div style="font-size:13px;letter-spacing:4px;text-transform:uppercase;margin-top:8px">${e(v.title)}</div></div>
      ${photoSrc(v.photo) ? `<div style="margin-left:auto">${avatar(v, 96, c, '#1c1917')}</div>` : ''}
    </div>
    ${v.summary ? `<p style="font-family:${SERIF};font-size:15px;font-style:italic;border-top:1px solid #1c1917;border-bottom:1px solid #1c1917;padding:10px 0;margin:0">“${e(v.summary)}”</p>` : ''}
    <div style="column-count:3;column-gap:24px;column-rule:1px solid #d6d3d1;margin-top:8px">
      ${h(T.exp)}${exps(v).map((x) => `<div style="break-inside:avoid;margin-bottom:10px"><b style="font-family:${SERIF};font-size:13.5px">${x.role}</b><div style="font-size:11px;color:${c}">${x.co} · ${x.p}</div>${bullets(x.d, 'font-size:12px')}</div>`).join('')}
      ${h(T.edu)}${edus(v).map((x) => `<div style="break-inside:avoid;margin-bottom:8px"><b>${x.s}</b><div>${x.m}</div><div style="font-size:11px;color:#78716c">${x.p}${x.n ? ` · ${x.n}` : ''}</div></div>`).join('')}
      ${h(T.skills)}${skills(v).map((s) => `<div>${s.name} <span style="color:${c}">${'★'.repeat(s.level)}</span></div>`).join('')}
      ${langs(v).length ? h(T.lang) + langs(v).join('<br>') : ''}
      ${certs(v).length ? h(T.cert) + certs(v).map((x) => `<div style="margin-bottom:4px">${x}</div>`).join('') : ''}
      ${h(T.contact)}${contacts(v).map(([, x]) => `<div>${e(x)}</div>`).join('')}
    </div>`);
}

// 16. Diagonal – angled colour header with overlapping photo
function diagonal(v, T) {
  const c = color(v.color, '#6d28d9');
  const h = (t) => `<div style="font-size:14px;font-weight:900;color:#0f172a;margin:18px 0 8px;display:flex;align-items:center;gap:8px"><span style="width:10px;height:10px;background:${c};transform:rotate(45deg);display:inline-block"></span>${t}</div>`;
  return page('', `
    <div style="height:210px;background:linear-gradient(120deg,${c},${c}cc);clip-path:polygon(0 0,100% 0,100% 62%,0 100%);color:#fff;padding:40px 48px;box-sizing:border-box">
      <div style="font-size:36px;font-weight:900;letter-spacing:-.5px">${e(v.fullName)}</div>
      <div style="font-size:15px;opacity:.9">${e(v.title)}</div>
    </div>
    <div style="position:absolute;right:56px;top:120px">${avatar(v, 130, c, '#fff')}</div>
    <div style="padding:0 48px 40px;margin-top:-10px">
      <div style="font-size:11.5px;color:#475569;max-width:480px">${contacts(v).map(([i, x]) => `<div>${i} ${e(x)}</div>`).join('')}</div>
      ${v.summary ? h(T.summary) + `<p style="margin:0;max-width:640px">${e(v.summary)}</p>` : ''}
      <div style="display:flex;gap:30px">
        <main style="flex:1.6">${h(T.exp)}${exps(v).map((x) => `<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;gap:10px"><b style="font-size:13.5px">${x.role}</b><span style="color:${c};font-weight:700;font-size:11px;white-space:nowrap">${x.p}</span></div><div style="color:#64748b">${x.co}</div>${bullets(x.d)}</div>`).join('')}
          ${h(T.edu)}${edus(v).map((x) => `<div style="margin-bottom:8px"><b>${x.s}</b> – ${x.m} <span style="color:#64748b">(${x.p})</span>${x.n ? `<div style="color:#64748b">${x.n}</div>` : ''}</div>`).join('')}</main>
        <aside style="flex:1;background:${c}0d;border-radius:0 0 0 40px;padding:4px 18px 18px">
          ${h(T.skills)}${skills(v).map((s) => `<div style="margin:6px 0">${s.name}<div style="display:flex;gap:3px;margin-top:3px">${[1, 2, 3, 4, 5].map((i) => `<span style="flex:1;height:5px;background:${i <= s.level ? c : '#ddd6fe'};transform:skewX(-20deg)"></span>`).join('')}</div></div>`).join('')}
          ${langs(v).length ? h(T.lang) + langs(v).map((x) => `<div>${x}</div>`).join('') : ''}
          ${certs(v).length ? h(T.cert) + certs(v).map((x) => `<div style="margin:4px 0;font-size:11.5px">${x}</div>`).join('') : ''}
        </aside>
      </div>
    </div>`);
}

// 17. Polaroid – tilted photo, sticky-note skills, warm paper
function polaroid(v, T) {
  const c = color(v.color, '#b45309');
  const HAND = `'Segoe Print','Comic Sans MS','Bradley Hand',cursive`;
  const h = (t) => `<div style="font-family:${HAND};font-size:20px;color:${c};margin:18px 0 6px">${t}</div>`;
  const notes = ['#fef08a', '#bbf7d0', '#bfdbfe', '#fbcfe8', '#fed7aa'];
  const src = photoSrc(v.photo);
  return page('background:#fbf7f0;padding:44px 48px', `
    <div style="display:flex;gap:30px;align-items:center">
      <div style="background:#fff;padding:10px 10px 34px;box-shadow:0 6px 18px rgba(0,0,0,.15);transform:rotate(-4deg);flex-shrink:0">
        ${src ? `<img src="${src}" alt="" style="width:150px;height:150px;object-fit:cover;display:block" />` : `<div style="width:150px;height:150px;background:${c};color:#fff;display:flex;align-items:center;justify-content:center;font-size:52px;font-weight:900">${e(initials(v.fullName))}</div>`}
        <div style="font-family:${HAND};text-align:center;margin-top:6px;font-size:13px">${e(String(v.fullName || '').split(/\s+/).pop())}</div>
      </div>
      <div><div style="font-size:36px;font-weight:900;color:#292524">${e(v.fullName)}</div>
        <div style="font-family:${HAND};font-size:20px;color:${c}">${e(v.title)}</div>
        <div style="font-size:11.5px;color:#57534e;margin-top:8px">${contacts(v).map(([i, x]) => `<div>${i} ${e(x)}</div>`).join('')}</div></div>
    </div>
    ${v.summary ? h(T.summary) + `<p style="margin:0">${e(v.summary)}</p>` : ''}
    ${h(T.exp)}${exps(v).map((x) => `<div style="margin-bottom:12px;padding-left:14px;border-left:3px dashed ${c}80"><b style="font-size:13.5px">${x.role}</b> · ${x.co} <span style="color:#78716c;font-size:11px">(${x.p})</span>${bullets(x.d)}</div>`).join('')}
    ${h(T.skills)}<div>${skills(v).map((s, i) => `<span style="display:inline-block;background:${notes[i % notes.length]};padding:8px 12px;margin:0 8px 8px 0;transform:rotate(${(i % 3) - 1}deg);box-shadow:0 2px 4px rgba(0,0,0,.1);font-weight:600;font-size:11.5px">${s.name}</span>`).join('')}</div>
    <div style="display:flex;gap:28px">
      <div style="flex:1">${h(T.edu)}${edus(v).map((x) => `<div style="margin-bottom:6px"><b>${x.s}</b> – ${x.m}<div style="font-size:11px;color:#78716c">${x.p}${x.n ? ` · ${x.n}` : ''}</div></div>`).join('')}</div>
      <div style="flex:1">${langs(v).length ? h(T.lang) + langs(v).join('<br>') : ''}${certs(v).length ? h(T.cert) + certs(v).join('<br>') : ''}</div>
    </div>`);
}

// 18. Dark neon – full dark page with glowing accent
function dark(v, T) {
  const c = color(v.color, '#22d3ee');
  const glow = c === '#111827' ? '#e2e8f0' : c;
  const h = (t) => `<div style="font-size:12px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:${glow};margin:22px 0 10px;text-shadow:0 0 12px ${glow}80">${t}</div>`;
  return page(`background:#0b1020;color:#cbd5e1;padding:44px 48px`, `
    <div style="display:flex;justify-content:space-between;align-items:center;gap:20px">
      <div><div style="font-size:38px;font-weight:900;color:#fff;letter-spacing:-.5px">${e(v.fullName)}</div><div style="font-size:15px;color:${glow}">${e(v.title)}</div></div>
      ${avatar(v, 100, '#1e293b', glow)}
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:6px 18px;margin-top:12px;font-size:11.5px;color:#94a3b8">${contacts(v).map(([i, x]) => `<span>${i} ${e(x)}</span>`).join('')}</div>
    ${v.summary ? h(T.summary) + `<p style="margin:0">${e(v.summary)}</p>` : ''}
    <div style="display:flex;gap:28px">
      <main style="flex:1.7">${h(T.exp)}${exps(v).map((x) => `<div style="margin-bottom:12px;padding:12px 14px;border:1px solid #1e293b;border-radius:10px;background:#0f172a"><div style="display:flex;justify-content:space-between;gap:10px"><b style="color:#fff;font-size:13.5px">${x.role}</b><span style="color:${glow};font-size:11px;white-space:nowrap">${x.p}</span></div><div style="color:#94a3b8">${x.co}</div>${bullets(x.d)}</div>`).join('')}</main>
      <aside style="flex:1">${h(T.skills)}${skills(v).map((s) => `<div style="margin:7px 0">${s.name}<div style="height:4px;background:#1e293b;border-radius:9px;margin-top:4px"><div style="height:4px;width:${s.level * 20}%;background:${glow};border-radius:9px;box-shadow:0 0 8px ${glow}"></div></div></div>`).join('')}
        ${h(T.edu)}${edus(v).map((x) => `<div style="margin-bottom:8px"><b style="color:#fff">${x.s}</b><div>${x.m}</div><div style="font-size:11px;color:#64748b">${x.p}${x.n ? ` · ${x.n}` : ''}</div></div>`).join('')}
        ${langs(v).length ? h(T.lang) + langs(v).join('<br>') : ''}
        ${certs(v).length ? h(T.cert) + certs(v).map((x) => `<div style="margin-bottom:5px;font-size:11.5px">${x}</div>`).join('') : ''}</aside>
    </div>`);
}

// 19. Vertical name – giant rotated name in a colour column
function vertical(v, T) {
  const c = color(v.color, '#15803d');
  const h = (t) => `<div style="font-size:22px;font-weight:300;color:${c};margin:20px 0 8px">${t}</div>`;
  return page('display:flex', `
    <div style="width:150px;background:${c};flex-shrink:0;display:flex;flex-direction:column;align-items:center;padding:36px 0">
      ${avatar(v, 96, 'rgba(255,255,255,.2)', 'rgba(255,255,255,.5)')}
      <div style="writing-mode:vertical-rl;transform:rotate(180deg);color:#fff;font-size:54px;font-weight:900;letter-spacing:2px;margin-top:30px;white-space:nowrap">${e(v.fullName)}</div>
    </div>
    <div style="flex:1;padding:40px 44px">
      <div style="font-size:13px;letter-spacing:4px;text-transform:uppercase;color:#64748b">${e(v.title)}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 18px;margin-top:10px;font-size:11.5px">${contacts(v).map(([i, x]) => `<span><b style="color:${c}">${i}</b> ${e(x)}</span>`).join('')}</div>
      ${v.summary ? h(T.summary) + `<p style="margin:0">${e(v.summary)}</p>` : ''}
      ${h(T.exp)}${exps(v).map((x) => `<div style="display:grid;grid-template-columns:100px 1fr;gap:14px;margin-bottom:12px"><div style="font-size:11px;color:#64748b;padding-top:2px">${x.p}</div><div><b style="font-size:13.5px">${x.role}</b><div style="color:${c};font-weight:600">${x.co}</div>${bullets(x.d)}</div></div>`).join('')}
      ${h(T.edu)}${edus(v).map((x) => `<div style="display:grid;grid-template-columns:100px 1fr;gap:14px;margin-bottom:8px"><div style="font-size:11px;color:#64748b">${x.p}</div><div><b>${x.s}</b> – ${x.m}${x.n ? `<div style="color:#64748b">${x.n}</div>` : ''}</div></div>`).join('')}
      <div style="display:flex;gap:30px">
        <div style="flex:1">${h(T.skills)}${skills(v).map((s) => s.name).join(' / ')}</div>
        <div style="flex:1">${langs(v).length ? h(T.lang) + langs(v).join('<br>') : ''}</div>
      </div>
      ${certs(v).length ? h(T.cert) + certs(v).join('<br>') : ''}
    </div>`);
}

// 20. Ribbon – section titles as folded ribbons
function ribbon(v, T) {
  const c = color(v.color, '#be123c');
  const h = (t) => `<div style="position:relative;margin:22px 0 10px -58px;display:inline-block"><div style="background:${c};color:#fff;font-weight:800;font-size:12.5px;letter-spacing:1.5px;text-transform:uppercase;padding:6px 22px 6px 58px">${t}</div><div style="position:absolute;left:0;bottom:-10px;width:0;height:0;border-top:10px solid ${c};border-left:10px solid transparent;filter:brightness(.6)"></div></div>`;
  return page('padding:40px 58px', `
    <div style="display:flex;align-items:center;gap:24px;border-bottom:3px solid ${c};padding-bottom:18px">
      ${avatar(v, 110, c, `${c}30`)}
      <div style="flex:1"><div style="font-size:34px;font-weight:900;color:#0f172a">${e(v.fullName)}</div><div style="font-size:15px;color:${c};font-weight:700">${e(v.title)}</div></div>
      <div style="font-size:11.5px;color:#475569;text-align:right">${contacts(v).map(([, x]) => e(x)).join('<br>')}</div>
    </div>
    ${v.summary ? h(T.summary) + `<p style="margin:0">${e(v.summary)}</p>` : ''}
    ${h(T.exp)}${exps(v).map((x) => `<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;gap:10px"><b style="font-size:13.5px">${x.role} – ${x.co}</b><span style="color:#64748b;white-space:nowrap">${x.p}</span></div>${bullets(x.d)}</div>`).join('')}
    ${h(T.edu)}${edus(v).map((x) => `<div style="display:flex;justify-content:space-between;gap:10px;margin-bottom:6px"><span><b>${x.s}</b> – ${x.m}${x.n ? `, ${x.n}` : ''}</span><span style="color:#64748b;white-space:nowrap">${x.p}</span></div>`).join('')}
    <div style="display:flex;gap:30px">
      <div style="flex:1">${h(T.skills)}<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px">${skills(v).map((s) => `<span>▸ ${s.name}</span>`).join('')}</div></div>
      <div style="flex:1">${langs(v).length ? h(T.lang) + langs(v).join('<br>') : ''}</div>
    </div>
    ${certs(v).length ? h(T.cert) + certs(v).join('<br>') : ''}`);
}

// 21. Zen – narrow centred column, lots of white space
function zen(v, T) {
  const c = color(v.color, '#334155');
  const h = (t) => `<div style="font-size:10.5px;letter-spacing:5px;text-transform:uppercase;color:${c};margin:28px 0 10px;text-align:center">— ${t} —</div>`;
  return page('padding:70px 0', `
    <div style="width:520px;margin:0 auto">
      <div style="text-align:center;font-size:30px;font-weight:300;letter-spacing:6px;text-transform:uppercase;color:#0f172a">${e(v.fullName)}</div>
      <div style="width:40px;height:2px;background:${c};margin:14px auto"></div>
      <div style="text-align:center;font-size:12px;letter-spacing:3px;color:#64748b">${e(v.title)}</div>
      <div style="text-align:center;font-size:11px;color:#94a3b8;margin-top:10px">${contacts(v).map(([, x]) => e(x)).join('  ·  ')}</div>
      ${v.summary ? h(T.summary) + `<p style="text-align:center;margin:0;color:#475569">${e(v.summary)}</p>` : ''}
      ${h(T.exp)}${exps(v).map((x) => `<div style="margin-bottom:16px;text-align:center"><div style="font-weight:700;color:#0f172a">${x.role}</div><div style="font-size:11.5px;color:#64748b">${x.co} · ${x.p}</div>${bullets(x.d, 'text-align:left;color:#475569')}</div>`).join('')}
      ${h(T.edu)}${edus(v).map((x) => `<div style="text-align:center;margin-bottom:8px"><b>${x.s}</b><div style="font-size:11.5px;color:#64748b">${x.m} · ${x.p}${x.n ? ` · ${x.n}` : ''}</div></div>`).join('')}
      ${h(T.skills)}<div style="text-align:center;color:#475569">${skills(v).map((s) => s.name).join('  ·  ')}</div>
      ${langs(v).length ? h(T.lang) + `<div style="text-align:center;color:#475569">${langs(v).join('  ·  ')}</div>` : ''}
      ${certs(v).length ? h(T.cert) + `<div style="text-align:center;color:#475569">${certs(v).join('<br>')}</div>` : ''}
    </div>`);
}

// 23. Two-tone – colour top half holding the profile, white bottom
function twotone(v, T) {
  const c = color(v.color, '#0f766e');
  const h = (t, light) => `<div style="font-size:12px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:${light ? '#fff' : c};margin:16px 0 8px;opacity:${light ? '.85' : '1'}">${t}</div>`;
  return page('', `
    <div style="background:${c};color:#fff;padding:40px 48px 30px;display:grid;grid-template-columns:auto 1fr 1fr;gap:26px;align-items:start">
      ${avatar(v, 120, 'rgba(255,255,255,.2)', 'rgba(255,255,255,.35)')}
      <div><div style="font-size:30px;font-weight:900;line-height:1.1">${e(v.fullName)}</div><div style="font-size:14px;opacity:.9;margin-top:4px">${e(v.title)}</div>
        ${h(T.contact, 1)}<div style="font-size:11.5px">${contacts(v).map(([i, x]) => `<div>${i} ${e(x)}</div>`).join('')}</div></div>
      <div>${v.summary ? h(T.summary, 1) + `<p style="margin:0;font-size:12px">${e(v.summary)}</p>` : ''}</div>
    </div>
    <div style="display:flex;gap:30px;padding:10px 48px 40px">
      <main style="flex:1.7">${h(T.exp)}${exps(v).map((x) => `<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;gap:10px"><b style="font-size:13.5px">${x.role}</b><span style="background:${c}14;color:${c};font-size:11px;padding:1px 8px;border-radius:6px;white-space:nowrap">${x.p}</span></div><div style="color:#64748b">${x.co}</div>${bullets(x.d)}</div>`).join('')}
        ${h(T.edu)}${edus(v).map((x) => `<div style="margin-bottom:8px"><b>${x.s}</b> – ${x.m} <span style="color:#64748b">(${x.p})</span>${x.n ? `<div style="color:#64748b">${x.n}</div>` : ''}</div>`).join('')}</main>
      <aside style="flex:1">${h(T.skills)}${skills(v).map((s) => `<div style="display:flex;justify-content:space-between;border-bottom:1px dotted #cbd5e1;padding:4px 0"><span>${s.name}</span><b style="color:${c}">${s.level}/5</b></div>`).join('')}
        ${langs(v).length ? h(T.lang) + langs(v).join('<br>') : ''}
        ${certs(v).length ? h(T.cert) + certs(v).map((x) => `<div style="margin:4px 0;font-size:11.5px">${x}</div>`).join('') : ''}</aside>
    </div>`);
}

// 24. Gauge sidebar – circular skill meters in a dark column
function gauges(v, T) {
  const c = color(v.color, '#f59e0b');
  const hi = c === '#111827' ? '#e2e8f0' : c;
  const h = (t, d) => `<div style="font-size:13px;font-weight:800;color:${d ? '#fff' : '#0f172a'};margin:20px 0 10px;padding-bottom:4px;border-bottom:2px solid ${hi}">${t}</div>`;
  return page('display:flex', `
    <aside style="width:250px;background:#1f2937;color:#e5e7eb;padding:36px 22px;flex-shrink:0">
      <div style="display:flex;justify-content:center">${avatar(v, 120, '#374151', hi)}</div>
      ${h(T.contact, 1)}${contacts(v).map(([i, x]) => `<div style="margin:5px 0;font-size:11.5px;word-break:break-word"><span style="color:${hi}">${i}</span> ${e(x)}</div>`).join('')}
      ${h(T.skills, 1)}<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">${skills(v).map((s) => `<div style="display:flex;flex-direction:column;align-items:center;gap:4px">${ring(s.level * 20, hi, 60, '#374151', '#1f2937')}<span style="font-size:10.5px;text-align:center">${s.name}</span></div>`).join('')}</div>
      ${langs(v).length ? h(T.lang, 1) + langs(v).map((x) => `<div style="font-size:11.5px;margin:4px 0">${x}</div>`).join('') : ''}
    </aside>
    <main style="flex:1;padding:44px 40px">
      <div style="font-size:36px;font-weight:900;color:#0f172a;line-height:1.05">${e(v.fullName)}</div>
      <div style="font-size:15px;font-weight:700;color:${c === '#111827' ? '#475569' : c};margin-top:6px">${e(v.title)}</div>
      ${v.summary ? h(T.summary) + `<p style="margin:0">${e(v.summary)}</p>` : ''}
      ${h(T.exp)}${exps(v).map((x) => `<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;gap:10px"><b style="font-size:13.5px">${x.role}</b><span style="color:#64748b;font-size:11px;white-space:nowrap">${x.p}</span></div><div style="font-weight:600;color:#475569">${x.co}</div>${bullets(x.d)}</div>`).join('')}
      ${h(T.edu)}${edus(v).map((x) => `<div style="margin-bottom:8px"><b>${x.s}</b> – ${x.m} <span style="color:#64748b">(${x.p})</span>${x.n ? `<div style="color:#64748b">${x.n}</div>` : ''}</div>`).join('')}
      ${certs(v).length ? h(T.cert) + certs(v).map((x) => `<div style="margin:4px 0">✔ ${x}</div>`).join('') : ''}
    </main>`);
}

// 25. Frame – double border with corner ornaments, certificate feel
function frame(v, T) {
  const c = color(v.color, '#854d0e');
  const corner = (pos) => `<div style="position:absolute;${pos};width:34px;height:34px;border:3px solid ${c}"></div>`;
  const h = (t) => `<div style="text-align:center;font-family:${SERIF};font-size:15px;letter-spacing:3px;color:${c};margin:18px 0 8px">❖ ${t} ❖</div>`;
  return page('padding:28px', `
    <div style="border:2px solid ${c};outline:1px solid ${c};outline-offset:5px;min-height:1055px;padding:40px 46px;box-sizing:border-box;position:relative">
      ${corner('top:-9px;left:-9px;border-right:none;border-bottom:none')}${corner('top:-9px;right:-9px;border-left:none;border-bottom:none')}${corner('bottom:-9px;left:-9px;border-right:none;border-top:none')}${corner('bottom:-9px;right:-9px;border-left:none;border-top:none')}
      <div style="text-align:center">
        ${photoSrc(v.photo) ? `<div style="display:flex;justify-content:center;margin-bottom:10px">${avatar(v, 96, c, c)}</div>` : ''}
        <div style="font-family:${SERIF};font-size:36px;color:#1c1917">${e(v.fullName)}</div>
        <div style="font-family:${SERIF};font-style:italic;color:${c};font-size:15px">${e(v.title)}</div>
        <div style="font-size:11.5px;color:#57534e;margin-top:8px">${contacts(v).map(([, x]) => e(x)).join('  ◆  ')}</div>
      </div>
      ${v.summary ? h(T.summary) + `<p style="text-align:center;margin:0;font-style:italic">${e(v.summary)}</p>` : ''}
      ${h(T.exp)}${exps(v).map((x) => `<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;gap:10px"><b>${x.role}, ${x.co}</b><i style="color:#78716c;white-space:nowrap">${x.p}</i></div>${bullets(x.d)}</div>`).join('')}
      ${h(T.edu)}${edus(v).map((x) => `<div style="display:flex;justify-content:space-between;gap:10px;margin-bottom:6px"><span><b>${x.s}</b> – ${x.m}${x.n ? `, ${x.n}` : ''}</span><i style="color:#78716c;white-space:nowrap">${x.p}</i></div>`).join('')}
      ${h(T.skills)}<div style="text-align:center">${skills(v).map((s) => s.name).join('  ◆  ')}</div>
      ${langs(v).length ? h(T.lang) + `<div style="text-align:center">${langs(v).join('  ◆  ')}</div>` : ''}
      ${certs(v).length ? h(T.cert) + `<div style="text-align:center">${certs(v).join('<br>')}</div>` : ''}
    </div>`);
}

// 26. Glass – gradient backdrop with frosted white cards
function glass(v, T) {
  const c = color(v.color, '#7c3aed');
  const card = (t, body) => `<section style="background:rgba(255,255,255,.88);border-radius:16px;padding:14px 18px;margin-bottom:14px;box-shadow:0 8px 24px rgba(15,23,42,.12)"><div style="font-size:13px;font-weight:800;color:${c};margin-bottom:8px">${t}</div>${body}</section>`;
  return page(`background:linear-gradient(135deg,${c} 0%,${c}99 45%,#f0abfc 100%);padding:36px 40px`, `
    <div style="display:flex;align-items:center;gap:22px;color:#fff;margin-bottom:20px">
      ${avatar(v, 110, 'rgba(255,255,255,.25)', 'rgba(255,255,255,.6)')}
      <div><div style="font-size:34px;font-weight:900;line-height:1.1">${e(v.fullName)}</div><div style="font-size:15px;opacity:.95">${e(v.title)}</div>
      <div style="font-size:11.5px;margin-top:8px;opacity:.9">${contacts(v).map(([i, x]) => `${i} ${e(x)}`).join('&nbsp;&nbsp; ')}</div></div>
    </div>
    <div style="display:flex;gap:14px">
      <div style="flex:1.7">${v.summary ? card(T.summary, `<p style="margin:0">${e(v.summary)}</p>`) : ''}
        ${card(T.exp, exps(v).map((x) => `<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;gap:10px"><b>${x.role}</b><span style="font-size:11px;color:#64748b;white-space:nowrap">${x.p}</span></div><div style="color:${c};font-weight:600;font-size:12px">${x.co}</div>${bullets(x.d)}</div>`).join(''))}</div>
      <div style="flex:1">${card(T.skills, skills(v).map((s) => `<div style="margin:6px 0">${s.name}<div style="height:6px;background:#ede9fe;border-radius:9px;margin-top:3px"><div style="height:6px;width:${s.level * 20}%;background:linear-gradient(90deg,${c},#f0abfc);border-radius:9px"></div></div></div>`).join(''))}
        ${card(T.edu, edus(v).map((x) => `<div style="margin-bottom:6px"><b>${x.s}</b><div>${x.m}</div><div style="font-size:11px;color:#64748b">${x.p}${x.n ? ` · ${x.n}` : ''}</div></div>`).join(''))}
        ${langs(v).length ? card(T.lang, langs(v).join('<br>')) : ''}
        ${certs(v).length ? card(T.cert, certs(v).map((x) => `<div style="font-size:11.5px;margin:3px 0">${x}</div>`).join('')) : ''}</div>
    </div>`);
}

// 27. Dense grid – label column + compact rows, for long careers
function dense(v, T) {
  const c = color(v.color, '#1d4ed8');
  const row = (label, body) => `<tr><td style="width:120px;vertical-align:top;padding:8px 12px 8px 0;font-weight:800;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${c};border-top:1px solid #e2e8f0">${label}</td><td style="padding:8px 0;border-top:1px solid #e2e8f0">${body}</td></tr>`;
  return page('padding:40px 48px;font-size:12px', `
    <div style="display:flex;align-items:center;gap:18px;margin-bottom:14px">
      <div style="width:64px;height:64px;background:${c};color:#fff;font-weight:900;font-size:24px;display:flex;align-items:center;justify-content:center;border-radius:6px">${e(initials(v.fullName))}</div>
      <div style="flex:1"><div style="font-size:26px;font-weight:900;color:#0f172a">${e(v.fullName)}</div><div style="color:#475569">${e(v.title)}</div></div>
    </div>
    <table style="width:100%;border-collapse:collapse">
      ${row(T.contact, contacts(v).map(([i, x]) => `${i} ${e(x)}`).join('&nbsp;&nbsp;&nbsp;'))}
      ${v.summary ? row(T.summary, e(v.summary)) : ''}
      ${row(T.exp, `<table style="width:100%;border-collapse:collapse">${exps(v).map((x) => `<tr><td style="width:105px;vertical-align:top;color:#64748b;padding:2px 0 8px">${x.p}</td><td style="padding:2px 0 8px"><b>${x.role}</b> · ${x.co}${bullets(x.d)}</td></tr>`).join('')}</table>`)}
      ${row(T.edu, edus(v).map((x) => `<div><span style="color:#64748b;display:inline-block;width:105px">${x.p}</span><b>${x.s}</b> – ${x.m}${x.n ? `, ${x.n}` : ''}</div>`).join(''))}
      ${row(T.skills, `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:3px 12px">${skills(v).map((s) => `<span>${s.name} <span style="color:${c}">${'■'.repeat(s.level)}</span><span style="color:#cbd5e1">${'■'.repeat(5 - s.level)}</span></span>`).join('')}</div>`)}
      ${langs(v).length ? row(T.lang, langs(v).join(' · ')) : ''}
      ${certs(v).length ? row(T.cert, certs(v).join('<br>')) : ''}
    </table>`);
}

// 28. Organic – soft colour blobs, rounded everything
function organic(v, T) {
  const c = color(v.color, '#db2777');
  const h = (t) => `<div style="display:inline-block;font-size:13px;font-weight:800;color:${c};background:${c}14;padding:4px 14px;border-radius:999px;margin:18px 0 8px">${t}</div>`;
  return page('padding:46px 50px;background:#fffbfd', `
    <div style="position:absolute;top:-120px;right:-100px;width:360px;height:360px;border-radius:50%;background:radial-gradient(circle,${c}40,transparent 70%)"></div>
    <div style="position:absolute;bottom:-140px;left:-120px;width:380px;height:380px;border-radius:50%;background:radial-gradient(circle,${c}26,transparent 70%)"></div>
    <div style="position:relative">
      <div style="display:flex;align-items:center;gap:24px">
        ${avatar(v, 124, c, '#fff')}
        <div><div style="font-size:34px;font-weight:900;color:#0f172a">${e(v.fullName)}</div><div style="font-size:15px;color:${c};font-weight:700">${e(v.title)}</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:10px">${contacts(v).map(([i, x]) => `<span style="background:#fff;border:1px solid ${c}30;border-radius:999px;padding:3px 10px;font-size:11px">${i} ${e(x)}</span>`).join('')}</div></div>
      </div>
      ${v.summary ? h(T.summary) + `<p style="margin:0">${e(v.summary)}</p>` : ''}
      <div style="display:flex;gap:28px">
        <main style="flex:1.6">${h(T.exp)}${exps(v).map((x) => `<div style="background:#fff;border-radius:18px;padding:12px 16px;margin-bottom:10px;box-shadow:0 2px 10px ${c}14"><div style="display:flex;justify-content:space-between;gap:10px"><b>${x.role}</b><span style="font-size:11px;color:${c};white-space:nowrap">${x.p}</span></div><div style="color:#64748b">${x.co}</div>${bullets(x.d)}</div>`).join('')}</main>
        <aside style="flex:1">${h(T.skills)}<div>${skills(v).map((s) => `<span style="display:inline-block;margin:0 6px 6px 0;padding:5px 12px;border-radius:999px;background:${c};color:#fff;font-size:11px;opacity:${0.5 + s.level / 10}">${s.name}</span>`).join('')}</div>
          ${h(T.edu)}${edus(v).map((x) => `<div style="margin-bottom:8px"><b>${x.s}</b><div>${x.m}</div><div style="font-size:11px;color:#64748b">${x.p}${x.n ? ` · ${x.n}` : ''}</div></div>`).join('')}
          ${langs(v).length ? h(T.lang) + langs(v).join('<br>') : ''}
          ${certs(v).length ? h(T.cert) + certs(v).map((x) => `<div style="font-size:11.5px;margin:4px 0">${x}</div>`).join('') : ''}</aside>
      </div>
    </div>`);
}

// 29. Monogram – diamond initials badge, corporate band
function monogram(v, T) {
  const c = color(v.color, '#1e3a5f');
  const h = (t) => `<div style="font-size:12.5px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#0f172a;margin:20px 0 8px;display:flex;align-items:center;gap:10px"><span style="width:22px;height:2px;background:${c}"></span>${t}</div>`;
  return page('', `
    <div style="background:#f8fafc;border-bottom:1px solid #e2e8f0;padding:36px 48px;display:flex;align-items:center;gap:30px">
      <div style="width:84px;height:84px;transform:rotate(45deg);background:${c};display:flex;align-items:center;justify-content:center;flex-shrink:0;margin:8px">
        <span style="transform:rotate(-45deg);color:#fff;font-size:26px;font-weight:900;letter-spacing:1px">${e(initials(v.fullName))}</span></div>
      <div style="flex:1"><div style="font-size:32px;font-weight:900;color:#0f172a;letter-spacing:.5px">${e(v.fullName).toUpperCase()}</div><div style="font-size:14px;color:${c};font-weight:600;letter-spacing:2px">${e(v.title)}</div></div>
      ${photoSrc(v.photo) ? avatar(v, 96, c, '#fff') : ''}
    </div>
    <div style="display:flex;justify-content:center;flex-wrap:wrap;gap:6px 26px;padding:10px 48px;background:${c};color:#fff;font-size:11.5px">${contacts(v).map(([i, x]) => `<span>${i} ${e(x)}</span>`).join('')}</div>
    <div style="padding:6px 48px 40px">
      ${v.summary ? h(T.summary) + `<p style="margin:0">${e(v.summary)}</p>` : ''}
      ${h(T.exp)}${exps(v).map((x) => `<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;gap:10px"><b style="font-size:13.5px">${x.role}</b><span style="color:#64748b;white-space:nowrap">${x.p}</span></div><div style="color:${c};font-weight:600">${x.co}</div>${bullets(x.d)}</div>`).join('')}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 30px">
        <div>${h(T.edu)}${edus(v).map((x) => `<div style="margin-bottom:8px"><b>${x.s}</b><div>${x.m}</div><div style="font-size:11px;color:#64748b">${x.p}${x.n ? ` · ${x.n}` : ''}</div></div>`).join('')}</div>
        <div>${h(T.skills)}${skills(v).map((s) => `<div style="display:flex;justify-content:space-between;align-items:center;margin:4px 0"><span>${s.name}</span><span>${[1, 2, 3, 4, 5].map((i) => `<span style="display:inline-block;width:8px;height:8px;margin-left:3px;transform:rotate(45deg);background:${i <= s.level ? c : '#e2e8f0'}"></span>`).join('')}</span></div>`).join('')}</div>
        <div>${langs(v).length ? h(T.lang) + langs(v).join('<br>') : ''}</div>
        <div>${certs(v).length ? h(T.cert) + certs(v).join('<br>') : ''}</div>
      </div>
    </div>`);
}

// 30. Split columns – equal halves with a contrasting header strip
function split(v, T) {
  const c = color(v.color, '#0e7490');
  const h = (t) => `<div style="font-size:15px;font-weight:900;color:${c};margin:18px 0 8px;text-transform:uppercase;letter-spacing:1px">${t}</div>`;
  return page('', `
    <div style="display:flex">
      <div style="flex:1;background:#0f172a;color:#fff;padding:40px 36px 30px 48px">
        <div style="font-size:34px;font-weight:900;line-height:1.05">${e(v.fullName)}</div>
        <div style="color:${c === '#111827' ? '#cbd5e1' : c};font-weight:700;margin-top:8px;filter:brightness(1.4)">${e(v.title)}</div>
      </div>
      <div style="flex:1;background:${c};color:#fff;padding:40px 48px 30px 36px;display:flex;align-items:center;gap:16px">
        ${avatar(v, 80, 'rgba(255,255,255,.2)', 'rgba(255,255,255,.5)')}
        <div style="font-size:11.5px">${contacts(v).map(([i, x]) => `<div>${i} ${e(x)}</div>`).join('')}</div>
      </div>
    </div>
    ${v.summary ? `<p style="margin:0;padding:16px 48px;background:#f1f5f9;font-size:13px">${e(v.summary)}</p>` : ''}
    <div style="display:flex">
      <div style="flex:1;padding:4px 30px 40px 48px;border-right:1px solid #e2e8f0">${h(T.exp)}${exps(v).map((x) => `<div style="margin-bottom:12px"><b style="font-size:13.5px">${x.role}</b><div style="color:#64748b">${x.co} · ${x.p}</div>${bullets(x.d)}</div>`).join('')}</div>
      <div style="flex:1;padding:4px 48px 40px 30px">${h(T.edu)}${edus(v).map((x) => `<div style="margin-bottom:8px"><b>${x.s}</b> – ${x.m}<div style="font-size:11px;color:#64748b">${x.p}${x.n ? ` · ${x.n}` : ''}</div></div>`).join('')}
        ${h(T.skills)}${skills(v).map((s) => `<div style="display:flex;align-items:center;gap:8px;margin:5px 0"><span style="width:110px">${s.name}</span><div style="flex:1;height:8px;background:#e2e8f0"><div style="height:8px;width:${s.level * 20}%;background:${c}"></div></div></div>`).join('')}
        ${langs(v).length ? h(T.lang) + langs(v).join('<br>') : ''}
        ${certs(v).length ? h(T.cert) + certs(v).map((x) => `<div style="margin:4px 0">${x}</div>`).join('') : ''}</div>
    </div>`);
}

// 31. Waves – layered SVG wave header and footer
function waves(v, T) {
  const c = color(v.color, '#1f55e6');
  const wave = (flip) => `<svg viewBox="0 0 794 120" width="794" height="120" preserveAspectRatio="none" style="display:block;${flip ? 'transform:rotate(180deg)' : ''}">
    <path d="M0 0h794v60c-120 40-240 50-397 20S120 40 0 70z" fill="${c}"/>
    <path d="M0 0h794v40c-150 50-300 40-420 10S100 30 0 50z" fill="${c}" opacity=".55" transform="translate(0 30)"/>
    <path d="M0 0h794v30c-100 30-260 40-400 15S110 20 0 40z" fill="${c}" opacity=".25" transform="translate(0 55)"/></svg>`;
  const h = (t, ic) => `<div style="display:flex;align-items:center;gap:8px;margin:18px 0 8px;color:${c}">${icon(ic, 16)}<b style="font-size:14.5px;color:#0f172a">${t}</b></div>`;
  return page('', `
    <div style="background:${c};color:#fff;padding:36px 48px 0;display:flex;align-items:center;gap:24px">
      ${avatar(v, 110, 'rgba(255,255,255,.2)', 'rgba(255,255,255,.5)')}
      <div><div style="font-size:34px;font-weight:900">${e(v.fullName)}</div><div style="font-size:15px;opacity:.9">${e(v.title)}</div>
      <div style="display:flex;flex-wrap:wrap;gap:4px 16px;margin-top:8px;font-size:11.5px">${contacts(v).map(([i, x]) => `<span>${i} ${e(x)}</span>`).join('')}</div></div>
    </div>
    ${wave(false)}
    <div style="display:flex;gap:30px;padding:0 48px 140px">
      <main style="flex:1.7">${v.summary ? h(T.summary, 'user') + `<p style="margin:0">${e(v.summary)}</p>` : ''}
        ${h(T.exp, 'briefcase')}${exps(v).map((x) => `<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;gap:10px"><b style="font-size:13.5px">${x.role}</b><span style="color:${c};font-size:11px;font-weight:700;white-space:nowrap">${x.p}</span></div><div style="color:#64748b">${x.co}</div>${bullets(x.d)}</div>`).join('')}
        ${h(T.edu, 'cap')}${edus(v).map((x) => `<div style="margin-bottom:8px"><b>${x.s}</b> – ${x.m} <span style="color:#64748b">(${x.p})</span>${x.n ? `<div style="color:#64748b">${x.n}</div>` : ''}</div>`).join('')}</main>
      <aside style="flex:1">${h(T.skills, 'star')}${skills(v).map((s) => `<div style="margin:6px 0">${s.name}<div style="height:6px;border-radius:9px;background:${c}22;margin-top:3px"><div style="height:6px;border-radius:9px;width:${s.level * 20}%;background:${c}"></div></div></div>`).join('')}
        ${langs(v).length ? h(T.lang, 'globe') + langs(v).join('<br>') : ''}
        ${certs(v).length ? h(T.cert, 'award') + certs(v).map((x) => `<div style="margin:4px 0;font-size:11.5px">${x}</div>`).join('') : ''}</aside>
    </div>
    <div style="position:absolute;left:0;right:0;bottom:0">${wave(true)}</div>`);
}

// 32. Geometric – scattered SVG triangles/circles, angular blocks
function geometric(v, T) {
  const c = color(v.color, '#0d9488');
  const shapes = `<svg width="794" height="1123" viewBox="0 0 794 1123" style="position:absolute;inset:0;pointer-events:none">
    <polygon points="620,0 794,0 794,190" fill="${c}" opacity=".9"/><polygon points="700,0 794,0 794,90" fill="#0f172a" opacity=".85"/>
    <circle cx="760" cy="300" r="46" fill="none" stroke="${c}" stroke-width="3" opacity=".35"/>
    <rect x="-30" y="980" width="140" height="140" fill="${c}" opacity=".15" transform="rotate(20 40 1050)"/>
    <polygon points="0,1123 0,1000 120,1123" fill="${c}" opacity=".9"/>
    <circle cx="40" cy="160" r="6" fill="${c}"/><circle cx="62" cy="160" r="6" fill="${c}" opacity=".6"/><circle cx="84" cy="160" r="6" fill="${c}" opacity=".3"/></svg>`;
  const h = (t, ic) => `<div style="display:flex;align-items:center;gap:10px;margin:20px 0 8px"><span style="width:28px;height:28px;background:${c};color:#fff;display:flex;align-items:center;justify-content:center;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%)">${icon(ic, 13)}</span><b style="font-size:14px;text-transform:uppercase;letter-spacing:1.5px">${t}</b></div>`;
  return page('padding:46px 52px', `${shapes}<div style="position:relative">
    <div style="display:flex;align-items:center;gap:22px;margin-top:20px">
      <div style="clip-path:polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%);width:120px;height:120px;background:${c};flex-shrink:0;display:flex;align-items:center;justify-content:center">
        ${photoSrc(v.photo) ? `<img src="${photoSrc(v.photo)}" alt="" style="width:120px;height:120px;object-fit:cover" />` : `<span style="color:#fff;font-size:40px;font-weight:900">${e(initials(v.fullName))}</span>`}</div>
      <div><div style="font-size:34px;font-weight:900;color:#0f172a">${e(v.fullName)}</div><div style="font-size:15px;color:${c};font-weight:700">${e(v.title)}</div></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 20px;margin-top:14px;font-size:11.5px;color:#475569">${contacts(v).map(([i, x]) => `<span style="color:${c}">${i} <span style="color:#475569">${e(x)}</span></span>`).join('')}</div>
    ${v.summary ? h(T.summary, 'user') + `<p style="margin:0">${e(v.summary)}</p>` : ''}
    ${h(T.exp, 'briefcase')}${exps(v).map((x) => `<div style="margin-bottom:12px;padding-left:14px;border-left:3px solid ${c}"><div style="display:flex;justify-content:space-between;gap:10px"><b style="font-size:13.5px">${x.role} · ${x.co}</b><span style="color:#64748b;font-size:11px;white-space:nowrap">${x.p}</span></div>${bullets(x.d)}</div>`).join('')}
    <div style="display:flex;gap:30px">
      <div style="flex:1">${h(T.edu, 'cap')}${edus(v).map((x) => `<div style="margin-bottom:8px"><b>${x.s}</b><div>${x.m}</div><div style="color:#64748b;font-size:11px">${x.p}${x.n ? ` · ${x.n}` : ''}</div></div>`).join('')}
        ${langs(v).length ? h(T.lang, 'globe') + langs(v).join('<br>') : ''}</div>
      <div style="flex:1">${h(T.skills, 'star')}${skills(v).map((s) => `<div style="display:flex;justify-content:space-between;align-items:center;margin:5px 0"><span>${s.name}</span><span>${[1, 2, 3, 4, 5].map((i) => `<svg width="10" height="10" viewBox="0 0 10 10" style="display:inline-block;margin-left:2px"><polygon points="5,0 10,10 0,10" fill="${i <= s.level ? c : '#e2e8f0'}"/></svg>`).join('')}</span></div>`).join('')}
        ${certs(v).length ? h(T.cert, 'award') + certs(v).map((x) => `<div style="margin:4px 0;font-size:11.5px">${x}</div>`).join('') : ''}</div>
    </div></div>`);
}

// 33. Sketch – hand-drawn look: wobbly SVG underlines, marker highlights, doodle icons
function sketch(v, T) {
  const c = color(v.color, '#ea580c');
  const HAND = `'Segoe Print','Comic Sans MS','Bradley Hand',cursive`;
  const scribble = (w) => `<svg width="${w}" height="10" viewBox="0 0 ${w} 10" style="display:block"><path d="M2 6 C ${w * 0.2} 1, ${w * 0.4} 9, ${w * 0.6} 4 S ${w * 0.9} 7, ${w - 2} 3" stroke="${c}" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`;
  const h = (t) => `<div style="margin:20px 0 8px"><div style="display:inline-block"><div style="font-family:${HAND};font-size:21px;color:#1c1917">${t}</div>${scribble(150)}</div></div>`;
  return page('padding:46px 52px;background:#fffef7;background-image:repeating-linear-gradient(#fffef7 0 27px,#e0f2fe 27px 28px)', `
    <div style="display:flex;gap:26px;align-items:center">
      <div style="border:3px solid #1c1917;border-radius:58% 42% 55% 45%/48% 55% 45% 52%;padding:5px;transform:rotate(-3deg)">${avatar(v, 110, c, '#fffef7')}</div>
      <div><div style="font-family:${HAND};font-size:38px;color:#1c1917;line-height:1.1">${e(v.fullName)}</div>
        <div style="display:inline-block;background:linear-gradient(transparent 55%,${c}55 55%);font-weight:700;font-size:15px;padding:0 4px">${e(v.title)}</div>
        <div style="margin-top:8px;font-size:11.5px;color:#44403c">${contacts(v).map(([i, x]) => `<div style="color:${c}">${i} <span style="color:#44403c">${e(x)}</span></div>`).join('')}</div></div>
    </div>
    ${v.summary ? h(T.summary) + `<p style="margin:0">${e(v.summary)}</p>` : ''}
    ${h(T.exp)}${exps(v).map((x) => `<div style="margin-bottom:12px;border:2px solid #1c1917;border-radius:255px 15px 225px 15px/15px 225px 15px 255px;padding:10px 14px;background:#fff"><div style="display:flex;justify-content:space-between;gap:10px"><b style="font-size:13.5px">${x.role}</b><span style="font-family:${HAND};color:${c};white-space:nowrap">${x.p}</span></div><div style="color:#57534e">${x.co}</div>${bullets(x.d)}</div>`).join('')}
    <div style="display:flex;gap:30px">
      <div style="flex:1">${h(T.skills)}<div>${skills(v).map((s) => `<span style="display:inline-block;margin:0 8px 8px 0;padding:4px 10px;border:2px solid #1c1917;border-radius:15px 255px 15px 225px/225px 15px 255px 15px;font-size:11.5px;background:${s.level >= 5 ? `${c}33` : '#fff'}">${s.name}</span>`).join('')}</div></div>
      <div style="flex:1">${h(T.edu)}${edus(v).map((x) => `<div style="margin-bottom:8px"><b>${x.s}</b> – ${x.m}<div style="font-size:11px;color:#78716c">${x.p}${x.n ? ` · ${x.n}` : ''}</div></div>`).join('')}
        ${langs(v).length ? h(T.lang) + langs(v).join('<br>') : ''}</div>
    </div>
    ${certs(v).length ? h(T.cert) + certs(v).map((x) => `<div style="margin:3px 0">✎ ${x}</div>`).join('') : ''}`);
}

// 34. Icon badges – every section and contact led by a filled vector badge
function badges(v, T) {
  const c = color(v.color, '#6d28d9');
  const badge = (ic, size = 34) => `<span style="width:${size}px;height:${size}px;border-radius:50%;background:${c};color:#fff;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 0 0 4px ${c}22">${icon(ic, Math.round(size * 0.45))}</span>`;
  const h = (t, ic) => `<div style="display:flex;align-items:center;gap:12px;margin:22px 0 10px">${badge(ic)}<b style="font-size:15px;color:#0f172a">${t}</b><span style="flex:1;height:1px;background:#e2e8f0"></span></div>`;
  const contactRow = [['mail', v.email], ['phone', v.phone], ['pin', v.address], ['link', v.website]].filter(([, x]) => x);
  return page('padding:44px 50px', `
    <div style="text-align:center">
      <div style="display:flex;justify-content:center">${avatar(v, 112, c, `${c}33`)}</div>
      <div style="font-size:32px;font-weight:900;color:#0f172a;margin-top:10px">${e(v.fullName)}</div>
      <div style="font-size:15px;color:${c};font-weight:700">${e(v.title)}</div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(${Math.max(1, contactRow.length)},1fr);gap:10px;margin-top:16px">${contactRow.map(([ic, x]) => `<div style="display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center;font-size:11px;color:#475569;word-break:break-word">${badge(ic, 30)}${e(x)}</div>`).join('')}</div>
    ${v.summary ? h(T.summary, 'user') + `<p style="margin:0">${e(v.summary)}</p>` : ''}
    ${h(T.exp, 'briefcase')}${exps(v).map((x) => `<div style="margin:0 0 12px 46px"><div style="display:flex;justify-content:space-between;gap:10px"><b style="font-size:13.5px">${x.role}</b><span style="color:#64748b;font-size:11px;white-space:nowrap">${x.p}</span></div><div style="color:${c};font-weight:600">${x.co}</div>${bullets(x.d)}</div>`).join('')}
    ${h(T.edu, 'cap')}${edus(v).map((x) => `<div style="margin:0 0 8px 46px"><b>${x.s}</b> – ${x.m} <span style="color:#64748b">(${x.p})</span>${x.n ? `<div style="color:#64748b">${x.n}</div>` : ''}</div>`).join('')}
    <div style="display:flex;gap:30px">
      <div style="flex:1">${h(T.skills, 'star')}<div style="margin-left:46px">${skills(v).map((s) => `<div style="display:flex;justify-content:space-between;margin:4px 0"><span>${s.name}</span><span style="color:${c}">${[1, 2, 3, 4, 5].map((i) => icon('star', 11, i <= s.level ? `fill:${c}` : 'opacity:.25')).join('')}</span></div>`).join('')}</div></div>
      <div style="flex:1">${langs(v).length ? h(T.lang, 'globe') + `<div style="margin-left:46px">${langs(v).join('<br>')}</div>` : ''}
        ${certs(v).length ? h(T.cert, 'award') + `<div style="margin-left:46px">${certs(v).map((x) => `<div style="margin:3px 0;font-size:11.5px">${x}</div>`).join('')}</div>` : ''}</div>
    </div>`);
}

// 31. Warm Editorial Serif
function claudeCv(v, T) {
  const c = color(v.color, '#d97757');
  const h = (t) => `<div style="font-family:${SERIF};font-size:15px;font-weight:700;color:#191918;margin:20px 0 10px;padding-bottom:5px;border-bottom:1px solid #e2ddd3;display:flex;align-items:center;gap:8px"><span style="width:8px;height:8px;border-radius:50%;background:${c};display:inline-block"></span>${t}</div>`;
  return page('background:#f4f0e8;color:#191918;padding:42px 46px', `
    <div style="background:#faf8f3;border:1px solid #e2ddd3;border-radius:18px;padding:26px 30px;display:flex;gap:24px;align-items:center">
      ${avatar(v, 96, c, '#e2ddd3')}
      <div style="flex:1">
        <div style="display:inline-block;padding:3px 10px;border-radius:99px;background:${c}22;color:${c};font-size:10.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;margin-bottom:6px">✦ ${e(v.title)}</div>
        <div style="font-family:${SERIF};font-size:32px;font-weight:700;line-height:1.05;color:#191918">${e(v.fullName)}</div>
        <div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:12px;font-size:11.5px;color:#66645e">${contacts(v).map(([ic, x]) => `<span>${ic} ${e(x)}</span>`).join('')}</div>
      </div>
    </div>
    ${v.summary ? `<div style="margin-top:16px;padding:14px 20px;background:#faf8f3;border-left:3px solid ${c};border-radius:0 12px 12px 0;font-family:${SERIF};font-style:italic;font-size:13px;color:#3d3b37">“${e(v.summary)}”</div>` : ''}
    <div style="display:flex;gap:28px;margin-top:6px">
      <div style="flex:1.65">
        ${h(T.exp)}
        ${exps(v).map((x) => `<div style="background:#faf8f3;border:1px solid #e2ddd3;border-radius:14px;padding:14px 16px;margin-bottom:10px"><div style="display:flex;justify-content:space-between;gap:8px"><b style="font-family:${SERIF};font-size:14px">${x.role}</b><span style="font-size:11px;color:${c};font-weight:700;white-space:nowrap">${x.p}</span></div><div style="font-size:12px;color:#66645e;font-weight:600;margin-bottom:4px">${x.co}</div>${bullets(x.d)}</div>`).join('')}
      </div>
      <div style="flex:1">
        ${h(T.skills)}
        <div style="display:flex;flex-wrap:wrap;gap:6px">${skills(v).map((s) => `<span style="background:#faf8f3;border:1px solid #dcd6ca;padding:4px 10px;border-radius:8px;font-size:11.5px;font-weight:600">${s.name} <b style="color:${c}">·${s.level}</b></span>`).join('')}</div>
        ${h(T.edu)}
        ${edus(v).map((x) => `<div style="margin-bottom:10px"><b style="font-family:${SERIF}">${x.s}</b><div>${x.m}</div><div style="font-size:11px;color:#66645e">${x.p}${x.n ? ` · ${x.n}` : ''}</div></div>`).join('')}
        ${langs(v).length ? h(T.lang) + langs(v).map((x) => `<div style="margin:3px 0">• ${x}</div>`).join('') : ''}
        ${certs(v).length ? h(T.cert) + certs(v).map((x) => `<div style="margin:4px 0;font-size:11.5px">✦ ${x}</div>`).join('') : ''}
      </div>
    </div>`);
}

// 32. Art Director (Case-Study Resume)
function behanceCv(v, T) {
  const c = color(v.color, '#0057ff');
  const h = (t, n) => `<div style="display:flex;align-items:baseline;gap:8px;margin:20px 0 10px;border-bottom:2px solid #0f172a;padding-bottom:4px"><span style="font-size:11px;font-weight:900;color:${c}">0${n}</span><span style="font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:1.5px">${t}</span></div>`;
  return page('background:#fff', `
    <div style="background:#0b0d12;color:#fff;padding:34px 44px;display:flex;gap:24px;align-items:center;border-bottom:5px solid ${c}">
      ${avatar(v, 104, c, c)}
      <div style="flex:1">
        <div style="display:inline-block;background:${c};color:#fff;font-size:10px;font-weight:800;padding:3px 10px;border-radius:4px;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px">★ CREATIVE PROFILE</div>
        <div style="font-size:34px;font-weight:900;letter-spacing:-1px;line-height:1">${e(v.fullName)}</div>
        <div style="color:#9ca3af;font-size:14px;font-weight:600;margin-top:4px">${e(v.title)}</div>
        <div style="margin-top:10px;display:flex;flex-wrap:wrap;gap:14px;font-size:11px;color:#d1d5db">${contacts(v).map(([ic, x]) => `<span>${ic} ${e(x)}</span>`).join('')}</div>
      </div>
    </div>
    <div style="padding:24px 44px 36px;display:flex;gap:30px">
      <div style="flex:1.6">
        ${v.summary ? h(T.summary, 1) + `<p style="margin:0;font-size:13px;color:#334155">${e(v.summary)}</p>` : ''}
        ${h(T.exp, 2)}
        ${exps(v).map((x, i) => `<div style="margin-bottom:14px;padding:12px 14px;background:#f8fafc;border-left:4px solid ${c};border-radius:0 10px 10px 0"><div style="display:flex;justify-content:space-between;gap:8px"><b style="font-size:13.5px;color:#0f172a">0${i + 1} // ${x.role}</b><span style="font-size:11px;font-weight:700;color:${c};white-space:nowrap">${x.p}</span></div><div style="font-weight:700;color:#475569;font-size:12px">${x.co}</div>${bullets(x.d)}</div>`).join('')}
      </div>
      <div style="flex:1">
        ${h(T.skills, 3)}
        ${skills(v).map((s) => `<div style="margin:7px 0"><div style="display:flex;justify-content:space-between;font-size:11.5px;font-weight:700"><span>${s.name}</span><span style="color:${c}">${s.level * 20}%</span></div><div style="height:6px;background:#e2e8f0;border-radius:99px;margin-top:3px"><div style="height:6px;width:${s.level * 20}%;background:${c};border-radius:99px"></div></div></div>`).join('')}
        ${h(T.edu, 4)}
        ${edus(v).map((x) => `<div style="margin-bottom:8px"><b>${x.s}</b><div>${x.m}</div><div style="font-size:11px;color:#64748b">${x.p}${x.n ? ` · ${x.n}` : ''}</div></div>`).join('')}
        ${langs(v).length ? h(T.lang, 5) + langs(v).map((x) => `<div style="margin:3px 0">${x}</div>`).join('') : ''}
        ${certs(v).length ? h(T.cert, 6) + certs(v).map((x) => `<div style="margin:4px 0;font-size:11.5px">★ ${x}</div>`).join('') : ''}
      </div>
    </div>`);
}

// 33. Bento Grid CV (Modular Rounded Cards)
function bentoCv(v, T) {
  const c = color(v.color, '#1f55e6');
  const card = (title, body, bg = '#fff') => `<div style="background:${bg};border:1px solid #e2e8f0;border-radius:18px;padding:16px 18px;margin-bottom:12px">${title ? `<div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1.2px;color:${c};margin-bottom:8px">${title}</div>` : ''}${body}</div>`;
  return page('background:#f1f5f9;padding:28px', `
    <div style="display:grid;grid-template-columns:1.7fr 1fr;gap:12px;margin-bottom:12px">
      <div style="background:#0f172a;color:#fff;border-radius:20px;padding:24px;display:flex;gap:18px;align-items:center">
        ${avatar(v, 88, c, c)}
        <div><div style="font-size:28px;font-weight:900;line-height:1.05">${e(v.fullName)}</div><div style="color:${c};font-weight:700;font-size:14px;margin-top:4px">${e(v.title)}</div><div style="font-size:11.5px;color:#cbd5e1;margin-top:8px">${e(v.summary || '')}</div></div>
      </div>
      <div style="background:${c};color:#fff;border-radius:20px;padding:20px;display:flex;flex-direction:column;justify-content:center;gap:6px;font-size:11.5px">
        <div style="font-size:10px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;opacity:.8">${T.contact}</div>
        ${contacts(v).map(([ic, x]) => `<div style="display:flex;gap:8px;align-items:center;word-break:break-word">${ic}<span>${e(x)}</span></div>`).join('')}
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1.6fr 1fr;gap:12px">
      <div>
        ${card(T.exp, exps(v).map((x) => `<div style="margin-bottom:12px;padding-bottom:10px;border-bottom:1px dashed #e2e8f0"><div style="display:flex;justify-content:space-between;gap:8px"><b style="font-size:13.5px">${x.role}</b><span style="background:${c}15;color:${c};padding:1px 8px;border-radius:99px;font-size:10.5px;font-weight:700;white-space:nowrap">${x.p}</span></div><div style="color:#64748b;font-weight:600;font-size:12px">${x.co}</div>${bullets(x.d)}</div>`).join(''))}
      </div>
      <div>
        ${card(T.skills, `<div style="display:flex;flex-wrap:wrap;gap:6px">${skills(v).map((s) => `<span style="background:#f8fafc;border:1px solid #cbd5e1;padding:4px 10px;border-radius:10px;font-size:11px;font-weight:700">${s.name}</span>`).join('')}</div>`)}
        ${card(T.edu, edus(v).map((x) => `<div style="margin-bottom:8px"><b>${x.s}</b><div>${x.m}</div><div style="font-size:11px;color:#64748b">${x.p}${x.n ? ` · ${x.n}` : ''}</div></div>`).join(''))}
        ${langs(v).length ? card(T.lang, langs(v).join(' · ')) : ''}
        ${certs(v).length ? card(T.cert, certs(v).map((x) => `<div style="margin:3px 0;font-size:11.5px">• ${x}</div>`).join('')) : ''}
      </div>
    </div>`);
}

// 34. Neo-Brutalist Studio CV (Hard Offset Shadows & Bold Borders)
function brutalistCv(v, T) {
  const c = color(v.color, '#db2777');
  const box = (title, body, bg = '#fff') => `<div style="background:${bg};border:2.5px solid #111;box-shadow:5px 5px 0 #111;border-radius:12px;padding:16px 18px;margin-bottom:14px">${title ? `<div style="display:inline-block;background:#fde047;border:2px solid #111;padding:2px 10px;font-size:11px;font-weight:900;text-transform:uppercase;margin-bottom:10px">${title}</div>` : ''}${body}</div>`;
  return page('background:#fffdf7;padding:30px', `
    <div style="background:${c};color:#fff;border:3px solid #111;box-shadow:6px 6px 0 #111;border-radius:14px;padding:24px 28px;margin-bottom:16px;display:flex;gap:20px;align-items:center">
      ${avatar(v, 92, '#111', '#111')}
      <div style="flex:1">
        <span style="background:#fde047;color:#111;border:2px solid #111;padding:2px 10px;font-size:11px;font-weight:900;text-transform:uppercase">${e(v.title)}</span>
        <div style="font-size:34px;font-weight:900;line-height:1.05;margin-top:6px;text-shadow:3px 3px 0 #111">${e(v.fullName)}</div>
        <div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:10px;font-size:11px;background:#111;padding:6px 12px;border-radius:8px">${contacts(v).map(([, x]) => `<span>${e(x)}</span>`).join(' ★ ')}</div>
      </div>
    </div>
    <div style="display:flex;gap:16px">
      <div style="flex:1.6">
        ${v.summary ? box(T.summary, `<div style="font-weight:600">${e(v.summary)}</div>`, '#fef9c3') : ''}
        ${box(T.exp, exps(v).map((x) => `<div style="margin-bottom:12px;padding-bottom:10px;border-bottom:2px solid #111"><div style="display:flex;justify-content:space-between;gap:8px"><b style="font-size:13.5px">${x.role}</b><span style="background:#a7f3d0;border:1.5px solid #111;padding:1px 8px;font-size:10.5px;font-weight:800;white-space:nowrap">${x.p}</span></div><div style="font-weight:800;color:${c}">${x.co}</div>${bullets(x.d)}</div>`).join(''))}
      </div>
      <div style="flex:1">
        ${box(T.skills, `<div style="display:flex;flex-wrap:wrap;gap:6px">${skills(v).map((s) => `<span style="background:#fff;border:2px solid #111;box-shadow:2px 2px 0 #111;padding:3px 9px;font-size:11px;font-weight:800">#${s.name}</span>`).join('')}</div>`, '#e0e7ff')}
        ${box(T.edu, edus(v).map((x) => `<div style="margin-bottom:8px"><b>${x.s}</b><div>${x.m}</div><div style="font-size:11px">${x.p}${x.n ? ` · ${x.n}` : ''}</div></div>`).join(''))}
        ${langs(v).length || certs(v).length ? box(`${T.lang} & ${T.cert}`, [...langs(v), ...certs(v)].map((x) => `<div style="margin:3px 0;font-weight:600">→ ${x}</div>`).join('')) : ''}
      </div>
    </div>`);
}

// 35. Swiss International Typographic / Bauhaus Grid
function swissCv(v, T) {
  const c = color(v.color, '#dc2626');
  return page('background:#fff;padding:0', `
    <div style="display:grid;grid-template-columns:210px 1fr;border-bottom:2px solid #0f172a">
      <div style="background:${c};color:#fff;padding:32px 24px;border-right:2px solid #0f172a;display:flex;flex-direction:column;justify-content:space-between">
        <div style="font-size:11px;font-weight:900;letter-spacing:2px">SWISS // GRID 01</div>
        <div style="font-size:44px;font-weight:900;line-height:.9">+</div>
      </div>
      <div style="padding:32px 36px">
        <div style="font-size:42px;font-weight:900;letter-spacing:-1.5px;line-height:.95;text-transform:uppercase">${e(v.fullName)}</div>
        <div style="font-size:15px;font-weight:800;color:${c};margin-top:8px;text-transform:uppercase;letter-spacing:1.5px">${e(v.title)}</div>
        <div style="margin-top:12px;font-size:11.5px;color:#475569;display:flex;flex-wrap:wrap;gap:14px">${contacts(v).map(([, x]) => `<span>${e(x)}</span>`).join(' / ')}</div>
      </div>
    </div>
    ${v.summary ? `<div style="display:grid;grid-template-columns:210px 1fr;border-bottom:1px solid #0f172a"><div style="padding:20px 24px;border-right:1px solid #0f172a;font-weight:900;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:${c}">01 / ${T.summary}</div><div style="padding:20px 36px;font-size:13px">${e(v.summary)}</div></div>` : ''}
    <div style="display:grid;grid-template-columns:210px 1fr;border-bottom:1px solid #0f172a">
      <div style="padding:24px;border-right:1px solid #0f172a;font-weight:900;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:${c}">02 / ${T.exp}</div>
      <div style="padding:24px 36px">${exps(v).map((x) => `<div style="margin-bottom:14px"><div style="display:flex;justify-content:space-between"><b>${x.role} — ${x.co}</b><span style="font-weight:800;color:${c};font-size:11px">${x.p}</span></div>${bullets(x.d)}</div>`).join('')}</div>
    </div>
    <div style="display:grid;grid-template-columns:210px 1fr 1fr">
      <div style="padding:24px;border-right:1px solid #0f172a;font-weight:900;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:${c}">03 / ${T.edu} & ${T.skills}</div>
      <div style="padding:24px;border-right:1px solid #0f172a">${edus(v).map((x) => `<div style="margin-bottom:8px"><b>${x.s}</b><div>${x.m}</div><div style="font-size:11px;color:#64748b">${x.p}</div></div>`).join('')}${certs(v).length ? `<div style="margin-top:12px;font-weight:800;font-size:11px;color:${c}">${T.cert}</div>` + certs(v).map((x) => `<div style="font-size:11.5px">• ${x}</div>`).join('') : ''}</div>
      <div style="padding:24px"><div style="display:flex;flex-wrap:wrap;gap:6px">${skills(v).map((s) => `<span style="border:1px solid #0f172a;padding:3px 8px;font-size:11px;font-weight:700">${s.name}</span>`).join('')}</div>${langs(v).length ? `<div style="margin-top:12px;font-size:11.5px"><b>${T.lang}:</b> ${langs(v).join(' · ')}</div>` : ''}</div>
    </div>`);
}

// 36. Haute Couture / Luxury Editorial (Obsidian & Champagne Gold)
function luxuryCv(v, T) {
  const c = color(v.color, '#b45309');
  const h = (r, t) => `<div style="text-align:center;margin:20px 0 12px"><span style="font-family:${SERIF};font-style:italic;color:${c};font-size:12px">${r}</span><div style="font-family:${SERIF};font-size:15px;font-weight:700;letter-spacing:3px;text-transform:uppercase;border-bottom:1px solid ${c}55;padding-bottom:4px;margin-top:2px">${t}</div></div>`;
  return page('background:#faf8f5;padding:24px', `
    <div style="border:1px solid ${c};padding:6px;min-height:1070px;box-sizing:border-box">
      <div style="border:1px solid #1c1917;padding:34px 40px;min-height:1056px;box-sizing:border-box">
        <header style="text-align:center;border-bottom:2px double ${c};padding-bottom:20px">
          <div style="font-size:10px;letter-spacing:4px;text-transform:uppercase;color:${c};font-weight:700">CURRICULUM VITAE</div>
          <div style="font-family:${SERIF};font-size:38px;font-weight:700;letter-spacing:1px;margin:6px 0">${e(v.fullName)}</div>
          <div style="font-family:${SERIF};font-style:italic;font-size:15px;color:#57534e">${e(v.title)}</div>
          <div style="margin-top:10px;font-size:11px;color:#57534e">${contacts(v).map(([, x]) => e(x)).join('   ✦   ')}</div>
        </header>
        ${v.summary ? `<p style="text-align:center;font-family:${SERIF};font-style:italic;font-size:13px;max-width:580px;margin:16px auto;color:#44403c">${e(v.summary)}</p>` : ''}
        ${h('I.', T.exp)}
        ${exps(v).map((x) => `<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;align-items:baseline"><b style="font-family:${SERIF};font-size:14px">${x.role} — <span style="color:${c}">${x.co}</span></b><span style="font-size:11px;font-style:italic;color:#78716c">${x.p}</span></div>${bullets(x.d)}</div>`).join('')}
        <div style="display:flex;gap:32px">
          <div style="flex:1">${h('II.', T.edu)}${edus(v).map((x) => `<div style="margin-bottom:8px;text-align:center"><b>${x.s}</b><div>${x.m} (${x.p})</div></div>`).join('')}</div>
          <div style="flex:1">${h('III.', T.skills)}<div style="text-align:center;line-height:1.9">${skills(v).map((s) => s.name).join('  ·  ')}</div></div>
        </div>
        ${langs(v).length || certs(v).length ? h('IV.', `${T.lang} & ${T.cert}`) + `<div style="text-align:center;font-size:11.5px">${[...langs(v), ...certs(v)].join('   ✦   ')}</div>` : ''}
      </div>
    </div>`);
}

// 37. GitHub / Open-Source Maintainer CV
function opensourceCv(v, T) {
  const c = color(v.color, '#15803d');
  const MONO = `'JetBrains Mono',Consolas,monospace`;
  const cells = Array.from({ length: 52 }, (_, i) => [0.15, 0.35, 0.6, 0.85, 1][(i * 5 + 2) % 5]);
  const h = (t) => `<div style="font-family:${MONO};font-size:12px;font-weight:700;color:#0f172a;margin:18px 0 8px;display:flex;align-items:center;gap:6px"><span style="color:${c}">●</span> ${t}</div>`;
  return page('background:#ffffff;padding:34px 40px', `
    <div style="display:flex;gap:20px;align-items:center;padding-bottom:18px;border-bottom:1px solid #d0d7de">
      ${avatar(v, 88, c, '#d0d7de')}
      <div style="flex:1">
        <div style="display:flex;align-items:center;gap:10px"><span style="font-size:28px;font-weight:800;color:#1f2328">${e(v.fullName)}</span><span style="font-family:${MONO};font-size:11px;padding:2px 8px;border-radius:99px;background:${c}18;color:${c};border:1px solid ${c}55;font-weight:700">PRO / OPEN-SOURCE</span></div>
        <div style="font-family:${MONO};font-size:13px;color:#656d76;margin-top:2px">${e(v.title)}</div>
        <div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:12px;font-size:11.5px;color:#1f2328">${contacts(v).map(([ic, x]) => `<span>${ic} ${e(x)}</span>`).join('')}</div>
      </div>
    </div>
    <div style="margin:12px 0;padding:10px 14px;border:1px solid #d0d7de;border-radius:8px;background:#f6f8fa">
      <div style="font-family:${MONO};font-size:10px;color:#656d76;margin-bottom:5px">CONTRIBUTION ACTIVITY GRAPH</div>
      <div style="display:grid;grid-template-columns:repeat(52,1fr);gap:3px">${cells.map((op) => `<span style="height:9px;border-radius:2px;background:${c};opacity:${op}"></span>`).join('')}</div>
    </div>
    ${v.summary ? `<div style="padding:12px 16px;border:1px solid #d0d7de;border-radius:8px;font-size:12.5px;margin-bottom:6px"><div style="font-family:${MONO};font-size:10.5px;color:#656d76;margin-bottom:4px">README.md</div>${e(v.summary)}</div>` : ''}
    ${h(T.exp)}
    <div style="display:grid;gap:10px">${exps(v).map((x) => `<div style="border:1px solid #d0d7de;border-radius:8px;padding:12px 14px"><div style="display:flex;justify-content:space-between;align-items:center"><b style="color:${c};font-size:13.5px">📦 ${x.role} @ ${x.co}</b><span style="font-family:${MONO};font-size:10.5px;padding:1px 8px;border:1px solid #d0d7de;border-radius:99px;color:#656d76">${x.p}</span></div>${bullets(x.d)}</div>`).join('')}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
      <div>${h(T.skills)}<div style="display:flex;flex-wrap:wrap;gap:5px">${skills(v).map((s) => `<span style="font-family:${MONO};font-size:11px;padding:3px 9px;border-radius:99px;background:#f6f8fa;border:1px solid #d0d7de">${s.name}</span>`).join('')}</div></div>
      <div>${h(T.edu)}${edus(v).map((x) => `<div style="margin-bottom:6px"><b>${x.s}</b> – ${x.m} <span style="color:#656d76;font-size:11px">(${x.p})</span></div>`).join('')}
      ${certs(v).length ? h(T.cert) + certs(v).map((x) => `<div style="font-size:11.5px">★ ${x}</div>`).join('') : ''}</div>
    </div>`);
}

// 38. Architect CAD Blueprint CV
function architectCv(v, T) {
  const c = color(v.color, '#1e3a5f');
  const MONO = `'JetBrains Mono',Consolas,monospace`;
  return page(`background:#f8fafc;background-image:linear-gradient(${c}14 1px,transparent 1px),linear-gradient(90deg,${c}14 1px,transparent 1px);background-size:24px 24px;padding:28px`, `
    <div style="border:2px solid ${c};background:rgba(255,255,255,.92);min-height:1064px;padding:28px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between">
      <div>
        <div style="display:grid;grid-template-columns:1.6fr 1fr;border:1.5px solid ${c};margin-bottom:20px">
          <div style="padding:18px 22px;border-right:1.5px solid ${c}">
            <div style="font-family:${MONO};font-size:10px;color:${c}">PROJECT // CURRICULUM VITAE</div>
            <div style="font-size:32px;font-weight:900;color:#0f172a;letter-spacing:-1px">${e(v.fullName)}</div>
            <div style="font-family:${MONO};font-size:13px;color:${c};font-weight:700">${e(v.title)}</div>
          </div>
          <div style="padding:14px 18px;font-family:${MONO};font-size:10.5px;display:flex;flex-direction:column;justify-content:center;gap:4px">
            <div><b>SCALE:</b> 1:1 A4</div>
            ${contacts(v).map(([, x]) => `<div style="word-break:break-word">${e(x)}</div>`).join('')}
          </div>
        </div>
        ${v.summary ? `<div style="margin-bottom:18px;padding:12px 16px;border:1px dashed ${c};font-size:12.5px">${e(v.summary)}</div>` : ''}
        <div style="display:grid;grid-template-columns:1.55fr 1fr;gap:24px">
          <div>
            <div style="font-family:${MONO};font-size:12px;font-weight:800;color:#fff;background:${c};padding:4px 12px;margin-bottom:10px">SEC.01 // ${T.exp}</div>
            ${exps(v).map((x, i) => `<div style="margin-bottom:12px;padding-left:12px;border-left:2px solid ${c}"><div style="display:flex;justify-content:space-between"><b style="font-size:13px">[0${i + 1}] ${x.role}</b><span style="font-family:${MONO};font-size:10.5px;color:${c}">${x.p}</span></div><div style="font-weight:700;color:#475569">${x.co}</div>${bullets(x.d)}</div>`).join('')}
          </div>
          <div>
            <div style="font-family:${MONO};font-size:12px;font-weight:800;color:#fff;background:${c};padding:4px 12px;margin-bottom:10px">SEC.02 // ${T.skills}</div>
            ${skills(v).map((s) => `<div style="display:flex;justify-content:space-between;font-family:${MONO};font-size:11px;padding:4px 0;border-bottom:1px dotted ${c}55"><span>${s.name}</span><b>${s.level}/5</b></div>`).join('')}
            <div style="font-family:${MONO};font-size:12px;font-weight:800;color:#fff;background:${c};padding:4px 12px;margin:16px 0 10px">SEC.03 // ${T.edu}</div>
            ${edus(v).map((x) => `<div style="margin-bottom:8px"><b>${x.s}</b><div>${x.m}</div><div style="font-family:${MONO};font-size:10.5px;color:#64748b">${x.p}</div></div>`).join('')}
            ${certs(v).length ? `<div style="font-family:${MONO};font-size:12px;font-weight:800;color:#fff;background:${c};padding:4px 12px;margin:16px 0 10px">SEC.04 // ${T.cert}</div>` + certs(v).map((x) => `<div style="font-size:11px;margin:3px 0">▪ ${x}</div>`).join('') : ''}
          </div>
        </div>
      </div>
      <div style="border-top:1.5px solid ${c};padding-top:8px;display:flex;justify-content:space-between;font-family:${MONO};font-size:10px;color:${c}"><span>DWG NO: CV-2026-A4</span><span>APPROVED: ${e(v.fullName)}</span></div>
    </div>`);
}

// 39. Nordic Minimalist Arch (Soft Stone & Arched Portrait)
function nordicCv(v, T) {
  const c = color(v.color, '#0d9488');
  const h = (t) => `<div style="font-size:11px;font-weight:800;letter-spacing:2.5px;text-transform:uppercase;color:${c};margin:20px 0 10px">${t}</div>`;
  return page('background:#f7f6f2;display:flex', `
    <aside style="width:255px;background:#ebe8e0;padding:40px 26px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;text-align:center">
      <div style="width:130px;height:160px;border-radius:65px 65px 16px 16px;overflow:hidden;background:${c};color:#fff;display:flex;align-items:center;justify-content:center;font-size:38px;font-weight:800;margin-bottom:16px;border:3px solid #fff">${photoSrc(v.photo) ? `<img src="${photoSrc(v.photo)}" alt="" style="width:100%;height:100%;object-fit:cover" />` : e(initials(v.fullName))}</div>
      ${h(T.contact)}
      <div style="font-size:11.5px;color:#44403c;line-height:1.8">${contacts(v).map(([, x]) => `<div style="word-break:break-word">${e(x)}</div>`).join('')}</div>
      ${h(T.skills)}
      <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:6px">${skills(v).map((s) => `<span style="background:#f7f6f2;padding:4px 10px;border-radius:99px;font-size:11px;font-weight:600">${s.name}</span>`).join('')}</div>
      ${langs(v).length ? h(T.lang) + langs(v).map((x) => `<div>${x}</div>`).join('') : ''}
    </aside>
    <main style="flex:1;padding:44px 38px">
      <div style="font-family:${SERIF};font-size:36px;font-weight:700;color:#1c1917;line-height:1.05">${e(v.fullName)}</div>
      <div style="font-size:13px;letter-spacing:2px;text-transform:uppercase;color:${c};font-weight:700;margin-top:6px">${e(v.title)}</div>
      ${v.summary ? `<p style="margin:14px 0 0;color:#57534e;line-height:1.65">${e(v.summary)}</p>` : ''}
      ${h(T.exp)}
      ${exps(v).map((x) => `<div style="margin-bottom:14px"><div style="display:flex;justify-content:space-between"><b style="font-size:13.5px">${x.role}</b><span style="font-size:11px;color:#78716c">${x.p}</span></div><div style="color:${c};font-weight:600;font-size:12px">${x.co}</div>${bullets(x.d)}</div>`).join('')}
      ${h(T.edu)}
      ${edus(v).map((x) => `<div style="margin-bottom:8px"><b>${x.s}</b> — ${x.m} <span style="color:#78716c;font-size:11px">(${x.p})</span></div>`).join('')}
      ${certs(v).length ? h(T.cert) + certs(v).map((x) => `<div style="margin:3px 0">${x}</div>`).join('') : ''}
    </main>`);
}

// 40. Retro Press / Risograph Editorial Chronicle
function retroCv(v, T) {
  const c = color(v.color, '#9f1239');
  const h = (t) => `<div style="font-family:${SERIF};font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:${c};border-top:2px solid #1c1917;border-bottom:1px solid #1c1917;padding:4px 0;margin:16px 0 10px">${t}</div>`;
  return page('background:#f5efe4;color:#1c1917;padding:36px 44px', `
    <div style="border-top:4px solid #1c1917;border-bottom:2px solid #1c1917;padding:12px 0;text-align:center">
      <div style="display:flex;justify-content:space-between;font-size:10px;text-transform:uppercase;letter-spacing:2px;border-bottom:1px solid #1c1917;padding-bottom:6px;margin-bottom:10px"><span>VOL. 2026 // DOSSIER</span><span>${e(v.title)}</span><span>SPECIAL EDITION</span></div>
      <div style="font-family:${SERIF};font-size:42px;font-weight:900;line-height:.95;letter-spacing:-1px">${e(v.fullName)}</div>
      <div style="margin-top:10px;font-size:11px">${contacts(v).map(([, x]) => e(x)).join('  •  ')}</div>
    </div>
    <div style="display:grid;grid-template-columns:1.6fr 1fr;gap:26px;margin-top:16px">
      <div style="border-right:1px solid #1c1917;padding-right:26px">
        ${v.summary ? `<p style="font-family:${SERIF};font-size:13.5px;line-height:1.65;margin:0 0 14px"><b>${T.summary} — </b>${e(v.summary)}</p>` : ''}
        ${h(T.exp)}
        ${exps(v).map((x) => `<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between"><b style="font-family:${SERIF};font-size:14px">${x.role}</b><span style="font-size:11px;font-weight:700;color:${c}">${x.p}</span></div><div style="font-style:italic;font-family:${SERIF}">${x.co}</div>${bullets(x.d)}</div>`).join('')}
      </div>
      <div>
        ${h(T.skills)}
        <div style="display:flex;flex-wrap:wrap;gap:6px">${skills(v).map((s) => `<span style="border:1.5px solid #1c1917;padding:2px 8px;font-size:11px;font-weight:700">${s.name}</span>`).join('')}</div>
        ${h(T.edu)}
        ${edus(v).map((x) => `<div style="margin-bottom:8px"><b>${x.s}</b><div>${x.m}</div><div style="font-size:11px">${x.p}${x.n ? ` · ${x.n}` : ''}</div></div>`).join('')}
        ${langs(v).length ? h(T.lang) + langs(v).join('<br>') : ''}
        ${certs(v).length ? h(T.cert) + certs(v).map((x) => `<div style="margin:3px 0;font-size:11.5px">★ ${x}</div>`).join('') : ''}
      </div>
    </div>`);
}

const LAYOUTS = [
  { key: 'claude', fn: claudeCv, cols: 2, photo: true, vi: 'Biên tập Ấm áp', en: 'Warm Editorial', tags: ['creative', 'it', 'manager', 'office'] },
  { key: 'behance', fn: behanceCv, cols: 2, photo: true, vi: 'Giám đốc Nghệ thuật', en: 'Art Director', tags: ['creative', 'it', 'sales'] },
  { key: 'bento', fn: bentoCv, cols: 2, photo: true, vi: 'Bento Grid', en: 'Bento Grid', tags: ['it', 'creative', 'office', 'sales'] },
  { key: 'brutalist', fn: brutalistCv, cols: 2, photo: true, vi: 'Neo-Brutalist Studio', en: 'Neo-Brutalist', tags: ['creative', 'student', 'it'] },
  { key: 'swiss', fn: swissCv, cols: 2, photo: false, vi: 'Lưới Thụy Sĩ Bauhaus', en: 'Swiss Bauhaus Grid', tags: ['creative', 'manager', 'ats'] },
  { key: 'luxury', fn: luxuryCv, cols: 1, photo: false, vi: 'Luxury Couture', en: 'Luxury Couture', tags: ['manager', 'finance', 'traditional'] },
  { key: 'opensource', fn: opensourceCv, cols: 1, photo: true, vi: 'GitHub Open-Source', en: 'GitHub Open-Source', tags: ['it', 'ats'] },
  { key: 'architect', fn: architectCv, cols: 2, photo: false, vi: 'Bản vẽ Kiến trúc CAD', en: 'Architect CAD', tags: ['creative', 'it', 'traditional'] },
  { key: 'nordic', fn: nordicCv, cols: 2, photo: true, vi: 'Bắc Âu Vòm Nghệ Thuật', en: 'Nordic Arch', tags: ['creative', 'service', 'office'] },
  { key: 'retro', fn: retroCv, cols: 2, photo: false, vi: 'Báo chí Cổ điển', en: 'Retro Press', tags: ['creative', 'office', 'traditional'] },
  { key: 'modern', fn: modern, cols: 2, photo: true, vi: 'Hiện đại (Cột trái)', en: 'Modern Sidebar', tags: ['office', 'sales'] },
  { key: 'creative', fn: creative, cols: 2, photo: true, vi: 'Sáng tạo Timeline', en: 'Creative Timeline', tags: ['creative', 'it'] },
  { key: 'executive', fn: executive, cols: 2, photo: false, vi: 'Quản lý Điều hành', en: 'Executive', tags: ['manager', 'finance'] },
  { key: 'minimal', fn: minimal, cols: 1, photo: false, vi: 'Chuẩn ATS Quốc tế', en: 'Minimal ATS', tags: ['ats', 'it'] },
  { key: 'rightside', fn: rightSide, cols: 2, photo: true, vi: 'Cột phải Thanh lịch', en: 'Right Column', tags: ['office', 'sales'] },
  { key: 'tech', fn: tech, cols: 1, photo: false, vi: 'Kỹ sư Phần mềm', en: 'Developer Terminal', tags: ['it'] },
  { key: 'fresher', fn: fresher, cols: 1, photo: true, vi: 'Sinh viên Mới ra trường', en: 'Graduate', tags: ['student'] },
  { key: 'bold', fn: bold, cols: 1, photo: false, vi: 'Typography Đương đại', en: 'Bold Typography', tags: ['creative', 'sales'] },
  { key: 'timeline', fn: timeline, cols: 1, photo: true, vi: 'Trục Thời gian Đối xứng', en: 'Centre Timeline', tags: ['creative', 'office'] },
  { key: 'infographic', fn: infographic, cols: 2, photo: true, vi: 'Infographic Biểu đồ', en: 'Infographic', tags: ['creative', 'sales', 'it'] },
  { key: 'magazine', fn: magazine, cols: 1, photo: false, vi: 'Tạp chí 3 Cột', en: 'Magazine 3-Col', tags: ['creative'] },
  { key: 'polaroid', fn: polaroid, cols: 1, photo: true, vi: 'Polaroid Dán Giấy', en: 'Polaroid Craft', tags: ['creative', 'student', 'service'] },
  { key: 'dark', fn: dark, cols: 2, photo: true, vi: 'Nền tối Cyberpunk', en: 'Dark Neon', tags: ['it', 'creative'] },
  { key: 'vertical', fn: vertical, cols: 2, photo: true, vi: 'Trục Tên Dọc', en: 'Vertical Spine', tags: ['creative'] },
  { key: 'glass', fn: glass, cols: 2, photo: true, vi: 'Kính mờ Gradient', en: 'Glass Gradient', tags: ['creative'] },
  { key: 'dense', fn: dense, cols: 1, photo: false, vi: 'Bảng Gọn Chuyên Gia', en: 'Dense Senior Grid', tags: ['manager', 'ats', 'finance'] },
  { key: 'organic', fn: organic, cols: 2, photo: true, vi: 'Pastel Mềm mại', en: 'Organic Pastel', tags: ['service', 'creative', 'student'] },
  { key: 'monogram', fn: monogram, cols: 1, photo: false, vi: 'Monogram Doanh nhân', en: 'Corporate Monogram', tags: ['manager', 'finance', 'office'] },
  { key: 'split', fn: split, cols: 2, photo: true, vi: 'Chia Đôi Tương phản', en: 'Split Contrast', tags: ['office', 'it'] },
  { key: 'geometric', fn: geometric, cols: 1, photo: true, vi: 'Hình khối Đa giác', en: 'Geometric Prism', tags: ['creative', 'it'] },
  { key: 'sketch', fn: sketch, cols: 1, photo: true, vi: 'Sổ tay Vẽ tay', en: 'Hand-Drawn Sketch', tags: ['creative', 'student'] },
  { key: 'badges', fn: badges, cols: 1, photo: true, vi: 'Huy hiệu Vector', en: 'Icon Badges', tags: ['office', 'service', 'sales'] }
];

const PALETTES = [
  { key: 'navy', c: '#1e3a5f', vi: 'Xanh navy', en: 'Navy' },
  { key: 'terracotta', c: '#d97757', vi: 'Cam đất nung', en: 'Terracotta' },
  { key: 'cobalt', c: '#0057ff', vi: 'Xanh cobalt', en: 'Cobalt' },
  { key: 'blue', c: '#1f55e6', vi: 'Xanh dương', en: 'Blue' },
  { key: 'teal', c: '#0d9488', vi: 'Xanh ngọc', en: 'Teal' },
  { key: 'green', c: '#15803d', vi: 'Xanh lá', en: 'Green' },
  { key: 'amber', c: '#b45309', vi: 'Cam đất', en: 'Amber' },
  { key: 'wine', c: '#9f1239', vi: 'Đỏ rượu', en: 'Wine' },
  { key: 'violet', c: '#6d28d9', vi: 'Tím', en: 'Violet' },
  { key: 'pink', c: '#db2777', vi: 'Hồng', en: 'Pink' },
  { key: 'graphite', c: '#111827', vi: 'Than chì', en: 'Graphite' }
];

// Ids of removed near-duplicate designs keep working by pointing at their closest replacement.
export const RETIRED_CV_IDS = { 'cv-classic': 'cv-luxury-wine' };
const RETIRED_LAYOUTS = {
  classic: 'luxury',
  centered: 'timeline',
  academic: 'minimal',
  elegant: 'dense',
  gauges: 'infographic',
  waves: 'creative',
  twotone: 'executive',
  ribbon: 'fresher',
  frame: 'luxury',
  boxed: 'bento',
  zen: 'minimal',
  diagonal: 'creative'
};
export const resolveCvId = (id) => {
  if (RETIRED_CV_IDS[id]) return RETIRED_CV_IDS[id];
  const m = /^cv-([a-z]+)-([a-z]+)$/.exec(id || '');
  return m && RETIRED_LAYOUTS[m[1]] ? `cv-${RETIRED_LAYOUTS[m[1]]}-${m[2]}` : id;
};

export const CV_FILTERS = {
  vi: { office: 'Văn phòng', sales: 'Kinh doanh', creative: 'Sáng tạo', it: 'IT', manager: 'Quản lý', finance: 'Tài chính – Ngân hàng', traditional: 'Truyền thống', ats: 'Chuẩn ATS', service: 'Dịch vụ', student: 'Sinh viên' },
  en: { office: 'Office', sales: 'Sales', creative: 'Creative', it: 'IT', manager: 'Management', finance: 'Finance', traditional: 'Traditional', ats: 'ATS-friendly', service: 'Service', student: 'Graduate' }
};

// 30 distinct layouts × 9 palettes (near-duplicates removed in 10/2026). The gallery shows one card per layout; colour is picked separately. Old ids (cv, cv-creative, …) still resolve.
export function cvTemplates(lang = 'vi') {
  const vi = lang === 'vi';
  const T = sectionTitles(vi);
  const fields = fieldsFor(vi);
  const legacy = { 'modern-navy': 'cv', 'creative-teal': 'cv-creative', 'executive-amber': 'cv-executive', 'minimal-graphite': 'cv-minimal' };
  const out = [];
  for (const L of LAYOUTS) {
    for (const P of PALETTES) {
      out.push({
        id: legacy[`${L.key}-${P.key}`] || `cv-${L.key}-${P.key}`,
        group: 'cv', fullBleed: true, accent: P.c,
        layout: L.key, cols: L.cols, photo: L.photo, tags: L.tags,
        layoutName: vi ? L.vi : L.en, paletteName: vi ? P.vi : P.en, palette: P.key,
        name: `CV · ${vi ? L.vi : L.en} · ${vi ? P.vi : P.en}`,
        fields,
        render: (v) => L.fn({ ...v, color: v.color || P.c }, T)
      });
    }
  }
  return out;
}
