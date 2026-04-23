import { existsSync } from 'fs';
import { createDb } from './client.js';
import { runMigrations } from './migrate.js';
export async function bootstrapDb(dbPath) {
    const isNew = !existsSync(dbPath);
    if (isNew) {
        runMigrations(dbPath);
    }
    return createDb(dbPath);
}
//# sourceMappingURL=bootstrap.js.map