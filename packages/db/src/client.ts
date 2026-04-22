import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema.js';
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

export type DbClient = ReturnType<typeof createDb>;

export function createDb(dbPath: string): ReturnType<typeof drizzle<typeof schema>> {
  const dir = dirname(dbPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  const sqlite = new Database(dbPath);
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');
  return drizzle(sqlite, { schema });
}

let _db: ReturnType<typeof createDb> | undefined;

export function getDb(dbPath?: string): ReturnType<typeof createDb> {
  if (!_db) {
    const path = dbPath ?? process.env['DB_PATH'] ?? './data/ai-tooling.db';
    _db = createDb(path);
  }
  return _db;
}
