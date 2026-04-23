import { type SimpleGit } from 'simple-git';
export interface GitContext {
    repoUrl: string;
    workspacePath: string;
    branchName: string;
    defaultBranch: string;
    authToken?: string;
}
export interface CommitResult {
    commitSha: string;
}
export interface GitOps {
    cloneAndBranch(ctx: GitContext): Promise<SimpleGit>;
    commitAll(git: SimpleGit, message: string, ctx: GitContext): Promise<CommitResult>;
    pushBranch(git: SimpleGit, ctx: GitContext): Promise<void>;
}
export declare function createGitOps(): GitOps;
//# sourceMappingURL=git-ops.d.ts.map