export interface WorkspaceOptions {
    tempRoot?: string;
}
export interface Workspace {
    projectId: string;
    taskId: string;
    executionId: string;
    path: string;
}
export declare function provisionWorkspace(projectId: string, taskId: string, executionId: string, options?: WorkspaceOptions): Workspace;
export declare function cleanupWorkspace(workspace: Workspace): void;
//# sourceMappingURL=workspace.d.ts.map