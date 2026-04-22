export interface ConcurrencyConfig {
    globalMax: number;
    perProjectMax: number;
}
export interface ConcurrencyTracker {
    canRun(projectId: string): boolean;
    acquire(projectId: string): void;
    release(projectId: string): void;
    globalCount(): number;
}
export declare function createConcurrencyTracker(config: ConcurrencyConfig): ConcurrencyTracker;
//# sourceMappingURL=throttle.d.ts.map