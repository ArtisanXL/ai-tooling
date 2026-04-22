export interface BranchOptions {
    taskId: string;
    taskTitle: string;
    executionId?: string;
}
export declare function generateBranchName(options: BranchOptions): string;
export declare function isDefaultBranch(branch: string, defaultBranch?: string): boolean;
export declare function assertNotDefaultBranch(branch: string, defaultBranch?: string): void;
//# sourceMappingURL=branch.d.ts.map