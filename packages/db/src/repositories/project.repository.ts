import { eq } from 'drizzle-orm';
import { type DbClient } from '../client.js';
import { projects } from '../schema.js';
import type { Project } from '@ai-tooling/shared';
import { generateId } from '@ai-tooling/shared';

export interface CreateProjectInput {
  name: string;
  repoUrl: string;
  defaultBranch?: string;
}

export interface ProjectRepository {
  create(input: CreateProjectInput): Promise<Project>;
  findById(id: string): Promise<Project | undefined>;
  findAll(): Promise<Project[]>;
  delete(id: string): Promise<void>;
}

export function createProjectRepository(db: DbClient): ProjectRepository {
  return {
    async create(input) {
      const now = Date.now();
      const project: typeof projects.$inferInsert = {
        id: generateId(),
        name: input.name,
        repoUrl: input.repoUrl,
        defaultBranch: input.defaultBranch ?? 'main',
        createdAt: now,
      };
      await db.insert(projects).values(project);
      return {
        id: project.id,
        name: project.name,
        repoUrl: project.repoUrl,
        defaultBranch: project.defaultBranch!,
        createdAt: project.createdAt,
      };
    },
    async findById(id) {
      const rows = await db.select().from(projects).where(eq(projects.id, id));
      const row = rows[0];
      if (!row) return undefined;
      return {
        id: row.id,
        name: row.name,
        repoUrl: row.repoUrl,
        defaultBranch: row.defaultBranch,
        createdAt: row.createdAt,
      };
    },
    async findAll() {
      const rows = await db.select().from(projects);
      return rows.map((row) => ({
        id: row.id,
        name: row.name,
        repoUrl: row.repoUrl,
        defaultBranch: row.defaultBranch,
        createdAt: row.createdAt,
      }));
    },
    async delete(id) {
      await db.delete(projects).where(eq(projects.id, id));
    },
  };
}
