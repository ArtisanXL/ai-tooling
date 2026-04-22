import { getDb, createProjectRepository, createAgentRepository, createTaskRepository, createExecutionRepository, createLogRepository } from '@ai-tooling/db';
export function getRepositories() {
  const db = getDb();
  return { projects: createProjectRepository(db), agents: createAgentRepository(db), tasks: createTaskRepository(db), executions: createExecutionRepository(db), logs: createLogRepository(db) };
}
