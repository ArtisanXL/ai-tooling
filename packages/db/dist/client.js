import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema.js';
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
export function createDb(dbPath) {
    const dir = dirname(dbPath);
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
    }
    const sqlite = new Database(dbPath);
    sqlite.pragma('journal_mode = WAL');
    sqlite.pragma('foreign_keys = ON');
    return drizzle(sqlite, { schema });
}
let _db;
export function getDb(dbPath) {
    if (!_db) {
        const path = dbPath ?? process.env['DB_PATH'] ?? './data/ai-tooling.db';
        _db = createDb(path);
    }
    return _db;
}
//# sourceMappingURL=client.js.map