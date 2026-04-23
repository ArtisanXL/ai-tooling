import type { AIDriver, ExecutionContext, DriverResult } from '@ai-tooling/ai-core';
import type { Task, Result } from '@ai-tooling/shared';
export declare abstract class BaseDriver implements AIDriver {
    abstract readonly provider: string;
    abstract readonly model: string;
    protected abstract executeInternal(task: Task, context: ExecutionContext): Promise<DriverResult>;
    run(task: Task, context: ExecutionContext): Promise<Result<DriverResult>>;
}
//# sourceMappingURL=base-driver.d.ts.map