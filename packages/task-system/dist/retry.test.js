import { describe, it, expect } from 'vitest';
import { createRetryPolicy } from './retry.js';
import { InfraError, PolicyError, TaskError } from '@ai-tooling/shared';
describe('RetryPolicy', () => {
    const policy = createRetryPolicy();
    it('retries infra errors within max', () => {
        expect(policy.shouldRetry(new InfraError('net'), 0, 3)).toBe(true);
        expect(policy.shouldRetry(new InfraError('net'), 2, 3)).toBe(true);
        expect(policy.shouldRetry(new InfraError('net'), 3, 3)).toBe(false);
    });
    it('does not retry deterministic errors', () => {
        expect(policy.shouldRetry(new TaskError('test fail'), 0, 3)).toBe(false);
    });
    it('does not retry policy errors', () => {
        expect(policy.shouldRetry(new PolicyError('unsafe'), 0, 3)).toBe(false);
    });
    it('classifies errors correctly', () => {
        expect(policy.classifyFailure(new InfraError('x'))).toBe('infra');
        expect(policy.classifyFailure(new PolicyError('x'))).toBe('policy');
        expect(policy.classifyFailure(new TaskError('x'))).toBe('deterministic');
        expect(policy.classifyFailure(new Error('generic'))).toBe('deterministic');
    });
    it('returns positive delay values with backoff', () => {
        const d0 = policy.getDelayMs(0);
        const d1 = policy.getDelayMs(1);
        const d2 = policy.getDelayMs(2);
        expect(d0).toBeGreaterThan(0);
        expect(d1).toBeGreaterThan(0);
        expect(d2).toBeGreaterThan(0);
        expect(d0).toBeLessThanOrEqual(30000);
        expect(d1).toBeLessThanOrEqual(30000);
        expect(d2).toBeLessThanOrEqual(30000);
    });
});
//# sourceMappingURL=retry.test.js.map