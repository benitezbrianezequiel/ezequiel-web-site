// scripts/seed.mjs
// Migra el post inicial de bienvenida a la base de datos SQLite.
// Uso: node scripts/seed.mjs
// Se puede ejecutar múltiples veces de forma segura (INSERT OR IGNORE).
import Database from 'better-sqlite3';
import { join, dirname } from 'node:path';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const dataDir = join(rootDir, 'data');

mkdirSync(dataDir, { recursive: true });

const db = new Database(join(dataDir, 'blog.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    slug        TEXT    NOT NULL UNIQUE,
    title       TEXT    NOT NULL,
    description TEXT    NOT NULL DEFAULT '',
    content     TEXT    NOT NULL DEFAULT '',
    tags        TEXT    NOT NULL DEFAULT '[]',
    draft       INTEGER NOT NULL DEFAULT 0,
    cover_image TEXT    DEFAULT NULL,
    pub_date    TEXT    NOT NULL,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );
`);

const content = `Bienvenidos a mi blog.

Este es el lugar donde voy a compartir todo lo que aprendo siendo desarrollador: tutoriales técnicos, reflexiones sobre la carrera, herramientas que uso, problemas que resuelvo y mucho más.

## ¿Por qué un blog?

Siempre creí que escribir es una de las mejores formas de consolidar el conocimiento. Cuando tenés que explicarle algo a otro (o a tu yo del futuro), te das cuenta rápido de qué entendés bien y qué estás improvisando.

Además, hay mucho contenido técnico en inglés. Este blog va a ser en español, pensado para la comunidad hispanohablante de desarrolladores.

## ¿Qué vas a encontrar acá?

- Posts técnicos sobre tecnologías que uso (TypeScript, Node.js, Astro, React Native, entre otras)
- Reflexiones sobre la carrera: freelance, emprendimiento, aprendizaje continuo
- Casos de uso reales de proyectos en los que trabajo
- Opiniones honestas sobre herramientas y frameworks

## Vamos

No prometí publicar todos los días. Prometí publicar cosas que valgan la pena.

Seguime para no perderte los próximos posts.

— Ezequiel`;

const insert = db.prepare(`
  INSERT OR IGNORE INTO posts (slug, title, description, content, tags, draft, pub_date)
  VALUES (?, ?, ?, ?, ?, 0, ?)
`);

insert.run(
  'bienvenido',
  'Bienvenido a mi blog',
  'Este es el primer post de mi blog personal. Acá voy a escribir sobre tecnología, desarrollo de software y todo lo que voy aprendiendo en el camino.',
  content,
  JSON.stringify(['personal', 'intro']),
  '2026-03-04'
);

console.log('Seed completado. Post "bienvenido" insertado (o ya existía).');
db.close();
