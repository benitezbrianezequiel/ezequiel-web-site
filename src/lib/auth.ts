import crypto from 'node:crypto';

const SESSION_DURATION_MS = 86_400_000; // 24 horas

function getSecret(): string {
  const secret = import.meta.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET no está definido en .env');
  return secret;
}

export function createSessionToken(username: string): string {
  const payload = Buffer.from(
    JSON.stringify({ user: username, exp: Date.now() + SESSION_DURATION_MS })
  ).toString('base64url');

  const hmac = crypto
    .createHmac('sha256', getSecret())
    .update(payload)
    .digest('hex');

  return `${payload}.${hmac}`;
}

export function verifySessionToken(token: string): { user: string } | null {
  const dotIndex = token.lastIndexOf('.');
  if (dotIndex === -1) return null;

  const payload = token.slice(0, dotIndex);
  const receivedHmac = token.slice(dotIndex + 1);

  const expectedHmac = crypto
    .createHmac('sha256', getSecret())
    .update(payload)
    .digest('hex');

  // Comparación segura en tiempo constante (previene timing oracle)
  try {
    const len = Math.max(receivedHmac.length, expectedHmac.length);
    const a = Buffer.alloc(len, 0);
    const b = Buffer.alloc(len, 0);
    Buffer.from(receivedHmac, 'hex').copy(a);
    Buffer.from(expectedHmac, 'hex').copy(b);
    if (!crypto.timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }

  try {
    const data = JSON.parse(
      Buffer.from(payload, 'base64url').toString()
    ) as { user: string; exp: number };
    if (data.exp < Date.now()) return null;
    return { user: data.user };
  } catch {
    return null;
  }
}

export function getSessionCookieHeader(token: string): string {
  return `session=${token}; HttpOnly; SameSite=Strict; Max-Age=86400; Path=/`;
}

export function clearSessionCookieHeader(): string {
  return `session=; HttpOnly; SameSite=Strict; Max-Age=0; Path=/`;
}
