export function createTaskEventBus() {
    const handlers = new Set();
    return {
        async emit(event) {
            for (const handler of handlers) {
                await handler(event);
            }
        },
        on(handler) {
            handlers.add(handler);
            return () => handlers.delete(handler);
        },
    };
}
//# sourceMappingURL=events.js.map