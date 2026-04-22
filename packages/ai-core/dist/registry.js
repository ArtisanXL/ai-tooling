export function createAgentRegistry() {
    const registry = new Map();
    return {
        register(runtime) {
            registry.set(runtime.role, runtime);
        },
        find(role) {
            return registry.get(role);
        },
        findCapable(task) {
            return Array.from(registry.values()).filter((r) => r.canHandle(task));
        },
        list() {
            return Array.from(registry.values());
        },
    };
}
//# sourceMappingURL=registry.js.map