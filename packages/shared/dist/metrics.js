export function createMetricsEmitter(logger) {
    return {
        emitTaskMetrics(metrics) {
            logger.info('task.metrics', {
                taskId: metrics.taskId,
                queueWaitMs: metrics.queueWaitMs,
                executionDurationMs: metrics.executionDurationMs,
                retryCount: metrics.retryCount,
                success: metrics.success,
            });
        },
        emitAgentMetrics(metrics) {
            logger.info('agent.metrics', {
                agentId: metrics.agentId,
                throughput: metrics.throughput,
                errorRate: metrics.errorRate,
                meanCompletionMs: metrics.meanCompletionMs,
            });
        },
        emitProviderMetrics(metrics) {
            logger.info('provider.metrics', {
                provider: metrics.provider,
                latencyMs: metrics.latencyMs,
                timeoutRatio: metrics.timeoutRatio,
                tokenUsage: metrics.tokenUsage,
            });
        },
    };
}
//# sourceMappingURL=metrics.js.map