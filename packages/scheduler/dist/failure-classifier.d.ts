import type { FailureCategory } from '@ai-tooling/shared';
export interface FailureClassification {
    category: FailureCategory;
    shouldRetry: boolean;
    message: string;
}
export declare function classifyFailure(error: Error, retryCount: number, maxRetries: number): FailureClassification;
//# sourceMappingURL=failure-classifier.d.ts.map