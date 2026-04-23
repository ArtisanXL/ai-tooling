import type { DbClient } from '../client.js';
import type { Task, TaskStatus } from '@ai-tooling/shared';
export interface CreateTaskInput {
    projectId: string;
    title: string;
    description: string;
    prompt?: string;
    priority?: number;
    maxRetries?: number;
}
export interface TaskRepository {
    create(input: CreateTaskInput): Promise<Task>;
    findById(id: string): Promise<Task | undefined>;
    findByStatus(status: TaskStatus): Promise<Task[]>;
    findPendingWithPrompt(): Promise<Task[]>;
    findPendingWithoutPrompt(): Promise<Task[]>;
    findAll(): Promise<Task[]>;
    updateStatus(id: string, status: TaskStatus, assignedAgent?: string): Promise<void>;
    updatePrompt(id: string, prompt: string): Promise<void>;
    incrementRetry(id: string): Promise<void>;
    claimTask(id: string, agentId: string): Promise<boolean>;
    delete(id: string): Promise<void>;
}
export declare function createTaskRepository(db: DbClient): TaskRepository;
//# sourceMappingURL=task.repository.d.ts.map