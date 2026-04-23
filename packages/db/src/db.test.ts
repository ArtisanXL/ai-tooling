import { describe, it, expect, beforeEach } from 'vitest';
import { createProjectRepository } from './repositories/project.repository.js';
import { createAgentRepository } from './repositories/agent.repository.js';
import { createTaskRepository } from './repositories/task.repository.js';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema.js';

function createTestDb() {
  const sqlite = new Database(':memory:');
  sqlite.pragma('foreign_keys = ON');
  const db = drizzle(sqlite, { schema });
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      repo_url TEXT NOT NULL,
      default_branch TEXT NOT NULL DEFAULT 'main',
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS agents (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      capabilities TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'idle',
      last_heartbeat_at INTEGER
    );
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL REFERENCES projects(id),
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      prompt TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      assigned_agent TEXT,
      priority INTEGER NOT NULL DEFAULT 100,
      retry_count INTEGER NOT NULL DEFAULT 0,
      max_retries INTEGER NOT NULL DEFAULT 3,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS executions (
      id TEXT PRIMARY KEY,
      task_id TEXT NOT NULL REFERENCES tasks(id),
      agent_id TEXT NOT NULL REFERENCES agents(id),
      workspace_path TEXT NOT NULL,
      branch_name TEXT NOT NULL,
      commit_sha TEXT,
      pr_url TEXT,
      status TEXT NOT NULL DEFAULT 'running',
      started_at INTEGER NOT NULL,
      ended_at INTEGER,
      duration_ms INTEGER
    );
    CREATE TABLE IF NOT EXISTS logs (
      id TEXT PRIMARY KEY,
      execution_id TEXT NOT NULL REFERENCES executions(id),
      level TEXT NOT NULL,
      message TEXT NOT NULL,
      metadata TEXT,
      created_at INTEGER NOT NULL
    );
  `);
  return db;
}

describe('ProjectRepository', () => {
  let db: ReturnType<typeof createTestDb>;
  let repo: ReturnType<typeof createProjectRepository>;

  beforeEach(() => {
    db = createTestDb();
    repo = createProjectRepository(db as any);
  });

  it('creates and retrieves a project', async () => {
    const project = await repo.create({ name: 'Test', repoUrl: 'https://github.com/x/y' });
    expect(project.name).toBe('Test');
    const found = await repo.findById(project.id);
    expect(found?.id).toBe(project.id);
  });

  it('returns undefined for unknown id', async () => {
    expect(await repo.findById('unknown')).toBeUndefined();
  });

  it('lists all projects', async () => {
    await repo.create({ name: 'A', repoUrl: 'https://a' });
    await repo.create({ name: 'B', repoUrl: 'https://b' });
    const all = await repo.findAll();
    expect(all.length).toBe(2);
  });
});

describe('TaskRepository', () => {
  let db: ReturnType<typeof createTestDb>;
  let projectRepo: ReturnType<typeof createProjectRepository>;
  let taskRepo: ReturnType<typeof createTaskRepository>;

  beforeEach(async () => {
    db = createTestDb();
    projectRepo = createProjectRepository(db as any);
    taskRepo = createTaskRepository(db as any);
  });

  it('creates and claims a task atomically', async () => {
    const proj = await projectRepo.create({ name: 'P', repoUrl: 'https://x' });
    const task = await taskRepo.create({ projectId: proj.id, title: 'T', description: 'D' });
    expect(task.status).toBe('pending');

    const agentId = 'agent-1';
    const claimed = await taskRepo.claimTask(task.id, agentId);
    expect(claimed).toBe(true);

    // Second claim should fail
    const claimed2 = await taskRepo.claimTask(task.id, 'agent-2');
    expect(claimed2).toBe(false);

    const updated = await taskRepo.findById(task.id);
    expect(updated?.status).toBe('running');
    expect(updated?.assignedAgent).toBe(agentId);
  });
});
