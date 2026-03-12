import Database from 'better-sqlite3';
import { join, dirname } from 'node:path';
import { mkdirSync } from 'node:fs';
import type { BlogPost, BlogPostRow } from './types';

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;

  const dbPath = import.meta.env.DB_PATH ?? './data/blog.db';
  const resolvedPath = dbPath.startsWith('.')
    ? join(process.cwd(), dbPath)
    : dbPath;

  // Asegurarse de que el directorio existe
  mkdirSync(dirname(resolvedPath), {
    recursive: true,
  });

  _db = new Database(resolvedPath);
  _db.pragma('journal_mode = WAL');
  _db.pragma('foreign_keys = ON');

  _db.exec(`
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

    CREATE INDEX IF NOT EXISTS idx_posts_published
      ON posts (draft, pub_date DESC);
  `);

  return _db;
}

export function normalizePost(row: BlogPostRow): BlogPost {
  return {
    ...row,
    tags: JSON.parse(row.tags) as string[],
    draft: row.draft === 1,
  };
}
