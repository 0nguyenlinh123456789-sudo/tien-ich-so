// Libs import JSON without `with { type: 'json' }` (Vite/Astro handles it). Plain Node requires the
// attribute, so tests add it via a resolve hook instead of changing the libs (keeps the Astro build untouched).
import { registerHooks } from 'node:module';
registerHooks({
  resolve(specifier, context, next) {
    const r = next(specifier, context);
    if (r.url.endsWith('.json')) return { ...r, importAttributes: { ...(r.importAttributes || {}), type: 'json' } };
    return r;
  }
});
