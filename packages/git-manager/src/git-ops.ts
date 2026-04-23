import { simpleGit, type SimpleGit } from 'simple-git';
import { InfraError } from '@ai-tooling/shared';
import { assertNotDefaultBranch } from './branch.js';

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

export function createGitOps(): GitOps {
  return {
    async cloneAndBranch(ctx) {
      assertNotDefaultBranch(ctx.branchName, ctx.defaultBranch);

      let repoUrl = ctx.repoUrl;
      if (ctx.authToken) {
        const url = new URL(repoUrl);
        url.username = 'x-access-token';
        url.password = ctx.authToken;
        repoUrl = url.toString();
      }

      try {
        const git = simpleGit();
        await git.clone(repoUrl, ctx.workspacePath, ['--depth', '1', '--branch', ctx.defaultBranch]);

        const repoGit = simpleGit(ctx.workspacePath);
        await repoGit.checkoutLocalBranch(ctx.branchName);
        return repoGit;
      } catch (error) {
        throw new InfraError(`Git clone/branch failed: ${String(error)}`, {
          repoUrl: ctx.repoUrl,
          branch: ctx.branchName,
        });
      }
    },

    async commitAll(git, message, ctx) {
      assertNotDefaultBranch(ctx.branchName, ctx.defaultBranch);
      try {
        await git.add('.');
        await git.commit(message);
        const log = await git.log({ maxCount: 1 });
        const commitSha = log.latest?.hash ?? '';
        return { commitSha };
      } catch (error) {
        throw new InfraError(`Git commit failed: ${String(error)}`);
      }
    },

    async pushBranch(git, ctx) {
      assertNotDefaultBranch(ctx.branchName, ctx.defaultBranch);
      try {
        await git.push('origin', ctx.branchName, ['--set-upstream']);
      } catch (error) {
        throw new InfraError(`Git push failed: ${String(error)}`);
      }
    },
  };
}
