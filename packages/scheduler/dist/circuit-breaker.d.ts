export type CircuitState = 'closed' | 'open' | 'half-open';
export interface CircuitBreakerOptions {
    failureThreshold: number;
    successThreshold: number;
    cooldownMs: number;
}
export interface CircuitBreaker {
    canCall(): boolean;
    recordSuccess(): void;
    recordFailure(): void;
    getState(): CircuitState;
}
export declare function createCircuitBreaker(options: CircuitBreakerOptions): CircuitBreaker;
//# sourceMappingURL=circuit-breaker.d.ts.map