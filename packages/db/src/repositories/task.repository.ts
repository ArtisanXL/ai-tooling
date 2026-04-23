import { eq, and, sql } from 'drizzle-orm';
import type { DbClient } from '../client.js';
import { tasks } from '../schema.js';
import type { Task, TaskStatus } from '@ai-tooling/shared';
import { generateId } from '@ai-tooling/shared';

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

function rowToTask(row: typeof tasks.$inferSelect): Task {
  return {
    id: row.id,
    projectId: row.projectId,
    title: row.title,
    description: row.description,
    prompt: row.prompt ?? undefined,
    status: row.status as TaskStatus,
    assignedAgent: row.assignedAgent ?? undefined,
    priority: row.priority,
    retryCount: row.retryCount,
    maxRetries: row.maxRetries,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function createTaskRepository(db: DbClient): TaskRepository {
  return {
    async create(input) {
      const now = Date.now();
      const task: typeof tasks.$inferInsert = {
        id: generateId(),
        projectId: input.projectId,
        title: input.title,
        description: input.description,
        prompt: input.prompt,
        status: 'pending',
        priority: input.priority ?? 100,
        retryCount: 0,
        maxRetries: input.maxRetries ?? 3,
        createdAt: now,
        updatedAt: now,
      };
      await db.insert(tasks).values(task);
      return rowToTask(task as typeof tasks.$inferSelect);
    },
    async findById(id) {
      const rows = await db.select().from(tasks).where(eq(tasks.id, id));
      return rows[0] ? rowToTask(rows[0]) : undefined;
    },
    async findByStatus(status) {
      const rows = await db.select().from(tasks).where(eq(tasks.status, status));
      return rows.map(rowToTask);
    },
    async findPendingWithPrompt() {
      const rows = await db
        .select()
        .from(tasks)
        .where(and(eq(tasks.status, 'pending'), sql`${tasks.prompt} IS NOT NULL`));
      return rows.map(rowToTask);
    },
    async findPendingWithoutPrompt() {
      const rows = await db
        .select()
        .from(tasks)
        .where(and(eq(tasks.status, 'pending'), sql`${tasks.prompt} IS NULL`));
      return rows.map(rowToTask);
    },
    async findAll() {
      const rows = await db.select().from(tasks);
      return rows.map(rowToTask);
    },
    async updateStatus(id, status, assignedAgent) {
      await db
        .update(tasks)
        .set({ status, assignedAgent: assignedAgent, updatedAt: Date.now() })
        .where(eq(tasks.id, id));
    },
    async updatePrompt(id, prompt) {
      await db.update(tasks).set({ prompt, updatedAt: Date.now() }).where(eq(tasks.id, id));
    },
    async incrementRetry(id) {
      await db
        .update(tasks)
        .set({ retryCount: sql`${tasks.retryCount} + 1`, updatedAt: Date.now() })
        .where(eq(tasks.id, id));
    },
    async claimTask(id, agentId) {
      const result = await db
        .update(tasks)
        .set({ status: 'running', assignedAgent: agentId, updatedAt: Date.now() })
        .where(and(eq(tasks.id, id), eq(tasks.status, 'pending')));
      return ((result as unknown as { changes: number }).changes ?? 0) > 0;
    },
    async delete(id) {
      await db.delete(tasks).where(eq(tasks.id, id));
    },
  };
}
