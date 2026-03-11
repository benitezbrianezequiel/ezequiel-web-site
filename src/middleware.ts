import { defineMiddleware } from 'astro:middleware';
import { verifySessionToken } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Solo interceptamos rutas /admin
  if (!pathname.startsWith('/admin')) {
    return next();
  }

  // La página de login siempre es accesible
  if (pathname === '/admin/login' || pathname === '/admin/login/') {
    return next();
  }

  const token = context.cookies.get('session')?.value;

  if (!token) {
    return context.redirect('/admin/login');
  }

  const session = verifySessionToken(token);

  if (!session) {
    // Expirado o manipulado — limpiar la cookie y redirigir
    const response = context.redirect('/admin/login');
    response.headers.set(
      'Set-Cookie',
      'session=; HttpOnly; SameSite=Strict; Max-Age=0; Path=/'
    );
    return response;
  }

  context.locals.user = session.user;
  return next();
});
