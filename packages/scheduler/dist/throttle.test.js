import { describe, it, expect } from 'vitest';
import { createConcurrencyTracker } from './throttle.js';
describe('ConcurrencyTracker', () => {
    it('allows runs within limits', () => { expect(createConcurrencyTracker({ globalMax: 5, perProjectMax: 2 }).canRun('p1')).toBe(true); });
    it('blocks when global limit reached', () => { const t = createConcurrencyTracker({ globalMax: 2, perProjectMax: 5 }); t.acquire('p1'); t.acquire('p2'); expect(t.canRun('p3')).toBe(false); });
    it('blocks when per-project limit reached', () => { const t = createConcurrencyTracker({ globalMax: 10, perProjectMax: 1 }); t.acquire('p1'); expect(t.canRun('p1')).toBe(false); expect(t.canRun('p2')).toBe(true); });
    it('releases slots', () => { const t = createConcurrencyTracker({ globalMax: 1, perProjectMax: 1 }); t.acquire('p1'); expect(t.canRun('p1')).toBe(false); t.release('p1'); expect(t.canRun('p1')).toBe(true); });
});
//# sourceMappingURL=throttle.test.js.map