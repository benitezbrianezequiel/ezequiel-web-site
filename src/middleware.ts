import { defineMiddleware } from 'astro:middleware';
import { verifySessionToken } from './lib/auth';
import { promisify } from 'node:util';
import { gzip as gzipCb } from 'node:zlib';

const gzip = promisify(gzipCb);

// Tipos MIME que vale la pena comprimir
const COMPRESSIBLE = /^(text\/|application\/json|application\/xml|application\/javascript|image\/svg\+xml)/;

export const onRequest = defineMiddleware(async (context, next) => {
  const { hostname, href } = context.url;

  // Redirigir www → non-www (301) para evitar contenido duplicado
  if (hostname.startsWith('www.')) {
    const canonical = href.replace(`://www.`, '://');
    return context.redirect(canonical, 301);
  }

  const { pathname } = context.url;

  // ── Admin auth guard ──────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    if (pathname !== '/admin/login' && pathname !== '/admin/login/') {
      const token = context.cookies.get('session')?.value;

      if (!token) {
        return context.redirect('/admin/login');
      }

      const session = verifySessionToken(token);

      if (!session) {
        const response = context.redirect('/admin/login');
        response.headers.set(
          'Set-Cookie',
          'session=; HttpOnly; SameSite=Strict; Max-Age=0; Path=/'
        );
        return response;
      }

      context.locals.user = session.user;
    }

    // Admin pages: no cache
    return next();
  }

  // ── Public pages: cache + compression ─────────────────────────
  const response = await next();

  // Cache-Control según tipo de ruta
  if (pathname === '/sitemap.xml' || pathname === '/robots.txt') {
    response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400');
  } else if (pathname.includes('/blog/') && !pathname.endsWith('/blog') && !pathname.endsWith('/blog/')) {
    // Blog posts individuales
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400');
  } else if (pathname.endsWith('/blog') || pathname.endsWith('/blog/')) {
    // Listado de blog
    response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=600, stale-while-revalidate=3600');
  } else {
    // Home, products y otras páginas estáticas
    response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400');
  }

  // Compresión gzip si el cliente la soporta
  const acceptEncoding = context.request.headers.get('accept-encoding') ?? '';
  const contentType = response.headers.get('content-type') ?? '';

  if (acceptEncoding.includes('gzip') && COMPRESSIBLE.test(contentType)) {
    const body = await response.arrayBuffer();
    const compressed = await gzip(Buffer.from(body));
    const headers = new Headers(response.headers);
    headers.set('Content-Encoding', 'gzip');
    headers.set('Vary', 'Accept-Encoding');
    headers.delete('Content-Length');
    return new Response(compressed, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  return response;
});
