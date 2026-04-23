import type { DbClient } from '../client.js';
import type { Execution } from '@ai-tooling/shared';
export interface CreateExecutionInput {
    taskId: string;
    agentId: string;
    workspacePath: string;
    branchName: string;
}
export interface ExecutionRepository {
    create(input: CreateExecutionInput): Promise<Execution>;
    findById(id: string): Promise<Execution | undefined>;
    findByTaskId(taskId: string): Promise<Execution[]>;
    complete(id: string, commitSha?: string, prUrl?: string): Promise<void>;
    fail(id: string): Promise<void>;
    delete(id: string): Promise<void>;
}
export declare function createExecutionRepository(db: DbClient): ExecutionRepository;
//# sourceMappingURL=execution.repository.d.ts.map