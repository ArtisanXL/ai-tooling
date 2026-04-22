import type { AIDriver, ExecutionContext, DriverResult } from '@ai-tooling/ai-core';
import type { Task, Result } from '@ai-tooling/shared';
import { withTimeout } from '@ai-tooling/ai-core';
import { ok, err, InfraError } from '@ai-tooling/shared';

export abstract class BaseDriver implements AIDriver {
  abstract readonly provider: string;
  abstract readonly model: string;
  protected abstract executeInternal(task: Task, context: ExecutionContext): Promise<DriverResult>;

  async run(task: Task, context: ExecutionContext): Promise<Result<DriverResult>> {
    try {
      const result = await withTimeout(this.executeInternal(task, context), context.timeoutMs, `${this.provider}/${this.model}`);
      return ok(result);
    } catch (error) {
      if (error instanceof Error && error.message.includes('timed out')) {
        return err(new InfraError(`Provider timeout: ${error.message}`));
      }
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }
}
