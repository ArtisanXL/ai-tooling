import { mkdirSync, rmSync, existsSync } from 'fs';
import { join } from 'path';
export function provisionWorkspace(projectId, taskId, executionId, options = {}) {
    const tempRoot = options.tempRoot ?? '/tmp/agent-workspaces';
    const workspacePath = join(tempRoot, projectId, taskId, executionId);
    if (!existsSync(workspacePath)) {
        mkdirSync(workspacePath, { recursive: true });
    }
    return {
        projectId,
        taskId,
        executionId,
        path: workspacePath,
    };
}
export function cleanupWorkspace(workspace) {
    if (existsSync(workspace.path)) {
        rmSync(workspace.path, { recursive: true, force: true });
    }
}
//# sourceMappingURL=workspace.js.map