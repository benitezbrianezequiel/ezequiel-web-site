import { defineMiddleware } from 'astro:middleware';
import { verifySessionToken } from './lib/auth';

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

    // Admin pages: sin cache, no indexar
    const response = await next();
    response.headers.set('Cache-Control', 'private, no-store');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    setSecurityHeaders(response);
    return response;
  }

  // ── Public pages: cache para Cloudflare edge ──────────────────
  const response = await next();
  const contentType = response.headers.get('Content-Type') ?? '';

  if (contentType.includes('text/html')) {
    response.headers.set('Cache-Control', 'no-store');
  } else if (pathname === '/sitemap.xml' || pathname === '/robots.txt') {
    response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400');
  } else if (pathname.includes('/blog/') && !pathname.endsWith('/blog') && !pathname.endsWith('/blog/')) {
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400');
  } else if (pathname.endsWith('/blog') || pathname.endsWith('/blog/')) {
    response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=600, stale-while-revalidate=3600');
  } else {
    response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400');
  }

  setSecurityHeaders(response);
  return response;
});

function setSecurityHeaders(response: Response) {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
}
