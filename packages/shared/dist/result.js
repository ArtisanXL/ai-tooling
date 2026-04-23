// ─── Result Envelope ─────────────────────────────────────────────────────────
export function ok(value) {
    return { ok: true, value };
}
export function err(error) {
    return { ok: false, error };
}
export function unwrap(result) {
    if (result.ok)
        return result.value;
    throw result.error;
}
//# sourceMappingURL=result.js.map