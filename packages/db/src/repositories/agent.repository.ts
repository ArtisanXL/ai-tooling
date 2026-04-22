import { eq } from 'drizzle-orm';
import type { DbClient } from '../client.js';
import { agents } from '../schema.js';
import type { Agent, AgentCapability, AgentRole, AgentStatus } from '@ai-tooling/shared';
import { generateId } from '@ai-tooling/shared';

export interface CreateAgentInput {
  name: string;
  role: AgentRole;
  capabilities: AgentCapability[];
}

export interface AgentRepository {
  create(input: CreateAgentInput): Promise<Agent>;
  findById(id: string): Promise<Agent | undefined>;
  findByStatus(status: AgentStatus): Promise<Agent[]>;
  findAll(): Promise<Agent[]>;
  updateStatus(id: string, status: AgentStatus): Promise<void>;
  heartbeat(id: string): Promise<void>;
  delete(id: string): Promise<void>;
}

function rowToAgent(row: typeof agents.$inferSelect): Agent {
  return {
    id: row.id,
    name: row.name,
    role: row.role as AgentRole,
    capabilities: JSON.parse(row.capabilities) as AgentCapability[],
    status: row.status as AgentStatus,
    lastHeartbeatAt: row.lastHeartbeatAt ?? undefined,
  };
}

export function createAgentRepository(db: DbClient): AgentRepository {
  return {
    async create(input) {
      const agent: typeof agents.$inferInsert = {
        id: generateId(),
        name: input.name,
        role: input.role,
        capabilities: JSON.stringify(input.capabilities),
        status: 'idle',
        lastHeartbeatAt: Date.now(),
      };
      await db.insert(agents).values(agent);
      return rowToAgent(agent as typeof agents.$inferSelect);
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
