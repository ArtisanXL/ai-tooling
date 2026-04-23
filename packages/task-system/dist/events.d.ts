import type { Task, Execution } from '@ai-tooling/shared';
export type TaskEvent = {
    type: 'task:created';
    task: Task;
} | {
    type: 'task:claimed';
    task: Task;
    agentId: string;
} | {
    type: 'task:succeeded';
    task: Task;
    execution: Execution;
} | {
    type: 'task:failed';
    task: Task;
    error: Error;
} | {
    type: 'task:retried';
    task: Task;
    retryCount: number;
} | {
    type: 'task:dead-lettered';
    task: Task;
};
export type TaskEventHandler = (event: TaskEvent) => void | Promise<void>;
export interface TaskEventBus {
    emit(event: TaskEvent): Promise<void>;
    on(handler: TaskEventHandler): () => void;
}
export declare function createTaskEventBus(): TaskEventBus;
//# sourceMappingURL=events.d.ts.map