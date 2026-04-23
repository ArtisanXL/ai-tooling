import type { Agent, AgentRole } from '@ai-tooling/shared';
import type { AgentRepository } from '@ai-tooling/db';
export interface AgentPool { getIdleAgent(role: AgentRole): Promise<Agent | undefined>; markBusy(agentId: string): Promise<void>; markIdle(agentId: string): Promise<void>; countActive(): Promise<number>; }
export function createAgentPool(agentRepo: AgentRepository): AgentPool {
  return {
    async getIdleAgent(role) { const idle = await agentRepo.findByStatus('idle'); return idle.find((a) => a.role === role); },
    async markBusy(agentId) { await agentRepo.updateStatus(agentId, 'busy'); },
    async markIdle(agentId) { await agentRepo.updateStatus(agentId, 'idle'); },
    async countActive() { const busy = await agentRepo.findByStatus('busy'); return busy.length; },
  };
}
