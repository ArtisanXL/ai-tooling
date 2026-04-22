import type { ExecutionContext, DriverResult } from '@ai-tooling/ai-core';
import type { Task } from '@ai-tooling/shared';
import { BaseDriver } from './base-driver.js';
export declare class StubDriver extends BaseDriver {
    readonly provider = "stub";
    readonly model = "stub-v1";
    protected executeInternal(task: Task, _context: ExecutionContext): Promise<DriverResult>;
}
//# sourceMappingURL=stub-driver.d.ts.map