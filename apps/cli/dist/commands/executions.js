import { Command } from 'commander';
import { getRepositories } from '../db-context.js';
export function executionsCommand() {
    const cmd = new Command('executions').description('Monitor executions');
    cmd.command('tail').description('Tail logs for a task').requiredOption('--task <taskId>', 'Task ID').option('-n, --lines <count>', 'Number of lines', '50').action(async (opts) => {
        const { executions, logs } = getRepositories();
        const execs = await executions.findByTaskId(opts.task);
        if (!execs.length) {
            console.log('No executions found.');
            return;
        }
        const entries = await logs.tailByExecutionId(execs[execs.length - 1].id, parseInt(opts.lines, 10));
        for (const e of entries)
            console.log(`[${new Date(e.createdAt).toISOString()}] [${e.level.toUpperCase()}] ${e.message}`);
    });
    return cmd;
}
//# sourceMappingURL=executions.js.map