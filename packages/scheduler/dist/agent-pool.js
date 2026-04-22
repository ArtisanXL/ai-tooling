export function createAgentPool(agentRepo) {
    return {
        async getIdleAgent(role) { const idle = await agentRepo.findByStatus('idle'); return idle.find((a) => a.role === role); },
        async markBusy(agentId) { await agentRepo.updateStatus(agentId, 'busy'); },
        async markIdle(agentId) { await agentRepo.updateStatus(agentId, 'idle'); },
        async countActive() { const busy = await agentRepo.findByStatus('busy'); return busy.length; },
    };
}
//# sourceMappingURL=agent-pool.js.map