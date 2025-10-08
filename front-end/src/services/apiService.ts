import { Skill, CreateSkillRequest, GetSkillsResponse } from '../types/Skill';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8082';

class ApiError extends Error {
    status: number;
    body: string;

    constructor(status: number, body: string) {
        super(`HTTP ${status}: ${body}`);
        this.status = status;
        this.body = body;
    }
}

class ApiService {
    private async request<T = any>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;

        const headers: Record<string, string> = {
            ...(options.headers as Record<string, string>),
        };


        if (options.body) {
            headers['Content-Type'] = 'application/json';
        }

        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config: RequestInit = {
            ...options,
            headers,
        };

        const response = await fetch(url, config);

        if (!response.ok) {
            const errorText = await response.text();
            throw new ApiError(response.status, errorText);
        }

        if (response.status === 204) {
            return undefined as unknown as T;
        }

        return response.json();
    }

    async getSkills(): Promise<Skill[]> {
        const response = await this.request<GetSkillsResponse>('/skills');
        return response.skills;
    }

    async createSkill(skill: CreateSkillRequest): Promise<Skill> {
        return this.request<Skill>('/skills', {
            method: 'POST',
            body: JSON.stringify(skill),
        });
    }

    async updateSkill(skill: Skill): Promise<Skill> {
        return this.request<Skill>(`/skills/${skill.skillId}`, {
            method: 'PUT',
            body: JSON.stringify(skill),
        });
    }

    async deleteSkill(skillId: number): Promise<void> {
        await this.request<void>(`/skills/${skillId}`, {
            method: 'DELETE',
        });
    }

    async healthCheck(): Promise<{ status: string }> {
        return this.request<{ status: string }>('/health');
    }
}

export const apiService = new ApiService();
