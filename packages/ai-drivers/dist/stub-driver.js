import { BaseDriver } from './base-driver.js';
export class StubDriver extends BaseDriver {
    provider = 'stub';
    model = 'stub-v1';
    async executeInternal(task, _context) {
        const latencyMs = 10;
        return { output: `[StubDriver] Executed task: ${task.title}`, tokensUsed: 0, latencyMs, providerMetrics: { provider: this.provider, latencyMs, timeoutRatio: 0, tokenUsage: 0 } };
    }
}
//# sourceMappingURL=stub-driver.js.map