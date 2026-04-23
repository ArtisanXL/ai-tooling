import type { Task, StructuredPrompt } from '@ai-tooling/shared';
export interface PromptTemplateEngine {
    generate(task: Task): StructuredPrompt;
    render(structured: StructuredPrompt): string;
}
export declare function createPromptTemplateEngine(): PromptTemplateEngine;
//# sourceMappingURL=template.d.ts.map