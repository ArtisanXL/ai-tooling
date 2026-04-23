import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  repoUrl: text('repo_url').notNull(),
  defaultBranch: text('default_branch').notNull().default('main'),
  createdAt: integer('created_at').notNull(),
});

export const agents = sqliteTable('agents', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  capabilities: text('capabilities').notNull(),
  status: text('status').notNull().default('idle'),
  lastHeartbeatAt: integer('last_heartbeat_at'),
});

export const tasks = sqliteTable('tasks', {
  id: text('id').primaryKey(),
  projectId: text('project_id')
    .notNull()
    .references(() => projects.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  prompt: text('prompt'),
  status: text('status').notNull().default('pending'),
  assignedAgent: text('assigned_agent'),
  priority: integer('priority').notNull().default(100),
  retryCount: integer('retry_count').notNull().default(0),
  maxRetries: integer('max_retries').notNull().default(3),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export const executions = sqliteTable('executions', {
  id: text('id').primaryKey(),
  taskId: text('task_id')
    .notNull()
    .references(() => tasks.id),
  agentId: text('agent_id')
    .notNull()
    .references(() => agents.id),
  workspacePath: text('workspace_path').notNull(),
  branchName: text('branch_name').notNull(),
  commitSha: text('commit_sha'),
  prUrl: text('pr_url'),
  status: text('status').notNull().default('running'),
  startedAt: integer('started_at').notNull(),
  endedAt: integer('ended_at'),
  durationMs: integer('duration_ms'),
});

export const logs = sqliteTable('logs', {
  id: text('id').primaryKey(),
  executionId: text('execution_id')
    .notNull()
    .references(() => executions.id),
  level: text('level').notNull(),
  message: text('message').notNull(),
  metadata: text('metadata'),
  createdAt: integer('created_at').notNull(),
});
