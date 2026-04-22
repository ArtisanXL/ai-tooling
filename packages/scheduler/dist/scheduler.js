import { createLogger, generateId } from '@ai-tooling/shared';
import { createQueueEngine } from '@ai-tooling/task-system';
import { classifyFailure } from './failure-classifier.js';
import { createCircuitBreaker } from './circuit-breaker.js';
export function createScheduler(taskRepo, executionRepo, concurrency, agents, config = {}) {
    const log = config.logger ?? createLogger('scheduler');
    const queueEngine = createQueueEngine(taskRepo, log);
    const breaker = createCircuitBreaker({ failureThreshold: 5, successThreshold: 2, cooldownMs: 30_000 });
    const tickIntervalMs = config.tickIntervalMs ?? 2_000;
    const defaultTimeoutMs = config.defaultTimeoutMs ?? 60_000;
    const defaultTokenBudget = config.defaultTokenBudget ?? 4096;
    async function dispatchTask(task) {
        const capable = agents.filter((a) => a.canHandle(task));
        if (capable.length === 0) {
            log.warn('No capable agents for task', { taskId: task.id });
            return;
        }
        if (!concurrency.canRun(task.projectId)) {
            return;
        }
        const agent = capable[0];
        const claimed = await taskRepo.claimTask(task.id, agent.role);
        if (!claimed)
            return;
        concurrency.acquire(task.projectId);
        const executionId = generateId();
        const workspacePath = `/tmp/agent-workspaces/${task.projectId}/${task.id}/${executionId}`;
        const branchName = `task/${task.id.slice(0, 8)}`;
        const execution = await executionRepo.create({ taskId: task.id, agentId: agent.role, workspacePath, branchName });
        setTimeout(async () => {
            try {
                if (!breaker.canCall())
                    throw new Error('Circuit breaker open');
                const result = await agent.execute(task, { executionId, workspacePath, branchName, timeoutMs: defaultTimeoutMs, tokenBudget: defaultTokenBudget });
                if (result.ok) {
                    await executionRepo.complete(execution.id);
                    await queueEngine.markSuccess(task.id);
                    breaker.recordSuccess();
                }
                else {
                    breaker.recordFailure();
                    const { shouldRetry } = classifyFailure(result.error, task.retryCount, task.maxRetries);
                    if (shouldRetry) {
                        await executionRepo.fail(execution.id);
                        await taskRepo.incrementRetry(task.id);
                        await taskRepo.updateStatus(task.id, 'pending');
                    }
                    else {
                        await executionRepo.fail(execution.id);
                        await queueEngine.markFailed(task.id, result.error);
                    }
                }
            }
            catch (e) {
                const error = e instanceof Error ? e : new Error(String(e));
                const taskData = await taskRepo.findById(task.id);
                const classification = classifyFailure(error, taskData?.retryCount ?? 0, taskData?.maxRetries ?? 3);
                log.error('Task execution error', { taskId: task.id, error: error.message, ...classification });
                await executionRepo.fail(execution.id);
                await queueEngine.markFailed(task.id, error);
                breaker.recordFailure();
            }
            finally {
                concurrency.release(task.projectId);
            }
        }, 0);
    }
    const scheduler = {
        async tick() { if (!breaker.canCall())
            return; const pending = await taskRepo.findPendingWithPrompt(); for (const task of pending) {
            await dispatchTask(task);
        } },
        start() {
            let running = true;
            let timer;
            async function loop() { if (!running)
                return; await scheduler.tick(); if (running)
                timer = setTimeout(loop, tickIntervalMs); }
            void scheduler.tick();
            timer = setTimeout(loop, tickIntervalMs);
            return () => { running = false; clearTimeout(timer); };
        },
    };
    return scheduler;
}
//# sourceMappingURL=scheduler.js.map