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

// 41–108. Specialized Industry & Structural Archetype Engine (68 Distinct Non-Duplicate Architectures)
const MONO_FONT = `'JetBrains Mono',Consolas,monospace`;
const HAND_FONT = `'Segoe Print','Bradley Hand',cursive`;

function renderSkillMode(list, c, mode = 0, dark = false) {
  const m = mode % 8;
  const fg = dark ? '#e2e8f0' : '#1e293b';
  const mut = dark ? '#334155' : '#e2e8f0';
  if (m === 0) {
    return `<div style="display:flex;flex-wrap:wrap;gap:5px">${list.map((s) => `<span style="padding:3px 9px;border-radius:6px;background:${c}18;color:${dark ? '#fff' : c};border:1px solid ${c}44;font-size:11px;font-weight:700">${s.name} · ${s.level * 20}%</span>`).join('')}</div>`;
  }
  if (m === 1) {
    return list.map((s) => `<div style="margin:5px 0"><div style="display:flex;justify-content:space-between;font-size:11px;font-weight:600;color:${fg}"><span>${s.name}</span><span style="color:${c}">${s.level}/5</span></div><div style="display:grid;grid-template-columns:repeat(5,1fr);gap:3px;margin-top:2px">${[1, 2, 3, 4, 5].map((i) => `<span style="height:5px;border-radius:2px;background:${i <= s.level ? c : mut}"></span>`).join('')}</div></div>`).join('');
  }
  if (m === 2) {
    return `<table style="width:100%;border-collapse:collapse;font-size:11px">${list.map((s) => `<tr style="border-bottom:1px dashed ${mut}"><td style="padding:4px 0;font-weight:600;color:${fg}">${s.name}</td><td style="padding:4px 0;text-align:right;color:${c};font-family:${MONO_FONT}">${'■'.repeat(s.level)}${'□'.repeat(5 - s.level)}</td></tr>`).join('')}</table>`;
  }
  if (m === 3) {
    return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">${list.map((s) => `<div style="padding:5px 8px;border:1px solid ${mut};border-radius:8px;display:flex;justify-content:space-between;align-items:center;font-size:11px"><b style="color:${fg}">${s.name}</b><span style="background:${c};color:#fff;border-radius:99px;padding:1px 6px;font-size:9.5px;font-weight:800">L${s.level}</span></div>`).join('')}</div>`;
  }
  if (m === 4) {
    return list.map((s) => `<div style="display:flex;align-items:center;gap:8px;margin:5px 0;font-size:11px"><span style="width:85px;font-weight:600;color:${fg};flex-shrink:0">${s.name}</span><div style="flex:1;height:7px;background:${mut};border-radius:99px;overflow:hidden"><div style="width:${s.level * 20}%;height:100%;background:linear-gradient(90deg,${c},${c}aa)"></div></div></div>`).join('');
  }
  if (m === 5) {
    return `<div style="display:flex;flex-wrap:wrap;gap:6px">${list.map((s) => `<span style="padding:3px 10px;border:1.5px solid ${dark ? c : '#0f172a'};box-shadow:2px 2px 0 ${c};font-size:10.5px;font-weight:800;background:${dark ? '#0f172a' : '#fff'};color:${fg}">#${s.name}</span>`).join('')}</div>`;
  }
  if (m === 6) {
    return list.map((s) => `<div style="display:flex;justify-content:space-between;padding:3px 0;font-size:11.5px;border-bottom:1px solid ${mut}"><span style="color:${fg}">${s.name}</span><span style="color:${c};letter-spacing:2px">${'●'.repeat(s.level)}${'○'.repeat(5 - s.level)}</span></div>`).join('');
  }
  return `<div style="display:flex;flex-wrap:wrap;gap:5px">${list.map((s) => `<span style="padding:3px 10px;border-radius:99px;background:${dark ? '#1e293b' : '#f1f5f9'};color:${fg};font-size:11px;font-weight:600"><b style="color:${c}">✦</b> ${s.name}</span>`).join('')}</div>`;
}

const SURFACE_TINTS = [
  ['#ffffff', '#f8fafc', '#cbd5e1'],
  ['#fcfbf7', '#f4f0e6', '#d6cfc2'],
  ['#f6f9fc', '#edf2f7', '#cbd5e1'],
  ['#f7fbf8', '#ebf5ee', '#c6e0ce'],
  ['#faf8ff', '#f2edfc', '#d8ccf0'],
  ['#fffaf5', '#fdf2e6', '#e8d2bc'],
  ['#f8faf9', '#eef3f1', '#cbd8d3'],
  ['#fff9fb', '#fceef3', '#e5c8d3']
];

function makeSpecializedCv(cfg) {
  const seed = Array.from(String(cfg.key || '')).reduce((acc, ch, idx) => acc + ch.charCodeAt(0) * (idx + 3), 0);
  const tint = SURFACE_TINTS[seed % SURFACE_TINTS.length];
  const altVariant = seed % 2 === 1;
  return function (v, T) {
    const c = color(v.color, cfg.c || '#1e3a5f');
    const font = cfg.serif ? SERIF : cfg.mono ? MONO_FONT : cfg.hand ? HAND_FONT : FONT;
    const dark = !!cfg.dark;
    const bg = cfg.bg || (dark ? '#0b1120' : tint[0]);
    const fg = dark ? '#f1f5f9' : '#0f172a';
    const sub = dark ? '#94a3b8' : '#475569';
    const bdr = dark ? '#334155' : (cfg.bdr || tint[2]);
    const cardBg = dark ? '#1e293b' : (cfg.cardBg || tint[1]);
    const badge = cfg.badge || 'PRO DOSSIER';
    const skMode = typeof cfg.sk === 'number' ? (cfg.sk + (seed % 3)) % 8 : seed % 8;
    const skHtml = renderSkillMode(skills(v), c, skMode, dark);
    const contactLine = contacts(v).map(([ic, x]) => `<span>${ic} ${e(x)}</span>`).join(cfg.sep || '  ·  ');

    if (cfg.arch === 'hud' && altVariant) {
      return page(`background:${bg};color:${fg};font-family:${font};padding:0;display:grid;grid-template-columns:225px 1fr`, `
        <aside style="background:${dark ? '#060911' : '#0f172a'};color:#e2e8f0;padding:28px 20px;border-right:3px solid ${c};display:flex;flex-direction:column;gap:14px">
          <div style="font-family:${MONO_FONT};font-size:9.5px;color:${c};letter-spacing:1.5px;font-weight:800">// ${badge}</div>
          ${cfg.photo ? `<div style="margin:4px 0">${avatar(v, 88, c, c)}</div>` : `<div style="width:64px;height:64px;border:2px solid ${c};background:${c}22;display:grid;place-items:center;font-family:${MONO_FONT};font-size:22px;font-weight:900;color:${c}">${e(initials(v.fullName))}</div>`}
          <div>
            <div style="font-family:${MONO_FONT};font-size:10px;color:${c};text-transform:uppercase;letter-spacing:1.2px;margin-bottom:6px">[SYS.CONTACT]</div>
            <div style="font-size:10.5px;line-height:1.7;color:#cbd5e1">${contacts(v).map(([ic, x]) => `<div style="word-break:break-word">${ic} ${e(x)}</div>`).join('')}</div>
          </div>
          <div>
            <div style="font-family:${MONO_FONT};font-size:10px;color:${c};text-transform:uppercase;letter-spacing:1.2px;margin-bottom:6px">[SYS.STACK]</div>
            ${renderSkillMode(skills(v), c, 1, true)}
          </div>
          ${langs(v).length ? `<div><div style="font-family:${MONO_FONT};font-size:10px;color:${c};text-transform:uppercase;margin-bottom:4px">[LOCALE]</div><div style="font-size:11px;color:#cbd5e1">${langs(v).join('<br>')}</div></div>` : ''}
        </aside>
        <main style="padding:28px 30px">
          <div style="border-bottom:2px solid ${c};padding-bottom:12px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:flex-end">
            <div>
              <div style="font-size:28px;font-weight:900;letter-spacing:-.5px;color:${fg}">${e(v.fullName)}</div>
              <div style="font-family:${MONO_FONT};font-size:13px;color:${c};font-weight:700;margin-top:2px">$ whoami :: ${e(v.title)}</div>
            </div>
            <span style="padding:3px 9px;background:${c}22;border:1px solid ${c};color:${c};font-family:${MONO_FONT};font-size:10px;font-weight:800">NODE_OK</span>
          </div>
          ${v.summary ? `<div style="padding:10px 14px;background:${cardBg};border:1px dashed ${c};border-radius:6px;font-size:12px;color:${sub};margin-bottom:14px">${e(v.summary)}</div>` : ''}
          <div style="font-family:${MONO_FONT};font-size:11.5px;font-weight:800;color:${c};text-transform:uppercase;letter-spacing:1.2px;margin-bottom:8px">01 // ${T.exp}</div>
          ${exps(v).map((x, i) => `<div style="margin-bottom:11px;padding:10px 13px;border-left:3px solid ${c};background:${cardBg}"><div style="display:flex;justify-content:space-between;gap:8px"><b style="font-size:13px;color:${fg}">[${i + 1}] ${x.role}</b><span style="font-family:${MONO_FONT};font-size:10.5px;color:${c}">${x.p}</span></div><div style="font-size:11.5px;color:${sub};font-weight:700">${x.co}</div>${bullets(x.d)}</div>`).join('')}
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:12px">
            <div style="padding:10px 12px;border:1px solid ${bdr};background:${cardBg}">
              <div style="font-family:${MONO_FONT};font-size:11px;font-weight:800;color:${c};text-transform:uppercase;margin-bottom:6px">02 // ${T.edu}</div>
              ${edus(v).map((x) => `<div style="margin-bottom:6px;font-size:11.5px"><b>${x.s}</b><div style="color:${sub}">${x.m} (${x.p})</div></div>`).join('')}
            </div>
            <div style="padding:10px 12px;border:1px solid ${bdr};background:${cardBg}">
              <div style="font-family:${MONO_FONT};font-size:11px;font-weight:800;color:${c};text-transform:uppercase;margin-bottom:6px">03 // ${T.cert}</div>
              ${certs(v).map((x) => `<div style="font-size:11px;color:${sub};margin:3px 0">▸ ${x}</div>`).join('')}
            </div>
          </div>
        </main>`);
    }

    if (cfg.arch === 'ledger' && altVariant) {
      return page(`background:${bg};color:${fg};font-family:${font};padding:34px 40px`, `
        <div style="display:grid;grid-template-columns:1fr auto;gap:20px;align-items:center;border-top:4px solid ${c};border-bottom:1.5px solid ${fg};padding:14px 0;margin-bottom:16px">
          <div>
            <div style="font-size:10px;font-weight:800;letter-spacing:2.5px;color:${c};text-transform:uppercase">INDEX // ${badge}</div>
            <div style="font-size:32px;font-weight:900;letter-spacing:-.6px;margin-top:2px">${e(v.fullName)}</div>
            <div style="font-size:13.5px;font-weight:700;color:${sub};margin-top:2px">${e(v.title)}</div>
          </div>
          ${cfg.photo ? avatar(v, 80, c, c) : `<div style="text-align:right;font-size:11px;color:${sub};line-height:1.65">${contacts(v).map(([, x]) => `<div>${e(x)}</div>`).join('')}</div>`}
        </div>
        ${cfg.photo ? `<div style="font-size:11px;color:${sub};padding-bottom:10px;margin-bottom:12px;border-bottom:1px solid ${bdr};display:flex;flex-wrap:wrap;gap:14px">${contactLine}</div>` : ''}
        ${v.summary ? `<div style="display:grid;grid-template-columns:110px 1fr;gap:16px;padding:10px 0;border-bottom:1px solid ${bdr};margin-bottom:12px"><div style="font-size:10.5px;font-weight:900;color:${c};text-transform:uppercase;letter-spacing:1.2px">01 / ${T.summary}</div><div style="font-size:12.5px;color:${sub}">${e(v.summary)}</div></div>` : ''}
        <div style="display:grid;grid-template-columns:110px 1fr;gap:16px;padding:10px 0;border-bottom:1px solid ${bdr};margin-bottom:12px">
          <div style="font-size:10.5px;font-weight:900;color:${c};text-transform:uppercase;letter-spacing:1.2px">02 / ${T.exp}</div>
          <div>
            ${exps(v).map((x) => `<div style="margin-bottom:12px;padding-bottom:10px;border-bottom:1px dashed ${bdr}"><div style="display:flex;justify-content:space-between;align-items:baseline"><b style="font-size:13.5px">${x.role} — <span style="color:${c}">${x.co}</span></b><span style="font-size:11px;font-weight:700;color:${sub}">${x.p}</span></div>${bullets(x.d)}</div>`).join('')}
          </div>
        </div>
        <div style="display:grid;grid-template-columns:110px 1fr 1fr;gap:16px;padding:10px 0">
          <div style="font-size:10.5px;font-weight:900;color:${c};text-transform:uppercase;letter-spacing:1.2px">03 / ${T.skills} & ${T.edu}</div>
          <div style="background:${cardBg};padding:12px;border-left:3px solid ${c}">
            <div style="font-size:11px;font-weight:800;text-transform:uppercase;margin-bottom:6px;color:${c}">${T.skills}</div>
            ${skHtml}
          </div>
          <div style="background:${cardBg};padding:12px;border-left:3px solid ${fg}">
            <div style="font-size:11px;font-weight:800;text-transform:uppercase;margin-bottom:6px;color:${fg}">${T.edu}</div>
            ${edus(v).map((x) => `<div style="margin-bottom:6px;font-size:11.5px"><b>${x.s}</b><div>${x.m} · ${x.p}</div></div>`).join('')}
            ${certs(v).map((x) => `<div style="font-size:11px;color:${sub};margin-top:3px">• ${x}</div>`).join('')}
          </div>
        </div>`);
    }

    if (cfg.arch === 'deck' && altVariant) {
      return page(`background:${bg};color:${fg};font-family:${font};padding:28px 34px`, `
        <div style="display:grid;grid-template-columns:1.35fr 1fr;gap:14px;margin-bottom:16px">
          <div style="background:${c};color:#fff;border-radius:14px;padding:22px 24px;display:flex;gap:16px;align-items:center">
            ${cfg.photo ? avatar(v, 78, '#fff', 'rgba(255,255,255,.35)') : ''}
            <div>
              <div style="font-size:9.5px;font-weight:800;letter-spacing:2px;opacity:.85;text-transform:uppercase">${badge}</div>
              <div style="font-size:28px;font-weight:900;line-height:1.06;margin-top:3px">${e(v.fullName)}</div>
              <div style="font-size:13.5px;font-weight:600;opacity:.92;margin-top:3px">${e(v.title)}</div>
            </div>
          </div>
          <div style="background:${cardBg};border:1.5px solid ${bdr};border-radius:14px;padding:16px 18px;display:flex;flex-direction:column;justify-content:center;font-size:11px;line-height:1.7;color:${sub}">
            <div style="font-size:10px;font-weight:800;color:${c};letter-spacing:1.4px;text-transform:uppercase;margin-bottom:4px">${T.contact}</div>
            ${contacts(v).map(([ic, x]) => `<div style="word-break:break-word">${ic} ${e(x)}</div>`).join('')}
          </div>
        </div>
        ${v.summary ? `<div style="padding:12px 16px;background:${cardBg};border-left:4px solid ${c};border-radius:0 10px 10px 0;margin-bottom:16px;font-size:12.5px;color:${sub}">${e(v.summary)}</div>` : ''}
        <div style="display:grid;grid-template-columns:1.6fr 1fr;gap:20px">
          <div>
            <div style="font-size:11.5px;font-weight:900;text-transform:uppercase;letter-spacing:1.5px;color:${c};margin-bottom:10px">■ ${T.exp}</div>
            ${exps(v).map((x) => `<div style="margin-bottom:12px;padding:12px 14px;background:${cardBg};border:1px solid ${bdr};border-radius:10px"><div style="display:flex;justify-content:space-between;align-items:baseline"><b style="font-size:13.5px">${x.role}</b><span style="padding:2px 8px;border-radius:99px;background:${c}18;color:${c};font-size:10.5px;font-weight:700">${x.p}</span></div><div style="font-size:12px;font-weight:700;color:${sub};margin-top:2px">${x.co}</div>${bullets(x.d)}</div>`).join('')}
          </div>
          <div style="display:flex;flex-direction:column;gap:12px">
            <div style="padding:14px 16px;background:${cardBg};border:1px solid ${bdr};border-radius:10px">
              <div style="font-size:11.5px;font-weight:900;text-transform:uppercase;letter-spacing:1.5px;color:${c};margin-bottom:8px">■ ${T.skills}</div>
              ${skHtml}
            </div>
            <div style="padding:14px 16px;background:${cardBg};border:1px solid ${bdr};border-radius:10px">
              <div style="font-size:11.5px;font-weight:900;text-transform:uppercase;letter-spacing:1.5px;color:${c};margin-bottom:8px">■ ${T.edu}</div>
              ${edus(v).map((x) => `<div style="margin-bottom:8px"><b>${x.s}</b><div>${x.m}</div><div style="font-size:11px;color:${sub}">${x.p}</div></div>`).join('')}
            </div>
            ${langs(v).length || certs(v).length ? `<div style="padding:14px 16px;background:${cardBg};border:1px solid ${bdr};border-radius:10px"><div style="font-size:11.5px;font-weight:900;text-transform:uppercase;letter-spacing:1.5px;color:${c};margin-bottom:6px">■ ${T.lang} & ${T.cert}</div>${[...langs(v), ...certs(v)].map((x) => `<div style="font-size:11.5px;margin:3px 0">▸ ${x}</div>`).join('')}</div>` : ''}
          </div>
        </div>`);
    }

    if (cfg.arch === 'editorial' && altVariant) {
      return page(`background:${bg};color:${fg};font-family:${font};padding:34px 38px`, `
        <div style="text-align:center;border-top:3px double ${fg};border-bottom:3px double ${fg};padding:14px 0;margin-bottom:16px">
          <div style="font-size:10px;font-weight:800;letter-spacing:3.5px;text-transform:uppercase;color:${c}">${badge} · EDITION 2026</div>
          <div style="font-family:${SERIF};font-size:38px;font-weight:900;letter-spacing:-.5px;margin:4px 0">${e(v.fullName)}</div>
          <div style="font-size:14px;font-style:italic;color:${c};font-weight:700">${e(v.title)}</div>
          <div style="margin-top:8px;font-size:11px;color:${sub};display:flex;justify-content:center;flex-wrap:wrap;gap:14px">${contactLine}</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1.65fr;gap:24px">
          <div style="border-right:1px solid ${bdr};padding-right:20px">
            ${cfg.photo ? `<div style="margin-bottom:14px;text-align:center">${avatar(v, 110, c, c)}</div>` : ''}
            ${v.summary ? `<div style="margin-bottom:14px;font-size:12px;font-style:italic;color:${sub};background:${cardBg};padding:12px;border-top:2px solid ${c}">“${e(v.summary)}”</div>` : ''}
            <div style="font-family:${SERIF};font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:${c};border-bottom:1px solid ${bdr};padding-bottom:4px;margin-bottom:8px">${T.skills}</div>
            ${skHtml}
            <div style="font-family:${SERIF};font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:${c};border-bottom:1px solid ${bdr};padding-bottom:4px;margin:14px 0 8px">${T.edu}</div>
            ${edus(v).map((x) => `<div style="margin-bottom:8px;font-size:12px"><b>${x.s}</b><div>${x.m}</div><div style="font-size:11px;color:${sub}">${x.p}</div></div>`).join('')}
            ${langs(v).length ? `<div style="font-family:${SERIF};font-size:13px;font-weight:800;text-transform:uppercase;color:${c};margin:14px 0 6px">${T.lang}</div><div style="font-size:11.5px">${langs(v).join(' · ')}</div>` : ''}
          </div>
          <div>
            <div style="font-family:${SERIF};font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:${c};border-bottom:1.5px solid ${fg};padding-bottom:4px;margin-bottom:12px">${T.exp}</div>
            ${exps(v).map((x, i) => `<div style="margin-bottom:14px"><div style="display:flex;justify-content:space-between;align-items:baseline"><b style="font-size:14px;font-family:${SERIF}">§${i + 1}. ${x.role}</b><span style="font-size:11px;color:${c};font-weight:700">${x.p}</span></div><div style="font-size:12px;font-weight:700;color:${sub};margin-bottom:3px">${x.co}</div>${bullets(x.d)}</div>`).join('')}
            ${certs(v).length ? `<div style="font-family:${SERIF};font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:${c};border-bottom:1.5px solid ${fg};padding-bottom:4px;margin:16px 0 8px">${T.cert}</div>` + certs(v).map((x) => `<div style="font-size:11.5px;margin:3px 0">✦ ${x}</div>`).join('') : ''}
          </div>
        </div>`);
    }

    if (cfg.arch === 'hud') {
      return page(`background:${bg};color:${fg};font-family:${font};padding:28px 34px`, `
        <div style="border:1.5px solid ${c};border-radius:12px;overflow:hidden;background:${cardBg};margin-bottom:16px">
          <div style="background:${c};color:#fff;padding:6px 14px;font-family:${MONO_FONT};font-size:10px;font-weight:800;display:flex;justify-content:space-between">
            <span>● ● ●  ${badge} // SYS.VER.2026</span><span>STATUS: ACTIVE</span>
          </div>
          <div style="padding:20px 24px;display:flex;gap:20px;align-items:center">
            ${cfg.photo ? avatar(v, 86, c, c) : `<div style="width:68px;height:68px;border-radius:12px;border:2px solid ${c};display:grid;place-items:center;font-family:${MONO_FONT};font-size:24px;font-weight:900;color:${c}">${e(initials(v.fullName))}</div>`}
            <div style="flex:1">
              <div style="font-size:28px;font-weight:900;letter-spacing:-.5px;color:${fg}">${e(v.fullName)}</div>
              <div style="font-family:${MONO_FONT};font-size:13px;color:${c};font-weight:700;margin-top:2px">&gt; ${e(v.title)}</div>
              <div style="margin-top:8px;font-size:11px;color:${sub};display:flex;flex-wrap:wrap;gap:12px">${contactLine}</div>
            </div>
          </div>
        </div>
        ${v.summary ? `<div style="padding:10px 14px;border-left:3px solid ${c};background:${cardBg};font-size:12px;color:${sub};margin-bottom:14px"><b style="color:${c};font-family:${MONO_FONT}">// ${T.summary}:</b> ${e(v.summary)}</div>` : ''}
        <div style="display:grid;grid-template-columns:1.6fr 1fr;gap:18px">
          <div>
            <div style="font-family:${MONO_FONT};font-size:11.5px;font-weight:800;color:${c};text-transform:uppercase;letter-spacing:1.2px;margin-bottom:8px;border-bottom:1px solid ${bdr};padding-bottom:4px">[01] ${T.exp}</div>
            ${exps(v).map((x, i) => `<div style="margin-bottom:11px;padding:11px 13px;border:1px solid ${bdr};border-radius:8px;background:${cardBg}"><div style="display:flex;justify-content:space-between;gap:8px"><b style="font-size:13px;color:${fg}">0${i + 1}. ${x.role}</b><span style="font-family:${MONO_FONT};font-size:10.5px;color:${c};white-space:nowrap">[${x.p}]</span></div><div style="font-size:11.5px;color:${sub};font-weight:700">${x.co}</div>${bullets(x.d)}</div>`).join('')}
          </div>
          <div>
            <div style="font-family:${MONO_FONT};font-size:11.5px;font-weight:800;color:${c};text-transform:uppercase;letter-spacing:1.2px;margin-bottom:8px;border-bottom:1px solid ${bdr};padding-bottom:4px">[02] ${T.skills}</div>
            ${skHtml}
            <div style="font-family:${MONO_FONT};font-size:11.5px;font-weight:800;color:${c};text-transform:uppercase;letter-spacing:1.2px;margin:16px 0 8px;border-bottom:1px solid ${bdr};padding-bottom:4px">[03] ${T.edu}</div>
            ${edus(v).map((x) => `<div style="margin-bottom:8px;font-size:12px"><b style="color:${fg}">${x.s}</b><div style="color:${sub}">${x.m}</div><div style="font-family:${MONO_FONT};font-size:10.5px;color:${c}">${x.p}${x.n ? ` · ${x.n}` : ''}</div></div>`).join('')}
            ${langs(v).length ? `<div style="font-family:${MONO_FONT};font-size:11.5px;font-weight:800;color:${c};text-transform:uppercase;margin:14px 0 6px">[04] ${T.lang}</div><div style="font-size:11.5px;color:${sub}">${langs(v).join(' · ')}</div>` : ''}
            ${certs(v).length ? `<div style="font-family:${MONO_FONT};font-size:11.5px;font-weight:800;color:${c};text-transform:uppercase;margin:14px 0 6px">[05] ${T.cert}</div>` + certs(v).map((x) => `<div style="font-size:11px;color:${sub};margin:2px 0">✓ ${x}</div>`).join('') : ''}
          </div>
        </div>`);
    }

    if (cfg.arch === 'ledger') {
      return page(`background:${bg};color:${fg};font-family:${font};padding:32px 38px`, `
        <div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid ${c};padding-bottom:8px;margin-bottom:12px">
          <div><span style="font-size:10px;font-weight:800;letter-spacing:2px;color:${c};text-transform:uppercase">${badge}</span><div style="font-size:30px;font-weight:900;line-height:1.05">${e(v.fullName)}</div></div>
          <div style="text-align:right;font-size:13px;font-weight:700;color:${c}">${e(v.title)}</div>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:14px;font-size:11.5px;border:1.5px solid ${bdr}">
          <tr>
            ${cfg.photo ? `<td rowspan="2" style="width:96px;padding:8px;border:1px solid ${bdr};text-align:center;background:${cardBg}">${avatar(v, 80, c, bdr)}</td>` : ''}
            <td style="padding:7px 12px;border:1px solid ${bdr};background:${cardBg};font-weight:700;width:110px;color:${c}">${T.contact}</td>
            <td style="padding:7px 12px;border:1px solid ${bdr}">${contactLine}</td>
          </tr>
          <tr>
            <td style="padding:7px 12px;border:1px solid ${bdr};background:${cardBg};font-weight:700;color:${c}">${T.summary}</td>
            <td style="padding:7px 12px;border:1px solid ${bdr}">${e(v.summary || '')}</td>
          </tr>
        </table>
        <div style="background:${c};color:#fff;padding:5px 12px;font-size:11.5px;font-weight:800;text-transform:uppercase;letter-spacing:1.2px">${T.exp}</div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:14px;border:1.5px solid ${bdr}">
          ${exps(v).map((x) => `<tr><td style="width:135px;padding:10px 12px;border:1px solid ${bdr};background:${cardBg};vertical-align:top;font-weight:700;font-size:11px;color:${c}">${x.p}<div style="color:${sub};font-weight:600;margin-top:2px">${x.co}</div></td><td style="padding:10px 14px;border:1px solid ${bdr};vertical-align:top"><b style="font-size:13px">${x.role}</b>${bullets(x.d)}</td></tr>`).join('')}
        </table>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
          <div>
            <div style="background:${c};color:#fff;padding:5px 12px;font-size:11.5px;font-weight:800;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:8px">${T.edu} & ${T.cert}</div>
            <div style="border:1.5px solid ${bdr};padding:10px 12px">
              ${edus(v).map((x) => `<div style="margin-bottom:8px"><b>${x.s}</b> — ${x.m} <span style="color:${c};font-size:11px">(${x.p})</span></div>`).join('')}
              ${certs(v).map((x) => `<div style="font-size:11.5px;margin-top:4px">▪ ${x}</div>`).join('')}
            </div>
          </div>
          <div>
            <div style="background:${c};color:#fff;padding:5px 12px;font-size:11.5px;font-weight:800;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:8px">${T.skills} & ${T.lang}</div>
            <div style="border:1.5px solid ${bdr};padding:10px 12px">
              ${skHtml}
              ${langs(v).length ? `<div style="margin-top:8px;padding-top:6px;border-top:1px dashed ${bdr};font-size:11.5px"><b>${T.lang}:</b> ${langs(v).join(' · ')}</div>` : ''}
            </div>
          </div>
        </div>`);
    }

    if (cfg.arch === 'deck') {
      const topSkills = skills(v).slice(0, 3);
      return page(`background:${bg};color:${fg};font-family:${font};padding:0`, `
        <header style="background:${c};color:#fff;padding:28px 40px;display:flex;justify-content:space-between;align-items:center">
          <div>
            <div style="font-size:10px;font-weight:800;letter-spacing:2px;opacity:.85;text-transform:uppercase">${badge}</div>
            <div style="font-size:34px;font-weight:900;line-height:1.05;margin-top:2px">${e(v.fullName)}</div>
            <div style="font-size:14px;font-weight:600;opacity:.92;margin-top:3px">${e(v.title)}</div>
          </div>
          ${cfg.photo ? avatar(v, 86, '#fff', 'rgba(255,255,255,.35)') : `<div style="text-align:right;font-size:11px;line-height:1.7;opacity:.92">${contacts(v).map(([, x]) => `<div>${e(x)}</div>`).join('')}</div>`}
        </header>
        ${cfg.photo ? `<div style="background:#0f172a;color:#e2e8f0;padding:7px 40px;font-size:11px;display:flex;flex-wrap:wrap;gap:16px">${contactLine}</div>` : ''}
        <div style="padding:22px 40px">
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px">
            ${topSkills.map((s, i) => `<div style="background:${cardBg};border:1px solid ${bdr};border-top:3px solid ${c};border-radius:8px;padding:10px 12px"><div style="font-size:10px;font-weight:800;color:${c}">PILLAR 0${i + 1}</div><div style="font-size:13px;font-weight:800;margin-top:2px">${s.name}</div><div style="font-size:10.5px;color:${sub}">Proficiency: ${s.level * 20}%</div></div>`).join('')}
          </div>
          ${v.summary ? `<div style="background:${cardBg};border:1px solid ${bdr};border-radius:8px;padding:11px 14px;margin-bottom:14px;font-size:12.5px"><b>${T.summary}:</b> ${e(v.summary)}</div>` : ''}
          <div style="display:grid;grid-template-columns:1.65fr 1fr;gap:24px">
            <div>
              <div style="font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:1.4px;color:${c};border-bottom:2px solid ${c};padding-bottom:4px;margin-bottom:10px">${T.exp}</div>
              ${exps(v).map((x) => `<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;align-items:baseline"><b style="font-size:13.5px">${x.role}</b><span style="font-size:11px;font-weight:700;color:${c}">${x.p}</span></div><div style="font-size:12px;font-weight:700;color:${sub}">${x.co}</div>${bullets(x.d)}</div>`).join('')}
            </div>
            <div>
              <div style="font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:1.4px;color:${c};border-bottom:2px solid ${c};padding-bottom:4px;margin-bottom:10px">${T.skills}</div>
              ${skHtml}
              <div style="font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:1.4px;color:${c};border-bottom:2px solid ${c};padding-bottom:4px;margin:16px 0 10px">${T.edu}</div>
              ${edus(v).map((x) => `<div style="margin-bottom:8px"><b>${x.s}</b><div>${x.m}</div><div style="font-size:11px;color:${sub}">${x.p}${x.n ? ` · ${x.n}` : ''}</div></div>`).join('')}
              ${langs(v).length || certs(v).length ? `<div style="font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:1.4px;color:${c};border-bottom:2px solid ${c};padding-bottom:4px;margin:16px 0 8px">${T.lang} & ${T.cert}</div>` + [...langs(v), ...certs(v)].map((x) => `<div style="font-size:11.5px;margin:3px 0">▸ ${x}</div>`).join('') : ''}
            </div>
          </div>
        </div>`);
    }

    if (cfg.arch === 'editorial') {
      return page(`background:${bg};color:${fg};font-family:${font};padding:38px 44px`, `
        <div style="display:grid;grid-template-columns:${cfg.photo ? '130px 1fr' : '1fr'};gap:24px;align-items:center;border-bottom:2px solid ${fg};padding-bottom:18px">
          ${cfg.photo ? `<div style="width:130px;height:155px;border-radius:${cfg.archPhoto ? '65px 65px 12px 12px' : '14px'};overflow:hidden;border:2px solid ${c};background:${c};color:#fff;display:grid;place-items:center;font-size:38px;font-weight:800">${photoSrc(v.photo) ? `<img src="${photoSrc(v.photo)}" alt="" style="width:100%;height:100%;object-fit:cover"/>` : e(initials(v.fullName))}</div>` : ''}
          <div>
            <div style="font-size:10px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:${c}">${badge}</div>
            <div style="font-family:${SERIF};font-size:40px;font-weight:900;line-height:.96;margin:4px 0">${e(v.fullName)}</div>
            <div style="font-size:15px;font-style:italic;color:${c};font-weight:700">${e(v.title)}</div>
            <div style="margin-top:10px;font-size:11px;color:${sub};display:flex;flex-wrap:wrap;gap:12px">${contactLine}</div>
          </div>
        </div>
        ${v.summary ? `<div style="padding:14px 0;border-bottom:1px solid ${bdr};font-size:13px;font-style:italic;color:${sub}">“${e(v.summary)}”</div>` : ''}
        <div style="display:grid;grid-template-columns:1.55fr 1fr;gap:28px;margin-top:16px">
          <div>
            <div style="font-family:${SERIF};font-size:15px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:${c};margin-bottom:10px">I. ${T.exp}</div>
            ${exps(v).map((x, i) => `<div style="margin-bottom:13px;padding-bottom:10px;border-bottom:1px dashed ${bdr}"><div style="display:flex;justify-content:space-between;align-items:baseline"><b style="font-size:13.5px"><span style="color:${c};font-family:${SERIF};margin-right:4px">0${i + 1}.</span>${x.role}</b><span style="font-size:11px;color:${c};font-weight:700">${x.p}</span></div><div style="font-size:12px;font-style:italic;color:${sub}">${x.co}</div>${bullets(x.d)}</div>`).join('')}
          </div>
          <div style="background:${cardBg};padding:18px;border-radius:14px;border:1px solid ${bdr}">
            <div style="font-family:${SERIF};font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:${c};margin-bottom:8px">II. ${T.skills}</div>
            ${skHtml}
            <div style="font-family:${SERIF};font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:${c};margin:16px 0 8px">III. ${T.edu}</div>
            ${edus(v).map((x) => `<div style="margin-bottom:8px"><b>${x.s}</b><div>${x.m}</div><div style="font-size:11px;color:${sub}">${x.p}${x.n ? ` · ${x.n}` : ''}</div></div>`).join('')}
            ${langs(v).length ? `<div style="font-family:${SERIF};font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:${c};margin:14px 0 6px">IV. ${T.lang}</div><div style="font-size:11.5px">${langs(v).join(' · ')}</div>` : ''}
            ${certs(v).length ? `<div style="font-family:${SERIF};font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:${c};margin:14px 0 6px">V. ${T.cert}</div>` + certs(v).map((x) => `<div style="font-size:11.5px;margin:2px 0">✦ ${x}</div>`).join('') : ''}
          </div>
        </div>`);
    }

    if (cfg.arch === 'dock' && altVariant) {
      return page(`background:${bg};color:${fg};font-family:${font};padding:26px 30px`, `
        <div style="background:linear-gradient(135deg,${c},${dark ? '#020617' : '#0f172a'});color:#fff;border-radius:16px;padding:22px 26px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center">
          <div>
            <span style="padding:3px 10px;border-radius:99px;background:rgba(255,255,255,.16);font-size:10px;font-weight:800;letter-spacing:1.8px;text-transform:uppercase">${badge}</span>
            <div style="font-size:30px;font-weight:900;margin-top:6px">${e(v.fullName)}</div>
            <div style="font-size:14px;opacity:.9;font-weight:600">${e(v.title)}</div>
          </div>
          ${cfg.photo ? avatar(v, 86, '#fff', 'rgba(255,255,255,.4)') : `<div style="width:68px;height:68px;border-radius:50%;border:2px solid rgba(255,255,255,.5);display:grid;place-items:center;font-size:24px;font-weight:900">${e(initials(v.fullName))}</div>`}
        </div>
        <div style="display:grid;grid-template-columns:230px 1fr;gap:18px">
          <aside style="background:${cardBg};border:1.5px solid ${bdr};border-radius:14px;padding:18px;display:flex;flex-direction:column;gap:14px">
            <div>
              <div style="font-size:10.5px;font-weight:900;color:${c};text-transform:uppercase;letter-spacing:1.4px;margin-bottom:6px">${T.contact}</div>
              <div style="font-size:11px;line-height:1.7;color:${sub}">${contacts(v).map(([ic, x]) => `<div style="word-break:break-word">${ic} ${e(x)}</div>`).join('')}</div>
            </div>
            <div>
              <div style="font-size:10.5px;font-weight:900;color:${c};text-transform:uppercase;letter-spacing:1.4px;margin-bottom:6px">${T.skills}</div>
              ${skHtml}
            </div>
            ${langs(v).length ? `<div><div style="font-size:10.5px;font-weight:900;color:${c};text-transform:uppercase;letter-spacing:1.4px;margin-bottom:4px">${T.lang}</div><div style="font-size:11.5px;color:${sub}">${langs(v).join('<br>')}</div></div>` : ''}
            ${certs(v).length ? `<div><div style="font-size:10.5px;font-weight:900;color:${c};text-transform:uppercase;letter-spacing:1.4px;margin-bottom:4px">${T.cert}</div>${certs(v).map((x) => `<div style="font-size:11px;color:${sub};margin:3px 0">★ ${x}</div>`).join('')}</div>` : ''}
          </aside>
          <main>
            ${v.summary ? `<div style="padding:12px 16px;background:${cardBg};border:1px solid ${bdr};border-radius:12px;margin-bottom:14px;font-size:12.5px;color:${sub}">${e(v.summary)}</div>` : ''}
            <div style="font-size:12px;font-weight:900;color:${c};text-transform:uppercase;letter-spacing:1.4px;margin-bottom:10px">${T.exp}</div>
            ${exps(v).map((x) => `<div style="position:relative;padding-left:16px;margin-bottom:13px;border-left:2px solid ${c}"><span style="position:absolute;left:-5px;top:4px;width:8px;height:8px;border-radius:50%;background:${c}"></span><div style="display:flex;justify-content:space-between;align-items:baseline"><b style="font-size:13.5px">${x.role}</b><span style="font-size:11px;font-weight:700;color:${c}">${x.p}</span></div><div style="font-size:12px;font-weight:700;color:${sub}">${x.co}</div>${bullets(x.d)}</div>`).join('')}
            <div style="font-size:12px;font-weight:900;color:${c};text-transform:uppercase;letter-spacing:1.4px;margin:14px 0 8px">${T.edu}</div>
            ${edus(v).map((x) => `<div style="padding:10px 14px;background:${cardBg};border:1px solid ${bdr};border-radius:10px;margin-bottom:8px"><b>${x.s}</b> — ${x.m} <span style="font-size:11px;color:${c}">(${x.p})</span></div>`).join('')}
          </main>
        </div>`);
    }

    if (cfg.arch === 'dock') {
      const side = `<aside style="width:248px;background:${cfg.sideBg || c};color:${cfg.sideFg || '#fff'};padding:34px 24px;flex-shrink:0;display:flex;flex-direction:column;gap:14px">
        <div style="text-align:center">
          ${cfg.photo ? `<div style="display:inline-block">${avatar(v, 108, cfg.sideFg || '#fff', 'rgba(255,255,255,.35)')}</div>` : `<div style="width:76px;height:76px;margin:0 auto;border-radius:50%;border:2px solid currentColor;display:grid;place-items:center;font-size:28px;font-weight:900">${e(initials(v.fullName))}</div>`}
          <div style="font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;opacity:.8;margin-top:10px">${badge}</div>
        </div>
        <div>
          <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;border-bottom:1px solid rgba(255,255,255,.25);padding-bottom:4px;margin-bottom:6px">${T.contact}</div>
          <div style="font-size:11px;line-height:1.75;opacity:.92">${contacts(v).map(([ic, x]) => `<div style="word-break:break-word">${ic} ${e(x)}</div>`).join('')}</div>
        </div>
        <div>
          <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;border-bottom:1px solid rgba(255,255,255,.25);padding-bottom:4px;margin-bottom:6px">${T.skills}</div>
          ${skills(v).map((s) => `<div style="margin:5px 0;font-size:11px"><div style="display:flex;justify-content:space-between"><span>${s.name}</span><b>${s.level * 20}%</b></div><div style="height:4px;background:rgba(255,255,255,.22);border-radius:99px;margin-top:2px"><div style="height:4px;width:${s.level * 20}%;background:${cfg.sideFg || '#fff'};border-radius:99px"></div></div></div>`).join('')}
        </div>
        ${langs(v).length ? `<div><div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;border-bottom:1px solid rgba(255,255,255,.25);padding-bottom:4px;margin-bottom:6px">${T.lang}</div><div style="font-size:11px">${langs(v).join('<br>')}</div></div>` : ''}
        ${certs(v).length ? `<div><div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;border-bottom:1px solid rgba(255,255,255,.25);padding-bottom:4px;margin-bottom:6px">${T.cert}</div><div style="font-size:11px">${certs(v).map((x) => `<div style="margin:3px 0">★ ${x}</div>`).join('')}</div></div>` : ''}
      </aside>`;
      const main = `<main style="flex:1;padding:36px 34px;background:${bg};color:${fg}">
        <div style="border-left:4px solid ${c};padding-left:14px;margin-bottom:16px">
          <div style="font-size:32px;font-weight:900;line-height:1.05">${e(v.fullName)}</div>
          <div style="font-size:14px;font-weight:700;color:${c};margin-top:4px">${e(v.title)}</div>
        </div>
        ${v.summary ? `<div style="background:${cardBg};border:1px solid ${bdr};border-radius:10px;padding:12px 14px;margin-bottom:16px;font-size:12.5px;color:${sub}">${e(v.summary)}</div>` : ''}
        <div style="font-size:12.5px;font-weight:900;text-transform:uppercase;letter-spacing:1.4px;color:${c};margin-bottom:10px;display:flex;align-items:center;gap:8px"><span style="width:18px;height:3px;background:${c}"></span>${T.exp}</div>
        ${exps(v).map((x) => `<div style="margin-bottom:13px;padding:12px 14px;border:1px solid ${bdr};border-radius:10px;background:${cardBg}"><div style="display:flex;justify-content:space-between;gap:8px"><b style="font-size:13.5px">${x.role}</b><span style="font-size:11px;font-weight:700;color:${c};white-space:nowrap">${x.p}</span></div><div style="font-size:12px;font-weight:600;color:${sub}">${x.co}</div>${bullets(x.d)}</div>`).join('')}
        <div style="font-size:12.5px;font-weight:900;text-transform:uppercase;letter-spacing:1.4px;color:${c};margin:16px 0 10px;display:flex;align-items:center;gap:8px"><span style="width:18px;height:3px;background:${c}"></span>${T.edu}</div>
        ${edus(v).map((x) => `<div style="margin-bottom:8px"><b>${x.s}</b> — ${x.m} <span style="font-size:11px;color:${sub}">(${x.p})</span></div>`).join('')}
      </main>`;
      return page(`display:flex;font-family:${font}`, cfg.right ? main + side : side + main);
    }

    if (altVariant) {
      return page(`background:${bg};color:${fg};font-family:${font};padding:28px 34px`, `
        <div style="background:${cardBg};border:2px solid ${fg};box-shadow:5px 5px 0 ${c};padding:20px 24px;margin-bottom:18px;display:flex;justify-content:space-between;align-items:center;gap:18px">
          <div>
            <span style="display:inline-block;padding:2px 9px;background:${c};color:#fff;font-size:9.5px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase">${badge}</span>
            <div style="font-size:31px;font-weight:900;line-height:1.05;margin-top:5px">${e(v.fullName)}</div>
            <div style="font-size:14px;font-weight:800;color:${c};margin-top:2px">${e(v.title)}</div>
            <div style="margin-top:8px;font-size:11px;color:${sub};display:flex;flex-wrap:wrap;gap:12px">${contactLine}</div>
          </div>
          ${cfg.photo ? avatar(v, 88, c, fg) : `<div style="width:70px;height:70px;border:2px solid ${fg};background:${c};color:#fff;display:grid;place-items:center;font-size:26px;font-weight:900;box-shadow:3px 3px 0 ${fg}">${e(initials(v.fullName))}</div>`}
        </div>
        <div style="display:grid;grid-template-columns:1.55fr 1fr;gap:16px">
          <div style="display:flex;flex-direction:column;gap:14px">
            ${v.summary ? `<div style="background:${cardBg};border:1.5px solid ${fg};box-shadow:3px 3px 0 ${c};padding:13px 16px"><div style="font-size:10.5px;font-weight:900;text-transform:uppercase;color:${c};margin-bottom:4px">${T.summary}</div><div style="font-size:12.5px;color:${sub}">${e(v.summary)}</div></div>` : ''}
            <div style="background:${cardBg};border:1.5px solid ${fg};box-shadow:3px 3px 0 ${c};padding:16px 18px">
              <div style="font-size:11.5px;font-weight:900;text-transform:uppercase;letter-spacing:1.3px;color:${c};border-bottom:1.5px solid ${fg};padding-bottom:5px;margin-bottom:10px">${T.exp}</div>
              ${exps(v).map((x) => `<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;gap:8px"><b style="font-size:13.5px">${x.role}</b><span style="font-size:10.5px;font-weight:800;color:${c}">${x.p}</span></div><div style="font-size:12px;color:${sub};font-weight:700">${x.co}</div>${bullets(x.d)}</div>`).join('')}
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:14px">
            <div style="background:${cardBg};border:1.5px solid ${fg};box-shadow:3px 3px 0 ${c};padding:15px 17px">
              <div style="font-size:11.5px;font-weight:900;text-transform:uppercase;letter-spacing:1.3px;color:${c};border-bottom:1.5px solid ${fg};padding-bottom:5px;margin-bottom:8px">${T.skills}</div>
              ${skHtml}
            </div>
            <div style="background:${cardBg};border:1.5px solid ${fg};box-shadow:3px 3px 0 ${c};padding:15px 17px">
              <div style="font-size:11.5px;font-weight:900;text-transform:uppercase;letter-spacing:1.3px;color:${c};border-bottom:1.5px solid ${fg};padding-bottom:5px;margin-bottom:8px">${T.edu}</div>
              ${edus(v).map((x) => `<div style="margin-bottom:8px"><b>${x.s}</b><div>${x.m}</div><div style="font-size:11px;color:${sub}">${x.p}</div></div>`).join('')}
            </div>
            ${langs(v).length || certs(v).length ? `<div style="background:${cardBg};border:1.5px solid ${fg};box-shadow:3px 3px 0 ${c};padding:14px 17px"><div style="font-size:11.5px;font-weight:900;text-transform:uppercase;letter-spacing:1.3px;color:${c};margin-bottom:6px">${T.lang} & ${T.cert}</div>${[...langs(v), ...certs(v)].map((x) => `<div style="font-size:11.5px;margin:3px 0">▪ ${x}</div>`).join('')}</div>` : ''}
          </div>
        </div>`);
    }

    return page(`background:${bg};color:${fg};font-family:${font};padding:28px 32px`, `
      <div style="background:${cardBg};border:2px solid ${bdr};border-radius:18px;padding:22px 26px;margin-bottom:14px;display:flex;gap:20px;align-items:center;box-shadow:0 4px 12px rgba(0,0,0,.03)">
        ${cfg.photo ? avatar(v, 92, c, c) : `<div style="width:72px;height:72px;border-radius:16px;background:${c};color:#fff;display:grid;place-items:center;font-size:26px;font-weight:900;flex-shrink:0">${e(initials(v.fullName))}</div>`}
        <div style="flex:1">
          <span style="display:inline-block;padding:2px 10px;border-radius:99px;background:${c}18;color:${c};font-size:10px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase">${badge}</span>
          <div style="font-size:30px;font-weight:900;line-height:1.08;margin-top:4px">${e(v.fullName)}</div>
          <div style="font-size:14px;font-weight:700;color:${c}">${e(v.title)}</div>
          <div style="margin-top:6px;font-size:11px;color:${sub};display:flex;flex-wrap:wrap;gap:12px">${contactLine}</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1.6fr 1fr;gap:14px">
        <div style="display:flex;flex-direction:column;gap:12px">
          ${v.summary ? `<div style="background:${cardBg};border:1.5px solid ${bdr};border-radius:14px;padding:14px 16px"><div style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:1.2px;color:${c};margin-bottom:4px">${T.summary}</div><div style="font-size:12.5px;color:${sub}">${e(v.summary)}</div></div>` : ''}
          <div style="background:${cardBg};border:1.5px solid ${bdr};border-radius:14px;padding:16px 18px">
            <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1.2px;color:${c};margin-bottom:10px">${T.exp}</div>
            ${exps(v).map((x) => `<div style="margin-bottom:12px;padding-left:12px;border-left:3px solid ${c}"><div style="display:flex;justify-content:space-between;gap:8px"><b style="font-size:13.5px">${x.role}</b><span style="font-size:10.5px;font-weight:700;color:${c};white-space:nowrap">${x.p}</span></div><div style="font-size:12px;color:${sub};font-weight:600">${x.co}</div>${bullets(x.d)}</div>`).join('')}
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px">
          <div style="background:${cardBg};border:1.5px solid ${bdr};border-radius:14px;padding:16px 18px">
            <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1.2px;color:${c};margin-bottom:8px">${T.skills}</div>
            ${skHtml}
          </div>
          <div style="background:${cardBg};border:1.5px solid ${bdr};border-radius:14px;padding:16px 18px">
            <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1.2px;color:${c};margin-bottom:8px">${T.edu}</div>
            ${edus(v).map((x) => `<div style="margin-bottom:8px"><b>${x.s}</b><div>${x.m}</div><div style="font-size:11px;color:${sub}">${x.p}${x.n ? ` · ${x.n}` : ''}</div></div>`).join('')}
          </div>
          ${langs(v).length || certs(v).length ? `<div style="background:${cardBg};border:1.5px solid ${bdr};border-radius:14px;padding:14px 18px"><div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1.2px;color:${c};margin-bottom:6px">${T.lang} & ${T.cert}</div>${[...langs(v), ...certs(v)].map((x) => `<div style="font-size:11.5px;margin:3px 0">• ${x}</div>`).join('')}</div>` : ''}
        </div>
      </div>`);
  };
}

const SPECIALIZED_CV_SPECS = [
  { key: 'devops', arch: 'hud', mono: true, photo: false, cols: 2, sk: 1, badge: 'DEVOPS // K8S PIPELINE', vi: 'Kỹ sư DevOps & Cloud', en: 'DevOps & Cloud Pipeline', tags: ['it', 'ats'] },
  { key: 'datasci', arch: 'bento', mono: false, photo: true, cols: 2, sk: 2, badge: 'DATA SCIENCE // ML NOTEBOOK', vi: 'Khoa học Dữ liệu & AI', en: 'Data Science Notebook', tags: ['it', 'finance'] },
  { key: 'cybersec', arch: 'hud', dark: true, bg: '#090d16', cardBg: '#111827', mono: true, photo: false, cols: 2, sk: 2, badge: 'SEC-OPS // CLEARANCE', vi: 'An ninh Mạng SOC', en: 'Cybersecurity Matrix', tags: ['it'] },
  { key: 'mobiledev', arch: 'bento', bg: '#f8fafc', cardBg: '#ffffff', photo: true, cols: 2, sk: 0, badge: 'iOS & ANDROID STUDIO', vi: 'Lập trình Mobile App', en: 'Mobile App Developer', tags: ['it', 'creative'] },
  { key: 'gamedev', arch: 'hud', dark: true, bg: '#0f0b1d', cardBg: '#1a1433', photo: true, cols: 2, sk: 1, badge: 'GAME ENGINE // SHADER HUD', vi: 'Lập trình Game & 3D', en: 'Game Dev HUD', tags: ['it', 'creative'] },
  { key: 'aieng', arch: 'ledger', mono: true, photo: false, cols: 1, sk: 3, badge: 'AI RESEARCH // LLM LAB', vi: 'Kỹ sư AI & Deep Learning', en: 'AI & LLM Researcher', tags: ['it', 'ats'] },
  { key: 'qaeng', arch: 'ledger', photo: false, cols: 1, sk: 2, badge: 'QA AUTOMATION // TEST MATRIX', vi: 'Kiểm thử Phần mềm QA/QC', en: 'QA Test Matrix', tags: ['it', 'ats'] },
  { key: 'blockchain', arch: 'hud', mono: true, photo: false, cols: 2, sk: 5, badge: 'WEB3 // SMART CONTRACT', vi: 'Kỹ sư Blockchain Web3', en: 'Web3 Ledger', tags: ['it', 'finance'] },
  { key: 'embedded', arch: 'hud', bg: '#f0fdf4', cardBg: '#ffffff', mono: true, photo: false, cols: 2, sk: 4, badge: 'IOT // FIRMWARE PCB', vi: 'Kỹ sư Nhúng & IoT', en: 'Embedded Systems PCB', tags: ['it'] },
  { key: 'sysarch', arch: 'deck', photo: false, cols: 2, sk: 3, badge: 'ENTERPRISE CLOUD ARCHITECT', vi: 'Kiến trúc sư Hệ thống', en: 'Solution Architect', tags: ['it', 'manager'] },
  { key: 'uxresearch', arch: 'editorial', photo: true, cols: 2, sk: 7, badge: 'UX RESEARCH & EMPATHY LAB', vi: 'Nghiên cứu UX & Sản phẩm', en: 'UX Research Dossier', tags: ['it', 'creative'] },
  { key: 'productmgr', arch: 'deck', photo: true, cols: 2, sk: 0, badge: 'PRODUCT ROADMAP & OKRs', vi: 'Quản lý Sản phẩm (PM/PO)', en: 'Product Manager OKR', tags: ['it', 'manager', 'sales'] },
  { key: 'vogue', arch: 'editorial', serif: true, photo: true, archPhoto: true, cols: 2, sk: 6, badge: 'HAUTE EDITORIAL LOOKBOOK', vi: 'Biên tập Thời trang Vogue', en: 'Fashion Lookbook', tags: ['creative'] },
  { key: 'film', arch: 'hud', dark: true, bg: '#0c0a09', cardBg: '#1c1917', photo: true, cols: 2, sk: 4, badge: '35MM DIRECTOR // TIMECODE', vi: 'Đạo diễn & Dựng phim', en: 'Cinema Filmstrip', tags: ['creative'] },
  { key: 'interior', arch: 'editorial', bg: '#faf7f2', cardBg: '#f3ede2', serif: true, photo: true, archPhoto: true, cols: 2, sk: 6, badge: 'SPATIAL & INTERIOR ATELIER', vi: 'Thiết kế Nội thất', en: 'Interior Moodboard', tags: ['creative', 'traditional'] },
  { key: 'packaging', arch: 'bento', bg: '#fffbeb', cardBg: '#ffffff', bdr: '#d97706', photo: true, cols: 2, sk: 5, badge: 'DIELINE // PACKAGING STUDIO', vi: 'Thiết kế Bao bì Thương hiệu', en: 'Packaging Dieline', tags: ['creative'] },
  { key: 'motion', arch: 'hud', dark: true, bg: '#09090b', cardBg: '#18181b', photo: false, cols: 2, sk: 1, badge: 'KEYFRAME // 3D MOTION', vi: 'Hoạt hình & Motion 3D', en: 'Motion Keyframe', tags: ['creative', 'it'] },
  { key: 'brandstrat', arch: 'deck', serif: true, photo: false, cols: 2, sk: 7, badge: 'BRAND STRATEGY & MANIFESTO', vi: 'Chiến lược Thương hiệu', en: 'Brand Strategist', tags: ['creative', 'sales', 'manager'] },
  { key: 'photography', arch: 'editorial', bg: '#f4f4f5', cardBg: '#ffffff', photo: true, cols: 2, sk: 6, badge: 'EXIF // FINE ART PHOTOGRAPHY', vi: 'Nhiếp ảnh gia Nghệ thuật', en: 'Photographer Contact Sheet', tags: ['creative'] },
  { key: 'musicprod', arch: 'hud', dark: true, bg: '#0a0e17', cardBg: '#131b2e', photo: true, cols: 2, sk: 1, badge: 'MASTERING // SOUND STUDIO', vi: 'Sản xuất Âm nhạc & Audio', en: 'Sound Producer Studio', tags: ['creative'] },
  { key: 'illust', arch: 'editorial', bg: '#fffdf9', cardBg: '#fef7ed', serif: true, photo: true, archPhoto: true, cols: 2, sk: 7, badge: 'BESPOKE ILLUSTRATION ATELIER', vi: 'Họa sĩ Minh họa Sách', en: 'Book Illustrator', tags: ['creative', 'student'] },
  { key: 'bauhaus2', arch: 'ledger', bg: '#f4f1ea', cardBg: '#ffffff', bdr: '#111111', photo: false, cols: 1, sk: 5, badge: 'DE STIJL // CONSTRUCTIVIST', vi: 'Hội họa Khối Mondrian', en: 'Mondrian Constructivist', tags: ['creative'] },
  { key: 'risocv', arch: 'bento', bg: '#f7f3e8', cardBg: '#ffffff', bdr: '#1d3557', photo: true, cols: 2, sk: 5, badge: 'RISOGRAPH // INDIE ZINE', vi: 'Ấn bản Risograph Zine', en: 'Risograph Print', tags: ['creative', 'student'] },
  { key: 'calligraphy', arch: 'editorial', bg: '#fbf9f5', cardBg: '#f3efe6', serif: true, photo: false, cols: 2, sk: 6, badge: 'ORIENTAL INK // SEAL STAMP', vi: 'Thủy mặc & Ấn chương', en: 'Oriental Ink Seal', tags: ['creative', 'traditional'] },
  { key: 'origami', arch: 'dock', right: true, photo: true, cols: 2, sk: 3, badge: 'FOLDED PRISM STUDIO', vi: 'Nếp gấp Origami Hiện đại', en: 'Origami Prism', tags: ['creative', 'office'] },
  { key: 'artgallery', arch: 'editorial', serif: true, photo: false, cols: 2, sk: 6, badge: 'CURATORIAL EXHIBITION CATALOG', vi: 'Giám tuyển Nghệ thuật', en: 'Exhibition Catalog', tags: ['creative', 'traditional'] },
  { key: 'mckinsey', arch: 'deck', photo: false, cols: 2, sk: 3, badge: 'MANAGEMENT CONSULTING BRIEF', vi: 'Tư vấn Chiến lược (MBB)', en: 'Consulting Slide Deck', tags: ['manager', 'finance', 'ats'] },
  { key: 'wallstreet', arch: 'ledger', serif: true, photo: false, cols: 1, sk: 2, badge: 'INVESTMENT BANKING // M&A', vi: 'Ngân hàng Đầu tư M&A', en: 'Wall Street Deal Sheet', tags: ['finance', 'manager', 'ats'] },
  { key: 'harvard', arch: 'ledger', serif: true, photo: false, cols: 1, sk: 6, badge: 'JURISPRUDENCE & LEGAL COUNSEL', vi: 'Luật sư & Pháp chế Harvard', en: 'Harvard Legal Brief', tags: ['traditional', 'ats', 'manager'] },
  { key: 'cfo', arch: 'deck', photo: true, cols: 2, sk: 2, badge: 'CFO // FINANCIAL CONTROLLER', vi: 'Giám đốc Tài chính (CFO)', en: 'CFO Balance Ledger', tags: ['finance', 'manager'] },
  { key: 'board', arch: 'editorial', serif: true, photo: true, cols: 2, sk: 6, badge: 'C-SUITE & BOARD EXECUTIVE', vi: 'Hội đồng Quản trị C-Suite', en: 'Board Director Dossier', tags: ['manager', 'traditional'] },
  { key: 'privateeq', arch: 'deck', photo: false, cols: 2, sk: 0, badge: 'VENTURE CAPITAL & PRIVATE EQUITY', vi: 'Quỹ Đầu tư & Chứng khoán', en: 'Private Equity Matrix', tags: ['finance', 'manager'] },
  { key: 'actuary', arch: 'ledger', mono: true, photo: false, cols: 1, sk: 2, badge: 'ACTUARIAL & QUANTITATIVE RISK', vi: 'Định phí Bảo hiểm & Rủi ro', en: 'Actuarial Risk Grid', tags: ['finance', 'ats'] },
  { key: 'audit', arch: 'ledger', photo: true, cols: 1, sk: 3, badge: 'BIG-4 AUDIT & TAX COMPLIANCE', vi: 'Kiểm toán & Thuế (Big4)', en: 'Audit & Tax Dossier', tags: ['finance', 'office', 'ats'] },
  { key: 'diplomat', arch: 'editorial', serif: true, photo: true, cols: 2, sk: 6, badge: 'DIPLOMATIC & FOREIGN SERVICE', vi: 'Ngoại giao & Quan hệ Quốc tế', en: 'Diplomatic Protocol', tags: ['traditional', 'office', 'manager'] },
  { key: 'realty', arch: 'dock', photo: true, cols: 2, sk: 4, badge: 'LUXURY REAL ESTATE PORTFOLIO', vi: 'Chuyên gia Bất động sản', en: 'Luxury Real Estate', tags: ['sales', 'finance'] },
  { key: 'procurement', arch: 'deck', photo: false, cols: 2, sk: 4, badge: 'SUPPLY CHAIN & LOGISTICS OPS', vi: 'Chuỗi Cung ứng & Logistics', en: 'Supply Chain Ops', tags: ['office', 'manager', 'sales'] },
  { key: 'hrdirector', arch: 'dock', right: true, photo: true, cols: 2, sk: 7, badge: 'PEOPLE & CULTURE EXECUTIVE', vi: 'Giám đốc Nhân sự (CHRO)', en: 'HR & People Culture', tags: ['office', 'manager'] },
  { key: 'prcomms', arch: 'editorial', serif: true, photo: true, cols: 2, sk: 7, badge: 'PUBLIC RELATIONS & MEDIA KIT', vi: 'Truyền thông & PR Đối ngoại', en: 'PR & Media Release', tags: ['creative', 'sales', 'office'] },
  { key: 'corpsec', arch: 'ledger', serif: true, photo: false, cols: 1, sk: 6, badge: 'CORPORATE GOVERNANCE', vi: 'Thư ký Công ty & Quản trị', en: 'Corporate Governance', tags: ['traditional', 'office', 'finance'] },
  { key: 'growth', arch: 'deck', photo: true, cols: 2, sk: 0, badge: 'GROWTH & PERFORMANCE FUNNEL', vi: 'Growth Marketing & Ads', en: 'Growth Funnel', tags: ['sales', 'creative'] },
  { key: 'ecom', arch: 'bento', photo: true, cols: 2, sk: 3, badge: 'E-COMMERCE & GMV SCORECARD', vi: 'Quản lý Sàn TMĐT (E-Com)', en: 'E-Commerce GMV', tags: ['sales', 'office'] },
  { key: 'social', arch: 'bento', bg: '#fdf2f8', cardBg: '#ffffff', photo: true, cols: 2, sk: 7, badge: 'CREATOR & SOCIAL MEDIA KIT', vi: 'Sáng tạo Nội dung TikTok/Social', en: 'Social Creator Kit', tags: ['creative', 'sales', 'student'] },
  { key: 'b2bsales', arch: 'deck', photo: true, cols: 2, sk: 4, badge: 'ENTERPRISE B2B QUOTA BOARD', vi: 'Kinh doanh B2B (Key Account)', en: 'Enterprise Sales Quota', tags: ['sales', 'manager'] },
  { key: 'seo', arch: 'hud', photo: false, cols: 2, sk: 0, badge: 'SERP // SEO & CONTENT GROWTH', vi: 'Chuyên gia SEO & Content', en: 'SEO & Content SERP', tags: ['sales', 'it', 'creative'] },
  { key: 'eventmgr', arch: 'dock', photo: true, cols: 2, sk: 7, badge: 'EXPERIENTIAL EVENT PRODUCER', vi: 'Tổ chức Sự kiện & Activation', en: 'Event Run-of-Show', tags: ['service', 'creative', 'sales'] },
  { key: 'retail', arch: 'bento', photo: true, cols: 2, sk: 4, badge: 'FLAGSHIP RETAIL MERCHANDISING', vi: 'Quản lý Chuỗi Cửa hàng Retail', en: 'Retail Storefront', tags: ['sales', 'service', 'manager'] },
  { key: 'crm', arch: 'deck', photo: false, cols: 2, sk: 3, badge: 'CUSTOMER SUCCESS & LIFECYCLE', vi: 'Chăm sóc Khách hàng & CRM', en: 'Customer Success CRM', tags: ['service', 'sales', 'office'] },
  { key: 'copywriter', arch: 'editorial', bg: '#fffbeb', cardBg: '#ffffff', serif: true, photo: false, cols: 2, sk: 6, badge: 'STORYTELLING & COPYWRITING', vi: 'Copywriter & Biên kịch', en: 'Copywriter Column', tags: ['creative', 'sales'] },
  { key: 'tradeglobal', arch: 'ledger', photo: false, cols: 1, sk: 2, badge: 'INTERNATIONAL TRADE & CUSTOMS', vi: 'Xuất Nhập Khẩu & Hải quan', en: 'Global Trade Manifest', tags: ['office', 'sales', 'finance'] },
  { key: 'medical', arch: 'ledger', bg: '#f0fdfa', cardBg: '#ffffff', photo: true, cols: 1, sk: 3, badge: 'CLINICAL PHYSICIAN & SURGEON', vi: 'Bác sĩ Đa khoa & Chuyên khoa', en: 'Medical Clinical Chart', tags: ['traditional', 'service'] },
  { key: 'pharma', arch: 'deck', bg: '#f8fafc', cardBg: '#ffffff', photo: true, cols: 2, sk: 2, badge: 'PHARMACEUTICAL & BIOTECH R&D', vi: 'Dược sĩ & Công nghệ Sinh học', en: 'Biotech & Pharma Lab', tags: ['service', 'traditional'] },
  { key: 'nursing', arch: 'dock', photo: true, cols: 2, sk: 4, badge: 'REGISTERED NURSE CARE PLAN', vi: 'Điều dưỡng & Chăm sóc Y tế', en: 'Nursing Care Plan', tags: ['service'] },
  { key: 'dentist', arch: 'editorial', bg: '#f0f9ff', cardBg: '#ffffff', photo: true, archPhoto: true, cols: 2, sk: 7, badge: 'DENTAL & AESTHETIC SPECIALIST', vi: 'Bác sĩ Nha khoa & Thẩm mỹ', en: 'Dental Specialist', tags: ['service'] },
  { key: 'professor', arch: 'editorial', serif: true, photo: true, cols: 2, sk: 6, badge: 'UNIVERSITY FACULTY & RESEARCH', vi: 'Giảng viên Đại học & Nghiên cứu', en: 'Faculty Curriculum Vitae', tags: ['traditional', 'ats'] },
  { key: 'teacher', arch: 'bento', bg: '#fefce8', cardBg: '#ffffff', photo: true, cols: 2, sk: 7, badge: 'INTERNATIONAL EDUCATOR LESSON', vi: 'Giáo viên & Sư phạm Quốc tế', en: 'Educator Lesson Card', tags: ['service', 'office', 'student'] },
  { key: 'culinary', arch: 'editorial', bg: '#fffaf5', cardBg: '#ffffff', serif: true, photo: true, cols: 2, sk: 6, badge: 'GASTRONOMY & EXECUTIVE CHEF', vi: 'Bếp trưởng Điều hành (Chef)', en: 'Executive Chef Menu', tags: ['service', 'creative'] },
  { key: 'aviation', arch: 'ledger', photo: true, cols: 1, sk: 1, badge: 'FLIGHT LOGBOOK & AVIATION CREW', vi: 'Hàng không & Tiếp viên / Phi công', en: 'Aviation Flight Log', tags: ['service'] },
  { key: 'hospitality', arch: 'dock', right: true, serif: true, photo: true, cols: 2, sk: 6, badge: '5-STAR HOSPITALITY CONCIERGE', vi: 'Quản lý Khách sạn & Resort 5★', en: 'Luxury Hospitality GM', tags: ['service', 'manager'] },
  { key: 'ngo', arch: 'deck', bg: '#f0fdf4', cardBg: '#ffffff', photo: true, cols: 2, sk: 0, badge: 'ESG & SUSTAINABILITY IMPACT', vi: 'Phát triển Bền vững ESG / NGO', en: 'ESG Impact Dossier', tags: ['service', 'office', 'manager'] },
  { key: 'europass', arch: 'dock', photo: true, cols: 2, sk: 1, badge: 'EUROPASS STANDARD CURRICULUM', vi: 'Chuẩn Châu Âu (Europass CV)', en: 'Europass EU Standard', tags: ['ats', 'office', 'student'] },
  { key: 'rirekisho', arch: 'ledger', serif: true, photo: true, cols: 1, sk: 2, badge: '履歴書 // JAPANESE RIREKISHO', vi: 'Chuẩn Nhật Bản (Rirekisho)', en: 'Japanese Rirekisho Grid', tags: ['traditional', 'ats', 'office'] },
  { key: 'korean', arch: 'ledger', photo: true, cols: 1, sk: 3, badge: '이력서 // K-CORPORATE STANDARD', vi: 'Chuẩn Tập đoàn Hàn Quốc', en: 'Korean Chaebol Table', tags: ['office', 'ats', 'traditional'] },
  { key: 'scandi', arch: 'editorial', bg: '#f5f5f0', cardBg: '#ffffff', photo: false, cols: 2, sk: 6, badge: 'COPENHAGEN NORDIC HAIRLINE', vi: 'Tối giản Bắc Âu (Copenhagen)', en: 'Copenhagen Minimal', tags: ['creative', 'office', 'ats'] },
  { key: 'pastelcard', arch: 'bento', bg: '#fdf8f5', cardBg: '#ffffff', photo: true, cols: 2, sk: 7, badge: 'SOFT PASTEL STUDIO CARDS', vi: 'Thẻ Bo Tròn Pastel Nhẹ Nhàng', en: 'Soft Pastel Cards', tags: ['student', 'office', 'service'] },
  { key: 'asymband', arch: 'dock', right: true, photo: true, cols: 2, sk: 4, badge: 'ASYMMETRIC CONTRAST STUDIO', vi: 'Dải Bất Đối Xứng Hiện Đại', en: 'Asymmetric Band', tags: ['creative', 'sales', 'it'] },
  { key: 'pillar', arch: 'deck', photo: false, cols: 2, sk: 1, badge: 'THREE-PILLAR COMPETENCY MATRIX', vi: 'Ma trận 3 Trụ cột Năng lực', en: 'Three-Pillar Matrix', tags: ['manager', 'ats', 'finance'] },
  { key: 'passport', arch: 'bento', bg: '#f8fafc', cardBg: '#ffffff', photo: true, cols: 2, sk: 0, badge: 'GLOBAL REMOTE NOMAD PASSPORT', vi: 'Làm việc Từ xa (Global Remote)', en: 'Global Nomad Passport', tags: ['it', 'creative', 'student'] }
];

const CV_SIG_COLORS = ['#0f766e', '#1d4ed8', '#b45309', '#7c3aed', '#be123c', '#15803d', '#0369a1', '#c2410c', '#4338ca', '#a21caf', '#1e3a5f', '#334155'];

function makeUniqueSpecializedCv(cfg, idx = 0) {
  const hMode = idx % 12;
  const bMode = (idx * 3 + Math.floor(idx / 12)) % 7;
  const tint = SURFACE_TINTS[(idx * 5) % SURFACE_TINTS.length];
  const sigHex = cfg.c || CV_SIG_COLORS[idx % CV_SIG_COLORS.length];

  return function (v, T) {
    const c = color(v.color, sigHex);
    const font = cfg.serif ? SERIF : cfg.mono ? MONO_FONT : cfg.hand ? HAND_FONT : FONT;
    const dark = !!cfg.dark;
    const bg = cfg.bg || (dark ? '#090d16' : tint[0]);
    const fg = dark ? '#f1f5f9' : '#0f172a';
    const sub = dark ? '#94a3b8' : '#475569';
    const bdr = dark ? '#334155' : (cfg.bdr || tint[2]);
    const cardBg = dark ? '#151f32' : (cfg.cardBg || tint[1]);
    const badge = cfg.badge || `SPEC // 0${idx + 1}`;
    const roleText = v.__thumb ? (T.summary === 'Giới thiệu' ? cfg.vi : cfg.en) : v.title;
    const skMode = (idx * 3 + (cfg.sk || 0)) % 8;
    const skHtml = renderSkillMode(skills(v), c, skMode, dark);
    const contactLine = contacts(v).map(([ic, x]) => `<span>${ic} ${e(x)}</span>`).join('  ·  ');
    const contactStack = contacts(v).map(([ic, x]) => `<div style="word-break:break-word;margin:3px 0">${ic} ${e(x)}</div>`).join('');
    const vecList = [
      (col) => `<svg data-cv-vec="1" width="34" height="34" viewBox="0 0 36 36" fill="none" stroke="${col}" stroke-width="2.4" style="flex-shrink:0;cursor:pointer"><rect x="4" y="4" width="28" height="28" fill="${col}22"/><rect x="11" y="11" width="14" height="14" fill="${col}"/></svg>`,
      (col) => `<svg data-cv-vec="1" width="34" height="34" viewBox="0 0 36 36" fill="none" stroke="${col}" stroke-width="2.4" style="flex-shrink:0;cursor:pointer"><circle cx="18" cy="18" r="14" fill="${col}22"/><circle cx="18" cy="18" r="6" fill="${col}"/></svg>`,
      (col) => `<svg data-cv-vec="1" width="34" height="34" viewBox="0 0 36 36" fill="${col}" style="flex-shrink:0;cursor:pointer"><path d="M18 2 L22 14 L34 18 L22 22 L18 34 L14 22 L2 18 L14 14 Z"/></svg>`,
      (col) => `<svg data-cv-vec="1" width="34" height="34" viewBox="0 0 36 36" fill="none" stroke="${col}" stroke-width="2.4" style="flex-shrink:0;cursor:pointer"><polygon points="18,3 33,31 3,31" fill="${col}22"/><circle cx="18" cy="22" r="4.5" fill="${col}"/></svg>`,
      (col) => `<svg data-cv-vec="1" width="34" height="34" viewBox="0 0 36 36" fill="none" stroke="${col}" stroke-width="2.4" style="flex-shrink:0;cursor:pointer"><polygon points="18,3 32,11 32,25 18,33 4,25 4,11" fill="${col}22"/><circle cx="18" cy="18" r="5" fill="${col}"/></svg>`,
      (col) => `<svg data-cv-vec="1" width="34" height="34" viewBox="0 0 36 36" fill="none" stroke="${col}" stroke-width="2.4" style="flex-shrink:0;cursor:pointer"><rect x="4" y="4" width="18" height="18" fill="${col}"/><circle cx="24" cy="24" r="9" fill="${col}44"/></svg>`
    ];
    const vecIcon = (col = c) => vecList[idx % vecList.length](col);
    const avNode = (sz = 84, ring = c) => cfg.photo
      ? avatar(v, sz, c, ring)
      : `<div style="display:flex;align-items:center;gap:8px;flex-shrink:0">${vecIcon(ring)}<div style="width:${sz - 16}px;height:${sz - 16}px;border-radius:${idx % 3 === 0 ? '50%' : idx % 3 === 1 ? '14px' : '0px'};border:2px solid ${ring};background:${c}20;color:${ring === '#fff' ? '#fff' : c};display:grid;place-items:center;font-size:${Math.round(sz * 0.3)}px;font-weight:900;flex-shrink:0">${e(initials(v.fullName))}</div></div>`;

    // 12 Distinct Masthead Architectures (hMode 0..11)
    let headerHtml = '';
    if (hMode === 0) {
      headerHtml = `<header style="background:${c};color:#fff;padding:24px 32px;border-radius:14px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;gap:18px">
        <div><div style="font-size:9.5px;font-weight:800;letter-spacing:2px;opacity:.88;text-transform:uppercase">${badge}</div><div style="font-size:30px;font-weight:900;line-height:1.05;margin-top:3px">${e(v.fullName)}</div><div style="font-size:13.5px;font-weight:600;opacity:.95;margin-top:3px">${e(roleText)}</div><div style="margin-top:8px;font-size:10.5px;opacity:.9;display:flex;flex-wrap:wrap;gap:12px">${contactLine}</div></div>
        ${avNode(82, '#fff')}
      </header>`;
    } else if (hMode === 1) {
      headerHtml = `<header style="text-align:center;border-top:3px double ${c};border-bottom:2px solid ${fg};padding:14px 0;margin-bottom:16px">
        <div style="font-size:9.5px;font-weight:800;letter-spacing:3.2px;text-transform:uppercase;color:${c}">✦ ${badge} ✦</div>
        <div style="font-family:${SERIF};font-size:36px;font-weight:900;letter-spacing:-.5px;margin:4px 0">${e(v.fullName)}</div>
        <div style="font-size:14px;font-style:italic;color:${c};font-weight:700">${e(roleText)}</div>
        <div style="margin-top:7px;font-size:10.5px;color:${sub};display:flex;justify-content:center;flex-wrap:wrap;gap:12px">${contactLine}</div>
      </header>`;
    } else if (hMode === 2) {
      headerHtml = `<header style="border:1.5px solid ${c};border-radius:12px;overflow:hidden;background:${cardBg};margin-bottom:14px">
        <div style="background:${c};color:#fff;padding:5px 14px;font-family:${MONO_FONT};font-size:9.5px;font-weight:800;display:flex;justify-content:space-between"><span>● ● ●  ${badge}</span><span>ID #${100 + idx}</span></div>
        <div style="padding:18px 22px;display:flex;gap:18px;align-items:center">${avNode(78, c)}<div style="flex:1"><div style="font-size:27px;font-weight:900;color:${fg}">${e(v.fullName)}</div><div style="font-family:${MONO_FONT};font-size:12.5px;color:${c};font-weight:700;margin-top:2px">&gt; ${e(roleText)}</div><div style="margin-top:6px;font-size:10.5px;color:${sub};display:flex;flex-wrap:wrap;gap:10px">${contactLine}</div></div></div>
      </header>`;
    } else if (hMode === 3) {
      headerHtml = `<header style="display:grid;grid-template-columns:1.4fr 1fr;gap:12px;margin-bottom:14px">
        <div style="background:${dark ? '#1e293b' : '#0f172a'};color:#fff;border-radius:16px;padding:20px 22px;display:flex;gap:14px;align-items:center;border-bottom:4px solid ${c}">${avNode(74, c)}<div><div style="font-size:9px;font-weight:800;letter-spacing:1.8px;color:${c}">${badge}</div><div style="font-size:26px;font-weight:900;line-height:1.05;margin-top:2px">${e(v.fullName)}</div><div style="font-size:12.5px;color:#cbd5e1;margin-top:3px">${e(roleText)}</div></div></div>
        <div style="background:${cardBg};border:1.5px solid ${bdr};border-radius:16px;padding:14px 18px;font-size:10.5px;color:${sub};display:flex;flex-direction:column;justify-content:center"><div style="font-size:9.5px;font-weight:900;color:${c};text-transform:uppercase;margin-bottom:4px">${T.contact}</div>${contactStack}</div>
      </header>`;
    } else if (hMode === 4) {
      headerHtml = `<header style="display:grid;grid-template-columns:1.55fr 1fr;border:2px solid ${c};background:${cardBg};margin-bottom:14px">
        <div style="padding:16px 20px;border-right:2px solid ${c}"><div style="font-family:${MONO_FONT};font-size:9.5px;color:${c};font-weight:800">BLUEPRINT // ${badge}</div><div style="font-size:29px;font-weight:900;letter-spacing:-.8px;margin-top:2px">${e(v.fullName)}</div><div style="font-family:${MONO_FONT};font-size:12.5px;color:${c};font-weight:700">${e(roleText)}</div></div>
        <div style="padding:12px 16px;font-family:${MONO_FONT};font-size:10px;color:${sub};display:flex;flex-direction:column;justify-content:center">${contactStack}</div>
      </header>`;
    } else if (hMode === 5) {
      headerHtml = `<header style="background:${cardBg};border:1px solid ${bdr};border-radius:26px;padding:20px 26px;margin-bottom:14px;display:flex;gap:22px;align-items:center">
        <div style="width:86px;height:106px;border-radius:43px 43px 10px 10px;overflow:hidden;background:${c};color:#fff;display:grid;place-items:center;font-size:28px;font-weight:800;border:2.5px solid ${c};flex-shrink:0">${photoSrc(v.photo) ? `<img src="${photoSrc(v.photo)}" alt="" style="width:100%;height:100%;object-fit:cover"/>` : e(initials(v.fullName))}</div>
        <div style="flex:1"><span style="padding:3px 10px;border-radius:99px;background:${c}18;color:${c};font-size:9.5px;font-weight:800;letter-spacing:1.5px">${badge}</span><div style="font-family:${SERIF};font-size:32px;font-weight:800;margin-top:5px">${e(v.fullName)}</div><div style="font-size:13.5px;color:${c};font-weight:700">${e(roleText)}</div><div style="margin-top:6px;font-size:10.5px;color:${sub};display:flex;flex-wrap:wrap;gap:10px">${contactLine}</div></div>
      </header>`;
    } else if (hMode === 6) {
      headerHtml = `<header style="background:${cardBg};border:2.5px solid ${fg};box-shadow:5px 5px 0 ${c};padding:18px 22px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;gap:16px">
        <div><span style="display:inline-block;padding:2px 9px;background:${c};color:#fff;font-size:9.5px;font-weight:900;letter-spacing:1.4px;border:1.5px solid ${fg}">${badge}</span><div style="font-size:30px;font-weight:900;line-height:1.04;margin-top:5px">${e(v.fullName)}</div><div style="font-size:13.5px;font-weight:800;color:${c};margin-top:2px">${e(roleText)}</div><div style="margin-top:6px;font-size:10.5px;color:${sub};display:flex;flex-wrap:wrap;gap:10px">${contactLine}</div></div>
        ${avNode(78, fg)}
      </header>`;
    } else if (hMode === 7) {
      const firstCh = e(String(v.fullName || 'A').trim().split(/\s+/).pop()[0] || 'A');
      headerHtml = `<header style="border-bottom:2px solid ${fg};padding-bottom:14px;margin-bottom:14px;display:flex;align-items:center;gap:18px">
        <div style="font-family:${SERIF};font-size:78px;line-height:.82;font-weight:900;color:${c};padding-right:12px;border-right:2px solid ${c}">${firstCh}</div>
        <div style="flex:1"><div style="font-size:9.5px;font-weight:800;letter-spacing:2.4px;color:${sub};text-transform:uppercase">${badge}</div><div style="font-family:${SERIF};font-size:32px;font-weight:900;line-height:1.05">${e(v.fullName)}</div><div style="font-size:13.5px;font-weight:700;color:${c};margin-top:2px">${e(roleText)}</div><div style="margin-top:5px;font-size:10.5px;color:${sub};display:flex;flex-wrap:wrap;gap:10px">${contactLine}</div></div>
      </header>`;
    } else if (hMode === 8) {
      headerHtml = `<header style="background:linear-gradient(120deg,${c},${dark ? '#020617' : '#0f172a'});color:#fff;padding:22px 28px 28px;clip-path:polygon(0 0,100% 0,100% 82%,0 100%);margin-bottom:12px;display:flex;justify-content:space-between;align-items:center">
        <div><span style="padding:2px 9px;background:rgba(255,255,255,.18);border-radius:4px;font-size:9.5px;font-weight:800;letter-spacing:1.6px">${badge}</span><div style="font-size:31px;font-weight:900;margin-top:5px">${e(v.fullName)}</div><div style="font-size:13.5px;opacity:.92;font-weight:600">${e(roleText)}</div><div style="margin-top:6px;font-size:10.5px;opacity:.88;display:flex;flex-wrap:wrap;gap:10px">${contactLine}</div></div>
        ${avNode(78, '#fff')}
      </header>`;
    } else if (hMode === 9) {
      const seal = e(initials(v.fullName) || 'ẤN');
      headerHtml = `<table style="width:100%;border-collapse:collapse;border:2px solid ${fg};margin-bottom:14px;background:${cardBg}">
        <tr>
          <td style="padding:14px 18px;border:1px solid ${bdr}"><div style="font-size:9.5px;font-weight:800;color:${c};letter-spacing:2px">${badge}</div><div style="font-size:28px;font-weight:900;margin-top:2px">${e(v.fullName)}</div><div style="font-size:13px;font-weight:700;color:${c}">${e(roleText)}</div></td>
          <td style="padding:10px 14px;border:1px solid ${bdr};font-size:10.5px;color:${sub};width:220px">${contactStack}</td>
          <td style="width:74px;border:1px solid ${bdr};text-align:center;vertical-align:middle"><div style="width:46px;height:46px;margin:0 auto;border:2px solid #dc2626;color:#dc2626;border-radius:6px;display:grid;place-items:center;font-weight:900;font-size:15px;transform:rotate(-5deg)">${seal}</div></td>
        </tr>
      </table>`;
    } else if (hMode === 10) {
      const top3 = skills(v).slice(0, 3);
      headerHtml = `<header style="margin-bottom:14px">
        <div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid ${c};padding-bottom:10px;margin-bottom:10px">
          <div><div style="font-size:9.5px;font-weight:800;color:${c};letter-spacing:2px">${badge}</div><div style="font-size:31px;font-weight:900;line-height:1">${e(v.fullName)}</div><div style="font-size:13.5px;font-weight:700;color:${sub};margin-top:3px">${e(roleText)}</div></div>
          <div style="text-align:right;font-size:10.5px;color:${sub}">${contactStack}</div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">${top3.map((s, i) => `<div style="background:${cardBg};border:1px solid ${bdr};border-top:3px solid ${c};border-radius:8px;padding:7px 10px"><div style="font-size:9px;font-weight:800;color:${c}">KEY PILLAR 0${i + 1}</div><div style="font-size:12px;font-weight:800">${s.name}</div></div>`).join('')}</div>
      </header>`;
    } else {
      headerHtml = `<header style="display:flex;align-items:center;gap:18px;background:${cardBg};border-left:6px solid ${c};border-radius:0 14px 14px 0;padding:18px 22px;margin-bottom:14px;border-top:1px solid ${bdr};border-right:1px solid ${bdr};border-bottom:1px solid ${bdr}">
        <div style="width:58px;height:58px;transform:rotate(45deg);background:${c};color:#fff;display:grid;place-items:center;flex-shrink:0;margin:6px"><span style="transform:rotate(-45deg);font-weight:900;font-size:20px">${e(initials(v.fullName))}</span></div>
        <div style="flex:1"><div style="font-size:9.5px;font-weight:800;color:${c};letter-spacing:1.8px">${badge}</div><div style="font-size:29px;font-weight:900;line-height:1.05">${e(v.fullName)}</div><div style="font-size:13px;font-weight:700;color:${sub}">${e(roleText)}</div><div style="margin-top:5px;font-size:10.5px;color:${sub};display:flex;flex-wrap:wrap;gap:10px">${contactLine}</div></div>
      </header>`;
    }

    // 7 Distinct Body & Column Geometries (bMode 0..6)
    const sumHtml = v.summary ? `<div style="padding:10px 14px;background:${cardBg};border-left:3px solid ${c};border-radius:6px;font-size:12px;color:${sub};margin-bottom:12px">${e(v.summary)}</div>` : '';
    const cardStyles = [
      `margin-bottom:11px;padding:10px 13px;background:${cardBg};border:2px solid ${fg};box-shadow:3px 3px 0 ${c};border-radius:0px`,
      `margin-bottom:11px;padding:10px 13px;background:${cardBg};border:1px solid ${bdr};border-left:4px solid ${c};border-radius:10px`,
      `margin-bottom:11px;padding:10px 13px;background:${cardBg};border:1px solid ${bdr};border-top:3.5px solid ${c};border-radius:6px`,
      `margin-bottom:11px;padding:10px 13px;background:${cardBg};border:1.5px dashed ${c};border-radius:12px`,
      `margin-bottom:11px;padding:8px 0 10px;background:transparent;border-bottom:1.5px solid ${bdr};border-radius:0px`,
      `margin-bottom:11px;padding:10px 13px;background:${cardBg};border:3px double ${c};border-radius:4px`
    ];
    const expStyle = cardStyles[(idx * 2 + Math.floor(idx / 6)) % cardStyles.length];
    const expCards = exps(v).map((x, i) => `<div style="${expStyle}"><div style="display:flex;justify-content:space-between;gap:8px"><b style="font-size:13px;color:${fg}">${i + 1}. ${x.role}</b><span style="font-size:10.5px;font-weight:700;color:${c};white-space:nowrap">${x.p}</span></div><div style="font-size:11.5px;font-weight:700;color:${sub}">${x.co}</div>${bullets(x.d)}</div>`).join('');
    const eduList = edus(v).map((x) => `<div style="margin-bottom:7px;font-size:11.5px"><b style="color:${fg}">${x.s}</b><div style="color:${sub}">${x.m} · <span style="color:${c}">${x.p}</span></div></div>`).join('');
    const certList = certs(v).map((x) => `<div style="font-size:11px;color:${sub};margin:3px 0">✦ ${x}</div>`).join('');
    const langList = langs(v).join(' · ');

    let bodyHtml = '';
    if (bMode === 0) {
      // Left Sidebar Dock + Right Main Timeline
      bodyHtml = `<div style="display:grid;grid-template-columns:220px 1fr;gap:18px">
        <aside style="background:${cardBg};border:1.5px solid ${bdr};border-top:4px solid ${c};border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:12px">
          <div><div style="font-size:10.5px;font-weight:900;color:${c};text-transform:uppercase;letter-spacing:1.2px;margin-bottom:6px">${T.skills}</div>${skHtml}</div>
          <div><div style="font-size:10.5px;font-weight:900;color:${c};text-transform:uppercase;letter-spacing:1.2px;margin-bottom:6px">${T.edu}</div>${eduList}</div>
          ${langList ? `<div><div style="font-size:10.5px;font-weight:900;color:${c};text-transform:uppercase;margin-bottom:4px">${T.lang}</div><div style="font-size:11px;color:${sub}">${langList}</div></div>` : ''}
          ${certList ? `<div><div style="font-size:10.5px;font-weight:900;color:${c};text-transform:uppercase;margin-bottom:4px">${T.cert}</div>${certList}</div>` : ''}
        </aside>
        <main>${sumHtml}<div style="font-size:11.5px;font-weight:900;color:${c};text-transform:uppercase;letter-spacing:1.4px;margin-bottom:8px">■ ${T.exp}</div>${expCards}</main>
      </div>`;
    } else if (bMode === 1) {
      // Left Main + Right Tinted Sidebar Dock
      bodyHtml = `<div style="display:grid;grid-template-columns:1fr 225px;gap:18px">
        <main>${sumHtml}<div style="font-size:11.5px;font-weight:900;color:${c};text-transform:uppercase;letter-spacing:1.4px;border-bottom:2px solid ${c};padding-bottom:4px;margin-bottom:10px">${T.exp}</div>${expCards}</main>
        <aside style="background:${c}12;border:1.5px solid ${c}44;border-radius:14px;padding:16px;display:flex;flex-direction:column;gap:12px">
          <div><div style="font-size:10.5px;font-weight:900;color:${c};text-transform:uppercase;letter-spacing:1.2px;margin-bottom:6px">${T.skills}</div>${skHtml}</div>
          <div><div style="font-size:10.5px;font-weight:900;color:${c};text-transform:uppercase;letter-spacing:1.2px;margin-bottom:6px">${T.edu}</div>${eduList}</div>
          ${langList || certList ? `<div><div style="font-size:10.5px;font-weight:900;color:${c};text-transform:uppercase;margin-bottom:4px">${T.lang} & ${T.cert}</div><div style="font-size:11px;color:${sub}">${langList}</div>${certList}</div>` : ''}
        </aside>
      </div>`;
    } else if (bMode === 2) {
      // Swiss Left-Index Grid (115px label column + 1fr content)
      bodyHtml = `<div>
        ${v.summary ? `<div style="display:grid;grid-template-columns:115px 1fr;gap:14px;padding:10px 0;border-bottom:1px solid ${bdr}"><div style="font-size:10px;font-weight:900;color:${c};text-transform:uppercase;letter-spacing:1.2px">01 // ${T.summary}</div><div style="font-size:12px;color:${sub}">${e(v.summary)}</div></div>` : ''}
        <div style="display:grid;grid-template-columns:115px 1fr;gap:14px;padding:12px 0;border-bottom:1px solid ${bdr}">
          <div style="font-size:10px;font-weight:900;color:${c};text-transform:uppercase;letter-spacing:1.2px">02 // ${T.exp}</div>
          <div>${expCards}</div>
        </div>
        <div style="display:grid;grid-template-columns:115px 1fr 1fr;gap:14px;padding:12px 0">
          <div style="font-size:10px;font-weight:900;color:${c};text-transform:uppercase;letter-spacing:1.2px">03 // ${T.skills} & ${T.edu}</div>
          <div style="background:${cardBg};padding:12px;border-radius:10px;border:1px solid ${bdr}">${skHtml}</div>
          <div style="background:${cardBg};padding:12px;border-radius:10px;border:1px solid ${bdr}">${eduList}${certList}</div>
        </div>
      </div>`;
    } else if (bMode === 3) {
      // Structured Ledger Table Rows
      bodyHtml = `<div>
        ${sumHtml}
        <div style="background:${c};color:#fff;padding:5px 12px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1.2px">${T.exp}</div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:14px;border:1.5px solid ${bdr}">
          ${exps(v).map((x) => `<tr><td style="width:130px;padding:9px 11px;border:1px solid ${bdr};background:${cardBg};vertical-align:top;font-weight:700;font-size:10.5px;color:${c}">${x.p}<div style="color:${sub};margin-top:2px">${x.co}</div></td><td style="padding:9px 12px;border:1px solid ${bdr};vertical-align:top"><b style="font-size:13px">${x.role}</b>${bullets(x.d)}</td></tr>`).join('')}
        </table>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
          <div style="border:1.5px solid ${bdr};padding:12px;background:${cardBg}"><div style="font-size:11px;font-weight:900;color:${c};text-transform:uppercase;margin-bottom:6px">${T.skills}</div>${skHtml}</div>
          <div style="border:1.5px solid ${bdr};padding:12px;background:${cardBg}"><div style="font-size:11px;font-weight:900;color:${c};text-transform:uppercase;margin-bottom:6px">${T.edu} & ${T.cert}</div>${eduList}${certList}</div>
        </div>
      </div>`;
    } else if (bMode === 4) {
      // Bento Modular Cards (1.55fr + 1fr)
      bodyHtml = `<div style="display:grid;grid-template-columns:1.55fr 1fr;gap:14px">
        <div style="display:flex;flex-direction:column;gap:12px">
          ${sumHtml}
          <div style="background:${cardBg};border:1.5px solid ${bdr};border-radius:14px;padding:15px"><div style="font-size:11px;font-weight:900;color:${c};text-transform:uppercase;letter-spacing:1.2px;margin-bottom:8px">✦ ${T.exp}</div>${expCards}</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px">
          <div style="background:${cardBg};border:1.5px solid ${bdr};border-radius:14px;padding:15px"><div style="font-size:11px;font-weight:900;color:${c};text-transform:uppercase;letter-spacing:1.2px;margin-bottom:8px">✦ ${T.skills}</div>${skHtml}</div>
          <div style="background:${cardBg};border:1.5px solid ${bdr};border-radius:14px;padding:15px"><div style="font-size:11px;font-weight:900;color:${c};text-transform:uppercase;letter-spacing:1.2px;margin-bottom:8px">✦ ${T.edu}</div>${eduList}${certList}</div>
        </div>
      </div>`;
    } else if (bMode === 5) {
      // Equal 50/50 Editorial Split with Central Divider
      bodyHtml = `${sumHtml}<div style="display:grid;grid-template-columns:1fr 1fr;gap:22px;border-top:1.5px solid ${bdr};padding-top:14px">
        <div style="border-right:1.5px solid ${bdr};padding-right:20px">
          <div style="font-size:11.5px;font-weight:900;color:${c};text-transform:uppercase;letter-spacing:1.4px;margin-bottom:10px">I. ${T.exp}</div>
          ${exps(v).map((x, i) => `<div style="margin-bottom:12px;padding-left:12px;border-left:2.5px solid ${c}"><div style="display:flex;justify-content:space-between"><b style="font-size:13px">§${i + 1}. ${x.role}</b><span style="font-size:10.5px;color:${c};font-weight:700">${x.p}</span></div><div style="font-size:11.5px;color:${sub};font-weight:600">${x.co}</div>${bullets(x.d)}</div>`).join('')}
        </div>
        <div>
          <div style="font-size:11.5px;font-weight:900;color:${c};text-transform:uppercase;letter-spacing:1.4px;margin-bottom:8px">II. ${T.skills}</div>
          ${skHtml}
          <div style="font-size:11.5px;font-weight:900;color:${c};text-transform:uppercase;letter-spacing:1.4px;margin:14px 0 8px">III. ${T.edu}</div>
          ${eduList}
          ${langList || certList ? `<div style="font-size:11.5px;font-weight:900;color:${c};text-transform:uppercase;letter-spacing:1.4px;margin:14px 0 6px">IV. ${T.lang} & ${T.cert}</div><div style="font-size:11px;color:${sub}">${langList}</div>${certList}` : ''}
        </div>
      </div>`;
    } else {
      // Single-Column Timeline Spine + Bottom 3-Card Deck
      bodyHtml = `<div>
        ${sumHtml}
        <div style="font-size:11.5px;font-weight:900;color:${c};text-transform:uppercase;letter-spacing:1.4px;margin-bottom:10px">01 // ${T.exp}</div>
        <div style="border-left:2.5px solid ${c};margin-left:8px;padding-left:18px;margin-bottom:14px">
          ${exps(v).map((x) => `<div style="position:relative;margin-bottom:11px;background:${cardBg};border:1px solid ${bdr};border-radius:8px;padding:9px 12px"><span style="position:absolute;left:-25px;top:12px;width:11px;height:11px;border-radius:50%;background:${c};border:2px solid ${bg}"></span><div style="display:flex;justify-content:space-between"><b style="font-size:13px">${x.role} — <span style="color:${c}">${x.co}</span></b><span style="font-size:10.5px;font-weight:700;color:${sub}">${x.p}</span></div>${bullets(x.d)}</div>`).join('')}
        </div>
        <div style="display:grid;grid-template-columns:1.2fr 1fr;gap:14px">
          <div style="background:${cardBg};border:1px solid ${bdr};border-top:3px solid ${c};border-radius:10px;padding:12px"><div style="font-size:11px;font-weight:900;color:${c};text-transform:uppercase;margin-bottom:6px">02 // ${T.skills}</div>${skHtml}</div>
          <div style="background:${cardBg};border:1px solid ${bdr};border-top:3px solid ${fg};border-radius:10px;padding:12px"><div style="font-size:11px;font-weight:900;color:${fg};text-transform:uppercase;margin-bottom:6px">03 // ${T.edu} & ${T.cert}</div>${eduList}${certList}</div>
        </div>
      </div>`;
    }

    return page(`background:${bg};color:${fg};font-family:${font};padding:28px 34px`, headerHtml + bodyHtml);
  };
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
  { key: 'badges', fn: badges, cols: 1, photo: true, vi: 'Huy hiệu Vector', en: 'Icon Badges', tags: ['office', 'service', 'sales'] },
  { key: 'frame', fn: frame, cols: 1, photo: false, vi: 'Khung Viền Cổ Điển', en: 'Ornamental Frame', tags: ['traditional', 'office', 'finance'] },
  { key: 'zen', fn: zen, cols: 1, photo: false, vi: 'Tối Giản Thiền Định (Zen)', en: 'Zen Centered', tags: ['office', 'service', 'ats'] },
  { key: 'boxed', fn: boxed, cols: 2, photo: true, vi: 'Thẻ Hộp Khung Rõ Ràng', en: 'Boxed Cards', tags: ['office', 'sales', 'student'] },
  { key: 'diagonal', fn: diagonal, cols: 2, photo: true, vi: 'Cắt Chéo Năng Động', en: 'Diagonal Cut', tags: ['creative', 'sales', 'it'] },
  { key: 'gauges', fn: gauges, cols: 2, photo: true, vi: 'Vòng tròn Năng lực SVG', en: 'Circular Gauges', tags: ['creative', 'sales', 'it'] },
  { key: 'waves', fn: waves, cols: 2, photo: true, vi: 'Sóng Lượn Nghệ thuật', en: 'Fluid Waves', tags: ['creative', 'service', 'student'] },
  { key: 'twotone', fn: twotone, cols: 2, photo: true, vi: 'Hai Tông Màu Hiện Đại', en: 'Two-Tone Split', tags: ['office', 'sales', 'manager'] },
  { key: 'ribbon', fn: ribbon, cols: 1, photo: true, vi: 'Dải Ruy-băng Nổi', en: 'Ribbon Banner', tags: ['service', 'student', 'office'] },
  ...SPECIALIZED_CV_SPECS.map((s, idx) => ({
    key: s.key,
    fn: makeUniqueSpecializedCv(s, idx),
    cols: s.cols,
    photo: s.photo,
    vi: s.vi,
    en: s.en,
    tags: s.tags
  }))
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
export const RETIRED_CV_IDS = { 'cv-classic': 'cv-classic-wine' };
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
  const m = /^cv-([a-z0-9]+)-([a-z]+)$/.exec(id || '');
  if (m && LAYOUTS.some((l) => l.key === m[1])) return id;
  return m && RETIRED_LAYOUTS[m[1]] ? `cv-${RETIRED_LAYOUTS[m[1]]}-${m[2]}` : id;
};

export const CV_FILTERS = {
  vi: { office: 'Văn phòng', sales: 'Kinh doanh', creative: 'Sáng tạo', it: 'IT', manager: 'Quản lý', finance: 'Tài chính – Ngân hàng', traditional: 'Truyền thống', ats: 'Chuẩn ATS', service: 'Dịch vụ', student: 'Sinh viên' },
  en: { office: 'Office', sales: 'Sales', creative: 'Creative', it: 'IT', manager: 'Management', finance: 'Finance', traditional: 'Traditional', ats: 'ATS-friendly', service: 'Service', student: 'Graduate' }
};

// 30 distinct layouts × 9 palettes (near-duplicates removed in 10/2026). The gallery shows one card per layout; colour is picked separately. Old ids (cv, cv-creative, …) still resolve.
function applyCvFineTuning(html, v) {
  const fontMap = { sans: FONT, serif: SERIF, mono: MONO_FONT, hand: HAND_FONT };
  const scaleMap = { compact: '0.92', normal: '1', large: '1.06' };
  const lineMap = { tight: '1.36', normal: '1.55', airy: '1.72' };
  const fFam = fontMap[v.cvFont] || '';
  const fScale = scaleMap[v.cvScale] || '1';
  const fLine = lineMap[v.cvDensity] || '';
  const rules = [];
  if (fFam) rules.push(`.cv-tune-wrap, .cv-tune-wrap * { font-family: ${fFam} !important; }`);
  if (fLine) rules.push(`.cv-tune-wrap > div { line-height: ${fLine} !important; }`);
  if (v.cvRadius === 'sharp') rules.push(`.cv-tune-wrap div, .cv-tune-wrap aside, .cv-tune-wrap header { border-radius: 0px !important; }`);
  if (v.cvRadius === 'round') rules.push(`.cv-tune-wrap div { border-radius: 14px; }`);
  if (fScale !== '1') rules.push(`.cv-tune-wrap > div { zoom: ${fScale}; }`);
  if (!rules.length) return html;
  return `<div class="cv-tune-wrap"><style>${rules.join('\n')}</style>${html}</div>`;
}

export function cvTemplates(lang = 'vi') {
  const vi = lang === 'vi';
  const T = sectionTitles(vi);
  const fields = fieldsFor(vi);
  const legacy = { 'modern-navy': 'cv', 'creative-teal': 'cv-creative', 'executive-amber': 'cv-executive', 'minimal-graphite': 'cv-minimal' };
  const out = [];
  for (let lIdx = 0; lIdx < LAYOUTS.length; lIdx++) {
    const L = LAYOUTS[lIdx];
    const sigPal = PALETTES[(lIdx * 3 + (lIdx % 2)) % PALETTES.length].key;
    for (const P of PALETTES) {
      out.push({
        id: legacy[`${L.key}-${P.key}`] || `cv-${L.key}-${P.key}`,
        group: 'cv', fullBleed: true, accent: P.c,
        layout: L.key, cols: L.cols, photo: L.photo, tags: L.tags, sigPalette: sigPal,
        layoutName: vi ? L.vi : L.en, paletteName: vi ? P.vi : P.en, palette: P.key,
        name: `CV · ${vi ? L.vi : L.en} · ${vi ? P.vi : P.en}`,
        fields,
        render: (v) => applyCvFineTuning(L.fn({ ...v, color: v.color || P.c }, T), v)
      });
    }
  }
  return out;
}
