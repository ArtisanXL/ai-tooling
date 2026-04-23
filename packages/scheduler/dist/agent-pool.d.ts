import type { Agent, AgentRole } from '@ai-tooling/shared';
import type { AgentRepository } from '@ai-tooling/db';
export interface AgentPool {
    getIdleAgent(role: AgentRole): Promise<Agent | undefined>;
    markBusy(agentId: string): Promise<void>;
    markIdle(agentId: string): Promise<void>;
    countActive(): Promise<number>;
}
export declare function createAgentPool(agentRepo: AgentRepository): AgentPool;
//# sourceMappingURL=agent-pool.d.ts.map