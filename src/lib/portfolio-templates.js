// Portfolio site generator: every style returns one self-contained HTML document (inline CSS/JS, Google Fonts only).
// The same string feeds the live preview iframe (srcdoc) and the .html download.
import { escapeHtml as e } from './format.js';

const lines = (s) => String(s || '').split('\n').map((x) => x.trim()).filter(Boolean);
const list = (s) => String(s || '').split(',').map((x) => x.trim()).filter(Boolean);
const color = (v, d) => (/^#[0-9a-f]{6}$/i.test(v || '') ? v : d);
const safeUrl = (u) => (/^(https?:\/\/|mailto:)/i.test(String(u || '').trim()) ? e(String(u).trim()) : '');
const imgSrc = (u) => (/^data:image\/(png|jpe?g|webp);base64,[a-z0-9+/=]+$/i.test(u || '') || /^data:image\/svg\+xml;charset=utf-8,[a-z0-9%~._-]*$/i.test(u || '') ? u : safeUrl(u));

// Art Direction & Mockup Board SVG generator when a project has no uploaded photo.
export function placeholder(title, i, c) {
  const palettes = [
    [c, '#0b0d13', '#f8fafc', '#38bdf8', '#94a3b8'],
    ['#d97757', '#161514', '#f4f0e8', '#e6ccb2', '#a8a29e'],
    ['#4f46e5', '#090b14', '#eef2ff', '#a855f7', '#818cf8'],
    ['#10b981', '#071c15', '#ecfdf5', '#34d399', '#6ee7b7'],
    ['#e11d48', '#190810', '#ffe4e6', '#fb7185', '#fda4af'],
    ['#f59e0b', '#171412', '#fef3c7', '#fbbf24', '#fcd34d']
  ];
  const [p1, bg, fg, p2, muted] = palettes[i % palettes.length];
  const words = String(title || 'Project').trim().split(/\s+/);
  const txt = e(words.slice(0, 2).map((w) => w[0] || '').join('').toUpperCase() || 'PF');
  const fullTitle = e(String(title || 'Featured Case Study').slice(0, 30));
  const subTitle = e(words.slice(0, 4).join(' ').toUpperCase());
  const num = String(i + 1).padStart(2, '0');
  const scenes = [
    // 0: Brand Identity & Packaging Poster Mockup Board
    `<rect x="400" y="64" width="336" height="472" rx="14" fill="#181b24" stroke="${fg}" stroke-opacity=".16"/>
     <rect x="424" y="88" width="288" height="340" rx="8" fill="${p1}"/>
     <circle cx="568" cy="258" r="96" fill="${bg}" opacity=".88"/><circle cx="598" cy="232" r="54" fill="${p2}" opacity=".85"/>
     <text x="444" y="132" font-family="system-ui,sans-serif" font-size="11" font-weight="700" fill="${fg}" letter-spacing="3">BRAND SYSTEM // ${num}</text>
     <text x="444" y="398" font-family="system-ui,sans-serif" font-size="34" font-weight="900" fill="${fg}" letter-spacing="-1">${txt}</text>
     <rect x="424" y="446" width="64" height="64" rx="8" fill="${p1}"/><rect x="498" y="446" width="64" height="64" rx="8" fill="${p2}"/><rect x="572" y="446" width="64" height="64" rx="8" fill="${fg}"/><rect x="646" y="446" width="66" height="64" rx="8" fill="#27272a"/>`,
    // 1: Editorial Lookbook / Magazine Double-Page Spread Mockup
    `<g transform="translate(360,82)"><rect x="0" y="0" width="185" height="436" rx="6" fill="#f5f2eb" stroke="${fg}" stroke-opacity=".2"/><rect x="185" y="0" width="185" height="436" rx="6" fill="#ebe5d9" stroke="${fg}" stroke-opacity=".2"/>
     <rect x="22" y="28" width="140" height="190" fill="${p1}"/><circle cx="92" cy="123" r="52" fill="${p2}" opacity=".75"/>
     <text x="22" y="258" font-family="Georgia,serif" font-size="24" font-style="italic" fill="#18181b">${fullTitle.slice(0, 14)}</text>
     <rect x="22" y="276" width="130" height="5" fill="#71717a"/><rect x="22" y="290" width="110" height="5" fill="#a1a1aa"/><rect x="22" y="304" width="122" height="5" fill="#a1a1aa"/>
     <text x="208" y="86" font-family="Georgia,serif" font-size="68" font-weight="700" fill="${p1}">0${i + 1}</text>
     <rect x="208" y="116" width="140" height="240" fill="#18181b"/><circle cx="278" cy="236" r="58" fill="${p1}" opacity=".9"/></g>`,
    // 2: Digital Product & Mobile UI Presentation Mockup
    `<rect x="370" y="96" width="366" height="250" rx="14" fill="#111827" stroke="${fg}" stroke-opacity=".22" stroke-width="2"/>
     <rect x="386" y="118" width="150" height="206" rx="8" fill="${p1}" opacity=".9"/><rect x="550" y="118" width="168" height="96" rx="8" fill="#1f2937"/><rect x="550" y="228" width="168" height="96" rx="8" fill="${p2}" opacity=".25"/>
     <rect x="320" y="240" width="150" height="296" rx="24" fill="#090d16" stroke="${p2}" stroke-width="3"/>
     <rect x="334" y="268" width="122" height="130" rx="12" fill="${p1}"/><rect x="334" y="410" width="122" height="44" rx="8" fill="#1e293b"/><rect x="334" y="464" width="84" height="12" rx="6" fill="${p2}"/>`,
    // 3: Swiss Typographic Poster & Constructivist Grid
    `<rect x="410" y="56" width="326" height="488" fill="#f4f1ea"/>
     <circle cx="573" cy="230" r="118" fill="${p1}"/><polygon points="440,390 706,390 573,170" fill="${bg}" opacity=".88"/><circle cx="573" cy="295" r="38" fill="${p2}"/>
     <text x="432" y="452" font-family="system-ui,sans-serif" font-size="38" font-weight="900" fill="#111" letter-spacing="-1.5">${txt} // ${num}</text>
     <text x="432" y="482" font-family="monospace" font-size="11" font-weight="700" fill="#52525b" letter-spacing="2">SWISS GRID SPECIMEN — 1400PX</text>`
  ][i % 4];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="640" viewBox="0 0 800 600"><defs><linearGradient id="bg${i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${bg}"/><stop offset="1" stop-color="#07070a"/></linearGradient><pattern id="gr${i}" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="${fg}" stroke-width="1" stroke-opacity=".05"/></pattern></defs>
  <rect width="800" height="600" fill="url(#bg${i})"/><rect width="800" height="600" fill="url(#gr${i})"/>
  <path d="M32,48 H52 M40,40 V56 M748,48 H768 M760,40 V56 M32,552 H52 M40,544 V560 M748,552 H768 M760,544 V560" stroke="${fg}" stroke-opacity=".35" stroke-width="1.5"/>
  ${scenes}
  <text x="58" y="96" font-family="monospace" font-size="12" font-weight="700" fill="${p2}" letter-spacing="3">PORTFOLIO ARTBOARD // ${num}</text>
  <text x="58" y="255" font-family="system-ui,sans-serif" font-size="116" font-weight="900" fill="${fg}" opacity=".94" letter-spacing="-5">${txt}</text>
  <rect x="58" y="286" width="84" height="5" fill="${p1}"/>
  <text x="58" y="338" font-family="system-ui,sans-serif" font-size="26" font-weight="800" fill="${fg}">${fullTitle}</text>
  <text x="58" y="368" font-family="monospace" font-size="11" fill="${muted}" letter-spacing="2">${subTitle} · ARCHIVE</text>
  <g transform="translate(58,475)"><rect width="26" height="42" rx="4" fill="${p1}"/><rect x="34" width="26" height="42" rx="4" fill="${p2}"/><rect x="68" width="26" height="42" rx="4" fill="${fg}" opacity=".9"/><text x="108" y="18" font-family="monospace" font-size="10" fill="${muted}">PANTONE / HEX</text><text x="108" y="34" font-family="monospace" font-size="12" font-weight="700" fill="${fg}">${String(p1).toUpperCase()}</text></g></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

// Museum-grade Hand-Drawn Watercolor, Oriental Ink, Botanical & Zine SVG illustration generator.
export function handDrawnPlaceholder(title, i, c) {
  const papers = [
    ['#f8f4ea', '#1e1b18', '#b91c1c', '#d4a373'],
    ['#fcfaf4', '#25231f', c || '#2a9d8f', '#f4a261'],
    ['#f5efe2', '#261c14', '#bc4749', '#6a994e'],
    ['#f4f1ea', '#1d3557', '#e63946', '#ffb703']
  ];
  const [bg, ink, acc, sub] = papers[i % papers.length];
  const fullTitle = e(String(title || 'Original Artwork').slice(0, 28));
  const num = String(i + 1).padStart(2, '0');
  const artworks = [
    // 0: Oriental Shan-Shui Ink Wash Landscape & Vermilion Sun
    `<circle cx="545" cy="195" r="78" fill="${acc}" opacity=".82"/>
     <path d="M40,470 Q180,290 310,395 T590,285 L768,470 Z" fill="${ink}" opacity=".16"/>
     <path d="M120,470 Q290,220 450,360 T740,240 L768,470 Z" fill="${ink}" opacity=".32"/>
     <path d="M52,445 Q240,185 410,335 T730,210" fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>
     <rect x="676" y="88" width="44" height="44" rx="4" fill="${acc}"/><text x="685" y="117" font-family="serif" font-size="20" font-weight="700" fill="${bg}">ẤN</text>`,
    // 1: Watercolor & Botanical Herbarium Specimen Plate
    `<ellipse cx="510" cy="275" rx="195" ry="135" fill="${acc}" opacity=".18" transform="rotate(-12 510 275)"/>
     <ellipse cx="440" cy="310" rx="145" ry="110" fill="${sub}" opacity=".24" transform="rotate(15 440 310)"/>
     <path d="M460,465 Q470,280 535,115 M475,365 Q395,315 360,325 M488,295 Q570,245 615,260 M502,225 Q425,175 390,190 M518,165 Q575,130 605,140" fill="none" stroke="${ink}" stroke-width="3.2" stroke-linecap="round"/>
     <ellipse cx="360" cy="325" rx="32" ry="16" fill="${acc}" opacity=".55" transform="rotate(-24 360 325)"/><ellipse cx="615" cy="260" rx="34" ry="17" fill="${acc}" opacity=".55" transform="rotate(20 615 260)"/><ellipse cx="390" cy="190" rx="28" ry="14" fill="${sub}" opacity=".75" transform="rotate(-18 390 190)"/>`,
    // 2: Sketchbook Architectural / Character Study with Masking Tape & Paint Pans
    `<rect x="330" y="92" width="380" height="340" fill="#fff" stroke="${ink}" stroke-width="2.5" transform="rotate(-2 520 262)"/>
     <rect x="475" y="74" width="95" height="26" fill="${sub}" opacity=".75" transform="rotate(3 520 87)"/>
     <circle cx="520" cy="240" r="92" fill="${acc}" opacity=".22"/><circle cx="520" cy="240" r="92" fill="none" stroke="${ink}" stroke-width="2" stroke-dasharray="6 6"/>
     <path d="M390,360 L475,165 L565,315 L620,215 L675,360 Z" fill="${sub}" opacity=".35" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>`,
    // 3: Risograph / Bauhaus Hand-Cut Print Poster
    `<circle cx="555" cy="245" r="135" fill="${acc}" opacity=".78"/><rect x="360" y="140" width="180" height="250" fill="${sub}" opacity=".72"/>
     <polygon points="450,395 675,395 562,155" fill="none" stroke="${ink}" stroke-width="4"/>
     <path d="M340,425 C430,360 560,450 690,375" fill="none" stroke="${ink}" stroke-width="5" stroke-linecap="round"/>`
  ][i % 4];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="640" viewBox="0 0 800 600"><rect width="800" height="600" fill="${bg}"/>
  <path d="M28,28 C260,22 540,34 772,26 C766,220 774,410 768,572 C520,578 270,564 30,570 C36,390 24,210 28,28 Z" fill="none" stroke="${ink}" stroke-width="2.2" opacity=".78"/>
  <path d="M38,38 L762,38 L762,562 L38,562 Z" fill="none" stroke="${ink}" stroke-width="0.8" stroke-dasharray="6 6" opacity=".4"/>
  ${artworks}
  <text x="64" y="88" font-family="Georgia,serif" font-style="italic" font-size="16" fill="${acc}" font-weight="700">Original Plate No. ${num} — Hand-Crafted Edition</text>
  <text x="64" y="488" font-family="Georgia,serif" font-size="36" font-weight="700" fill="${ink}">${fullTitle}</text>
  <g transform="translate(64,508)"><rect width="28" height="16" rx="3" fill="${acc}" stroke="${ink}" stroke-width="1.5"/><rect x="36" width="28" height="16" rx="3" fill="${sub}" stroke="${ink}" stroke-width="1.5"/><rect x="72" width="28" height="16" rx="3" fill="${ink}"/><text x="114" y="13" font-family="Georgia,serif" font-style="italic" font-size="13" fill="${ink}" opacity=".75">Pigment &amp; Ink on Cotton Paper · 2026</text></g></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

// Companion Case Study Boards: generates a Process/Sketch Wireframe board ('sketch') and a Color/Typography Spec board ('spec') per project.
export function detailFrameSvg(title, cat, i, c, kind = 'sketch') {
  const acc = color(c, '#2563eb');
  const fullTitle = e(String(title || 'Case Study').slice(0, 28));
  const fullCat = e(String(cat || 'Art Direction').slice(0, 24).toUpperCase());
  const num = String(i + 1).padStart(2, '0');
  if (kind === 'sketch') {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="540" viewBox="0 0 800 540">
      <rect width="800" height="540" fill="#f6f3ec"/>
      <pattern id="skg${i}" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M 24 0 L 0 0 0 24" fill="none" stroke="#1c1917" stroke-width="0.7" stroke-opacity=".11"/></pattern>
      <rect width="800" height="540" fill="url(#skg${i})"/>
      <rect x="36" y="36" width="728" height="468" fill="none" stroke="#1c1917" stroke-width="1.8"/>
      <line x1="36" y1="88" x2="764" y2="88" stroke="#1c1917" stroke-width="1.2"/>
      <text x="56" y="68" font-family="monospace" font-size="12" font-weight="700" fill="#1c1917" letter-spacing="2">FIG 0${i + 1}.A // WIREFRAME, PROPORTION &amp; ROUGH SKETCH STUDY</text>
      <text x="640" y="68" font-family="monospace" font-size="12" fill="${acc}" font-weight="700">SCALE 1:1.618</text>
      <rect x="64" y="118" width="380" height="280" fill="#fff" stroke="#1c1917" stroke-width="2"/>
      <line x1="64" y1="118" x2="444" y2="398" stroke="#1c1917" stroke-width="1" stroke-dasharray="6 6" opacity=".45"/>
      <line x1="444" y1="118" x2="64" y2="398" stroke="#1c1917" stroke-width="1" stroke-dasharray="6 6" opacity=".45"/>
      <circle cx="254" cy="258" r="98" fill="${acc}" opacity=".16" stroke="${acc}" stroke-width="2"/>
      <circle cx="254" cy="258" r="60" fill="none" stroke="#1c1917" stroke-width="1.8" stroke-dasharray="4 4"/>
      <path d="M96,350 Q190,170 275,275 T415,180" fill="none" stroke="#1c1917" stroke-width="3.5" stroke-linecap="round"/>
      <rect x="476" y="118" width="256" height="128" fill="#fff" stroke="#1c1917" stroke-width="1.8"/>
      <text x="496" y="148" font-family="Georgia,serif" font-style="italic" font-size="15" fill="${acc}">01. Concept &amp; Grid Notes</text>
      <rect x="496" y="164" width="200" height="6" fill="#1c1917" opacity=".7"/><rect x="496" y="180" width="175" height="6" fill="#1c1917" opacity=".4"/><rect x="496" y="196" width="190" height="6" fill="#1c1917" opacity=".4"/>
      <rect x="476" y="266" width="256" height="132" fill="#fff" stroke="#1c1917" stroke-width="1.8"/>
      <text x="496" y="296" font-family="Georgia,serif" font-style="italic" font-size="15" fill="#1c1917">02. Composition Ratios</text>
      <rect x="496" y="314" width="64" height="60" fill="${acc}" opacity=".25" stroke="${acc}" stroke-width="1.5"/><rect x="572" y="314" width="136" height="60" fill="#1c1917" opacity=".08" stroke="#1c1917" stroke-width="1.5"/>
      <text x="64" y="452" font-family="Georgia,serif" font-size="26" font-weight="700" fill="#1c1917">${fullTitle} — Early Exploration</text>
      <text x="64" y="478" font-family="monospace" font-size="11" fill="#57534e" letter-spacing="1.5">${fullCat} // PROCESS ARCHIVE</text>
    </svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="540" viewBox="0 0 800 540">
    <rect width="800" height="540" fill="#111318"/>
    <rect x="36" y="36" width="728" height="468" rx="14" fill="#181b22" stroke="#2e3444" stroke-width="1.5"/>
    <text x="64" y="82" font-family="monospace" font-size="12" font-weight="700" fill="${acc}" letter-spacing="2.5">FIG 0${num}.B // COLOR PANTONE &amp; TYPOGRAPHY SYSTEM</text>
    <g transform="translate(64,110)">
      <rect width="150" height="210" rx="10" fill="${acc}"/><rect y="145" width="150" height="65" fill="#fff"/><text x="14" y="170" font-family="monospace" font-size="11" font-weight="700" fill="#111">PANTONE PRIMARY</text><text x="14" y="192" font-family="monospace" font-size="13" font-weight="700" fill="#52525b">${acc.toUpperCase()}</text>
      <rect x="170" width="150" height="210" rx="10" fill="#f4f0e8"/><rect x="170" y="145" width="150" height="65" fill="#fff"/><text x="184" y="170" font-family="monospace" font-size="11" font-weight="700" fill="#111">WARM PAPER</text><text x="184" y="192" font-family="monospace" font-size="13" font-weight="700" fill="#52525b">#F4F0E8</text>
      <rect x="340" width="150" height="210" rx="10" fill="#0f172a" stroke="#334155"/><rect x="340" y="145" width="150" height="65" fill="#fff"/><text x="354" y="170" font-family="monospace" font-size="11" font-weight="700" fill="#111">CARBON INK</text><text x="354" y="192" font-family="monospace" font-size="13" font-weight="700" fill="#52525b">#0F172A</text>
      <rect x="510" width="162" height="210" rx="10" fill="#1e222d" stroke="#334155"/><text x="530" y="88" font-family="Georgia,serif" font-size="76" font-weight="700" fill="#fff">Aa</text><text x="530" y="135" font-family="monospace" font-size="11" fill="${acc}">DISPLAY SERIF</text><text x="530" y="165" font-family="monospace" font-size="11" fill="#94a3b8">ABCDEFGHIJKLMNOPQRSTUVWXYZ</text><text x="530" y="185" font-family="monospace" font-size="11" fill="#94a3b8">0123456789 !@#$%</text>
    </g>
    <line x1="64" y1="358" x2="736" y2="358" stroke="#2e3444" stroke-width="1.5"/>
    <text x="64" y="408" font-family="system-ui,sans-serif" font-size="28" font-weight="800" fill="#fff">${fullTitle} — Brand &amp; Visual Identity Board</text>
    <text x="64" y="442" font-family="monospace" font-size="12" fill="#94a3b8" letter-spacing="1.5">DISCIPLINE: ${fullCat} ·GRID: 12-COL ARTBOARD · RESOLUTION: 1400PX</text>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function prepare(v, images = []) {
  const c = color(v.color, '#2563eb');
  const useHandCover = v.coverMode === 'hand';
  const projects = lines(v.projects).map((l, i) => {
    const [title, cat, year, desc, link] = l.split('|').map((x) => x.trim());
    const fallback = useHandCover ? handDrawnPlaceholder(title, i, c) : placeholder(title, i, c);
    return {
      title: e(title || ''), cat: e(cat || ''), year: e(year || ''), desc: e(desc || ''), link: safeUrl(link),
      img: imgSrc(images[i]) || fallback,
      sketchImg: detailFrameSvg(title, cat, i, c, 'sketch'),
      specImg: detailFrameSvg(title, cat, i, c, 'spec')
    };
  });
  const links = lines(v.links).map((l) => { const [label, url] = l.split('|').map((x) => x.trim()); return { label: e(label || url || ''), url: safeUrl(url) }; }).filter((x) => x.url);
  return {
    c, projects, links,
    name: e(v.name), role: e(v.role), bio: e(v.bio), email: e(v.email), loc: e(v.location),
    avail: e(v.availability || ''), manifesto: e(v.manifesto || ''), sig: e(v.signature || v.name || ''),
    mail: safeUrl('mailto:' + String(v.email || '').trim()),
    skills: list(v.skills).map(e),
    avatar: imgSrc(v.avatar),
    first: e(String(v.name || '').trim().split(/\s+/).pop() || '')
  };
}

const T = {
  vi: { hi: 'Xin chào, mình là', work: 'Dự án', about: 'Giới thiệu', skills: 'Kỹ năng', contact: 'Liên hệ', hire: 'Cùng làm việc nhé', view: 'Xem dự án', made: 'Thiết kế bằng' },
  en: { hi: "Hi, I'm", work: 'Work', about: 'About', skills: 'Skills', contact: 'Contact', hire: "Let's work together", view: 'View project', made: 'Made with' }
};

function doc({ lang, title, fonts, css, body, script = '' }) {
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?${fonts}&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0}img{max-width:100%;display:block}a{color:inherit}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}.rv,.anim{opacity:1!important;transform:none!important}}${css}</style></head><body>${body}${script ? `<script>${script}</script>` : ''}</body></html>`;
}

const contactLinks = (d, cls = '') => [d.mail ? `<a class="${cls}" href="${d.mail}">${d.email}</a>` : '', ...d.links.map((l) => `<a class="${cls}" href="${l.url}" target="_blank" rel="noopener">${l.label}</a>`)].filter(Boolean).join('');
const projLink = (p, L, cls = '') => (p.link ? `<a class="${cls}" href="${p.link}" target="_blank" rel="noopener">${L.view} →</a>` : '');

// Reveal-on-scroll used by several styles
const REVEAL_JS = `const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.15});document.querySelectorAll('.rv').forEach((el,i)=>{el.style.transitionDelay=(i%4)*90+'ms';io.observe(el)});`;

// ---------------------------------------------------------------- 1. Professional
function professional(d, L, lang) {
  return doc({ lang, title: `${d.name} – Portfolio`, fonts: 'family=Be+Vietnam+Pro:wght@400;600;800',
    css: `body{font-family:'Be Vietnam Pro',sans-serif;color:#0f172a;background:#fff}.w{max-width:1100px;margin:auto;padding:0 24px}
nav{position:sticky;top:0;background:#fffc;backdrop-filter:blur(8px);border-bottom:1px solid #e2e8f0;z-index:9}nav .w{display:flex;gap:24px;align-items:center;height:64px}nav b{margin-right:auto}nav a{text-decoration:none;color:#475569;font-weight:600}
.hero{padding:96px 0 72px;display:grid;grid-template-columns:1.4fr 1fr;gap:48px;align-items:center}.hero h1{font-size:clamp(36px,5vw,60px);line-height:1.05;margin:0}.hero h1 span{color:${d.c}}.hero p{font-size:19px;color:#475569}
.av{width:100%;aspect-ratio:1;border-radius:28px;object-fit:cover;background:${d.c}}.col{display:grid;grid-template-columns:1fr 1fr;gap:12px;transform:rotate(-3deg)}.col img{aspect-ratio:1;object-fit:cover;border-radius:18px;box-shadow:0 18px 30px -18px #0f172a80}.col img:nth-child(even){transform:translateY(24px)}.btn{display:inline-block;background:${d.c};color:#fff;padding:14px 26px;border-radius:12px;text-decoration:none;font-weight:700;margin-top:12px}
h2{font-size:32px;margin:0 0 28px}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:28px}.card{border:1px solid #e2e8f0;border-radius:18px;overflow:hidden;transition:.25s}.card:hover{transform:translateY(-4px);box-shadow:0 20px 40px -20px #0f172a40}
.card img{aspect-ratio:4/3;object-fit:cover;width:100%}.card div{padding:20px}.tag{font-size:12px;font-weight:700;color:${d.c};text-transform:uppercase;letter-spacing:1px}.card h3{margin:6px 0}.card p{color:#475569;margin:0 0 10px}.card a{color:${d.c};font-weight:700;text-decoration:none}
section{padding:72px 0}.skills{display:flex;flex-wrap:wrap;gap:10px}.skills span{background:#f1f5f9;border-radius:999px;padding:8px 16px;font-weight:600}
footer{background:#0f172a;color:#fff;padding:72px 0;text-align:center}footer a{display:inline-block;margin:6px 10px;color:#cbd5e1}@media(max-width:760px){.hero{grid-template-columns:1fr}}`,
    body: `<nav><div class="w"><b>${d.name}</b><a href="#work">${L.work}</a><a href="#about">${L.about}</a><a href="#contact">${L.contact}</a></div></nav>
<div class="w hero"><div><div class="tag">${d.role}</div><h1>${L.hi} <span>${d.name}</span></h1><p>${d.bio}</p><a class="btn" href="#contact">${L.hire}</a></div>${d.avatar ? `<img class="av" src="${d.avatar}" alt="">` : `<div class="col">${d.projects.slice(0, 4).map((p) => `<img src="${p.img}" alt="">`).join('')}</div>`}</div>
<section id="work"><div class="w"><h2>${L.work}</h2><div class="grid">${d.projects.map((p) => `<article class="card"><img src="${p.img}" alt="${p.title}"><div><span class="tag">${p.cat}${p.year ? ` · ${p.year}` : ''}</span><h3>${p.title}</h3><p>${p.desc}</p>${projLink(p, L)}</div></article>`).join('')}</div></div></section>
<section id="about" style="background:#f8fafc"><div class="w"><h2>${L.skills}</h2><div class="skills">${d.skills.map((s) => `<span>${s}</span>`).join('')}</div></div></section>
<footer id="contact"><div class="w"><h2>${L.hire}</h2><p>${d.loc}</p>${contactLinks(d)}</div></footer>` });
}

// ---------------------------------------------------------------- 2. Graphic designer (bold type, masonry, colour blocks)
function graphic(d, L, lang) {
  return doc({ lang, title: `${d.name} – Graphic Design`, fonts: 'family=Space+Grotesk:wght@400;700&family=Be+Vietnam+Pro:wght@900',
    css: `body{font-family:'Space Grotesk',sans-serif;background:#f5f0e8;color:#111}
header{padding:32px 5vw;display:flex;justify-content:space-between;font-weight:700;text-transform:uppercase;letter-spacing:2px;font-size:13px}
.big{font-family:'Be Vietnam Pro';font-weight:900;font-size:clamp(64px,13vw,190px);line-height:.85;letter-spacing:-.04em;margin:0 5vw;text-transform:uppercase}
.big span{color:${d.c};display:inline-block;transition:transform .3s}.big span:hover{transform:rotate(-6deg) scale(1.05)}
.intro{display:grid;grid-template-columns:1fr 1fr;gap:5vw;padding:48px 5vw}.intro p{font-size:22px;margin:0}.role{background:#111;color:#f5f0e8;display:inline-block;padding:8px 16px;font-weight:700;transform:rotate(-2deg)}
.mas{columns:3 320px;column-gap:20px;padding:20px 5vw}.it{break-inside:avoid;margin-bottom:20px;position:relative;overflow:hidden;background:#111}
.it img{width:100%;transition:transform .6s,opacity .3s}.it:nth-child(3n+1) img{aspect-ratio:3/4;object-fit:cover}.it:nth-child(3n+2) img{aspect-ratio:1;object-fit:cover}.it:nth-child(3n) img{aspect-ratio:4/3;object-fit:cover}
.it:hover img{transform:scale(1.08);opacity:.35}.cap{position:absolute;inset:auto 0 0 0;padding:20px;color:#fff;transform:translateY(100%);transition:.35s}.it:hover .cap{transform:none}.cap b{font-size:24px;display:block}
.marq{overflow:hidden;background:${d.c};color:#fff;padding:18px 0;font-family:'Be Vietnam Pro';font-weight:900;font-size:40px;white-space:nowrap}.marq div{display:inline-block;animation:m 20s linear infinite}@keyframes m{to{transform:translateX(-50%)}}
footer{padding:80px 5vw;display:flex;flex-wrap:wrap;gap:20px;justify-content:space-between;align-items:end}footer h2{font-family:'Be Vietnam Pro';font-weight:900;font-size:clamp(40px,7vw,96px);margin:0;line-height:.9}footer a{font-size:20px;font-weight:700;display:block}
@media(max-width:760px){.intro{grid-template-columns:1fr}}`,
    body: `<header><span>${d.name}</span><span>${d.loc}</span></header>
<h1 class="big">${String(d.name).split(' ').map((w, i, a) => (i === a.length - 1 ? `<span>${w}</span>` : w)).join(' ')}</h1>
<div class="intro"><div><span class="role">${d.role}</span></div><p>${d.bio}</p></div>
<div class="mas">${d.projects.map((p) => `<div class="it"><img src="${p.img}" alt="${p.title}"><div class="cap"><small>${p.cat} ${p.year}</small><b>${p.title}</b>${p.desc}<br>${projLink(p, L)}</div></div>`).join('')}</div>
<div class="marq"><div>${(d.skills.join(' ✦ ') + ' ✦ ').repeat(6)}</div></div>
<footer><h2>${L.hire}</h2><div>${contactLinks(d)}</div></footer>` });
}

// ---------------------------------------------------------------- 3. Hand-drawn sketchbook
function sketchbook(d, L, lang) {
  const wob = `border:3px solid #222;border-radius:255px 15px 225px 15px/15px 225px 15px 255px`;
  return doc({ lang, title: `${d.name} – Sketchbook`, fonts: 'family=Patrick+Hand&family=Be+Vietnam+Pro:wght@400;700',
    css: `body{font-family:'Be Vietnam Pro',sans-serif;color:#222;background:#fdfaf3;background-image:radial-gradient(#e5dccb 1px,transparent 1px);background-size:22px 22px}
.hand{font-family:'Patrick Hand',cursive}.w{max-width:1050px;margin:auto;padding:0 24px}
.hero{text-align:center;padding:80px 0 40px}.hero h1{font-family:'Patrick Hand';font-size:clamp(48px,8vw,96px);margin:0;line-height:1}
.hl{background:linear-gradient(transparent 60%,${d.c}66 60%);padding:0 6px}.av{width:170px;height:170px;object-fit:cover;margin:0 auto 18px;${wob};padding:6px;background:#fff;transform:rotate(-4deg)}
.arrow{display:block;margin:10px auto}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:40px;padding:40px 0}
.card{background:#fff;padding:14px 14px 22px;${wob};box-shadow:6px 6px 0 #222;transition:transform .25s}.card:nth-child(odd){transform:rotate(-1.5deg)}.card:nth-child(even){transform:rotate(1.5deg)}.card:hover{transform:rotate(0) scale(1.03)}
.card img{aspect-ratio:4/3;object-fit:cover;width:100%;filter:saturate(.9) contrast(1.05);border:2px solid #222}.card h3{font-family:'Patrick Hand';font-size:28px;margin:10px 0 2px}.tape{width:90px;height:26px;background:#f6e27a99;margin:-26px auto 6px;transform:rotate(-3deg)}
.sk{display:flex;flex-wrap:wrap;gap:14px;justify-content:center}.sk span{font-family:'Patrick Hand';font-size:22px;padding:6px 16px;${wob};background:#fff}
h2{font-family:'Patrick Hand';font-size:44px;text-align:center;margin:40px 0 0}footer{text-align:center;padding:60px 0 90px}footer a{font-family:'Patrick Hand';font-size:26px;margin:0 12px}`,
    body: `<div class="w"><div class="hero">${d.avatar ? `<img class="av" src="${d.avatar}" alt="">` : ''}<h1>${d.name}</h1><p class="hand" style="font-size:28px"><span class="hl">${d.role}</span></p><p style="max-width:620px;margin:auto">${d.bio}</p>
<svg class="arrow" width="60" height="70" viewBox="0 0 60 70"><path d="M30 4c-6 18 8 30 0 52M16 44l14 16 14-18" stroke="#222" stroke-width="3" fill="none" stroke-linecap="round"/></svg></div>
<h2>${L.work}</h2><div class="grid">${d.projects.map((p) => `<div class="card"><div class="tape"></div><img src="${p.img}" alt="${p.title}"><h3>${p.title}</h3><div class="hand" style="font-size:18px;color:${d.c}">${p.cat} ${p.year}</div><p>${p.desc}</p>${projLink(p, L, 'hand')}</div>`).join('')}</div>
<h2>${L.skills}</h2><div class="sk" style="margin-top:20px">${d.skills.map((s) => `<span>${s}</span>`).join('')}</div>
<footer><h2>${L.hire} ✎</h2><p>${d.loc}</p>${contactLinks(d)}</footer></div>` });
}

// ---------------------------------------------------------------- 4. Motion (animated gradient, typed role, reveal, marquee)
function motion(d, L, lang) {
  return doc({ lang, title: `${d.name} – Motion`, fonts: 'family=Be+Vietnam+Pro:wght@400;700;900',
    css: `body{font-family:'Be Vietnam Pro',sans-serif;background:#07070c;color:#f1f5f9;overflow-x:hidden}
.hero{min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:0 7vw;position:relative;overflow:hidden}
.blob{position:absolute;width:60vw;height:60vw;border-radius:50%;filter:blur(80px);opacity:.55;animation:float 14s ease-in-out infinite alternate}
.b1{background:${d.c};top:-20vw;left:-10vw}.b2{background:#a855f7;bottom:-25vw;right:-15vw;animation-delay:-5s}.b3{background:#06b6d4;top:30%;left:40%;width:30vw;height:30vw;animation-duration:9s}
@keyframes float{to{transform:translate(8vw,6vw) scale(1.15)}}
.hero>*:not(.blob):not(.scroll){position:relative}.hero h1{font-size:clamp(48px,10vw,140px);font-weight:900;margin:0;line-height:.9;letter-spacing:-.04em}
.hero h1 span{display:inline-block;opacity:0;transform:translateY(60px) rotate(8deg);animation:up .9s cubic-bezier(.2,.8,.2,1) forwards}@keyframes up{to{opacity:1;transform:none}}
.typed{font-size:clamp(20px,3vw,34px);margin-top:20px;color:#cbd5e1}.typed b{color:#fff;border-right:3px solid ${d.c};padding-right:4px;animation:blink 1s steps(1) infinite}@keyframes blink{50%{border-color:transparent}}
.scroll{position:absolute;bottom:32px;left:7vw;font-size:12px;letter-spacing:3px;text-transform:uppercase;opacity:.7}.scroll::after{content:'';display:block;width:2px;height:40px;background:#fff;margin-top:8px;animation:sc 1.6s infinite}@keyframes sc{0%{transform:scaleY(0);transform-origin:top}50%{transform:scaleY(1);transform-origin:top}51%{transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}
.rv{opacity:0;transform:translateY(50px);transition:opacity .9s,transform .9s cubic-bezier(.2,.8,.2,1)}.rv.in{opacity:1;transform:none}
section{padding:110px 7vw}h2{font-size:clamp(36px,6vw,80px);margin:0 0 50px;font-weight:900}
.proj{display:grid;grid-template-columns:1.3fr 1fr;gap:40px;align-items:center;margin-bottom:110px}.proj:nth-child(even){direction:rtl}.proj:nth-child(even)>*{direction:ltr}
.proj .im{overflow:hidden;border-radius:24px}.proj img{width:100%;aspect-ratio:16/10;object-fit:cover;transition:transform 1.2s}.proj:hover img{transform:scale(1.07)}
.proj small{color:${d.c};letter-spacing:2px;text-transform:uppercase;font-weight:700}.proj h3{font-size:40px;margin:8px 0}.proj a{color:#fff;font-weight:700}
.marq{white-space:nowrap;overflow:hidden;font-size:clamp(40px,8vw,110px);font-weight:900;padding:30px 0;-webkit-text-stroke:2px #f1f5f9;color:transparent}.marq div{display:inline-block;animation:m 25s linear infinite}@keyframes m{to{transform:translateX(-50%)}}
footer{padding:120px 7vw;text-align:center}footer a{display:inline-block;margin:10px 16px;font-size:20px}
@media(max-width:760px){.proj,.proj:nth-child(even){grid-template-columns:1fr;direction:ltr}}`,
    body: `<div class="hero"><div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div>
<h1>${String(d.name).split(' ').map((w, i) => `<span class="anim" style="animation-delay:${i * 0.12}s">${w}</span>`).join(' ')}</h1>
<div class="typed">— <b id="ty"></b></div><div class="scroll">Scroll</div></div>
<section><p class="rv" style="font-size:clamp(22px,3vw,38px);max-width:900px;line-height:1.35">${d.bio}</p></section>
<section><h2 class="rv">${L.work}</h2>${d.projects.map((p) => `<div class="proj rv"><div class="im"><img src="${p.img}" alt="${p.title}"></div><div><small>${p.cat} · ${p.year}</small><h3>${p.title}</h3><p>${p.desc}</p>${projLink(p, L)}</div></div>`).join('')}</section>
<div class="marq"><div>${(d.skills.join(' • ') + ' • ').repeat(6)}</div></div>
<footer><h2 class="rv">${L.hire}</h2>${contactLinks(d)}</footer>`,
    script: `${REVEAL_JS}const roles=${JSON.stringify([d.role, ...d.skills.slice(0, 3)]).replace(/</g, '\\u003c')};let r=0,c=0,del=false;const el=document.getElementById('ty');(function t(){const w=roles[r]||'';el.innerHTML=w.slice(0,c);if(!del&&c<w.length)c++;else if(del&&c>0)c--;else{del=!del;if(!del)r=(r+1)%roles.length}setTimeout(t,del?40:(c===w.length?1400:80))})();` });
}

// ---------------------------------------------------------------- 5. 3D (rotating CSS cube, mouse-tilt cards, parallax depth)
function threeD(d, L, lang) {
  const faces = d.projects.slice(0, 6);
  while (faces.length < 6 && d.projects.length) faces.push(d.projects[faces.length % d.projects.length]);
  return doc({ lang, title: `${d.name} – 3D Portfolio`, fonts: 'family=Space+Grotesk:wght@400;700',
    css: `body{font-family:'Space Grotesk',sans-serif;background:radial-gradient(ellipse at top,#1e1b4b,#030014 70%);color:#e0e7ff;min-height:100vh}
.hero{display:grid;grid-template-columns:1fr 1fr;align-items:center;min-height:100vh;padding:0 6vw;gap:40px;perspective:1200px}
.hero h1{font-size:clamp(44px,7vw,100px);margin:0;line-height:.95;background:linear-gradient(90deg,#fff,${d.c},#a78bfa);-webkit-background-clip:text;background-clip:text;color:transparent}
.scene{width:300px;height:300px;margin:auto;perspective:900px}.cube{width:100%;height:100%;position:relative;transform-style:preserve-3d;animation:spin 18s linear infinite}
.cube div{position:absolute;inset:0;background-size:cover;background-position:center;border:2px solid ${d.c};box-shadow:0 0 40px ${d.c}66 inset;opacity:.95}
.f1{transform:rotateY(0) translateZ(150px)}.f2{transform:rotateY(90deg) translateZ(150px)}.f3{transform:rotateY(180deg) translateZ(150px)}.f4{transform:rotateY(-90deg) translateZ(150px)}.f5{transform:rotateX(90deg) translateZ(150px)}.f6{transform:rotateX(-90deg) translateZ(150px)}
@keyframes spin{to{transform:rotateX(360deg) rotateY(720deg)}}
.floor{position:fixed;left:0;right:0;bottom:0;height:45vh;background-image:linear-gradient(${d.c}55 1px,transparent 1px),linear-gradient(90deg,${d.c}55 1px,transparent 1px);background-size:60px 60px;transform:perspective(500px) rotateX(70deg);transform-origin:bottom;z-index:-1;mask-image:linear-gradient(transparent,#000)}
section{padding:100px 6vw}h2{font-size:56px;margin:0 0 40px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:36px}
.tilt{transform-style:preserve-3d;transition:transform .15s ease-out;border-radius:22px;background:#ffffff0d;border:1px solid #ffffff22;backdrop-filter:blur(6px)}
.tilt img{border-radius:22px 22px 0 0;aspect-ratio:4/3;object-fit:cover;width:100%;transform:translateZ(40px)}.tilt .in{padding:20px;transform:translateZ(60px)}.tilt h3{margin:4px 0;font-size:24px}.tilt small{color:${d.c}}
.chips{display:flex;flex-wrap:wrap;gap:12px}.chips span{padding:10px 18px;border-radius:12px;background:linear-gradient(145deg,#ffffff1a,#ffffff05);border:1px solid #ffffff22;transform:perspective(400px) rotateX(18deg);box-shadow:0 12px 20px -10px ${d.c}}
footer{text-align:center;padding:100px 6vw 160px}footer a{margin:0 14px;font-size:20px;color:#c7d2fe}@media(max-width:760px){.hero{grid-template-columns:1fr;padding-top:60px}}`,
    body: `<div class="floor"></div><div class="hero"><div><small style="letter-spacing:3px;text-transform:uppercase">${d.role}</small><h1>${d.name}</h1><p style="font-size:19px;max-width:520px">${d.bio}</p></div>
<div class="scene"><div class="cube">${faces.map((p, i) => `<div class="f${i + 1}" style="background-image:url(&quot;${p.img}&quot;)"></div>`).join('')}</div></div></div>
<section><h2>${L.work}</h2><div class="grid">${d.projects.map((p) => `<article class="tilt"><img src="${p.img}" alt="${p.title}"><div class="in"><small>${p.cat} · ${p.year}</small><h3>${p.title}</h3><p>${p.desc}</p>${projLink(p, L)}</div></article>`).join('')}</div></section>
<section><h2>${L.skills}</h2><div class="chips">${d.skills.map((s) => `<span>${s}</span>`).join('')}</div></section>
<footer><h2>${L.hire}</h2>${contactLinks(d)}</footer>`,
    script: `document.querySelectorAll('.tilt').forEach(c=>{c.addEventListener('mousemove',ev=>{const r=c.getBoundingClientRect(),x=(ev.clientX-r.left)/r.width-.5,y=(ev.clientY-r.top)/r.height-.5;c.style.transform='perspective(900px) rotateY('+x*18+'deg) rotateX('+(-y*18)+'deg) scale(1.03)'});c.addEventListener('mouseleave',()=>c.style.transform='')});` });
}

// ---------------------------------------------------------------- 6. Developer terminal
function developer(d, L, lang) {
  return doc({ lang, title: `${d.name} – Developer`, fonts: 'family=JetBrains+Mono:wght@400;700&family=Be+Vietnam+Pro:wght@400;700',
    css: `body{font-family:'Be Vietnam Pro',sans-serif;background:#0d1117;color:#c9d1d9}.mono{font-family:'JetBrains Mono',monospace}.w{max-width:1000px;margin:auto;padding:0 24px}
.term{margin:80px auto 40px;border-radius:12px;background:#161b22;border:1px solid #30363d;box-shadow:0 30px 60px -20px #000}.bar{padding:12px;display:flex;gap:8px}.bar i{width:12px;height:12px;border-radius:50%;background:#ff5f56}.bar i:nth-child(2){background:#ffbd2e}.bar i:nth-child(3){background:#27c93f}
.term pre{margin:0;padding:10px 24px 28px;font-family:'JetBrains Mono',monospace;font-size:15px;white-space:pre-wrap;min-height:220px}.g{color:${d.c}}.cur{display:inline-block;width:9px;height:18px;background:#c9d1d9;vertical-align:-3px;animation:b 1s steps(1) infinite}@keyframes b{50%{opacity:0}}
h2{font-family:'JetBrains Mono',monospace;color:${d.c};font-size:22px}h2::before{content:'~/ '}
.repo{border:1px solid #30363d;border-radius:10px;padding:0;margin-bottom:18px;display:grid;grid-template-columns:220px 1fr;overflow:hidden;transition:border-color .2s}.repo:hover{border-color:${d.c}}.repo img{height:100%;object-fit:cover}.repo div{padding:18px}.repo h3{margin:0;color:#58a6ff;font-family:'JetBrains Mono',monospace}
.lang{font-size:13px;color:#8b949e}.lang::before{content:'';display:inline-block;width:10px;height:10px;border-radius:50%;background:${d.c};margin-right:6px}
.sk{display:flex;flex-wrap:wrap;gap:8px}.sk span{font-family:'JetBrains Mono',monospace;font-size:13px;border:1px solid #30363d;padding:4px 10px;border-radius:999px}
footer{padding:60px 0 100px}footer a{color:#58a6ff;margin-right:18px;font-family:'JetBrains Mono',monospace}@media(max-width:640px){.repo{grid-template-columns:1fr}}`,
    body: `<div class="w"><div class="term"><div class="bar"><i></i><i></i><i></i></div><pre id="t"></pre></div>
<h2>projects</h2>${d.projects.map((p) => `<div class="repo"><img src="${p.img}" alt=""><div><h3>${p.title}</h3><p>${p.desc}</p><span class="lang">${p.cat}</span> <span class="lang" style="margin-left:12px">${p.year}</span><br>${projLink(p, L)}</div></div>`).join('')}
<h2>stack</h2><div class="sk">${d.skills.map((s) => `<span>${s}</span>`).join('')}</div>
<footer><h2>contact</h2>${contactLinks(d)}</footer></div>`,
    script: `const L=${JSON.stringify([`$ whoami`, `${d.name} — ${d.role}`, `$ cat about.txt`, d.bio, `$ ls skills/`, d.skills.join('  ')]).replace(/</g, '\\u003c')};const t=document.getElementById('t');let i=0,j=0,out='';(function s(){if(i>=L.length){t.innerHTML=out+'<span class="cur"></span>';return}const line=L[i];if(j<=line.length){const cur=line.slice(0,j);t.innerHTML=out+(line.startsWith('$')?'<span class="g">'+cur+'</span>':cur)+'<span class="cur"></span>';j++;setTimeout(s,line.startsWith('$')?55:12)}else{out+=(line.startsWith('$')?'<span class="g">'+line+'</span>':line)+'\\n';i++;j=0;setTimeout(s,300)}})();` });
}

// ---------------------------------------------------------------- 7. Photography (full-bleed, lightbox)
function photography(d, L, lang) {
  return doc({ lang, title: `${d.name} – Photography`, fonts: 'family=Lora:ital@0;1&family=Be+Vietnam+Pro:wght@300;600',
    css: `body{font-family:'Be Vietnam Pro',sans-serif;font-weight:300;background:#fff;color:#111}
header{position:fixed;inset:0 0 auto 0;display:flex;justify-content:space-between;padding:22px 4vw;mix-blend-mode:difference;color:#fff;z-index:5;letter-spacing:3px;text-transform:uppercase;font-size:12px;font-weight:600}
.hero{height:100vh;background-size:cover;background-position:center;display:flex;align-items:flex-end;padding:6vw;color:#fff;position:relative}.hero::after{content:'';position:absolute;inset:0;background:linear-gradient(transparent 40%,#0009)}
.hero div{position:relative;z-index:1}.hero h1{font-family:Lora;font-style:italic;font-weight:400;font-size:clamp(48px,8vw,120px);margin:0}
.gal{display:grid;grid-template-columns:repeat(12,1fr);gap:8px;padding:8px}.gal figure{margin:0;position:relative;overflow:hidden;cursor:zoom-in}.gal img{width:100%;height:100%;object-fit:cover;transition:transform 1s}.gal figure:hover img{transform:scale(1.05)}
.gal figure:nth-child(4n+1){grid-column:span 7;aspect-ratio:4/3}.gal figure:nth-child(4n+2){grid-column:span 5;aspect-ratio:4/5}.gal figure:nth-child(4n+3){grid-column:span 5;aspect-ratio:4/5}.gal figure:nth-child(4n){grid-column:span 7;aspect-ratio:4/3}
figcaption{position:absolute;left:16px;bottom:14px;color:#fff;font-size:13px;letter-spacing:1px;text-shadow:0 1px 6px #000}
.about{max-width:700px;margin:auto;padding:120px 24px;text-align:center}.about p{font-family:Lora;font-size:24px;font-style:italic;line-height:1.6}
.lb{position:fixed;inset:0;background:#000e;display:none;align-items:center;justify-content:center;z-index:9;cursor:zoom-out}.lb.on{display:flex}.lb img{max-height:90vh;max-width:92vw}
footer{text-align:center;padding:60px 0 90px;letter-spacing:2px}footer a{margin:0 12px}@media(max-width:700px){.gal figure{grid-column:span 12!important}}`,
    body: `<header><span>${d.name}</span><span>${d.role}</span></header>
<div class="hero" style="background-image:url(&quot;${d.projects[0] ? d.projects[0].img : ''}&quot;)"><div><h1>${d.name}</h1><div style="letter-spacing:4px;text-transform:uppercase">${d.loc}</div></div></div>
<div class="gal">${d.projects.map((p) => `<figure><img src="${p.img}" alt="${p.title}" loading="lazy"><figcaption>${p.title}${p.year ? ` — ${p.year}` : ''}</figcaption></figure>`).join('')}</div>
<div class="about"><p>${d.bio}</p><div style="letter-spacing:2px;font-size:13px">${d.skills.join(' · ')}</div></div>
<footer>${contactLinks(d)}</footer><div class="lb" id="lb"><img alt=""></div>`,
    script: `const lb=document.getElementById('lb');document.querySelectorAll('.gal img').forEach(i=>i.onclick=()=>{lb.firstChild.src=i.src;lb.classList.add('on')});lb.onclick=()=>lb.classList.remove('on');` });
}

// ---------------------------------------------------------------- 8. Editorial / architecture (serif, numbered case studies)
function editorial(d, L, lang) {
  return doc({ lang, title: `${d.name} – Selected Works`, fonts: 'family=Lora:ital,wght@0,400;0,700;1,400&family=Be+Vietnam+Pro:wght@400;600',
    css: `body{font-family:'Be Vietnam Pro',sans-serif;background:#f4f1ea;color:#1a1a1a}.w{max-width:1200px;margin:auto;padding:0 32px}
header{display:flex;justify-content:space-between;padding:28px 0;border-bottom:1px solid #1a1a1a;font-size:13px;letter-spacing:2px;text-transform:uppercase}
.hero{padding:100px 0 60px;display:grid;grid-template-columns:2fr 1fr;gap:60px;align-items:end}.hero h1{font-family:Lora;font-weight:400;font-size:clamp(48px,7vw,104px);line-height:1;margin:0}.hero h1 i{color:${d.c}}
.case{display:grid;grid-template-columns:80px 1fr 1.4fr;gap:40px;padding:60px 0;border-top:1px solid #1a1a1a;align-items:start}.num{font-family:Lora;font-size:48px;color:${d.c}}.case h3{font-family:Lora;font-size:36px;font-weight:400;margin:0 0 10px}
.meta{font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#666;margin-bottom:16px}.case img{width:100%;aspect-ratio:3/2;object-fit:cover;filter:grayscale(.3);transition:filter .5s}.case:hover img{filter:none}
.rv{opacity:0;transform:translateY(30px);transition:1s}.rv.in{opacity:1;transform:none}
.sk{columns:3;font-family:Lora;font-size:20px;padding:40px 0}footer{border-top:1px solid #1a1a1a;padding:60px 0 100px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:20px}footer h2{font-family:Lora;font-weight:400;font-size:48px;margin:0}footer a{display:block;font-size:18px}
@media(max-width:800px){.hero,.case{grid-template-columns:1fr}.sk{columns:1}}`,
    body: `<div class="w"><header><span>${d.name}</span><span>${d.role}</span><span>${d.loc}</span></header>
<div class="hero"><h1>${L.work} <i>${new Date().getFullYear()}</i></h1><p>${d.bio}</p></div>
${d.projects.map((p, i) => `<article class="case rv"><div class="num">${String(i + 1).padStart(2, '0')}</div><div><h3>${p.title}</h3><div class="meta">${p.cat} · ${p.year}</div><p>${p.desc}</p>${projLink(p, L)}</div><img src="${p.img}" alt="${p.title}"></article>`).join('')}
<div class="sk">${d.skills.map((s) => `<div>${s}</div>`).join('')}</div>
<footer><h2>${L.hire}</h2><div>${contactLinks(d)}</div></footer></div>`, script: REVEAL_JS });
}

// ---------------------------------------------------------------- Vector icons (Lucide paths, ISC licence © Lucide Contributors)
const IC = {
  pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  layers: '<path d="m12 2 10 5-10 5L2 7Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>',
  play: '<polygon points="6 3 20 12 6 21 6 3"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  idea: '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z"/>',
  grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  cube: '<path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.7Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  ruler: '<path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2L5.8 21 7 14.2 2 9.3l6.9-1Z"/>'
};
const svg = (n, s = 22, extra = '') => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;${extra}">${IC[n]}</svg>`;

// ---------------------------------------------------------------- 9. Illustrator – SVG doodles that draw themselves
function illustrator(d, L, lang) {
  const doodles = `<svg class="dd" viewBox="0 0 1200 420" preserveAspectRatio="xMidYMid slice"><g fill="none" stroke="#1c1917" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <path class="ln" d="M80 330c40-80 120-120 190-90s90 100 160 90 80-110 160-120 130 60 200 40 90-90 170-80 120 60 160 30"/>
    <path class="ln" style="--c:${d.c}" stroke="var(--c)" d="M960 120c20-30 60-30 70 0s-30 60-70 40-20-80 30-90 90 40 70 90"/>
    <path class="ln" d="M150 120l20 40 44 6-32 30 8 44-40-22-40 22 8-44-32-30 44-6z"/>
    <circle class="ln" cx="620" cy="110" r="46"/><path class="ln" d="M600 100h1M640 100h1M600 130c12 12 28 12 40 0"/>
    <path class="ln" style="--c:${d.c}" stroke="var(--c)" d="M330 90c30-20 60 0 50 30s-60 30-70 0 40-60 90-40"/></g></svg>`;
  return doc({ lang, title: `${d.name} – Illustration`, fonts: 'family=Patrick+Hand&family=Be+Vietnam+Pro:wght@400;700;900',
    css: `body{font-family:'Be Vietnam Pro',sans-serif;background:#fffaf0;color:#1c1917}.hero{position:relative;height:92vh;min-height:520px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;overflow:hidden}
.dd{position:absolute;inset:0;width:100%;height:100%;opacity:.9}.ln{stroke-dasharray:1400;stroke-dashoffset:1400;animation:draw 3.2s ease forwards}.ln:nth-child(2){animation-delay:.6s}.ln:nth-child(3){animation-delay:1.1s}.ln:nth-child(4),.ln:nth-child(5){animation-delay:1.5s}.ln:nth-child(6){animation-delay:1.9s}@keyframes draw{to{stroke-dashoffset:0}}
.hero h1{position:relative;font-family:'Patrick Hand';font-size:clamp(56px,10vw,130px);margin:0;line-height:1}.hero p{position:relative;font-size:20px;max-width:640px;background:#fffaf0e6;padding:10px 18px;border-radius:14px}
.badge{position:relative;display:inline-flex;align-items:center;gap:8px;background:${d.c};color:#fff;padding:8px 18px;border-radius:999px;font-weight:700;transform:rotate(-3deg)}
.w{max-width:1150px;margin:auto;padding:40px 24px}h2{font-family:'Patrick Hand';font-size:52px;margin:30px 0 10px;display:flex;align-items:center;gap:12px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:34px}.card{position:relative}.card .img{border:3px solid #1c1917;border-radius:18px 4px 18px 4px;overflow:hidden;box-shadow:8px 8px 0 ${d.c};transition:transform .3s}.card:hover .img{transform:translate(-4px,-4px) rotate(-1deg)}
.card img{aspect-ratio:1;object-fit:cover;width:100%}.card h3{font-family:'Patrick Hand';font-size:30px;margin:14px 0 0}.card small{color:${d.c};font-weight:700}
.tools{display:flex;flex-wrap:wrap;gap:16px}.tools span{display:flex;align-items:center;gap:8px;border:2px dashed #1c1917;border-radius:14px;padding:10px 16px;font-family:'Patrick Hand';font-size:22px}
footer{text-align:center;padding:70px 20px 100px}footer a{font-family:'Patrick Hand';font-size:26px;margin:0 12px}`,
    body: `<div class="hero">${doodles}<span class="badge">${svg('pen', 18)} ${d.role}</span><h1>${d.name}</h1><p>${d.bio}</p></div>
<div class="w"><h2>${svg('star', 34)} ${L.work}</h2><div class="grid">${d.projects.map((p) => `<div class="card"><div class="img"><img src="${p.img}" alt="${p.title}"></div><h3>${p.title}</h3><small>${p.cat} · ${p.year}</small><p>${p.desc}</p>${projLink(p, L)}</div>`).join('')}</div>
<h2>${svg('pen', 34)} ${L.skills}</h2><div class="tools">${d.skills.map((s) => `<span>${svg('check', 18)} ${s}</span>`).join('')}</div></div>
<footer><h2 style="justify-content:center">${L.hire}</h2>${contactLinks(d)}</footer>` });
}

// ---------------------------------------------------------------- 10. Parallax layers – 5 vector layers move with mouse and scroll
function parallax(d, L, lang) {
  const layer = (depth, inner) => `<svg class="ly" data-depth="${depth}" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMax slice">${inner}</svg>`;
  const scene = [
    layer(0.05, `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f172a"/><stop offset="1" stop-color="${d.c}"/></linearGradient></defs><rect width="1440" height="800" fill="url(#sky)"/><circle cx="1050" cy="300" r="120" fill="#fde68a" opacity=".9"/>`),
    layer(0.15, `<path d="M0 520 L220 330 L380 470 L560 260 L760 480 L940 300 L1120 470 L1300 340 L1440 430 V800 H0Z" fill="#1e293b" opacity=".85"/>`),
    layer(0.3, `<path d="M0 600 L180 470 L330 560 L520 420 L700 580 L880 450 L1080 590 L1260 480 L1440 560 V800 H0Z" fill="#334155"/>`),
    layer(0.5, `<g fill="#fff" opacity=".75"><ellipse cx="300" cy="230" rx="90" ry="22"/><ellipse cx="360" cy="215" rx="60" ry="20"/><ellipse cx="1250" cy="170" rx="80" ry="18"/></g>`),
    layer(0.8, `<path d="M0 690 Q360 610 720 690 T1440 680 V800 H0Z" fill="#0b1120"/>`)
  ].join('');
  return doc({ lang, title: `${d.name} – Portfolio`, fonts: 'family=Be+Vietnam+Pro:wght@400;700;900',
    css: `body{font-family:'Be Vietnam Pro',sans-serif;background:#0b1120;color:#e2e8f0}.scene{position:relative;height:100vh;overflow:hidden}.ly{position:absolute;inset:-4%;width:108%;height:108%;will-change:transform;transition:transform .2s ease-out}
.title{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:0 7vw;z-index:2}.title h1{font-size:clamp(48px,9vw,128px);font-weight:900;margin:0;line-height:.95;text-shadow:0 10px 40px #0008}.title p{max-width:560px;font-size:19px}
.chip{display:inline-flex;align-items:center;gap:8px;background:#ffffff1a;backdrop-filter:blur(6px);border:1px solid #ffffff33;padding:6px 14px;border-radius:999px;width:max-content}
section{padding:100px 7vw}h2{font-size:48px;margin:0 0 40px;display:flex;align-items:center;gap:14px}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:30px}
.card{border-radius:20px;overflow:hidden;background:#111827;border:1px solid #1f2937;transform:translateY(40px);opacity:0;transition:.8s}.card.in{transform:none;opacity:1}.card img{aspect-ratio:16/10;object-fit:cover;width:100%}.card div{padding:20px}.card small{color:${d.c};font-weight:700}
.sk{display:flex;flex-wrap:wrap;gap:12px}.sk span{display:flex;align-items:center;gap:8px;background:#111827;border:1px solid #1f2937;padding:10px 16px;border-radius:12px}
footer{text-align:center;padding:100px 7vw}footer a{margin:0 14px;font-size:20px}@media (prefers-reduced-motion:reduce){.card{opacity:1;transform:none}}`,
    body: `<div class="scene" id="sc">${scene}<div class="title"><span class="chip">${svg('layers', 16)} ${d.role}</span><h1>${d.name}</h1><p>${d.bio}</p></div></div>
<section><h2>${svg('grid', 34)} ${L.work}</h2><div class="grid">${d.projects.map((p) => `<article class="card rv"><img src="${p.img}" alt="${p.title}"><div><small>${p.cat} · ${p.year}</small><h3>${p.title}</h3><p>${p.desc}</p>${projLink(p, L)}</div></article>`).join('')}</div></section>
<section><h2>${svg('star', 34)} ${L.skills}</h2><div class="sk">${d.skills.map((s) => `<span>${svg('check', 16)} ${s}</span>`).join('')}</div></section>
<footer><h2 style="justify-content:center">${L.hire}</h2>${contactLinks(d)}</footer>`,
    script: `const ls=[...document.querySelectorAll('.ly')];let mx=0,my=0,sy=0;const up=()=>ls.forEach(l=>{const k=+l.dataset.depth;l.style.transform='translate3d('+(mx*k*40)+'px,'+(my*k*30+sy*k)+'px,0)'});addEventListener('mousemove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5;up()});addEventListener('scroll',()=>{sy=scrollY*.6;up()},{passive:true});document.querySelectorAll('.card').forEach(c=>c.classList.add('rv'));${REVEAL_JS.replace(/\.rv/g, '.card')}` });
}

// ---------------------------------------------------------------- 11. UI/UX case study – CSS device mockups, process icons
function uiux(d, L, lang) {
  const steps = [['search', lang === 'vi' ? 'Nghiên cứu' : 'Research'], ['idea', lang === 'vi' ? 'Ý tưởng' : 'Ideate'], ['grid', 'Wireframe'], ['layers', 'Prototype'], ['check', 'Test']];
  const phone = (img) => `<div class="phone"><div class="notch"></div><img src="${img}" alt=""></div>`;
  return doc({ lang, title: `${d.name} – Product Design`, fonts: 'family=Be+Vietnam+Pro:wght@400;600;800',
    css: `body{font-family:'Be Vietnam Pro',sans-serif;background:#f8fafc;color:#0f172a}.w{max-width:1150px;margin:auto;padding:0 24px}
.hero{display:grid;grid-template-columns:1.1fr 1fr;gap:40px;align-items:center;padding:90px 0}.hero h1{font-size:clamp(40px,6vw,72px);line-height:1.05;margin:0}.hero h1 em{font-style:normal;color:${d.c}}
.devices{position:relative;height:460px}.laptop{position:absolute;left:0;top:40px;width:86%;}.laptop .scr{border:12px solid #0f172a;border-bottom-width:16px;border-radius:14px 14px 0 0;overflow:hidden;aspect-ratio:16/10;background:#fff}.laptop .scr img{width:100%;height:100%;object-fit:cover}.laptop .base{height:14px;background:linear-gradient(#cbd5e1,#94a3b8);border-radius:0 0 16px 16px;margin:0 -6%}
.phone{position:absolute;right:0;bottom:0;width:200px;aspect-ratio:9/19;border:10px solid #0f172a;border-radius:34px;overflow:hidden;background:#fff;box-shadow:0 30px 60px -20px #0f172a80;animation:bob 5s ease-in-out infinite}.phone img{width:100%;height:100%;object-fit:cover}.notch{position:absolute;top:0;left:50%;width:70px;height:18px;background:#0f172a;border-radius:0 0 12px 12px;transform:translateX(-50%);z-index:1}@keyframes bob{50%{transform:translateY(-14px)}}
.process{display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin:20px 0 80px}.process div{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:18px;text-align:center;font-weight:700}.process svg{color:${d.c};margin-bottom:8px}
.case{display:grid;grid-template-columns:1fr 1fr;gap:50px;align-items:center;margin-bottom:100px}.case:nth-child(even) .txt{order:2}.case .shot{background:linear-gradient(135deg,${d.c}22,#fff);border-radius:28px;padding:30px;position:relative;height:420px}.case .shot .phone{right:50%;transform:translateX(50%);bottom:30px;animation:none}
.case small{color:${d.c};font-weight:800;letter-spacing:1px;text-transform:uppercase}.case h3{font-size:34px;margin:8px 0}.metric{display:inline-flex;gap:8px;align-items:center;background:#ecfdf5;color:#047857;font-weight:800;padding:6px 12px;border-radius:10px;margin-top:6px}
h2{font-size:36px}.sk{display:flex;flex-wrap:wrap;gap:10px}.sk span{background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:8px 14px;font-weight:600}
footer{background:#0f172a;color:#fff;text-align:center;padding:80px 20px;margin-top:80px}footer a{color:#cbd5e1;margin:0 12px}@media(max-width:800px){.hero,.case{grid-template-columns:1fr}.process{grid-template-columns:repeat(2,1fr)}.case:nth-child(even) .txt{order:0}}`,
    body: `<div class="w"><div class="hero"><div><small style="color:${d.c};font-weight:800">${d.role}</small><h1>${d.name.split(' ').slice(0, -1).join(' ')} <em>${d.first}</em></h1><p style="font-size:19px;color:#475569">${d.bio}</p></div>
<div class="devices"><div class="laptop"><div class="scr"><img src="${d.projects[0]?.img || ''}" alt=""></div><div class="base"></div></div>${phone(d.projects[1]?.img || d.projects[0]?.img || '')}</div></div>
<h2>${lang === 'vi' ? 'Quy trình' : 'Process'}</h2><div class="process">${steps.map(([i, t]) => `<div>${svg(i, 28)}<br>${t}</div>`).join('')}</div>
<h2>${L.work}</h2>${d.projects.map((p) => `<div class="case"><div class="txt"><small>${p.cat} · ${p.year}</small><h3>${p.title}</h3><p style="color:#475569">${p.desc}</p>${projLink(p, L)}</div><div class="shot">${phone(p.img)}</div></div>`).join('')}
<h2>${L.skills}</h2><div class="sk">${d.skills.map((s) => `<span>${s}</span>`).join('')}</div></div>
<footer><h2>${L.hire}</h2>${contactLinks(d)}</footer>` });
}

// ---------------------------------------------------------------- 12. Fashion lookbook – horizontal scroll, big serif
function fashion(d, L, lang) {
  return doc({ lang, title: `${d.name} – Lookbook`, fonts: 'family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Be+Vietnam+Pro:wght@300;600',
    css: `body{font-family:'Be Vietnam Pro',sans-serif;font-weight:300;background:#f3efe9;color:#111}
header{display:flex;justify-content:space-between;padding:24px 4vw;font-size:12px;letter-spacing:4px;text-transform:uppercase;font-weight:600}
.hero{display:grid;grid-template-columns:1fr 1fr;min-height:86vh;align-items:center;padding:0 4vw;gap:4vw}.hero h1{font-family:'Playfair Display';font-size:clamp(56px,9vw,140px);line-height:.9;margin:0;font-weight:400}.hero h1 i{color:${d.c}}
.hero .img{height:76vh;background-size:cover;background-position:center;clip-path:inset(0 0 0 0 round 200px 200px 0 0);animation:rise 1.4s cubic-bezier(.2,.8,.2,1)}@keyframes rise{from{clip-path:inset(100% 0 0 0 round 200px 200px 0 0)}}
.strip{display:flex;gap:24px;overflow-x:auto;scroll-snap-type:x mandatory;padding:40px 4vw 60px}.strip::-webkit-scrollbar{height:4px}.strip::-webkit-scrollbar-thumb{background:#111}
.look{flex:0 0 min(78vw,380px);scroll-snap-align:start}.look img{aspect-ratio:3/4;object-fit:cover;width:100%;filter:grayscale(.15)}.look .n{font-family:'Playfair Display';font-style:italic;font-size:44px;color:${d.c}}.look h3{font-family:'Playfair Display';font-weight:400;font-size:28px;margin:0}
.hint{padding:0 4vw;font-size:12px;letter-spacing:3px;text-transform:uppercase;display:flex;align-items:center;gap:10px}.hint::after{content:'';width:80px;height:1px;background:#111;animation:sl 1.6s infinite}@keyframes sl{50%{transform:translateX(20px)}}
.about{max-width:760px;margin:60px auto;text-align:center;font-family:'Playfair Display';font-size:28px;font-style:italic;padding:0 24px}
footer{border-top:1px solid #111;margin:0 4vw;padding:50px 0 80px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:20px}footer h2{font-family:'Playfair Display';font-weight:400;font-size:56px;margin:0}footer a{display:block;letter-spacing:2px;text-transform:uppercase;font-size:13px}@media(max-width:800px){.hero{grid-template-columns:1fr}}`,
    body: `<header><span>${d.name}</span><span>${d.role}</span></header>
<div class="hero"><h1>${d.name.split(' ').slice(0, -1).join(' ')}<br><i>${d.first}</i></h1><div class="img" style="background-image:url(&quot;${d.avatar || d.projects[0]?.img || ''}&quot;)"></div></div>
<div class="hint">${L.work} — scroll</div>
<div class="strip">${d.projects.map((p, i) => `<div class="look"><img src="${p.img}" alt="${p.title}"><div class="n">${String(i + 1).padStart(2, '0')}</div><h3>${p.title}</h3><div style="font-size:12px;letter-spacing:2px;text-transform:uppercase">${p.cat} · ${p.year}</div><p>${p.desc}</p></div>`).join('')}</div>
<p class="about">${d.bio}</p><p style="text-align:center;letter-spacing:3px;font-size:12px;text-transform:uppercase">${d.skills.join(' · ')}</p>
<footer><h2>${L.hire}</h2><div>${contactLinks(d)}</div></footer>` });
}

// ---------------------------------------------------------------- 13. Blueprint – architecture technical drawing
function blueprint(d, L, lang) {
  const dim = (w) => `<svg width="100%" height="18" viewBox="0 0 ${w} 18" preserveAspectRatio="none"><path d="M1 2v14M${w - 1} 2v14M1 9H${w - 1}" stroke="#bfdbfe" stroke-width="1.2"/><path d="M1 9l8-4v8zM${w - 1} 9l-8-4v8z" fill="#bfdbfe"/></svg>`;
  return doc({ lang, title: `${d.name} – Architecture`, fonts: 'family=JetBrains+Mono:wght@400;700&family=Be+Vietnam+Pro:wght@300;700',
    css: `body{font-family:'Be Vietnam Pro',sans-serif;font-weight:300;color:#e0f2fe;background:#0b3a6e;background-image:linear-gradient(#ffffff14 1px,transparent 1px),linear-gradient(90deg,#ffffff14 1px,transparent 1px),linear-gradient(#ffffff08 1px,transparent 1px),linear-gradient(90deg,#ffffff08 1px,transparent 1px);background-size:100px 100px,100px 100px,20px 20px,20px 20px}
.mono{font-family:'JetBrains Mono',monospace}.w{max-width:1150px;margin:auto;padding:0 28px}
.title{border:2px solid #bfdbfe;margin:60px 0;display:grid;grid-template-columns:2fr 1fr}.title>div{padding:28px;border-right:2px solid #bfdbfe}.title>div:last-child{border:0}.title h1{font-weight:700;font-size:clamp(36px,6vw,72px);margin:0;line-height:1}
.meta div{border-bottom:1px solid #bfdbfe66;padding:8px 0;font-size:13px}.meta b{display:block;font-size:10px;letter-spacing:2px;color:#93c5fd}
.sheet{display:grid;grid-template-columns:1.4fr 1fr;gap:30px;margin-bottom:60px;padding:24px;border:1px dashed #bfdbfe88;position:relative}.sheet::before{content:attr(data-n);position:absolute;top:-12px;left:20px;background:#0b3a6e;padding:0 10px;font-family:'JetBrains Mono';font-size:12px;color:#93c5fd}
.sheet img{width:100%;aspect-ratio:4/3;object-fit:cover;filter:grayscale(1) contrast(1.1) brightness(1.1);mix-blend-mode:screen;opacity:.9;border:1px solid #bfdbfe}.sheet h3{font-size:30px;font-weight:700;margin:6px 0}
.ic{display:inline-flex;align-items:center;gap:8px;color:#93c5fd;font-family:'JetBrains Mono';font-size:12px;letter-spacing:1px}
.sk{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));border-top:1px solid #bfdbfe;border-left:1px solid #bfdbfe}.sk span{border-right:1px solid #bfdbfe;border-bottom:1px solid #bfdbfe;padding:14px;font-family:'JetBrains Mono';font-size:13px}
footer{padding:60px 0 100px}footer a{font-family:'JetBrains Mono';margin-right:20px;color:#bfdbfe}@media(max-width:800px){.title,.sheet{grid-template-columns:1fr}}`,
    body: `<div class="w"><div class="title"><div><span class="ic">${svg('ruler', 16)} ${d.role}</span><h1>${d.name}</h1>${dim(600)}<p>${d.bio}</p></div>
<div class="meta mono"><div><b>LOCATION</b>${d.loc}</div><div><b>SHEETS</b>${d.projects.length}</div><div><b>SCALE</b>1:100</div><div><b>DATE</b>${new Date().getFullYear()}</div></div></div>
${d.projects.map((p, i) => `<div class="sheet" data-n="A-${String(i + 1).padStart(2, '0')}"><img src="${p.img}" alt="${p.title}"><div><span class="ic">${svg('cube', 16)} ${p.cat} · ${p.year}</span><h3>${p.title}</h3>${dim(300)}<p>${p.desc}</p>${projLink(p, L, 'mono')}</div></div>`).join('')}
<div class="sk">${d.skills.map((s) => `<span>+ ${s}</span>`).join('')}</div>
<footer><h2>${L.hire}</h2>${contactLinks(d)}</footer></div>` });
}

// ---------------------------------------------------------------- 14. Game / 3D artist – glitch title, 3D flip cards
function game(d, L, lang) {
  return doc({ lang, title: `${d.name} – 3D / Game Art`, fonts: 'family=Space+Grotesk:wght@400;700&family=Be+Vietnam+Pro:wght@900',
    css: `body{font-family:'Space Grotesk',sans-serif;background:#050508;color:#e5e7eb}
.hero{min-height:90vh;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;background:radial-gradient(circle at 50% 40%,${d.c}33,transparent 60%);position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(0deg,#ffffff06 0 2px,transparent 2px 4px);pointer-events:none}
.gl{position:relative;font-family:'Be Vietnam Pro';font-weight:900;font-size:clamp(52px,10vw,140px);text-transform:uppercase;margin:0;letter-spacing:-.02em}
.gl::before,.gl::after{content:attr(data-t);position:absolute;inset:0}.gl::before{color:#22d3ee;animation:g1 2.5s infinite steps(2);clip-path:inset(0 0 60% 0)}.gl::after{color:#f43f5e;animation:g2 2s infinite steps(2);clip-path:inset(55% 0 0 0)}
@keyframes g1{0%,90%{transform:none}92%{transform:translate(-6px,2px)}96%{transform:translate(5px,-2px)}}@keyframes g2{0%,88%{transform:none}91%{transform:translate(6px,1px)}95%{transform:translate(-4px,-1px)}}
.role{display:inline-flex;align-items:center;gap:8px;color:${d.c};letter-spacing:4px;text-transform:uppercase}
section{padding:90px 6vw}h2{font-size:44px;display:flex;align-items:center;gap:12px;margin:0 0 40px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:26px}.flip{perspective:1000px;aspect-ratio:3/4}.in{position:relative;width:100%;height:100%;transition:transform .8s;transform-style:preserve-3d}.flip:hover .in{transform:rotateY(180deg)}
.f,.b{position:absolute;inset:0;backface-visibility:hidden;border-radius:18px;overflow:hidden;border:1px solid #ffffff22}.f img{width:100%;height:100%;object-fit:cover}.f span{position:absolute;left:14px;bottom:14px;background:#000a;padding:6px 12px;border-radius:8px;font-weight:700}
.b{transform:rotateY(180deg);background:linear-gradient(160deg,#111827,${d.c}55);padding:24px;display:flex;flex-direction:column;justify-content:flex-end}.b h3{font-size:26px;margin:0}
.sk{display:flex;flex-wrap:wrap;gap:12px}.sk span{display:flex;gap:8px;align-items:center;border:1px solid ${d.c};color:#fff;padding:10px 16px;border-radius:4px;box-shadow:0 0 18px ${d.c}55 inset}
footer{text-align:center;padding:100px 6vw}footer a{margin:0 14px;font-size:20px;color:#a5f3fc}`,
    body: `<div class="hero"><span class="role">${svg('cube', 18)} ${d.role}</span><h1 class="gl" data-t="${d.name}">${d.name}</h1><p style="max-width:620px;font-size:18px">${d.bio}</p></div>
<section><h2>${svg('layers', 34)} ${L.work}</h2><div class="grid">${d.projects.map((p) => `<div class="flip"><div class="in"><div class="f"><img src="${p.img}" alt="${p.title}"><span>${p.title}</span></div><div class="b"><small style="color:#a5f3fc">${p.cat} · ${p.year}</small><h3>${p.title}</h3><p>${p.desc}</p>${projLink(p, L)}</div></div></div>`).join('')}</div></section>
<section><h2>${svg('star', 34)} ${L.skills}</h2><div class="sk">${d.skills.map((s) => `<span>${svg('check', 16)} ${s}</span>`).join('')}</div></section>
<footer><h2 style="justify-content:center">${L.hire}</h2>${contactLinks(d)}</footer>` });
}

// ---------------------------------------------------------------- 15. Video showreel – film strip, play buttons, REC overlay
function showreel(d, L, lang) {
  return doc({ lang, title: `${d.name} – Showreel`, fonts: 'family=Be+Vietnam+Pro:wght@400;700;900&family=JetBrains+Mono',
    css: `body{font-family:'Be Vietnam Pro',sans-serif;background:#000;color:#f5f5f5}
.reel{position:relative;height:100vh;overflow:hidden}.reel .bg{position:absolute;inset:0;background-size:cover;background-position:center;animation:kb 18s ease-in-out infinite alternate;filter:brightness(.55)}@keyframes kb{to{transform:scale(1.18) translate(-3%,-2%)}}
.hud{position:absolute;inset:24px;border:1px solid #ffffff44;font-family:'JetBrains Mono',monospace;font-size:13px}.rec{position:absolute;top:16px;left:18px;display:flex;align-items:center;gap:8px}.rec i{width:12px;height:12px;border-radius:50%;background:#ef4444;animation:bl 1s infinite}@keyframes bl{50%{opacity:0}}
.tc{position:absolute;top:16px;right:18px}.reel .t{position:absolute;left:7vw;bottom:14vh}.reel h1{font-size:clamp(48px,9vw,130px);font-weight:900;margin:0;line-height:.9}
.playbig{display:inline-flex;align-items:center;gap:12px;margin-top:20px;background:#fff;color:#000;padding:14px 24px;border-radius:999px;font-weight:700}
.film{display:flex;gap:0;background:#111;padding:26px 0;overflow:hidden;position:relative}.film::before,.film::after{content:'';position:absolute;left:0;right:0;height:14px;background:repeating-linear-gradient(90deg,#000 0 14px,transparent 14px 30px)}.film::before{top:6px}.film::after{bottom:6px}
.film .track{display:flex;gap:10px;animation:mv 40s linear infinite}.film img{height:150px;aspect-ratio:16/9;object-fit:cover}@keyframes mv{to{transform:translateX(-50%)}}
section{padding:90px 7vw}h2{font-size:44px;margin:0 0 30px}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:24px}
.clip{position:relative;border-radius:14px;overflow:hidden}.clip img{aspect-ratio:16/9;object-fit:cover;width:100%;transition:transform .6s}.clip:hover img{transform:scale(1.06)}
.clip .pl{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}.clip .pl span{width:64px;height:64px;border-radius:50%;background:#ffffffd9;color:#000;display:flex;align-items:center;justify-content:center;transition:transform .3s}.clip:hover .pl span{transform:scale(1.15)}
.clip .cap{position:absolute;left:0;right:0;bottom:0;padding:16px;background:linear-gradient(transparent,#000c)}.clip small{font-family:'JetBrains Mono';color:${d.c}}
footer{text-align:center;padding:90px 7vw}footer a{margin:0 14px;font-size:20px}`,
    body: `<div class="reel"><div class="bg" style="background-image:url(&quot;${d.projects[0]?.img || ''}&quot;)"></div><div class="hud"><span class="rec"><i></i>REC</span><span class="tc" id="tc">00:00:00:00</span></div>
<div class="t"><div style="letter-spacing:4px;text-transform:uppercase">${d.role}</div><h1>${d.name}</h1><span class="playbig">${svg('play', 18, 'fill:#000')} SHOWREEL ${new Date().getFullYear()}</span></div></div>
<div class="film"><div class="track">${[...d.projects, ...d.projects].map((p) => `<img src="${p.img}" alt="">`).join('')}</div></div>
<section><p style="font-size:24px;max-width:820px">${d.bio}</p></section>
<section><h2>${L.work}</h2><div class="grid">${d.projects.map((p) => `<div class="clip"><img src="${p.img}" alt="${p.title}"><div class="pl"><span>${svg('play', 24, 'fill:#000')}</span></div><div class="cap"><small>${p.cat} · ${p.year}</small><h3 style="margin:2px 0">${p.title}</h3>${p.desc}<br>${projLink(p, L)}</div></div>`).join('')}</div>
<p style="margin-top:40px;font-family:'JetBrains Mono';color:#a3a3a3">${d.skills.join(' / ')}</p></section>
<footer><h2>${L.hire}</h2>${contactLinks(d)}</footer>`,
    script: `const tc=document.getElementById('tc'),t0=Date.now();setInterval(()=>{const s=(Date.now()-t0)/1000,p=n=>String(Math.floor(n)).padStart(2,'0');tc.textContent=p(s/3600)+':'+p(s/60%60)+':'+p(s%60)+':'+p(s*24%24)},42);` });
}

// ---------------------------------------------------------------- 16. Collage – cut-out paper, stickers, tape, marker scribbles
function collage(d, L, lang) {
  const tilt = [-4, 3, -2, 5, -3, 2];
  const sticker = (t, bg, rot, pos) => `<span class="stk" style="${pos};background:${bg};transform:rotate(${rot}deg)">${t}</span>`;
  return doc({ lang, title: `${d.name} – Collage`, fonts: 'family=Permanent+Marker&family=Be+Vietnam+Pro:wght@400;800;900',
    css: `body{font-family:'Be Vietnam Pro',sans-serif;background:#ede6da;color:#1c1917;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='.07'/%3E%3C/svg%3E")}
.mk{font-family:'Permanent Marker',cursive}.hero{position:relative;padding:80px 6vw 40px;min-height:80vh}
.cut{display:inline-block;background:#fff;padding:6px 18px;margin:6px;font-weight:900;font-size:clamp(40px,8vw,110px);line-height:1;box-shadow:4px 6px 0 #1c191733;text-transform:uppercase}
.cut:nth-child(odd){background:#1c1917;color:#ede6da;transform:rotate(-2deg)}.cut:nth-child(even){transform:rotate(2deg)}.cut.c{background:${d.c};color:#fff}
.stk{position:absolute;padding:10px 18px;border-radius:999px;font-family:'Permanent Marker';font-size:18px;box-shadow:2px 3px 0 #0003}
.scrib{position:absolute;right:6vw;top:60px;width:240px}.scrib path{stroke-dasharray:900;stroke-dashoffset:900;animation:dr 2.5s .5s forwards}@keyframes dr{to{stroke-dashoffset:0}}
.board{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:40px;padding:40px 6vw 60px}
.pc{background:#fff;padding:12px 12px 20px;box-shadow:0 10px 24px -10px #0005;position:relative;transition:transform .3s}.pc:hover{transform:rotate(0) scale(1.04)!important;z-index:2}
.pc::before{content:'';position:absolute;top:-14px;left:50%;width:100px;height:28px;margin-left:-50px;background:#fde68acc;transform:rotate(-4deg)}.pc img{aspect-ratio:1;object-fit:cover;width:100%}.pc h3{font-family:'Permanent Marker';font-size:24px;margin:10px 0 0}
.note{background:#fef08a;padding:30px;max-width:620px;margin:20px auto;transform:rotate(-1.5deg);box-shadow:0 12px 20px -12px #0006;font-size:19px}
footer{text-align:center;padding:60px 6vw 100px}footer a{font-family:'Permanent Marker';font-size:24px;margin:0 12px}`,
    body: `<div class="hero"><div>${String(d.name).split(' ').map((w, i, a) => `<span class="cut${i === a.length - 1 ? ' c' : ''}">${w}</span>`).join('')}</div>
<p class="mk" style="font-size:28px;margin:20px 6px">${d.role} ✶</p>
${sticker(d.skills[0] || 'Creative', '#f472b6', -12, 'left:62%;top:62%')}
${sticker(d.skills[1] || 'Design', '#a3e635', 8, 'left:78%;top:40%')}
${sticker('★ ' + (d.loc || 'Hello'), '#67e8f9', -6, 'left:70%;top:80%')}
<svg class="scrib" viewBox="0 0 240 120"><path d="M10 80c30-60 70-60 80-20s50 40 70-10 50-30 70 10" stroke="${d.c}" stroke-width="6" fill="none" stroke-linecap="round"/></svg></div>
<div class="note">${d.bio}</div>
<div class="board">${d.projects.map((p, i) => `<div class="pc" style="transform:rotate(${tilt[i % tilt.length]}deg)"><img src="${p.img}" alt="${p.title}"><h3>${p.title}</h3><small>${p.cat} · ${p.year}</small><p>${p.desc}</p>${projLink(p, L, 'mk')}</div>`).join('')}</div>
<footer><h2 class="mk" style="font-size:48px">${L.hire}</h2>${contactLinks(d)}</footer>` });
}

// ---------------------------------------------------------------- 17. Bento grid (modular blocks)
function bento(d, L, lang) {
  const P = d.projects;
  const big = [0, 3, 6];
  return doc({ lang, title: `${d.name} – Portfolio`, fonts: 'family=Space+Grotesk:wght@400;500;700',
    css: `body{font-family:'Space Grotesk',sans-serif;background:#f3efe8;color:#1c1917;padding:24px}
.g{max-width:1240px;margin:auto;display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:190px;gap:14px}
.b{background:#fff;border-radius:28px;padding:24px;position:relative;overflow:hidden;transition:transform .35s cubic-bezier(.2,.8,.2,1),box-shadow .35s;opacity:0;animation:pop .7s cubic-bezier(.2,.8,.2,1) forwards}
.b:hover{transform:translateY(-4px) rotate(-.4deg);box-shadow:0 18px 40px -18px rgba(0,0,0,.35)}@keyframes pop{from{opacity:0;transform:scale(.94) translateY(16px)}to{opacity:1;transform:none}}
.w2{grid-column:span 2}.h2{grid-row:span 2}.intro{background:${d.c};color:#fff;display:flex;flex-direction:column;justify-content:space-between}.intro h1{font-size:clamp(34px,4.2vw,58px);line-height:.95;margin:0;letter-spacing:-.03em}
.intro .r{display:inline-flex;gap:8px;align-items:center;background:#fff3;padding:6px 14px;border-radius:99px;font-size:14px;width:max-content}.dot{width:8px;height:8px;border-radius:50%;background:#4ade80;box-shadow:0 0 0 0 #4ade80;animation:ping 1.6s infinite}@keyframes ping{70%{box-shadow:0 0 0 10px #4ade8000}}
.pj{padding:0;color:#fff}.pj img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .8s}.pj:hover img{transform:scale(1.07)}.pj .cap{position:absolute;inset:auto 0 0;padding:18px 22px;background:linear-gradient(transparent,rgba(0,0,0,.75))}.pj h3{margin:2px 0 0;font-size:20px}.pj small{opacity:.8}.pj p{margin:6px 0 0;font-size:14px;opacity:0;max-height:0;transition:.4s}.pj:hover p{opacity:.9;max-height:80px}
.pj .ar{position:absolute;top:16px;right:16px;width:40px;height:40px;border-radius:50%;background:#fff;color:#000;display:grid;place-items:center;transform:scale(0) rotate(-90deg);transition:.4s}.pj:hover .ar{transform:none}
.dark{background:#1c1917;color:#f5f5f4}.sk{display:flex;flex-wrap:wrap;gap:8px;align-content:flex-start}.sk span{border:1px solid currentColor;border-radius:99px;padding:6px 12px;font-size:13px}
.num{font-size:64px;font-weight:700;line-height:1;color:${d.c}}.ct{background:#d9f99d;display:flex;flex-direction:column;justify-content:space-between}.ct a{display:block;font-weight:500;text-decoration:none;margin-top:4px}.ct h2{margin:0;font-size:30px}
.av{padding:0}.av img{width:100%;height:100%;object-fit:cover}h4{margin:0 0 12px;font-size:13px;text-transform:uppercase;letter-spacing:.1em;opacity:.6}
@media(max-width:900px){.g{grid-template-columns:repeat(2,1fr)}}@media(max-width:560px){body{padding:12px}.g{grid-template-columns:1fr;grid-auto-rows:minmax(170px,auto)}.w2,.h2{grid-column:auto;grid-row:auto}.pj{min-height:260px}}`,
    body: `<div class="g">
<div class="b w2 h2 intro" style="animation-delay:0s"><span class="r"><i class="dot"></i>${d.role}</span><div><h1>${d.name}</h1><p style="font-size:18px;max-width:520px;opacity:.9">${d.bio}</p></div></div>
${d.avatar ? `<div class="b av h2" style="animation-delay:.08s"><img src="${d.avatar}" alt=""></div>` : ''}
${P.map((p, i) => `<a class="b pj ${big.includes(i) ? 'w2 h2' : i % 3 === 1 ? 'h2' : ''}" ${p.link ? `href="${p.link}" target="_blank" rel="noopener"` : ''} style="animation-delay:${0.12 + i * 0.07}s"><img src="${p.img}" alt="${p.title}"><span class="ar">${svg('play', 16, 'transform:rotate(-45deg)')}</span><div class="cap"><small>${p.cat} · ${p.year}</small><h3>${p.title}</h3><p>${p.desc}</p></div></a>`).join('')}
<div class="b dark" style="animation-delay:.3s"><h4>${L.skills}</h4><div class="sk">${d.skills.map((s) => `<span>${s}</span>`).join('')}</div></div>
<div class="b" style="animation-delay:.35s"><h4>${L.work}</h4><div class="num">${P.length}+</div><div>${d.loc}</div></div>
<div class="b w2 ct" style="animation-delay:.4s"><h2>${L.hire} →</h2><div>${contactLinks(d)}</div></div>
</div>` });
}

// ---------------------------------------------------------------- 18. Kinetic type + custom cursor
function kinetic(d, L, lang) {
  const row = (t, n = 6) => Array(n).fill(`<span>${t}</span><i>✦</i>`).join('');
  return doc({ lang, title: `${d.name} – Portfolio`, fonts: 'family=Anton&family=Inter:wght@400;600',
    css: `body{font-family:Inter,sans-serif;background:#0a0a0a;color:#f5f5f5;overflow-x:hidden}a{text-decoration:none}
.cur{position:fixed;left:0;top:0;width:18px;height:18px;border-radius:50%;background:${d.c};pointer-events:none;z-index:50;transform:translate(-50%,-50%);transition:width .3s,height .3s,background .3s;mix-blend-mode:difference;display:grid;place-items:center;font-size:12px;font-weight:600;color:#000}
.cur.big{width:90px;height:90px;background:#fff}@media(pointer:coarse){.cur,.peek{display:none!important}}
header{display:flex;justify-content:space-between;padding:22px 32px;font-size:14px;text-transform:uppercase;letter-spacing:.12em}
.mq{white-space:nowrap;font-family:Anton,sans-serif;font-size:clamp(70px,13vw,190px);line-height:1;text-transform:uppercase;will-change:transform}.mq span{padding:0 .15em}.mq i{font-style:normal;color:${d.c};font-size:.5em;vertical-align:middle}
.mq.o span{color:transparent;-webkit-text-stroke:2px #f5f5f5}.intro{display:grid;grid-template-columns:1fr 1fr;gap:40px;padding:80px 32px;max-width:1300px;margin:auto}.intro p{font-size:clamp(20px,2.2vw,30px);line-height:1.35;margin:0}.intro small{color:#a3a3a3;text-transform:uppercase;letter-spacing:.14em}
.list{max-width:1300px;margin:auto;padding:0 32px 80px}.it{display:grid;grid-template-columns:70px 1fr auto;gap:20px;align-items:baseline;padding:30px 0;border-top:1px solid #333;transition:padding .4s,color .4s}.it:last-child{border-bottom:1px solid #333}
.it h3{font-family:Anton,sans-serif;font-size:clamp(34px,5vw,72px);margin:0;text-transform:uppercase;font-weight:400;transition:transform .4s}.it:hover h3{transform:translateX(24px);color:${d.c}}.it .n{color:#737373}.it .m{color:#a3a3a3;text-align:right}.it p{grid-column:2;margin:0;color:#a3a3a3;max-width:640px}
.it img.mob{display:none;grid-column:1/-1;border-radius:12px;margin-top:12px}@media(pointer:coarse){.it img.mob{display:block}}
.peek{position:fixed;left:0;top:0;width:340px;height:240px;pointer-events:none;z-index:40;border-radius:14px;overflow:hidden;opacity:0;transform:translate(-50%,-50%) scale(.6) rotate(-6deg);transition:opacity .3s,transform .3s}.peek.on{opacity:1;transform:translate(-50%,-50%) scale(1) rotate(-3deg)}.peek img{width:100%;height:100%;object-fit:cover}
.sk{padding:40px 32px;max-width:1300px;margin:auto;display:flex;flex-wrap:wrap;gap:10px}.sk span{border:1px solid #444;border-radius:99px;padding:10px 18px}
footer{padding:80px 32px;text-align:center}footer h2{font-family:Anton,sans-serif;font-size:clamp(50px,10vw,150px);margin:0 0 20px;text-transform:uppercase;font-weight:400}footer a{margin:0 12px;border-bottom:1px solid ${d.c}}
@media(max-width:700px){.intro{grid-template-columns:1fr}.it{grid-template-columns:40px 1fr}.it .m{display:none}header,.list,.intro{padding-left:18px;padding-right:18px}}`,
    body: `<div class="cur" id="cur"></div><div class="peek" id="peek"><img alt=""></div>
<header><b>${d.name}</b><span>${d.loc}</span></header>
<div class="mq" data-s="-0.6">${row(d.name)}</div><div class="mq o" data-s="0.6" style="margin-left:-40vw">${row(d.role)}</div>
<section class="intro"><small>(${L.about})</small><p>${d.bio}</p></section>
<section class="list">${d.projects.map((p, i) => `<a class="it" data-img="${p.img}" ${p.link ? `href="${p.link}" target="_blank" rel="noopener"` : ''}><span class="n">${String(i + 1).padStart(2, '0')}</span><h3>${p.title}</h3><span class="m">${p.cat}<br>${p.year}</span><p>${p.desc}</p><img class="mob" src="${p.img}" alt="${p.title}"></a>`).join('')}</section>
<div class="sk">${d.skills.map((s) => `<span>${s}</span>`).join('')}</div>
<footer><h2>${L.hire}</h2>${contactLinks(d)}</footer>`,
    script: `const cur=document.getElementById('cur'),pk=document.getElementById('peek'),pi=pk.querySelector('img');let x=0,y=0,cx=0,cy=0;
addEventListener('mousemove',e=>{x=e.clientX;y=e.clientY});(function loop(){cx+=(x-cx)*.18;cy+=(y-cy)*.18;cur.style.left=x+'px';cur.style.top=y+'px';pk.style.left=cx+'px';pk.style.top=cy+'px';requestAnimationFrame(loop)})();
document.querySelectorAll('.it').forEach(el=>{el.addEventListener('mouseenter',()=>{pi.src=el.dataset.img;pk.classList.add('on');cur.classList.add('big');cur.textContent='${lang === 'en' ? 'View' : 'Xem'}'});el.addEventListener('mouseleave',()=>{pk.classList.remove('on');cur.classList.remove('big');cur.textContent=''})});
const mq=[...document.querySelectorAll('.mq')];const mv=()=>mq.forEach(m=>m.style.transform='translateX('+(scrollY*m.dataset.s-100)+'px)');addEventListener('scroll',mv,{passive:true});mv();` });
}

// ---------------------------------------------------------------- 19. Split screen (sticky profile + scrolling work)
function split(d, L, lang) {
  return doc({ lang, title: `${d.name} – Portfolio`, fonts: 'family=DM+Serif+Display&family=DM+Sans:wght@400;500;700',
    css: `body{font-family:'DM Sans',sans-serif;color:#18181b;background:#fafaf9}.wrap{display:grid;grid-template-columns:minmax(320px,38%) 1fr;min-height:100vh}
aside{position:sticky;top:0;height:100vh;padding:48px;display:flex;flex-direction:column;background:${d.c};color:#fff;overflow:hidden}
aside h1{font-family:'DM Serif Display',serif;font-size:clamp(40px,4.5vw,72px);line-height:1;margin:0 0 14px;font-weight:400}aside .role{opacity:.85;font-size:18px}aside p{opacity:.9;line-height:1.6;max-width:420px}
.av{width:84px;height:84px;border-radius:50%;object-fit:cover;border:3px solid #fff6;margin-bottom:24px}.now{margin-top:auto;border-top:1px solid #fff4;padding-top:20px}.now small{opacity:.7;text-transform:uppercase;letter-spacing:.12em;font-size:12px}
.now .t{font-family:'DM Serif Display',serif;font-size:32px;line-height:1.1;transition:opacity .3s,transform .3s}.now .t.sw{opacity:0;transform:translateY(10px)}.cnt{font-size:90px;font-family:'DM Serif Display',serif;position:absolute;right:30px;bottom:10px;opacity:.15;line-height:1}
.lk{display:flex;flex-wrap:wrap;gap:14px;margin-top:20px}.lk a{text-decoration:none;border-bottom:1px solid #fff8;font-size:14px}
main{padding:48px}.pj{margin-bottom:90px}.pj .im{overflow:hidden;border-radius:6px;aspect-ratio:4/3;background:#e7e5e4}.pj img{width:100%;height:100%;object-fit:cover;transform:scale(1.12);transition:transform 1.2s cubic-bezier(.2,.8,.2,1)}.pj.in img{transform:scale(1)}
.pj .meta{display:flex;justify-content:space-between;margin-top:16px;color:#78716c;font-size:14px;text-transform:uppercase;letter-spacing:.08em}.pj h3{font-family:'DM Serif Display',serif;font-size:40px;font-weight:400;margin:6px 0}.pj p{color:#57534e;max-width:600px;line-height:1.6}
.pj a{color:${d.c};font-weight:700}.sk{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 70px}.sk span{background:#fff;border:1px solid #e7e5e4;border-radius:99px;padding:8px 14px;font-size:14px}
@media(max-width:820px){.wrap{grid-template-columns:1fr}aside{position:relative;height:auto;min-height:80vh;padding:32px 22px}.now{display:none}main{padding:28px 18px}}`,
    body: `<div class="wrap"><aside>${d.avatar ? `<img class="av" src="${d.avatar}" alt="">` : ''}<h1>${d.name}</h1><div class="role">${d.role} · ${d.loc}</div><p>${d.bio}</p><div class="lk">${contactLinks(d)}</div>
<div class="now"><small>${L.work}</small><div class="t" id="nt">${d.projects[0]?.title || ''}</div></div><div class="cnt" id="nc">01</div></aside>
<main><div class="sk">${d.skills.map((s) => `<span>${s}</span>`).join('')}</div>${d.projects.map((p, i) => `<article class="pj" data-i="${i}" data-t="${p.title}"><div class="im"><img src="${p.img}" alt="${p.title}"></div><div class="meta"><span>${p.cat}</span><span>${p.year}</span></div><h3>${p.title}</h3><p>${p.desc}</p>${projLink(p, L)}</article>`).join('')}</main></div>`,
    script: `const nt=document.getElementById('nt'),nc=document.getElementById('nc');
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('in');const t=e.target.dataset.t,i=+e.target.dataset.i;if(nt.textContent===t)return;nt.classList.add('sw');setTimeout(()=>{nt.textContent=t;nc.textContent=String(i+1).padStart(2,'0');nt.classList.remove('sw')},250)}),{rootMargin:'-40% 0px -40% 0px'});
document.querySelectorAll('.pj').forEach(el=>io.observe(el));` });
}

// ---------------------------------------------------------------- 20. Case study pages (grid → full project page with transitions)
function casestudy(d, L, lang) {
  const P = d.projects;
  const vi = lang !== 'en';
  return doc({ lang, title: `${d.name} – Portfolio`, fonts: 'family=Syne:wght@500;700;800&family=Inter:wght@400;500',
    css: `body{font-family:Inter,sans-serif;background:#0c0c0e;color:#e4e4e7}a{color:inherit}.w{max-width:1200px;margin:auto;padding:0 28px}
header{display:flex;justify-content:space-between;align-items:center;padding:26px 0}header b{font-family:Syne,sans-serif;font-size:20px}
.hero{padding:70px 0 60px}.hero h1{font-family:Syne,sans-serif;font-size:clamp(44px,7vw,104px);line-height:.95;margin:0;letter-spacing:-.03em}.hero h1 em{font-style:normal;color:${d.c}}.hero p{max-width:620px;color:#a1a1aa;font-size:19px;line-height:1.6}
.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:28px;padding-bottom:90px}.card{cursor:pointer;text-align:left;background:none;border:0;color:inherit;padding:0;font:inherit}.card .im{overflow:hidden;border-radius:18px;aspect-ratio:4/3}.card:nth-child(even){margin-top:80px}
.card img{width:100%;height:100%;object-fit:cover;transition:transform .7s cubic-bezier(.2,.8,.2,1),filter .5s;filter:grayscale(.4)}.card:hover img{transform:scale(1.05);filter:none}.card h3{font-family:Syne,sans-serif;font-size:28px;margin:16px 0 4px}.card small{color:#71717a}
.cs{position:fixed;inset:0;background:#0c0c0e;z-index:20;overflow:auto;clip-path:circle(0% at var(--x,50%) var(--y,50%));transition:clip-path .8s cubic-bezier(.7,0,.2,1);visibility:hidden}.cs.on{clip-path:circle(150% at var(--x,50%) var(--y,50%));visibility:visible}
.cs .top{position:sticky;top:0;display:flex;justify-content:space-between;align-items:center;padding:18px 28px;background:#0c0c0ecc;backdrop-filter:blur(10px);z-index:2}.cs button{background:#fff1;border:1px solid #fff2;color:#fff;border-radius:99px;padding:10px 18px;cursor:pointer;font:inherit}
.cs .big{width:100%;max-height:78vh;object-fit:cover}.cs h2{font-family:Syne,sans-serif;font-size:clamp(40px,6vw,88px);margin:50px 0 20px;line-height:1}.facts{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;border-top:1px solid #27272a;border-bottom:1px solid #27272a;padding:22px 0;margin-bottom:34px}.facts small{display:block;color:#71717a;text-transform:uppercase;letter-spacing:.1em;font-size:12px}
.cs .desc{font-size:22px;line-height:1.6;max-width:780px;color:#d4d4d8}.nx{display:block;margin:80px 0 60px;padding:50px 0;border-top:1px solid #27272a;text-align:left;width:100%;background:none;border-left:0;border-right:0;border-bottom:0;color:inherit;cursor:pointer;font:inherit}.nx small{color:#71717a}.nx b{display:block;font-family:Syne,sans-serif;font-size:clamp(34px,5vw,64px);transition:color .3s}.nx:hover b{color:${d.c}}
.in>*{animation:up .8s .35s both}@keyframes up{from{opacity:0;transform:translateY(30px)}}footer{padding:70px 0;border-top:1px solid #27272a}footer h2{font-family:Syne,sans-serif;font-size:clamp(36px,6vw,72px);margin:0 0 18px}footer a{margin-right:18px}
@media(max-width:700px){.grid{grid-template-columns:1fr}.card:nth-child(even){margin-top:0}.facts{grid-template-columns:1fr 1fr}.w{padding:0 18px}}`,
    body: `<div class="w"><header><b>${d.name}</b><span>${d.loc}</span></header>
<section class="hero"><h1>${d.role}<em>.</em></h1><p>${d.bio}</p></section>
<section class="grid">${P.map((p, i) => `<button type="button" class="card" data-i="${i}"><div class="im"><img src="${p.img}" alt="${p.title}"></div><h3>${p.title}</h3><small>${p.cat} · ${p.year}</small></button>`).join('')}</section>
<footer><h2>${L.hire}</h2>${contactLinks(d)}</footer></div>
<div class="cs" id="cs" role="dialog" aria-modal="true"></div>
<template id="tp">${P.map((p, i) => `<div data-i="${i}"><div class="top"><b>${String(i + 1).padStart(2, '0')} / ${String(P.length).padStart(2, '0')}</b><button type="button" data-close>✕ ${vi ? 'Đóng' : 'Close'}</button></div>
<img class="big" src="${p.img}" alt="${p.title}"><div class="w in"><h2>${p.title}</h2><div class="facts"><div><small>${vi ? 'Lĩnh vực' : 'Discipline'}</small>${p.cat}</div><div><small>${vi ? 'Năm' : 'Year'}</small>${p.year}</div><div><small>${vi ? 'Thực hiện' : 'By'}</small>${d.name}</div></div>
<p class="desc">${p.desc}</p>${projLink(p, L)}<button type="button" class="nx" data-go="${(i + 1) % P.length}"><small>${vi ? 'Dự án tiếp theo' : 'Next project'} →</small><b>${P[(i + 1) % P.length].title}</b></button></div></div>`).join('')}</template>`,
    script: `const cs=document.getElementById('cs'),tp=document.getElementById('tp').content;
function open(i,ev){const n=tp.querySelector('[data-i="'+i+'"]');if(!n)return;if(ev){cs.style.setProperty('--x',ev.clientX+'px');cs.style.setProperty('--y',ev.clientY+'px')}cs.innerHTML='';cs.appendChild(n.cloneNode(true));cs.scrollTop=0;cs.classList.add('on');document.body.style.overflow='hidden'}
function close(){cs.classList.remove('on');document.body.style.overflow=''}
document.addEventListener('click',e=>{const c=e.target.closest('.card');if(c)return open(c.dataset.i,e);const g=e.target.closest('[data-go]');if(g)return open(g.dataset.go);if(e.target.closest('[data-close]'))close()});
addEventListener('keydown',e=>{if(e.key==='Escape')close()});` });
}

// ---------------------------------------------------------------- 21. Featured Case Study (1400px Multi-Board Presentation)
function behance(d, L, lang) {
  const vi = lang !== 'en';
  const P = d.projects.length ? d.projects : [{ title: d.name, cat: d.role, year: '2026', desc: d.bio, link: '', img: placeholder(d.name, 0, d.c), sketchImg: detailFrameSvg(d.name, d.role, 0, d.c, 'sketch'), specImg: detailFrameSvg(d.name, d.role, 0, d.c, 'spec') }];
  const yr = new Date().getFullYear();
  return doc({ lang, title: `${d.name} – Portfolio Presentation`, fonts: 'family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600',
    css: `body{font-family:'Plus Jakarta Sans',sans-serif;background:#07080c;color:#f3f4f6}
.mono{font-family:'JetBrains Mono',monospace}.disp{font-family:Syne,sans-serif}
.b-stage{max-width:1360px;margin:0 auto;padding:20px 18px 60px;display:flex;flex-direction:column;gap:28px}
.b-board{background:#10131b;border:1px solid #222738;border-radius:20px;overflow:hidden;position:relative;box-shadow:0 28px 70px -24px rgba(0,0,0,.7)}
.b-bar{padding:14px 28px;border-bottom:1px solid #1d2232;display:flex;justify-content:space-between;align-items:center;font-family:'JetBrains Mono',monospace;font-size:11px;color:#64748b;letter-spacing:.16em;text-transform:uppercase;background:#0c0f16}
.b-bar b{color:${d.c}}
.b-cover-grid{padding:54px 48px;display:grid;grid-template-columns:1.25fr 1fr;gap:44px;align-items:center;background:radial-gradient(circle at 85% 20%,${d.c}2e,transparent 48%),linear-gradient(160deg,#111520,#0b0d14)}
.b-tag{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;border-radius:99px;background:${d.c}22;border:1px solid ${d.c}66;color:${d.c};font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;margin-bottom:18px}
.b-cover-grid h1{font-family:Syne,sans-serif;font-size:clamp(42px,6.2vw,86px);line-height:.94;margin:0 0 18px;letter-spacing:-.03em;text-transform:uppercase}
.b-cover-grid h1 span{color:${d.c};display:block}
.b-cover-sub{font-size:18px;line-height:1.7;color:#9ca3af;margin:0 0 28px;max-width:580px}
.b-meta{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding-top:22px;border-top:1px solid #23293a;font-size:12px;color:#94a3b8}
.b-meta b{color:#fff;display:block;font-size:15px;margin-top:3px}
.b-idx-spread{display:grid;grid-template-columns:1fr 1.2fr;border-top:1px solid #1d2232}
.b-idx-col{padding:44px 40px;border-right:1px solid #1d2232}.b-idx-col:last-child{border-right:0}
.b-av-row{display:flex;align-items:center;gap:18px;margin-bottom:24px}
.b-av{width:76px;height:76px;border-radius:20px;object-fit:cover;background:${d.c};display:grid;place-items:center;font-weight:900;font-size:28px;color:#fff;border:2px solid ${d.c}}
.b-toc-list{display:grid;gap:12px}
.b-toc-item{display:grid;grid-template-columns:46px 1fr auto;align-items:center;gap:14px;padding:14px 18px;border-radius:14px;background:#151925;border:1px solid #23293c;text-decoration:none;transition:.22s}
.b-toc-item:hover{border-color:${d.c};transform:translateX(6px)}
.b-toc-n{font-family:Syne,sans-serif;font-size:22px;font-weight:800;color:${d.c}}
.b-case-hd{padding:42px 44px 28px;display:grid;grid-template-columns:1fr auto;gap:24px;align-items:end;border-bottom:1px solid #1d2232}
.b-case-hd h2{font-family:Syne,sans-serif;font-size:clamp(30px,4.2vw,54px);margin:8px 0 0;line-height:1;letter-spacing:-.02em}
.b-hero-img{width:100%;max-height:660px;object-fit:cover;border-bottom:1px solid #1d2232}
.b-narrative{padding:34px 44px;display:grid;grid-template-columns:repeat(3,1fr);gap:28px;border-bottom:1px solid #1d2232;background:#0d1018}
.b-narrative div{border-top:2px solid ${d.c};padding-top:14px}
.b-narrative small{font-family:'JetBrains Mono',monospace;font-size:11px;color:${d.c};letter-spacing:.12em;text-transform:uppercase;display:block;margin-bottom:8px}
.b-narrative p{margin:0;font-size:15px;line-height:1.7;color:#cbd5e1}
.b-subgrid{display:grid;grid-template-columns:1fr 1fr;gap:20px;padding:28px 44px 36px;background:#10131b}
.b-subgrid figure{margin:0;border:1px solid #242a3d;border-radius:14px;overflow:hidden;background:#0b0d13}
.b-subgrid img{width:100%;aspect-ratio:16/10;object-fit:cover}
.b-subgrid figcaption{padding:10px 14px;font-family:'JetBrains Mono',monospace;font-size:11px;color:#94a3b8;border-top:1px solid #1e2333;display:flex;justify-content:space-between}
.b-like{padding:10px 20px;border-radius:99px;font-size:13px;font-weight:700;text-decoration:none;border:1px solid ${d.c};background:${d.c};color:#fff;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:.2s}
.b-like.liked{background:#10b981;border-color:#10b981}
.b-appr{text-align:center;padding:72px 28px;background:radial-gradient(circle at 50% 0%,${d.c}28,transparent 65%),#0e1118}
.b-appr-btn{width:96px;height:96px;border-radius:50%;background:${d.c};border:0;color:#fff;font-size:32px;cursor:pointer;box-shadow:0 18px 45px ${d.c}66;transition:transform .25s}.b-appr-btn:hover{transform:scale(1.08)}
@media(max-width:820px){.b-cover-grid,.b-idx-spread,.b-narrative,.b-subgrid,.b-case-hd{grid-template-columns:1fr}.b-cover-grid,.b-idx-col,.b-case-hd,.b-narrative,.b-subgrid{padding:24px 20px}}`,
    body: `<div class="b-stage">
  <!-- ARTBOARD 01: PORTFOLIO COVER POSTER -->
  <section class="b-board">
    <div class="b-bar"><span>┼ PORTFOLIO ARCHIVE // EDITION ${yr}</span><b>ARTBOARD 01 / COVER SPREAD</b><span>1400PX PRESENTATION ┼</span></div>
    <div class="b-cover-grid">
      <div>
        <span class="b-tag">★ FEATURED PORTFOLIO PRESENTATION</span>
        <h1>PORTFOLIO<span>${d.name}</span></h1>
        <p class="b-cover-sub">${d.bio}</p>
        <div class="b-meta">
          <div><span>${vi ? 'Chuyên môn' : 'Discipline'}</span><b>${d.role}</b></div>
          <div><span>${vi ? 'Địa điểm' : 'Location'}</span><b>${d.loc}</b></div>
          <div><span>${vi ? 'Tác phẩm chọn lọc' : 'Curated Works'}</span><b>0${P.length} Case Studies</b></div>
        </div>
      </div>
      <div><img src="${P[0].img}" alt="${P[0].title}" style="width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:16px;border:1px solid #2e364f;box-shadow:0 24px 50px rgba(0,0,0,.5)"></div>
    </div>
  </section>

  <!-- ARTBOARD 02: TABLE OF CONTENTS & CURRICULUM VITAE SPREAD -->
  <section class="b-board" id="about">
    <div class="b-bar"><span>┼ 01 // ABOUT &amp; CURRICULUM VITAE</span><b>ARTBOARD 02 / INDEX SPREAD</b><span>02 // TABLE OF CONTENTS ┼</span></div>
    <div class="b-idx-spread">
      <div class="b-idx-col">
        <div class="b-av-row">
          ${d.avatar ? `<img class="b-av" src="${d.avatar}" alt="">` : `<div class="b-av">${d.first[0] || 'A'}</div>`}
          <div><div class="mono" style="font-size:11px;color:${d.c};letter-spacing:.14em">CREATIVE PROFILE</div><h2 style="margin:4px 0;font-size:26px">${d.name}</h2><div style="font-size:14px;color:#94a3b8">${d.role} · ${d.loc}</div></div>
        </div>
        ${d.manifesto ? `<blockquote style="margin:0 0 20px;padding:16px 20px;border-left:3px solid ${d.c};background:#151925;border-radius:0 12px 12px 0;font-style:italic;color:#e2e8f0;font-size:16px">“${d.manifesto}”</blockquote>` : ''}
        <div class="mono" style="font-size:11px;color:#94a3b8;letter-spacing:.14em;margin:20px 0 10px">${vi ? 'CÔNG CỤ & CHẤT LIỆU SÁNG TẠO' : 'CREATIVE TOOLKIT & MEDIUMS'}</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px">${d.skills.map((s) => `<span style="padding:6px 13px;border-radius:8px;background:#161b28;border:1px solid #283046;font-size:12.5px;font-weight:600;color:#e2e8f0">${s}</span>`).join('')}</div>
      </div>
      <div class="b-idx-col" id="work">
        <div class="mono" style="font-size:11px;color:${d.c};letter-spacing:.14em;margin-bottom:14px">${vi ? 'MỤC LỤC DỰ ÁN CHỌN LỌC (INDEX)' : 'SELECTED WORKS TABLE OF CONTENTS'}</div>
        <div class="b-toc-list">
          ${P.map((p, i) => `<a class="b-toc-item" href="#cs-${i}"><span class="b-toc-n">0${i + 1}</span><div><b style="display:block;font-size:16px;color:#fff">${p.title}</b><span style="font-size:12.5px;color:#94a3b8">${p.cat || d.role}</span></div><span class="mono" style="font-size:12px;color:#64748b">${p.year || yr} →</span></a>`).join('')}
        </div>
      </div>
    </div>
  </section>

  <!-- ARTBOARDS 03+: DEEP-DIVE PROJECT CASE STUDY SPREADS -->
  ${P.map((p, i) => `<article class="b-board" id="cs-${i}">
    <div class="b-bar"><span>┼ CHAPTER 0${i + 1} // ${p.cat || d.role}</span><b>ARTBOARD 0${i + 3} / CASE STUDY SPREAD</b><span>YEAR: ${p.year || yr} ┼</span></div>
    <div class="b-case-hd">
      <div><div class="mono" style="font-size:12px;color:${d.c};letter-spacing:.14em">SELECTED WORK 0${i + 1} — ${p.cat || 'CASE STUDY'}</div><h2>${p.title}</h2></div>
      <div>${projLink(p, L, 'b-like')}</div>
    </div>
    <img class="b-hero-img" src="${p.img}" alt="${p.title}" loading="lazy">
    <div class="b-narrative">
      <div><small>01 // ${vi ? 'BỐI CẢNH & ĐỀ BÀI' : 'THE BRIEF & CONTEXT'}</small><p>${p.desc}</p></div>
      <div><small>02 // ${vi ? 'ĐỊNH HƯỚNG NGHỆ THUẬT' : 'ART DIRECTION & CRAFT'}</small><p>${vi ? `Xây dựng hệ thống thị giác, tỷ lệ bố cục chuẩn mực và ngôn ngữ chất liệu riêng biệt cho dự án ${p.title}.` : `Crafted bespoke visual language, grid proportions and tactile art direction tailored for ${p.title}.`}</p></div>
      <div><small>03 // ${vi ? 'HẠNG MỤC & VAI TRÒ' : 'DELIVERABLES & ROLE'}</small><p><b>${d.role}</b> — ${p.cat || 'Brand & Visual System'} (${p.year || yr}) · ${d.skills.slice(0, 3).join(', ')}</p></div>
    </div>
    <div class="b-subgrid">
      <figure><img src="${p.sketchImg || p.img}" alt="${p.title} wireframe" loading="lazy"><figcaption><span>FIG 0${i + 1}.A — WIREFRAME &amp; SKETCH STUDY</span><span>1:1.618</span></figcaption></figure>
      <figure><img src="${p.specImg || p.img}" alt="${p.title} color spec" loading="lazy"><figcaption><span>FIG 0${i + 1}.B — PANTONE PALETTE &amp; TYPOGRAPHY</span><span>SPEC SHEET</span></figcaption></figure>
    </div>
  </article>`).join('')}

  <!-- FINAL ARTBOARD: THANK YOU FOR WATCHING & APPRECIATION SLATE -->
  <footer class="b-board" id="contact">
    <div class="b-bar"><span>┼ FIN // COLOPHON &amp; APPRECIATION</span><b>END SLATE</b><span>${d.loc} ┼</span></div>
    <div class="b-appr">
      <button type="button" class="b-appr-btn" data-like>👍</button>
      <div class="mono" style="font-size:12px;color:${d.c};letter-spacing:.2em;margin-top:20px">THANK YOU FOR WATCHING</div>
      <h2 class="disp" style="font-size:clamp(34px,5vw,64px);margin:8px 0 12px">${L.hire}</h2>
      <p style="color:#9ca3af;margin:0 0 24px"><span data-lk-n>1,248</span> ${vi ? 'lượt đánh giá cao' : 'appreciations'}</p>
      <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:16px;font-weight:700">${contactLinks(d, 'b-like')}</div>
    </div>
  </footer>
</div>`,
    script: `let n=1248,on=false;document.querySelectorAll('[data-like]').forEach(b=>b.addEventListener('click',()=>{on=!on;n+=on?1:-1;document.querySelectorAll('[data-lk-n]').forEach(s=>s.textContent=n.toLocaleString());document.querySelectorAll('.b-like').forEach(x=>x.classList.toggle('liked',on));}));` });
}

// ---------------------------------------------------------------- 22. Warm Editorial Serif System
function claude(d, L, lang) {
  const vi = lang !== 'en';
  return doc({ lang, title: `${d.name} – Warm Editorial`, fonts: 'family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500',
    css: `:root{--bg:#f4f0e8;--card:#faf8f3;--ink:#191918;--muted:#66645e;--line:#e2ddd3;--acc:${d.c || '#d97757'}}
body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--bg);color:var(--ink);line-height:1.65}
.serif{font-family:'Source Serif 4',Georgia,serif}.mono{font-family:'JetBrains Mono',monospace}
.w{max-width:1060px;margin:0 auto;padding:0 28px}
header{border-bottom:1px solid var(--line);padding:20px 0;position:sticky;top:0;background:#f4f0e8ee;backdrop-filter:blur(10px);z-index:10}
header .w{display:flex;justify-content:space-between;align-items:center}
.brand{display:flex;align-items:center;gap:12px;font-weight:700;font-size:17px}
.spark{width:28px;height:28px;border-radius:8px;background:var(--acc);color:#fff;display:grid;place-items:center;font-size:15px}
nav a{margin-left:22px;text-decoration:none;color:var(--muted);font-size:14px;font-weight:600}nav a:hover{color:var(--ink)}
.hero{padding:88px 0 68px;border-bottom:1px solid var(--line);display:grid;grid-template-columns:1.45fr 1fr;gap:48px;align-items:center}
.pill{display:inline-flex;align-items:center;gap:8px;padding:5px 13px;border-radius:99px;background:#e8e2d5;color:var(--ink);font-size:12px;font-weight:600;margin-bottom:20px}
.pill i{width:8px;height:8px;border-radius:50%;background:var(--acc)}
.hero h1{font-family:'Source Serif 4',Georgia,serif;font-size:clamp(40px,5.6vw,68px);font-weight:600;line-height:1.06;letter-spacing:-.025em;margin:0 0 22px}
.hero p{font-size:19px;color:var(--muted);margin:0 0 28px}
.prompt-box{background:var(--card);border:1px solid var(--line);border-radius:20px;padding:24px;box-shadow:0 12px 32px -16px rgba(25,25,24,.08)}
.prompt-hd{display:flex;justify-content:space-between;font-size:12px;color:var(--muted);margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid var(--line)}
.sec-title{display:flex;justify-content:space-between;align-items:baseline;padding:64px 0 28px}
.sec-title h2{font-family:'Source Serif 4',Georgia,serif;font-size:clamp(30px,4vw,44px);font-weight:600;margin:0}
.artifacts{display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:24px}
.art{background:var(--card);border:1px solid var(--line);border-radius:20px;overflow:hidden;transition:transform .25s,box-shadow .25s,border-color .25s;display:flex;flex-direction:column}
.art:hover{transform:translateY(-4px);border-color:var(--acc);box-shadow:0 20px 40px -22px rgba(25,25,24,.14)}
.art-bar{padding:10px 16px;background:#ede8de;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;font-size:11px;color:var(--muted)}
.art img{width:100%;aspect-ratio:16/10;object-fit:cover;border-bottom:1px solid var(--line)}
.art-bd{padding:22px;flex:1;display:flex;flex-direction:column}
.art-bd h3{font-family:'Source Serif 4',Georgia,serif;font-size:24px;margin:0 0 8px}
.art-bd p{color:var(--muted);font-size:15px;margin:0 0 16px;flex:1}
.art-bd a{color:var(--acc);font-weight:700;text-decoration:none;font-size:14px}
.tokens{display:flex;flex-wrap:wrap;gap:10px;padding:12px 0 40px}
.tokens span{background:var(--card);border:1px solid var(--line);padding:8px 16px;border-radius:10px;font-size:14px;font-weight:500}
footer{border-top:1px solid var(--line);padding:72px 0;margin-top:40px;text-align:center}
footer h2{font-family:'Source Serif 4',Georgia,serif;font-size:42px;margin:0 0 12px}footer a{margin:0 12px;color:var(--acc);font-weight:600}
@media(max-width:760px){.hero{grid-template-columns:1fr}}`,
    body: `<header><div class="w"><div class="brand"><span class="spark">✦</span><span>${d.name}</span></div><nav><a href="#work">${L.work}</a><a href="#skills">${L.skills}</a><a href="#contact">${L.contact}</a></nav></div></header>
<div class="w"><section class="hero"><div><span class="pill"><i></i> ${d.role} · ${d.loc}</span><h1>${d.name}</h1><p>${d.bio}</p><a href="#contact" style="display:inline-block;background:var(--ink);color:var(--bg);padding:13px 26px;border-radius:12px;text-decoration:none;font-weight:600">${L.hire} →</a></div>
<div class="prompt-box"><div class="prompt-hd"><span class="mono">artifact // profile.md</span><span class="mono" style="color:var(--acc)">● verified</span></div>${d.avatar ? `<img src="${d.avatar}" alt="" style="width:84px;height:84px;border-radius:16px;object-fit:cover;margin-bottom:14px">` : ''}<p class="serif" style="font-size:20px;margin:0 0 12px">“${d.bio}”</p><div class="mono" style="font-size:12px;color:var(--muted)">stack: [${d.skills.slice(0, 5).join(', ')}]</div></div></section>
<div class="sec-title" id="work"><h2>${vi ? 'Hồ sơ Dự án & Nghiên cứu' : 'Selected Artifacts & Case Studies'}</h2><span class="mono" style="font-size:13px;color:var(--muted)">${d.projects.length} items</span></div>
<div class="artifacts">${d.projects.map((p, i) => `<article class="art"><div class="art-bar"><span class="mono">0${i + 1} // ${p.cat || 'artifact'}</span><span class="mono">${p.year || '2026'}</span></div><img src="${p.img}" alt="${p.title}" loading="lazy"><div class="art-bd"><h3>${p.title}</h3><p>${p.desc}</p>${projLink(p, L)}</div></article>`).join('')}</div>
<div class="sec-title" id="skills"><h2>${L.skills}</h2></div><div class="tokens">${d.skills.map((s) => `<span>${s}</span>`).join('')}</div></div>
<footer id="contact"><div class="w"><h2>${L.hire}</h2><p style="color:var(--muted)">${d.loc}</p>${contactLinks(d)}</div></footer>` });
}

// ---------------------------------------------------------------- 23. Neo-Brutalist Studio (High-Contrast)
function brutalist(d, L, lang) {
  return doc({ lang, title: `${d.name} – Neo-Brutalist`, fonts: 'family=Space+Grotesk:wght@500;700&family=Syne:wght@800',
    css: `body{font-family:'Space Grotesk',sans-serif;background:#fffdf7;color:#111;background-image:radial-gradient(#111 1px,transparent 1px);background-size:24px 24px}
.w{max-width:1160px;margin:0 auto;padding:24px}
.box{background:#fff;border:3px solid #111;box-shadow:7px 7px 0 #111;border-radius:16px}
header{display:flex;justify-content:space-between;align-items:center;padding:16px 24px;margin-bottom:28px;background:#fde047}
header b{font-family:Syne,sans-serif;font-size:22px}header a{font-weight:700;text-decoration:none;padding:8px 16px;border:2px solid #111;background:#fff;box-shadow:3px 3px 0 #111;border-radius:8px;margin-left:8px}
.hero{padding:44px;background:${d.c};color:#fff;margin-bottom:32px;position:relative;overflow:hidden}
.sticker{display:inline-block;background:#fde047;color:#111;border:2px solid #111;box-shadow:4px 4px 0 #111;padding:6px 14px;font-weight:700;transform:rotate(-2deg);margin-bottom:16px;text-transform:uppercase;font-size:13px}
.hero h1{font-family:Syne,sans-serif;font-size:clamp(42px,7vw,92px);line-height:.94;margin:0 0 18px;text-shadow:4px 4px 0 #111}
.hero p{font-size:20px;max-width:680px;background:#111;color:#fff;padding:14px 18px;border-radius:10px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:28px;margin-bottom:36px}
.card{overflow:hidden;transition:transform .18s,box-shadow .18s}.card:hover{transform:translate(-4px,-4px);box-shadow:11px 11px 0 #111}
.card img{width:100%;aspect-ratio:4/3;object-fit:cover;border-bottom:3px solid #111}
.card-b{padding:22px}.pill{display:inline-block;background:#a7f3d0;border:2px solid #111;padding:3px 10px;border-radius:99px;font-size:12px;font-weight:700}
.card h3{font-family:Syne,sans-serif;font-size:26px;margin:10px 0 6px}.card a{display:inline-block;margin-top:10px;padding:8px 16px;background:#fde047;border:2px solid #111;box-shadow:3px 3px 0 #111;font-weight:700;text-decoration:none;border-radius:8px}
.sk{display:flex;flex-wrap:wrap;gap:12px;padding:28px;background:#e0e7ff;margin-bottom:36px}
.sk span{background:#fff;border:2px solid #111;box-shadow:4px 4px 0 #111;padding:8px 16px;font-weight:700;border-radius:8px}
footer{padding:44px;background:#111;color:#fff;border-radius:16px;text-align:center}footer a{color:#fde047;margin:0 12px;font-weight:700;font-size:18px}`,
    body: `<div class="w"><header class="box"><b>${d.name}</b><div><a href="#work">${L.work}</a><a href="#contact">${L.contact}</a></div></header>
<section class="hero box"><span class="sticker">${d.role} // ${d.loc}</span><h1>${d.name}</h1><p>${d.bio}</p></section>
<section id="work" class="grid">${d.projects.map((p) => `<article class="card box"><img src="${p.img}" alt="${p.title}"><div class="card-b"><span class="pill">${p.cat} · ${p.year}</span><h3>${p.title}</h3><p>${p.desc}</p>${projLink(p, L)}</div></article>`).join('')}</section>
<section class="sk box">${d.skills.map((s) => `<span>#${s}</span>`).join('')}</section>
<footer id="contact"><h2 style="font-family:Syne,sans-serif;font-size:44px;margin:0 0 12px">${L.hire}</h2>${contactLinks(d)}</footer></div>` });
}

// ---------------------------------------------------------------- 24. Spatial Glass (Dark Specular UI)
function spatial(d, L, lang) {
  return doc({ lang, title: `${d.name} – Spatial Glass`, fonts: 'family=Plus+Jakarta+Sans:wght@400;600;800',
    css: `body{font-family:'Plus Jakarta Sans',sans-serif;background:#05060b;color:#f8fafc;background-image:radial-gradient(circle at 15% 15%,${d.c}55 0,transparent 42%),radial-gradient(circle at 85% 25%,#8b5cf644 0,transparent 45%),radial-gradient(circle at 50% 85%,#06b6d433 0,transparent 50%);background-attachment:fixed}
.w{max-width:1140px;margin:0 auto;padding:28px 24px}
.glass{background:linear-gradient(135deg,rgba(255,255,255,.11),rgba(255,255,255,.03));backdrop-filter:blur(28px);-webkit-backdrop-filter:blur(28px);border:1px solid rgba(255,255,255,.16);box-shadow:0 24px 60px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.25);border-radius:28px}
nav{position:sticky;top:18px;z-index:10;padding:12px 24px;display:flex;justify-content:space-between;align-items:center;margin-bottom:36px;border-radius:99px!important}
nav a{color:#cbd5e1;text-decoration:none;margin-left:20px;font-size:14px;font-weight:600}
.hero{padding:64px 48px;display:grid;grid-template-columns:1.3fr 1fr;gap:40px;align-items:center;margin-bottom:36px}
.hero h1{font-size:clamp(38px,5.5vw,68px);line-height:1.03;margin:10px 0 18px;letter-spacing:-.03em;background:linear-gradient(180deg,#fff,#94a3b8);-webkit-background-clip:text;color:transparent}
.hero p{color:#cbd5e1;font-size:18px;line-height:1.65}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:24px;margin-bottom:36px}
.card{padding:16px;transition:transform .35s,border-color .35s}.card:hover{transform:translateY(-6px) scale(1.01);border-color:${d.c}aa}
.card img{width:100%;aspect-ratio:16/10;object-fit:cover;border-radius:18px;margin-bottom:16px}
.card h3{margin:6px 0;font-size:22px}.card p{color:#94a3b8;font-size:15px}.card a{color:${d.c};font-weight:700;text-decoration:none}
.pills{display:flex;flex-wrap:wrap;gap:10px;padding:28px}.pills span{padding:8px 18px;border-radius:99px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.14);font-size:14px}
footer{padding:52px;text-align:center}footer a{margin:0 12px;color:#e2e8f0}
@media(max-width:760px){.hero{grid-template-columns:1fr;padding:32px 24px}}`,
    body: `<div class="w"><nav class="glass"><b>${d.name}</b><div><a href="#work">${L.work}</a><a href="#contact">${L.contact}</a></div></nav>
<section class="hero glass"><div><span style="color:${d.c};font-weight:700;font-size:13px;letter-spacing:.12em;text-transform:uppercase">${d.role} · ${d.loc}</span><h1>${d.name}</h1><p>${d.bio}</p></div>${d.avatar ? `<img src="${d.avatar}" alt="" style="width:100%;max-width:280px;aspect-ratio:1;object-fit:cover;border-radius:24px;margin:auto">` : `<img src="${(d.projects[0] || {}).img || placeholder(d.name, 0, d.c)}" alt="" style="width:100%;border-radius:20px">`}</section>
<section id="work" class="grid">${d.projects.map((p) => `<article class="card glass"><img src="${p.img}" alt="${p.title}"><div style="padding:0 8px 8px"><small style="color:${d.c};font-weight:700">${p.cat} · ${p.year}</small><h3>${p.title}</h3><p>${p.desc}</p>${projLink(p, L)}</div></article>`).join('')}</section>
<section class="pills glass">${d.skills.map((s) => `<span>${s}</span>`).join('')}</section>
<footer id="contact" class="glass" style="margin-top:36px"><h2>${L.hire}</h2>${contactLinks(d)}</footer></div>` });
}

// ---------------------------------------------------------------- 25. Long-Form Editorial Magazine
function magazine(d, L, lang) {
  return doc({ lang, title: `${d.name} – Editorial Magazine`, fonts: 'family=Instrument+Serif:ital@0;1&family=Lora:ital,wght@0,400;0,600;1,400',
    css: `body{font-family:'Lora',Georgia,serif;background:#fbf9f5;color:#1c1917}
.w{max-width:1120px;margin:0 auto;padding:0 32px}
.mast{border-bottom:3px double #1c1917;padding:28px 0 18px;text-align:center}
.mast-meta{display:flex;justify-content:space-between;font-size:12px;text-transform:uppercase;letter-spacing:.18em;border-bottom:1px solid #d6d3cd;padding-bottom:10px;margin-bottom:18px}
.mast h1{font-family:'Instrument Serif',Georgia,serif;font-size:clamp(56px,10vw,132px);font-weight:400;line-height:.88;margin:0;letter-spacing:-.02em}
.lead{display:grid;grid-template-columns:1fr 2fr 1fr;gap:32px;padding:44px 0;border-bottom:1px solid #d6d3cd;align-items:start}
.lead-bio::first-letter{float:left;font-family:'Instrument Serif',serif;font-size:68px;line-height:.8;padding-right:12px;color:${d.c}}
.feature{padding:56px 0;border-bottom:1px solid #d6d3cd;display:grid;grid-template-columns:1.1fr 1.4fr;gap:44px;align-items:center}
.feature:nth-child(even){grid-template-columns:1.4fr 1.1fr}.feature:nth-child(even) img{order:2}
.feature img{width:100%;aspect-ratio:4/3;object-fit:cover;filter:contrast(1.03)}
.feature h2{font-family:'Instrument Serif',serif;font-size:clamp(36px,4.5vw,56px);font-weight:400;margin:8px 0 14px;line-height:1}
.kicker{color:${d.c};font-size:12px;text-transform:uppercase;letter-spacing:.2em;font-weight:600}
footer{padding:72px 0;text-align:center;border-top:3px double #1c1917}footer h2{font-family:'Instrument Serif',serif;font-size:54px;font-weight:400;margin:0 0 12px}footer a{margin:0 12px}
@media(max-width:760px){.lead,.feature,.feature:nth-child(even){grid-template-columns:1fr}.feature:nth-child(even) img{order:0}}`,
    body: `<div class="w"><header class="mast"><div class="mast-meta"><span>ISSUE NO. 01 // PORTFOLIO</span><span>${d.loc}</span><span>${d.role}</span></div><h1>${d.name}</h1></header>
<section class="lead"><div><span class="kicker">${L.about}</span><p style="font-style:italic;color:#57534e">${d.role}</p></div><div class="lead-bio" style="font-size:19px;line-height:1.75">${d.bio}</div><div><span class="kicker">${L.skills}</span><p style="font-size:14px;line-height:1.9">${d.skills.join(' · ')}</p></div></section>
<main id="work">${d.projects.map((p, i) => `<article class="feature"><img src="${p.img}" alt="${p.title}"><div><span class="kicker">CHAPTER 0${i + 1} — ${p.cat} (${p.year})</span><h2>${p.title}</h2><p style="font-size:17px;line-height:1.75;color:#44403c">${p.desc}</p>${projLink(p, L)}</div></article>`).join('')}</main>
<footer id="contact"><h2>${L.hire}</h2>${contactLinks(d)}</footer></div>` });
}

// ---------------------------------------------------------------- 26. Open-Source / GitHub Maintainer Hub
function opensource(d, L, lang) {
  const cells = Array.from({ length: 140 }, (_, i) => [0, 1, 2, 3, 4][(i * 7 + 3) % 5]);
  return doc({ lang, title: `${d.name} – Open Source Hub`, fonts: 'family=JetBrains+Mono:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;600;700',
    css: `body{font-family:'Plus Jakarta Sans',sans-serif;background:#0d1117;color:#e6edf3}
.mono{font-family:'JetBrains Mono',monospace}.w{max-width:1140px;margin:0 auto;padding:28px 24px}
.gh-layout{display:grid;grid-template-columns:290px 1fr;gap:32px;align-items:start}
.side img{width:100%;aspect-ratio:1;border-radius:50%;object-fit:cover;border:2px solid #30363d;margin-bottom:16px}
.side h1{font-size:26px;margin:0}.side .role{color:#8b949e;font-size:16px;margin:4px 0 14px}
.readme{background:#161b22;border:1px solid #30363d;border-radius:12px;padding:24px;margin-bottom:24px}
.repos{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;margin-bottom:24px}
.repo{background:#161b22;border:1px solid #30363d;border-radius:12px;padding:18px;display:flex;flex-direction:column;justify-content:space-between;transition:border-color .2s}
.repo:hover{border-color:${d.c}}.repo h3{margin:0 0 8px;font-size:17px;color:${d.c}}.repo p{color:#8b949e;font-size:14px;margin:0 0 14px}
.repo-ft{display:flex;gap:16px;font-size:12px;color:#8b949e;align-items:center}.dot{width:10px;height:10px;border-radius:50%;background:${d.c};display:inline-block;margin-right:5px}
.heat{background:#161b22;border:1px solid #30363d;border-radius:12px;padding:18px;margin-bottom:24px}
.heat-grid{display:grid;grid-template-columns:repeat(28,1fr);gap:4px;margin-top:10px}
.hc{aspect-ratio:1;border-radius:3px;background:#21262d}.hc.l1{background:${d.c}44}.hc.l2{background:${d.c}77}.hc.l3{background:${d.c}bb}.hc.l4{background:${d.c}}
@media(max-width:820px){.gh-layout{grid-template-columns:1fr}.side img{max-width:160px}}`,
    body: `<div class="w"><div class="gh-layout"><aside class="side">${d.avatar ? `<img src="${d.avatar}" alt="">` : `<img src="${placeholder(d.name, 0, d.c)}" alt="">`}<h1>${d.name}</h1><div class="role mono">${d.role}</div><p style="font-size:14px;color:#c9d1d9">${d.bio}</p><div style="font-size:13px;color:#8b949e;margin:14px 0">📍 ${d.loc}</div><div style="display:flex;flex-wrap:wrap;gap:6px">${d.skills.map((s) => `<span class="mono" style="font-size:11px;padding:4px 10px;border-radius:99px;background:#21262d;border:1px solid #30363d">${s}</span>`).join('')}</div></aside>
<main><div class="readme"><div class="mono" style="font-size:12px;color:#8b949e;margin-bottom:10px">${d.first.toLowerCase() || 'user'} / README.md</div><h2 style="margin:0 0 10px">${L.hi} ${d.name} 👋</h2><p style="color:#8b949e;margin:0">${d.bio}</p></div>
<h3 style="margin:0 0 12px;font-size:16px">${L.work} (${d.projects.length})</h3>
<div class="repos">${d.projects.map((p, i) => `<article class="repo"><div><div style="display:flex;justify-content:space-between;align-items:center"><h3>📦 ${p.title}</h3><span class="mono" style="font-size:11px;padding:2px 8px;border:1px solid #30363d;border-radius:99px;color:#8b949e">${p.year || 'Public'}</span></div><p>${p.desc}</p></div><div class="repo-ft"><span><i class="dot"></i>${p.cat || 'Code'}</span><span>★ ${(i + 1) * 42}</span>${projLink(p, L)}</div></article>`).join('')}</div>
<div class="heat"><div class="mono" style="font-size:12px;color:#8b949e">Open-Source Contribution Activity</div><div class="heat-grid">${cells.map((lv) => `<span class="hc l${lv}"></span>`).join('')}</div></div>
<footer id="contact" class="readme" style="text-align:center"><h3>${L.hire}</h3>${contactLinks(d)}</footer></main></div></div>` });
}

// ---------------------------------------------------------------- 27. Industrial & Product Design (Swiss Functionalist)
function industrial(d, L, lang) {
  return doc({ lang, title: `${d.name} – Industrial Design`, fonts: 'family=Space+Grotesk:wght@400;600;700&family=IBM+Plex+Mono:wght@400;600',
    css: `body{font-family:'Space Grotesk',sans-serif;background:#eceae4;color:#181816}
.mono{font-family:'IBM Plex Mono',monospace}.w{max-width:1180px;margin:0 auto;padding:24px}
.spec-sheet{border:2px solid #181816;background:#f7f5f0}
.row-top{display:grid;grid-template-columns:2fr 1fr 1fr;border-bottom:2px solid #181816}
.row-top>div{padding:18px 22px;border-right:1px solid #181816}.row-top>div:last-child{border:0}
.hero{padding:56px 36px;border-bottom:2px solid #181816;display:grid;grid-template-columns:1.5fr 1fr;gap:40px;align-items:center}
.hero h1{font-size:clamp(40px,6vw,78px);line-height:.95;margin:12px 0;letter-spacing:-.03em}
.dot-acc{display:inline-block;width:14px;height:14px;border-radius:50%;background:${d.c};margin-right:8px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(350px,1fr))}
.cell{border-right:1px solid #181816;border-bottom:1px solid #181816;padding:28px}
.cell img{width:100%;aspect-ratio:4/3;object-fit:cover;border:1px solid #181816;margin:14px 0}
footer{padding:44px 36px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:16px}
@media(max-width:760px){.row-top,.hero{grid-template-columns:1fr}}`,
    body: `<div class="w"><div class="spec-sheet"><div class="row-top"><div class="mono"><span class="dot-acc"></span>SPEC // ${d.name}</div><div class="mono">DEPT: ${d.role}</div><div class="mono">LOC: ${d.loc}</div></div>
<section class="hero"><div><div class="mono" style="font-size:12px;color:${d.c}">INDUSTRIAL & PRODUCT SYSTEM</div><h1>${d.name}</h1><p style="font-size:18px;max-width:580px">${d.bio}</p></div><div><div class="mono" style="font-size:12px;margin-bottom:8px">MATERIALS & CAPABILITIES</div><div style="display:flex;flex-wrap:wrap;gap:8px">${d.skills.map((s) => `<span class="mono" style="font-size:12px;padding:6px 12px;border:1px solid #181816;background:#eceae4">${s}</span>`).join('')}</div></div></section>
<section id="work" class="grid">${d.projects.map((p, i) => `<article class="cell"><div class="mono" style="display:flex;justify-content:space-between;font-size:12px"><span>REF.${String(i + 1).padStart(3, '0')}</span><span>${p.cat} // ${p.year}</span></div><img src="${p.img}" alt="${p.title}"><h3>${p.title}</h3><p style="font-size:15px;opacity:.8">${p.desc}</p>${projLink(p, L, 'mono')}</article>`).join('')}</section>
<footer id="contact"><b>${L.hire}</b><div>${contactLinks(d, 'mono')}</div></footer></div></div>` });
}

// ---------------------------------------------------------------- 28. Sound, Music Producer & Audio Studio
function sound(d, L, lang) {
  const bars = Array.from({ length: 48 }, (_, i) => 18 + ((i * 19 + 7) % 72));
  return doc({ lang, title: `${d.name} – Audio & Sound`, fonts: 'family=Syne:wght@700;800&family=IBM+Plex+Mono:wght@400;600',
    css: `body{font-family:'IBM Plex Mono',monospace;background:#09090d;color:#f4f4f6}
.w{max-width:1120px;margin:0 auto;padding:28px 24px}
.deck{background:#12121a;border:1px solid #262638;border-radius:24px;padding:40px;margin-bottom:32px}
h1{font-family:Syne,sans-serif;font-size:clamp(40px,6.5vw,86px);margin:8px 0 16px;line-height:.95}
.wave{display:flex;align-items:center;gap:4px;height:84px;margin:28px 0;cursor:pointer}
.wave span{flex:1;background:${d.c};border-radius:99px;opacity:.75;transition:height .2s,opacity .2s}.wave:hover span{opacity:1}
.tracks{display:grid;gap:14px}
.trk{background:#12121a;border:1px solid #262638;border-radius:16px;padding:18px 22px;display:grid;grid-template-columns:56px 84px 1fr auto;gap:18px;align-items:center;transition:border-color .2s}
.trk:hover{border-color:${d.c}}
.play{width:46px;height:46px;border-radius:50%;background:${d.c};border:0;color:#fff;font-size:16px;cursor:pointer}
.trk img{width:84px;height:64px;object-fit:cover;border-radius:10px}
@media(max-width:700px){.trk{grid-template-columns:46px 1fr}.trk img{display:none}}`,
    body: `<div class="w"><section class="deck"><div style="color:${d.c};font-size:12px">STUDIO MASTER // 48kHz 24-BIT · ${d.loc}</div><h1>${d.name}</h1><p style="color:#a1a1aa;max-width:680px">${d.role} — ${d.bio}</p>
<div class="wave" id="wv" title="Click to preview studio tone">${bars.map((h) => `<span style="height:${h}%"></span>`).join('')}</div>
<div style="display:flex;flex-wrap:wrap;gap:8px">${d.skills.map((s) => `<span style="padding:5px 12px;border:1px solid #2c2c40;border-radius:99px;font-size:12px">${s}</span>`).join('')}</div></section>
<section id="work" class="tracks">${d.projects.map((p, i) => `<article class="trk"><button type="button" class="play" data-tone="${220 + i * 55}">▶</button><img src="${p.img}" alt="${p.title}"><div><div style="font-size:12px;color:${d.c}">${p.cat} · ${p.year}</div><b style="font-family:Syne,sans-serif;font-size:20px">${p.title}</b><div style="font-size:13px;color:#a1a1aa">${p.desc}</div></div><div>${projLink(p, L)}</div></article>`).join('')}</section>
<footer id="contact" class="deck" style="margin-top:32px;text-align:center"><h2>${L.hire}</h2>${contactLinks(d)}</footer></div>`,
    script: `function beep(f){try{const c=new(window.AudioContext||window.webkitAudioContext)(),o=c.createOscillator(),g=c.createGain();o.type='triangle';o.frequency.value=f;g.gain.setValueAtTime(.12,c.currentTime);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+.65);o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.65)}catch(e){}}
document.querySelectorAll('[data-tone]').forEach(b=>b.addEventListener('click',()=>beep(+b.dataset.tone)));
const wv=document.getElementById('wv');if(wv)wv.addEventListener('click',()=>beep(330));` });
}

// ---------------------------------------------------------------- 29. Thủy Mặc & Giấy Dó Đông Phương (Oriental Ink Wash & Red Seal)
function inkwash(d, L, lang) {
  const sealTxt = e(String(d.first || d.name || 'ẤN').slice(0, 2).toUpperCase());
  return doc({ lang, title: `${d.name} – Thủy Mặc & Giấy Dó`, fonts: 'family=Playfair+Display:ital,wght@0,500;0,800;1,400&family=Lora:ital,wght@0,400;0,600;1,400',
    css: `body{font-family:'Lora',Georgia,serif;background:#f4efe4;color:#1a1816;background-image:radial-gradient(ellipse at 20% 10%,rgba(26,24,22,.06),transparent 60%),radial-gradient(ellipse at 85% 80%,rgba(185,28,28,.05),transparent 55%)}
.w{max-width:1100px;margin:0 auto;padding:36px 28px}
.frame{border:1px solid #292524;padding:8px;background:#f8f4ea;box-shadow:0 24px 60px rgba(26,24,22,.09)}
.inner{border:2px solid #292524;padding:48px 40px;position:relative;overflow:hidden}
.ink-splash{position:absolute;right:-60px;top:-40px;width:420px;height:420px;opacity:.11;pointer-events:none}
.seal{display:inline-grid;place-items:center;width:54px;height:54px;background:#b91c1c;color:#f8f4ea;border:2px solid #991b1b;border-radius:6px;font-weight:800;font-size:18px;letter-spacing:2px;box-shadow:2px 3px 0 rgba(185,28,28,.35);transform:rotate(-4deg)}
.hero{display:grid;grid-template-columns:1fr auto;gap:36px;align-items:center;padding-bottom:48px;border-bottom:1px solid #d6cfc2}
.hero h1{font-family:'Playfair Display',serif;font-size:clamp(42px,6.5vw,84px);font-weight:800;line-height:.96;margin:12px 0 18px}
.vert{writing-mode:vertical-rl;text-orientation:mixed;letter-spacing:.25em;font-size:13px;color:#57534e;border-left:1px solid #a8a29e;padding-left:12px;max-height:240px}
.brush-stroke{height:18px;width:240px;margin:10px 0 20px;color:${d.c}}
.scrolls{display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:32px;padding:44px 0}
.scroll{background:#fdfbf7;border:1px solid #c7bfb0;padding:18px;position:relative;transition:transform .35s}
.scroll::before,.scroll::after{content:"";position:absolute;left:-6px;right:-6px;height:8px;background:#292524;border-radius:4px}
.scroll::before{top:-4px}.scroll::after{bottom:-4px}
.scroll:hover{transform:translateY(-6px)}
.scroll img{width:100%;aspect-ratio:4/3;object-fit:cover;filter:contrast(1.04) sepia(.12);border:1px solid #e7e0d3}
.scroll h3{font-family:'Playfair Display',serif;font-size:24px;margin:14px 0 6px}
@media(max-width:740px){.hero{grid-template-columns:1fr}.vert{display:none}.inner{padding:28px 20px}}`,
    body: `<div class="w"><div class="frame"><div class="inner">
<svg class="ink-splash" viewBox="0 0 400 400"><defs><filter id="inkf"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="36"/></filter></defs><circle cx="200" cy="200" r="145" fill="#111" filter="url(#inkf)"/></svg>
<header style="display:flex;justify-content:space-between;align-items:center;margin-bottom:36px"><div style="display:flex;align-items:center;gap:14px"><span class="seal">${sealTxt}</span><div><b style="font-size:18px">${d.name}</b><div style="font-size:12px;color:#78716c">${d.role} · ${d.loc}</div></div></div><nav style="display:flex;gap:20px;font-size:14px"><a href="#work">${L.work}</a><a href="#contact">${L.contact}</a></nav></header>
<section class="hero"><div><div style="color:#b91c1c;font-style:italic;font-size:15px">✦ ${d.avail || d.role}</div><h1>${d.name}</h1>
<svg class="brush-stroke" viewBox="0 0 300 24"><path d="M4,14 Q90,2 180,15 T295,10" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/></svg>
<p style="font-size:18px;line-height:1.8;color:#44403c;max-width:620px">${d.bio}</p></div><div class="vert">${d.manifesto || `${d.name} · ${d.role} · ${d.loc}`}</div></section>
<section id="work" class="scrolls">${d.projects.map((p, i) => `<article class="scroll"><div style="display:flex;justify-content:space-between;font-size:11px;color:#78716c;margin-bottom:8px"><span>QUYỂN 0${i + 1} // ${p.cat}</span><span>${p.year}</span></div><img src="${p.img}" alt="${p.title}"><h3>${p.title}</h3><p style="font-size:14.5px;color:#57534e;line-height:1.65">${p.desc}</p>${projLink(p, L)}</article>`).join('')}</section>
<section style="padding:24px 0;border-top:1px solid #d6cfc2;display:flex;flex-wrap:wrap;gap:10px">${d.skills.map((s) => `<span style="padding:6px 14px;border:1px solid #78716c;border-radius:99px;font-size:13px;background:#f4efe4">${s}</span>`).join('')}</section>
<footer id="contact" style="padding-top:40px;border-top:1px solid #d6cfc2;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px"><div><h2 style="font-family:'Playfair Display',serif;margin:0 0 8px">${L.hire}</h2><div>${contactLinks(d)}</div></div><span class="seal">${sealTxt}</span></footer>
</div></div></div>` });
}

// ---------------------------------------------------------------- 30. Sổ Tay Thực Vật & Ký Họa Cổ Điển (Vintage Botanical Field Journal)
function botanical(d, L, lang) {
  return doc({ lang, title: `${d.name} – Botanical Field Journal`, fonts: 'family=Lora:ital,wght@0,400;0,600;1,400&family=Caveat:wght@600;700',
    css: `body{font-family:'Lora',Georgia,serif;background:#f3ede0;color:#2b2118;background-image:repeating-linear-gradient(0deg,transparent,transparent 31px,rgba(107,142,99,.12) 31px,rgba(107,142,99,.12) 32px)}
.hand{font-family:'Caveat',cursive}.w{max-width:1080px;margin:0 auto;padding:36px 24px}
.journal{background:#faf6ed;border:1px solid #bba98e;box-shadow:0 20px 50px rgba(43,33,24,.12),inset 0 0 60px rgba(187,169,142,.25);padding:48px 44px;position:relative}
.herb-svg{position:absolute;top:24px;right:28px;width:120px;height:160px;opacity:.55;pointer-events:none}
.hero{border-bottom:2px double #8c7a60;padding-bottom:36px;margin-bottom:36px}
.spec-tag{display:inline-block;border:1px solid #6b8e63;color:#3f5e39;background:#e9f0e6;padding:3px 12px;font-size:11px;letter-spacing:.16em;text-transform:uppercase}
.hero h1{font-size:clamp(38px,5.8vw,72px);font-weight:600;margin:12px 0 8px;line-height:1}
.plates{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:28px}
.plate{background:#fffdf8;border:1px solid #cbbba0;padding:18px;box-shadow:3px 4px 12px rgba(43,33,24,.06);position:relative}
.pin{width:12px;height:12px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#fde68a,#b45309);margin:0 auto 10px;box-shadow:0 2px 4px rgba(0,0,0,.3)}
.plate img{width:100%;aspect-ratio:4/3;object-fit:cover;border:1px solid #d8cbb5;padding:6px;background:#faf6ed}
.plate-no{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#6b8e63;margin-top:12px;display:block}
@media(max-width:700px){.journal{padding:26px 18px}}`,
    body: `<div class="w"><div class="journal">
<svg class="herb-svg" viewBox="0 0 120 180" fill="none" stroke="#3f5e39" stroke-width="2"><path d="M60,170 Q55,95 75,15 M62,130 Q30,110 20,85 Q45,90 62,115 M65,95 Q95,75 105,50 Q80,60 64,82 M68,60 Q40,45 32,25 Q55,35 68,52"/></svg>
<section class="hero"><span class="spec-tag">HERBARIUM & FIELD NOTES // ${d.loc}</span><h1>${d.name}</h1><div class="hand" style="font-size:30px;color:${d.c}">${d.role}</div><p style="max-width:650px;font-size:17px;line-height:1.75">${d.bio}</p></section>
<section id="work"><h2 style="font-weight:400;letter-spacing:.12em;text-transform:uppercase;font-size:15px;color:#6b8e63;margin-bottom:20px">✦ ${L.work} — SPECIMEN PLATES</h2>
<div class="plates">${d.projects.map((p, i) => `<article class="plate"><div class="pin"></div><img src="${p.img}" alt="${p.title}"><span class="plate-no">PLATE 0${i + 1} · ${p.cat} (${p.year})</span><h3 style="margin:6px 0;font-size:22px">${p.title}</h3><p style="font-size:14.5px;color:#5c4d3c;line-height:1.6">${p.desc}</p><div class="hand" style="font-size:22px;color:${d.c}">${projLink(p, L)}</div></article>`).join('')}</div></section>
<section style="margin-top:40px;padding-top:28px;border-top:1px dashed #bba98e"><b style="font-size:13px;letter-spacing:.15em;text-transform:uppercase;color:#6b8e63">${L.skills}:</b> <span class="hand" style="font-size:24px">${d.skills.join('  ·  ')}</span></section>
<footer id="contact" style="margin-top:40px;padding-top:28px;border-top:2px double #8c7a60;text-align:center"><h2 class="hand" style="font-size:44px;margin:0 0 8px;color:${d.c}">${L.hire}</h2>${contactLinks(d)}</footer>
</div></div>` });
}

// ---------------------------------------------------------------- 31. Truyện Tranh & Manga Storyboard (Comic Panel & Halftone Zine)
function comic(d, L, lang) {
  return doc({ lang, title: `${d.name} – Comic & Storyboard`, fonts: 'family=Bangers&family=Patrick+Hand&family=Be+Vietnam+Pro:wght@500;800',
    css: `body{font-family:'Be Vietnam Pro',sans-serif;background:#fef08a;color:#111;background-image:radial-gradient(#f59e0b 1.5px,transparent 1.5px);background-size:14px 14px}
.bang{font-family:'Bangers',cursive;letter-spacing:1.5px}.hand{font-family:'Patrick Hand',cursive}
.w{max-width:1120px;margin:0 auto;padding:24px}
.page{background:#fff;border:4px solid #111;box-shadow:10px 10px 0 #111;padding:24px}
.panels{display:grid;grid-template-columns:repeat(12,1fr);gap:16px}
.pn{border:3.5px solid #111;position:relative;overflow:hidden;background:#fff;padding:22px}
.pn-hero{grid-column:span 8;background:linear-gradient(135deg,${d.c},#fbbf24);color:#111}
.pn-av{grid-column:span 4;background:#e0f2fe;display:grid;place-items:center;text-align:center}
.bubble{background:#fff;border:3px solid #111;border-radius:28px;padding:18px 22px;position:relative;box-shadow:5px 5px 0 #111;margin-top:14px}
.bubble::after{content:"";position:absolute;top:-16px;left:36px;border-width:0 14px 16px 0;border-style:solid;border-color:transparent #111;display:block;width:0}
.sfx{display:inline-block;background:#ef4444;color:#fff;border:3px solid #111;padding:4px 14px;font-family:'Bangers',cursive;font-size:24px;transform:rotate(-6deg);box-shadow:4px 4px 0 #111}
.p-card{grid-column:span 6;padding:0;display:flex;flex-direction:column;transition:transform .2s}.p-card:nth-child(3n){grid-column:span 12}
.p-card:hover{transform:scale(1.015) rotate(-.5deg)}
.p-card img{width:100%;aspect-ratio:16/9;object-fit:cover;border-bottom:3.5px solid #111;filter:contrast(1.1)}
.cap-box{background:#fde047;border-bottom:3px solid #111;padding:6px 14px;font-weight:800;font-size:12px;text-transform:uppercase;display:flex;justify-content:space-between}
@media(max-width:760px){.pn-hero,.pn-av,.p-card,.p-card:nth-child(3n){grid-column:span 12}}`,
    body: `<div class="w"><div class="page"><div class="panels">
<div class="pn pn-hero"><span class="sfx">POW! ISSUE #01</span><h1 class="bang" style="font-size:clamp(46px,7vw,86px);margin:10px 0 4px;line-height:.95;color:#fff;text-shadow:4px 4px 0 #111">${d.name}</h1><div style="display:inline-block;background:#111;color:#fde047;padding:4px 12px;font-weight:800;font-size:14px">${d.role} · ${d.loc}</div><div class="bubble"><p class="hand" style="font-size:22px;margin:0">“${d.bio}”</p></div></div>
<div class="pn pn-av">${d.avatar ? `<img src="${d.avatar}" alt="" style="width:150px;height:150px;border-radius:50%;object-fit:cover;border:4px solid #111;box-shadow:5px 5px 0 #111">` : `<div class="bang" style="font-size:72px;color:${d.c}">${d.first}</div>`}<div class="hand" style="font-size:22px;margin-top:10px">${d.skills.slice(0, 5).join(' ★ ')}</div></div>
${d.projects.map((p, i) => `<article class="pn p-card"><div class="cap-box"><span>EPISODE 0${i + 1} // ${p.cat}</span><span>${p.year}</span></div><img src="${p.img}" alt="${p.title}"><div style="padding:18px"><h3 class="bang" style="font-size:32px;margin:0 0 6px">${p.title}</h3><p class="hand" style="font-size:20px;margin:0 0 10px">${p.desc}</p>${projLink(p, L, 'sfx')}</div></article>`).join('')}
</div>
<footer id="contact" style="margin-top:20px;border:3.5px solid #111;background:#111;color:#fff;padding:28px;text-align:center"><h2 class="bang" style="font-size:48px;margin:0 0 10px;color:#fde047">TO BE CONTINUED... ${L.hire}!</h2><div style="color:#fde047;font-weight:700">${contactLinks(d)}</div></footer>
</div></div>` });
}

// ---------------------------------------------------------------- 32. Màu Nước & Bút Chì Màu (Watercolor & Colored Pencil Atelier)
function watercolor(d, L, lang) {
  return doc({ lang, title: `${d.name} – Watercolor Atelier`, fonts: 'family=Caveat:wght@600;700&family=Plus+Jakarta+Sans:wght@400;600;700',
    css: `body{font-family:'Plus Jakarta Sans',sans-serif;background:#fcfaf5;color:#2d2a26;background-image:radial-gradient(circle at 12% 18%,${d.c}2e 0,transparent 38%),radial-gradient(circle at 86% 22%,#f4a26138 0,transparent 40%),radial-gradient(circle at 30% 78%,#a8dadc44 0,transparent 45%),radial-gradient(circle at 80% 82%,#e76f5129 0,transparent 38%)}
.hand{font-family:'Caveat',cursive}.w{max-width:1100px;margin:0 auto;padding:32px 24px}
.pans{display:flex;gap:10px;align-items:center;margin-bottom:28px}
.pan{width:34px;height:24px;border-radius:6px;border:2px solid #3d3833;box-shadow:inset 0 -4px 0 rgba(0,0,0,.15)}
.hero{padding:44px 36px;border-radius:36px 18px 42px 20px;background:rgba(255,255,255,.78);backdrop-filter:blur(8px);border:2px dashed #b8ada0;position:relative;margin-bottom:44px}
.hero h1{font-family:'Caveat',cursive;font-size:clamp(54px,8vw,96px);line-height:.92;margin:0;color:${d.c}}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:30px}
.card{background:#fff;padding:18px;border-radius:24px 12px 28px 14px;border:2px solid #3d3833;box-shadow:6px 8px 0 ${d.c}33;transition:transform .3s}
.card:hover{transform:translateY(-6px) rotate(-1deg)}
.card img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:16px 8px 20px 10px}
.card h3{font-family:'Caveat',cursive;font-size:34px;margin:12px 0 4px;color:#1f1d1a}`,
    body: `<div class="w"><header style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px"><div class="pans">${[d.c, '#f4a261', '#2a9d8f', '#e76f51', '#8ecae6', '#e9c46a'].map((col) => `<span class="pan" style="background:${col}"></span>`).join('')}<b class="hand" style="font-size:28px;margin-left:8px">${d.name} Atelier</b></div><nav class="hand" style="font-size:26px;display:flex;gap:18px"><a href="#work">${L.work}</a><a href="#contact">${L.contact}</a></nav></header>
<section class="hero">${d.avatar ? `<img src="${d.avatar}" alt="" style="width:110px;height:110px;border-radius:50%;object-fit:cover;border:3px solid ${d.c};float:right;margin-left:20px">` : ''}<span class="hand" style="font-size:26px;color:#6b635b">🎨 ${d.role} · ${d.loc}</span><h1>${d.name}</h1><p style="font-size:18px;line-height:1.75;max-width:680px">${d.bio}</p><div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:16px">${d.skills.map((s) => `<span class="hand" style="font-size:22px;padding:3px 14px;border-radius:99px;background:${d.c}1c;border:1.5px solid ${d.c}">${s}</span>`).join('')}</div></section>
<section id="work" class="grid">${d.projects.map((p) => `<article class="card"><img src="${p.img}" alt="${p.title}"><div class="hand" style="font-size:20px;color:${d.c};margin-top:8px">${p.cat} · ${p.year}</div><h3>${p.title}</h3><p style="font-size:15px;color:#57534e">${p.desc}</p><div class="hand" style="font-size:24px;color:${d.c}">${projLink(p, L)}</div></article>`).join('')}</section>
<footer id="contact" class="hero" style="margin-top:48px;text-align:center"><h2 class="hand" style="font-size:52px;margin:0 0 8px;color:${d.c}">${L.hire} 🖌</h2>${contactLinks(d)}</footer></div>` });
}

// ---------------------------------------------------------------- 33. Ấn Bản Risograph & Indie Zine (Two-Tone Overprint Zine)
function risograph(d, L, lang) {
  return doc({ lang, title: `${d.name} – Risograph Zine`, fonts: 'family=Syne:wght@700;800&family=IBM+Plex+Mono:wght@400;600',
    css: `body{font-family:'IBM Plex Mono',monospace;background:#f7f3e8;color:#1d3557;background-image:radial-gradient(#e63946 0.65px,transparent 0.65px),radial-gradient(#1d3557 0.65px,#f7f3e8 0.65px);background-size:26px 26px;background-position:0 0,13px 13px}
.w{max-width:1100px;margin:0 auto;padding:28px 24px}
.zine{background:#f7f3e8;border:3px solid #1d3557;padding:36px;position:relative;box-shadow:10px 10px 0 ${d.c}}
.riso-h1{font-family:Syne,sans-serif;font-size:clamp(44px,7.5vw,96px);line-height:.9;margin:12px 0;text-transform:uppercase;color:#1d3557;text-shadow:4px 3px 0 ${d.c};mix-blend-mode:multiply}
.stamp{display:inline-block;border:2px solid #e63946;color:#e63946;padding:4px 12px;font-weight:700;font-size:12px;transform:rotate(-3deg);text-transform:uppercase}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:28px;margin-top:36px}
.item{border:2.5px solid #1d3557;background:#fff;padding:18px;position:relative;box-shadow:6px 6px 0 #e63946}
.item img{width:100%;aspect-ratio:4/3;object-fit:cover;filter:contrast(1.15) saturate(1.2);mix-blend-mode:multiply}
.item h3{font-family:Syne,sans-serif;font-size:24px;margin:12px 0 6px}`,
    body: `<div class="w"><div class="zine"><div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #1d3557;padding-bottom:14px"><span class="stamp">RISO PRINT // EDITION #01</span><span>${d.loc}</span></div>
<h1 class="riso-h1">${d.name}</h1><p style="font-size:16px;max-width:680px;background:#fff;border:2px solid #1d3557;padding:14px 18px"><b>${d.role}:</b> ${d.bio}</p>
<section id="work" class="grid">${d.projects.map((p, i) => `<article class="item"><div style="font-size:11px;font-weight:700;color:#e63946;margin-bottom:8px">PRINT 0${i + 1} // ${p.cat} (${p.year})</div><img src="${p.img}" alt="${p.title}"><h3>${p.title}</h3><p style="font-size:13.5px">${p.desc}</p>${projLink(p, L)}</article>`).join('')}</section>
<footer id="contact" style="margin-top:44px;border-top:2px solid #1d3557;padding-top:28px;text-align:center"><h2 style="font-family:Syne,sans-serif;font-size:40px;margin:0 0 10px">${L.hire}</h2>${contactLinks(d)}</footer></div></div>` });
}

// ---------------------------------------------------------------- 34. Nhật Ký Dán Ảnh Polaroid & Washi Tape (Analog Scrapbook)
function scrapbook(d, L, lang) {
  const tapes = ['#fca5a5', '#fde047', '#86efac', '#93c5fd', '#d8b4fe'];
  return doc({ lang, title: `${d.name} – Polaroid Scrapbook`, fonts: 'family=Caveat:wght@600;700&family=Be+Vietnam+Pro:wght@400;600',
    css: `body{font-family:'Be Vietnam Pro',sans-serif;background:#e6ccb2;color:#2b2118;background-image:radial-gradient(#b08968 1px,transparent 1px);background-size:18px 18px}
.hand{font-family:'Caveat',cursive}.w{max-width:1120px;margin:0 auto;padding:36px 24px}
.note{background:#fef9c3;border:1px solid #eab308;padding:32px;max-width:740px;margin:0 auto 48px;box-shadow:6px 10px 24px rgba(0,0,0,.15);transform:rotate(-1deg);position:relative}
.washi{width:120px;height:30px;margin:-46px auto 14px;opacity:.85;transform:rotate(2deg);box-shadow:0 2px 4px rgba(0,0,0,.12)}
.wall{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:36px}
.pol{background:#fff;padding:16px 16px 28px;box-shadow:0 14px 28px rgba(0,0,0,.18);transition:transform .3s;position:relative}
.pol:nth-child(odd){transform:rotate(-2.2deg)}.pol:nth-child(even){transform:rotate(1.8deg)}
.pol:hover{transform:rotate(0deg) scale(1.04);z-index:5}
.pol img{width:100%;aspect-ratio:1;object-fit:cover;background:#f5f5f4}`,
    body: `<div class="w"><section class="note"><div class="washi" style="background:${d.c}"></div>${d.avatar ? `<img src="${d.avatar}" alt="" style="width:96px;height:96px;object-fit:cover;border:4px solid #fff;box-shadow:0 4px 10px rgba(0,0,0,.2);float:right;transform:rotate(4deg)">` : ''}<div class="hand" style="font-size:26px;color:${d.c}">📌 ${d.role} · ${d.loc}</div><h1 class="hand" style="font-size:64px;margin:0;line-height:1">${d.name}</h1><p style="font-size:16px;line-height:1.7">${d.bio}</p><div style="display:flex;flex-wrap:wrap;gap:8px">${d.skills.map((s) => `<span class="hand" style="font-size:22px;background:#fff;padding:2px 12px;box-shadow:2px 2px 5px rgba(0,0,0,.1)">#${s}</span>`).join('')}</div></section>
<section id="work" class="wall">${d.projects.map((p, i) => `<article class="pol"><div class="washi" style="background:${tapes[i % tapes.length]}"></div><img src="${p.img}" alt="${p.title}"><h3 class="hand" style="font-size:34px;margin:12px 0 2px">${p.title}</h3><div class="hand" style="font-size:20px;color:${d.c}">${p.cat} · ${p.year}</div><p style="font-size:14px;color:#57534e;margin:6px 0">${p.desc}</p><div class="hand" style="font-size:24px;color:${d.c}">${projLink(p, L)}</div></article>`).join('')}</section>
<footer id="contact" class="note" style="margin-top:56px;text-align:center;transform:rotate(1deg)"><div class="washi" style="background:#86efac"></div><h2 class="hand" style="font-size:52px;margin:0">${L.hire} ✉</h2>${contactLinks(d)}</footer></div>` });
}

// ---------------------------------------------------------------- 35. Hội Họa Hình Học Bauhaus (Bauhaus Constructivist Canvas)
function bauhausArt(d, L, lang) {
  return doc({ lang, title: `${d.name} – Bauhaus Art`, fonts: 'family=Syne:wght@700;800&family=Space+Grotesk:wght@400;700',
    css: `body{font-family:'Space Grotesk',sans-serif;background:#f4f1ea;color:#111}
.w{max-width:1180px;margin:0 auto;padding:24px}
.canvas{border:4px solid #111;background:#f4f1ea;display:grid;grid-template-columns:repeat(12,1fr)}
.cell{border:2px solid #111;padding:28px;position:relative}
.c-red{background:#e63946;color:#fff}.c-yel{background:#ffb703;color:#111}.c-blu{background:#1d3557;color:#fff}
.hero-m{grid-column:span 8}.hero-s{grid-column:span 4;display:grid;place-items:center}
.proj-c{grid-column:span 6}.proj-c img{width:100%;aspect-ratio:4/3;object-fit:cover;border:3px solid #111;margin:12px 0}
@media(max-width:760px){.hero-m,.hero-s,.proj-c{grid-column:span 12}}`,
    body: `<div class="w"><div class="canvas">
<div class="cell hero-m"><div style="font-weight:700;letter-spacing:.15em;text-transform:uppercase;font-size:12px">WEIMAR // DESAU // ${d.loc}</div><h1 style="font-family:Syne,sans-serif;font-size:clamp(44px,7vw,88px);line-height:.92;margin:12px 0">${d.name}</h1><div style="display:inline-block;background:#e63946;color:#fff;padding:6px 14px;font-weight:700">${d.role}</div><p style="font-size:18px;margin-top:16px">${d.bio}</p></div>
<div class="cell hero-s c-blu"><svg viewBox="0 0 200 200" width="170"><circle cx="100" cy="100" r="80" fill="#ffb703"/><polygon points="100,20 180,170 20,170" fill="#e63946"/><circle cx="100" cy="115" r="28" fill="#111"/></svg></div>
<div class="cell c-yel" style="grid-column:span 12;display:flex;flex-wrap:wrap;gap:12px;align-items:center"><b>FORM FOLLOWS FUNCTION //</b>${d.skills.map((s) => `<span style="border:2px solid #111;background:#f4f1ea;padding:4px 12px;font-weight:700">${s}</span>`).join('')}</div>
${d.projects.map((p, i) => `<article class="cell proj-c"><div style="display:flex;justify-content:space-between;font-weight:700"><span>WERK 0${i + 1}</span><span>${p.cat} · ${p.year}</span></div><img src="${p.img}" alt="${p.title}"><h3 style="font-family:Syne,sans-serif;font-size:28px;margin:6px 0">${p.title}</h3><p>${p.desc}</p>${projLink(p, L)}</article>`).join('')}
<footer id="contact" class="cell c-red" style="grid-column:span 12;text-align:center"><h2 style="font-family:Syne,sans-serif;font-size:44px;margin:0 0 10px">${L.hire}</h2>${contactLinks(d)}</footer>
</div></div>` });
}

// ---------------------------------------------------------------- 36. Street Art & Calligraffiti (Cyber Ink & Graffiti Zine)
function cyberInk(d, L, lang) {
  return doc({ lang, title: `${d.name} – Street Ink & Graffiti`, fonts: 'family=Permanent+Marker&family=Space+Grotesk:wght@400;700',
    css: `body{font-family:'Space Grotesk',sans-serif;background:#0a0a0c;color:#f4f4f5;background-image:radial-gradient(circle at 80% 15%,${d.c}44,transparent 40%),radial-gradient(circle at 15% 80%,#f43f5e33,transparent 45%)}
.marker{font-family:'Permanent Marker',cursive}.w{max-width:1140px;margin:0 auto;padding:28px 24px}
.wall-hero{border:2px solid #27272a;background:#121216;padding:48px 40px;position:relative;overflow:hidden;border-radius:18px;margin-bottom:36px}
.tag-h1{font-family:'Permanent Marker',cursive;font-size:clamp(48px,8.5vw,110px);line-height:.92;margin:8px 0;color:#fff;text-shadow:4px 4px 0 ${d.c},-2px -2px 0 #f43f5e;transform:rotate(-1.5deg)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:26px}
.deck{background:#16161d;border:2px solid #2e2e3a;border-radius:16px;overflow:hidden;transition:transform .25s,border-color .25s}
.deck:hover{transform:translateY(-6px) rotate(.8deg);border-color:${d.c}}
.deck img{width:100%;aspect-ratio:4/3;object-fit:cover}`,
    body: `<div class="w"><section class="wall-hero"><span class="marker" style="color:${d.c};font-size:22px">⚡ UNDERGROUND COLLECTIVE // ${d.loc}</span><h1 class="tag-h1">${d.name}</h1><p style="font-size:18px;color:#d4d4d8;max-width:660px">${d.role} — ${d.bio}</p><div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:18px">${d.skills.map((s) => `<span class="marker" style="background:${d.c};color:#000;padding:4px 14px;transform:rotate(-2deg)">${s}</span>`).join('')}</div></section>
<section id="work" class="grid">${d.projects.map((p) => `<article class="deck"><img src="${p.img}" alt="${p.title}"><div style="padding:20px"><span class="marker" style="color:${d.c}">${p.cat} · ${p.year}</span><h3 class="marker" style="font-size:28px;margin:6px 0">${p.title}</h3><p style="color:#a1a1aa">${p.desc}</p>${projLink(p, L, 'marker')}</div></article>`).join('')}</section>
<footer id="contact" class="wall-hero" style="margin-top:40px;text-align:center"><h2 class="marker" style="font-size:48px;color:${d.c};margin:0 0 10px">${L.hire}</h2>${contactLinks(d)}</footer></div>` });
}

// ---------------------------------------------------------------- 37. Chiêm Tinh & Khắc Gỗ Cổ (Celestial Tarot & Alchemy)
function tarotAlchemy(d, L, lang) {
  const romans = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  return doc({ lang, title: `${d.name} – Celestial Arcana`, fonts: 'family=Playfair+Display:ital,wght@0,500;0,700;1,400&family=Lora:ital,wght@0,400;1,400',
    css: `body{font-family:'Lora',Georgia,serif;background:#0c0a18;color:#f3e8d2;background-image:radial-gradient(circle at 50% 0%,#2e1f5e,transparent 65%)}
.w{max-width:1120px;margin:0 auto;padding:36px 24px}
.astro{text-align:center;padding:56px 24px;border:1px solid #d4af3766;border-radius:220px 220px 24px 24px;background:rgba(18,14,36,.85);margin-bottom:48px;position:relative}
.astro h1{font-family:'Playfair Display',serif;font-size:clamp(42px,6.5vw,82px);color:#f7d774;margin:10px 0;letter-spacing:.03em}
.arcana{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:28px}
.tarot{border:2px solid #d4af37;border-radius:160px 160px 16px 16px;padding:24px 20px 22px;background:#131026;text-align:center;transition:transform .35s,box-shadow .35s}
.tarot:hover{transform:translateY(-8px);box-shadow:0 20px 45px rgba(212,175,55,.18)}
.tarot img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:130px 130px 10px 10px;border:1px solid #d4af3788;margin:10px 0}`,
    body: `<div class="w"><section class="astro"><div style="color:#d4af37;letter-spacing:.3em;font-size:12px">✦ CELESTIAL ATELIER · ${d.loc} ✦</div><h1>${d.name}</h1><div style="font-style:italic;color:#d4af37;font-size:18px;margin-bottom:14px">${d.role}</div><p style="max-width:620px;margin:0 auto;line-height:1.75;color:#d8ccb8">${d.bio}</p></section>
<section id="work" class="arcana">${d.projects.map((p, i) => `<article class="tarot"><div style="color:#d4af37;font-size:12px;letter-spacing:.25em">ARCANA ${romans[i % romans.length]}</div><img src="${p.img}" alt="${p.title}"><h3 style="font-family:'Playfair Display',serif;font-size:24px;color:#f7d774;margin:8px 0 4px">${p.title}</h3><div style="font-size:12px;color:#a799b7;margin-bottom:8px">${p.cat} · ${p.year}</div><p style="font-size:14px;color:#d8ccb8">${p.desc}</p>${projLink(p, L)}</article>`).join('')}</section>
<footer id="contact" style="margin-top:52px;padding:44px;border-top:1px solid #d4af3755;text-align:center"><h2 style="font-family:'Playfair Display',serif;color:#f7d774;font-size:40px;margin:0 0 10px">${L.hire}</h2>${contactLinks(d)}</footer></div>` });
}

// ---------------------------------------------------------------- 38. Đất Sét & Thủ Công (Tactile Clay & Stitched Craft)
function clayPlay(d, L, lang) {
  return doc({ lang, title: `${d.name} – Tactile Clay & Craft`, fonts: 'family=Plus+Jakarta+Sans:wght@500;700;800',
    css: `body{font-family:'Plus Jakarta Sans',sans-serif;background:#f5ebe6;color:#2b2523}
.w{max-width:1120px;margin:0 auto;padding:32px 24px}
.clay{background:#fff8f5;border-radius:36px;padding:40px;box-shadow:16px 20px 40px rgba(120,85,70,.14),inset -6px -6px 14px rgba(120,85,70,.08),inset 6px 6px 16px #fff;border:2px dashed ${d.c}55}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:28px;margin-top:32px}
.p-clay{background:#fff8f5;border-radius:28px;padding:20px;box-shadow:12px 16px 30px rgba(120,85,70,.12),inset -4px -4px 10px rgba(120,85,70,.07),inset 4px 4px 12px #fff;transition:transform .3s cubic-bezier(.34,1.56,.64,1)}
.p-clay:hover{transform:translateY(-8px) scale(1.02)}
.p-clay img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:20px}`,
    body: `<div class="w"><section class="clay"><span style="display:inline-block;padding:6px 16px;border-radius:99px;background:${d.c};color:#fff;font-weight:800;font-size:13px;box-shadow:inset -2px -2px 6px rgba(0,0,0,.2)">✿ ${d.role} · ${d.loc}</span><h1 style="font-size:clamp(40px,6vw,74px);margin:14px 0 10px;letter-spacing:-.03em">${d.name}</h1><p style="font-size:18px;line-height:1.7;color:#5c504c;max-width:650px">${d.bio}</p><div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:18px">${d.skills.map((s) => `<span style="padding:8px 16px;border-radius:99px;background:#f5ebe6;font-weight:700;font-size:13px">${s}</span>`).join('')}</div></section>
<section id="work" class="grid">${d.projects.map((p) => `<article class="p-clay"><img src="${p.img}" alt="${p.title}"><div style="margin-top:14px"><small style="color:${d.c};font-weight:800">${p.cat} · ${p.year}</small><h3 style="font-size:22px;margin:4px 0 6px">${p.title}</h3><p style="font-size:14.5px;color:#5c504c">${p.desc}</p>${projLink(p, L)}</div></article>`).join('')}</section>
<footer id="contact" class="clay" style="margin-top:36px;text-align:center"><h2>${L.hire}</h2>${contactLinks(d)}</footer></div>` });
}

export const PORTFOLIO_FIELDS = {
  vi: { handcraft: '🎨 Vẽ tay – Nghệ thuật Độc bản', design: 'Thiết kế đồ họa', art: 'Minh họa – Vẽ tay', motion: 'Motion – Video', uiux: 'UI/UX – Sản phẩm', '3d': '3D – Game – Công nghiệp', arch: 'Kiến trúc – Nội thất', photo: 'Nhiếp ảnh', fashion: 'Thời trang', dev: 'Lập trình & AI', business: 'Kinh doanh – Nội dung – Âm thanh' },
  en: { handcraft: '🎨 Hand-drawn & Bespoke Art', design: 'Graphic design', art: 'Illustration', motion: 'Motion & video', uiux: 'UI/UX & Product', '3d': '3D, Game & Industrial', arch: 'Architecture', photo: 'Photography', fashion: 'Fashion', dev: 'Dev, AI & Open Source', business: 'Business, Media & Sound' }
};

export const PORTFOLIO_STYLES = [
  { id: 'behance', fn: behance, vi: 'Case Study Artboard 1400px', en: 'Case Study (1400px Boards)', fields: ['design', 'uiux', 'art', 'arch', 'motion', '3d', 'handcraft'], desc: { vi: 'Bố cục Artboard: Bìa Poster, Mục lục & CV Spread, Bảng phân tích dự án + Bản vẽ phác thảo & Pantone', en: '1400px boards: Cover Poster, Index & CV Spread, Multi-frame Case Studies & Pantone specs' } },
  { id: 'inkwash', fn: inkwash, vi: 'Thủy Mặc & Giấy Dó (Vẽ tay)', en: 'Oriental Ink & Dó Paper', fields: ['handcraft', 'art', 'design', 'arch', 'fashion'], desc: { vi: 'Nét bút lông thủy mặc SVG, dấu triện son đỏ cá nhân, cuộn tranh giấy dó độc bản', en: 'Hand-brushed SVG ink strokes, vermilion seal stamp & traditional paper scrolls' } },
  { id: 'watercolor', fn: watercolor, vi: 'Màu Nước & Chì Màu (Vẽ tay)', en: 'Watercolor & Pencil Atelier', fields: ['handcraft', 'art', 'design', 'fashion'], desc: { vi: 'Loang màu nước pastel, khay màu họa sĩ, viền nét chì phác thảo thủ công', en: 'Soft watercolor washes, artist paint pans & hand-drawn pencil borders' } },
  { id: 'botanical', fn: botanical, vi: 'Sổ Tay Thực Vật Cổ Điển (Vẽ tay)', en: 'Vintage Botanical Journal', fields: ['handcraft', 'art', 'photo', 'arch'], desc: { vi: 'Ký họa hoa lá cổ điển, ghim đồng, chữ viết tay bút mực trên giấy ngà', en: 'Pressed botanical line art, brass pins & fountain-pen field notes' } },
  { id: 'comic', fn: comic, vi: 'Truyện Tranh & Manga Zine (Vẽ tay)', en: 'Comic & Manga Storyboard', fields: ['handcraft', 'art', 'motion', '3d'], desc: { vi: 'Khung truyện tranh, bóng thoại, chấm tram Halftone và nhãn SFX sống động', en: 'Dynamic comic panels, speech bubbles, halftone dots & SFX stickers' } },
  { id: 'scrapbook', fn: scrapbook, vi: 'Nhật Ký Polaroid & Washi Tape', en: 'Polaroid & Washi Scrapbook', fields: ['handcraft', 'photo', 'art', 'fashion'], desc: { vi: 'Ảnh chụp lấy liền dán băng dính Washi nhiều màu, giấy ghi chú viết tay', en: 'Instant Polaroids taped with colorful Washi tape & handwritten notes' } },
  { id: 'risograph', fn: risograph, vi: 'Ấn Bản Risograph & Indie Zine', en: 'Risograph Two-Tone Print', fields: ['handcraft', 'design', 'art'], desc: { vi: 'Hiệu ứng in chồng màu Risograph lệch bản, hạt giấy mịn và tem bản giới hạn', en: 'Authentic multiply overprint registration, grain texture & zine stamp' } },
  { id: 'tarot_alchemy', fn: tarotAlchemy, vi: 'Chiêm Tinh & Khắc Gỗ Cổ', en: 'Celestial Tarot & Woodcut', fields: ['handcraft', 'art', '3d', 'design'], desc: { vi: 'Khung vòm lá bài Tarot nhũ vàng trên nền đêm tím thẫm huyền bí', en: 'Gold-foil arched Tarot cards on midnight indigo canvas' } },
  { id: 'clay_play', fn: clayPlay, vi: 'Đất Sét & Khâu Chỉ Thủ Công', en: 'Tactile Clay & Stitched Craft', fields: ['handcraft', 'art', 'uiux', '3d'], desc: { vi: 'Khối đất sét 3D mềm mại kết hợp đường chỉ khâu viền thủ công', en: 'Soft puffy 3D claymorphic cards with stitched thread borders' } },
  { id: 'bauhaus_art', fn: bauhausArt, vi: 'Hội Họa Hình Học Bauhaus', en: 'Bauhaus Constructivist Art', fields: ['handcraft', 'design', 'arch', 'art'], desc: { vi: 'Bố cục tranh hình học Bauhaus bất đối xứng với 3 màu cơ bản', en: 'Asymmetrical Constructivist canvas with primary geometric blocks' } },
  { id: 'cyber_ink', fn: cyberInk, vi: 'Graffiti & Mực Phun Đường Phố', en: 'Street Calligraffiti & Ink', fields: ['handcraft', 'art', 'motion', 'design'], desc: { vi: 'Chữ ký bút dạ Marker, vệt sơn phun đường phố và năng lượng Underground', en: 'Street marker tags, neon spray splatters & underground zine vibe' } },
  { id: 'sketch', fn: sketchbook, vi: 'Sổ Phác Thảo Bút Mực (Vẽ tay)', en: 'Hand-drawn Sketchbook', fields: ['handcraft', 'art'], desc: { vi: 'Sổ phác thảo chấm bi, băng dính giấy, nét vẽ tay phóng khoáng', en: 'Dotted sketchbook, masking tape & expressive pen strokes' } },
  { id: 'illustrator', fn: illustrator, vi: 'Illustrator Nét Vẽ Tự Động', en: 'Self-Drawing Illustrator', fields: ['handcraft', 'art', 'design'], desc: { vi: 'Nét vẽ SVG tự động phác họa khi mở trang, icon vẽ tay', en: 'Self-drawing animated SVG doodles & hand-crafted icons' } },
  { id: 'collage', fn: collage, vi: 'Collage Cắt Dán Tạp Chí', en: 'Paper Cut-out Collage', fields: ['handcraft', 'art', 'design', 'fashion'], desc: { vi: 'Chữ cắt báo, nhãn dán sticker, băng dính và bút dạ quang', en: 'Paper cut-outs, stickers, tape & highlighter strokes' } },
  { id: 'magazine', fn: magazine, vi: 'Tạp chí Nghệ thuật / Artbook', en: 'Editorial Magazine Artbook', fields: ['business', 'fashion', 'arch', 'photo', 'design'], desc: { vi: 'Bố cục sách nghệ thuật & tạp chí dài kỳ, chữ hoa đầu đoạn (Drop-cap), chia chương', en: 'Multi-column print magazine layout with drop-caps & chapters' } },
  { id: 'claude', fn: claude, vi: 'Biên tập Ấm áp (Serif)', en: 'Warm Editorial Serif', fields: ['dev', 'uiux', 'business', 'design'], desc: { vi: 'Nền giấy ấm, chữ Serif học thuật, thẻ Artifact tinh tế', en: 'Warm parchment, literary serif & refined cards' } },
  { id: 'brutalist', fn: brutalist, vi: 'Neo-Brutalist Studio', en: 'Neo-Brutalist Studio', fields: ['design', 'art', 'uiux', 'dev'], desc: { vi: 'Viền đen dày, đổ bóng cứng, màu tương phản mạnh', en: 'Bold borders, hard offset shadows & high-contrast stickers' } },
  { id: 'spatial', fn: spatial, vi: 'Kính Không gian (Spatial Glass)', en: 'Spatial Glass', fields: ['uiux', 'dev', '3d', 'motion'], desc: { vi: 'Kính mờ không gian 3D, ánh sáng cực quang, giao diện tương lai', en: 'Frosted spatial glass cards over deep ambient aurora mesh' } },
  { id: 'industrial', fn: industrial, vi: 'Thiết kế Công nghiệp Tối giản', en: 'Industrial Minimal Design', fields: ['3d', 'arch', 'design'], desc: { vi: 'Bảng thông số kỹ thuật công năng, lưới Thụy Sĩ tối giản', en: 'Functionalist spec sheet & Swiss grid' } },
  { id: 'opensource', fn: opensource, vi: 'Kỹ sư Mã nguồn mở', en: 'Open-Source Engineer', fields: ['dev'], desc: { vi: 'Hồ sơ người duy trì mã nguồn mở, biểu đồ đóng góp, thẻ Repo & README', en: 'Maintainer profile with contribution heatmap, repos & README' } },
  { id: 'sound', fn: sound, vi: 'Âm thanh & Music Studio', en: 'Sound & Music Studio', fields: ['motion', 'business'], desc: { vi: 'Sóng âm tương tác phát nhạc thật (Web Audio), danh sách Tracklist', en: 'Interactive Web Audio waveform & producer tracklist' } },
  { id: 'bento', fn: bento, vi: 'Bento Grid Modular', en: 'Bento Grid Modular', fields: ['design', 'uiux', 'business', 'dev'], desc: { vi: 'Lưới khối module bất đối xứng, thẻ bật lên, hover phóng ảnh', en: 'Modular blocks, pop-in cards, hover zoom' } },
  { id: 'kinetic', fn: kinetic, vi: 'Poster Chữ Chuyển Động', en: 'Kinetic Type Poster', fields: ['design', 'motion', 'art'], desc: { vi: 'Chữ khổng lồ chạy theo cuộn, con trỏ tùy biến, ảnh hiện theo chuột', en: 'Scroll-driven giant type, custom cursor, hover image' } },
  { id: 'split', fn: split, vi: 'Lookbook Chia Đôi Màn Hình', en: 'Split-Screen Lookbook', fields: ['photo', 'arch', 'fashion', 'design'], desc: { vi: 'Hồ sơ cố định một bên, tác phẩm cuộn bên kia như sách mở', en: 'Sticky profile, scrolling work spread' } },
  { id: 'casestudy', fn: casestudy, vi: 'Triển Lãm Mở Từng Dự Án', en: 'Interactive Case Study Deck', fields: ['uiux', 'design', 'arch', '3d', 'business'], desc: { vi: 'Bấm dự án mở trang trình bày riêng với hiệu ứng chuyển cảnh', en: 'Each project opens its own presentation board' } },
  { id: 'graphic', fn: graphic, vi: 'Poster & Masonry Studio', en: 'Graphic Poster & Masonry', fields: ['design'], desc: { vi: 'Chữ Poster khổng lồ, lưới tác phẩm Masonry bất đối xứng', en: 'Huge poster type, masonry grid, marquee' } },
  { id: 'editorial', fn: editorial, vi: 'Kiến Trúc – Danh Mục Đánh Số', en: 'Architectural Editorial Index', fields: ['arch', 'business', 'design'], desc: { vi: 'Chữ Serif cổ điển, danh mục tác phẩm đánh số thứ tự triển lãm', en: 'Serif typography, numbered exhibition case studies' } },
  { id: 'blueprint', fn: blueprint, vi: 'Bản Vẽ Kỹ Thuật Blueprint', en: 'Architectural Blueprint', fields: ['arch', '3d'], desc: { vi: 'Nền bản vẽ kỹ thuật CAD, đường gióng kích thước tỷ lệ 1:100', en: 'Technical drawing grid, dimension lines' } },
  { id: 'fashion', fn: fashion, vi: 'Thời Trang Lookbook Cuộn Ngang', en: 'Fashion Lookbook Strip', fields: ['fashion', 'photo'], desc: { vi: 'Cuộn ngang từng tấm Lookbook, chữ Serif lớn, khung vòm', en: 'Horizontal scroll lookbook, big serif, arch frame' } },
  { id: 'photo', fn: photography, vi: 'Triển Lãm Nhiếp Ảnh Toàn Khung', en: 'Full-Bleed Photo Exhibition', fields: ['photo'], desc: { vi: 'Ảnh tràn màn hình nghệ thuật, phóng to Lightbox khi bấm', en: 'Full-bleed photos with exhibition lightbox' } },
  { id: 'motion', fn: motion, vi: 'Motion & Kinetic Reel', en: 'Motion & Kinetic Reel', fields: ['motion', 'design'], desc: { vi: 'Nền loang chuyển động, trình bày dự án so le điện ảnh', en: 'Animated blobs, staggered cinematic spreads' } },
  { id: 'showreel', fn: showreel, vi: 'Cuộn Phim & Đạo Diễn Hình Ảnh', en: 'Director Film Strip & HUD', fields: ['motion'], desc: { vi: 'Dải phim 35mm chạy ngang, khung ngắm máy quay REC & Timecode', en: '35mm film strip, play buttons, camera viewfinder HUD' } },
  { id: 'parallax', fn: parallax, vi: 'Cảnh Quan Parallax Đa Lớp', en: 'Multi-Layer Vector Parallax', fields: ['design', 'art', 'motion'], desc: { vi: '5 lớp cảnh quan vector chuyển động chiều sâu theo chuột và cuộn', en: '5 vector depth layers react to mouse & scroll' } },
  { id: '3d', fn: threeD, vi: 'Không Gian 3D & Nghiêng Chiều Sâu', en: '3D Perspective & Tilt Stage', fields: ['3d', 'motion'], desc: { vi: 'Khối lập phương 3D xoay, thẻ tác phẩm nghiêng theo góc chuột', en: 'Spinning 3D cube, mouse-tilt perspective boards' } },
  { id: 'game', fn: game, vi: 'Game Concept & 3D Artist', en: 'Game Concept & 3D Artist', fields: ['3d'], desc: { vi: 'Chữ Glitch cyberpunk, thẻ bài lật 3D hai mặt trưng bày Concept Art', en: 'Glitch title, 3D flip concept cards, neon accents' } },
  { id: 'uiux', fn: uiux, vi: 'Product & UI/UX Mockup Stage', en: 'Product & UI/UX Mockup Stage', fields: ['uiux', 'dev'], desc: { vi: 'Khung thiết bị Laptop + Mobile thực tế, sơ đồ quy trình 5 bước', en: 'Laptop & mobile device mockups, 5-step design process' } },
  { id: 'developer', fn: developer, vi: 'Kỹ Sư Phần Mềm (Terminal)', en: 'Software Engineer (Terminal)', fields: ['dev'], desc: { vi: 'Cửa sổ Terminal tự động gõ lệnh, danh mục dự án chuẩn Repository', en: 'Live typing terminal & repository case studies' } },
  { id: 'professional', fn: professional, vi: 'Tối Giản Hiện Đại (Clean Grid)', en: 'Clean Minimalist Archive', fields: ['business', 'uiux', 'design'], desc: { vi: 'Bố cục sáng sủa, tập trung vào hình ảnh dự án và hồ sơ năng lực', en: 'Crisp minimalist layout focused on work and credentials' } }
];

export const PORTFOLIO_FONTS = {
  '': { vi: 'Theo mẫu', en: 'Style default' },
  'Be Vietnam Pro': { vi: 'Be Vietnam Pro – hiện đại', en: 'Be Vietnam Pro – modern', q: 'family=Be+Vietnam+Pro:wght@400;700;900' },
  'Plus Jakarta Sans': { vi: 'Plus Jakarta Sans – sản phẩm / case study', en: 'Plus Jakarta Sans – product / case study', q: 'family=Plus+Jakarta+Sans:wght@400;600;800' },
  'Source Serif 4': { vi: 'Source Serif 4 – biên tập ấm áp', en: 'Source Serif 4 – warm editorial', q: 'family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,700;1,8..60,400' },
  'Instrument Serif': { vi: 'Instrument Serif – tạp chí nghệ thuật', en: 'Instrument Serif – art magazine', q: 'family=Instrument+Serif:ital@0;1' },
  'Caveat': { vi: 'Caveat – chữ viết tay bút mực (Vẽ tay)', en: 'Caveat – fountain pen script', q: 'family=Caveat:wght@500;700' },
  'Patrick Hand': { vi: 'Patrick Hand – nét chữ sổ tay (Vẽ tay)', en: 'Patrick Hand – notebook hand', q: 'family=Patrick+Hand' },
  'Permanent Marker': { vi: 'Permanent Marker – bút dạ đường phố', en: 'Permanent Marker – street marker', q: 'family=Permanent+Marker' },
  'Bangers': { vi: 'Bangers – truyện tranh Comic / Manga', en: 'Bangers – comic & manga', q: 'family=Bangers' },
  'Montserrat': { vi: 'Montserrat – mạnh mẽ', en: 'Montserrat – bold', q: 'family=Montserrat:wght@400;700;900' },
  'Space Grotesk': { vi: 'Space Grotesk – công nghệ', en: 'Space Grotesk – tech', q: 'family=Space+Grotesk:wght@400;700' },
  'Playfair Display': { vi: 'Playfair – sang trọng', en: 'Playfair – elegant', q: 'family=Playfair+Display:ital,wght@0,400;0,800;1,400' },
  'Lora': { vi: 'Lora – có chân, dễ đọc', en: 'Lora – readable serif', q: 'family=Lora:ital,wght@0,400;0,700;1,400' },
  'JetBrains Mono': { vi: 'JetBrains Mono – lập trình', en: 'JetBrains Mono – code', q: 'family=JetBrains+Mono:wght@400;700' }
};

// Optional sections every style can show, in the order the user picks. Ordered like a portfolio book:
// Case Studies Deep-Dive -> Brand & Color System -> Creative Process -> Experience & CV -> Awards -> Numbers -> Testimonials -> Commission Sheet -> Clients.
export const SECTION_KEYS = ['deepdive', 'brandboard', 'process', 'experience', 'awards', 'stats', 'testimonials', 'services', 'pricing', 'clients'];
export const SECTION_NAMES = {
  vi: { deepdive: 'Case Study Chuyên Sâu (Artboard 1400px)', brandboard: 'Hệ Thống Thị Giác, Bảng Màu Pantone & Typography', process: 'Quy Trình Sáng Tạo & Phác Thảo (Behind The Scenes)', experience: 'Hành Trình Nghề Nghiệp & Curriculum Vitae', awards: 'Giải Thưởng & Triển Lãm Nghệ Thuật', stats: 'Dấu Ấn & Số Liệu Tác Phẩm', testimonials: 'Nhận Xét Từ Giám Đốc Sáng Tạo & Khách Hàng', services: 'Lĩnh Vực Chuyên Môn & Hợp Tác', pricing: 'Biểu Phí Tham Khảo & Commission Rate Card', clients: 'Thương Hiệu & Đối Tác Đã Hợp Tác' },
  en: { deepdive: 'Case Study Deep-Dives (1400px Boards)', brandboard: 'Visual Identity, Pantone Swatches & Typography', process: 'Creative Process & Sketching (Behind the Scenes)', experience: 'Curriculum Vitae & Career Timeline', awards: 'Awards, Biennales & Exhibitions', stats: 'Archive Metrics & Impact', testimonials: 'Curator & Client Endorsements', services: 'Creative Disciplines & Capabilities', pricing: 'Commission Rate Card & Scope Index', clients: 'Selected Brands & Collaborators' }
};
const SVC_ICONS = ['pen', 'layers', 'play', 'cube', 'grid', 'idea', 'ruler', 'star'];

function extraSections(v, d, lang) {
  if (v.sections === '') return '';
  const vi = lang !== 'en';
  const c = d.c;
  const N = SECTION_NAMES[vi ? 'vi' : 'en'];
  const rows = (s) => lines(s).map((l) => l.split('|').map((x) => e(x.trim())));
  const order = String(v.sections || SECTION_KEYS.join(',')).split(',').filter((k) => SECTION_KEYS.includes(k));
  const det = Array.isArray(v.projectDetails) ? v.projectDetails : [];
  const h = (k, sub = '') => `<div class="pfx-hd"><div class="pfx-meta"><span>┼ PORTFOLIO SPREAD // CHAPTER ${String(order.indexOf(k) + 1).padStart(2, '0')}</span><span>1400PX EDITORIAL BOARD ┼</span></div><div class="pfx-hd-main"><span class="pfx-k">${String(order.indexOf(k) + 1).padStart(2, '0')}</span><div><h2>${N[k]}</h2>${sub ? `<p>${sub}</p>` : ''}</div></div></div>`;

  const sigBlock = () => {
    if (!d.manifesto && !d.avail && !v.signature && !d.projects.length) return '';
    const seal = e(String(d.first || d.name || 'ẤN').slice(0, 2).toUpperCase());
    return `<section class="pfx-s"><div class="pfx-spread pfx-rv">
      <div class="pfx-spread-l">
        <div style="font-family:monospace;font-size:11px;letter-spacing:.18em;text-transform:uppercase;opacity:.6;margin-bottom:12px">┼ 00 // ARTIST STATEMENT &amp; MANIFESTO</div>
        ${d.avail ? `<span style="display:inline-flex;align-items:center;gap:8px;padding:5px 14px;border-radius:99px;background:color-mix(in srgb,${c} 16%,transparent);color:${c};font-size:12px;font-weight:800;margin-bottom:16px"><i style="width:8px;height:8px;border-radius:50%;background:#10b981;display:inline-block"></i>${d.avail}</span>` : ''}
        ${d.manifesto ? `<blockquote style="margin:0 0 22px;font-size:clamp(22px,2.8vw,32px);line-height:1.35;font-family:Georgia,serif;font-style:italic">“${d.manifesto}”</blockquote>` : `<p style="font-size:18px;line-height:1.7;opacity:.85">${d.bio}</p>`}
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;padding-top:16px;border-top:1px solid color-mix(in srgb,currentColor 14%,transparent)">
          <div>
            <div style="font-size:10px;opacity:.55;text-transform:uppercase;letter-spacing:.14em">${vi ? 'Chữ ký tác giả & Ấn chương' : 'Artist Signature & Seal'}</div>
            <div style="font-family:'Caveat','Patrick Hand',cursive;font-size:36px;color:${c};line-height:1.1;margin-top:4px">${d.sig || d.name}</div>
          </div>
          <span style="display:inline-grid;place-items:center;width:48px;height:48px;border:2px solid #b91c1c;color:#b91c1c;border-radius:6px;font-weight:900;font-size:15px;transform:rotate(-6deg)">${seal}</span>
        </div>
      </div>
      <div class="pfx-spread-r">
        <div style="font-family:monospace;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:${c};font-weight:700;margin-bottom:14px">┼ ${vi ? 'MỤC LỤC TÁC PHẨM CHỌN LỌC (INDEX)' : 'TABLE OF CONTENTS — SELECTED WORKS'}</div>
        <div class="pfx-toc">
          ${d.projects.slice(0, 6).map((p, i) => `<a href="#pfx-cs-${i}" class="pfx-toc-row"><span class="pfx-toc-n">0${i + 1}</span><span class="pfx-toc-t"><b>${p.title}</b><small>${p.cat || d.role}</small></span><span class="pfx-toc-y">${p.year || '2026'}</span></a>`).join('')}
        </div>
      </div>
    </div></section>`;
  };

  const build = {
    deepdive: () => {
      const items = d.projects.slice(0, 6).map((p, i) => ({ p, x: det[i] || {}, i }));
      if (!items.length) return '';
      const L3 = vi ? ['01 // Bối cảnh & Đề bài (The Brief)', '02 // Định hướng Nghệ thuật & Thực thi', '03 // Giá trị & Kết quả đạt được'] : ['01 // The Brief & Challenge', '02 // Art Direction & Execution', '03 // Impact & Deliverables'];
      return `<section class="pfx-s">${h('deepdive', vi ? 'Trình bày từng dự án theo bố cục Artboard 1400px: Bối cảnh, Phác thảo tỷ lệ, Hệ màu Pantone và Tác phẩm hoàn thiện' : 'Each project presented as a multi-frame Behance Case Study spread: Brief, Wireframe Sketch, Pantone Spec and Final Artwork')}${items.map(({ p, x, i }, j) => {
        const userGal = (x.gallery || []).map((g) => imgSrc(g)).filter(Boolean).slice(0, 6);
        const chText = x.challenge ? e(x.challenge) : (vi ? `Định hình ngôn ngữ thị giác độc bản cho dự án "${p.title}" trong lĩnh vực ${p.cat || d.role}, tạo dấu ấn khác biệt với các giải pháp đại trà.` : `Establish a distinctive visual identity and narrative system for "${p.title}" within ${p.cat || d.role}.`);
        const solText = x.solution ? e(x.solution) : (vi ? `${p.desc}. Kết hợp nghiên cứu tỷ lệ bố cục, thử nghiệm chất liệu và hệ thống màu sắc đồng nhất.` : `${p.desc}. Crafted through rigorous grid exploration, tactile textures and cohesive color direction.`);
        const resText = x.result ? e(x.result) : (vi ? `Hoàn thiện trọn bộ hồ sơ thiết kế & tác phẩm chuẩn xuất bản (${p.year || '2026'}), nhận đánh giá cao từ giới chuyên môn và khách hàng.` : `Delivered full production-ready assets and brand guidelines (${p.year || '2026'}) with strong critical appreciation.`);
        return `<article class="pfx-dd${j % 2 ? ' rev' : ''}" id="pfx-cs-${i}">
          <div class="pfx-dd-bar"><span>CASE STUDY BOARD 0${i + 1} // ${p.cat || d.role}</span><span>YEAR: ${p.year || '2026'} · AUTHOR: ${d.name}</span></div>
          <div class="pfx-dd-top"><img class="pfx-rv" src="${p.img}" alt="${p.title}" loading="lazy"><div class="pfx-rv"><small>PROJECT 0${i + 1} · ${p.cat}</small><h3>${p.title}</h3><p>${p.desc}</p>${p.link ? `<a href="${p.link}" target="_blank" rel="noopener">${vi ? 'Xem trọn bộ dự án' : 'Open full case study'} ↗</a>` : ''}</div></div>
          <div class="pfx-csr"><div class="pfx-rv"><em>${L3[0]}</em><p>${chText}</p></div><div class="pfx-rv"><em>${L3[1]}</em><p>${solText}</p></div><div class="pfx-rv"><em>${L3[2]}</em><p>${resText}</p></div></div>
          ${userGal.length
            ? `<div class="pfx-gal g${Math.min(userGal.length, 4)}">${userGal.map((g) => `<img class="pfx-rv" src="${g}" alt="${p.title}" loading="lazy">`).join('')}</div>`
            : `<div class="pfx-gal g2"><figure class="pfx-fig pfx-rv"><img src="${p.sketchImg || p.img}" alt="${p.title} process" loading="lazy"><figcaption><span>FIG 0${i + 1}.A — ${vi ? 'BẢN VẼ PHÁC THẢO & TỶ LỆ BỐ CỤC' : 'PROCESS SKETCH & PROPORTION GRID'}</span><span>1:1.618</span></figcaption></figure><figure class="pfx-fig pfx-rv"><img src="${p.specImg || p.img}" alt="${p.title} spec" loading="lazy"><figcaption><span>FIG 0${i + 1}.B — ${vi ? 'BẢNG MÀU PANTONE & TYPOGRAPHY' : 'PANTONE SWATCHES & TYPOGRAPHY'}</span><span>SPEC</span></figcaption></figure></div>`}
        </article>`;
      }).join('')}</section>`;
    },
    brandboard: () => {
      if (!d.skills.length) return '';
      const fontName = e(v.font || 'Editorial Display & Grotesque');
      return `<section class="pfx-s">${h('brandboard', vi ? 'Hệ thống mã màu Pantone, mẫu chữ chủ đạo (Typography Specimen) và bộ công cụ sáng tạo' : 'Pantone color swatches, typography specimen sheet and creative toolkit')}
<div class="pfx-bb"><div class="pfx-card pfx-rv"><small style="color:${c};font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-family:monospace">01 // PANTONE COLOR SYSTEM</small><div class="pfx-sw"><div style="background:${c}"><span>PRIMARY</span><b>${c.toUpperCase()}</b></div><div style="background:color-mix(in srgb,${c} 65%,#000)"><span>DEEP SHADE</span><b>MIX 65%</b></div><div style="background:color-mix(in srgb,${c} 28%,#fff);color:#111"><span>WARM TINT</span><b>TINT 28%</b></div><div style="background:#18181b"><span>CARBON INK</span><b>#18181B</b></div></div></div>
<div class="pfx-card pfx-rv"><small style="color:${c};font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-family:monospace">02 // TYPOGRAPHY &amp; CRAFT STACK</small><div style="display:flex;align-items:baseline;gap:18px;margin:12px 0"><span style="font-size:58px;font-weight:800;line-height:1;color:${c};font-family:Georgia,serif">Aa</span><div><b style="font-size:19px;display:block">${fontName}</b><span style="opacity:.65;font-size:12px;font-family:monospace">ABCDEFGHIJKLMNOPQRSTUVWXYZ · 0123456789</span></div></div><div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:14px">${d.skills.map((s) => `<span style="padding:5px 12px;border-radius:6px;border:1px solid color-mix(in srgb,currentColor 22%,transparent);font-size:12px;font-weight:600">${s}</span>`).join('')}</div></div></div></section>`;
    },
    process: () => {
      const r = rows(v.process); if (!r.length) return '';
      return `<section class="pfx-s">${h('process', vi ? 'Từ nghiên cứu moodboard, phác thảo chì đến hoàn thiện tác phẩm cuối cùng' : 'From research and moodboarding to rough sketches and final polish')}<ol class="pfx-proc">${r.map(([t = '', s = ''], i) => `<li class="pfx-rv"><span>${String(i + 1).padStart(2, '0')}</span><h3>${t}</h3><p>${s}</p></li>`).join('')}</ol></section>`;
    },
    experience: () => {
      const r = rows(v.experience); if (!r.length) return '';
      return `<section class="pfx-s">${h('experience')}${r.map(([yr = '', role = '', org = '', note = '']) => `<div class="pfx-row pfx-rv"><div class="pfx-yr">${yr}</div><div><b>${role}</b><span>${org}${note ? ` — ${note}` : ''}</span></div></div>`).join('')}</section>`;
    },
    awards: () => {
      const r = rows(v.awards); if (!r.length) return '';
      return `<section class="pfx-s">${h('awards')}${r.map(([yr = '', name = '', org = '']) => `<div class="pfx-row pfx-rv"><div class="pfx-yr">${yr}</div><div><b>${svg('star', 16, `color:${c};margin-right:6px`)}${name}</b><span>${org}</span></div></div>`).join('')}</section>`;
    },
    stats: () => {
      const r = rows(v.stats); if (!r.length) return '';
      return `<section class="pfx-s">${h('stats')}<div class="pfx-stats">${r.map(([n = '', l = '']) => `<div class="pfx-rv"><b data-count="${n}">${n}</b><span>${l}</span></div>`).join('')}</div></section>`;
    },
    testimonials: () => {
      const r = rows(v.testimonials); if (!r.length) return '';
      return `<section class="pfx-s">${h('testimonials')}<div class="pfx-tm">${r.map(([q = '', who = '', pos = '']) => `<figure class="pfx-card pfx-rv"><span class="pfx-q">“</span><blockquote>${q}</blockquote><figcaption><i>${(who.replace(/&[^;]+;/g, '').trim()[0] || '?').toUpperCase()}</i><span><b>${who}</b>${pos}</span></figcaption></figure>`).join('')}</div></section>`;
    },
    services: () => {
      const r = rows(v.services); if (!r.length) return '';
      return `<section class="pfx-s">${h('services', vi ? 'Các hạng mục sáng tạo và định hướng nghệ thuật chuyên sâu' : 'Core creative disciplines and art direction capabilities')}<div class="pfx-svc">${r.map(([t = '', s = ''], i) => `<div class="pfx-card pfx-rv"><span class="pfx-ic">${svg(SVC_ICONS[i % SVC_ICONS.length], 22)}</span><h3>${t}</h3><p>${s}</p></div>`).join('')}</div></section>`;
    },
    pricing: () => {
      const r = rows(v.pricing); if (!r.length) return '';
      return `<section class="pfx-s">${h('pricing', vi ? 'Bảng quy chuẩn hạng mục hợp tác & Commission nghệ thuật (Rate Card)' : 'Editorial commission scope & collaboration rate card')}<div class="pfx-rate">${r.map(([tier = '', price = '', perks = ''], i) => `<div class="pfx-rate-row pfx-rv"><div class="pfx-rate-no">0${i + 1}</div><div class="pfx-rate-main"><h3>${tier}</h3><p>${perks.split(';').map((x) => x.trim()).filter(Boolean).join(' · ')}</p></div><div class="pfx-rate-price">${price}</div></div>`).join('')}</div></section>`;
    },
    clients: () => {
      const cl = list(v.clients).map(e); if (!cl.length) return '';
      return `<section class="pfx-s">${h('clients')}<div class="pfx-cl"><div class="pfx-cl-t">${[...cl, ...cl].map((x) => `<span>${x}</span>`).join('')}</div></div></section>`;
    }
  };
  const html = sigBlock() + order.map((k) => (build[k] ? build[k]() : '')).join('');
  if (!html) return '';
  const line = 'color-mix(in srgb,currentColor 16%,transparent)';
  return `<style>.pfx{max-width:1220px;margin:0 auto;padding:40px 24px 30px}.pfx-s{padding:64px 0;border-top:1px solid ${line}}.pfx-s:first-child{border-top:0}
.pfx-meta{display:flex;justify-content:space-between;font-family:monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;opacity:.55;margin-bottom:14px}
.pfx-hd{margin-bottom:38px}.pfx-hd-main{display:grid;grid-template-columns:64px 1fr;align-items:baseline}.pfx-hd h2{margin:0;font-size:clamp(28px,3.8vw,44px);line-height:1.05;letter-spacing:-.02em}.pfx-hd p{margin:8px 0 0;opacity:.68;font-size:16px;max-width:720px}.pfx-k{color:${c};font-weight:800;font-size:20px;font-family:monospace}
.pfx-spread{display:grid;grid-template-columns:1.1fr 1fr;border:1px solid ${line};border-radius:20px;overflow:hidden;background:color-mix(in srgb,currentColor 3%,transparent)}
.pfx-spread-l,.pfx-spread-r{padding:36px}.pfx-spread-l{border-right:1px solid ${line}}
.pfx-toc{display:grid;gap:10px}.pfx-toc-row{display:grid;grid-template-columns:38px 1fr auto;align-items:center;gap:12px;padding:11px 14px;border:1px solid ${line};border-radius:12px;text-decoration:none;transition:border-color .2s,transform .2s}.pfx-toc-row:hover{border-color:${c};transform:translateX(4px)}
.pfx-toc-n{font-family:monospace;font-weight:800;color:${c};font-size:15px}.pfx-toc-t b{display:block;font-size:15px}.pfx-toc-t small{opacity:.65;font-size:12px}.pfx-toc-y{font-family:monospace;font-size:12px;opacity:.6}
.pfx-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:18px}.pfx-stats div{padding:26px;border:1px solid ${line};border-radius:16px}.pfx-stats b{display:block;font-size:clamp(40px,5vw,62px);line-height:1;color:${c};letter-spacing:-.03em}.pfx-stats span{opacity:.7}
.pfx-svc,.pfx-tm{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:18px}.pfx-card{border:1px solid ${line};border-radius:18px;padding:26px;margin:0;transition:transform .35s,border-color .35s}.pfx-card:hover{transform:translateY(-4px);border-color:${c}}
.pfx-ic{display:inline-grid;place-items:center;width:44px;height:44px;border-radius:12px;background:color-mix(in srgb,${c} 16%,transparent);color:${c}}.pfx-card h3{margin:16px 0 6px;font-size:20px}.pfx-card p{margin:0;opacity:.72;line-height:1.6}
.pfx-rate{border:1px solid ${line};border-radius:18px;overflow:hidden}.pfx-rate-row{display:grid;grid-template-columns:54px 1fr auto;gap:20px;align-items:center;padding:22px 26px;border-bottom:1px solid ${line}}.pfx-rate-row:last-child{border-bottom:0}.pfx-rate-no{font-family:monospace;font-weight:800;color:${c};font-size:16px}.pfx-rate-main h3{margin:0 0 4px;font-size:19px}.pfx-rate-main p{margin:0;opacity:.72;font-size:14px}.pfx-rate-price{font-family:monospace;font-size:20px;font-weight:800;color:${c};white-space:nowrap}
.pfx-proc{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:0;counter-reset:s}.pfx-proc li{padding:0 20px 0 0;position:relative}.pfx-proc li span{display:grid;place-items:center;width:48px;height:48px;border-radius:50%;background:${c};color:#fff;font-weight:700;position:relative;z-index:1;font-family:monospace}
.pfx-proc li::before{content:"";position:absolute;top:24px;left:48px;right:0;height:1px;background:${line}}.pfx-proc li:last-child::before{display:none}.pfx-proc h3{margin:16px 0 6px;font-size:19px}.pfx-proc p{margin:0;opacity:.7;line-height:1.55}
.pfx-dd{margin-bottom:56px;border:1px solid ${line};border-radius:22px;overflow:hidden;background:color-mix(in srgb,currentColor 2%,transparent)}
.pfx-dd-bar{padding:12px 24px;border-bottom:1px solid ${line};display:flex;justify-content:space-between;font-family:monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;opacity:.7}
.pfx-dd-top{display:grid;grid-template-columns:1.3fr 1fr;gap:36px;align-items:center;padding:28px}.pfx-dd.rev .pfx-dd-top>img{order:2}.pfx-dd-top img{width:100%;aspect-ratio:16/10;object-fit:cover;border-radius:14px;border:1px solid ${line}}.pfx-dd h3{font-size:clamp(26px,3.2vw,38px);margin:6px 0 10px;line-height:1.1}.pfx-dd small{color:${c};font-weight:700;text-transform:uppercase;letter-spacing:.1em;font-family:monospace}.pfx-dd p{opacity:.8;line-height:1.68}.pfx-dd a{display:inline-block;margin-top:10px;color:${c};font-weight:700;text-decoration:none;border-bottom:1.5px solid ${c}}
.pfx-csr{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;padding:24px 28px;border-top:1px solid ${line};border-bottom:1px solid ${line};background:color-mix(in srgb,currentColor 3%,transparent)}.pfx-csr div{border-top:2px solid ${c};padding-top:12px}.pfx-csr em{font-style:normal;font-weight:700;text-transform:uppercase;letter-spacing:.1em;font-size:11px;font-family:monospace;color:${c}}.pfx-csr p{margin:8px 0 0;font-size:14.5px;line-height:1.65}
.pfx-gal{display:grid;gap:16px;padding:24px 28px}.pfx-gal.g2{grid-template-columns:1fr 1fr}.pfx-gal.g3{grid-template-columns:2fr 1fr 1fr}.pfx-gal.g4{grid-template-columns:repeat(4,1fr)}.pfx-gal img{width:100%;aspect-ratio:16/10;object-fit:cover;border-radius:12px}
.pfx-fig{margin:0;border:1px solid ${line};border-radius:12px;overflow:hidden}.pfx-fig img{border-radius:0;display:block}.pfx-fig figcaption{padding:9px 14px;font-family:monospace;font-size:10.5px;opacity:.7;border-top:1px solid ${line};display:flex;justify-content:space-between}
.pfx-bb{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px}.pfx-sw{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:14px}.pfx-sw>div{border-radius:12px;padding:28px 10px 10px;color:#fff;font-size:11px;display:flex;flex-direction:column;gap:2px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.15)}.pfx-sw span{opacity:.75;font-size:9px;letter-spacing:.08em}
.pfx-row{display:grid;grid-template-columns:170px 1fr;gap:18px;padding:18px 0;border-top:1px solid ${line}}.pfx-row b{display:block;font-size:18px}.pfx-row span{opacity:.7}.pfx-yr{color:${c};font-weight:700;font-family:monospace}
.pfx-q{font-size:70px;line-height:.6;color:${c};font-family:Georgia,serif}.pfx-tm blockquote{margin:6px 0 20px;font-size:17px;line-height:1.6}.pfx-tm figcaption{display:flex;gap:12px;align-items:center}.pfx-tm i{font-style:normal;width:42px;height:42px;border-radius:50%;background:${c};color:#fff;display:grid;place-items:center;font-weight:700}.pfx-tm figcaption span{display:flex;flex-direction:column;opacity:.85;font-size:14px}
.pfx-cl{overflow:hidden;mask:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent);-webkit-mask:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)}.pfx-cl-t{display:flex;gap:14px;width:max-content;animation:pfxm 28s linear infinite}.pfx-cl-t span{padding:18px 30px;border:1px solid ${line};border-radius:14px;font-weight:700;font-size:18px;letter-spacing:.03em;white-space:nowrap}@keyframes pfxm{to{transform:translateX(-50%)}}
.pfx-js .pfx-rv{opacity:0;transform:translateY(26px);transition:opacity .8s cubic-bezier(.2,.8,.2,1),transform .8s cubic-bezier(.2,.8,.2,1)}.pfx-js .pfx-rv.on{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){.pfx-js .pfx-rv{opacity:1!important;transform:none!important}.pfx-cl-t{animation:none}}
@media(max-width:740px){.pfx-spread,.pfx-dd-top,.pfx-rate-row{grid-template-columns:1fr}.pfx-spread-l{border-right:0;border-bottom:1px solid ${line}}.pfx-hd-main{grid-template-columns:1fr}.pfx-dd.rev .pfx-dd-top>img{order:0}.pfx-row{grid-template-columns:1fr;gap:4px}.pfx-proc li::before{display:none}.pfx-proc{gap:24px}.pfx-gal.g2,.pfx-gal.g3,.pfx-gal.g4{grid-template-columns:1fr}}</style>
<div class="pfx" id="pfx">${html}</div><script>(function(){var r=document.getElementById('pfx');if(!('IntersectionObserver' in window))return;r.classList.add('pfx-js');var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('on');io.unobserve(x.target)}})},{threshold:.12});
r.querySelectorAll('.pfx-rv').forEach(function(el,i){el.style.transitionDelay=(i%4)*80+'ms';io.observe(el)});
r.querySelectorAll('[data-count]').forEach(function(el){var m=/^(\\D*)(\\d+)(.*)$/.exec(el.textContent);if(!m)return;var n=+m[2],t0=0;var o=new IntersectionObserver(function(es){if(!es[0].isIntersecting)return;o.disconnect();(function f(t){t0=t0||t;var k=Math.min(1,(t-t0)/1400);el.textContent=m[1]+Math.round(n*(1-Math.pow(1-k,3)))+m[3];if(k<1)requestAnimationFrame(f)})(performance.now())});o.observe(el)})})();</script>`;
}

function bespokeOverlay(values, c) {
  const tex = values.paperTexture || '';
  const stk = values.handSticker || '';
  let css = `@media print{@page{size:A4;margin:10mm}body{-webkit-print-color-adjust:exact;print-color-adjust:exact}.pfx-rv,.rv{opacity:1!important;transform:none!important}article,section,figure,.b-board,.pfx-dd{break-inside:avoid}}`;
  if (tex === 'dotgrid') css += `body{background-image:radial-gradient(color-mix(in srgb,currentColor 18%,transparent) 1.2px,transparent 1.2px)!important;background-size:22px 22px!important}`;
  else if (tex === 'grid') css += `body{background-image:linear-gradient(color-mix(in srgb,currentColor 9%,transparent) 1px,transparent 1px),linear-gradient(90deg,color-mix(in srgb,currentColor 9%,transparent) 1px,transparent 1px)!important;background-size:28px 28px!important}`;
  else if (tex === 'watercolor') css += `body{background-image:radial-gradient(circle at 15% 20%,${c}22 0,transparent 40%),radial-gradient(circle at 85% 75%,#f4a26126 0,transparent 45%)!important}`;
  else if (tex === 'kraft') css += `body{background-color:#f3ede0!important;color:#2b2118!important}`;

  let doodles = '';
  if (stk === 'doodle') {
    doodles = `<div style="position:fixed;right:22px;bottom:22px;z-index:30;pointer-events:none;opacity:.85"><svg width="110" height="110" viewBox="0 0 120 120" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round"><path d="M60,12 L68,44 L100,52 L68,60 L60,92 L52,60 L20,52 L52,44 Z"/><path d="M18,98 Q55,75 98,104"/></svg></div>`;
  } else if (stk === 'botanical') {
    doodles = `<div style="position:fixed;right:18px;bottom:18px;z-index:30;pointer-events:none;opacity:.8"><svg width="110" height="140" viewBox="0 0 110 140" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round"><path d="M55,130 Q50,70 70,15 M56,95 Q28,80 20,58 Q42,62 56,82 M60,65 Q86,50 92,30 Q72,38 59,56"/></svg></div>`;
  } else if (stk === 'inkseal') {
    const sTxt = e(String(values.name || 'ẤN').trim().split(/\s+/).pop().slice(0, 2).toUpperCase());
    doodles = `<div style="position:fixed;right:24px;bottom:24px;z-index:30;pointer-events:none;width:54px;height:54px;background:#b91c1c;color:#fff;border:2px solid #7f1d1d;border-radius:8px;display:grid;place-items:center;font-weight:900;transform:rotate(-8deg);box-shadow:3px 4px 12px rgba(185,28,28,.35)">${sTxt}</div>`;
  }
  return `<style>${css}</style>` + doodles;
}

// Preview-only script: text that equals a form value becomes click-to-edit and reports changes to the tool via postMessage.
function editScript(map) {
  const data = JSON.stringify(map).replace(/</g, '\\u003c');
  return `<style>[data-k]{outline:1px dashed transparent;outline-offset:3px;cursor:text;transition:outline-color .15s}[data-k]:hover{outline-color:rgba(37,99,235,.8)}[data-k][contenteditable]{outline:2px solid #2563eb;background:rgba(37,99,235,.08)}</style>
<script>(function(){var M=${data};var all=[].slice.call(document.body.querySelectorAll('*'));
Object.keys(M).forEach(function(k){var v=String(M[k]||'').trim();if(v.length<2)return;
all.forEach(function(el){if(el.tagName==='SCRIPT'||el.tagName==='STYLE'||el.textContent.trim()!==v)return;
if([].some.call(el.children,function(ch){return ch.textContent.trim()===v}))return;el.setAttribute('data-k',k);});});
var multi=function(k){return k==='bio'||/\\.(desc|challenge|solution|result)$/.test(k)};
document.addEventListener('click',function(ev){var el=ev.target.closest&&ev.target.closest('[data-k]');if(!el)return;ev.preventDefault();ev.stopPropagation();
if(el.isContentEditable)return;el.setAttribute('contenteditable','plaintext-only');if(!el.isContentEditable)el.setAttribute('contenteditable','true');el.focus();},true);
document.addEventListener('input',function(ev){var el=ev.target.closest&&ev.target.closest('[data-k]');if(!el)return;var k=el.getAttribute('data-k'),t=el.innerText.replace(/\\s+/g,' ').trim();
document.querySelectorAll('[data-k="'+k+'"]').forEach(function(o){if(o!==el)o.textContent=t;});parent.postMessage({type:'pf-edit',key:k,value:t},'*');});
document.addEventListener('keydown',function(ev){var el=ev.target;if(ev.key==='Enter'&&el.isContentEditable&&!multi(el.getAttribute('data-k')||'')){ev.preventDefault();el.blur();}});
document.addEventListener('focusout',function(ev){if(ev.target.removeAttribute)ev.target.removeAttribute('contenteditable');});})();</script>`;
}

export function renderPortfolio(styleId, values, images, lang = 'vi', opts = {}) {
  const st = PORTFOLIO_STYLES.find((s) => s.id === styleId) || PORTFOLIO_STYLES[0];
  const d = prepare(values, images);
  let html = st.fn(d, T[lang] || T.vi, lang);
  const extraVals = st.id === 'behance' && values.sections !== ''
    ? { ...values, sections: String(values.sections || SECTION_KEYS.join(',')).split(',').filter((k) => k !== 'deepdive').join(',') }
    : values;
  const extra = extraSections(extraVals, d, lang);
  if (extra) {
    const at = html.lastIndexOf('<footer');
    html = at > 0 ? html.slice(0, at) + extra + html.slice(at) : html.replace('</body>', extra + '</body>');
  }
  const overlay = bespokeOverlay(values, d.c);
  if (overlay) html = html.replace('</body>', overlay + '</body>');
  const font = PORTFOLIO_FONTS[values.font];
  if (font && font.q) {
    html = html.replace('</head>', `<link href="https://fonts.googleapis.com/css2?${font.q}&display=swap" rel="stylesheet"><style>body,h1,h2,h3,h4,p,a,small,b,div,span,figcaption,button{font-family:'${values.font}',system-ui,sans-serif!important}</style></head>`);
  }
  if (opts.edit) {
    const map = { name: values.name, role: values.role, bio: values.bio, location: values.location, manifesto: values.manifesto, availability: values.availability };
    lines(values.projects).forEach((l, i) => {
      const [title, cat, , desc] = l.split('|').map((x) => x.trim());
      Object.assign(map, { [`p${i}.title`]: title, [`p${i}.cat`]: cat, [`p${i}.desc`]: desc });
    });
    (Array.isArray(values.projectDetails) ? values.projectDetails : []).forEach((x, i) => {
      ['challenge', 'solution', 'result'].forEach((k) => { if (x && x[k]) map[`p${i}.${k}`] = x[k]; });
    });
    // Section rows: key "f:<field>:<line>:<column>" lets the tool rewrite exactly that cell of the textarea.
    ['stats', 'services', 'pricing', 'process', 'testimonials', 'experience', 'awards'].forEach((name) => {
      lines(values[name]).forEach((l, r) => l.split('|').forEach((cell, col) => { map[`f:${name}:${r}:${col}`] = cell.trim(); }));
    });
    list(values.clients).forEach((c, r) => { map[`f:clients:${r}:0`] = c; });
    const at = html.lastIndexOf('</body>');
    html = html.slice(0, at) + editScript(map) + html.slice(at);
  }
  return html;
}

export function portfolioFields(lang = 'vi') {
  const vi = lang === 'vi';
  return [
    { name: 'name', label: vi ? 'Họ tên / Bút danh' : 'Name / Pen name', default: vi ? 'Trần Hà My' : 'Maya Tran' },
    { name: 'role', label: vi ? 'Nghề nghiệp / Danh xưng' : 'Role / Title', default: vi ? 'Illustrator & Art Director' : 'Illustrator & Art Director' },
    { name: 'availability', label: vi ? 'Trạng thái nhận việc / Commission' : 'Availability / Commission Status', default: vi ? 'Đang nhận dự án Freelance & Commission Vẽ/Thiết kế' : 'Available for Freelance & Art Commissions' },
    { name: 'manifesto', label: vi ? 'Tuyên ngôn sáng tạo / Câu trích dẫn cá nhân' : 'Creative Manifesto / Personal Motto', default: vi ? 'Mỗi nét vẽ thủ công đều mang một linh hồn riêng mà máy móc không thể sao chép.' : 'Every hand-drawn line carries a human soul that machines cannot replicate.' },
    { name: 'signature', label: vi ? 'Chữ ký tay cá nhân (hiển thị cuối trang)' : 'Personal Handwritten Signature', default: vi ? 'Hà My Atelier ✦' : 'Maya Tran ✦' },
    { name: 'bio', label: vi ? 'Giới thiệu ngắn' : 'Short bio', type: 'textarea', default: vi ? 'Mình thiết kế nhận diện thương hiệu, minh họa vẽ tay và chuyển động cho các thương hiệu trẻ. 6 năm kinh nghiệm, 40+ dự án cho xuất bản, F&B, thời trang và công nghệ.' : 'I craft brand identities, hand-drawn illustrations and motion for young brands. 6 years, 40+ projects in publishing, F&B, fashion and tech.' },
    { name: 'email', label: 'Email', default: 'hello@hamy.design' },
    { name: 'location', label: vi ? 'Nơi làm việc' : 'Location', default: vi ? 'Hà Nội, Việt Nam' : 'Hanoi, Vietnam' },
    { name: 'links', label: vi ? 'Liên kết – mỗi dòng: Tên | https://…' : 'Links – per line: Label | https://…', type: 'textarea', rows: 3, default: 'Website | https://example.com/\nInstagram | https://www.instagram.com/\nLinkedIn | https://www.linkedin.com/' },
    { name: 'skills', label: vi ? 'Kỹ năng & Chất liệu sáng tạo (phân tách dấu phẩy)' : 'Skills & Mediums (comma separated)', default: 'Hand-drawn Illustration, Watercolor, Branding, Motion Graphics, Procreate, Figma, Blender 3D' },
    { name: 'projects', label: vi ? 'Dự án – mỗi dòng: Tên | Lĩnh vực | Năm | Mô tả | Link' : 'Projects – per line: Title | Category | Year | Description | Link', type: 'textarea', rows: 7, default: vi
      ? 'Bloom Coffee | Branding & Illustration | 2026 | Bộ nhận diện & tranh tường vẽ tay cho chuỗi 12 cửa hàng | https://example.com/\nNeon Nights | Motion | 2025 | Video hoạt hình vẽ từng khung (Frame-by-frame) cho lễ hội âm nhạc |\nLeaf Packaging | Packaging | 2025 | Bao bì trà hữu cơ ký họa thực vật, giải A Design Award |\nPixel Pets | Illustration | 2024 | Bộ 40 sticker vẽ tay cho ứng dụng trò chuyện |\nOrbit App | UI/UX | 2024 | Ứng dụng đặt lịch, tăng 32% tỷ lệ chuyển đổi |\nCube World | 3D Diorama | 2023 | Loạt mô hình đất sét 3D cho chiến dịch Tết |'
      : 'Bloom Coffee | Branding & Illustration | 2026 | Hand-illustrated identity for a 12-store coffee chain | https://example.com/\nNeon Nights | Motion | 2025 | Frame-by-frame animated festival spot |\nLeaf Packaging | Packaging | 2025 | Botanical tea packaging, A\' Design Award |\nPixel Pets | Illustration | 2024 | 40 hand-drawn stickers for a chat app |\nOrbit App | UI/UX | 2024 | Booking app, +32% conversion |\nCube World | 3D Diorama | 2023 | Tactile 3D series for a holiday campaign |' },
    { name: 'stats', label: vi ? 'Số liệu nổi bật – mỗi dòng: Con số | Nhãn' : 'Key numbers – per line: Number | Label', type: 'textarea', rows: 3, default: vi ? '6+ | Năm sáng tạo\n40+ | Dự án & Tác phẩm\n25 | Thương hiệu hợp tác\n3 | Giải thưởng nghệ thuật' : '6+ | Years creating\n40+ | Works shipped\n25 | Brands served\n3 | Art & design awards' },
    { name: 'services', label: vi ? 'Dịch vụ – mỗi dòng: Tên | Mô tả' : 'Services – per line: Name | Description', type: 'textarea', rows: 3, default: vi ? 'Minh họa Độc bản & Bìa sách | Vẽ tay kỹ thuật số, màu nước, ký họa nhân vật và bao bì nghệ thuật\nNhận diện Thương hiệu | Logo, bảng màu, bộ chữ vẽ tay và quy chuẩn ứng dụng\nMotion & Hoạt hình 2D/3D | Video kể chuyện thương hiệu, sticker động và intro' : 'Bespoke Illustration | Editorial, book covers, character art and illustrated packaging\nBrand Identity | Custom logotypes, colour palettes and brand worlds\nMotion & Animation | Frame-by-frame 2D/3D storytelling' },
    { name: 'pricing', label: vi ? 'Bảng báo giá / Gói Commission – mỗi dòng: Tên gói | Giá | Quyền lợi (ngăn dấu ;)' : 'Pricing / Commission Packages – per line: Tier | Price | Deliverables (separate with ;)', type: 'textarea', rows: 3, default: vi ? 'Gói Minh họa Lẻ (Commission) | Từ 3.500.000đ | 1 tác phẩm vẽ tay độ phân giải in ấn; 2 lần chỉnh sửa; Bàn giao file PSD/AI tách lớp\nGói Nhận diện Thương hiệu Trọn gói | Từ 18.000.000đ | Logo + Bảng màu + Typography; Bộ 6 ấn phẩm ứng dụng & Mascot vẽ tay; Cẩm nang Brand Guideline PDF\nGói Đồng hành Sáng tạo (Retainer) | 25.000.000đ/tháng | Thiết kế & minh họa ưu tiên hàng tuần; Không giới hạn yêu cầu nhỏ; Họp định hướng 1-1' : 'Single Commission / Illustration | $250+ | 1 high-res custom artwork; 2 revision rounds; Layered source file\nFull Brand Identity & Art World | $1,400+ | Logo system, palette & typography; Custom brand illustrations; Brand guidelines book\nCreative Retainer | $2,200/mo | Dedicated weekly art & design sprints; Priority turnaround; Direct Slack access' },
    { name: 'process', label: vi ? 'Quy trình – mỗi dòng: Bước | Mô tả' : 'Process – per line: Step | Description', type: 'textarea', rows: 3, default: vi ? 'Thấu hiểu | Trò chuyện, tìm hiểu câu chuyện và cảm xúc bạn muốn truyền tải\nNghiên cứu & Moodboard | Phác thảo chất liệu, bảng màu và 3 hướng tiếp cận\nPhác thảo chì (Sketch) | Dựng bố cục nét tay để duyệt thần thái trước khi lên màu\nHoàn thiện & Bàn giao | Đi nét chi tiết, tô màu hoàn chỉnh và xuất file chuẩn in ấn/web' : 'Listen | Understand your story and mood\nMoodboard | Textures, palette and 3 directions\nRough Sketch | Pencil compositions for approval\nFinal Polish | Detailed rendering and print/web files' },
    { name: 'testimonials', label: vi ? 'Khách hàng nói gì – mỗi dòng: Lời nhận xét | Tên | Chức vụ, công ty' : 'Testimonials – per line: Quote | Name | Role, company', type: 'textarea', rows: 2, default: vi ? 'Nét vẽ cực kỳ có hồn, khách hàng của chúng tôi giữ lại vỏ hộp trà chỉ vì hình minh họa quá đẹp! | Nguyễn Lan Anh | Founder, Leaf Tea' : 'The illustrations had so much soul that customers kept the boxes as collectibles! | Maya Lin | Founder, Leaf Tea' },
    { name: 'sections', type: 'hidden', default: SECTION_KEYS.join(',') },
    { name: 'experience', label: vi ? 'Kinh nghiệm – mỗi dòng: Năm | Vị trí | Công ty | Ghi chú' : 'Experience – per line: Years | Role | Company | Note', type: 'textarea', rows: 3, default: vi ? '2023 – nay | Founder & Lead Illustrator | Hà My Atelier | Sáng tác độc lập & hợp tác cùng 25 thương hiệu\n2020 – 2023 | Senior Art & Brand Designer | Studio Sáng Tạo' : '2023 – Present | Founder & Lead Illustrator | Maya Atelier\n2020 – 2023 | Senior Brand Designer | Creative Studio' },
    { name: 'awards', label: vi ? 'Giải thưởng & Triển lãm – mỗi dòng: Năm | Giải | Tổ chức' : 'Awards & Exhibitions – per line: Year | Award | Organiser', type: 'textarea', rows: 2, default: vi ? '2025 | A\' Design Award | Bao bì Minh họa Xuất sắc\n2024 | Triển lãm Minh họa Trẻ Việt Nam | Top 20 Tác phẩm' : '2025 | A\' Design Award | Illustrated Packaging\n2024 | Young Illustrators Exhibition | Top 20 Selection' },
    { name: 'clients', label: vi ? 'Khách hàng đã hợp tác (phân tách dấu phẩy)' : 'Clients (comma separated)', default: 'Bloom Coffee, Leaf Tea, Nhã Nam, Vietcetera, Pizza 4P\'s' },
    { name: 'font', label: vi ? 'Phông chữ' : 'Font', type: 'select', default: '', options: Object.entries(PORTFOLIO_FONTS).map(([value, f]) => ({ value, label: vi ? f.vi : f.en })) },
    { name: 'paperTexture', label: vi ? 'Chất liệu nền giấy (Paper Texture)' : 'Canvas / Paper Texture', type: 'select', default: '', options: [
      { value: '', label: vi ? 'Mặc định theo mẫu' : 'Template default' },
      { value: 'watercolor', label: vi ? '🎨 Giấy màu nước loang (Watercolor Wash)' : '🎨 Watercolor Wash' },
      { value: 'dotgrid', label: vi ? '📓 Sổ tay chấm bi (Dot-Grid Notebook)' : '📓 Dot-Grid Sketchbook' },
      { value: 'grid', label: vi ? '📐 Giấy ô vuông kỹ thuật (Graph Paper)' : '📐 Squared Graph Paper' },
      { value: 'kraft', label: vi ? '📜 Giấy cổ điển ấm (Vintage Parchment)' : '📜 Vintage Parchment' }
    ] },
    { name: 'handSticker', label: vi ? 'Dấu ấn vẽ tay nổi (Hand-drawn Stamp / Doodle)' : 'Floating Hand-drawn Stamp / Doodle', type: 'select', default: '', options: [
      { value: '', label: vi ? 'Không hiển thị thêm' : 'None' },
      { value: 'inkseal', label: vi ? '🉐 Ấn chương / Dấu triện son đỏ cá nhân' : '🉐 Personal Red Ink Seal Stamp' },
      { value: 'doodle', label: vi ? '✨ Ngôi sao & nét phác thảo bút mực' : '✨ Hand-drawn Stars & Pen Flourish' },
      { value: 'botanical', label: vi ? '🌿 Nhánh lá ký họa thực vật' : '🌿 Botanical Sketch Sprig' }
    ] },
    { name: 'coverMode', type: 'hidden', default: 'hand' },
    { name: 'color', label: vi ? 'Màu nhấn' : 'Accent colour', type: 'color', default: '#e11d48' }
  ];
}
