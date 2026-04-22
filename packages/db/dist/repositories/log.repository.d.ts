import type { DbClient } from '../client.js';
import type { LogEntry, LogLevel } from '@ai-tooling/shared';
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
export declare function createLogRepository(db: DbClient): LogRepository;
//# sourceMappingURL=log.repository.d.ts.map