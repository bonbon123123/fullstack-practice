import React, { useState } from 'react';
import { CreateSkillRequest } from '../types/Skill';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useTranslation } from './LanguageProvider';

interface AddSkillFormProps {
    onSubmit: (skill: CreateSkillRequest) => Promise<void>;
    isLoading?: boolean;
}

export const AddSkillForm: React.FC<AddSkillFormProps> = ({
    onSubmit,
    isLoading = false
}) => {
    const { t } = useTranslation();

    const [formData, setFormData] = useState<CreateSkillRequest>({
        name: '',
        rate: 1,
    });
    const [errors, setErrors] = useState<{ name?: string; rate?: string }>({});

    const validateForm = (): boolean => {
        const newErrors: { name?: string; rate?: string } = {};

        if (!formData.name.trim()) {
            newErrors.name = t('error_name_required');
        } else if (formData.name.trim().length < 2) {
            newErrors.name = t('error_name_length');
        }

        if (formData.rate < 0 || formData.rate > 10) {
            newErrors.rate = t('error_rate_range');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await onSubmit(formData);
            setFormData({ name: '', rate: 1 });
            setErrors({});
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, name: e.target.value });
        if (errors.name) setErrors({ ...errors, name: undefined });
    };

    const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rate = parseInt(e.target.value, 10);
        setFormData({ ...formData, rate: isNaN(rate) ? 0 : rate });
        if (errors.rate) setErrors({ ...errors, rate: undefined });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                {t('add_skill')}
            </h2>

            <form onSubmit={handleSubmit}>
                <Input
                    label={t('skill_name')}
                    type="text"
                    value={formData.name}
                    onChange={handleNameChange}
                    error={errors.name}
                    placeholder={t('skill_name_placeholder')}
                    disabled={isLoading}
                />

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('skill_level')}
                    </label>
                    <div className="flex items-center space-x-4">
                        <input
                            type="range"
                            min="0"
                            max="10"
                            value={formData.rate}
                            onChange={handleRateChange}
                            disabled={isLoading}
                            className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="min-w-[3rem] text-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                {formData.rate}
                            </span>
                        </div>
                    </div>
                    {errors.rate && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.rate}</p>
                    )}
                </div>

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="min-w-[120px]"
                    >
                        {isLoading ? t('adding') : t('add_skill')}
                    </Button>
                </div>
            </form>
        </div>
    );
};
