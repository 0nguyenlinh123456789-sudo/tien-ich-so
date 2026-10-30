// Portfolio site generator: every style returns one self-contained HTML document (inline CSS/JS, Google Fonts only).
// The same string feeds the live preview iframe (srcdoc) and the .html download.
import { escapeHtml as e } from './format.js';

const lines = (s) => String(s || '').split('\n').map((x) => x.trim()).filter(Boolean);
const list = (s) => String(s || '').split(',').map((x) => x.trim()).filter(Boolean);
const color = (v, d) => (/^#[0-9a-f]{6}$/i.test(v || '') ? v : d);
const safeUrl = (u) => (/^(https?:\/\/|mailto:)/i.test(String(u || '').trim()) ? e(String(u).trim()) : '');
const imgSrc = (u) => (/^data:image\/(png|jpe?g|webp);base64,[a-z0-9+/=]+$/i.test(u || '') ? u : safeUrl(u));

// Placeholder artwork when a project has no image: gradient + initials, as an SVG data URL.
function placeholder(title, i, c) {
  const hues = [0, 35, 160, 210, 270, 320];
  const h = hues[i % hues.length];
  const txt = e(String(title || '?').split(/\s+/).slice(0, 2).map((w) => w[0] || '').join('').toUpperCase());
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c}"/><stop offset="1" stop-color="hsl(${h},70%,55%)"/></linearGradient></defs><rect width="800" height="600" fill="url(#g)"/><circle cx="640" cy="120" r="140" fill="#fff" opacity=".12"/><circle cx="120" cy="520" r="200" fill="#000" opacity=".08"/><text x="400" y="340" font-family="Arial" font-size="150" font-weight="900" fill="#fff" text-anchor="middle" opacity=".9">${txt}</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function prepare(v, images = []) {
  const c = color(v.color, '#2563eb');
  const projects = lines(v.projects).map((l, i) => {
    const [title, cat, year, desc, link] = l.split('|').map((x) => x.trim());
    return { title: e(title || ''), cat: e(cat || ''), year: e(year || ''), desc: e(desc || ''), link: safeUrl(link), img: imgSrc(images[i]) || placeholder(title, i, c) };
  });
  const links = lines(v.links).map((l) => { const [label, url] = l.split('|').map((x) => x.trim()); return { label: e(label || url || ''), url: safeUrl(url) }; }).filter((x) => x.url);
  return {
    c, projects, links,
    name: e(v.name), role: e(v.role), bio: e(v.bio), email: e(v.email), loc: e(v.location),
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
    script: `${REVEAL_JS}const roles=${JSON.stringify([d.role, ...d.skills.slice(0, 3)]).replace(/</g, '\u003c')};let r=0,c=0,del=false;const el=document.getElementById('ty');(function t(){const w=roles[r]||'';el.innerHTML=w.slice(0,c);if(!del&&c<w.length)c++;else if(del&&c>0)c--;else{del=!del;if(!del)r=(r+1)%roles.length}setTimeout(t,del?40:(c===w.length?1400:80))})();` });
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

export const PORTFOLIO_FIELDS = {
  vi: { design: 'Thiết kế đồ họa', art: 'Minh họa – Vẽ tay', motion: 'Motion – Video', uiux: 'UI/UX – Sản phẩm', '3d': '3D – Game', arch: 'Kiến trúc – Nội thất', photo: 'Nhiếp ảnh', fashion: 'Thời trang', dev: 'Lập trình', business: 'Kinh doanh – Marketing' },
  en: { design: 'Graphic design', art: 'Illustration', motion: 'Motion & video', uiux: 'UI/UX', '3d': '3D & game', arch: 'Architecture', photo: 'Photography', fashion: 'Fashion', dev: 'Development', business: 'Business & marketing' }
};

export const PORTFOLIO_STYLES = [
  { id: 'bento', fn: bento, vi: 'Bento Grid', en: 'Bento grid', fields: ['design', 'uiux', 'business', 'dev'], desc: { vi: 'Lưới khối module, thẻ bật lên, hover phóng ảnh', en: 'Modular blocks, pop-in cards, hover zoom' } },
  { id: 'kinetic', fn: kinetic, vi: 'Chữ chuyển động', en: 'Kinetic type', fields: ['design', 'motion', 'art'], desc: { vi: 'Chữ khổng lồ chạy theo cuộn, con trỏ tùy biến, ảnh hiện theo chuột', en: 'Scroll-driven giant type, custom cursor, hover image' } },
  { id: 'split', fn: split, vi: 'Chia đôi màn hình', en: 'Split screen', fields: ['photo', 'arch', 'fashion', 'design'], desc: { vi: 'Hồ sơ cố định một bên, dự án cuộn bên kia', en: 'Sticky profile, scrolling work' } },
  { id: 'casestudy', fn: casestudy, vi: 'Trang chi tiết dự án', en: 'Case study pages', fields: ['uiux', 'design', 'arch', '3d', 'business'], desc: { vi: 'Bấm dự án mở trang riêng, chuyển cảnh vòng tròn', en: 'Each project opens its own page with a reveal transition' } },
  { id: 'professional', fn: professional, vi: 'Chuyên nghiệp', en: 'Professional', fields: ['business', 'uiux', 'design'], desc: { vi: 'Gọn gàng, thẻ dự án, hợp mọi ngành', en: 'Clean case-study cards for any field' } },
  { id: 'graphic', fn: graphic, vi: 'Graphic Designer', en: 'Graphic designer', fields: ['design'], desc: { vi: 'Chữ khổng lồ, lưới masonry, chạy chữ', en: 'Huge type, masonry grid, marquee' } },
  { id: 'sketch', fn: sketchbook, vi: 'Sổ phác thảo', en: 'Sketchbook', fields: ['art'], desc: { vi: 'Sổ phác thảo, băng dính, nét bút', en: 'Sketchbook, tape, pen strokes' } },
  { id: 'illustrator', fn: illustrator, vi: 'Illustrator vẽ tay', en: 'Illustrator', fields: ['art', 'design'], desc: { vi: 'Nét vẽ SVG tự vẽ ra, icon nét tay', en: 'Self-drawing SVG doodles' } },
  { id: 'collage', fn: collage, vi: 'Collage cắt dán', en: 'Collage', fields: ['art', 'design', 'fashion'], desc: { vi: 'Chữ cắt giấy, sticker, băng dính, bút dạ', en: 'Paper cut-outs, stickers, marker' } },
  { id: 'motion', fn: motion, vi: 'Chuyển động Motion', en: 'Motion', fields: ['motion', 'design'], desc: { vi: 'Nền loang động, chữ gõ, hiện khi cuộn', en: 'Animated blobs, typing, scroll reveal' } },
  { id: 'showreel', fn: showreel, vi: 'Video Showreel', en: 'Video showreel', fields: ['motion'], desc: { vi: 'Dải phim chạy, nút play, khung REC', en: 'Film strip, play buttons, REC HUD' } },
  { id: 'parallax', fn: parallax, vi: 'Parallax nhiều lớp', en: 'Layered parallax', fields: ['design', 'art', 'motion'], desc: { vi: '5 lớp vector chuyển động theo chuột và cuộn', en: '5 vector layers react to mouse & scroll' } },
  { id: '3d', fn: threeD, vi: 'Không gian 3D', en: '3D space', fields: ['3d', 'motion'], desc: { vi: 'Khối lập phương xoay, thẻ nghiêng theo chuột', en: 'Spinning cube, mouse-tilt cards' } },
  { id: 'game', fn: game, vi: 'Game / 3D Artist', en: 'Game / 3D artist', fields: ['3d'], desc: { vi: 'Chữ glitch, thẻ lật 3D, ánh neon', en: 'Glitch title, 3D flip cards, neon' } },
  { id: 'uiux', fn: uiux, vi: 'UI/UX Case study', en: 'UI/UX case study', fields: ['uiux', 'dev'], desc: { vi: 'Mockup laptop + điện thoại, icon quy trình', en: 'Laptop & phone mockups, process icons' } },
  { id: 'developer', fn: developer, vi: 'Lập trình viên', en: 'Developer', fields: ['dev'], desc: { vi: 'Terminal gõ lệnh, kiểu GitHub', en: 'Typing terminal, GitHub-style repos' } },
  { id: 'blueprint', fn: blueprint, vi: 'Kiến trúc Blueprint', en: 'Blueprint', fields: ['arch'], desc: { vi: 'Nền bản vẽ kỹ thuật, nét đo kích thước', en: 'Technical drawing grid, dimension lines' } },
  { id: 'editorial', fn: editorial, vi: 'Kiến trúc – Tạp chí', en: 'Editorial', fields: ['arch', 'business'], desc: { vi: 'Chữ có chân, case study đánh số', en: 'Serif, numbered case studies' } },
  { id: 'fashion', fn: fashion, vi: 'Thời trang Lookbook', en: 'Fashion lookbook', fields: ['fashion', 'photo'], desc: { vi: 'Cuộn ngang, chữ có chân lớn, ảnh vòm', en: 'Horizontal scroll, big serif, arch image' } },
  { id: 'photo', fn: photography, vi: 'Nhiếp ảnh', en: 'Photography', fields: ['photo'], desc: { vi: 'Ảnh tràn màn hình, phóng to khi bấm', en: 'Full-bleed photos with lightbox' } }
];

export const PORTFOLIO_FONTS = {
  '': { vi: 'Theo mẫu', en: 'Style default' },
  'Be Vietnam Pro': { vi: 'Be Vietnam Pro – hiện đại', en: 'Be Vietnam Pro – modern', q: 'family=Be+Vietnam+Pro:wght@400;700;900' },
  'Montserrat': { vi: 'Montserrat – mạnh mẽ', en: 'Montserrat – bold', q: 'family=Montserrat:wght@400;700;900' },
  'Space Grotesk': { vi: 'Space Grotesk – công nghệ', en: 'Space Grotesk – tech', q: 'family=Space+Grotesk:wght@400;700' },
  'Playfair Display': { vi: 'Playfair – sang trọng', en: 'Playfair – elegant', q: 'family=Playfair+Display:ital,wght@0,400;0,800;1,400' },
  'Lora': { vi: 'Lora – có chân, dễ đọc', en: 'Lora – readable serif', q: 'family=Lora:ital,wght@0,400;0,700;1,400' },
  'Patrick Hand': { vi: 'Patrick Hand – viết tay', en: 'Patrick Hand – handwritten', q: 'family=Patrick+Hand' },
  'JetBrains Mono': { vi: 'JetBrains Mono – lập trình', en: 'JetBrains Mono – code', q: 'family=JetBrains+Mono:wght@400;700' }
};

// Optional sections every style can show, in the order the user picks. They inherit the style's text colour
// (currentColor) and use the accent, so the same blocks sit well on light and dark designs.
export const SECTION_KEYS = ['stats', 'services', 'process', 'deepdive', 'experience', 'awards', 'testimonials', 'clients'];
export const SECTION_NAMES = {
  vi: { stats: 'Số liệu nổi bật', services: 'Dịch vụ', process: 'Quy trình làm việc', deepdive: 'Chi tiết dự án (case study)', experience: 'Kinh nghiệm', awards: 'Giải thưởng', testimonials: 'Khách hàng nói gì', clients: 'Khách hàng đã hợp tác' },
  en: { stats: 'Key numbers', services: 'Services', process: 'Process', deepdive: 'Case studies', experience: 'Experience', awards: 'Awards', testimonials: 'Testimonials', clients: 'Clients' }
};
const SVC_ICONS = ['pen', 'layers', 'play', 'cube', 'grid', 'idea', 'ruler', 'star'];

function extraSections(v, d, lang) {
  const vi = lang !== 'en';
  const c = d.c;
  const N = SECTION_NAMES[vi ? 'vi' : 'en'];
  const rows = (s) => lines(s).map((l) => l.split('|').map((x) => e(x.trim())));
  const order = String(v.sections || SECTION_KEYS.join(',')).split(',').filter((k) => SECTION_KEYS.includes(k));
  const det = Array.isArray(v.projectDetails) ? v.projectDetails : [];
  const h = (k, sub = '') => `<div class="pfx-hd"><span class="pfx-k">${String(order.indexOf(k) + 1).padStart(2, '0')}</span><h2>${N[k]}</h2>${sub ? `<p>${sub}</p>` : ''}</div>`;

  const build = {
    stats: () => {
      const r = rows(v.stats); if (!r.length) return '';
      return `<section class="pfx-s">${h('stats')}<div class="pfx-stats">${r.map(([n = '', l = '']) => `<div class="pfx-rv"><b data-count="${n}">${n}</b><span>${l}</span></div>`).join('')}</div></section>`;
    },
    services: () => {
      const r = rows(v.services); if (!r.length) return '';
      return `<section class="pfx-s">${h('services', vi ? 'Những gì mình có thể giúp bạn' : 'How I can help')}<div class="pfx-svc">${r.map(([t = '', s = ''], i) => `<div class="pfx-card pfx-rv"><span class="pfx-ic">${svg(SVC_ICONS[i % SVC_ICONS.length], 22)}</span><h3>${t}</h3><p>${s}</p></div>`).join('')}</div></section>`;
    },
    process: () => {
      const r = rows(v.process); if (!r.length) return '';
      return `<section class="pfx-s">${h('process')}<ol class="pfx-proc">${r.map(([t = '', s = ''], i) => `<li class="pfx-rv"><span>${String(i + 1).padStart(2, '0')}</span><h3>${t}</h3><p>${s}</p></li>`).join('')}</ol></section>`;
    },
    deepdive: () => {
      const items = d.projects.map((p, i) => ({ p, x: det[i] || {} })).filter(({ x }) => x.challenge || x.solution || x.result || (x.gallery || []).length);
      if (!items.length) return '';
      const L3 = vi ? ['Thử thách', 'Giải pháp', 'Kết quả'] : ['Challenge', 'Solution', 'Result'];
      return `<section class="pfx-s">${h('deepdive', vi ? 'Quá trình tư duy đằng sau từng dự án' : 'The thinking behind the work')}${items.map(({ p, x }, j) => {
        const gal = (x.gallery || []).map((g) => imgSrc(g)).filter(Boolean).slice(0, 8);
        return `<article class="pfx-dd${j % 2 ? ' rev' : ''}"><div class="pfx-dd-top"><img class="pfx-rv" src="${p.img}" alt="${p.title}"><div class="pfx-rv"><small>${p.cat} · ${p.year}</small><h3>${p.title}</h3><p>${p.desc}</p>${p.link ? `<a href="${p.link}" target="_blank" rel="noopener">${vi ? 'Xem dự án' : 'View project'} →</a>` : ''}</div></div>
<div class="pfx-csr">${[x.challenge, x.solution, x.result].map((t, k) => (t ? `<div class="pfx-rv"><em>${L3[k]}</em><p>${e(t)}</p></div>` : '')).join('')}</div>
${gal.length ? `<div class="pfx-gal g${Math.min(gal.length, 4)}">${gal.map((g) => `<img class="pfx-rv" src="${g}" alt="${p.title}" loading="lazy">`).join('')}</div>` : ''}</article>`;
      }).join('')}</section>`;
    },
    experience: () => {
      const r = rows(v.experience); if (!r.length) return '';
      return `<section class="pfx-s">${h('experience')}${r.map(([yr = '', role = '', org = '', note = '']) => `<div class="pfx-row pfx-rv"><div class="pfx-yr">${yr}</div><div><b>${role}</b><span>${org}${note ? ` — ${note}` : ''}</span></div></div>`).join('')}</section>`;
    },
    awards: () => {
      const r = rows(v.awards); if (!r.length) return '';
      return `<section class="pfx-s">${h('awards')}${r.map(([yr = '', name = '', org = '']) => `<div class="pfx-row pfx-rv"><div class="pfx-yr">${yr}</div><div><b>${svg('star', 16, `color:${c};margin-right:6px`)}${name}</b><span>${org}</span></div></div>`).join('')}</section>`;
    },
    testimonials: () => {
      const r = rows(v.testimonials); if (!r.length) return '';
      return `<section class="pfx-s">${h('testimonials')}<div class="pfx-tm">${r.map(([q = '', who = '', pos = '']) => `<figure class="pfx-card pfx-rv"><span class="pfx-q">“</span><blockquote>${q}</blockquote><figcaption><i>${(who.replace(/&[^;]+;/g, '').trim()[0] || '?').toUpperCase()}</i><span><b>${who}</b>${pos}</span></figcaption></figure>`).join('')}</div></section>`;
    },
    clients: () => {
      const cl = list(v.clients).map(e); if (!cl.length) return '';
      return `<section class="pfx-s">${h('clients')}<div class="pfx-cl"><div class="pfx-cl-t">${[...cl, ...cl].map((x) => `<span>${x}</span>`).join('')}</div></div></section>`;
    }
  };
  const html = order.map((k) => build[k]()).join('');
  if (!html) return '';
  const line = 'color-mix(in srgb,currentColor 16%,transparent)';
  return `<style>.pfx{max-width:1140px;margin:0 auto;padding:40px 24px 30px}.pfx-s{padding:60px 0;border-top:1px solid ${line}}.pfx-s:first-child{border-top:0}
.pfx-hd{display:grid;grid-template-columns:70px 1fr;align-items:baseline;margin-bottom:34px}.pfx-hd h2{margin:0;font-size:clamp(28px,4vw,46px);line-height:1.05;letter-spacing:-.02em}.pfx-hd p{grid-column:2;margin:8px 0 0;opacity:.65;font-size:17px}.pfx-k{color:${c};font-weight:700;font-size:15px;letter-spacing:.08em}
.pfx-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:18px}.pfx-stats div{padding:26px;border:1px solid ${line};border-radius:20px}.pfx-stats b{display:block;font-size:clamp(40px,5vw,62px);line-height:1;color:${c};letter-spacing:-.03em}.pfx-stats span{opacity:.7}
.pfx-svc,.pfx-tm{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px}.pfx-card{border:1px solid ${line};border-radius:20px;padding:26px;margin:0;transition:transform .35s,border-color .35s}.pfx-card:hover{transform:translateY(-4px);border-color:${c}}
.pfx-ic{display:inline-grid;place-items:center;width:46px;height:46px;border-radius:14px;background:color-mix(in srgb,${c} 16%,transparent);color:${c}}.pfx-card h3{margin:16px 0 6px;font-size:20px}.pfx-card p{margin:0;opacity:.72;line-height:1.6}
.pfx-proc{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:0;counter-reset:s}.pfx-proc li{padding:0 20px 0 0;position:relative}.pfx-proc li span{display:grid;place-items:center;width:52px;height:52px;border-radius:50%;background:${c};color:#fff;font-weight:700;position:relative;z-index:1}
.pfx-proc li::before{content:"";position:absolute;top:26px;left:52px;right:0;height:2px;background:${line}}.pfx-proc li:last-child::before{display:none}.pfx-proc h3{margin:16px 0 6px;font-size:19px}.pfx-proc p{margin:0;opacity:.7;line-height:1.55}
.pfx-dd{margin-bottom:70px}.pfx-dd-top{display:grid;grid-template-columns:1.2fr 1fr;gap:40px;align-items:center}.pfx-dd.rev .pfx-dd-top>img{order:2}.pfx-dd-top img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:18px}.pfx-dd h3{font-size:clamp(28px,3.4vw,40px);margin:6px 0 10px;line-height:1.1}.pfx-dd small{color:${c};font-weight:700;text-transform:uppercase;letter-spacing:.08em}.pfx-dd p{opacity:.78;line-height:1.65}.pfx-dd a{color:${c};font-weight:700}
.pfx-csr{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:18px;margin-top:28px}.pfx-csr div{border-top:3px solid ${c};padding-top:14px}.pfx-csr em{font-style:normal;font-weight:700;text-transform:uppercase;letter-spacing:.08em;font-size:13px}.pfx-csr p{margin:6px 0 0}
.pfx-gal{display:grid;gap:12px;margin-top:24px}.pfx-gal.g2{grid-template-columns:1fr 1fr}.pfx-gal.g3{grid-template-columns:2fr 1fr 1fr}.pfx-gal.g4{grid-template-columns:repeat(4,1fr)}.pfx-gal img{width:100%;height:100%;aspect-ratio:1;object-fit:cover;border-radius:14px}.pfx-gal.g1 img{aspect-ratio:16/8}
.pfx-row{display:grid;grid-template-columns:170px 1fr;gap:18px;padding:18px 0;border-top:1px solid ${line}}.pfx-row b{display:block;font-size:18px}.pfx-row span{opacity:.7}.pfx-yr{color:${c};font-weight:700}
.pfx-q{font-size:70px;line-height:.6;color:${c};font-family:Georgia,serif}.pfx-tm blockquote{margin:6px 0 20px;font-size:17px;line-height:1.6}.pfx-tm figcaption{display:flex;gap:12px;align-items:center}.pfx-tm i{font-style:normal;width:42px;height:42px;border-radius:50%;background:${c};color:#fff;display:grid;place-items:center;font-weight:700}.pfx-tm figcaption span{display:flex;flex-direction:column;opacity:.85;font-size:14px}
.pfx-cl{overflow:hidden;mask:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent);-webkit-mask:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)}.pfx-cl-t{display:flex;gap:14px;width:max-content;animation:pfxm 28s linear infinite}.pfx-cl-t span{padding:18px 30px;border:1px solid ${line};border-radius:14px;font-weight:700;font-size:18px;letter-spacing:.03em;white-space:nowrap}@keyframes pfxm{to{transform:translateX(-50%)}}
.pfx-js .pfx-rv{opacity:0;transform:translateY(26px);transition:opacity .8s cubic-bezier(.2,.8,.2,1),transform .8s cubic-bezier(.2,.8,.2,1)}.pfx-js .pfx-rv.on{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){.pfx-js .pfx-rv{opacity:1!important;transform:none!important}.pfx-cl-t{animation:none}}
@media(max-width:700px){.pfx-hd{grid-template-columns:1fr}.pfx-hd p{grid-column:1}.pfx-dd-top{grid-template-columns:1fr}.pfx-dd.rev .pfx-dd-top>img{order:0}.pfx-row{grid-template-columns:1fr;gap:4px}.pfx-proc li::before{display:none}.pfx-proc{gap:24px}.pfx-gal.g3,.pfx-gal.g4{grid-template-columns:1fr 1fr}}</style>
<div class="pfx" id="pfx">${html}</div><script>(function(){var r=document.getElementById('pfx');if(!('IntersectionObserver' in window))return;r.classList.add('pfx-js');var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('on');io.unobserve(x.target)}})},{threshold:.12});
r.querySelectorAll('.pfx-rv').forEach(function(el,i){el.style.transitionDelay=(i%4)*80+'ms';io.observe(el)});
r.querySelectorAll('[data-count]').forEach(function(el){var m=/^(\\D*)(\\d+)(.*)$/.exec(el.textContent);if(!m)return;var n=+m[2],t0=0;var o=new IntersectionObserver(function(es){if(!es[0].isIntersecting)return;o.disconnect();(function f(t){t0=t0||t;var k=Math.min(1,(t-t0)/1400);el.textContent=m[1]+Math.round(n*(1-Math.pow(1-k,3)))+m[3];if(k<1)requestAnimationFrame(f)})(performance.now())});o.observe(el)})})();</script>`;
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
  const extra = extraSections(values, d, lang);
  if (extra) {
    const at = html.lastIndexOf('<footer');
    html = at > 0 ? html.slice(0, at) + extra + html.slice(at) : html.replace('</body>', extra + '</body>');
  }
  const font = PORTFOLIO_FONTS[values.font];
  if (font && font.q) {
    html = html.replace('</head>', `<link href="https://fonts.googleapis.com/css2?${font.q}&display=swap" rel="stylesheet"><style>body,h1,h2,h3,h4,p,a,small,b,div,span,figcaption,button{font-family:'${values.font}',system-ui,sans-serif!important}</style></head>`);
  }
  if (opts.edit) {
    const map = { name: values.name, role: values.role, bio: values.bio, location: values.location };
    lines(values.projects).forEach((l, i) => {
      const [title, cat, , desc] = l.split('|').map((x) => x.trim());
      Object.assign(map, { [`p${i}.title`]: title, [`p${i}.cat`]: cat, [`p${i}.desc`]: desc });
    });
    (Array.isArray(values.projectDetails) ? values.projectDetails : []).forEach((x, i) => {
      ['challenge', 'solution', 'result'].forEach((k) => { if (x && x[k]) map[`p${i}.${k}`] = x[k]; });
    });
    // Section rows: key "f:<field>:<line>:<column>" lets the tool rewrite exactly that cell of the textarea.
    ['stats', 'services', 'process', 'testimonials', 'experience', 'awards'].forEach((name) => {
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
    { name: 'name', label: vi ? 'Họ tên' : 'Name', default: vi ? 'Trần Hà My' : 'Maya Tran' },
    { name: 'role', label: vi ? 'Nghề nghiệp' : 'Role', default: vi ? 'Graphic & Motion Designer' : 'Graphic & Motion Designer' },
    { name: 'bio', label: vi ? 'Giới thiệu ngắn' : 'Short bio', type: 'textarea', default: vi ? 'Mình thiết kế nhận diện thương hiệu và chuyển động cho các thương hiệu trẻ. 6 năm kinh nghiệm, 40+ dự án cho F&B, thời trang và công nghệ.' : 'I design brand identities and motion for young brands. 6 years, 40+ projects in F&B, fashion and tech.' },
    { name: 'email', label: 'Email', default: 'hello@hamy.design' },
    { name: 'location', label: vi ? 'Nơi làm việc' : 'Location', default: vi ? 'Hà Nội, Việt Nam' : 'Hanoi, Vietnam' },
    { name: 'links', label: vi ? 'Liên kết – mỗi dòng: Tên | https://…' : 'Links – per line: Label | https://…', type: 'textarea', rows: 3, default: 'Behance | https://www.behance.net/\nInstagram | https://www.instagram.com/\nLinkedIn | https://www.linkedin.com/' },
    { name: 'skills', label: vi ? 'Kỹ năng (phân tách dấu phẩy)' : 'Skills (comma separated)', default: 'Branding, Motion Graphics, After Effects, Illustration, Figma, Blender 3D' },
    { name: 'projects', label: vi ? 'Dự án – mỗi dòng: Tên | Lĩnh vực | Năm | Mô tả | Link' : 'Projects – per line: Title | Category | Year | Description | Link', type: 'textarea', rows: 7, default: vi
      ? 'Bloom Coffee | Branding | 2026 | Bộ nhận diện cho chuỗi cà phê 12 cửa hàng | https://www.behance.net/\nNeon Nights | Motion | 2025 | Video quảng cáo 30s cho lễ hội âm nhạc |\nLeaf Packaging | Packaging | 2025 | Bao bì trà hữu cơ, giải A Design Award |\nPixel Pets | Illustration | 2024 | Bộ 40 sticker vẽ tay cho ứng dụng chat |\nOrbit App | UI/UX | 2024 | Ứng dụng đặt lịch, tăng 32% tỷ lệ chuyển đổi |\nCube World | 3D | 2023 | Loạt ảnh 3D isometric cho chiến dịch Tết |'
      : 'Bloom Coffee | Branding | 2026 | Identity for a 12-store coffee chain | https://www.behance.net/\nNeon Nights | Motion | 2025 | 30s spot for a music festival |\nLeaf Packaging | Packaging | 2025 | Organic tea packaging, A\' Design Award |\nPixel Pets | Illustration | 2024 | 40 hand-drawn stickers for a chat app |\nOrbit App | UI/UX | 2024 | Booking app, +32% conversion |\nCube World | 3D | 2023 | Isometric 3D series for a campaign |' },
    { name: 'stats', label: vi ? 'Số liệu nổi bật – mỗi dòng: Con số | Nhãn' : 'Key numbers – per line: Number | Label', type: 'textarea', rows: 3, default: vi ? '6+ | Năm kinh nghiệm\n40+ | Dự án hoàn thành\n25 | Thương hiệu hợp tác\n3 | Giải thưởng thiết kế' : '6+ | Years of experience\n40+ | Projects shipped\n25 | Brands served\n3 | Design awards' },
    { name: 'services', label: vi ? 'Dịch vụ – mỗi dòng: Tên | Mô tả' : 'Services – per line: Name | Description', type: 'textarea', rows: 3, default: vi ? 'Nhận diện thương hiệu | Logo, bảng màu, typography và bộ quy chuẩn sử dụng\nMotion graphics | Video ngắn, logo động, nội dung mạng xã hội\nBao bì sản phẩm | Thiết kế bao bì từ ý tưởng đến file in' : 'Brand identity | Logo, colour, typography and guidelines\nMotion graphics | Short videos, animated logos, social content\nPackaging | From concept to print-ready files' },
    { name: 'process', label: vi ? 'Quy trình – mỗi dòng: Bước | Mô tả' : 'Process – per line: Step | Description', type: 'textarea', rows: 3, default: vi ? 'Thấu hiểu | Gặp gỡ, tìm hiểu mục tiêu và người dùng\nNghiên cứu | Phân tích đối thủ, moodboard, insight\nÝ tưởng | Phác thảo nhiều hướng, chọn hướng tốt nhất\nThiết kế | Hoàn thiện chi tiết, thử nghiệm thực tế\nBàn giao | File chuẩn, hướng dẫn sử dụng, hỗ trợ sau' : 'Empathise | Understand goals and users\nResearch | Competitors, moodboard, insights\nIdeate | Sketch many directions, pick the best\nDesign | Refine and test in context\nDeliver | Final files, guidelines, support' },
    { name: 'testimonials', label: vi ? 'Khách hàng nói gì – mỗi dòng: Lời nhận xét | Tên | Chức vụ, công ty (chỉ dùng nhận xét thật)' : 'Testimonials – per line: Quote | Name | Role, company (real quotes only)', type: 'textarea', rows: 2, default: '', placeholder: vi ? 'Làm việc rất chuyên nghiệp, đúng hạn | Nguyễn Văn A | Giám đốc Marketing, Công ty B' : 'Professional and on time | Jane Doe | Marketing Director, Acme' },
    { name: 'sections', type: 'hidden', default: SECTION_KEYS.join(',') },
    { name: 'experience', label: vi ? 'Kinh nghiệm – mỗi dòng: Năm | Vị trí | Công ty | Ghi chú' : 'Experience – per line: Years | Role | Company | Note', type: 'textarea', rows: 3, default: '', placeholder: vi ? '2023 – nay | Senior Designer | Studio ABC | Dẫn dắt team 5 người\n2020 – 2023 | Graphic Designer | Agency XYZ' : '2023 – now | Senior Designer | Studio ABC\n2020 – 2023 | Graphic Designer | Agency XYZ' },
    { name: 'awards', label: vi ? 'Giải thưởng – mỗi dòng: Năm | Giải | Tổ chức' : 'Awards – per line: Year | Award | Organiser', type: 'textarea', rows: 2, default: '', placeholder: vi ? '2025 | Giải Bạc | Vietnam Design Awards' : '2025 | Silver | Design Awards' },
    { name: 'clients', label: vi ? 'Khách hàng đã hợp tác (phân tách dấu phẩy)' : 'Clients (comma separated)', default: '', placeholder: 'Highlands Coffee, VinFast, Shopee' },
    { name: 'font', label: vi ? 'Phông chữ' : 'Font', type: 'select', default: '', options: Object.entries(PORTFOLIO_FONTS).map(([value, f]) => ({ value, label: vi ? f.vi : f.en })) },
    { name: 'color', label: vi ? 'Màu nhấn' : 'Accent colour', type: 'color', default: '#2563eb' }
  ];
}
