// Whitelist for image sources coming from localStorage / user uploads / GitHub API.
// Accepts only base64 raster data URLs, or https images on hosts allowed by CSP img-src
// (avatars.githubusercontent.com, api.dicebear.com). Anything else returns '' so callers show a default icon.
const DATA_IMG = /^data:image\/(png|jpe?g|webp);base64,[A-Za-z0-9+/=]+$/;
const CSP_IMG = /^https:\/\/(avatars\.githubusercontent\.com|api\.dicebear\.com)\/[^\s"'<>]+$/i;

export function safeImageSrc(v) {
  const s = typeof v === 'string' ? v.trim() : '';
  if (!s) return '';
  return DATA_IMG.test(s) || CSP_IMG.test(s) ? s.replace(/&/g, '&amp;') : '';
}
