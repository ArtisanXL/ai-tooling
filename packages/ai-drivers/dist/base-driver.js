import { withTimeout } from '@ai-tooling/ai-core';
import { ok, err, InfraError } from '@ai-tooling/shared';
export class BaseDriver {
    async run(task, context) {
        try {
            const result = await withTimeout(this.executeInternal(task, context), context.timeoutMs, `${this.provider}/${this.model}`);
            return ok(result);
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('timed out')) {
                return err(new InfraError(`Provider timeout: ${error.message}`));
            }
            return err(error instanceof Error ? error : new Error(String(error)));
        }
    }
}
//# sourceMappingURL=base-driver.js.map