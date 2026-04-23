export interface ConcurrencyConfig { globalMax: number; perProjectMax: number; }
export interface ConcurrencyTracker { canRun(projectId: string): boolean; acquire(projectId: string): void; release(projectId: string): void; globalCount(): number; }
export function createConcurrencyTracker(config: ConcurrencyConfig): ConcurrencyTracker {
  let globalCount = 0; const perProject = new Map<string, number>();
  return {
    canRun(projectId) { const current = perProject.get(projectId) ?? 0; return globalCount < config.globalMax && current < config.perProjectMax; },
    acquire(projectId) { globalCount++; perProject.set(projectId, (perProject.get(projectId) ?? 0) + 1); },
    release(projectId) { globalCount = Math.max(0, globalCount - 1); perProject.set(projectId, Math.max(0, (perProject.get(projectId) ?? 0) - 1)); },
    globalCount() { return globalCount; },
  };
}
