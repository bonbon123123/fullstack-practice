import React from 'react';
import { Skill } from '../types/Skill';
import { SkillCard } from './SkillCard';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface SkillsListProps {
    skills: Skill[];
    onDeleteSkill: (id: number) => void;
    isLoading?: boolean;
    deletingSkillId?: number;
}

export const SkillsList: React.FC<SkillsListProps> = ({
    skills,
    onDeleteSkill,
    isLoading = false,
    deletingSkillId
}) => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <LoadingSpinner size="lg" className="mx-auto mb-4" />
                    <p className="text-gray-600">Loading skills...</p>
                </div>
            </div>
        );
    }

    if (skills.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
                    <svg
                        className="h-6 w-6 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No skills
                </h3>
                <p className="text-gray-600">
                    Add your first skill using the form above.
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    Your Skills
                </h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {skills.length} {skills.length === 1 ? 'skill' : 'skills'}
                </span>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {skills.map((skill) => (
                    <SkillCard
                        key={skill.id}
                        skill={skill}
                        onDelete={onDeleteSkill}
                        isDeleting={deletingSkillId === skill.id}
                    />
                ))}
            </div>
        </div>
    );
};
