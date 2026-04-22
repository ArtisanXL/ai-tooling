export interface LogContext {
    taskId?: string;
    executionId?: string;
    agentId?: string;
    projectId?: string;
    [key: string]: unknown;
}
export interface Logger {
    info(message: string, context?: LogContext): void;
    warn(message: string, context?: LogContext): void;
    error(message: string, context?: LogContext): void;
}
export declare function createLogger(prefix?: string): Logger;
//# sourceMappingURL=logger.d.ts.map