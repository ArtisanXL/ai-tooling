import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema.js';
export type DbClient = ReturnType<typeof createDb>;
export declare function createDb(dbPath: string): ReturnType<typeof drizzle<typeof schema>>;
export declare function getDb(dbPath?: string): ReturnType<typeof createDb>;
//# sourceMappingURL=client.d.ts.map