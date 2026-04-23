import type { ExecutionContext, DriverResult } from '@ai-tooling/ai-core';
import type { Task } from '@ai-tooling/shared';
import { BaseDriver } from './base-driver.js';

export class StubDriver extends BaseDriver {
  readonly provider = 'stub';
  readonly model = 'stub-v1';
  protected async executeInternal(task: Task, _context: ExecutionContext): Promise<DriverResult> {
    const latencyMs = 10;
    return { output: `[StubDriver] Executed task: ${task.title}`, tokensUsed: 0, latencyMs, providerMetrics: { provider: this.provider, latencyMs, timeoutRatio: 0, tokenUsage: 0 } };
  }
}
