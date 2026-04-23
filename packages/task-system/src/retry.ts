import type { FailureCategory } from '@ai-tooling/shared';
import { InfraError, PolicyError } from '@ai-tooling/shared';

export interface RetryPolicy {
  shouldRetry(error: Error, retryCount: number, maxRetries: number): boolean;
  getDelayMs(retryCount: number): number;
  classifyFailure(error: Error): FailureCategory;
}

export function createRetryPolicy(): RetryPolicy {
  const BASE_DELAY_MS = 1000;
  const MAX_DELAY_MS = 30_000;

  function classifyFailure(error: Error): FailureCategory {
    if (error instanceof InfraError) return 'infra';
    if (error instanceof PolicyError) return 'policy';
    return 'deterministic';
  }

  return {
    shouldRetry(error, retryCount, maxRetries) {
      if (retryCount >= maxRetries) return false;
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
