import type { DbClient } from '../client.js';
import type { Agent, AgentCapability, AgentRole, AgentStatus } from '@ai-tooling/shared';
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
export declare function createAgentRepository(db: DbClient): AgentRepository;
//# sourceMappingURL=agent.repository.d.ts.map