// Whitelist for image sources coming from localStorage / user uploads / GitHub API.
// Accepts only base64 raster data URLs, or https images on hosts allowed by CSP img-src
// (avatars.githubusercontent.com, api.dicebear.com). Anything else returns '' so callers show a default icon.
const DATA_IMG = /^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/;
const DATA_SVG = /^data:image\/svg\+xml;charset=utf-8,[A-Za-z0-9%~._!'()*,;:@&+$/?-]+$/;
const UNSAFE_SVG = /(%3C|<)\s*script|javascript:|on[a-z]+\s*=/i;
const CSP_IMG = /^https:\/\/(avatars\.githubusercontent\.com|api\.dicebear\.com)\/[^\s"'<>]+$/i;

export function safeImageSrc(v) {
  const s = typeof v === 'string' ? v.trim() : '';
  if (!s) return '';
  if (DATA_IMG.test(s) || CSP_IMG.test(s)) return s.replace(/&/g, '&amp;');
  if (DATA_SVG.test(s) && !UNSAFE_SVG.test(s)) return s.replace(/&/g, '&amp;');
  return '';
}
