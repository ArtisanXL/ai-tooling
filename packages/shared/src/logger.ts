import type { LogLevel } from './types.js';

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

export function createLogger(prefix?: string): Logger {
  function log(level: LogLevel, message: string, context?: LogContext): void {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message: prefix ? `[${prefix}] ${message}` : message,
      ...context,
    };
    const output = JSON.stringify(entry);
    if (level === 'error') {
      console.error(output);
    } else {
      console.log(output);
    }
  }

  return {
    info: (msg, ctx) => log('info', msg, ctx),
    warn: (msg, ctx) => log('warn', msg, ctx),
    error: (msg, ctx) => log('error', msg, ctx),
  };
}
