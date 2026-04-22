import { eq } from 'drizzle-orm';
import type { DbClient } from '../client.js';
import { logs } from '../schema.js';
import type { LogEntry, LogLevel } from '@ai-tooling/shared';
import { generateId } from '@ai-tooling/shared';

export interface CreateLogInput {
  executionId: string;
  level: LogLevel;
  message: string;
  metadata?: Record<string, unknown>;
}

export interface LogRepository {
  create(input: CreateLogInput): Promise<LogEntry>;
  findByExecutionId(executionId: string): Promise<LogEntry[]>;
  tailByExecutionId(executionId: string, limit?: number): Promise<LogEntry[]>;
}

function rowToLog(row: typeof logs.$inferSelect): LogEntry {
  return {
    id: row.id,
    executionId: row.executionId,
    level: row.level as LogLevel,
    message: row.message,
    metadata: row.metadata ? (JSON.parse(row.metadata) as Record<string, unknown>) : undefined,
    createdAt: row.createdAt,
  };
}

export function createLogRepository(db: DbClient): LogRepository {
  return {
    async create(input) {
      const entry: typeof logs.$inferInsert = {
        id: generateId(),
        executionId: input.executionId,
        level: input.level,
        message: input.message,
        metadata: input.metadata ? JSON.stringify(input.metadata) : null,
        createdAt: Date.now(),
      };
      await db.insert(logs).values(entry);
      return rowToLog(entry as typeof logs.$inferSelect);
    },
    async findByExecutionId(executionId) {
      const rows = await db.select().from(logs).where(eq(logs.executionId, executionId));
      return rows.map(rowToLog);
    },
    async tailByExecutionId(executionId, limit = 50) {
      const rows = await db
        .select()
        .from(logs)
        .where(eq(logs.executionId, executionId))
        .limit(limit);
      return rows.map(rowToLog);
    },
  };
}
