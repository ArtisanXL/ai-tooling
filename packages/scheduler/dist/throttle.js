export function createConcurrencyTracker(config) {
    let globalCount = 0;
    const perProject = new Map();
    return {
        canRun(projectId) { const current = perProject.get(projectId) ?? 0; return globalCount < config.globalMax && current < config.perProjectMax; },
        acquire(projectId) { globalCount++; perProject.set(projectId, (perProject.get(projectId) ?? 0) + 1); },
        release(projectId) { globalCount = Math.max(0, globalCount - 1); perProject.set(projectId, Math.max(0, (perProject.get(projectId) ?? 0) - 1)); },
        globalCount() { return globalCount; },
    };
}
//# sourceMappingURL=throttle.js.map