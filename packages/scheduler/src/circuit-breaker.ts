export type CircuitState = 'closed' | 'open' | 'half-open';
export interface CircuitBreakerOptions { failureThreshold: number; successThreshold: number; cooldownMs: number; }
export interface CircuitBreaker { canCall(): boolean; recordSuccess(): void; recordFailure(): void; getState(): CircuitState; }
export function createCircuitBreaker(options: CircuitBreakerOptions): CircuitBreaker {
  let state: CircuitState = 'closed'; let failureCount = 0; let successCount = 0; let lastFailureAt = 0;
  return {
    canCall() { if (state === 'closed') return true; if (state === 'open') { if (Date.now() - lastFailureAt >= options.cooldownMs) { state = 'half-open'; return true; } return false; } return true; },
    recordSuccess() { failureCount = 0; if (state === 'half-open') { successCount++; if (successCount >= options.successThreshold) { state = 'closed'; successCount = 0; } } },
    recordFailure() { lastFailureAt = Date.now(); failureCount++; successCount = 0; if (failureCount >= options.failureThreshold) { state = 'open'; } },
    getState() { return state; },
  };
}
