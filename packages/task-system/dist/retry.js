import { InfraError, PolicyError } from '@ai-tooling/shared';
export function createRetryPolicy() {
    const BASE_DELAY_MS = 1000;
    const MAX_DELAY_MS = 30_000;
    function classifyFailure(error) {
        if (error instanceof InfraError)
            return 'infra';
        if (error instanceof PolicyError)
            return 'policy';
        return 'deterministic';
    }
    return {
        shouldRetry(error, retryCount, maxRetries) {
            if (retryCount >= maxRetries)
                return false;
            const category = classifyFailure(error);
            return category === 'infra';
        },
        getDelayMs(retryCount) {
            const exponential = BASE_DELAY_MS * Math.pow(2, retryCount);
            const jitter = Math.random() * BASE_DELAY_MS;
            return Math.min(exponential + jitter, MAX_DELAY_MS);
        },
        classifyFailure,
    };
}
//# sourceMappingURL=retry.js.map