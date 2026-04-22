import { Command } from 'commander';
import { getRepositories } from '../db-context.js';
export function projectsCommand(): Command {
  const cmd = new Command('projects').description('Manage projects');
  cmd.command('list').description('List all projects').action(async () => { const { projects } = getRepositories(); const all = await projects.findAll(); if (!all.length) { console.log('No projects found.'); return; } for (const p of all) console.log(`  ${p.id}  ${p.name}  ${p.repoUrl}`); });
  cmd.command('create').description('Create a new project').requiredOption('-n, --name <name>','Project name').requiredOption('-r, --repo-url <url>','Repository URL').option('-b, --default-branch <branch>','Default branch','main').action(async (opts) => { const { projects } = getRepositories(); const project = await projects.create({ name: opts.name as string, repoUrl: opts.repoUrl as string, defaultBranch: opts.defaultBranch as string }); console.log(`Created project: ${project.id}`); });
  return cmd;
}
