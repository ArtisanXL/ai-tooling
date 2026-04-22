import type { Task } from '@ai-tooling/shared';
import type { TaskRepository } from '@ai-tooling/db';
import type { Logger } from '@ai-tooling/shared';
export interface QueueEngine {
    claimNext(agentId: string): Promise<Task | null>;
    markSuccess(taskId: string): Promise<void>;
    markFailed(taskId: string, error: Error): Promise<void>;
    requeueWithBackoff(taskId: string, delayMs: number): Promise<void>;
}
export declare function createQueueEngine(taskRepo: TaskRepository, logger?: Logger): QueueEngine;
//# sourceMappingURL=queue.d.ts.map