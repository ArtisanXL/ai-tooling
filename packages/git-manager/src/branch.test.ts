import { describe, it, expect } from 'vitest';
import { generateBranchName, isDefaultBranch, assertNotDefaultBranch } from './branch.js';

describe('generateBranchName', () => {
  it('generates branch with task id and slug', () => {
    const name = generateBranchName({ taskId: 'abc123', taskTitle: 'Fix the login bug' });
    expect(name).toBe('task/abc123-fix-the-login-bug');
  });

  it('appends execution suffix when provided', () => {
    const name = generateBranchName({ taskId: 'abc', taskTitle: 'Test', executionId: 'exec-12345678' });
    expect(name).toContain('exec-123');
  });
});

describe('isDefaultBranch', () => {
  it('identifies main as default', () => {
    expect(isDefaultBranch('main')).toBe(true);
  });
  it('identifies master as default', () => {
    expect(isDefaultBranch('master')).toBe(true);
  });
  it('task branch is not default', () => {
    expect(isDefaultBranch('task/abc-slug')).toBe(false);
  });
});

describe('assertNotDefaultBranch', () => {
  it('throws on main', () => {
    expect(() => assertNotDefaultBranch('main')).toThrow();
  });
  it('does not throw on task branch', () => {
    expect(() => assertNotDefaultBranch('task/abc')).not.toThrow();
  });
});
