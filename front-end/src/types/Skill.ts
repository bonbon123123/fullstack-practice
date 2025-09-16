export interface Skill {
    id: number;
    name: string;
    rate: number;
}

export interface CreateSkillRequest {
    name: string;
    rate: number;
}

export interface GetSkillsResponse {
    skills: Skill[];
}