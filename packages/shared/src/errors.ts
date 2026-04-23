// ─── Error Taxonomy ──────────────────────────────────────────────────────────

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly context?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class InfraError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'INFRA_ERROR', context);
    this.name = 'InfraError';
  }
}

export class TaskError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'TASK_ERROR', context);
    this.name = 'TaskError';
  }
}

export class PolicyError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'POLICY_ERROR', context);
    this.name = 'PolicyError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', context);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(`${resource} not found: ${id}`, 'NOT_FOUND', { resource, id });
    this.name = 'NotFoundError';
  }
}
