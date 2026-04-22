// ─── Error Taxonomy ──────────────────────────────────────────────────────────
export class AppError extends Error {
    code;
    context;
    constructor(message, code, context) {
        super(message);
        this.code = code;
        this.context = context;
        this.name = 'AppError';
    }
}
export class InfraError extends AppError {
    constructor(message, context) {
        super(message, 'INFRA_ERROR', context);
        this.name = 'InfraError';
    }
}
export class TaskError extends AppError {
    constructor(message, context) {
        super(message, 'TASK_ERROR', context);
        this.name = 'TaskError';
    }
}
export class PolicyError extends AppError {
    constructor(message, context) {
        super(message, 'POLICY_ERROR', context);
        this.name = 'PolicyError';
    }
}
export class ValidationError extends AppError {
    constructor(message, context) {
        super(message, 'VALIDATION_ERROR', context);
        this.name = 'ValidationError';
    }
}
export class NotFoundError extends AppError {
    constructor(resource, id) {
        super(`${resource} not found: ${id}`, 'NOT_FOUND', { resource, id });
        this.name = 'NotFoundError';
    }
}
//# sourceMappingURL=errors.js.map