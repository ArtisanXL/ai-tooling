import type { Logger } from '@ai-tooling/shared';
import type { AgentRuntime } from '@ai-tooling/ai-core';
import type { TaskRepository, ExecutionRepository } from '@ai-tooling/db';
import type { ConcurrencyTracker } from './throttle.js';
export interface SchedulerConfig {
    tickIntervalMs?: number;
    defaultTimeoutMs?: number;
    defaultTokenBudget?: number;
    logger?: Logger;
}
export interface Scheduler {
    tick(): Promise<void>;
    start(): () => void;
}
export declare function createScheduler(taskRepo: TaskRepository, executionRepo: ExecutionRepository, concurrency: ConcurrencyTracker, agents: AgentRuntime[], config?: SchedulerConfig): Scheduler;
//# sourceMappingURL=scheduler.d.ts.map