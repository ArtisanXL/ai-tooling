import type { ExecutionContext, DriverResult } from '@ai-tooling/ai-core';
import type { Task } from '@ai-tooling/shared';
import { BaseDriver } from './base-driver.js';
export interface OpenAIDriverOptions {
    apiKey: string;
    model?: string;
    baseUrl?: string;
}
export declare class OpenAIDriver extends BaseDriver {
    readonly provider = "openai";
    readonly model: string;
    private readonly apiKey;
    private readonly baseUrl;
    constructor(options: OpenAIDriverOptions);
    protected executeInternal(task: Task, context: ExecutionContext): Promise<DriverResult>;
}
//# sourceMappingURL=openai-driver.d.ts.map