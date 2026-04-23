import type { Task, AgentCapability, AgentRole, AgentMetrics, ProviderMetrics } from '@ai-tooling/shared';
import type { Result } from '@ai-tooling/shared';

export interface ExecutionContext {
  executionId: string;
  workspacePath: string;
  branchName: string;
  timeoutMs: number;
  tokenBudget: number;
  signal?: AbortSignal;
}

export interface DriverResult {
  output: string;
  tokensUsed: number;
  latencyMs: number;
  providerMetrics: ProviderMetrics;
}

export interface AIDriver {
  readonly provider: string;
  readonly model: string;
  run(task: Task, context: ExecutionContext): Promise<Result<DriverResult>>;
}

export interface AgentRuntime {
  readonly role: AgentRole;
  readonly capabilities: AgentCapability[];

  canHandle(task: Task): boolean;
  execute(task: Task, context: ExecutionContext): Promise<Result<DriverResult>>;
  report(metrics: AgentMetrics): void;
}

export interface AgentRegistry {
  register(runtime: AgentRuntime): void;
  find(role: AgentRole): AgentRuntime | undefined;
  findCapable(task: Task): AgentRuntime[];
  list(): AgentRuntime[];
}
