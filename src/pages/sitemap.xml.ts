import type { APIRoute } from 'astro';
import { getDb } from '../lib/db';
import type { BlogPostRow } from '../lib/types';

const STATIC_PATHS = [
  { path: '/es/', priority: '1.0', changefreq: 'weekly' },
  { path: '/en/', priority: '1.0', changefreq: 'weekly' },
  { path: '/es/blog', priority: '0.8', changefreq: 'daily' },
  { path: '/en/blog', priority: '0.8', changefreq: 'daily' },
  { path: '/es/products', priority: '0.7', changefreq: 'monthly' },
  { path: '/en/products', priority: '0.7', changefreq: 'monthly' },
];

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export const GET: APIRoute = ({ site }) => {
  const base = site?.origin ?? 'https://ezequielbenitez.site/';

  const db = getDb();
  const posts = db
    .prepare('SELECT slug, updated_at FROM posts WHERE draft = 0 ORDER BY pub_date DESC')
    .all() as Pick<BlogPostRow, 'slug' | 'updated_at'>[];

  const urls = STATIC_PATHS.map(
    (p) =>
      `  <url>
    <loc>${escapeXml(base + p.path)}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  );

  for (const post of posts) {
    const lastmod = post.updated_at.split(' ')[0]; // yyyy-mm-dd
    for (const lang of ['es', 'en']) {
      urls.push(
        `  <url>
    <loc>${escapeXml(`${base}/${lang}/blog/${post.slug}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`
      );
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
