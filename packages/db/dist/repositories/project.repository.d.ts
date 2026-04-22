import { type DbClient } from '../client.js';
import type { Project } from '@ai-tooling/shared';
export interface CreateProjectInput {
    name: string;
    repoUrl: string;
    defaultBranch?: string;
}
export interface ProjectRepository {
    create(input: CreateProjectInput): Promise<Project>;
    findById(id: string): Promise<Project | undefined>;
    findAll(): Promise<Project[]>;
    delete(id: string): Promise<void>;
}
export declare function createProjectRepository(db: DbClient): ProjectRepository;
//# sourceMappingURL=project.repository.d.ts.map