import { createLogger } from '@ai-tooling/shared';
import { createRetryPolicy } from './retry.js';
export function createQueueEngine(taskRepo, logger) {
    const log = logger ?? createLogger('queue-engine');
    const retryPolicy = createRetryPolicy();
    return {
        async claimNext(agentId) {
            const pending = await taskRepo.findPendingWithPrompt();
            if (pending.length === 0)
                return null;
            const sorted = pending.sort((a, b) => a.priority - b.priority);
            for (const task of sorted) {
                const claimed = await taskRepo.claimTask(task.id, agentId);
                if (claimed) {
                    log.info('Task claimed', { taskId: task.id, agentId });
                    return { ...task, status: 'running', assignedAgent: agentId };
                }
            }
            return null;
        },
        async markSuccess(taskId) {
            await taskRepo.updateStatus(taskId, 'success');
            log.info('Task succeeded', { taskId });
        },
        async markFailed(taskId, error) {
            const task = await taskRepo.findById(taskId);
            if (!task) {
                log.warn('Task not found on failure', { taskId });
                return;
            }
            const category = retryPolicy.classifyFailure(error);
            const shouldRetry = retryPolicy.shouldRetry(error, task.retryCount, task.maxRetries);
            if (shouldRetry) {
                const delayMs = retryPolicy.getDelayMs(task.retryCount);
                await taskRepo.incrementRetry(taskId);
                await taskRepo.updateStatus(taskId, 'pending');
                log.info('Task requeued for retry', { taskId, retryCount: task.retryCount + 1, delayMs, category });
            }
            else {
                await taskRepo.updateStatus(taskId, 'failed');
                log.warn('Task marked dead-letter', { taskId, retryCount: task.retryCount, category });
            }
        },
        async requeueWithBackoff(taskId, _delayMs) {
            await taskRepo.updateStatus(taskId, 'pending');
            log.info('Task requeued', { taskId });
        },
    };
}
//# sourceMappingURL=queue.js.map