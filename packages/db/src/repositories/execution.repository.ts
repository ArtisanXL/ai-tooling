import { eq } from 'drizzle-orm';
import type { DbClient } from '../client.js';
import { executions } from '../schema.js';
import type { Execution, TaskStatus } from '@ai-tooling/shared';
import { generateId } from '@ai-tooling/shared';

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

function rowToExecution(row: typeof executions.$inferSelect): Execution {
  return {
    id: row.id,
    taskId: row.taskId,
    agentId: row.agentId,
    workspacePath: row.workspacePath,
    branchName: row.branchName,
    commitSha: row.commitSha ?? undefined,
    prUrl: row.prUrl ?? undefined,
    status: row.status as TaskStatus,
    startedAt: row.startedAt,
    endedAt: row.endedAt ?? undefined,
    durationMs: row.durationMs ?? undefined,
  };
}

export function createExecutionRepository(db: DbClient): ExecutionRepository {
  return {
    async create(input) {
      const now = Date.now();
      const execution: typeof executions.$inferInsert = {
        id: generateId(),
        taskId: input.taskId,
        agentId: input.agentId,
        workspacePath: input.workspacePath,
        branchName: input.branchName,
        status: 'running',
        startedAt: now,
      };
      await db.insert(executions).values(execution);
      return rowToExecution(execution as typeof executions.$inferSelect);
    },
    async findById(id) {
      const rows = await db.select().from(executions).where(eq(executions.id, id));
      return rows[0] ? rowToExecution(rows[0]) : undefined;
    },
    async findByTaskId(taskId) {
      const rows = await db.select().from(executions).where(eq(executions.taskId, taskId));
      return rows.map(rowToExecution);
    },
    async complete(id, commitSha, prUrl) {
      const now = Date.now();
      const existing = await db.select().from(executions).where(eq(executions.id, id));
      const startedAt = existing[0]?.startedAt ?? now;
      await db.update(executions).set({
        status: 'success',
        commitSha: commitSha ?? null,
        prUrl: prUrl ?? null,
        endedAt: now,
        durationMs: now - startedAt,
      }).where(eq(executions.id, id));
    },
    async fail(id) {
      const now = Date.now();
      const existing = await db.select().from(executions).where(eq(executions.id, id));
      const startedAt = existing[0]?.startedAt ?? now;
      await db.update(executions).set({
        status: 'failed',
        endedAt: now,
        durationMs: now - startedAt,
      }).where(eq(executions.id, id));
    },
    async delete(id) {
      await db.delete(executions).where(eq(executions.id, id));
    },
  };
}
