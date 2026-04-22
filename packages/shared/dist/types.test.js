import { describe, it, expect } from 'vitest';
import { ok, err, unwrap } from './result.js';
import { AppError, InfraError, TaskError } from './errors.js';
import { slugify } from './id.js';
describe('Result', () => {
    it('ok wraps value', () => {
        const r = ok(42);
        expect(r.ok).toBe(true);
        if (r.ok)
            expect(r.value).toBe(42);
    });
    it('err wraps error', () => {
        const r = err(new Error('fail'));
        expect(r.ok).toBe(false);
    });
    it('unwrap returns value on ok', () => {
        expect(unwrap(ok('hello'))).toBe('hello');
    });
    it('unwrap throws on err', () => {
        expect(() => unwrap(err(new Error('boom')))).toThrow('boom');
    });
});
describe('Errors', () => {
    it('AppError has code', () => {
        const e = new AppError('msg', 'MY_CODE');
        expect(e.code).toBe('MY_CODE');
    });
    it('InfraError is AppError', () => {
        expect(new InfraError('net')).toBeInstanceOf(AppError);
    });
    it('TaskError is AppError', () => {
        expect(new TaskError('task')).toBeInstanceOf(AppError);
    });
});
describe('slugify', () => {
    it('lowercases and replaces spaces', () => {
        expect(slugify('Hello World')).toBe('hello-world');
    });
    it('strips leading/trailing dashes', () => {
        expect(slugify('  --hello--  ')).toBe('hello');
    });
});
//# sourceMappingURL=types.test.js.map