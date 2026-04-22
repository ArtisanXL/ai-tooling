import type { TaskRepository } from '@ai-tooling/db';
import type { Logger } from '@ai-tooling/shared';
export interface PromptWorkerOptions {
    pollIntervalMs?: number;
    logger?: Logger;
}
export interface PromptWorker {
    processOnce(): Promise<number>;
    start(): () => void;
}
export declare function createPromptWorker(taskRepo: TaskRepository, options?: PromptWorkerOptions): PromptWorker;
//# sourceMappingURL=worker.d.ts.map