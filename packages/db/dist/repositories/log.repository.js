import { eq } from 'drizzle-orm';
import { logs } from '../schema.js';
import { generateId } from '@ai-tooling/shared';
function rowToLog(row) {
    return {
        id: row.id,
        executionId: row.executionId,
        level: row.level,
        message: row.message,
        metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
        createdAt: row.createdAt,
    };
}
export function createLogRepository(db) {
    return {
        async create(input) {
            const entry = {
                id: generateId(),
                executionId: input.executionId,
                level: input.level,
                message: input.message,
                metadata: input.metadata ? JSON.stringify(input.metadata) : null,
                createdAt: Date.now(),
            };
            await db.insert(logs).values(entry);
            return rowToLog(entry);
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
//# sourceMappingURL=log.repository.js.map