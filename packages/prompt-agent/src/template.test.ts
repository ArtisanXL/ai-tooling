import { describe, it, expect } from 'vitest';
import { createPromptTemplateEngine } from './template.js';
import type { Task } from '@ai-tooling/shared';
const mockTask: Task = { id: 't1', projectId: 'p1', title: 'Add login feature', description: 'Implement JWT-based login endpoint', status: 'pending', priority: 100, retryCount: 0, maxRetries: 3, createdAt: Date.now(), updatedAt: Date.now() };
describe('PromptTemplateEngine', () => {
  const engine = createPromptTemplateEngine();
  it('generates structured prompt with all sections', () => {
    const prompt = engine.generate(mockTask);
    expect(prompt.objective).toContain('Add login feature');
    expect(prompt.context).toBe(mockTask.description);
    expect(prompt.constraints.length).toBeGreaterThan(0);
    expect(prompt.provenance.driver).toBe('template');
  });
  it('renders to markdown string', () => {
    const rendered = engine.render(engine.generate(mockTask));
    expect(rendered).toContain('## Objective');
    expect(rendered).toContain('## Constraints');
  });
});
