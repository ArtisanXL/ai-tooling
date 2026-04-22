import { mkdirSync, rmSync, existsSync } from 'fs';
import { join } from 'path';

export interface WorkspaceOptions {
  tempRoot?: string;
}

export interface Workspace {
  projectId: string;
  taskId: string;
  executionId: string;
  path: string;
}

export function provisionWorkspace(
  projectId: string,
  taskId: string,
  executionId: string,
  options: WorkspaceOptions = {},
): Workspace {
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

export function cleanupWorkspace(workspace: Workspace): void {
  if (existsSync(workspace.path)) {
    rmSync(workspace.path, { recursive: true, force: true });
  }
}
