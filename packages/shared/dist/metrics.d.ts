import type { TaskMetrics, AgentMetrics, ProviderMetrics } from './types.js';
import type { Logger } from './logger.js';
export interface MetricsEmitter {
    emitTaskMetrics(metrics: TaskMetrics): void;
    emitAgentMetrics(metrics: AgentMetrics): void;
    emitProviderMetrics(metrics: ProviderMetrics): void;
}
export declare function createMetricsEmitter(logger: Logger): MetricsEmitter;
//# sourceMappingURL=metrics.d.ts.map