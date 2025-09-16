import React from 'react';
import { Skill } from '../types/Skill';
import { SkillCard } from './SkillCard';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { useTranslation } from './LanguageProvider';

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
    const { t } = useTranslation();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <LoadingSpinner size="lg" className="mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-300">{t('loading_skills')}</p>
                </div>
            </div>
        );
    }

    if (skills.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                    <svg
                        className="h-6 w-6 text-gray-400 dark:text-gray-300"
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
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    {t('no_skills')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                    {t('add_first_skill')}
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {t('your_skills')}
                </h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {skills.length}{' '}
                    {skills.length === 1 ? t('skill_count_single') : t('skill_count_plural')}
                </span>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {skills.map((skill) => (
                    <SkillCard
                        key={skill.skillId}
                        skill={skill}
                        onDelete={onDeleteSkill}
                        isDeleting={deletingSkillId === skill.skillId}
                    />
                ))}
            </div>
        </div>
    );
};
