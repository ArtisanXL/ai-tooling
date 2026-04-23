/**
 * Runtime capability interfaces for edge/Node boundary separation.
 * Edge-safe packages depend only on these interfaces, not on Node.js built-ins.
 */
/**
 * Node.js runtime capabilities factory.
 * Import only in Node.js packages — never in edge-safe shared code.
 */
export function createNodeCapabilities() {
    return {
        isEdge: false,
        fetch: { fetch: globalThis.fetch },
        process: {
            env: process.env,
            exit: (code) => process.exit(code),
            cwd: () => process.cwd(),
        },
    };
}
//# sourceMappingURL=runtime.js.map