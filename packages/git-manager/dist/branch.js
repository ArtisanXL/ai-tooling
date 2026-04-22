import { slugify } from '@ai-tooling/shared';
export function generateBranchName(options) {
    const slug = slugify(options.taskTitle);
    const base = `task/${options.taskId}-${slug}`;
    if (options.executionId) {
        return `${base}-${options.executionId.slice(0, 8)}`;
    }
    return base;
}
export function isDefaultBranch(branch, defaultBranch = 'main') {
    return branch === defaultBranch || branch === 'master';
}
export function assertNotDefaultBranch(branch, defaultBranch = 'main') {
    if (isDefaultBranch(branch, defaultBranch)) {
        throw new Error(`Direct writes to '${branch}' are not permitted. Use a task branch.`);
    }
}
//# sourceMappingURL=branch.js.map