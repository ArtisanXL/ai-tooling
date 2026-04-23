// ─── Domain Types ────────────────────────────────────────────────────────────

export type TaskStatus = 'pending' | 'running' | 'success' | 'failed';
export type AgentStatus = 'idle' | 'busy' | 'offline';
export type AgentRole =
  | 'coder'
  | 'tester'
  | 'reviewer'
  | 'prompt-agent'
  | 'ui-agent'
  | 'ux-agent';
export type LogLevel = 'info' | 'warn' | 'error';
export type FailureCategory = 'infra' | 'deterministic' | 'policy';

export interface Project {
  id: string;
  name: string;
  repoUrl: string;
  defaultBranch: string;
  createdAt: number;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  prompt?: string;
  status: TaskStatus;
  assignedAgent?: string;
  priority: number;
  retryCount: number;
  maxRetries: number;
  createdAt: number;
  updatedAt: number;
}

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  capabilities: AgentCapability[];
  status: AgentStatus;
  lastHeartbeatAt?: number;
}

export interface AgentCapability {
  name: string;
  version?: string;
}

export interface Execution {
  id: string;
  taskId: string;
  agentId: string;
  workspacePath: string;
  branchName: string;
  commitSha?: string;
  prUrl?: string;
  status: TaskStatus;
  startedAt: number;
  endedAt?: number;
  durationMs?: number;
}

export interface LogEntry {
  id: string;
  executionId: string;
  level: LogLevel;
  message: string;
  metadata?: Record<string, unknown>;
  createdAt: number;
}

// ─── Prompt Provenance ───────────────────────────────────────────────────────

export interface PromptProvenance {
  driver: string;
  model: string;
  version: string;
  generatedAt: number;
}

export interface StructuredPrompt {
  objective: string;
  context: string;
  constraints: string[];
  acceptanceCriteria: string[];
  outputFormat: string;
  provenance: PromptProvenance;
}

// ─── Metrics ─────────────────────────────────────────────────────────────────

export interface TaskMetrics {
  taskId: string;
  queueWaitMs: number;
  executionDurationMs: number;
  retryCount: number;
  success: boolean;
}

export interface AgentMetrics {
  agentId: string;
  throughput: number;
  errorRate: number;
  meanCompletionMs: number;
}

export interface ProviderMetrics {
  provider: string;
  latencyMs: number;
  timeoutRatio: number;
  tokenUsage: number;
}
