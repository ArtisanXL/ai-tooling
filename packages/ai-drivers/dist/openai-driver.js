import { InfraError } from '@ai-tooling/shared';
import { BaseDriver } from './base-driver.js';
export class OpenAIDriver extends BaseDriver {
    provider = 'openai';
    model;
    apiKey;
    baseUrl;
    constructor(options) { super(); this.apiKey = options.apiKey; this.model = options.model ?? 'gpt-4o'; this.baseUrl = options.baseUrl ?? 'https://api.openai.com/v1'; }
    async executeInternal(task, context) {
        const startMs = Date.now();
        const response = await fetch(`${this.baseUrl}/chat/completions`, { method: 'POST', headers: { Authorization: `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ model: this.model, messages: [{ role: 'user', content: task.prompt ?? task.description }], max_tokens: context.tokenBudget }), signal: context.signal });
        if (!response.ok) {
            const text = await response.text();
            throw new InfraError(`OpenAI API error (${response.status}): ${text}`);
        }
        const data = (await response.json());
        const latencyMs = Date.now() - startMs;
        const output = data.choices[0]?.message.content ?? '';
        const tokensUsed = data.usage?.total_tokens ?? 0;
        return { output, tokensUsed, latencyMs, providerMetrics: { provider: this.provider, latencyMs, timeoutRatio: 0, tokenUsage: tokensUsed } };
    }
}
//# sourceMappingURL=openai-driver.js.map