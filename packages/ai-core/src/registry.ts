import type { AgentRuntime, AgentRegistry } from './contracts.js';
import type { Task, AgentRole } from '@ai-tooling/shared';

export function createAgentRegistry(): AgentRegistry {
  const registry = new Map<AgentRole, AgentRuntime>();

  return {
    register(runtime) {
      registry.set(runtime.role, runtime);
    },
    find(role) {
      return registry.get(role);
    },
    findCapable(task: Task) {
      return Array.from(registry.values()).filter((r) => r.canHandle(task));
    },
    list() {
      return Array.from(registry.values());
    },
  };
}
