export function createPromptTemplateEngine() {
    return {
        generate(task) {
            return { objective: `Complete the following task: ${task.title}`, context: task.description, constraints: ['Follow existing code conventions.', 'Write tests for any new functionality.', 'Do not break existing tests.', 'Keep changes minimal and focused on the task.'], acceptanceCriteria: [`The task "${task.title}" is fully implemented.`, 'All existing tests pass.', 'New code is covered by tests.'], outputFormat: 'Provide a complete, working implementation. Include file changes, a summary of what was done, and any relevant notes.', provenance: { driver: 'template', model: 'v1', version: '1.0.0', generatedAt: Date.now() } };
        },
        render(structured) {
            return [`## Objective\n${structured.objective}`, `## Context\n${structured.context}`, `## Constraints\n${structured.constraints.map((c) => `- ${c}`).join('\n')}`, `## Acceptance Criteria\n${structured.acceptanceCriteria.map((c) => `- ${c}`).join('\n')}`, `## Output Format\n${structured.outputFormat}`].join('\n\n');
        },
    };
}
//# sourceMappingURL=template.js.map