import { describe, it, expect } from 'vitest';
import { createAgentRegistry } from './registry.js';
import { ok } from '@ai-tooling/shared';
function mockRuntime(role) {
    return {
        role,
        capabilities: [{ name: role }],
        canHandle: () => true,
        execute: async (_task, _ctx) => ok({}),
        report: (_) => { },
    };
}
describe('AgentRegistry', () => {
    it('registers and retrieves by role', () => {
        const reg = createAgentRegistry();
        const runtime = mockRuntime('coder');
        reg.register(runtime);
        expect(reg.find('coder')).toBe(runtime);
    });
    it('lists all runtimes', () => {
        const reg = createAgentRegistry();
        reg.register(mockRuntime('coder'));
        reg.register(mockRuntime('tester'));
        expect(reg.list().length).toBe(2);
    });
    it('findCapable returns handlers for task', () => {
        const reg = createAgentRegistry();
        reg.register(mockRuntime('coder'));
        const capable = reg.findCapable({});
        expect(capable.length).toBe(1);
    });
});
//# sourceMappingURL=registry.test.js.map