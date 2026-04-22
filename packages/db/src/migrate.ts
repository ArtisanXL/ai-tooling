import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function runMigrations(dbPath: string): void {
  const dir = dirname(dbPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  const sqlite = new Database(dbPath);
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');
  const db = drizzle(sqlite);
  const migrationsFolder = join(__dirname, '../drizzle');
  migrate(db, { migrationsFolder });
  sqlite.close();
}

// Bootstrap: run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dbPath = process.env['DB_PATH'] ?? './data/ai-tooling.db';
  runMigrations(dbPath);
  console.log('Migrations complete');
}
