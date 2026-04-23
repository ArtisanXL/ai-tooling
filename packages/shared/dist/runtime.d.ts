/**
 * Runtime capability interfaces for edge/Node boundary separation.
 * Edge-safe packages depend only on these interfaces, not on Node.js built-ins.
 */
export interface FileSystemAdapter {
    exists(path: string): boolean;
    readFile(path: string, encoding: 'utf-8'): string;
    writeFile(path: string, content: string): void;
    mkdir(path: string, options?: {
        recursive?: boolean;
    }): void;
    remove(path: string, options?: {
        recursive?: boolean;
        force?: boolean;
    }): void;
}
export interface ProcessAdapter {
    env: Record<string, string | undefined>;
    exit(code: number): never;
    cwd(): string;
}
export interface FetchAdapter {
    fetch(url: string, init?: RequestInit): Promise<Response>;
}
export interface RuntimeCapabilities {
    fs?: FileSystemAdapter;
    process?: ProcessAdapter;
    fetch: FetchAdapter;
    isEdge: boolean;
}
/**
 * Node.js runtime capabilities factory.
 * Import only in Node.js packages — never in edge-safe shared code.
 */
export declare function createNodeCapabilities(): RuntimeCapabilities;
//# sourceMappingURL=runtime.d.ts.map