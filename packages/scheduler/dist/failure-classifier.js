import { InfraError, PolicyError } from '@ai-tooling/shared';
export function classifyFailure(error, retryCount, maxRetries) {
    if (error instanceof PolicyError)
        return { category: 'policy', shouldRetry: false, message: `Policy violation: ${error.message}` };
    if (error instanceof InfraError)
        return { category: 'infra', shouldRetry: retryCount < maxRetries, message: `Infrastructure failure: ${error.message}` };
    return { category: 'deterministic', shouldRetry: false, message: `Deterministic failure: ${error.message}` };
}
//# sourceMappingURL=failure-classifier.js.map