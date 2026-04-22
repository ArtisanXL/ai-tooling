export declare class AppError extends Error {
    readonly code: string;
    readonly context?: Record<string, unknown> | undefined;
    constructor(message: string, code: string, context?: Record<string, unknown> | undefined);
}
export declare class InfraError extends AppError {
    constructor(message: string, context?: Record<string, unknown>);
}
export declare class TaskError extends AppError {
    constructor(message: string, context?: Record<string, unknown>);
}
export declare class PolicyError extends AppError {
    constructor(message: string, context?: Record<string, unknown>);
}
export declare class ValidationError extends AppError {
    constructor(message: string, context?: Record<string, unknown>);
}
export declare class NotFoundError extends AppError {
    constructor(resource: string, id: string);
}
//# sourceMappingURL=errors.d.ts.map