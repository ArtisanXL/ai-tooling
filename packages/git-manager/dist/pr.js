export function createGitHubPrProvider() {
    return {
        async createPr(options) {
            const url = `https://api.github.com/repos/${options.repoOwner}/${options.repoName}/pulls`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${options.authToken}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/vnd.github+json',
                },
                body: JSON.stringify({
                    title: options.title,
                    body: options.body,
                    head: options.branchName,
                    base: options.defaultBranch,
                }),
            });
            if (!response.ok) {
                const text = await response.text();
                throw new Error(`GitHub PR creation failed (${response.status}): ${text}`);
            }
            const data = (await response.json());
            return { url: data.html_url, number: data.number };
        },
    };
}
//# sourceMappingURL=pr.js.map