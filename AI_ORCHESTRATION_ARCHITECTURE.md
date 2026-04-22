# AI Agent Platform Roadmap

## 0) Target Outcomes and Non-Negotiables

- Multi-project, multi-task orchestration with concurrent AI agents.
- Strict Git-based isolation per task (branch + temp workspace).
- Prompt generation handled by a dedicated sequential prompt-agent.
- Runtime compatibility for Node.js and Cloudflare Workers-safe modules.
- SQLite + Drizzle as source of truth for tasks, agents, executions, logs, projects.
- PR-only integration path (no direct writes to main).

---

## 1) Monorepo Foundation (pnpm + TypeScript)

### What to build
- Initialize pnpm workspace and TypeScript project references.
- Create required app/package structure.
- Define shared build/test/lint conventions.

### Folder structure
```txt
root/
  apps/
    cli/
  packages/
    db/
    ai-core/
    ai-drivers/
    task-system/
    git-manager/
    prompt-agent/
    shared/
```

### Technical details
- Root `pnpm-workspace.yaml` includes `apps/*` and `packages/*`.
- Root `tsconfig.base.json` for strict TS settings, with per-package `tsconfig.json`.
- Use ESM + export maps in package manifests.
- `shared` package provides:
  - common types (`Task`, `Execution`, `AgentCapability`, `Project`)
  - runtime-safe utilities (no Node-only APIs in shared core)
  - error classes and result envelopes.

### Dependencies / order
1. Workspace config
2. TypeScript base config
3. Package scaffolds
4. Shared types and interfaces

---

## 2) Database & Drizzle Setup (SQLite)

### What to build
- `packages/db` with Drizzle schema, migrations, repository layer, and bootstrap.

### DB schema suggestions

#### `projects`
- `id TEXT PK`
- `name TEXT NOT NULL`
- `repo_url TEXT NOT NULL`
- `default_branch TEXT NOT NULL DEFAULT 'main'`
- `created_at INTEGER NOT NULL`

#### `tasks`
- `id TEXT PK`
- `project_id TEXT NOT NULL FK projects(id)`
- `title TEXT NOT NULL`
- `description TEXT NOT NULL`
- `prompt TEXT NULL`
- `status TEXT NOT NULL CHECK(status IN ('pending','running','success','failed'))`
- `assigned_agent TEXT NULL`
- `priority INTEGER NOT NULL DEFAULT 100`
- `retry_count INTEGER NOT NULL DEFAULT 0`
- `max_retries INTEGER NOT NULL DEFAULT 3`
- `created_at INTEGER NOT NULL`
- `updated_at INTEGER NOT NULL`

#### `agents`
- `id TEXT PK`
- `name TEXT NOT NULL`
- `role TEXT NOT NULL`
- `capabilities TEXT NOT NULL` (JSON)
- `status TEXT NOT NULL` (idle/busy/offline)
- `last_heartbeat_at INTEGER`

#### `executions`
- `id TEXT PK`
- `task_id TEXT NOT NULL FK tasks(id)`
- `agent_id TEXT NOT NULL FK agents(id)`
- `workspace_path TEXT NOT NULL`
- `branch_name TEXT NOT NULL`
- `commit_sha TEXT NULL`
- `pr_url TEXT NULL`
- `status TEXT NOT NULL`
- `started_at INTEGER NOT NULL`
- `ended_at INTEGER NULL`
- `duration_ms INTEGER NULL`

#### `logs`
- `id TEXT PK`
- `execution_id TEXT NOT NULL FK executions(id)`
- `level TEXT NOT NULL` (info/warn/error)
- `message TEXT NOT NULL`
- `metadata TEXT NULL` (JSON)
- `created_at INTEGER NOT NULL`

### Bootstrap behavior
```ts
if (!db.exists()) {
  createDatabase()
  runMigrations()
}
```

### Dependencies / order
1. Schema definitions
2. Migration generation and migration runner
3. Repository abstractions
4. DB bootstrap lifecycle

---

## 3) Task System (Queue + Retry + Status)

### What to build
- `packages/task-system` with task lifecycle orchestration.
- Queue-driven scheduler with retry and backoff.

### Task model
```ts
{
  id: string
  projectId: string
  title: string
  description: string
  prompt?: string
  status: "pending" | "running" | "success" | "failed"
  assignedAgent?: string
}
```

### Technical details
- Queue states: `pending -> running -> success|failed`.
- Retry strategy:
  - retry only transient failures
  - exponential backoff with jitter
  - dead-letter mark after `max_retries`.
- Idempotency key per task execution attempt to avoid duplicate run side effects.
- Task claiming should be transactional (`UPDATE ... WHERE status='pending'`) to prevent double assignment.

### Dependencies / order
1. Task repositories (DB)
2. Queue engine and claim logic
3. Retry policy and dead-letter semantics
4. Event emission hooks for observability

---

## 4) Git Isolation Layer (Conflict Prevention)

### What to build
- `packages/git-manager` responsible for branch/workspace lifecycle.

### Required workflow
```text
Task → Clone Repo → Create Branch → AI Work → Commit → Push → PR
```

### Isolation rules
- One task = one isolated temp workspace directory.
- One task = one dedicated branch (`task/<taskId>-<slug>`).
- Never reuse shared mutable directories.
- Never write directly to `main` or default branch.
- Merge only through PR checks and review gates.

### Technical details
- Workspace root: configurable temp root (`/tmp/agent-workspaces/<projectId>/<taskId>/...`).
- Safe git operations:
  - fetch + checkout default branch baseline
  - create branch from latest default branch
  - commit with task metadata in message
  - push branch, create PR through provider integration.
- Collision handling:
  - if branch exists, append deterministic suffix using execution id.

### Dependencies / order
1. Workspace provisioner
2. Branch orchestration
3. Commit/push abstraction
4. PR creation integration contract

---

## 5) AI Core + Extensible Agent Framework

### What to build
- `packages/ai-core` for agent runtime contracts and orchestrator APIs.
- `packages/ai-drivers` for provider implementations.

### Agent model
- Single-responsibility agent roles:
  - coder
  - tester
  - reviewer
  - prompt-agent
  - ui-agent
  - ux-agent
- Extensibility via role registry + capability matrix.

### Core interfaces
```ts
interface AIDriver {
  run(task: Task): Promise<Result>
}
```

### Technical details
- `AgentRuntime` contract:
  - `canHandle(task)`
  - `execute(task, context)`
  - `report(metrics, logs)`
- Driver adapter layer separates provider-specific prompt/tool semantics from task logic.
- Add timeout/cancellation and token budget controls per execution.

### Dependencies / order
1. Shared contracts and result envelope
2. Driver abstractions
3. Built-in role agents
4. Provider adapters (Copilot, OpenAI, local future)

---

## 6) Prompt Agent (Sequential Prompt Production)

### What to build
- `packages/prompt-agent` as a dedicated sequential worker.

### Critical behavior
```ts
if (!task.prompt) {
  generatePrompt(task)
}
```

### Technical details
- Polls/consumes only tasks missing prompt.
- Strict sequential execution (concurrency = 1) to ensure deterministic prompt quality and traceability.
- Produces structured prompt sections:
  - objective
  - context
  - constraints
  - acceptance criteria
  - output format.
- Writes prompt and provenance metadata (driver, model, version, timestamp) to DB.

### Dependencies / order
1. Missing-prompt task selector
2. Prompt template/policy engine
3. Sequential worker lock
4. Prompt persistence + audit log

---

## 7) Concurrent Multi-Agent Execution Engine

### What to build
- Scheduler enabling concurrent execution across tasks and agents.

### Concurrency model
- Parallelism scope:
  - same project: yes (different tasks)
  - different projects: yes
  - same task: optional sub-step parallelism, disabled initially for safety.
- Global and per-project concurrency caps.
- Agent-pool aware dispatching (capability + availability based).

### Dispatch algorithm (v1)
1. Fetch runnable tasks (`pending`, prompt-ready).
2. Filter by project throttles.
3. Match task required role to idle capable agent.
4. Atomically claim task and start execution.
5. Record execution row, stream logs, update status.

### Failure handling strategy
- Categorize failures:
  - infra (git/network/provider timeout)
  - deterministic task failure (validation/test fail)
  - policy failure (unsafe output).
- Infra failures retry with backoff.
- Deterministic failures marked failed with reviewer handoff.
- Circuit breaker on provider outage.

### Dependencies / order
1. Scheduler loop
2. Agent pool manager
3. Concurrency controls and rate limits
4. Failure classifier + retry matrix

---

## 8) CLI Application (`apps/cli`)

### What to build
- Operational CLI for live monitoring and basic control operations.

### Required output
```txt
Tasks: 25
Running: 3
Pending: 10
Success: 11
Failed: 1
Agents: 4 active
```

### CLI features
- Live dashboard:
  - pending/running/success/failed counts
  - active agents and currently assigned tasks
  - retry queue visibility.
- Commands:
  - `tasks:list`, `tasks:create`, `tasks:retry`
  - `agents:list`
  - `executions:tail --task <id>`
  - `projects:list`.
- Optional TUI mode for streaming updates.

### Dependencies / order
1. Read models from DB
2. Monitoring commands
3. Task control commands
4. Streaming/log tail improvements

---

## 9) Edge Compatibility (Node + Cloudflare Workers)

### What to build
- Runtime boundary model ensuring edge-safe core packages.

### Technical details
- Split modules:
  - edge-safe core (`shared`, parts of `ai-core`, task logic without Node APIs)
  - Node-only adapters (`git-manager`, filesystem, process execution).
- Replace Node-only globals in shared code with injected interfaces.
- Use `fetch`/Web APIs in portable layers.
- Keep SQLite and local git execution in Node runtime service; expose API/event endpoints usable by edge workers.

### Dependencies / order
1. Runtime capability interfaces
2. Adapter separation
3. Build targets and package export conditions
4. Compatibility tests (Node + worker stubs)

---

## 10) Observability, SLOs, and Operations

### What to build
- End-to-end tracing and metrics pipeline.

### Must track
- task duration
- agent performance
- failures
- retries

### Metrics model
- Per-task: queue wait time, execution duration, retry count, success rate.
- Per-agent: throughput, error rate, mean completion time.
- Per-provider: latency, timeout ratio, token usage.

### Logging and alerting
- Structured logs with execution/task correlation IDs.
- Alert thresholds:
  - failure rate spike
  - queue backlog growth
  - provider timeout surge.

### Dependencies / order
1. Structured logger in shared
2. Metrics emitters in task/execution paths
3. Dashboards and alerts
4. Runbooks for incident handling

---

## 11) End-to-End Execution Flow Diagram

```mermaid
flowchart TD
    A[Task Created] --> B{Prompt exists?}
    B -- No --> C[Prompt-Agent Queue\n(sequential)]
    C --> D[Prompt Generated + Saved]
    B -- Yes --> E[Ready Queue]
    D --> E
    E --> F[Scheduler Claims Task]
    F --> G[Assign Compatible Agent]
    G --> H[Git Manager: Clone + Branch + Workspace]
    H --> I[AI Driver Executes]
    I --> J[Test/Validation Step]
    J --> K{Success?}
    K -- Yes --> L[Commit + Push + PR]
    K -- No --> M{Retry allowed?}
    M -- Yes --> N[Backoff + Requeue]
    M -- No --> O[Mark Failed + Log]
    L --> P[Mark Success + Metrics]
```

---

## 12) Delivery Plan and Implementation Order

1. **Foundation**: workspace + TS + shared contracts.
2. **Data layer**: DB schema, migrations, repositories.
3. **Task engine**: queue lifecycle + retries + claiming.
4. **Git isolation**: workspace/branch/PR flow.
5. **AI platform**: core runtime + driver adapters.
6. **Prompt-agent**: sequential missing-prompt processor.
7. **Concurrent scheduler**: multi-agent dispatch + throttling.
8. **CLI**: live monitoring and operational controls.
9. **Edge hardening**: runtime boundaries + compatibility checks.
10. **Observability and reliability**: metrics, alerts, SLO guardrails.

---

## 13) Production Readiness Checklist

- [ ] Every task execution uses isolated branch + workspace.
- [ ] No direct write path to default branch exists.
- [ ] Prompt-agent processes missing-prompt tasks sequentially.
- [ ] Task claiming is atomic and race-safe.
- [ ] Retry policy separates transient vs deterministic failures.
- [ ] CLI exposes real-time operational state.
- [ ] Node/edge boundary is explicit and tested.
- [ ] Metrics/logging cover task, agent, provider, and queue health.
- [ ] PR-based merge workflow enforced with required checks.
