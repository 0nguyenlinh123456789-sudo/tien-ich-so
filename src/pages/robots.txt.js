import site from '../config/site.json';

export function GET() {
  const body = `User-agent: *
Allow: /

Sitemap: ${new URL('/sitemap-index.xml', site.siteUrl).href}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

