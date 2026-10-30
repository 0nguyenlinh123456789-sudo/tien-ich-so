// IndexNow key verification file: served at /<indexNowKey>.txt
import site from '../config/site.json';

export function getStaticPaths() {
  return [{ params: { key: site.indexNowKey } }];
}

export function GET() {
  return new Response(site.indexNowKey, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

