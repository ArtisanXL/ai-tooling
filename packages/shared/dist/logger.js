export function createLogger(prefix) {
    function log(level, message, context) {
        const entry = {
            timestamp: new Date().toISOString(),
            level,
            message: prefix ? `[${prefix}] ${message}` : message,
            ...context,
        };
        const output = JSON.stringify(entry);
        if (level === 'error') {
            console.error(output);
        }
        else {
            console.log(output);
        }
    }
    return {
        info: (msg, ctx) => log('info', msg, ctx),
        warn: (msg, ctx) => log('warn', msg, ctx),
        error: (msg, ctx) => log('error', msg, ctx),
    };
}
//# sourceMappingURL=logger.js.map