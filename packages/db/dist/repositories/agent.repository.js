import { eq } from 'drizzle-orm';
import { agents } from '../schema.js';
import { generateId } from '@ai-tooling/shared';
function rowToAgent(row) {
    return {
        id: row.id,
        name: row.name,
        role: row.role,
        capabilities: JSON.parse(row.capabilities),
        status: row.status,
        lastHeartbeatAt: row.lastHeartbeatAt ?? undefined,
    };
}
export function createAgentRepository(db) {
    return {
        async create(input) {
            const agent = {
                id: generateId(),
                name: input.name,
                role: input.role,
                capabilities: JSON.stringify(input.capabilities),
                status: 'idle',
                lastHeartbeatAt: Date.now(),
            };
            await db.insert(agents).values(agent);
            return rowToAgent(agent);
        },
        async findById(id) {
            const rows = await db.select().from(agents).where(eq(agents.id, id));
            return rows[0] ? rowToAgent(rows[0]) : undefined;
        },
        async findByStatus(status) {
            const rows = await db.select().from(agents).where(eq(agents.status, status));
            return rows.map(rowToAgent);
        },
        async findAll() {
            const rows = await db.select().from(agents);
            return rows.map(rowToAgent);
        },
        async updateStatus(id, status) {
            await db.update(agents).set({ status }).where(eq(agents.id, id));
        },
        async heartbeat(id) {
            await db.update(agents).set({ lastHeartbeatAt: Date.now() }).where(eq(agents.id, id));
        },
        async delete(id) {
            await db.delete(agents).where(eq(agents.id, id));
        },
    };
}
//# sourceMappingURL=agent.repository.js.map