import { describe, it, expect } from 'vitest';
import { createAgentRegistry } from './registry.js';
import type { AgentRuntime, ExecutionContext, DriverResult } from './contracts.js';
import type { Task, AgentCapability, AgentMetrics } from '@ai-tooling/shared';
import { ok } from '@ai-tooling/shared';

function mockRuntime(role: 'coder' | 'tester'): AgentRuntime {
  return {
    role,
    capabilities: [{ name: role }] as AgentCapability[],
    canHandle: () => true,
    execute: async (_task: Task, _ctx: ExecutionContext) => ok({} as DriverResult),
    report: (_: AgentMetrics) => {},
  };
}

describe('AgentRegistry', () => {
  it('registers and retrieves by role', () => {
    const reg = createAgentRegistry();
    const runtime = mockRuntime('coder');
    reg.register(runtime);
    expect(reg.find('coder')).toBe(runtime);
  });

  it('lists all runtimes', () => {
    const reg = createAgentRegistry();
    reg.register(mockRuntime('coder'));
    reg.register(mockRuntime('tester'));
    expect(reg.list().length).toBe(2);
  });

  it('findCapable returns handlers for task', () => {
    const reg = createAgentRegistry();
    reg.register(mockRuntime('coder'));
    const capable = reg.findCapable({} as Task);
    expect(capable.length).toBe(1);
  });
});
