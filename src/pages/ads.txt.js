// ads.txt for ad networks (AdSense requires it): set monetization.json -> adsTxt
import M from '../config/monetization.json';

export function GET() {
  return new Response((M.adsTxt || '').trim() + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
