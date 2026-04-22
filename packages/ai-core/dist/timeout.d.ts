export declare function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label?: string): Promise<T>;
export declare function createAbortController(timeoutMs: number): {
    controller: AbortController;
    clear: () => void;
};
//# sourceMappingURL=timeout.d.ts.map