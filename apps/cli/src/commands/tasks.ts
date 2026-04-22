import { Command } from 'commander';
import { getRepositories } from '../db-context.js';
export function tasksCommand(): Command {
  const cmd = new Command('tasks').description('Manage tasks');
  cmd.command('list').description('List all tasks').option('-s, --status <status>','Filter by status').action(async (opts) => { const { tasks } = getRepositories(); const all = opts.status ? await tasks.findByStatus(opts.status as 'pending'|'running'|'success'|'failed') : await tasks.findAll(); if (!all.length) { console.log('No tasks found.'); return; } for (const t of all) console.log(`  ${t.id}  [${t.status}]  ${t.title}`); });
  cmd.command('create').description('Create a new task').requiredOption('-p, --project-id <id>','Project ID').requiredOption('-t, --title <title>','Task title').requiredOption('-d, --description <desc>','Task description').option('--prompt <prompt>','Optional prompt').action(async (opts) => { const { tasks } = getRepositories(); const task = await tasks.create({ projectId: opts.projectId as string, title: opts.title as string, description: opts.description as string, prompt: opts.prompt as string|undefined }); console.log(`Created task: ${task.id}`); });
  cmd.command('retry').description('Retry a failed task').argument('<taskId>','Task ID').action(async (taskId: string) => { const { tasks } = getRepositories(); const task = await tasks.findById(taskId); if (!task) { console.error(`Task not found: ${taskId}`); process.exit(1); } await tasks.updateStatus(taskId, 'pending'); console.log(`Task ${taskId} requeued.`); });
  return cmd;
}
