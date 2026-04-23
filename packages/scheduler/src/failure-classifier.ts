import type { FailureCategory } from '@ai-tooling/shared';
import { InfraError, PolicyError } from '@ai-tooling/shared';
export interface FailureClassification { category: FailureCategory; shouldRetry: boolean; message: string; }
export function classifyFailure(error: Error, retryCount: number, maxRetries: number): FailureClassification {
  if (error instanceof PolicyError) return { category: 'policy', shouldRetry: false, message: `Policy violation: ${error.message}` };
  if (error instanceof InfraError) return { category: 'infra', shouldRetry: retryCount < maxRetries, message: `Infrastructure failure: ${error.message}` };
  return { category: 'deterministic', shouldRetry: false, message: `Deterministic failure: ${error.message}` };
}
