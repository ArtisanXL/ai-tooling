import { describe, it, expect } from 'vitest';
import { StubDriver } from './stub-driver.js';
import type { Task } from '@ai-tooling/shared';
import type { ExecutionContext } from '@ai-tooling/ai-core';
describe('StubDriver', () => {
  it('returns ok result', async () => {
    const driver = new StubDriver();
    const task = { id: 't1', title: 'Test task', prompt: 'do something' } as Task;
    const ctx: ExecutionContext = { executionId: 'e1', workspacePath: '/tmp/ws', branchName: 'task/t1', timeoutMs: 5000, tokenBudget: 1000 };
    const result = await driver.run(task, ctx);
    expect(result.ok).toBe(true);
    if (result.ok) { expect(result.value.output).toContain('Test task'); }
  });
});
