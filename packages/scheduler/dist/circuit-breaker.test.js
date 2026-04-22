import { describe, it, expect } from 'vitest';
import { createCircuitBreaker } from './circuit-breaker.js';
describe('CircuitBreaker', () => {
    it('starts closed', () => { const cb = createCircuitBreaker({ failureThreshold: 3, successThreshold: 2, cooldownMs: 1000 }); expect(cb.getState()).toBe('closed'); expect(cb.canCall()).toBe(true); });
    it('opens after failure threshold', () => { const cb = createCircuitBreaker({ failureThreshold: 3, successThreshold: 2, cooldownMs: 1000 }); cb.recordFailure(); cb.recordFailure(); cb.recordFailure(); expect(cb.getState()).toBe('open'); expect(cb.canCall()).toBe(false); });
    it('closes after success threshold in half-open', async () => { const cb = createCircuitBreaker({ failureThreshold: 1, successThreshold: 1, cooldownMs: 1 }); cb.recordFailure(); await new Promise((r) => setTimeout(r, 5)); expect(cb.canCall()).toBe(true); cb.recordSuccess(); expect(cb.getState()).toBe('closed'); });
});
//# sourceMappingURL=circuit-breaker.test.js.map