import type { FailureCategory } from '@ai-tooling/shared';
export interface RetryPolicy {
    shouldRetry(error: Error, retryCount: number, maxRetries: number): boolean;
    getDelayMs(retryCount: number): number;
    classifyFailure(error: Error): FailureCategory;
}
export declare function createRetryPolicy(): RetryPolicy;
//# sourceMappingURL=retry.d.ts.map