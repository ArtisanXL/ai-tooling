import { Command } from 'commander';
import { getRepositories } from '../db-context.js';
export function dashboardCommand(): Command {
  const cmd = new Command('dashboard').description('Show system status dashboard');
  cmd.action(async () => {
    const { tasks, agents } = getRepositories();
    const [all, allAgents] = await Promise.all([tasks.findAll(), agents.findAll()]);
    console.log('─'.repeat(40));
    console.log('  AI Tooling — System Dashboard');
    console.log('─'.repeat(40));
    console.log(`  Tasks:   ${all.length}  Running: ${all.filter(t=>t.status==='running').length}  Pending: ${all.filter(t=>t.status==='pending').length}`);
    console.log(`  Success: ${all.filter(t=>t.status==='success').length}  Failed: ${all.filter(t=>t.status==='failed').length}`);
    console.log(`  Agents:  ${allAgents.filter(a=>a.status!=='offline').length} active`);
    console.log('─'.repeat(40));
  });
  return cmd;
}
