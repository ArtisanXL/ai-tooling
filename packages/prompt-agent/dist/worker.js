import { createLogger } from '@ai-tooling/shared';
import { createPromptTemplateEngine } from './template.js';
export function createPromptWorker(taskRepo, options = {}) {
    const log = options.logger ?? createLogger('prompt-agent');
    const engine = createPromptTemplateEngine();
    const pollIntervalMs = options.pollIntervalMs ?? 5_000;
    async function processOnce() {
        const tasks = await taskRepo.findPendingWithoutPrompt();
        let processed = 0;
        for (const task of tasks) {
            try {
                const structured = engine.generate(task);
                const rendered = engine.render(structured);
                await taskRepo.updatePrompt(task.id, rendered);
                log.info('Prompt generated', { taskId: task.id });
                processed++;
            }
            catch (error) {
                log.error('Prompt generation failed', { taskId: task.id, error: String(error) });
            }
        }
        return processed;
    }
    function start() {
        let running = true;
        let timer;
        async function loop() { if (!running)
            return; await processOnce(); if (running) {
            timer = setTimeout(loop, pollIntervalMs);
        } }
        void loop();
        return () => { running = false; clearTimeout(timer); };
    }
    return { processOnce, start };
}
//# sourceMappingURL=worker.js.map