import { slugify } from '@ai-tooling/shared';

export interface BranchOptions {
  taskId: string;
  taskTitle: string;
  executionId?: string;
}

export function generateBranchName(options: BranchOptions): string {
  const slug = slugify(options.taskTitle);
  const base = `task/${options.taskId}-${slug}`;
  if (options.executionId) {
    return `${base}-${options.executionId.slice(0, 8)}`;
  }
  return base;
}

export function isDefaultBranch(branch: string, defaultBranch = 'main'): boolean {
  return branch === defaultBranch || branch === 'master';
}

export function assertNotDefaultBranch(branch: string, defaultBranch = 'main'): void {
  if (isDefaultBranch(branch, defaultBranch)) {
    throw new Error(`Direct writes to '${branch}' are not permitted. Use a task branch.`);
  }
}
