#!/usr/bin/env node
import { Command } from 'commander';
import { projectsCommand } from './commands/projects.js';
import { tasksCommand } from './commands/tasks.js';
import { agentsCommand } from './commands/agents.js';
import { executionsCommand } from './commands/executions.js';
import { dashboardCommand } from './commands/dashboard.js';
const program = new Command();
program.name('ai-tooling').description('AI Orchestration Platform CLI').version('0.1.0');
program.addCommand(dashboardCommand());
program.addCommand(projectsCommand());
program.addCommand(tasksCommand());
program.addCommand(agentsCommand());
program.addCommand(executionsCommand());
program.parseAsync(process.argv).catch((err: unknown) => { console.error('CLI error:', err); process.exit(1); });
