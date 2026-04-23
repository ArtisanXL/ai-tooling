import type { TaskMetrics, AgentMetrics, ProviderMetrics } from './types.js';
import type { Logger } from './logger.js';

export interface MetricsEmitter {
  emitTaskMetrics(metrics: TaskMetrics): void;
  emitAgentMetrics(metrics: AgentMetrics): void;
  emitProviderMetrics(metrics: ProviderMetrics): void;
}

export function createMetricsEmitter(logger: Logger): MetricsEmitter {
  return {
    emitTaskMetrics(metrics) {
      logger.info('task.metrics', {
        taskId: metrics.taskId,
        queueWaitMs: metrics.queueWaitMs,
        executionDurationMs: metrics.executionDurationMs,
        retryCount: metrics.retryCount,
        success: metrics.success,
      } as Record<string, unknown>);
    },
    emitAgentMetrics(metrics) {
      logger.info('agent.metrics', {
        agentId: metrics.agentId,
        throughput: metrics.throughput,
        errorRate: metrics.errorRate,
        meanCompletionMs: metrics.meanCompletionMs,
      } as Record<string, unknown>);
    },
    emitProviderMetrics(metrics) {
      logger.info('provider.metrics', {
        provider: metrics.provider,
        latencyMs: metrics.latencyMs,
        timeoutRatio: metrics.timeoutRatio,
        tokenUsage: metrics.tokenUsage,
      } as Record<string, unknown>);
    },
  };
}
