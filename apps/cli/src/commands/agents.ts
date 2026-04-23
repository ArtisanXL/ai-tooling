import { Command } from 'commander';
import { getRepositories } from '../db-context.js';
export function agentsCommand(): Command {
  const cmd = new Command('agents').description('Manage agents');
  cmd.command('list').description('List all agents').action(async () => { const { agents } = getRepositories(); const all = await agents.findAll(); if (!all.length) { console.log('No agents found.'); return; } for (const a of all) console.log(`  ${a.id}  [${a.status}]  ${a.role}`); });
  return cmd;
}
