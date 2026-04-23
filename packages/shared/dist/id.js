import { randomUUID } from 'crypto';
export function generateId() {
    return randomUUID();
}
export function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 50);
}
//# sourceMappingURL=id.js.map