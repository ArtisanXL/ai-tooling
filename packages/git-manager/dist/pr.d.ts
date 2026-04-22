export interface PullRequestOptions {
    repoOwner: string;
    repoName: string;
    branchName: string;
    defaultBranch: string;
    title: string;
    body: string;
    authToken: string;
}
export interface PullRequest {
    url: string;
    number: number;
}
export interface PrProvider {
    createPr(options: PullRequestOptions): Promise<PullRequest>;
}
export declare function createGitHubPrProvider(): PrProvider;
//# sourceMappingURL=pr.d.ts.map