import React from 'react';
import { Skill } from '../types/Skill';
import { Button } from './ui/Button';
import { useTranslation } from './LanguageProvider';

interface SkillCardProps {
    skill: Skill;
    onDelete: (id: number) => void;
    isDeleting?: boolean;
}

export const SkillCard: React.FC<SkillCardProps> = ({
    skill,
    onDelete,
    isDeleting = false
}) => {
    const { t } = useTranslation();

    const getRatingColor = (rate: number) => {
        if (rate >= 8) return 'text-green-600 bg-green-100';
        if (rate >= 5) return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
    };

    const handleDelete = () => {
        if (window.confirm(t('confirm_delete_skill', { skillName: skill.name }))) {
            onDelete(skill.skillId);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800 flex-1">
                    {skill.name}
                </h3>
                <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRatingColor(skill.rate)}`}
                >
                    {skill.rate}/10
                </span>
            </div>

            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{t('skill_level')}</span>
                    <span className="text-sm font-medium text-gray-800">{skill.rate}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(skill.rate / 10) * 100}%` }}
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <Button
                    onClick={handleDelete}
                    variant="danger"
                    size="sm"
                    disabled={isDeleting}
                >
                    {isDeleting ? t('deleting') : t('delete')}
                </Button>
            </div>
        </div>
    );
};
